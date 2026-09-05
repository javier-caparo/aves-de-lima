# Project Constitution — Aves de Lima

**Version:** 1.1.0
**Ratified:** 2026-09-04 (v1.1.0 amended 2026-09-04 from v1.0.0)
**Derived from:** `final proposal.md` (Architecture & System Definition) and codebase exploration (2026-09-04)

---

## Preamble

This document is the supreme governance standard for the Aves de Lima project. It defines the non-negotiable principles, quality bars, and boundaries that all contributors — human or AI — must honor.

**Precedence order** when documents conflict:

1. This constitution (highest)
2. `final proposal.md` (requirements & design intent)
3. OpenSpec artifacts (`openspec/`)
4. Code comments and tribal memory

Where this constitution diverges from the proposal, the divergence is deliberate and documented (see Appendix A). The proposal remains the source of truth for *what* to build; this constitution governs *how* it must be built and maintained.

---

## Article I — Project Identity

1. **Purpose.** Aves de Lima is a production-ready, responsive, public informational directory showcasing the birds of Lima Metropolitana, prioritizing high-quality photography, intuitive search/filtering, and clean accessible layout.
2. **No authentication.** The directory is public. No login, no user accounts, no session state. Any feature requiring identity is out of scope until the constitution is amended.
3. **Static-first data.** The source of truth is `data/birds.json`, manually curated and committed to the repository. Images are hosted locally under `public/images/`. No external database, CMS, or API dependency exists today.
4. **Target devices.** Desktop 1440px and Mobile 390px are the reference viewports. Every user-facing change must be verified against both.

---

## Article II — Technology Stack

| Concern | Standard | Rationale |
|---|---|---|
| Framework | Next.js **App Router**, TypeScript (strict) | Proposal §3 |
| UI | React 19 function components + hooks only | No class components |
| Styling | Tailwind CSS v4 (PostCSS pipeline) | Proposal §3 |
| Unit/Integration testing | Jest + React Testing Library | Proposal §3 |
| E2E testing | Playwright (`@playwright/test`) | Proposal §3 |
| Package manager | npm (lockfile: `package-lock.json`, always committed) | Established convention |
| State | React hooks (`useState`, `useEffect`, `useMemo`) | Proposal §3; no state library |

**Dependency policy.**

- Adding any new third-party dependency requires explicit approval (see Article IX, Ask-First).
- Justified dependencies must earn their place: prefer the standard library, React built-ins, or existing dependencies (`clsx`, `tailwind-merge`) before introducing anything new.
- Pin exact versions for framework-critical packages (`next`, `react`, `react-dom`); caret ranges are acceptable for tooling.

---

## Article III — Architecture

1. **Single-page gallery.** The application is one screen: Main Gallery with Search & Filter Bar, Bird Grid, Empty State, and Bird Detail View (modal overlay). The site map in proposal §6.1 is the definitive scope. New screens or routes require a proposal change first.
2. **Data flow.** `data/birds.json` → `hooks/useBirds.ts` (search + filter logic) → `app/page.tsx` (rendering). Business logic for searching and filtering lives in the hook, not in components. Components receive data and callbacks as props.
3. **No artificial latency.** Data that ships inside the bundle must not simulate network latency in production code. Loading states exist to represent *real* asynchronous work. The "future API readiness" seam is preserved by keeping fetch logic isolated in `useBirds` — not by injecting `setTimeout` delays.
4. **Type contract.** All data crossing a module boundary conforms to the `Bird` interface in `types/index.ts`. The JSON file must never be cast to a different shape silently; if the schema changes, `types/index.ts` changes with it in the same commit.
5. **Styling.** Design tokens (Article IV) must be defined once — as Tailwind theme tokens — and referenced by name. Inline hex literals in components are technical debt; new code must not add them, and touched code should migrate them when practical.
6. **File structure.** The canonical structure is the one that exists (no `src/` wrapper):

```text
aves-de-lima/
├── app/            # layout.tsx, page.tsx, globals.css
├── components/     # GlobalHeader, SearchFilterBar, BirdCard, DetailModal
├── data/           # birds.json (static database)
├── hooks/          # useBirds.ts (+ tests)
├── types/          # index.ts (Bird entity)
├── public/         # images/, favicon.ico, static assets
└── openspec/       # change governance
```

---

## Article IV — Design System

The proposal §4 palette is binding. Tokens are registered in the Tailwind v4 theme (`app/globals.css`, `@theme` block) and used by name.

