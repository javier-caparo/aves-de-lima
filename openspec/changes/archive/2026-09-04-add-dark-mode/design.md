# Design: add-dark-mode

## Context

The Article IV semantic tokens (`surface`, `canvas`, `foreground`, `muted`, `brand`, `brand-strong`, `danger`, `danger-light`, `success`, `warning`) live in a Tailwind v4 `@theme` block in `app/globals.css`; every component already consumes them as named utilities (`bg-surface`, `text-foreground`, …) after the token migration. The design-system colors are therefore a single registry, not scattered literals. The app is a single client-component gallery; `layout.tsx` renders `<html>` and injects Geist font variables. Tailwind v4's default `dark:` strategy is a `prefers-color-scheme` media query; overriding individual semantic tokens per scheme is also possible from within `@theme`/`@variant`.

## Goals / Non-Goals

**Goals:**
- Both themes driven by the same semantic token names — components keep one set of utility classes and the theme only changes token *values*.
- Theme decision (persisted choice → system → light) applied before first paint.
- All toggle state owned by a small hook with unit-testable logic, mirroring the `useBirds` pattern.

**Non-Goals:**
- No per-surface custom themes (one dark set for the whole app).
- No theme-picker settings page, no user accounts, no server-side theme storage (persistence is a browser-local concern).
- No OS-native color-scheme plumbing (`color-scheme` CSS property is covered as a detail, not a requirement).
- No changes to data, API seam, or gallery logic in `useBirds`.

## Decisions

### D1. Token value swapping via CSS custom properties + `data-theme` attribute (chosen)
`@theme` stays the **single registry of source values**. At runtime the semantic variables are re-resolved: the `@theme` block defines light values; a `:root[data-theme="dark"]` block overrides the same `--color-*` token values; `color-scheme: dark` accompanies it. Components keep using the same utilities — Tailwind emits `background-color: var(--color-brand)` style output for arbitrary-value properties? — **no**: Tailwind v4 copies token values at build time, not via `var()` references, so utilities would not live-update on attribute change.

**Resolution (chosen):** light/dark values declared in `@theme inline` referencing CSS variables and the body itself bound to `--color-*`. This is Tailwind v4's documented "CSS variables" strategy using `@theme inline`: utilities reference `var(--color-surface)` instead of baking `#FFFFFF`.

**Rationale:** thrifting to media-query-only dark mode (Tailwind default) violates the persistence + toggle requirements (user choice cannot win over OS preference), so the standard config change `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` gives class-strategy dark variants while `@theme inline` makes token utilities reactive.

**Alternatives considered:**
- *Media-query dark mode only* — simplest, but cannot honor persisted user preference; rejected against specs.
- *Multiple dark token utility classes sprinkled as `dark:bg-*` per component* — works with any strategy but fixes light/dark pairs at every call site (dozens), which Article IV/III.5 forbids (tokens remain the single source).
- *next-themes dependency* — battle-tested, but adds a sixth runtime dependency for ~50 lines of hook + script (Article II prefers existing deps first). Rejected.

