# Tasks: fix-image-cropping

## 1. Card display

- [x] 1.1 Change the `BirdCard` image container from `aspect-[4/3]` to `aspect-[2/3]` and confirm `fill` + `object-cover` + `sizes` remain (ratio-matched `object-cover` is lossless for 2:3 sources); verify with a component test asserting the image container's computed aspect ratio is 2:3 (`height/width` ≈ 1.5) at the 1440px viewport.
- [x] 1.2 Verify hover regression: card still elevates and `scale-[1.02]` zoom introduces no new clipping on the taller portrait box; verify via the existing hover E2E assertion (computed `scale` changes) plus a no-new-clipping check (`overflow-hidden` still bounds within the box).

## 2. Modal hero

- [x] 2.1 Replace the modal's fixed-ratio hero (`aspect-video sm:aspect-[21/9]` + `fill`) with `next/image` intrinsic dimensions (`width={200} height={300}` for the current library) and `w-full h-auto` so the full photo renders at natural ratio; verify the modal image's rendered ratio matches the source (≈0.667) and the image is not cropped.
- [x] 2.2 Verify modal usability with the tall hero: content (image, names, habitat, description) remains inside `max-h-[90vh] overflow-y-auto`, scrollable and fully operable; verify via E2E scroll/playback assertions on the modal content region.

## 3. Layout polish & assets

- [x] 3.1 Review the gallery grid at 1440px and 390px with the taller portrait cards; make only incidental spacing adjustments (no grid-breakpoint changes) and spot-check card density still reads as a clean directory grid; verify with a build + browser screenshot at both reference viewports kept as the change's manual-QA artifact.
- [x] 3.2 Check the upscale-blur situation on desktop (200px sources at ~360px card width) and record the finding in the change notes — if blur is objectionable, surface the higher-resolution resupply recommendation as a follow-up for the user rather than changing code silently.

## 4. Verification & governance

- [x] 4.1 Extend E2E/RTL journey coverage for the spec scenarios (portrait photo on a card shows full content, modal shows complete photo, hover preserved, responsive at both reference viewports); verify each `specs/bird-media-display/spec.md` scenario has a mapped passing assertion (unit/E2E), noting any manual-only cases.
- [x] 4.2 Run the full quality gate (`npx tsc --noEmit`, `npm run lint` — zero problems, `npm test`, `npm run test:e2e`), amend `final proposal.md` §5.1 to the 2:3 portrait card ratio with a dated amendment note, and confirm `openspec validate --specs` passes.

## 5. Change notes (audit records)

### Spec scenario mapping (task 4.1)

| Spec scenario | Coverage |
|---|---|
| Portrait photo on card shows full content (2:3) | E2E `media.spec.ts` — image bounding-box ratio ≈1.5 at 1440px |
| Other-ratio photo keeps subject visible | Structural: `object-cover` on a ratio-matched box (D1); no dedicated test — covered by box-ratio assertion on current library |
| Modal shows complete photo (natural ratio) | E2E — modal `<img>` box ratio ≈1.5, no fixed-ratio container |
| Modal stays usable/scrollable with tall hero | E2E — scrollHeight > clientHeight, scrollTop > 0 after scrollTo bottom |
| Responsive at 1440px / 390px | E2E mobile-viewport ratio test + manual-QA screenshots |
| Hover behavior preserved, no new clipping | E2E — existing `scale` change assertion + `overflow-hidden` class bound check |

### Manual-QA artifacts (task 3.1)

- `manual-qa/gallery-1440.png` and `manual-qa/gallery-390.png`: full-page production screenshots at both reference viewports, captured via system Chrome against `next build && next start`. First capture attempt exposed lazy-loading placeholders (gray boxes) — capture script scrolls to trigger `next/image` lazy loads and waits for `img.complete` before shooting.
- Layout review: single-column mobile and 4-column desktop read as a clean directory grid with taller portrait cards; no grid-breakpoint changes were needed.

### Upscale-blur finding (task 3.2)

Source photos are 200×300 px; desktop card render is ~293×438 px (1.47× upscale) and the modal renders ~672×1018 px (3.36×). From the 1440px screenshot, card-scale upscales read acceptably soft; the modal hero is noticeably softer. **Recommendation:** supply higher-resolution assets (≥600×900) under the same filenames for curation-quality display — a data/curation lever, not a code change. Left as a user follow-up, not silently worked around.

### Components touched

- `components/BirdCard.tsx`: image container `aspect-[4/3]` → `aspect-[2/3]` (fill + object-cover + sizes unchanged).
- `components/DetailModal.tsx`: fixed-ratio hero (`aspect-video sm:aspect-[21/9]` + fill) → intrinsic `width={200} height={300}` with `w-full h-auto`.
- `e2e/media.spec.ts`: 4 new E2E tests covering the spec scenarios above.
- `final proposal.md`: §5.1 amendment to 2:3 portrait.
