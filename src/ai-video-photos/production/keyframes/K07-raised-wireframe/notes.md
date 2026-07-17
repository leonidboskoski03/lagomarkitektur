# K07 — Raised Wireframe Candidate Log

## Frame contract

- Frame: K07 — complete schematic raised shell before furniture volume and material development.
- Previous approved boundary: `K06_v002_courtyard-perspective-plan.png`.
- Purpose: prove that the exact 2D plan can become legible architectural space while retaining the courtyard-side view.
- Camera: preserve the approved K06 lower-right/courtyard-side direction, architectural lens character, and 16:9 composition.
- Geometry: every horizontal wall footprint, opening, room boundary, terrace, courtyard, circulation path, furniture guide, and the L-shaped sofa remain registered to the canonical plan.
- Raised content: exterior walls and internal partitions only, with real openings kept clear.
- Flat content: furniture, sanitary elements, paving, planting, and plan guides remain pale-gray linework at floor level.
- Courtyard condition: the complete screen-right edge is open. No perimeter wall, fence, gate posts, or raised threshold exists there.
- Camera destination after K07: travel into the open screen-right courtyard field and gradually orient toward the user-supplied real courtyard façade.
- Appearance: roofless matte warm-white clay shell, restrained gray side shading, fine black construction edges, continuous warm-white background.
- Vertical-data warning: wall, door, window, and ceiling heights are provisional because no section/elevation/CAD height data has been supplied.
- Next state: K08 will add white-clay fixed elements and furniture volumes only after K07 is approved.

## Candidate construction v001

```text
Use case: precise-object-edit
Asset type: K07 raised architectural wireframe boundary, 16:9
Input images: approved K06 v002 is the exact edit target and camera/composition boundary; architectural-blueprint-drawing.jpg is the technical geometry authority only.

Starting from K06, raise the exact architectural wall system from its existing black plan footprints into a clean monochrome white-clay wireframe shell. Exterior walls and internal partitions rise vertically from their registered lines. Keep real door gaps, window openings, passage openings, terraces, courtyard, and circulation exactly where shown. Show a roofless architectural cutaway from the same lower-right courtyard-side camera.

Preserve the framing, camera direction, plan orientation, courtyard on the right, warm-white background, every room boundary, opening, furniture footprint, L-shaped sofa, sanitary layout, courtyard seating, paving, and landscape-plan marks. Furniture and non-wall plan content stay flat as pale-gray guide linework; only walls and fixed architectural openings gain height.

Use matte warm-white wall planes, restrained neutral-gray side shading, fine carbon-black construction top and corner edges, and one consistent provisional residential wall height. No camera movement, foreground stretching, roof, ceiling, finished materials, furniture volumes, text, colored marks, fantasy effects, or new geometry.
```

Generation route: built-in image-editing model, followed only by a proportional resize from 1672 × 941 to the production canvas of 1680 × 945. No crop or additional geometry edit was applied.

## Candidate construction v002

```text
Use case: precise-object-edit
Asset type: K07 v002 raised-wireframe correction, 16:9
Input images: K07 v001 is the exact edit target; architectural-blueprint-drawing.jpg is geometry reference only.

Change only the outer courtyard boundary/fence along the far right edge. Raise the two right-side boundary segments into a clearly visible medium-height white-clay privacy/boundary wall. Preserve the intentional center-right courtyard entry as a clear gap; terminate both boundary segments cleanly on either side and never bridge the opening.

The boundary may reduce slightly with perspective, but it remains visibly three-dimensional and lower than the main villa walls. Preserve the exact camera, framing, building, openings, plan projection, courtyard, paving, planting, furniture linework, lighting, background, and construction-edge language. Furniture remains completely flat in K07. No camera movement and no change outside the right-side courtyard boundary height.
```

Generation route: built-in image-editing model, followed only by a proportional resize from 1672 × 941 to 1680 × 945.

## Candidates

