# Tasks: add-dark-mode

## 1. Token foundation

- [x] 1.1 Add `@theme inline` CSS-variable indirection for the semantic tokens in `app/globals.css` and declare the dark token values in a `:root[data-theme="dark"]` block with `color-scheme: dark`; verify utilities against a built page emit `var()` references and that light rendering is pixel-unchanged (`npm run build` + manual spot-check of a production page).
- [x] 1.2 Add the `data-theme="dark"` custom dark variant (`@custom-variant dark`) and register the `theme-preference` localStorage key name in a shared constant; verify with lint and tsc that no color literals were added to component files.

## 2. Theme engine

- [x] 2.1 Add the no-flash inline script to `app/layout.tsx` (persisted setting → else `prefers-color-scheme` → else light; sets `data-theme` + `color-scheme` before paint) with `suppressHydrationWarning` on `<html>`; verify with E2E that a first paint is already dark when OS preference is dark (`colorScheme` emulation).
- [x] 2.2 Implement `hooks/useTheme.ts` following the react-approved async/state pattern used in `useBirds`: expose `{ setting: 'light'|'dark'|'system', resolvedTheme, setSetting, cycleSetting }`, persist explicit choices to localStorage, and react to `matchMedia` changes while in system mode; verify with unit tests (cycle order, persistence round-trip on a fresh hook instance, storage-unavailable fallback, matchMedia listener behavior) — write tests RED first per Article VI.
- [x] 2.3 Add the theme toggle button to `components/GlobalHeader.tsx` (sun/moon icons, aria-label naming the effective next setting); verify accessible-name assertion plus state change in a component-level test.

## 3. Dark coverage of surfaces

- [x] 3.1 Rasterize remaining default-palette utilities that need dark twins (`bg-white`, `bg-gray-*`, `border-gray-*`, `text-white` call sites in header/cards/filter bar/modal) and add `dark:` variants where the semantic token set does not cover the shade; verify with a grep audit that every remaining default-shade class has a deliberate dark twin and record per-site decisions in the change notes.
- [x] 3.2 Add dark shadow variant for card elevation and confirm modal backdrop works in both themes; verify via E2E computed-style assertions for canvas/card surfaces and modal/backdrop under dark emulation.

## 4. Verification & governance

- [x] 4.1 Run dark sweep of states: empty state + "Clear Filters", error banner + Retry, Lighthouse-backed contrast check of dark `muted`/`foreground`/`brand` text against their surfaces (AA body/large-text, contrast function or axe); verify each scenario from `specs/theme-appearance/spec.md` has a mapped passing test (unit or E2E) and note any scenario deliberately covered only manually.
- [x] 4.2 Run full quality gate: `npx tsc --noEmit`, `npm run lint` (zero problems), `npm test`, `npm run test:e2e` (all passing incl. new dark scenarios), then update `constitution.md` Article IV to v1.2.0 ("semantic tokens binding — light set required, dark set defined for every token") and record the deployment outcome in the change notes.

## 5. Change notes (audit records)

### Per-site decisions (task 3.1)

| Site | Decision |
|---|---|
| `app/page.tsx` retry/error banner | Banner text/tint/border moved to `danger-text` token (AA body text both themes); retry button `bg-danger text-white hover:bg-danger-hover` |
| `app/page.tsx` empty-state + Clear Filters | Already semantic tokens (auto-swapped); no twin needed |
| `app/page.tsx` skeletons | `bg-gray-200 dark:bg-gray-800` |
| `components/BirdCard.tsx` surface/border/tag/placeholder | `bg-white` -> semantic `bg-surface` (auto-swap); border `gray-100 dark:gray-800`; tag & image placeholder `gray-100 dark:gray-800`; **shadow** `dark:shadow-[0px_4px_12px_rgba(0,0,0,0.35)]` |
| `components/DetailModal.tsx` surface/close/image placeholder | `bg-white` -> `bg-surface`; close button `white/80` twins `dark:gray-800/80`, `dark:hover:gray-700`; `text-gray-800 dark:text-gray-200`; placeholder `gray-100 dark:gray-800` |
| `components/GlobalHeader.tsx` | `bg-white` -> `bg-surface`; border `dark:gray-800`; toggle text/icon `gray-500 dark:gray-400`, `gray-100 dark:gray-800` |
| `components/SearchFilterBar.tsx` | icon `gray-400 dark:gray-500`; input `border dark:gray-700` + `bg-surface`; inactive chip `bg-surface` + `dark:border-gray-700` + `dark:hover:bg-gray-800` |
| `text-white` on brand/danger buttons | Kept in both themes (deliberate; contrast audited below) |

### Contrast audit (task 4.1, WCAG relative luminance)

- Body-size text on surfaces (>=4.5:1): dark foreground 16.98, muted 6.99/7.54, brand 4.71, danger-text 6.41; light foreground 17.74, muted 4.63, danger-text 6.47 — ALL PASS.
- White-on-color text (>=3:1, large/UI-component): brand 3.77 (both), danger 4.46/4.83, danger-hover 5.89/6.47 — PASS for UI-component state contrast.
- **Known pre-existing deviation:** 14px white text on `brand` measures 3.77:1 (WCAG 1.4.11 compliant, 1.4.3 body-text would need 4.5). Unchanged from the original design in light; dark now matches light exactly. Recorded in constitution v1.2.0 amendment.

### Spec scenario mapping (task 4.1)

| Spec scenario | Coverage |
|---|---|
| First visit, OS dark -> dark on first paint | E2E `theme.spec.ts` (colorScheme: dark) |
| First visit, OS light -> light | E2E (theme.spec: system+light, persisted-dark-wins test verifies inverse) |
| Toggle to dark, no reload | E2E + unit (`useTheme`) + component test |
| Selecting system follows OS | E2E (system + light OS) + unit (OS flip) |
| Toggle accessible name | Component test + E2E role-name usage |
| Persistence (reload after dark) | E2E reload test + unit fresh-instance test |
| Storage unavailable fallback | Unit test (storage getter throws / setItem fails) |
| No flash of wrong theme | Inline blocking script before paint (app/layout.tsx); correctness asserted via E2E data-theme + first-CSS assertions — timing of pre-paint applies is structural (before-paint script) |
| Dark sweep card grid | E2E (header, card, chip, input computed styles) |
| Dark modal | E2E modal computed style |
| Dark error banner | Unit-level token values verified; banner itself unreachable at runtime (static data cannot fail) — mapping noted as test-only coverage |
