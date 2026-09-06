# bird-media-display

## Purpose

Governs how bird photography is displayed throughout the gallery: photographs render at their native aspect ratio in both the card grid and the detail modal, so visitors always see the complete photograph rather than a cropped section.

## ADDED Requirements

### Requirement: Bird cards show the full photograph
The system SHALL lay out every bird photo on a gallery card in a portrait 2:3 container — the native ratio of the current photo library — so that the card scales to the photo without cropping its content. The card image area SHALL render the complete photograph; no part of the photo (head, tail, wings) SHALL be cut off by the card.

#### Scenario: Portrait photo on a bird card
- **WHEN** a bird card renders a 200×300 (2:3 portrait) photograph
- **THEN** the image fills the card's 2:3 image area and the entire photo content is visible, with no cropping

#### Scenario: Different standard-ratio photo
- **WHEN** a bird card renders a photograph whose ratio is not exactly 2:3 (e.g., a future landscape asset)
- **THEN** no photo content is lost: the photo is positioned within the card image area so that its subject remains fully visible

### Requirement: Detail modal shows the complete photograph
The bird detail modal SHALL display the selected photograph with its full natural height — no fixed hero aspect ratio and no crop — while preserving the modal's visual hierarchy (image first, then name/scientific name, then habitat tag, then description). The modal content SHALL remain scrollable within its viewport-bounded height.

#### Scenario: Opening the modal on a portrait photo
- **WHEN** the bird detail modal opens for a bird with a 2:3 portrait photograph
- **THEN** the full photo is visible above the metadata, not cropped to a landscape strip

#### Scenario: Modal stays usable with tall photos
- **WHEN** the modal renders with a full-height portrait hero
- **THEN** the content (image, names, habitat, description) remains scrollable within the modal's max viewport height and remains fully operable

### Requirement: Image rendering stays responsive and sized correctly
Bird imagery SHALL remain responsive across the reference viewports (Desktop 1440px, Mobile 390px), with correctly sized image sources requested at each breakpoint (no universal-size loading), consistent with the grid responsive behavior of the project.

#### Scenario: Desktop and mobile rendering
- **WHEN** the gallery or modal loads at Desktop 1440px or Mobile 390px
- **THEN** bird images request appropriately sized variants for the viewport and render without distortion, stretching, or cropping

### Requirement: Hover behavior is preserved
The bird card hover interactions defined by the existing gallery design (elevation on hover, image zoom on hover) SHALL continue to work with the new image display.

#### Scenario: Hover on a card with a full photo
- **WHEN** the user hovers over a bird card
- **THEN** the card elevates and the image scales as before, with no new clipping or cropping introduced by the zoom
