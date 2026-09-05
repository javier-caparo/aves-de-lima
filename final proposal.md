# Architecture & System Definition Proposal: Aves de Lima

## 1. Project Overview & Objective
Design a production-ready, responsive web application interface for a directory showcasing the birds of Lima, Metropolitana. The UI prioritizes high-quality photography, intuitive search and filtering, and a clean, accessible layout for exploring bird insights.

## 2. Artifact & Constraints
* **Platform / Device:** Responsive Web Application (Desktop: 1440px, Mobile: 390px).
* **Fidelity:** High-fidelity UI design.
* **Authentication:** Public informational directory (No user login/auth required).
* **Data Source:** Static JSON file manually populated.
* **Image Hosting:** Local repository hosting within a `/images` subdirectory.

## 3. Technology Stack
* **Framework:** Next.js (App Router) using TypeScript.
* **Styling:** Tailwind CSS (for rapid, responsive UI development).
* **State Management:** React Hooks (useState, useEffect, useMemo).
* **Testing:** 
  * Unit/Integration: Jest & React Testing Library.
  * End-to-End (E2E): Playwright.

## 4. UI & Graphic System
### 4.1. Visual Style
Nature-inspired, clean, and modern. Ample whitespace to highlight photography.
* **Base Colors:** `#FFFFFF` (Main Background), `#F9FAFB` (Secondary Background / App Canvas).
* **Text Colors:** `#111827` (Primary Text), `#6B7280` (Secondary Text).
* **Primary Accent:** `#059669` (Earthy Green) for primary buttons, active states, and links.
* **Status Colors:** `#EF4444` (Error), `#10B981` (Success), `#F59E0B` (Warning).

### 4.2. Layout General
* 12-column grid for Desktop, 4-column grid for Mobile.
* 24px standard gutter spacing.
* **Cards:** Subtle 1px borders or soft drop shadows (e.g., `0px 4px 12px rgba(0,0,0,0.05)`) with 8px border-radius (`rounded-lg`).

## 5. Components & Structure
### 5.1. Component Inventory
* **Global Header:** Sticky top bar, white background, bottom border. Application title ("Birds of Lima") and logo.
* **Search Bar:** Input field with left-aligned search icon, placeholder text "Search birds...". Full-width or prominent top-bar placement.
* **Filter Chips:** Pill shape toggles for categories (e.g., "All", "Coastal", "Urban", "Andean"). 
  * *States:* Default (gray outline), Hover (gray background), Active (green background `#059669`, white text).
* **Bird Card:** Container with image top (aspect ratio 4:3 or 1:1), text bottom (Common name H2, scientific name italicized, small habitat tag).
  * *Interactions:* Hover state elevates card slightly (shadow increases) and image scales up by 2% (`hover:scale-[1.02]`).
* **Detail Modal:** Overlay container with backdrop blur (`rgba(0,0,0,0.4)`). Contains a Close (X) button top-right, large hero image, typography hierarchy (Common Name, Scientific Name), metadata tags, and description.

## 6. Site Map & User Flow
### 6.1. Site Map
* **Main Gallery (Public, Full Screen)**
    * Search & Filter Bar (Primary)
    * Bird Grid (Responsive layout containing Bird Cards)
    * Empty State Container (Hidden by default)
    * **Bird Detail View (Modal / Side-panel Overlay)**

### 6.2. User Flow Mapping
1. User lands on the Main Gallery screen and views the default grid of bird cards.
2. User interacts with the Search Bar or Filter Chips to narrow down results.
3. User hovers over a Bird Card (triggers elevation/image scale).
4. User clicks the Bird Card.
5. System opens the Bird Detail View (Modal or Side-panel) displaying full insights.
6. User clicks the "Close" (X) button or outside the modal to return to the Main Gallery.

## 7. Data Models
### 7.1. Core Entities (Static JSON Schema)
**File:** `data/birds.json`
```json
[
  {
    "id": "uuid-or-slug",
    "common_name": "String",
    "scientific_name": "String",
    "image_url": "/images/bird-name.jpg",
    "habitat": "String",
    "description": "String"
  }
]
```

## 8. State Model
* **Base:** Grid populated with bird cards, default filters applied.
* **Loading:** Skeleton screens for the grid cards (gray boxes for images and text lines) while rendering.
* **Empty:** Illustration or icon with text "No birds found matching your criteria" and a "Clear Filters" button.
* **Error:** Toast notification or inline banner stating "Failed to load bird data. Please try again." with a retry button.
* **Success:** Data loaded and rendered correctly.

## 9. File Structure
```text
aves-de-lima/
├── data/
│   └── birds.json           # Static database
├── public/
│   ├── images/              # Local bird photography
│   └── favicon.ico
├── app/
│   ├── layout.tsx           # Global layout & HTML structure
│   ├── page.tsx             # Main Gallery & State handling
│   └── globals.css          # Tailwind imports & variables
├── components/
│   ├── GlobalHeader.tsx
│   ├── SearchFilterBar.tsx
│   ├── BirdCard.tsx
│   └── DetailModal.tsx
├── hooks/
│   └── useBirds.ts          # Custom hook for filtering/searching logic
├── types/
│   └── index.ts             # TypeScript interfaces (Bird entity)
├── package.json
├── tailwind.config.ts       # Validated design tokens
├── playwright.config.ts     # E2E test config
└── jest.config.mjs          # Unit test config
```

> **Amendment (2026-09-04):** The original structure wrapped app code in a `src/` directory. The implementation uses root-level directories (`app/`, `components/`, `hooks/`, `types/`), which is valid for Next.js App Router and is now canonical per `constitution.md` Article III.6. The `src/` wrapper is not used. [Updated 2026-09-04] Test config uses `jest.config.mjs` (ESM) instead of `jest.config.js`, as required by the project's lint rules.

## Boundaries

### ✅ ALWAYS DO:
- Write unit tests for all business logic before finalizing a task
- Follow RESTful API naming conventions (use `/api/v1/` prefix)
- Use explicit error handling and return standard HTTP status codes
- Add comments for all public interfaces
- Use async/await (not callbacks) for asynchronous operations
- Validate all user inputs

### ⚠️ ASK FIRST:
- Before adding any new third-party dependencies/libraries
- Before modifying the database schema
- Before adding new entities/tables
- Before changing architectural patterns

### 🚫 NEVER DO:
- Never hardcode secrets, API keys, or sensitive data in code
- Never skip writing tests for business logic
- Never use SELECT * in production code
- Never store passwords in plain text
- Never add features not in spec.md

## Code Style
- Naming: camelCase for variables/functions, PascalCase for classes
- Max function length: 50 lines
- Max file length: 300 lines
- Descriptive variable names (minimum 3 characters)

## Error Handling Standards
All errors must return:
```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "timestamp": "ISO-8601"
}
```

Status codes:
- 200: Success with data
- 201: Resource created
- 400: Validation errors (return field-specific messages)
- 404: Resource not found
- 500: Unexpected server errors

## Testing Requirements
- Minimum 80% code coverage
- Test file naming: `[filename].test.[ext]` or `[filename].spec.[ext]`
- Use AAA pattern: Arrange, Act, Assert
- Mock external dependencies (DB, APIs)

## API Standards
- All endpoints prefixed with `/api/v1/`
- RESTful conventions (GET/POST/PUT/DELETE)
- Consistent response format
