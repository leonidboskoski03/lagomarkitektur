# K09 — Partial Materials

## Frame contract

- Previous approved boundary: `../K08-white-clay-model/approved/K08_v001_targeted-white-clay-volume.png`.
- Purpose: show the material-growth system at approximately 50% completion, between the complete white-clay K08 model and the finished Scandinavian K10 interior.
- Camera and geometry: preserve every K08 pixel-level spatial relationship—camera, framing, crop, perspective, walls, openings, furniture, fixtures, balcony, yard gate, fence, paving fields, planting, and landscape boundaries.
- Permitted change: surface shading and material identity only. No topology, object, position, scale, orientation, or lighting-direction changes.
- Material origin: the open screen-right courtyard/living side, following the camera destination and the living room's role as the strongest material-growth passage.
- Coverage: every visible room shows material progress. The intermediate state remains incomplete through selected secondary surfaces/details across the model rather than leaving complete rooms neutral white clay.
- Motion implication: a surface-bound capillary reveal, not literal water, paint, smoke, particles, glow, melting, or a straight geometric wipe.

## K09 v001 material allocation

Materialize the courtyard/living side first and allow the front to reach selectively into the open-plan kitchen/dining zone:

1. Light natural oak on dry interior floors, dining furniture, and selective joinery.
2. Matte warm white on walls and cabinetry.
3. Pale limestone/travertine-family stone on kitchen and exterior mineral surfaces.
4. Light warm-gray woven textile and natural linen on existing furniture only.
5. Restrained matte-black fixtures/details only where the approved objects already exist.
6. Natural restrained greens only on the existing courtyard planting inside the materialized region.

The initial v001 spatial-front allocation is superseded by user review. K09 must distribute the base material family through the bedroom, bathroom, office/flexible room, living/dining, kitchen, and courtyard while withholding selected secondary finish/atmosphere details for K10.

## Generation prompt — v001 (superseded)

Use case: precise-object-edit  
Asset type: K09 boundary keyframe for a scroll-scrubbed architectural process film  
Primary request: edit the exact approved K08 white-clay cutaway so a restrained Scandinavian material system has grown inward from the open screen-right courtyard and living area across approximately 50% of the model.  
Input image: approved K08 v001 is the exact edit, camera, composition, geometry, furniture, and lighting target.  
Style/medium: premium architectural visualization retaining the clean white-clay/graphite language outside the materialized area.  
Material front: an irregular, calm, surface-bound capillary boundary; coherent across adjacent surfaces; no straight wipe and no literal liquid.  
Materials: low-saturation light oak, matte warm white, pale limestone/travertine, warm light-gray textiles, natural linen, minimal matte black, restrained natural green planting.  
Constraints: change surface shading/materials only; preserve the exact 16:9 frame, camera, perspective, crop, daylight direction, wall and opening geometry, furniture count and positions, kitchen, bathroom, storage slider, yard gate, fences, glass balustrade, courtyard, paving, planting, and every object. Keep approximately half the model neutral white clay.  
Avoid: complete material coverage, new or removed objects, moved furniture, geometry drift, roof, ceiling, added decor, saturated color, orange warmth, glossy finishes, heavy contrast, fantasy glow, water, paint splash, particles, smoke, liquid metal, text, labels, logos, or watermark.

## Candidates