| Version | Date | Construction change | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K07_v001 | 2026-07-15 | First white-clay raised-shell edit from approved K06 | Main room organization is readable; walls gain restrained height; furniture and site remain pale plan guides | Right courtyard boundary is too low and faint to read as a deliberate enclosure | Rejected |
| K07_v002 | 2026-07-15 | Raised the right courtyard boundary while preserving the center-right entry gap | Demonstrated clearer vertical hierarchy | User confirmed the boundary walls do not exist; superseded by open-courtyard correction | Rejected |
| K07_v003 | 2026-07-15 | Consolidated all requested geometry corrections in one edit | Opened courtyard and introduced dining/open-plan ideas | Changed unrelated rooms, walls, and plan composition | Rejected |
| K07_v004 | 2026-07-15 | Removed false right boundary and threshold; cleaned floor annotations | Open courtyard reads correctly; floor is calmer; main shell remains recognizable | Intermediate only; opening corrections not yet applied | Staged intermediate |
| K07_v005 | 2026-07-15 | Attempted all courtyard-facing openings together | Stronger glazing language | Put living glazing on the horizontal top wall instead of the screen-right courtyard wall | Rejected |
| K07_v006 | 2026-07-15 | Added adjacent-room window and local transparent terrace balustrade only | Local terrace relationship reads without closing the courtyard | Intermediate; living glazing still pending | Staged intermediate |
| K07_v007 | 2026-07-15 | Added broad living glazing on the correct screen-right courtyard wall | Courtyard façade relationship becomes legible; earlier corrections preserved | Intermediate; open-plan/dining/storage corrections pending | Staged intermediate |
| K07_v008 | 2026-07-15 | Removed false living/kitchen walls and restored flat dining table | Open-plan relationship and dining footprint read clearly | Intermediate; storage slider pending | Staged intermediate |
| K07_v009 | 2026-07-15 | Replaced storage hall-facing segment with sliding-door opening | All staged corrections coexist; furniture stays flat; open courtyard remains the camera destination | Confirm storage slider placement, terrace glass/window relationship, and no accumulated geometry drift | Pending review |
| K07_v010 | 2026-07-15 | Combined bathroom/hall/kitchen correction pass from v009 | Produced a stable visual base for later isolated edits | Bathroom door, hall panels, and kitchen wall were not all resolved accurately | Staged intermediate |
| K07_v011 | 2026-07-15 | Window-only generative pass | Attempted desk-side opening | Enclosed/reshaped the central room and terrace | Rejected |
| K07_v012 | 2026-07-15 | Combined room-window and balcony-glass generative pass | Interpreted glass-balcony intent | Changed the room and balcony footprint | Rejected |
| K07_v013 | 2026-07-15 | First deterministic window/glass-balcony overlay from v010 | Locked all unrelated geometry | Line weight too dark and pasted-on | Rejected styling draft |
| K07_v014 | 2026-07-15 | Softer deterministic glass/ground restoration | Improved line hierarchy | False outer-railing removal remained visibly soft | Rejected styling draft |
| K07_v015 | 2026-07-15 | Cleaned deterministic desk-side window, local glass balcony, and extra-railing removal | Preserved v010 shell exactly; balcony glass is localized before grass | Door and kitchen corrections still pending | Staged intermediate |
| K07_v016 | 2026-07-15 | First deterministic bathroom/hall/kitchen wall overlay | Mapped exact regions | Kitchen wall extended too far and read as pasted geometry | Rejected |
| K07_v017 | 2026-07-15 | Shortened deterministic kitchen wall and lighter door | Corrected intended wall extent | Retouch patches remained visible | Rejected |
| K07_v018 | 2026-07-15 | Bathroom-door-only generative edit from v015 | Added readable bathroom door in the correct existing gap | Hall doors and kitchen wall pending | Staged intermediate |
| K07_v019 | 2026-07-15 | Hall-door-only generative removal | Removed target panels | Added unrelated central geometry | Rejected |
| K07_v020 | 2026-07-15 | Deterministic partial hall-panel removal from v018 | Preserved bathroom and shell | Upper panel portions remained | Staged intermediate |
| K07_v021 | 2026-07-15 | Full deterministic hall-panel removal | Created open passages | Left visible rectangular retouch patches | Staged intermediate |
| K07_v022 | 2026-07-15 | Cosmetic blend of hall-panel removal | Removed the two false doors cleanly; bathroom door retained | Kitchen hall-side wall still missing | Staged intermediate |
| K07_v023 | 2026-07-15 | Kitchen-wall-only generative edit from v022 | Restored a coherent hall-side wall while retaining previous door/window/balcony corrections | Confirm exact wall stopping point and circulation; check for accumulated generative simplification | Pending review |
| K07_v024 | 2026-07-15 | Cut a blank hall opening into the screen-top wall of the bottom-left room | Establishes the requested room-to-hall passage without a door object | Verify opening width and retained wall returns | Staged intermediate |
| K07_v025 | 2026-07-15 | Cut a blank opening into the living room's screen-lower wall | Establishes the requested living-to-circulation passage while retaining v024 | Verify alignment and opening width | Staged intermediate |
| K07_v026 | 2026-07-15 | Removed only the bathroom/closet door leaf | Leaves a clean blank opening and retains both earlier passages | Verify no wall closure or doorway drift | Staged intermediate |
| K07_v027 | 2026-07-15 | Added the screen-bottom yard boundary fence only | Gives the yard a readable lower boundary while keeping the screen-right/front approach open | Verify fence extent and that the right-side approach remains unobstructed | Staged intermediate |
| K07_v028 | 2026-07-15 | Added a thin top-edge rail to the existing localized balcony glass | Retained the five requested local changes | Missing yard gate and storage slider; repeated edits accumulated pink mottling, haze, blur, and softened linework | Rejected |
| K07_v029 | 2026-07-15 | Fresh single-pass rebuild using v028 for latest geometry, v001 for rendering quality, and v009 for storage-slider reference | Cleaner white-clay rendering and a visible yard gate | v001 overpowered the edit and reverted the accepted balcony, kitchen wall, storage-slider location, and later room geometry | Rejected |
| K07_v030 | 2026-07-15 | User-supplied clean full-frame replacement; proportional normalization from 1672 × 941 to 1680 × 945 only | Clean neutral-white background, crisp line hierarchy, coherent shell and furniture, readable site, visible yard access, no accumulated pink haze | Wall/opening heights remain provisional because technical vertical data is unavailable | Approved |