> **v1.1.0 amendment (2026-09-04):** Token names renamed from the v1.0.0 usage-shaped names to unambiguous semantic names, because a single `--color-primary` cannot serve both `bg-primary` (#FFFFFF) and `text-primary` (#111827). `--color-danger-light` (#FCA5A5) added as a new token for the retry-button hover.

| Tailwind token | Value | Usage |
|---|---|---|
| `surface` | `#FFFFFF` | Main background (`bg-surface`) — was `bg-primary` |
| `canvas` | `#F9FAFB` | Secondary background / app canvas (`bg-canvas`) |
| `foreground` | `#111827` | Primary text (`text-foreground`) — was `text-primary` |
| `muted` | `#6B7280` | Secondary text (`text-muted`) — was `text-secondary` |
| `brand` | `#059669` | Primary buttons, active states, links (`bg-brand`/`text-brand`) — was `accent` |
| `brand-strong` | `#047857` | Hover on accent elements — was `accent-hover` |
| `danger` | `#EF4444` | Error states — was `error` |
| `danger-light` | `#FCA5A5` | Hover on danger buttons (added v1.1.0) |
| `success` | `#10B981` | Success states |
| `warning` | `#F59E0B` | Warning states |

**Layout rules (proposal §4.2).**

- 12-column grid on desktop, 4-column on mobile; 24px standard gutters.
- Cards: subtle border or soft shadow (`0px 4px 12px rgba(0,0,0,0.05)`), `rounded-lg` (8px radius).
- Bird Card hover: elevation increases, image scales to `hover:scale-[1.02]`.
- Detail Modal: backdrop `rgba(0,0,0,0.4)` with blur, close (X) top-right, closes on outside click.

**UI states (proposal §8) are mandatory for the gallery.** Every rendering path must exist and be honored: Loading (skeletons), Empty (message + "Clear Filters" action), Error (inline banner + retry), Success (rendered grid).

---

## Article V — Data Principles

1. **Schema contract.** `data/birds.json` entries conform to:

```json
{
  "id": "uuid-or-slug",
  "common_name": "string",
  "scientific_name": "string",
  "image_url": "/images/bird-name.jpg",
  "habitat": "string",
  "description": "string"
}
```

2. **Habitat is a known constraint.** The schema stores a single `habitat` string, but the filter-chip taxonomy (Coastal / Urban / Andean) implies multi-habitat species. Migrating `habitat: string` → `habitats: string[]` requires an Ask-First decision (Article IX) because it touches schema, filtering logic, and test data simultaneously. Do not accumulate birds whose real-world habitat assignment is falsified by the schema; surface the conflict instead.
3. **Curation standards.** Every bird entry must have: a slug or unique `id`, correct common and scientific names, an existing image file at `image_url`, a habitat value matching the filter taxonomy, and a substantive description. No placeholder entries.
4. **Images.** All photography lives in `public/images/`, named in kebab-case (`gorrion-americano.jpg`). No external image hotlinking. Image files referenced by the data must exist — a broken `image_url` is a data bug.
5. **Schema changes** always run through Ask-First and require updating, in one change: `types/index.ts`, `data/birds.json`, any affected hooks/components, and the affected tests.

---

## Article VI — Testing & Quality

1. **Test-first for business logic.** Search, filtering, and any data-transformation logic gets unit tests written before finalizing the change (proposal Boundaries: ALWAYS). UI rendering gets RTL coverage for each gallery state (Loading, Empty, Error, Success — Article IV).
2. **E2E coverage of the user flow.** Playwright must cover the canonical flow from proposal §6.2: land on gallery → search/filter → hover → click card → modal opens → close. E2E tests run against a production build (`next build && next start`), never the dev server.
3. **Coverage floor.** Minimum 80% code coverage. Coverage is a floor, not a target; regression of the number below 80% blocks merge.
4. **Test conventions.**
   - Naming: `[filename].test.[ext]` (or `.spec.[ext]` for Playwright).
   - Structure: AAA (Arrange, Act, Assert) with a comment marking each phase.
   - Mock external dependencies; the static JSON import may be used directly, but simulated async work is mocked.
   - Test files must never be deleted or weakened to make a suite pass.
5. **Quality gates.** Every change must pass, in this order:
   1. `npx tsc --noEmit` (or IDE equivalent) — no type errors
   2. `npm run lint` — no lint errors
   3. `npm test` — all unit/integration tests pass
   4. `npx playwright test` — all E2E tests pass
   5. `npm run build` — production build succeeds

---

## Article VII — Code Standards

1. **Naming.** `camelCase` for variables/functions, `PascalCase` for components/classes/types, `kebab-case` for files, images, and slugs.
2. **Size limits.** Max function length: 50 lines. Max file length: 300 lines. Exceeding either requires extraction, not a waiver.
3. **Documentation.** All public interfaces (exported hooks, components, types) carry a comment explaining purpose (proposal: ALWAYS).
4. **Async.** `async/await` only — no callback-style asynchronous code.
5. **TypeScript.** No `any`, no `@ts-ignore`, no `@ts-expect-error` without a tracked justification. Types describe real shapes; validation happens at trust boundaries only.
6. **Comment language.** English for code comments and identifiers; user-facing text in Spanish where it represents content (bird names, descriptions per data curation).

---

## Article VIII — Error Handling & Resilience

1. **User-facing errors** are human-readable, actionable, and match the state model (Article IV): "Failed to load bird data. Please try again." with a retry action.
2. **Error shape.** If/when an API layer is introduced, every error response follows:

```json
{ "error": "Human-readable message", "code": "ERROR_CODE", "timestamp": "ISO-8601" }
```

3. **HTTP semantics (future API).** Endpoints, if ever added, are prefixed `/api/v1/`, follow RESTful conventions, and return field-specific 400 messages, 404 for unknown resources, 500 only for unexpected failures.
4. **Graceful degradation.** A single bad bird entry (missing image, malformed field) must not blank the gallery. Rendering tolerates per-item failure; data curation fixes the root cause.

---

## Article IX — Boundaries

### ✅ ALWAYS

- Write unit tests for business logic before finalizing a task
- Follow the schema contract in Article V for all data changes
- Validate inputs at trust boundaries (search terms, future API payloads)
- Add comments to all public interfaces
- Use async/await for asynchronous operations
- Verify changes against Desktop 1440px and Mobile 390px
- Keep the OpenSpec workflow intact: never hand-edit `openspec/changes/` metadata

### ⚠️ ASK FIRST

- Adding any new third-party dependency
- Changing the data schema (`habitat` → `habitats[]`, new fields, new entities)
- Changing architectural patterns (client → server data flow, new routes/pages)
- Introducing an API layer, backend, or any external data source
- Amending this constitution

### 🚫 NEVER

- Hardcode secrets, API keys, or sensitive data in code
- Skip tests for business logic
- Ship user-facing features not covered by the proposal or an approved change
- Store credentials or personal data — the directory is public and anonymous
- Delete or weaken failing tests to pass a suite

---

## Article X — Governance

1. **Amendments.** Changes to this constitution are themselves Ask-First items. An amendment must state: the principle changed, the rationale, and the migration impact. Bump the version; record the date.
2. **Deviations.** Any deviation from a MUST in this document must be recorded either as an amendment or as an explicit, time-boxed exception in the relevant change proposal — never silently.
3. **Conflicts.** Constitution > proposal > OpenSpec artifacts > comments. If the proposal itself is wrong (e.g., it specifies a `src/` structure that reality abandoned), fix the proposal and note it in Appendix A.
4. **Compliance check.** On demand, compliance is verified by running the Article VI quality gates and reviewing Article IX boundaries against the diff.

---

## Appendix A — Known Divergences from the Proposal (as of v1.0.0)

| Proposal says | Reality | Status |
|---|---|---|
| ~~§9: `src/` directory wrapper~~ | ✅ Fixed 2026-09-04 — proposal §9 amended to root-level structure; root-level is canonical | **Closed** |
| ~~§9: `tailwind.config.ts` with validated tokens~~ | ✅ Fixed 2026-09-04 — Tailwind v4 `@theme` tokens registered in `app/globals.css` per Article IV (v1.1.0 amendment); all hardcoded hex replaced across `app/` + `components/`; E2E asserts `--color-brand` emission on a production build | **Closed** |
| ~~§9: `jest.config.js` + test scripts~~ | ✅ Fixed 2026-09-04 — `jest.config.mjs` + `jest.setup.js` created (ESM filename per lint config), `test` script added, `jest-environment-jsdom@30` + `@types/jest@30` installed, broken mock path in `useBirds.test.ts` corrected | **Closed** |
| ~~§9: `playwright.config.ts`~~ | ✅ Fixed 2026-09-04 — config + `e2e/gallery.spec.ts` covering the §6.2 flow via **6 passing E2E tests** against a production build; uses system Chrome (`channel: 'chrome'`) as download-restricted environment deviation | **Closed** |
| ~~§8: Error state with retry button~~ | ✅ Fixed 2026-09-04 — `Retry` action wired via `useBirds().refetch` (load-generation rerun, react-fetch-pattern compliant); unit test covers reload mechanics. Error branch itself remains unreachable by runtime (static data cannot fail mid-app); exercised via tests only | **Closed** |
| §7: `habitat: string` | Matches implementation; multi-habitat species conflict anticipated | Tracked — Article V.2 |
| ~~Filename `useBIrds.test.ts` (typo)~~ | ✅ Fixed 2026-09-04 — renamed to `useBirds.test.ts` | **Closed** |

Gaps listed here are not waivers — they are the known distance between law and practice, and closing them takes priority in upcoming changes.
