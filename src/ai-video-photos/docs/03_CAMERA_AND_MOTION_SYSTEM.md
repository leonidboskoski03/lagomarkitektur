# Camera and Motion System

This document owns the camera path, lens language, easing, transformation behavior, and continuity rules.

## Core principle

The viewer perceives one continuous camera. Production uses multiple short clips sharing exact boundary frames.

One clip contains:

- One primary camera move.
- At most one small secondary camera adjustment.
- One main object/material transformation.

Major camera movement and major architectural transformation should not compete in the same five-second generation.

## Coordinate convention

Use the displayed drawing orientation defined in [01_PROJECT_SOURCE_LOCK.md](./01_PROJECT_SOURCE_LOCK.md).

The approved presentation direction for the plan-to-space move means:

- Camera position moves toward the screen lower-right, approaching from the courtyard side of the 90° counterclockwise-rotated plan.
- Camera target stays near the central circulation and living/dining zone.
- Camera looks diagonally across the house toward the opposite upper-left wing.

This connects the emerging interior to the courtyard-side exterior visualizations while revealing depth without changing or hiding the living zone.

## Lens language

| State | Full-frame equivalent | Character |
|---|---:|---|
| Opening table | 35–40 mm | Calm environmental three-quarter view |
| Overhead plan | 45–55 mm | Nearly orthographic, low distortion |
| Plan-to-space | 40–50 mm | Architectural axonometric feeling |
| Interior cutaway | 35–45 mm | Spatial but controlled |
| Exterior ending | Match approved render | Preserve factual perspective |

Avoid wider than approximately 28 mm. Avoid obvious focal-length changes within one clip.

## Camera path

1. **K00→K01:** Straight dolly toward the table with a very small vertical lift.
2. **K01→K02:** Crane and tilt into near-overhead view; no cut.
3. **K02→K03:** Camera remains top-down while the paper opens horizontally and reveals the complete registered plan.
4. **K03→K05:** Slow push until paper edges leave the viewport while physical paper relief dephysicalizes; K04 is an alias of K03 and has no separate motion passage.
5. **K05→K06:** Translate toward the screen lower-right/courtyard side, lower slightly, and tilt from top-down toward 60–65°. Keep the projective taper mild so the near foreground does not stretch.
6. **K06→K07:** Hold the approved K06 camera while the factual villa walls rise. The complete screen-right courtyard edge stays open; no perimeter fence or gate grows there.
7. **K07→K10:** Begin a slow controlled dolly/translation toward and into the completely open courtyard field on screen right. As the camera advances, orient gradually toward the real courtyard façade shown by the supplied render while keeping the living/circulation zone readable. Do not target a gate, threshold, or invented perimeter opening.
8. **K10→K11:** Orbit/rotate the 3D project view approximately 90° toward screen right while translating the camera into the center of the completely open courtyard. Lower from the raised cutaway to a mid-elevated architectural-model viewpoint and tilt toward the courtyard-facing façade. K11 remains a newly generated view of the same model—clean, controlled, and slightly elevated—not the final supplied render. The factual balcony, timber entrance beside it, taller glazed volume, roof, and exterior skins resolve during this move. The false door on the former axonometric screen-bottom edge disappears.
9. **K11→K12:** Continue lowering and easing forward/backward as required toward the approved real-render perspective. Resolve landscape density, façade micro-detail, glazing, curtains, exterior furniture, paving, and natural shadows while keeping the same courtyard-facing orientation.
10. **K12→K13:** Complete the last camera settle and visual-resolution handoff into the approved real exterior hero. K13 may reuse the exact normalized supplied render after that render is explicitly approved; K11 may not.

The house never scales independently during any exterior camera move. Apparent scale changes through camera distance only.

## Camera behavior

- No handheld shake.
- No sudden gimbal correction.
- No crash zoom.
- No hidden cut through flare, blur, or occlusion.
- No wall intersections.
- No shallow focus that hides geometry.
- Restrained motion blur because the experience pauses on intermediate frames.
- Horizon, target, and vanishing-point continuity are checked at every boundary.