## Staged correction prompts and references

- References: `K07_v003_reference-sheet_A.png`, `K07_v003_reference-sheet_B.png`, `architectural-blueprint-drawing.jpg`, and `courtyard-open-facade-reference.png`.
- K07 v003: one consolidated precise-object edit containing all ten requested corrections; rejected for global geometry drift.
- K07 v004: removal-only pass from v002—delete right perimeter walls, flatten false bottom threshold, remove bottom-left window artifact, and clean technical annotations.
- K07 v006: from v004, add only the adjacent-room screen-right window and the local transparent terrace balustrade.
- K07 v007: from v006, widen only the living room's screen-right courtyard glazing; explicitly prohibit editing the horizontal top wall.
- K07 v008: from v007, remove only false living/kitchen walls and restore the dining table/chairs as flat plan guides.
- K07 v009: from v008, replace only the small storage closet's hall-facing wall segment with a floor-level sliding panel/track.
- All passes used the built-in image-editing model and were proportionally resized from 1672 × 941 to the 1680 × 945 production canvas without cropping.
- V013–V017 and V020–V021 used deterministic pixel-bounded overlays/retouching after generative geometry drift; the successful visual chain continued through v015, v018, v022, and v023.
- V024–V028 used five sequential built-in image-editing passes from v023, each limited to one user-annotated change: bottom-left opening, living-room opening, bathroom/closet door-leaf removal, screen-bottom yard fence, then thin balcony-glass rail. Each generated 1672 × 941 image was resized proportionally to 1680 × 945 without cropping. Generation stopped after the fifth candidate for user review.
- V029 used one fresh built-in image-editing pass rather than another stacked retouch. Input roles were explicit: v028 controlled current geometry, v001 controlled only smooth neutral-white rendering quality and yard-gate language, v009 supplied only the historical storage-slider reference, and the user markup located both missing elements. The generated 1672 × 941 image was resized proportionally to 1680 × 945 without cropping.
- After v029 rejection, multiple unsaved built-in local-edit tests used v028 alone plus a precise location map. The yard gate could be restored, but the model repeatedly misplaced the storage slider as a horizontal bedroom-wall line or omitted it. These tests were discarded and were not promoted to candidate versions.
- V030 source: `C:/Users/Leonyx/Downloads/ChatGPT Image Jul 15, 2026, 09_59_17 PM.png`, supplied and explicitly approved by the user as the final K07 frame. Original source SHA-256: `2BFF502930540AAB8F2A3E21A7AA12D61317C8629CC5BA09E11C8748DE6BEE7B`. The only processing was a proportional Lanczos resize from 1672 × 941 to the standard 1680 × 945 production canvas. No crop, redraw, generation, color correction, geometry edit, or retouch was applied.

## Approval

K07 is approved. Candidate and approved filename: `K07_v030_user-approved-clean-wireframe.png`, 1680 × 945. Geometry and visual QA were accepted by the user on 2026-07-15. S07 now has approved K06 and K07 boundaries. K08 must reuse the exact approved K07 file as its source and may change only explicitly audited white-clay furniture/fixed-element volume; camera, shell, openings, site, balcony, yard gate, landscape, line language, and lighting remain locked.