### D2. No-flash inline script in `<head>` (chosen)
A minimal blocking script in `layout.tsx` reads the persisted key, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and sets `document.documentElement.dataset.theme` before body renders. Placed inline in `<head>` (via `dangerouslySetInnerHTML`? — no: a plain `<script dangerouslySetInnerHTML>` tag in the Next App Router head via the layout's `<head>` element of the html tree) — small, dependency-free, and runs before paint. React hydration may warn on attribute mismatches? — the script only touches `data-theme`/`color-scheme` attributes, which Next tolerates via `suppressHydrationWarning` on `<html>`.

**Alternatives considered:** *settle after hydration* (violates no-flash spec), *useEffect-based*
 (same), *cookie + server render* (works but couples SSR markup; heavier than needed for an informational page).

### D3. Theme state owned by `useTheme` hook + header toggle component (no library)
`useTheme` encapsulates: read initial setting (injected by the inline script's decision), write to localStorage `'theme-preference'`, listen to `matchMedia` changes while in *system* mode, and resolve cycle order light → dark → system. GlobalHeader renders the control with `aria-label` describing the *next/target* setting (or current state — decided during implementation with a11y test).

### D4. Dark palette values follow the ambient-surface pattern
Dark values for the Article IV tokens are chosen once here so both light and dark sets remain "binding" after the v1.2.0 amendment (light = current values; dark below). Contrast checked against WCAG AA for body text (4.5:1) and large text.

| Token | Light | Dark (proposed) | Note |
|---|---|---|---|
| `surface` | `#FFFFFF` | `#111827` | Near-neutral gray-900, keeps photography neutral |
| `canvas` | `#F9FAFB` | `#0B0F19` | Slightly darker than surface to preserve depth cue |
| `foreground` | `#111827` | `#F9FAFB` | Inverted surface/canvas rhythm for text |
| `muted` | `#6B7280` | `#9CA3AF` | One step lighter (gray-400) for AA on dark |
| `brand` | `#059669` | `#10B981` | One step brighter for contrast on dark |
| `brand-strong` | `#047857` | `#34D399` | Hover state inverted *brighter* on dark |
| `danger` | `#EF4444` | `#F87171` | Brighter red for legibility |
| `danger-light` | `#FCA5A5` | `#FCA5A5` | Unchanged (already light-toned) |
| `success` | `#10B981` | `#34D399` | |
| `warning` | `#F59E0B` | `#FBBF24` | |

`bg-white` and `gray-*` utility usage (header bg, card tags, input borders, `text-white` on brand buttons) are rasterized to semantic tokens during this change (`bg-surface`, `border-canvas-strong`… wait that token doesn't exist). **Resolution:** static Tailwind palette colors (`bg-white`, `bg-gray-100`, `border-gray-200`, `text-white`) Either gain an explicit dark twin per call site, or scalar tokens are promoted: this is a call-site-only decision — dark variants for these neutral shades are added where the semantic token set lacks a covering name (e.g., a card tag strip or input border needs a `dark:` variant inline). This keeps the token registry semantic (Article IV) while allowing shades that are *not* part of the §4.1 palette.

### D5. Shadows and backdrop need explicit dark variants
The card shadow `shadow-[0px_4px_12px_rgba(0,0,0,0.05)]` is invisible on dark surfaces → add `dark:shadow-[0px_4px_12px_rgba(0,0,0,0.35)]`. Modal backdrop `bg-black/40` is theme-neutral (black works in both); hover `-translate-y-1` unchanged.

## Risks / Trade-offs

- **[WCAG contrast misses]** → Every dark value is checked with a contrast calculation against the palette it sits on during implementation; task list includes a verification step.
- **[Inline script + SSR interplay]** The `data-theme` attribute is set before hydration; React hydration mismatches are suppressed via `suppressHydrationWarning` on `<html>` only, and unit tests cover the script's decision logic separately.
- **[E2E dark assertions flakiness]** System-preference-dependent tests could drift → E2E emulates `colorScheme: 'dark'` via Playwright's device emulation and asserts computed styles, not pixel snapshots.
- **[Toggle state desync with localStorage]** Mitigated by writing storage in the same handler that updates state and by a unit test that simulates reload (fresh hook instance reads persisted value).

## Migration Plan

1. Ship code with toggle + tokens (single deploy, no data migration — new localStorage key only).
2. Rollback = revert; the feature is additive (light theme unchanged when dark never selected; default = system preserves previous light behavior for ≤dark-OS users? — **note:** previously ALL users always got light, so enabling defaults is a visible change for system-dark users; that is the point of the feature, accepted).
3. Constitution amendment lands in the same change (v1.2.0) — if reverted, revert the amendment too.

## Open Questions

- None blocking. Toggle a11y naming ("Change theme to dark" vs "Theme: dark") is implementation-level; resolved by the E2E a11y assertion chosen in tasks.
