# K03 — Horizontal Unfold Candidate Log

## Frame contract

- Frame: K03 — first horizontal unfold.
- Previous approved boundary: `K02_v003_overhead-large-paper.png`.
- Purpose: complete the architectural reveal without changing camera or studio continuity.
- Camera: identical to K02; centered near-overhead, 45–55 mm full-frame equivalent, nearly orthographic.
- Paper state: the approved production version is fully opened horizontally into the wide physical-plan state; no second unfold is produced.
- Drawing state: the complete cleaned plan is visible, rotated 90° counterclockwise with the courtyard/site on the right.
- Registration: `L28_plan_rotated-ccw_bold-interior_with-L-sofa.png` is the immutable ink master for K05 and later geometry states.
- Next state: K05 zooms into and dephysicalizes the paper into the flat blueprint world. K04 aliases this exact K03 file.

## Source references

- `../K02-overhead-folded-plan/approved/K02_v003_overhead-large-paper.png` — exact camera, table, objects, light, and continuity source.
- `../../../architectural-blueprint-drawing.jpg` — canonical room order, walls, doors, windows, and opening geometry; early furniture symbols are secondary.
- `references/L28_plan_clean_full-portrait.png` — cleaned portrait master derived directly from the canonical drawing.
- `references/L28_plan_clean_K03-upper-half.png` — exact upper half used by K03; K04 must reuse the full portrait master.
- `references/L28_plan_clean_rotated-ccw.png` — source-derived film-orientation master with courtyard/site on the right.
- `references/L28_plan_rotated-ccw_bold-interior.png` — source-derived structural and strengthened interior/furniture mask.
- `references/L28_plan_rotated-ccw_bold-interior_refined-yard.png` — active ink mask with courtyard hatch reduced while meaningful exterior objects remain.
- `references/L28_living-sofa_source-crop.png` — canonical living-room sofa source detail.
- `references/L28_plan_rotated-ccw_bold-interior_with-L-sofa.png` — v008 registered ink mask with source sofa restored.
- `../../../docs/01_PROJECT_SOURCE_LOCK.md` — architectural authority.
- `../../../docs/03_CAMERA_AND_MOTION_SYSTEM.md` — fold order and camera lock.

## Candidate prompt v001 — First horizontal reveal

```text
Use case: precise-object-edit
Asset type: K03 horizontal-unfold boundary keyframe for a scroll-driven architectural process film
Input images: Image 1 is approved K02 v003 and the sole scene/edit target. Image 2 is the canonical L-28 architectural drawing and controls the revealed plan content only.

Keep Image 1's 16:9 frame, near-overhead camera, round mineral-composite table, studio floor, lighting, shadows, and all four supporting objects exactly fixed. Change only the central folded paper.

Open only the first fold axis horizontally. The former upright A3 closed packet becomes one wide, flat A2-like rectangular paper state centered at the same point, with a precise vertical fold crease at its center and restrained realistic drawing-paper relief. The perpendicular fold remains closed, so this is not the final full A1 sheet. The paper must lie flat after a subtle physical settle; no hands, wind, flutter, curl, bounce, torn edges, or extra panels. Keep clear separation from the surrounding samples, ruler, and pencil.

Reveal only the central horizontal portion of Image 2's real L-28 plan that belongs on the newly exposed inner panels. Preserve its actual walls, openings, furniture footprints, circulation, terrace relationships, and orientation. Render the visible drawing as precise black and restrained neutral-gray architectural linework on natural-white paper. Keep it centered and registered across the fold crease. Remove red, green, blue, or magenta marks and omit labels, letters, numbers, dimensions, grid bubbles, north arrow, and readable text.

Do not show the complete plan or begin the perpendicular unfold. Do not change the camera, table, props, material palette, object positions, daylight direction, crop, or white balance. No new objects, deleted objects, duplicated objects, booklet, page stack, fantasy effects, cracking, glowing lines, people, hands, logo, text, or watermark.
```

## Candidates

| Version | Date | Prompt change | What worked | Failure | Decision |
|---|---|---|---|---|---|
| K03_v001 | 2026-07-14 | First horizontal unfold from approved K02 v003 with canonical-plan reference | Established a plausible wide two-panel paper state and black/gray line character | Camera pulled back, props shifted, paper widened too far, and almost the complete plan was revealed | Rejected |
| K03_v002 | 2026-07-14 | Tighter paper footprint and stricter scene lock | Better partial reveal, camera scale, and two-panel fold state | AI still shifted the four supporting objects outward | Rejected as boundary; used only as the paper-region source for v003 |
| K03_v003 | 2026-07-14 | Deterministic continuity composite: v002 paper region placed into exact approved K02 v003 scene | Preserves the approved K02 camera and every supporting object while showing the first horizontal unfold and limited plan band | Plan remained an AI interpretation rather than source geometry | Superseded |
| K03_v004 | 2026-07-14 | Replaced AI-interpreted plan with the cleaned upper half of the canonical portrait drawing | Source-matched room order, walls, doors, and window/opening positions; exact K02 camera and props remain fixed | Source paper tone transferred as a visible rectangular patch; orientation placed courtyard below rather than right | Superseded |
| K03_v005 | 2026-07-14 | Rebuilt continuous paper surface; applied thresholded ink-only geometry and rotated plan 90° counterclockwise | Approved geometry, integration, orientation, and object positions | Interior/furniture symbols were too faint at the K03 scale | Superseded |
| K03_v006 | 2026-07-14 | Strengthened structural, furniture, sanitary, living, bedroom, flexible-room, and courtyard linework from the source | Bed/sofa and adjacent-room furniture become clearly readable | Repetitive courtyard hatch became too dominant at full-frame scale | Rejected |
| K03_v007 | 2026-07-14 | Retained v006 interior hierarchy while reducing low/mid-strength courtyard hatch | Stronger bedroom, adjacent-room, living, kitchen, sanitary, and courtyard-object readability without changing geometry | Canonical L-shaped sofa disappeared during faint-line thresholding | Superseded |
| K03_v008 | 2026-07-14 | Recovered only the canonical living-room sofa from its exact source footprint and merged it into the v007 ink hierarchy | L-shaped sofa is legible along the top/right of the rotated top-center living room; all other geometry, paper, camera, and objects remain unchanged | None at boundary review | Approved |

## Approval

## Approval

- Approved filename: `K03_v008_horizontal-unfold_L-sofa-restored.png`
- Dimensions: 1680 × 945 (16:9)
- Approved by: user
- Approval date: 2026-07-14
- Geometry QA: room order, walls, doors, windows, furniture anchors, rotated courtyard orientation, and L-shaped living-room sofa accepted.
- Visual QA: physical paper integration, line hierarchy, table continuity, and supporting-object continuity accepted.
- Neighbor dependencies: exact physical-plan start boundary for S05 and immutable linework source for K05.
