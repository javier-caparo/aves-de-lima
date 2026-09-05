# theme-appearance Specification

## Purpose

Governs the light and dark visual themes of the gallery: how the theme is chosen (system preference, user toggle, persistence) and the guarantee that every user-facing surface renders completely in both themes without a flash of the wrong theme.

## Requirements

### Requirement: Theme follows system preference by default
The system SHALL default the active theme to the user's OS/browser color-scheme preference (`prefers-color-scheme`) on first visit, before any user choice exists. When no explicit user choice is stored and the browser reports `dark`, the page SHALL render in the dark theme on first paint; when it reports light (or the browser provides no preference), the page SHALL render in the light theme.

#### Scenario: First visit with OS dark preference
- **WHEN** a first-time visitor loads the gallery with their OS set to dark mode
- **THEN** the page renders in the dark theme on first paint, with no light-theme flash

#### Scenario: First visit with OS light preference
- **WHEN** a first-time visitor loads the gallery with their OS set to light mode
- **THEN** the page renders in the light theme

### Requirement: User can toggle the theme
The system SHALL expose a theme control in the global header that cycles between three settings: light, dark, and system. Applying a setting SHALL immediately re-render all visible content in the corresponding theme.

#### Scenario: Toggling to dark
- **WHEN** the user selects the dark setting
- **THEN** the gallery (header, filter bar, cards, regions) re-renders in dark colors without a full page reload

#### Scenario: Selecting system
- **WHEN** the user selects the system setting
- **THEN** the page follows the current OS/browser preference

#### Scenario: Toggle is accessible
- **WHEN** the current theme setting is rendered
- **THEN** the control exposes an accessible name reflecting the target theme state

### Requirement: Theme choice persists
The system SHALL persist the user's explicitly chosen theme setting across page loads and sessions within the same browser. A persisted choice SHALL take precedence over the system preference on subsequent visits. If persistence is unavailable, the system SHALL fall back to system-preference behavior without error.

#### Scenario: Reload after choosing dark
- **WHEN** the user chose dark, closes the tab, and later reloads the gallery
- **THEN** the page renders in the dark theme on first paint

#### Scenario: Storage unavailable
- **WHEN** localStorage/session storage is blocked (e.g., private mode restrictions)
- **THEN** the page renders normally using the system preference and no error is surfaced to the user

### Requirement: No flash of wrong theme
The system SHALL apply the effective theme (persisted choice, else system preference, else light) before the first paint of the document, so that no visible flash of an incorrect theme occurs during load or route-independent reloads.

#### Scenario: Reload while dark is effective
- **WHEN** the effective theme is dark and the document loads
- **THEN** the first painted frame is already dark (no white flash)

### Requirement: Complete dark coverage of gallery surfaces
The system SHALL render every user-facing surface in the active theme: global header, search input and filter chips (default, hover, active), bird cards, empty state, error banner with retry action, and the bird detail modal (backdrop included). No surface SHALL remain in light styling while the dark theme is active, and photography SHALL be unaffected (images render identically in both themes).

#### Scenario: Dark sweep of a card grid
- **WHEN** the dark theme is active on the gallery view
- **THEN** the page canvas and card surfaces render with the dark token values, and card images display unaltered

#### Scenario: Dark modal
- **WHEN** the bird detail modal is opened while the dark theme is active
- **THEN** the modal surface and its text render with the dark token values and legible contrast

#### Scenario: Dark error state
- **WHEN** the error banner is displayed while the dark theme is active
- **THEN** the banner and its Retry button render with the dark token values and remain legible
