# Proposal: add-dark-mode

## Why

The gallery is light-only (constitution Article IV pinned the light palette; the deleted create-next-app dark-mode override in `app/globals.css` confirmed the intent to choose deliberately). Users browsing a photography-heavy directory at night see white glare across every surface; a dark theme is standard for image-forward products and improves comfort for evening use.

## What Changes

- Add a **dark theme** to the whole gallery (header, filter bar, cards, modal, states) driven by Tailwind v4 dark variants against the existing Article IV `@theme` tokens.
- Add a **theme toggle** in the `GlobalHeader` (sun/moon icon button) with three settings: light, dark, system.
- Default theme follows the browser (`prefers-color-scheme: dark`); user choice persists in `localStorage` across sessions.
- **No script flash**: persisted/system choice is applied before first paint via a tiny inline blocking script in the document `<head>`.
- **Constitution amendment (Ask-First gate)**: Article IV is amended from "light palette binding" to "semantic tokens binding — light set required, dark set defined for every semantic token". Version bump to v1.2.0 per Article X.1.
- Ambient contrast adjustments: card shadows and modal backdrop get dark-scene variants; bird photography is unchanged (photos render identically in both themes).

## Assumptions (recorded, not blocking)

- **Toggle UI over automatic-only**: a manual three-way toggle (light/dark/system) is chosen because an automatic-only mode gives users no escape from glare on OLED devices; "system" is retained as the default so no new markup forces a choice on first visit. If the user wants system-only (zero new UI), the delta drops the toggle requirement — say so before apply.
- Light theme remains the fallback when JS is disabled or storage is unavailable (system detection inside the inline script still applies).
- Dark palette values are NOT pre-specified here; design.md defines the dark token values under Article IV constraints.

## Capabilities

### New Capabilities

- `theme-appearance`: The system must support light and dark visual themes: system-preference default, user toggle in the header, persistence across sessions, no flash of wrong theme on first paint, and complete dark coverage of every user-facing surface (gallery grid, filter chips, cards, modal, error/empty states).

### Modified Capabilities

- *(none — OpenSpec has no existing capabilities; `openspec/specs/` is empty)*

## Impact

- `app/globals.css` — dark token values added to `@theme` (or a `.dark` variant block); possible dark class strategy (`class`/`data-theme`) selected in design.
- `app/layout.tsx` — inline no-flash script in `<head>`; `<html class="...">` may gain a theme-class hook.
- `components/GlobalHeader.tsx` — new toggle button (needs accessible name, sun/moon swap).
- `components/*.tsx` + `app/page.tsx` — semantic utilities gain `dark:` variants; **no color literals introduced** (Article IV/III.5).
- `constitution.md` — Article IV amendment (v1.2.0); Appendix A unaffected (all rows closed).
- Tests — new unit tests for the toggle logic; new E2E scenario for toggle + persistence; existing E2E extend with a dark-sweep assertion (e.g., canvas bg differs between themes).