| Version | Date | Material-front change | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K09_v001 | 2026-07-15 | Added the first courtyard-led Scandinavian material state to the exact approved K08 boundary | Restrained light-oak, warm-white, pale-stone, light-gray, matte-black, and natural-green palette; living/dining/courtyard relationship reads clearly; camera and overall shell remain visually stable | Entire bedroom and bathroom remained white clay, which read as missing texture rather than intentional progress; highlighted small-terrace edge remained opaque | Rejected by user review |
| K09_v002 | 2026-07-15 | Added bedroom and bathroom materials and attempted the glass-balustrade correction | Bedroom light oak/linen and bathroom pale-stone language resolved; all rooms participate in the material state | Changed the wrong terrace edge to glass and introduced an unapproved decorative plant on the bedroom storage | Rejected after QA |
| K09_v003 | 2026-07-15 | Corrected the exact highlighted opaque strip between the balcony seating and dotted terrace band to transparent glass | Balustrade occupies the correct extent and ends before the planting zone; successful materials remain stable | Unapproved bedroom-storage plant remained | Superseded by cleanup |
| K09_v004 | 2026-07-15 | Removed only the unapproved bedroom plant from v003 | Bedroom and bathroom are materially resolved; exact highlighted balcony edge reads as transparent glass with slim dark framing; no added bedroom decor | Bedroom, bathroom, and living/dining exterior window openings still lacked visibly readable glass planes; balcony frame needed clearer glass infill | Superseded by user glazing correction |
| K09_v005 | 2026-07-15 | Added nearly colorless low-reflection glazing only inside the three user-marked exterior window openings and the existing small-balcony frame | Bedroom, bathroom, living/dining, and balcony glass are readable through restrained cool-neutral edges/reflections; warm material palette and clean rendering remain visually stable | The central-lower small bedroom/office still showed a solid wall beside the worktable instead of its locked terrace-facing window | Superseded by user geometry correction |
| K09_v006 | 2026-07-15 | Replaced the central span of the solid screen-right office/guest-room wall beside the worktable with the locked terrace-facing clear window | Window spans the two work positions, retains short structural wall piers, looks toward the small terrace, and stays separate from the balcony balustrade; complete current geometry/material state | Repeated edit history left the overall frame softer and less smooth than the original clean-render quality | Retained as immutable geometry/material authority for rebuild |
| K09_v007 | 2026-07-15 | Fresh single-pass reconstruction using v006 as the sole geometry/material authority and K07 v001 only as a smoothness/clarity reference | Cleaner continuous wall and floor planes; crisper fine edges; clearer object separation; more uniform neutral light; reduced haze/mottling while preserving the current room organization, glazing relationships, and material direction | User explicitly selected this exact frame after review; later experiments do not modify the approved boundary | Approved |
| K09_v008 | 2026-07-15 | Attempted an isolated living-room lower-right wall correction after v007 | Demonstrated the requested local solid-wall reading | Introduced an incorrect perpendicular wall into the courtyard and exceeded the isolated edit scope | Rejected; never use as a boundary |

Generation route: built-in image model. v001 used approved K08 v001 as its exact target; v002–v006 were successive isolated corrections. v007 broke the edit chain with a fresh single-pass reconstruction: v006 controlled all geometry/material decisions and K07 v001 controlled rendering quality only. Each generated 1672 × 941 output was resized proportionally to 1680 × 945 with Lanczos filtering, without crop or retouching. Approved v007 SHA-256: `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`.

## Revision briefs

- v002: apply the approved bedroom light-oak/linen and bathroom pale-stone/warm-white palette; replace the user-highlighted opaque terrace edge with glass; change nothing else.
- v003: replace specifically the white vertical strip between the balcony seating and dotted terrace band with clear glass and minimal dark posts; preserve all materials and geometry.
- v004: remove only the unapproved plant added to the bedroom storage; preserve the corrected glass and all material work.
- v005: add clear low-reflection glass only inside the user-marked bedroom, bathroom, and living/dining window openings and inside the existing balcony-balustrade frame; preserve every material color, object, and geometry relationship.
- v006: replace only the central span of the small bedroom/office screen-right wall beside the two-position worktable with its locked terrace-facing clear window; retain wall piers and preserve the separate balcony balustrade and all materials.
- v007: reconstruct the complete v006 scene in one fresh pass; preserve v006's camera, room layout, openings, glazing, furniture, site, and material colors exactly while applying only the smooth clean planes, crisp fine edges, restrained shadows, and neutral clarity of the K07 v001 quality reference.

## Status

Approved — `K09_v007_clean-single-pass-rebuild.png`. Candidate and approved copies are byte-identical at 1680 × 945. This exact approved file is the sole K10 source boundary; do not apply the rejected v008 or any unpersisted later experiment.

## Approval

- Approved by explicit user review on 2026-07-15.
- Candidate: `candidates/K09_v007_clean-single-pass-rebuild.png`.
- Approved copy: `approved/K09_v007_clean-single-pass-rebuild.png`.
- Dimensions: 1680 × 945.
- SHA-256: `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`.