## Rendered easing versus scroll mapping

There are two layers:

### Rendered cinematic easing

Motion inside the frames may accelerate and decelerate gently.

| Action | Behavior |
|---|---|
| Table approach | Near-constant motion with soft sine arrival |
| Crane to overhead | Smooth symmetrical cubic in/out |
| Paper unfold | Faster middle, 1–2% physical settle, no bounce |
| Paper-to-plan wave | Slow start, broad middle, soft finish |
| Spatial tilt | Symmetrical in/out |
| Wall growth | Decisive ease-out with restrained stagger |
| Furniture growth | Softer ease-out than walls |
| Material growth | Globally smooth progress with irregular front |
| Exterior descent | Long, restrained in/out |
| Final settle | Very long ease-out into stillness |

### Runtime scroll mapping

- Master media progress is linear (`ease: none`).
- ScrollTrigger owns one top-level playhead.
- Numeric scrub smoothing is tested around 0.35–0.65 seconds on desktop.
- Mobile uses direct or lighter smoothing.
- No mandatory snapping in the film.
- Text may ease separately while media remains linear.

## Transformation systems

### Paper unfold

- The visible outer face remains completely blank through K02; the canonical drawing is concealed on the inner face.
- The approved production version uses one complete horizontal opening from K02 to K03.
- K03 reveals the complete centered rotated plan and becomes the full physical-plan boundary.
- The former perpendicular K03→K04 unfold is omitted; K04 aliases the exact K03 file for documentation continuity.
- Fold axes are predetermined.
- Paper behaves like quality drawing stock, not cloth.
- No wind, flutter, curling chaos, or elastic bounce.
- Drawing lines remain registered across folds.

### Dephysicalization wave

- Begins at the central circulation spine.
- Pushes crease highlights, shadows, and fiber relief outward.
- Leaves exact black linework fixed.
- Moves beyond the viewport before completion.
- Reads as entering representational space, not cracking or damaging paper.

### Structure growth

Order:

1. Exterior/structural walls.
2. Internal partitions.
3. Door and window voids.
4. Fixed joinery and sanitary elements.
5. Furniture guides and volumes.

K07 ends after the factual structural shell and real glass-balustrade/opening corrections resolve. Furniture, sanitary fixtures, and fixed interior elements remain floor-level guides in K07 and gain white-clay volume in K08. The large screen-right courtyard edge remains completely open.

Wall behavior:

- Black line doubles.
- Thin side plane gains height.
- White wall rises from the line.
- Black top edge remains briefly.
- Construction edge softens at final height.

### Material growth

Order:

1. Light-oak floors/joinery.
2. Matte-white walls/cabinetry.
3. Pale stone.
4. Gray textiles and linen.
5. Black fixtures/details.

The material front changes shading only. It cannot change topology, add objects, or move furniture.

### Envelope and landscape

- Exterior skins resolve before the roof.
- Roof closes inward from parapet logic rather than falling from above.
- Terraces and boundary walls lock before planting.
- Landscape appears in order: paving, grasses, shrubs, trees, shadows.

## Continuity rules

- End frame of S(n) is the exact start file of S(n+1).
- Boundary files cannot be re-exported with different compression, grade, crop, or scale.
- Light direction and white balance remain stable.
- No independent keyframe regeneration after approval.
- A failed clip is regenerated from its approved frames; it is not extended to hide the failure.
- Every clip is reviewed forward, backward, slowly, and with rapid scrubbing.

## Scroll-authored holds

Use scroll allocation or frame reuse instead of duplicate still files at:

- K03/K04 alias — full physical plan.
- K05 — clean flat plan.
- K07 — complete wireframe.
- K10 — finished interior.
- K13 — exterior hero.

## Reduced motion

Use five still states:

1. Table.
2. Plan.
3. Wireframe.
4. Interior.
5. Exterior.

No long pin, camera travel, paper physics, or material propagation is required. The service story remains complete through semantic text.
