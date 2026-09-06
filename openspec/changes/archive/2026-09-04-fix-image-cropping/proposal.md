# Proposal: fix-image-cropping

## Why

The source photographs in `public/images/` are 200×300 px — a portrait 2:3 ratio. The site renders them in fixed-crop containers: bird cards use `aspect-[4/3]` landscape and the modal hero uses `aspect-video` / `sm:aspect-[21/9]`, both with `object-cover`. A 4:3 landscape frame cuts roughly 40% of a 2:3 portrait photo's height, so every bird image on the site is visibly cropped (heads, feet, tails cut off). The user reported this directly against the production gallery.

## What Changes

- Bird card image containers change from `aspect-[4/3]` to the photos' native **`aspect-[2/3]`** portrait ratio, removing the crop (`object-cover` becomes lossless when the box ratio equals the image ratio; keep-cover so it protects against any future mismatched asset).
- The bird detail modal replaces fixed-crop hero ratios with the natural photo ratio (`h-auto`, full width, no forced aspect), so the full photograph is visible there too.
- Card grid spacing/layout is re-balanced for taller cards (grid stays 1/2/3/4 columns; card text block unchanged).
- `final proposal.md` §5.1 is amended: card image aspect ratio changes from "4:3 or 1:1" to **2:3 (portrait)**, matching the actual asset library (same amendment pattern as the §9 structure fix).
- Non-goal guardrails honored: no cropping-by-design remains for current photos; if future photos come in other ratios, data curation controls the ratio (assets stay in `public/images/`).

## Assumptions (recorded)

- **True-ratio display (2:3) over letterboxing**: showing the full photo in its native ratio is chosen over keeping 4:3 frames with `object-contain` letterboxing, because all six current photos are 2:3 portrait — letterboxing would burn ~15% of every card's height on empty bands. The 4:3/letterboxing and photo-resupply alternatives are documented as rejected alternatives in design.md.
- The modal hero shows the photo at full natural ratio (not a fixed 2:3 crop), keeping the visual hierarchy of proposal §5.1 (hero image, then metadata, then description).
- Hover behavior (`hover:scale-[1.02]`, elevation) is unchanged.

## Capabilities

### New Capabilities

- `bird-media-display`: The gallery and modal display bird photography at its native aspect ratio without cropping, so the full photograph is visible on every card and in the detail modal.

### Modified Capabilities

- *(none — `bird-imagery` has no existing spec; `openspec/specs/` contains only `theme-appearance`)*

## Impact

- `components/BirdCard.tsx` — container ratio `aspect-[4/3]` → `aspect-[2/3]`
- `components/DetailModal.tsx` — hero ratios (`aspect-video`, `sm:aspect-[21/9]`) → natural ratio (`w-full h-auto` pattern)
- `e2e/gallery.spec.ts` — image visibility assertions unaffected; may gain a no-crop assertion (rendered image aspect ≈ source ratio)
- `final proposal.md` §5.1 — aspect-ratio amendment
- No data, API, state, or theme changes; no new dependencies.
