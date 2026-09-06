# Design: fix-image-cropping

## Context

Source photos in `public/images/` are 200×300 px (2:3 portrait). `BirdCard.tsx` renders a `fill` image inside `aspect-[4/3]` + `object-cover` (landscape crop); `DetailModal.tsx` renders `fill` inside `aspect-video sm:aspect-[21/9]`. Both crop the photo. Modal body uses `max-h-[90vh] overflow-y-auto`. Existing hovers: card elevation + `group-hover:scale-[1.02]`. The `sizes` attributes added for `next/image` srcset sizing are correct for the grid columns and stay unchanged (they size by *width*; heights change here).

## Goals / Non-Goals

**Goals:**
- Every current photograph displays fully — no content lost between the card, hover zoom, and modal.
- Grid stays 1/2/3/4 responsive columns; the design tokens and card text block are untouched.
- Future-friendly: behave sensibly (no content loss) for non-2:3 assets.

**Non-Goals:**
- No data schema change (no image-dimension fields added in this change).
- No new photo assets, no image optimization pipeline changes.
- No redesign of the modal's information hierarchy or the grid's column behavior.

## Decisions

### D1. Card image area becomes `aspect-[2/3]`, keeping `fill` + `object-cover` + `sizes` (chosen)
One-line ratio switch, same `next/image fill` mechanics, same `sizes` strategy (widths per breakpoint are unchanged — cards keep their column widths, they get taller).

**Alternatives considered:**
- *`object-contain` letterbox in 4:3 frames* — rejected per proposal (all six photos are 2:3; letterboxing burns card height on empty bands).
- *Switch `fill` to width/height on cards* — unnecessary; `fill` with a ratio-matched box is already lossless for the current library and self-corrects `object-cover` if a future asset has a different ratio (subject stays centered, box size stays stable). Rejected churn.
- *Resupply landscape photos* — needs asset work outside the repo; preserve as the future option if a land­scape look is wanted; doesn't fix today's library.

### D2. Modal hero switches from `fill` to intrinsic dimensions (`width`/`height` + `w-full h-auto`) (chosen)
The modal currently crops the photo into `aspect-video`/`21:9`. With `fill`, a container would need a ratio — which re-crops by construction. Instead the modal image uses `next/image` with intrinsic dimensions (200×300, matching the asset library) and `className="w-full h-auto"`, so the photo renders at its natural ratio at the modal's width and the modal's `max-h-[90vh] overflow-y-auto` keeps tall content scrollable (spec: "Modal stays usable with tall photos").

**Alternatives considered:**
- *Modal keeps `fill` with a 2:3 box* — crops again whenever the box ratio mismatches the asset; fails the no-crop requirement for non-2:3 assets.
- *Add image dimensions to the data schema* — bigger blast radius (types, JSON, curation) for information the current library doesn't need; defer via Ask-First if assets diversify.

### D3. Grid re-balance is minimal (chosen)
Taller cards make the 4-column grid ~90px taller per row at 1440px — this is the intended outcome (fuller photos). Only incidental spacing polish is in scope; no grid-breakpoint changes.

## Risks / Trade-offs

- **[Upscaling blur at large sizes]** 200 px wide sources render up to ~360 px on desktop cards and ~672 px in the modal (modal may exceed 100% on the 390 px mobile viewport's `100vw`). → Mitigation: acceptable for the current prototype assets; the curation standard (constitution Article V.4 data quality) is the lever — record a resupply recommendation in the tasks' verification notes rather than shipping a new dependency or pipeline in this change.
- **[Cards get notably taller]** Density drops on the gallery → accepted; this is the requested outcome. Grid columns unchanged.
- **[Future assets with different ratios]** → D2's modal approach is ratio-agnostic; cards degrade to `object-cover` subject-preserving behavior instead of cropping by design.
- **[Hover zoom on taller images]** `scale-[1.02]` on a portrait box stays inside the box (`overflow-hidden`), no new clipping → covered by an E2E hover regression test.

## Migration Plan

Single deploy, purely presentational. Rollback = revert. No data/storage/schema effects. `final proposal.md` §5.1 amendment rides in the same change and reverts with it.

## Open Questions

- None blocking.
