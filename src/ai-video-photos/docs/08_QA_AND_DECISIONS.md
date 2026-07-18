# QA, Decisions, and Approval Gates

This document records material decisions and owns cross-phase approval. Sequence-specific failures stay in their sequence cards.

## Decision status

| ID | Decision | Status | Reason / next action |
|---|---|---|---|
| D001 | White paper with black ink | Approved | Required creative direction |
| D002 | Real plan controls walls, doors, windows, and furniture | Approved | Architectural credibility |
| D003 | Interior is Scandinavian and restrained | Approved | User-provided material brief |
| D004 | Hybrid deterministic + AI workflow | Approved | AI alone cannot guarantee technical geometry |
| D005 | Kling uses short start/end passages | Approved | Continuity and regeneration control |
| D006 | WebP frame sequence is primary web candidate | Approved for prototype | Deterministic forward/reverse scrub |
| D007 | Lottie is vector-overlay only | Approved | Photorealistic/3D effects do not fit true Lottie delivery |
| D008 | Camera moves southwest while targeting central/living zone | Superseded by D022 | Direction revised after K06 v001 review |
| D009 | Visualization 1 is K13 final | Approved | K13 v001 approved exactly through D049 |
| D010 | Consultant begins the service narrative | Proposed | Most natural process order |
| D011 | Opening table material | Approved | Warm off-white mineral composite retained in approved K00 v008 |
| D012 | Primary film stays daylight-led | Proposed | Best match to project renders; dusk may be optional later |
| D013 | Closed folded paper visibility | Superseded by D020 | K00–K02 remain blank; K03 now completes the reveal in one horizontal opening |
| D014 | Opening object set and paper scale | Approved | A3 folded packet plus thin limestone, oak veneer, ruler, and pencil; no linen |
| D015 | K02 near-overhead boundary | Approved | K02 v003 approved by user; camera, blank paper, and object system become fixed inputs for K03 |
| D016 | Early plan geometry emphasis | Approved | K03/K04 match source room order, walls, doors, and windows; furniture marks may be visually simplified at this scale |
| D017 | Plan orientation and ink integration | Approved | Rotate source plan 90° counterclockwise so courtyard is right; transfer ink only, never the source-paper tone or shadow |
| D018 | Interior-plan line hierarchy and additions | Approved | Strengthen furniture/interior symbols; source remains the base, with restrained additions allowed inside fixed rooms/courtyards |
| D019 | Living-room L-shaped sofa | Approved | In rotated orientation, restore the canonical sofa along the top and right edges of the top-center living room |
| D020 | K03 approval and single-unfold simplification | Approved | K03 v008 is the complete physical-plan boundary; K04 aliases it and the next produced state is K05 blueprint world |
| D021 | K05 flat blueprint-world boundary | Approved | K05 v002 approved; exact geometry on continuous warm white with all physical paper/studio cues removed |
| D022 | K06 approaches from lower-right courtyard side with restrained perspective | Approved | K06 v002 approved by user as the camera boundary for K07 |
| D023 | K07 may use provisional vertical dimensions for wireframe review | Approved for test only | Horizontal plan geometry remains locked; real heights are still unknown |
| D024 | K07 boundary, K08 furniture, and courtyard-entry camera staging | Superseded by D025 | User confirmed the previously raised right boundary does not exist |
| D025 | Open courtyard, corrected K07 shell, and courtyard-field camera target | Approved direction; K07 frame pending | Real render and plan corrections establish the factual open edge and façade relationship |
| D026 | K07 bathroom/hall doors, kitchen wall, desk window, and balcony glass | Approved direction; K07 frame pending | User-marked corrections refine the shell before K07 approval |
| D027 | K07 blank openings, bottom-edge yard fence, and balcony-glass rail | Approved direction; K07 frame pending | User-annotated five-pass refinement; review v028 before approval |
| D028 | K07 clean rebuild, yard gate, and storage slider restoration | Rejected implementation | v029 reverted accepted later geometry; v028 restored as base |
| D029 | K07 v028 restoration and exact storage-slider location | Approved direction; K07 frame pending | Slider is on the screen-right vertical opening of the small square storage room at the far-left end of the hall |
| D030 | User-supplied K07 v030 clean boundary | Approved | Exact supplied frame locked after proportional canvas normalization only; K08 becomes active |
| D031 | K08 dimensional audit and targeted v001 candidate | Approved direction; K08 frame pending | Major K07 volumes locked; only under-resolved bathroom/storage/office/fixed details may gain clay volume |
| D054 | Reject S03 v001 and review hinge-aligned K02 v004 | Candidate review pending | v001 translates/recenters the paper; v004 registers the folded packet to K03's fixed right half; no v002 before approval |
| D055 | Approve exact user-supplied K02 v005 and authorize S03 v002 | Approved | v005 becomes the immutable hinge-aligned motion boundary; submit one hinge-locked retry and hold it for review |
| D056 | Complete S03 v002 hinge-locked retry | Candidate under review | whole-sheet translation is materially corrected; user reviews mid-fold taper/shadow and reverse scrub before approval |
| D057 | Re-register K01 to approved K02 v005 | Approved | K01 v002 is byte-identical in candidate/approved and becomes the active S02 start; K02 v005 remains unchanged; one S02 v001 submission authorized |
| D058 | Complete S02 v001 camera test | Candidate under review | camera move is coherent, but delivered boundaries are resampled and the endpoint remains oblique rather than exact K02 bird's-eye; no automatic retry |
| D059 | Test exact-tail S02B continuation | Rejected as seamless assembly candidate | split concept is valid, but Kling re-renders the exact bridge at a closer crop and still misses exact K02; preserve all assets and do not auto-resubmit |
| D060 | Approve user-supplied five-second S02B and close S02 | Approved | v002 opening/end registration and slow camera continuation pass review; clean ten-second split master becomes authoritative; activate S03 |

## Open questions

- Can CAD/PDF/DWG be supplied?
- What are confirmed room names?
- What are wall, ceiling, window, and door heights?
- Which plan annotations remain visible?
- Is the interior explicitly a film proposal?
- Which K13 exterior render is final?
- Is the first production desktop-only or desktop/mobile together?
- Must service labels follow current website numbering?

## Decision record template

```md
### D0XX — Decision title

- Date:
- Status: Proposed / Approved / Rejected / Superseded
- Decision:
- Alternatives considered:
- Reason:
- Affected documents/sequences:
- Follow-up:
```

## Gate 0 — Source lock

- [x] Descriptive project text supplied.
- [x] Technical plan supplied.
- [x] Exterior visualizations supplied.
- [ ] Architectural unknowns supplied or explicitly accepted.
- [ ] Room functions confirmed.
- [ ] Ambiguous plan symbols reviewed.
- [ ] Final exterior hero approved.

## Gate 1 — Visual language

- [x] Three K00 table directions generated with controlled variables.
- [x] One table material approved: warm off-white mineral composite.
- [x] Object count/positions approved.
- [x] Paper and black-line character approved in principle; exact real-plan fragment remains a deterministic overlay requirement.
- [x] Light direction approved.
- [x] Environment can plausibly support K02 overhead view.

### D011 — Opening table material

- Date: 2026-07-14
- Status: Approved
- Decision: Use the warm off-white mineral-composite world, now represented by `K00_v008_mineral-table_large-paper.png`, as the approved K00 opening boundary.
- Alternatives considered: K00 v004 pale limestone and K00 v006 light oak.
- Reason: User selected the mineral-composite direction after controlled comparison.
- Affected documents/sequences: K00, K02 derivation, S01, and S02.
- Follow-up: K00 v005 is superseded as a boundary by v008's corrected paper scale and object system; preserve the approved environment when deriving K02.

### D013 — Closed folded paper visibility

- Date: 2026-07-14
- Status: Superseded by D020
- Decision: The paper's visible outer face is completely blank in K00, K01, and K02. The original two-stage reveal was replaced after K03 evolved into the complete approved plan state.
- Alternatives considered: Showing a small plan fragment on the closed top face.
- Reason: The unfolding itself is the narrative reveal; early visible linework weakens that reveal.
- Affected documents/sequences: K00–K04 and S01–S04.
- Follow-up: Supersede K00 v005 with a blank-paper correction after review; reject K02 v001 and review K02 v002.

### D014 — Opening object set and paper scale

- Date: 2026-07-14
- Status: Approved
- Decision: Use an approximately A3 closed packet representing an A1 sheet folded twice. Retain only a thin pale-limestone façade sample, thin light-oak veneer sample, recognizable matte-black architectural ruler, and black mechanical pencil. Remove the linen swatch without replacement.
- Alternatives considered: Five-object styling set including a linen swatch and thick stone/wood blocks.
- Reason: The linen read as a napkin, the blocks read as coasters, and the small paper weakened the reveal. The revised objects connect directly to the villa and architectural process.
- Affected documents/sequences: K00–K04 and S01–S04.
- Follow-up: Complete. K00 v008 was approved by the user; derive K02 v003 from it without revealing the concealed drawing.

### D015 — K02 near-overhead boundary

- Date: 2026-07-14
- Status: Approved
- Decision: Use `K02_v003_overhead-large-paper.png` as the approved near-overhead boundary.
- Alternatives considered: K02 v001 with premature linework and K02 v002 with the superseded small-paper/five-object layout.
- Reason: The user approved the near-overhead framing, larger blank folded paper, mineral table, and simplified architectural object system as a coherent continuation of K00 v008.
- Affected documents/sequences: K02, K03, K04, S02, S03, and the paper-fold rig.
- Follow-up: Derive K03 from this exact file. Keep the camera and props locked; reveal only the plan portion exposed by the horizontal unfold.

### D016 — Early plan geometry emphasis

- Date: 2026-07-14
- Status: Approved
- Decision: K03 and K04 must derive their room order, walls, doors, windows, and opening positions directly from `architectural-blueprint-drawing.jpg`. Furniture symbols may be visually simplified for early-plan readability; this does not relax the later furniture-footprint lock for K08–K10.
- Alternatives considered: AI-interpreted plan linework and fitting the complete portrait plan into the K03 landscape paper state.
- Reason: The architectural identity must be recognizable from the real project geometry, while the first unfold should reveal only the physically exposed half of the portrait master.
- Affected documents/sequences: K03–K10, S03–S09, plan master, paper rig, and geometry QA.
- Follow-up: Review K03 v004, then reuse the same cleaned portrait plan master for K04 rather than regenerating the drawing.

### D017 — Plan orientation and ink integration

- Date: 2026-07-14
- Status: Approved
- Decision: Rotate the cleaned canonical plan 90° counterclockwise so the exterior courtyard/site reads on the right. Composite only transparent black/neutral-gray ink onto the physical paper; the source JPG's paper color, rectangular bounds, and shadows must never transfer.
- Alternatives considered: Unrotated portrait linework and a flattened source-image patch placed over the paper.
- Reason: The rotated layout supports the landscape film frame, while shared paper lighting prevents the drawing from reading as a pasted printout.
- Affected documents/sequences: K03–K07, S03–S07, plan master, paper rig, and dephysicalization transition.
- Follow-up: Review K03 v005, then define the exact partial/full reveal masks for K03 and K04 from `L28_plan_clean_rotated-ccw.png`.

### D018 — Interior-plan line hierarchy and additions

- Date: 2026-07-14
- Status: Approved
- Decision: Make interior and furniture linework more visible, especially the bottom-left bedroom/bed-sofa, its adjacent flexible room, the living room, and courtyard furniture. The source drawing remains the base. Restrained Scandinavian furniture or courtyard symbols may be added inside existing room/courtyard boundaries when useful, but walls, doors, windows, circulation, and room extents cannot change.
- Alternatives considered: Keeping the source's very pale furniture lines or freely redesigning the complete floor plan.
- Reason: The source geometry is correct, but pale furniture disappears at the K03 scale and weakens the transition toward the future interior.
- Affected documents/sequences: K03–K10, S03–S10, plan master, furniture blockout, and geometry QA.
- Follow-up: Review K03 v007. No new furniture was invented in this revision because the source already contained sufficient bedroom, flexible-room, living, and courtyard information; additions remain available later if needed.

### D019 — Living-room L-shaped sofa

- Date: 2026-07-14
- Status: Approved
- Decision: Restore the source drawing's L-shaped sofa in the rotated top-center living room. Its long run follows the top wall and its return descends along the right wall.
- Alternatives considered: Inventing a replacement sectional or leaving only the two lounge chairs and tables.
- Reason: The sectional is a meaningful furniture anchor in the canonical plan and was lost when pale source lines were thresholded.
- Affected documents/sequences: K03–K10, S03–S10, plan ink master, and furniture blockout.
- Follow-up: Review K03 v008 and carry the same sofa footprint into every later plan, wireframe, clay, and finished-interior state.

### D020 — K03 approval and single-unfold simplification

- Date: 2026-07-14
- Status: Approved
- Decision: Approve `K03_v008_horizontal-unfold_L-sofa-restored.png` as the complete physical-plan boundary. The former K04 perpendicular unfold is omitted; K04 aliases the exact K03 file without a duplicate export. Production proceeds directly to K05, the zoomed flat blueprint-world state.
- Alternatives considered: Producing a second vertical unfold and a separate K04 physical-paper frame.
- Reason: The approved K03 already contains the complete source-matched plan and the user explicitly selected zooming/entering the blueprint as the next stage.
- Affected documents/sequences: K03–K05, S03–S05, paper rig, camera path, scroll allocation, and reduced-motion plan state.
- Follow-up: Create K05 from the exact registered ink master, keeping every architectural and furniture line fixed while removing only physical paper/studio cues.

### D021 — K05 flat blueprint-world boundary

- Date: 2026-07-15
- Status: Approved
- Decision: Approve `K05_v002_flat-blueprint-world_warm-white.png` as the flat representational-plan boundary.
- Alternatives considered: K05 v001 with a darker gray paper-derived background.
- Reason: K05 v002 preserves the exact rotated plan, furniture hierarchy, courtyard-right orientation, and L-shaped sofa while removing all table, prop, paper-edge, crease, shadow, fiber, and studio cues.
- Affected documents/sequences: K05–K07, S05–S07, spatial camera rig, structure-growth overlay, and reduced-motion plan state.
- Follow-up: Derive K06 through a projective camera transform only. Do not raise walls, move furniture, or alter plan topology in K06.

### D022 — K06 courtyard-side camera revision

- Date: 2026-07-15
- Status: Approved
- Decision: Move the K05→K06 camera toward the screen lower-right/courtyard side of the rotated plan while continuing to target the central circulation and living zone. Use a restrained 40–50 mm-equivalent architectural perspective with only mild near-edge expansion.
- Alternatives considered: K06 v001's southwest/lower-left approach and stronger foreground taper.
- Reason: The available exterior visualizations are courtyard-side views, so the camera path should travel toward that side. K06 v001 also stretched the foreground too strongly.
- Affected documents/sequences: K06–K13, S06–S13, camera rig, wireframe build, interior reveal, and exterior transition.
- Follow-up: Complete. `K06_v002_courtyard-perspective-plan.png` was approved by the user and copied unchanged into the K06 approved folder. K07 must derive from this camera boundary.

### D023 — K07 provisional vertical system

- Date: 2026-07-15
- Status: Approved for test only
- Decision: Begin K07 as a monochrome raised-shell review using one consistent provisional residential wall height. The supplied plan remains authoritative for every horizontal wall footprint, opening, room, terrace, courtyard, and furniture guide. Door, window, wall, and ceiling heights are not architecturally approved until vertical information is supplied.
- Alternatives considered: Blocking all K07 exploration until CAD/PDF/DWG and vertical dimensions arrive.
- Reason: The user explicitly approved K06 and asked to begin K07. A schematic white-clay candidate lets the spatial language and camera continuity be evaluated without presenting unknown heights as factual.
- Affected documents/sequences: K07–K11, S07–S11, geometry QA, and future 3D reconstruction.
- Follow-up: K07 v001 exposed a courtyard-boundary visibility problem. Review v002 under D024; do not approve K07 solely on appearance.

### D024 — Courtyard boundary, furniture staging, and entry target

- Date: 2026-07-15
- Status: Superseded by D025
- Decision: In K07, raise the right-side courtyard boundary into a clearly visible schematic privacy/boundary wall while keeping it lower than the villa walls and preserving the entry gap at the center-right edge. Keep furniture and sanitary elements flat in K07; they gain white-clay dimensional volume in K08. After the K07 structural hold, move the camera gradually toward the preserved center-right courtyard entry.
- Alternatives considered: Leaving the boundary as a nearly flat line, raising furniture during K07, or continuing toward a generic central target.
- Reason: Perspective may reduce the apparent boundary height, but K07 v001 made it too weak to read. Separating structural growth from furniture growth produces clearer storytelling, while the real courtyard entry gives the subsequent camera path a meaningful project-specific destination.
- Affected documents/sequences: K07–K10, S07–S10, camera rig, courtyard geometry, furniture blockout, and later exterior transition.
- Follow-up: Superseded. The user confirmed that both raised screen-right boundary segments must be removed completely and that the camera travels into the open courtyard rather than toward an entry gap.

### D025 — Open courtyard and corrected K07 shell

- Date: 2026-07-15
- Status: Approved direction; K07 frame pending
- Decision: Keep the complete screen-right courtyard edge open and direct later camera travel into that open field toward the real courtyard façade. Correct K07 by flattening the false bottom threshold, removing the bottom-left window artifact, restoring the adjacent-room terrace window and glass balustrade, widening the living-room courtyard glazing, removing false living/kitchen walls, restoring the dining table as flat linework, replacing the storage hall wall with a sliding-door opening, and removing technical annotations from the floor. Furniture remains flat until K08.
- Alternatives considered: Raised courtyard boundary walls, a center-right gate target, one consolidated generative correction, and moving furniture growth into K07.
- Reason: The user-supplied real render proves the courtyard is completely open and confirms the glazing/balustrade relationship. The first consolidated correction changed unrelated geometry, so the accepted production strategy is a sequence of smaller targeted edits.
- Affected documents/sequences: K07–K10, S07–S10, camera rig, geometry source lock, opening schedule, furniture blockout, and courtyard transition.
- Follow-up: Review `K07_v009_corrected-open-courtyard-wireframe.png` against the marked corrections. Do not approve automatically; confirm especially the storage slider and small terrace/window relationship.

### D026 — K07 detailed door, wall, window, and balcony corrections

- Date: 2026-07-15
- Status: Approved direction; K07 frame pending
- Decision: Add the missing top-left bathroom door; remove the two false hall doors; restore the kitchen wall facing the hall while keeping kitchen/living open-plan; add the central-lower desk room's terrace-facing window; replace the true balcony's opaque enclosure with a localized transparent glass balustrade; and remove any extra railing after the dotted grass zone.
- Alternatives considered: One combined generative edit, generative window-only and balcony-only edits, and direct raster overlays for all geometry.
- Reason: The marked K07 crops distinguish real walls/openings from AI-misread plan symbols. Combined generative passes repeatedly moved locked room/terrace footprints, so successful corrections were isolated and failed variants rejected.
- Affected documents/sequences: K07–K10, S07–S10, geometry source lock, opening schedule, small-terrace model, and future camera path.
- Follow-up: Review `K07_v023_doors-kitchen-wall_window-glass-balcony.png`. Confirm especially that the kitchen wall stops at the correct position and does not over-close circulation; do not approve automatically.

### D027 — K07 blank openings, bottom-edge fence, and balcony-glass rail

- Date: 2026-07-15
- Status: Approved direction; K07 frame pending
- Decision: Add a blank hall opening to the bottom-left room, add a blank circulation opening to the living room, remove the bathroom/closet door leaf while retaining its opening, add a fence only along the screen-bottom yard boundary while leaving the screen-right/front approach open, and clarify the localized balcony glass with a thin top-edge rail.
- Alternatives considered: One combined edit, visible door leaves, an opaque balcony wall, or a fence returning along the open screen-right/front approach.
- Reason: The user supplied one indexed annotation map and explicitly requested five isolated changes without disturbing the accepted K07 shell.
- Affected documents/sequences: K07–K10, S07–S10, opening schedule, courtyard boundary, balcony-glass model, and future camera path.
- Follow-up: Review `K07_v028_balcony-glass-rail.png` for all five points. No sixth candidate was generated and K07 is not automatically approved.

### D028 — K07 clean rebuild and missing-door restoration

- Date: 2026-07-15
- Status: Rejected implementation
- Decision: Reject v028 because the pedestrian yard gate and storage sliding door were missing and repeated generative passes had introduced pink mottling, haze, and softened linework. Rebuild K07 once using v028 as the latest geometry authority, v001 only as the clean neutral-white rendering-quality reference, and v009 only as the storage-slider reference. Restore the bottom-fence pedestrian gate and the hall-facing storage sliding door.
- Alternatives considered: Two more local edits on v028, accepting the soft frame, or returning completely to v001 and losing later geometry corrections.
- Reason: Further stacked edits would increase image degradation; a controlled fresh rebuild can preserve the corrected layout while restoring the original K07 clarity.
- Affected documents/sequences: K07–K10, S07–S10, geometry QA, white-clay visual lock, yard access, storage opening, and future motion continuity.
- Follow-up: Rejected. The v001 reference overpowered the edit and reverted the accepted balcony, kitchen wall, storage-slider location, and later room geometry. Restore v028 as the full-frame geometry authority.

### D029 — K07 v028 restoration and exact storage-slider location

- Date: 2026-07-15
- Status: Approved direction; K07 frame pending
- Decision: Use v028 as the sole full-frame geometry base. Add the pedestrian yard gate only within the screen-bottom fence. Restore the storage slider only in the screen-right vertical opening of the small square storage room directly below the bathroom, directly above the bottom-left room, and at the far-left end of the central hall. Do not place a horizontal panel or track above the bedroom.
- Alternatives considered: Keeping v029, another global v001 style transfer, or accepting a misplaced horizontal slider line.
- Reason: The user's review identified that v029 replaced later work with the first K07 geometry. Close inspection also proved that the built-in local edit repeatedly misunderstood the small vertical storage opening.
- Affected documents/sequences: K07–K10, S07–S10, storage opening, yard gate, balcony, kitchen wall, and geometry QA.
- Follow-up: Produce no further global rebuild. The next accepted candidate must preserve v028 outside the two tiny door regions.

### D030 — User-supplied K07 v030 clean boundary

- Date: 2026-07-15
- Status: Approved
- Decision: Use the user-supplied `ChatGPT Image Jul 15, 2026, 09_59_17 PM.png` as the final K07 frame. Normalize it proportionally from 1672 × 941 to 1680 × 945 without cropping or visually editing it. Save the same normalized file as both candidate and approved boundary under `K07_v030_user-approved-clean-wireframe.png`.
- Alternatives considered: Continuing deterministic cleanup of v028, further generative gate/slider edits, or revising the supplied frame before approval.
- Reason: The supplied frame resolves the cumulative softness and mixed color cast, presents a clean neutral-white clay language, and was explicitly selected by the user to close K07 and continue to the next phase.
- Affected documents/sequences: K07–K10, S07–S10, white-clay visual lock, furniture blockout, camera continuity, and approved boundary reuse.
- Follow-up: K07 is complete. Begin K08 by auditing which elements in v030 already have sufficient dimensional volume and identify only the missing or under-resolved furniture/fixed elements before any image edit.

### D031 — K08 dimensional audit and targeted v001 candidate

- Date: 2026-07-15
- Status: Approved direction; K08 frame pending
- Decision: Lock all furniture and site content already dimensional in K07 v030. K08 may add or clarify volume only for the audited top-left bathroom fixtures/fixed storage, bottom-left bedroom wardrobe/storage face, central-bottom flexible-office desks/chairs/daybed-storage group, and shallow fixed kitchen/appliance details. Generate one targeted candidate before considering additional edits.
- Alternatives considered: Full-frame white-clay regeneration, treating K07 v030 itself as K08, or adding material color during the furniture-volume stage.
- Reason: K07 v030 already carries substantial 3D furniture. A restrained delta preserves the approved frame and keeps K08 narratively distinct from the later material-growth K09 state.
- Affected documents/sequences: K08–K10, S08–S10, furniture blockout, fixed-element model, and material-growth boundary.
- Follow-up: Review `K08_v001_targeted-white-clay-volume.png` against approved K07 v030. Do not approve automatically; confirm the bathroom, bedroom storage, flexible-office group, storage slider, balcony/glass, and absence of shell/camera drift.

### D032 — K08 v001 approved and K09 material-front direction opened

- Date: 2026-07-15
- Status: Approved
- Decision: Approve `K08_v001_targeted-white-clay-volume.png` as the complete white-clay cutaway boundary. Reuse its exact 1680 × 945 approved file for K09. K09 begins from the open screen-right courtyard/living side and spreads inward as an irregular surface-bound capillary front until approximately half of the model carries restrained Scandinavian materials; the remaining half stays exact white clay.
- Alternatives considered: Treating K07 v030 as both K07 and K08, starting materials from the bedroom side, a straight linear wipe, or materializing the complete model in one step.
- Reason: K08 v001 adds the missing fixed/furniture volume without changing the approved spatial composition. A courtyard-led front follows the camera destination and the living room's approved role as the strongest material-growth passage while keeping K09 clearly distinct from the finished K10 state.
- Affected documents/sequences: K08–K10, S08–S10, material-growth system, interior material bible, and boundary continuity.
- Follow-up: Generate one K09 v001 candidate from the exact approved K08 file. Change shading/materials only; do not change topology, object count, furniture positions, camera, landscape, or lighting direction. Do not approve automatically.

### D033 — K09 v001 courtyard-led partial-material candidate

- Date: 2026-07-15
- Status: Rejected by user review
- Decision: Preserve `K09_v001_courtyard-led-material-front.png` as the first K09 candidate. Its restrained Scandinavian palette and courtyard/living origin are directionally correct, but it is not approved automatically.
- Alternatives considered: Automatically refining the first result, approving it from appearance alone, or generating several unrelated material versions.
- Reason: The candidate proves the material family without losing the clean white-clay language, but the central-bottom office/flexible room is more fully materialized than intended and the boundary reads more room-based than capillary. These are storytelling decisions that require review against K08 rather than silent iteration.
- Affected documents/sequences: K09–K10, S09–S10, material-growth coverage, capillary-front design, and interior palette.
- Follow-up: Superseded by D034. Do not return to the whole-room white-clay allocation.

### D034 — K09 materials distributed across all rooms and exact terrace edge corrected

- Date: 2026-07-15
- Status: Direction retained; frame superseded by D035
- Decision: Reject K09 v001's room-exclusion approach. K09 must show material progress in the bedroom and bathroom as well as the living, kitchen, office, and courtyard. Replace the exact opaque white strip between the small raised-terrace seating and dotted terrace band with a transparent glass balustrade ending before planting. Preserve `K09_v004_distributed-materials-corrected-balustrade.png` as the active review candidate.
- Alternatives considered: Keeping the bedroom and bathroom white until K10, accepting the wrong glass edge in v002, or retaining the unapproved bedroom plant introduced during material generation.
- Reason: Entire untextured rooms read as generation omissions, while the approved exterior logic requires a slim transparent balustrade at the highlighted small-terrace edge. v004 carries the requested room materials, corrects the exact edge, and removes the unapproved decor.
- Affected documents/sequences: K09–K10, S09–S10, interior material distribution, primary bedroom, bathroom, small raised terrace, and glass-balustrade continuity.
- Follow-up: Material and balustrade decisions remain active; review the glazing-complete v005 under D035.

### D035 — K09 visible glazing infill at four marked locations

- Date: 2026-07-15
- Status: Glazing direction retained; frame superseded by D036
- Decision: Supersede v004 with `K09_v005_window-and-balcony-glazing.png` for review. Add nearly colorless low-reflection glass only inside the user-marked primary-bedroom, bathroom, and living/dining exterior window openings and inside the existing small-balcony balustrade frame. Preserve the exact openings, frames, materials, and camera.
- Alternatives considered: Leaving the openings visually empty, using stronger blue architectural glass, or globally rerendering the material frame.
- Reason: Blank openings read as missing windows at this material stage. Restrained cool-neutral edge reflection makes the glass legible from the raised camera without changing the calm warm material palette or turning the glazing into a colored feature.
- Affected documents/sequences: K09–K11, S09–S11, primary bedroom, bathroom, living/dining, small raised terrace, glazing continuity, and material QA.
- Follow-up: The four-pane glazing direction remains active; review the office-window-complete v006 under D036.

### D036 — Restore the locked worktable-to-terrace window

- Date: 2026-07-15
- Status: Geometry direction retained; frame becomes D037 authority
- Decision: Supersede v005 with `K09_v006_office-terrace-window.png` for review. Replace the central portion of the solid screen-right wall in the central-lower small bedroom/office, directly beside the two-position worktable, with the broad clear terrace-facing window already required by the source lock. Retain short wall piers at both ends and keep the window distinct from the balcony balustrade.
- Alternatives considered: Leaving the solid wall, turning the full wall into glass without piers, or treating the opening as a glazed door.
- Reason: The technical drawing and earlier approved geometry decision require a window from the work positions toward the small terrace. A broad low-reflection pane restores that relationship without moving the room, table, terrace, or balustrade.
- Affected documents/sequences: K09–K11, S09–S11, office/guest room, worktable, small raised terrace, glazing continuity, and geometry QA.
- Follow-up: v006 remains the immutable geometry/material authority; review its clean reconstruction under D037.

### D037 — K09 fresh quality-reset reconstruction

- Date: 2026-07-15
- Status: Approved through D038
- Decision: Preserve v006 as the immutable complete geometry/material authority and create `K09_v007_clean-single-pass-rebuild.png` as a fresh single-pass reconstruction. Use K07 v001 only for smooth planes, crisp fine edges, clean object separation, restrained shadows, and neutral clarity; never restore its obsolete geometry.
- Alternatives considered: Applying another global smoothing edit to v006, deterministic blur/sharpen filtering, or accepting the cumulative softness.
- Reason: Repeated whole-frame generative corrections gradually introduced soft edges, uneven color, and a less polished finish. A fresh reconstruction follows the permanent K07 quality-lock rule and resets render quality without intentionally changing the current plan or palette.
- Affected documents/sequences: K09–K11, S09–S11, full-frame rendering quality, material continuity, glazing continuity, geometry QA, and future Kling boundary stability.
- Follow-up: Completed through explicit user selection in D038.

### D038 — K09 v007 approved exactly and K10 opened

- Date: 2026-07-15
- Status: Approved
- Decision: Approve `K09_v007_clean-single-pass-rebuild.png` exactly as the K09 partial-material boundary. The candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`. Reject K09 v008 because its attempted local wall correction introduced an incorrect perpendicular courtyard wall. Ignore the later unpersisted experiment; neither may enter production.
- Alternatives considered: Continuing to refine sharpness/color after approval, adopting the v008 wall experiment, or rebuilding K09 again.
- Reason: The user explicitly selected v007 as perfect after reviewing the clean single-pass rebuild. Freezing that exact file protects the accepted camera, layout, glazing, furniture, palette, and quality from further generative drift.
- Affected documents/sequences: K09–K11, S09–S11, boundary continuity, material continuity, geometry QA, and K10 source control.
- Follow-up: Open K10 from the exact approved K09 v007 file. Change only finish, light, subtle material micro-detail, glass response, and atmosphere. Do not change camera, crop, walls, openings, furniture, site, balcony, gate/fence, planting, or object count; do not approve the first K10 candidate automatically.

### D039 — K10 v001 finished-interior/atmosphere candidate

- Date: 2026-07-15
- Status: Approved through D040
- Decision: Preserve `K10_v001_finished-interior-atmosphere.png` as the first K10 candidate. It was generated from the exact approved K09 v007 file with a narrow finish/light brief and normalized proportionally to 1680 × 945. Do not approve automatically.
- Alternatives considered: Adding new curtains or lighting fixtures, stronger golden-hour relighting, rebuilding the interior, or generating several unrelated atmosphere directions.
- Reason: K10 must complete visualization and atmosphere while remaining a credible endpoint for the K09→K10 scroll transition. A restrained refinement protects the approved architecture and avoids a disruptive color-grade or content jump.
- Affected documents/sequences: K10–K11, S10–S11, material continuity, glazing continuity, lighting continuity, and boundary QA.
- Follow-up: Completed through explicit user approval in D040.

### D040 — K10 v001 approved exactly and K11 opened

- Date: 2026-07-16
- Status: Approved
- Decision: Approve `K10_v001_finished-interior-atmosphere.png` exactly as the K10 boundary. The candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `A743B39A9599496F2E30DFE077221FD1A54F1CF1519CFF52BEE74C87541910CD`. Open K11 from this exact file.
- Alternatives considered: Refining K10 again before approval, generating K11 from K09, or changing camera while the envelope closes.
- Reason: The user explicitly approved K10 v001 and requested progression to K11. Freezing the exact file protects S10 boundary continuity and supplies the required immutable start for exterior assembly.
- Affected documents/sequences: K10–K12, S10–S12, boundary continuity, exterior assembly, camera continuity, and source control.
- Follow-up: Generate one K11 candidate using approved K10 v001 as the exact camera/site/footprint target and the supplied courtyard exterior renders as façade/material authority. Add exterior skins and asymmetrical flat roofs only; do not change camera, site, terrace, courtyard, furniture footprints, openings, paving, planting, gate/fence, or lighting direction. Do not approve automatically.

### D041 — K11 stable-camera envelope candidate and terrace correction

- Date: 2026-07-16
- Status: Rejected/superseded by D042
- Decision: Reject `K11_v001_rejected-camera-site-drift.png` because it changed the camera, crop/scale, site organization, furniture/planting, and courtyard boundary. Preserve `K11_v002_stable-camera-flat-roof.png` as the stable-camera roof basis but supersede it because it covered the approved narrow raised terrace. Preserve `K11_v003_restored-raised-terrace.png` as the active K11 review candidate after reopening only that terrace and restoring its four seats, plant, perforated strip relationship, and minimal glass edge.
- Alternatives considered: Accepting the attractive but architecturally discontinuous v001, approving v002 without the terrace, or changing the K10 camera before roof closure.
- Reason: K10→K11 is an envelope-assembly passage with a stable raised camera. Camera/site continuity and preservation of both terraces outrank façade spectacle. v003 keeps the clean flat-roof closure while repairing the one clear v002 topology/content loss.
- Affected documents/sequences: K11–K13, S11–S13, roof/envelope massing, small raised terrace, balcony glass, camera continuity, site continuity, and exterior QA.
- Follow-up: Superseded by the corrected courtyard-facing camera and real-render endpoint in D042.

### D042 — K11 rotates/orbits into the real courtyard façade

- Date: 2026-07-16
- Status: Camera/entrance direction retained; endpoint superseded by D043
- Decision: Reject `K11_v003_restored-raised-terrace.png` as the wrong K11 concept. K10→K11 must rotate/orbit the 3D view approximately 90° toward screen right, translate the camera into the center of the open courtyard, and descend/tilt toward the factual courtyard elevation. The timber entrance belongs on that courtyard-facing façade beside the raised balcony/terrace; the false door on the former axonometric screen-bottom elevation is removed. Preserve `K11_v004_real-courtyard-render.png`, a deterministic normalized copy of Visualization 1, as the active K11 endpoint candidate.
- Alternatives considered: Keeping the stable axonometric roof view, asking AI to recreate the real façade, or editing the false door within v003.
- Reason: The user clarified that K11 is the representational handoff into the supplied real render, not merely roof closure from above. Using the real render preserves the actual façade, entrance, balcony, glazing, materials, landscape, and camera truth without generative drift.
- Affected documents/sequences: K11–K13, S11–S13, exterior camera path, entrance location, courtyard façade, final-hero selection, and motion design.
- Follow-up: The courtyard-facing camera and entrance correction remain locked; the exact-render K11 endpoint is rejected through D043.

### D043 — K11 remains an intermediate generated model view

- Date: 2026-07-16
- Status: Direction retained; candidate created through D044
- Decision: Reject `K11_v004_real-courtyard-render.png` as the K11 boundary because it reuses the final exterior visualization too early. K11 must reproduce the same L-28 model from a new mid-elevated courtyard-facing camera: orbit approximately 90° toward screen right, translate into the yard, and lower from K10 without reaching the final ground-level render perspective. Visualizations 1–2 control façade geometry, entrance, balcony, glazing, roof, and material placement only. Restore K12 as continued descent/landscape/detail resolution and K13 as the final real-render hero.
- Alternatives considered: Reusing Visualization 1 at K11, keeping the high axonometric roof view, or jumping directly from K10 to K13.
- Reason: The user requires a readable transformation from the interior model into the final exterior visualization. A distinct K11 model viewpoint preserves the camera journey and leaves meaningful visual work for K12 and K13.
- Affected documents/sequences: K11–K13, S11–S13, exterior camera path, façade references, entrance position, landscape resolution, and final-render handoff.
- Follow-up: Completed through candidate D044.

### D044 — K11 v005 courtyard-facing model candidate

- Date: 2026-07-16
- Status: Approved through D045
- Decision: Preserve `K11_v005_courtyard-model-view.png` as the active K11 candidate. It is a newly generated view of the evolving model, not the final supplied render. Approved K10 controls model/style continuity; Visualizations 1–2 control only courtyard façade geometry, entrance, balcony, glazing, roof, and material placement.
- Alternatives considered: Reusing Visualization 1, retaining the axonometric roof view, or making K11 fully photoreal and ground-level.
- Reason: v005 restores the required intermediate state: the camera faces the courtyard, the timber entrance is correctly beside the raised balcony, the false bottom-facing door is absent, and the neutral simplified model environment remains visibly distinct from the final exterior render.
- Affected documents/sequences: K11–K13, S11–S13, exterior camera height/direction, façade/entrance accuracy, model continuity, landscape progression, and final-render handoff.
- Follow-up: Completed through K11 approval in D045.

### D045 — K11 v005 approved as the courtyard model boundary

- Date: 2026-07-16
- Status: Approved
- Decision: Approve `K11_v005_courtyard-model-view.png` exactly as the K11 boundary and copy it byte-identically from `candidates/` to `approved/`.
- Alternatives considered: Raising the K11 camera, refining the façade again, or using Visualization 1 as the K11 endpoint.
- Reason: The user explicitly approved this phase and requested progression. v005 correctly establishes the courtyard direction, façade order, entrance position, intermediate model environment, and a distinct state before K12–K13.
- Affected documents/sequences: K11–K13, S11–S13, boundary continuity, exterior camera path, and source control.
- Follow-up: Open K12 from the exact approved v005 file. Candidate and approved dimensions are 1680 × 945 and both have SHA-256 `7DCAFB193A2FB1CB62BC705FB109583BFBC9DF0B6696E08A63739CFCCB624DE3`.

### D046 — K12 v001 near-final courtyard candidate

- Date: 2026-07-16
- Status: Approved through D047
- Decision: Preserve `K12_v001_near-final-courtyard.png` as the first K12 review candidate. Exact approved K11 v005 controls architecture, composition, furniture, and landscape structure; Visualizations 1–2 control only exterior finish, daylight, glazing, curtains, and environment character.
- Alternatives considered: Jumping directly to the exact real render, leaving the studio environment until K13, or changing the camera substantially.
- Reason: v001 introduces the missing real-world sky/tree context, natural daylight, material depth, glazing/curtains, landscape texture, and a modest descent while retaining the generated intermediate role. K13 still owns the final real-render handoff.
- Affected documents/sequences: K12–K13, S12–S13, exterior realism progression, camera continuity, landscape resolution, and final-render approval.
- Follow-up: Completed through explicit K12 approval in D047.

### D047 — K12 v001 approved exactly and K13 opened

- Date: 2026-07-16
- Status: Approved
- Decision: Approve `K12_v001_near-final-courtyard.png` exactly as the K12 boundary and copy it byte-identically from `candidates/` to `approved/`.
- Alternatives considered: Refining the K12 camera or material finish again, moving directly into motion production, or regenerating K13.
- Reason: The user explicitly approved the phase and requested progression. v001 preserves the factual courtyard composition while establishing the intended near-final generated state before the real-render endpoint.
- Affected documents/sequences: K12–K13, S12–S13, boundary continuity, exterior realism progression, and source control.
- Follow-up: Open K13 from supplied Visualization 1 without generative alteration. Candidate and approved K12 dimensions are 1680 × 945 and both have SHA-256 `D46EEE38D0727A5DDE123B01B892EC473FCEFF05D020A166B30C515DA2FD10EC`.

### D048 — K13 v001 deterministic Visualization 1 hero candidate

- Date: 2026-07-16
- Status: Approved through D049
- Decision: Preserve `K13_v001_visualization-1-hero.png` as the first K13 candidate. It is a deterministic 1680 × 945 normalization of supplied Visualization 1 and contains no generative reconstruction or architectural edits.
- Alternatives considered: Generating a new exterior hero, using Visualization 2's closer oblique camera, or altering the render to resemble K12 more closely.
- Reason: K13 is the designated real-render handoff. Visualization 1 provides the clearest complete frontal courtyard composition and retains the factual façade, entrance, balcony, glazing, landscape, furniture, materials, and daylight without AI drift.
- Affected documents/sequences: K13, S13, final exterior hero selection, camera handoff, master endpoint, and source control.
- Follow-up: Completed through explicit K13 approval in D049.

### D049 — K13 v001 approved and exterior keyframe chain closed

- Date: 2026-07-16
- Status: Approved
- Decision: Approve `K13_v001_visualization-1-hero.png` exactly as the final exterior-hero boundary and copy it byte-identically from `candidates/` to `approved/`. Visualization 1 is now the approved K13 endpoint.
- Alternatives considered: Refining the real render, using another visualization angle, or generating an additional exterior endpoint.
- Reason: The user explicitly approved the candidate. It is the factual supplied render, already contains the finished villa and landscape, and introduces no generative architectural drift.
- Affected documents/sequences: K13, S13, final exterior hero selection, master endpoint, final-render approval, and source control.
- Follow-up: Complete K01, the only remaining deferred boundary. Candidate and approved K13 dimensions are 1680 × 945 and both have SHA-256 `8BC8EA7056841803E22309FD310166E0D2FB3BF1DCFB788FDD06D6721E791441`. After K01 approval, all K00–K13 boundary states will be closed and motion production can proceed sequence by sequence.

### D050 — K01 v001 approved and complete keyframe set closed

- Date: 2026-07-16
- Status: Approved
- Decision: Approve `K01_v001_medium-high-approach.png` exactly as the K01 boundary. K00 v008 remains the wide opening view, K01 v001 becomes the medium-high oblique camera midpoint, and K02 v003 remains the near-overhead endpoint. Candidate and approved K01 files are byte-identical.
- Alternatives considered: Omitting K01 and asking one Kling clip to perform the full K00→K02 dolly/crane/tilt, generating a more top-down K01, or changing the table/object composition.
- Reason: The approved midpoint divides the compound camera journey into two controlled sequences while preserving the mineral table, blank folded paper, four architectural objects, studio, materials, and daylight. This reduces object drift and perspective deformation risk.
- Affected documents/sequences: K00–K02, S01–S03, complete keyframe closure, camera continuity, paper continuity, object continuity, and motion-test readiness.
- Follow-up: Begin Phase 3 with S03, the highest-risk paper-unfold passage. K01 dimensions are 1680 × 945 and candidate/approved SHA-256 is `ECCE98F9018356C88DFAA15487A63D706ACBE1D5BA2C1DB1FFB2784DF5461166`.

### D051 — S03 card prepared; Kling connection requires region selection

- Date: 2026-07-16
- Status: Blocked pending one user choice
- Decision: Create [S03_HORIZONTAL_UNFOLD.md](./sequences/S03_HORIZONTAL_UNFOLD.md) with exact approved K02/K03 boundaries, locked-camera paper physics, final positive/negative prompts, reserved v001 filename, and QA checklist. Do not submit because the official `kling` CLI is not installed and its China/Global package cannot be selected by assumption.
- Alternatives considered: Generating through a different provider, guessing the Global package, installing both regional packages, or postponing sequence documentation.
- Reason: The Kling workflow requires the official region-matched CLI and OAuth login. The region is user-account information that cannot be inferred safely. Preparing the card now preserves progress without spending credits or changing channels.
- Affected documents/sequences: S03, Phase 3 motion tests, Kling connection, prompt/settings provenance, and motion-production readiness.
- Follow-up: User confirms China (`klingai.com`) or Global (`kling.ai`). Install only the matching official package, run OAuth login, then call `who_am_i` and `tool_list` before selecting the model or submitting S03 v001.

### D052 — Kling Global CLI authenticated and S03 v001 settings selected

- Date: 2026-07-16
- Status: Ready for submission
- Decision: Install the official Global Kling CLI from the user-provided guide, complete OAuth authorization, verify the authenticated account and live `image_to_video` schema, and select `kling-video-v3_0_omni` for S03 v001 at 5 seconds and 1080p with one output, `prefer_multi_shots=false`, and `enable_audio=false`.
- Alternatives considered: Kling 2.5, Kling 2.6, 4K output, audio generation, multi-shot splitting, or a single-image animation without the exact K03 tail frame.
- Reason: The live model description identifies Kling 3.0 Omni as the default for first-tail/multi-image video. A 1080p single continuous shot is appropriate for an initial high-risk motion test and avoids spending 4K credits before the motion grammar passes.
- Affected documents/sequences: S03, Kling authentication, model/settings provenance, credit use, and first-tail boundary fidelity.
- Follow-up: Submit exactly one S03 v001 task from approved K02/K03, report `generationId` and `creditsConsumed`, poll without resubmitting, save the completed work under `production/kling-clips/S03-horizontal-unfold/candidates/`, and do not approve automatically.

### D053 — S03 v001 completed and held for review

- Date: 2026-07-16.
- Decision: Preserve the first paid S03 generation as immutable candidate `S03_v001_horizontal-unfold.mp4`, create a local forward/reverse QA loop, and hold approval for user review. Do not submit a second task automatically.
- Generation provenance: `kling-video-v3_0_omni`, 5 seconds requested, 1080p, one output, audio disabled, multi-shot disabled; generation ID `AT-TdcEYkezS4tu0R7JUTL7zYpZ4LqrKpXrJU1BEVWXzBr_zvmgcZjw2XmivgNxLWBdIFKyD`; task trace ID `019f6b12-d519-79a5-b107-a55183bcb23b`; 40 credits consumed.
- QA result: Valid 1920 × 1080 H.264 delivery at 24 fps and 5.041667 seconds. Table, camera, and supporting objects remain stable; the blank-to-plan reveal is clear. The middle articulation is somewhat book-like/multi-panel, and the standard Kling watermark is present, so the candidate is not automatically approved.
- Boundary evidence: after raster normalization and excluding the watermark side, first-frame SSIM against K02 is `0.956224` and last-frame SSIM against K03 is `0.950127`.
- Alternatives considered: Automatic approval, immediate paid v002 retry, or moving directly to S05 without reviewing reverse scrub.
- Reason: The candidate is technically usable enough to review, but scroll-driven playback makes reverse coherence and single-sheet paper physics approval-critical. A retry should spend credits only after a specific rejection reason is confirmed.
- Affected documents/sequences: S03, Phase 3 motion grammar, credit log, Kling provenance, boundary QA, and scroll-scrub review.
- Follow-up: User reviews the original and forward/reverse loop. Approve v001 or record a focused v002 correction for the middle fold action.

### D054 — Reject S03 v001 and create hinge-aligned K02 v004 for review

- Date: 2026-07-16.
- Status: Candidate review pending.
- Decision: Reject immutable Kling candidate `S03_v001_horizontal-unfold.mp4` for paper translation across the table, recentering during the unfold, and slightly booklet-like middle articulation. Preserve approved K02 v003 and approved K03 v008 unchanged. Create `K02_v004_hinge-aligned-right-half.png` as a separate review-only start-boundary candidate whose folded packet occupies exactly K03's stationary right half. Do not submit S03 v002 until the user explicitly approves v004.
- Candidate provenance: Built-in image edit used approved K02 v003 as the edit target and approved K03 v008 as the registration-only reference. The final project candidate constrains the paper deterministically to K03's measured right-half quadrilateral while retaining approved K02 pixels outside the central paper-relocation ROI.
- Registration evidence: hinge `(831, 299)` to `(831, 634)`; right edge `(1052, 300)` to `(1054, 634)`; top/bottom widths 221/223 px; zero changed pixels outside the central edit ROI. The limestone sample, oak sample, ruler, pencil, table edge, floor, and all their pixels remain exact K02 outside the paper relocation. Candidate dimensions 1672 × 941 and SHA-256 `FE8A084B6E942E189545E88CFD934FA27518D5138263154059334F8169DE061D`.
- Alternatives considered: Re-prompting Kling with the incompatible centered K02/K03 boundaries, accepting v001's translation, changing approved K03, or automatically approving the corrected still.
- Reason: A physically correct one-hinge unfold requires the central hinge and one complete half-sheet to remain stationary. Centering both the folded packet and opened sheet forces the interpolation to translate/recenter the paper. Registering the closed packet to K03's right half removes that boundary contradiction before spending more Kling credits.
- Affected documents/sequences: K02, K03, S03, Phase 3 motion testing, boundary continuity, paper physics, candidate provenance, and credit control.
- Follow-up: User reviews K02 v004 beside unchanged K03. Approve or reject v004 explicitly. Only after approval may one targeted S03 v002 be generated with the fixed right half pixel-locked and the moving panel rotating 180° toward the left.

### D055 — Approve exact user-supplied K02 v005 and authorize S03 v002

- Date: 2026-07-16.
- Status: Approved boundary; motion retry authorized.
- Decision: Preserve the exact downloaded `Generated image 1 (1).png` bytes as `K02_v005_user-approved-hinge-aligned-right-half.png` in both `candidates/` and `approved/`. Retain K02 v003 and immutable v004 without overwriting either. Use v005 as the sole S03 v002 start and unchanged K03 v008 as its end.
- Provenance: candidate and approved v005 are byte-identical at 1672 × 941 with SHA-256 `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`.
- Motion authorization: Submit exactly one paid S03 v002 first-tail task. Keep the complete right paper half, hinge, corners, and contact shadow pixel-locked while only the single folded panel rotates 180° left. Do not automatically approve the returned video.
- Alternatives considered: Overwriting v004, approving the similar but non-identical v004 asset, reusing centered v003, changing K03, or submitting multiple retries.
- Reason: The user explicitly approved the supplied result and its opening analysis. A new zero-padded version preserves immutable candidate history and ensures the Kling request uses the exact approved bytes.
- Affected documents/sequences: K02, K03, S03, Kling credit use, paper registration, motion provenance, and forward/reverse scrub QA.
- Follow-up: Verify the live Kling schema, submit one S03 v002 at 5 seconds and 1080p with audio/multi-shot disabled, report `generationId` and `creditsConsumed`, poll to completion, save locally, and review without automatic approval.

### D056 — Complete S03 v002 hinge-locked retry and hold for review

- Date: 2026-07-16.
- Status: Approved by the user.
- Decision: Preserve completed `S03_v002_horizontal-unfold_hinge-locked.mp4` as an immutable candidate, create full and paper-crop contact sheets plus a forward/reverse QA loop, and hold the motion decision for user review. Do not submit another task automatically.
- Generation provenance: `kling-video-v3_0_omni`, 5 seconds requested, 1080p, one output, audio disabled, multi-shot disabled; generation ID `AceVRNBQiYnR0LlGhbZoZqukdwpNwJdo_gBGtA1g1Ef_EkYs3MTPncEjUVFYN1eu_xWiWCwp`; task trace ID `019f6b81-4ee1-78c7-93ff-35cb78cfe533`; 40 credits consumed.
- Output: H.264, 1920 × 1080, 24 fps, 5.041667 seconds, SHA-256 `1991BCC24A09D97F90B52E9077527B319B0B69EF4F6AD4294326D2BC1577282C`.
- QA result: In sampled frames the complete right paper side stays visually anchored while the single panel opens left, materially removing v001's whole-sheet translation/recentering. Slight moving-panel taper and a broad fold shadow remain, and delivery includes Kling's standard watermark/resampling.
- Boundary evidence: normalized first-frame SSIM against K02 v005 is `0.941359`; normalized last-frame SSIM against K03 v008 is `0.920147`, measured without the watermark side.
- Alternatives considered: Automatic approval, immediate paid v003 retry, returning to centered K02 v003, or using the superseded v004 asset instead of exact user-approved v005.
- Reason: The primary defect appears corrected, but the film will be scroll-scrubbed in both directions, so the user must judge the complete motion and shadow behavior before approval.
- Affected documents/sequences: K02, K03, S03, Phase 3 motion grammar, Kling credit/provenance log, and forward/reverse scrub QA.
- Follow-up: User reviews the original and forward/reverse loop. Approve v002 or record one specific remaining rejection reason before any further generation.

### D057 — Re-register K01 to the approved K02 v005 tabletop anchor

- Date: 2026-07-16.
- Status: Candidate under review; not approved.
- Decision: Preserve approved K02 v005 exactly. Create `K01_v002_hinge-aligned-approach.png` as a replacement candidate from approved K01 v001, moving the blank folded packet toward the ruler so it can arrive at K02 v005 without independent sliding.
- Candidate provenance: built-in image-model targeted edit; K01 v001 was the scene/camera authority and K02 v005 was a registration-only reference.
- Candidate dimensions and hash: 1672 × 941; SHA-256 `268F9056C7D137CBD2220687DEA8DE164A61D5E6F2957BADD632ECFE667FB520`.
- Alternatives considered: regenerate the already-correct K02 boundary, accept visible paper translation, add an extra camera midpoint before testing the existing K01 midpoint, or submit a paid Kling clip before the replacement boundary is approved.
- Affected documents/sequences: K01, K02, S02, camera continuity, paper continuity, and Kling credit control.
- Approval evidence: candidate and approved K01 v002 files are byte-identical with SHA-256 `268F9056C7D137CBD2220687DEA8DE164A61D5E6F2957BADD632ECFE667FB520`.
- Follow-up: generate one 5-second K01 v002 → K02 v005 camera-only test and hold it for review. Add a K01.5 subdivision only if that test cannot maintain rigid table/object registration during the crane and tilt.

### D058 — Complete S02 v001 crane-to-plan test and hold for review

- Date: 2026-07-16.
- Status: Candidate under review; not approved.
- Decision: Preserve `S02_v001_crane-to-plan.mp4` as an immutable candidate and create contact-sheet plus forward/reverse QA assets. Do not submit another paid task automatically.
- Generation provenance: `kling-video-v3_0_omni`, 5 seconds requested, 1080p, one output, audio disabled, multi-shot disabled; generation ID `AZvU3f2RTGosTKysRJigNVPswSlxre_IsHYx_Y-jQ5J9hvBXwwEBPB6DwHJy7mmywe63xrfP`; task trace ID `019f6bc4-bd62-7c9e-868b-b12d205a5757`; 40 credits consumed.
- Output: H.264, 1920 × 1080, 24 fps, 5.041667 seconds, SHA-256 `03CACCD7222A10B6C294334401CD6298C3D74D897D2189E78E6828FC7587B919`.
- QA result: one continuous upward/inward crane and downward tilt; paper stays blank and closed; no obvious cut or multi-shot behavior. The final camera remains materially oblique and does not land on approved K02 v005's full bird's-eye table geometry.
- Boundary evidence: first-frame SSIM against K01 v002 is `0.775978`; last-frame SSIM against K02 v005 is `0.774809`, measured after normalization while excluding the watermark region.
- Alternatives considered: automatic approval, automatic paid retry, immediate K01.5 subdivision, or discarding the first useful motion reference.
- Follow-up: user reviews the original and forward/reverse loop. Approve v001, request one endpoint-constrained retry, or authorize a K01.5 split. No further generation without that decision.

### D059 — Test an exact S02A-tail → K02 continuation

- Date: 2026-07-16.
- Status: Rejected as a seamless assembly candidate; preserved for review.
- Decision: Extract exact clean frame 120/120 from S02A as `K01_5_v001_exact-S02A-clean-tail.png`, use it as the first frame for one three-second S02B Kling 3.0 Omni continuation, and use approved K02 v005 as the tail. Preserve the result and combined A+B review without automatic approval.
- Bridge provenance: 1920 × 1080 clean PNG, SHA-256 `ADDD37A6A29FBB145414C3E0859BB558FF29061A3E34904A8AD476AC44C0F44C`.
- Generation provenance: generation ID `AeiK-VISdFRPDfJX7oI4cKRFsmLu7I3UwRhEGSk2hJRusKM82VGBVrDULXy2ZT1bnhYX4f_D`; task trace ID `019f6bc4-bd62-7c9e-868b-b12d205a5757`; 24 credits consumed; 3 seconds requested; 1080p; one output; audio/multi-shot off.
- Output: H.264, 1920 × 1080, 24 fps, 3.041667 seconds, SHA-256 `70571B22228AA6936B5AAB91D6FB0DC60030C8787C2B46A8A7BF5838D877C0AF`.
- QA result: internal motion proceeds farther overhead while the paper stays blank and closed, but the first delivered frame is already substantially closer/cropped than the supplied exact bridge, producing a visible seam jump. The last frame remains differently cropped and registered from approved K02.
- Boundary evidence: bridge→S02B first-frame SSIM `0.781007`; S02B last-frame→K02 SSIM `0.754342`.
- Combined review: clean A+B assembly is 8.041667 seconds, SHA-256 `A491DEA9A82AF0BC18D9C894237A4CC9C3B6C024B181AD2E34E81C577A88A72B`, with a visible join at the start of B.
- Alternatives considered: a full five-second Omni retry, automatic third paid generation, accepting the seam, or hiding the mismatch without review.
- Follow-up: review the individual continuation and combined forward/reverse loop. Prefer a deterministic short bridge/crossfade to exact K02 or deliberately test a different first-tail model only after explicit authorization.

### D060 — Approve the five-second S02B replacement and close S02

- Date: 2026-07-16.
- Status: Approved and locked by the user.
- Decision: Preserve the exact user-supplied `kling_20260717_VIDEO_Use_Image__475_0.mp4` bytes as `S02B_v002_user-5s.mp4` in candidates and approved. Supersede rejected S02B v001. Assemble the clean S02A source and S02B v002 into the authoritative ten-second S02 v002 master, omitting the duplicate S02B first frame.
- S02B v002 evidence: 1920 × 1080 H.264, 24 fps, 5.041667 seconds; SHA-256 `A35748787DBDF8CDBF46BFD4B553C5F2794DCBEF94DEBB1CBD8CB6C79297E2A2`; opening SSIM against exact S02A tail `0.977735`; endpoint SSIM against approved K02 `0.922653`.
- Approved master: `S02_v002_split-camera-to-bird-pov.mp4`; 1920 × 1080, 24 fps, 10.041667 seconds, 241 frames; SHA-256 `00630193BC406BF12DE04FFD6ECD7541E1E96184CFB6169760DAE5C70187E3FA`.
- Master QA: encoded A→B seam SSIM `0.936875`; encoded endpoint SSIM against K02 `0.918426`; contact-sheet and forward/reverse loop preserved under `review/S02_v002/`.
- Alternatives considered: further paid Kling retries, keeping the three-second S02B v001, adding a new synthetic midpoint, or leaving S02 unresolved.
- Follow-up: S02 is closed. Activate S03 and review the existing hinge-locked `S03_v002_horizontal-unfold_hinge-locked.mp4` before any further paid generation.

### D061 — Approve S03 v002 and activate S05

- Date: 2026-07-17.
- Status: Approved and locked by the user.
- Decision: Promote the immutable hinge-locked `S03_v002_horizontal-unfold_hinge-locked.mp4` candidate byte-for-byte into `kling-clips/S03-horizontal-unfold/approved/` and close S03. Preserve rejected S03 v001 unchanged.
- Evidence: candidate and approved SHA-256 are both `1991BCC24A09D97F90B52E9077527B319B0B69EF4F6AD4294326D2BC1577282C`; delivered media is H.264, 1920 × 1080, 24 fps, 5.041667 seconds. Forward/reverse and contact-sheet QA remain under `review/S03_v002/`.
- Accepted limitation: slight moving-panel taper, broad fold shadow, Kling watermark, and delivery resampling remain within the user-approved review threshold.
- Alternatives considered: another paid retry, rebuilding the paper boundaries, or keeping S03 open.
- Follow-up: activate S05 using exact approved K03 v008 and K05 v002. Produce one camera-push/dephysicalization candidate and hold it for review; do not approve automatically.

### D062 — Complete S05 v001 and hold for boundary review

- Date: 2026-07-17.
- Status: Candidate under review; not approved.
- Decision: Submit exactly one five-second K03→K05 first/tail test through Kling 3.0 Omni after live `who_am_i` and `tool_list` verification. Preserve the completed output and its QA evidence; do not retry or approve automatically.
- Generation provenance: `kling-video-v3_0_omni`, 5 seconds requested, 1080p, one output, audio disabled, multi-shot disabled; generation ID `AcuC3ct-Zdno7kYsoX0ss6On9hGwTgPuUvx4Rxy1752a6qt4eiLOqdSzpfny21q5-oL7jfB0`; task trace ID `019f6d16-92bf-7000-8000-000000000000`; 40 credits consumed.
- Output: `S05_v001_enter-drawing.mp4`; H.264, 1920 × 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `D3C379120165C1BE55709C2CA30F87751E7E6E2177450AE0674559629CCF1ACC`.
- Preliminary QA: one coherent centered push reaches the flat-plan world with no visible cut or fantasy wave. The middle briefly strengthens the physical sheet edge/drop shadow. The delivered end plan is horizontally wider/overscaled relative to exact approved K05; raw endpoint SSIM after normalization and watermark-side exclusion is `0.435366`. First-frame low-pass SSIM against K03 is `0.953602`.
- Alternatives considered: generating multiple paid candidates at once, silently retrying with a new prompt, accepting only the aesthetically clean ending, or modifying the approved K05 boundary.
- Follow-up: user reviews the original, endpoint comparison, and forward/reverse loop. If rejected for registration, create one deterministic physical-plan close-up boundary matching K05 scale and split the camera push from dephysicalization before authorizing another paid job.

### D063 — Lock user-supplied S05A v003 camera push

- Date: 2026-07-17.
- Status: Approved and locked by the user as the authoritative S05 camera-push segment.
- Decision: Preserve the exact uploaded `kling_20260717_VIDEO__2077_0 (1).mp4` bytes as `S05A_v003_user-approved-camera-push.mp4` in both candidates and approved. It supersedes the locally rendered S05A zoom tests; S05 v001 remains preserved but is not approved.
- Evidence: candidate and approved SHA-256 are both `4D3B71161C596E1D5F33472DFD10DF6361AB2189BCE6CAE673098AE5291FDD3B`; H.264, 1920 × 1080, 24 fps, 193 frames, 8.041667 seconds, approximately 15.46 Mb/s.
- Accepted result: stable continuous forward push, preserved table texture and plan sharpness, with props leaving naturally through the viewport.
- Remaining work: S05C v001 opening is close but not pixel-identical to the approved S05A tail. Register its scale/translation and preserve residual motion through a short eased handoff before exporting the joined S05 review. Do not use an unregistered dissolve and do not mark complete S05 approved automatically.

### D064 — Complete registered S05 v003 handoff candidate

- Date: 2026-07-17.
- Status: Complete and awaiting user review; not approved automatically.
- Decision: Register S05C to the exact approved S05A v003 tail before joining. Preserve the six-frame S05 v002 test but supersede it because its dissolve visibly softened/doubled architectural lines. Use a two-frame micro-blend for active candidate S05 v003.
- Registration: S05C opening uses approximately `0.999` scale and `+20 px` vertical alignment, eased smoothly back to the native S05C frame over 60 frames; the last 13 S05C frames remain at native geometry.
- Output: `S05_v003_registered-microblend.mp4`; H.264, 1920 × 1080, 24 fps, 264 frames, 11 seconds, CRF 10; SHA-256 `C71430C2587DF47F54E188C9A24737755A50ADCB532A12FAB818DB45B8302934`.
- QA evidence: seam contact sheet, full contact sheet, exact first/last frames, and forward/reverse review are under `kling-clips/S05-enter-drawing/review/S05_v003/`.
- Follow-up: user reviews S05 v003 at normal speed and in reverse. Approve or reject the complete S05 sequence before activating the next high-risk motion test.

### D065 — Approve S05 v003 and activate S07

- Date: 2026-07-17.
- Status: Approved and locked by the user.
- Decision: Promote `S05_v003_registered-microblend.mp4` byte-for-byte from candidates to approved and close S05. Preserve S05 v001, six-frame v002, and all local hybrid tests unchanged as historical candidates.
- Evidence: candidate and approved SHA-256 are both `C71430C2587DF47F54E188C9A24737755A50ADCB532A12FAB818DB45B8302934`; H.264, 1920 × 1080, 24 fps, 264 frames, 11 seconds.
- Follow-up: activate the planned S07 high-risk exact structure-growth test from approved K06 v002 to approved K07 v030. Submit one candidate only and do not approve automatically.

### D066 — Reject S07 v001 and require a K06.5 intermediate

- Date: 2026-07-17.
- Status: Rejected after forward/reverse and boundary review; no automatic retry authorized.
- Decision: Preserve `S07_v001_locked-camera-structure-growth.mp4` as diagnostic evidence. Do not use it in the final sequence and do not submit the same K06-to-K07 boundary pair again.
- Evidence: Kling generation ID `AS48Nz4n2V8EExfJD0gjchjU31uBc-_aVrGx240gRh4hdzAKKwMj5s1496qw5cmPUa4bWGlo`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `55D629D1F35DD4592D1BFCAAC7F7273E1965DF09763EB0B85E56378F7C284562`.
- Dominant failure: frame zero is already a mostly complete raised white-clay model with furniture/site relief, so the approved flat K06 plan and the required line-to-wall growth are absent. Camera stability and the open courtyard are not enough to pass the primary transformation test.
- Boundary evidence: normalized first-frame-to-K06 SSIM `0.692762`; last-frame-to-K07 SSIM `0.766385`; visual contact sheet confirms that only minor height/shadow changes occur across the clip.
- Reason: K06 to K07 combines flat-to-volume structure, full wall height, furniture relief, and site relief in a single five-second generation. Kling front-loaded the endpoint to reconcile the over-wide state gap.
- Follow-up: create and approve one K06.5 walls-only low/half-height white-clay state with flat furniture/site guides, then test S07A K06-to-K06.5 and S07B K06.5-to-K07 independently. Do not spend more Kling credits before the intermediate is approved.

### D067 — Approve K06.5 v001 and activate S07A

- Date: 2026-07-17.
- Status: Approved and locked by the user.
- Decision: Use `K06-5_v001_low-wall-intermediate.png` as the exact intermediate boundary between K06 and K07. Candidate and approved files are byte-identical.
- Evidence: PNG, 1680 x 945, RGB24; SHA-256 `92CED813A3927A1367AEE7BD71D7A67A250E33658761111D4937DCB82F1FBB41`.
- Reason: the frame preserves the K06 courtyard-side perspective and flat furniture/site guides while introducing only the first low white-clay wall volume.
- Follow-up: submit one paid S07A K06-to-K06.5 Kling candidate only after explicit authorization. Do not generate S07B until S07A passes.

### D068 — Generate S07A v001 and hold for review

- Date: 2026-07-17.
- Status: Complete and awaiting user review; not approved automatically.
- Decision: Preserve `S07A_v001_flat-plan-to-low-walls_kling.mp4` as the sole S07A candidate. Do not generate S07B until the user approves this clip.
- Evidence: Kling generation ID `Ad-fgqtKyesO_2jDa8RJf6yRjxDs3PbUHH68SWk6rj9eBbtLMwyM5oVdMUqTLYT4TAXYNpVj`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `4E5230A4B29C4558971542AADC660E9DCE630C7A230091E913E59CA8A0222C92`.
- Strength: unlike rejected S07 v001, frame zero remains a flat K06 plan and the low walls rise visibly while the camera, plan footprint, flat furniture/site guides, and open courtyard remain stable.
- Review note: most wall growth completes within about the first two seconds, followed by a stable hold. If approved, trim or retime the active growth in post rather than spending credits on an identical retry.
- Boundary evidence: normalized first-frame-to-K06 SSIM `0.891109`; last-frame-to-K06.5 SSIM `0.858904`; contact sheets and forward/reverse review are stored under `review/S07A_v001/`.
- Follow-up: user reviews at normal speed and in reverse; approve or reject S07A v001. S07B remains blocked.

### D069 — Approve S07A v001 and reject S07B v001

- Date: 2026-07-17.
- Status: S07A approved and locked; S07B v001 rejected after boundary and architectural review.
- S07A decision: treat the user's instruction to proceed with K06.5-to-K07 as approval of `S07A_v001_flat-plan-to-low-walls_kling.mp4`. Candidate and approved copies are byte-identical with SHA-256 `4E5230A4B29C4558971542AADC660E9DCE630C7A230091E913E59CA8A0222C92`.
- S07B evidence: generation ID `AVfTvWktbakQPz1gWWh_PCh7zajJWLi_HtzCCNQszcdQsqibe6WIqV5Ye1cQFP86_4Zux9VJ`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `594EC1543FA13090BFA9BA3AE8CE20F8858A8DECADBEEE02CA267136009C7DE2`.
- S07B dominant failure: frame zero already contains a mostly completed dimensional model instead of approved K06.5, and Kling creates a continuous raised boundary around the screen-right/bottom courtyard that is architecturally false.
- Boundary evidence: first-frame-to-K06.5 SSIM `0.707323`; last-frame-to-K07 SSIM `0.664375`; boundary comparison and forward/reverse review are stored under `review/S07B_v001/`.
- Decision: reject S07B v001 and do not retry the same K06.5-to-K07 pair. The remaining state gap and camera mismatch are still too large.
- Follow-up: create K06.75 from the approved K07 camera/framing with full-height shell but flat furniture/site guides. After user approval, divide the remainder into shell/camera completion and furniture/site relief.

### D070 — Generate K06.75 v001 for review

- Date: 2026-07-17.
- Status: Candidate complete; awaiting explicit user approval.
- Decision: use approved K07 v030 as the exact camera, framing and full-height wall-shell authority, while flattening only furniture, fixtures, plants and site objects into registered plan graphics.
- Evidence: `K06-75_v001_full-shell-flat-furniture.png`; PNG, 1680 x 945, RGB24; SHA-256 `48C447C38873826C3ED3EFC5BC86E0125C5BF3A0F07A42473EBD9B34C1F35F71`.
- Initial QA: K07 camera/framing is preserved; full-height walls remain; non-structural elements are flat; open screen-right courtyard remains unobstructed; no false right perimeter is present.
- Follow-up: user approves or rejects K06.75 v001. Do not submit another paid Kling job before approval.

### D071 — Approve K06.75 v001 and reject S07B1 v001

- Date: 2026-07-17.
- Status: K06.75 approved and byte-locked; S07B1 v001 rejected by architectural and boundary QA.
- K06.75 evidence: candidate and approved PNG copies are identical at 1680 x 945, RGB24, SHA-256 `48C447C38873826C3ED3EFC5BC86E0125C5BF3A0F07A42473EBD9B34C1F35F71`.
- S07B1 evidence: generation ID `AUk8ZlSOmzCXsg2Bd-YJyNxcbnGltYNA7btyQwmfdZ6ZtSbEnxTTHya5Slt3chELoHm2ZC3Y`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `6B23C7A8A13B0BCD620246588294108BE7775DB9AF017CFDF04AB31341B42608`.
- Boundary evidence: first-frame-to-K06.5 SSIM `0.669325`; last-frame-to-K06.75 SSIM `0.682679`; comparison, contact sheet, endpoint frames, and forward/reverse review are stored under `review/S07B1_v001/`.
- Rejection reason: the video immediately changes camera/perspective, raises furniture instead of keeping it flat, and invents a continuous raised right/bottom courtyard boundary. This violates the approved open-courtyard geometry and fails both exact handoff frames.
- Decision: preserve the candidate and spend no further credits automatically. S07B2 remains blocked until the shell-only transition passes.
- Follow-up: choose between a deterministic local shell animation/closer intermediate and one explicitly authorized revised Kling retry.

### D072 — Generate K06.625 camera-matched low-wall bridge

- Date: 2026-07-17.
- Status: v002 candidate complete; awaiting explicit user approval.
- Decision: isolate the failed combined move into S07B1A camera-only and S07B1B wall-growth-only clips. K06.625 uses the K06.75 camera/framing and the K06.5 low-wall construction state.
- Evidence: `K06-625_v002_lower-camera-matched-walls.png`; PNG, 1680 x 945, RGB24; SHA-256 `5FE6B7477F2C0AD8C72177E55BC148DA3DB5F4C98BEE4B7BCEA2CF75F726D437`.
- Initial QA: open courtyard preserved; no false raised right/bottom perimeter; furniture and site graphics remain flat; wall height is visibly earlier than K06.75; composition is camera-matched to K06.75.
- Follow-up: approve or reject K06.625 v002. Do not generate paid motion until this boundary is approved.

### D073 — Approve K06.625 v002 and reject S07B1A v001

- Date: 2026-07-17.
- Status: K06.625 v002 approved and byte-locked; S07B1A v001 rejected after boundary QA; S07B1B not generated.
- K06.625 evidence: candidate and approved PNG copies are identical at 1680 x 945, RGB24, SHA-256 `5FE6B7477F2C0AD8C72177E55BC148DA3DB5F4C98BEE4B7BCEA2CF75F726D437`.
- S07B1A evidence: generation ID `AZ0tnPoU8Ls0OG445gfphkQsRmwBcyNKP2QLBPX3neUIpkl8lvxwSKWp8lvXOdfvzC6VUqJh`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `E391B846B3897260CD7C9DF8F28D5785A0CBE38DC021A93BDA1972CAA752FAF2`.
- Boundary evidence: first-frame-to-K06.5 SSIM `0.674807`; last-frame-to-K06.625 SSIM `0.705149`; contact sheet, comparison and forward/reverse review are stored under `review/S07B1A_v001/`.
- Rejection reason: motion is smooth, but Kling does not reach approved K06.625. It ends on a narrower K06.5-derived top-down composition with incompatible plan detail and framing.
- Decision: stop before S07B1B. Preserve the 40-credit candidate and do not retry or switch models automatically.
- Follow-up: choose deterministic/local camera registration or explicitly authorize a revised strict first/tail model retry.

### D074 — Generate S07B1A v002 with strict first/tail Kling 3.0

- Date: 2026-07-17.
- Status: approved and byte-locked; S07B1B subsequently generated after explicit approval.
- Authorization: the user explicitly approved one revised S07B1A attempt using the recommended strict first/tail approach.
- Evidence: generation ID `AdQd1LYspqi0pDuTx4-aOkuN6YlbLEic451NXMeCfgJ9A1t1xHXX8crwRFGfVkfYK4I33W4l`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `F3D028E86B8F97C621C6BE3C491708E79BE4FD7E69D50FB3E5C52CA063C0F435`.
- Model/settings: `kling-video-v3_0`; K06.5 bound as `first_image`; K06.625 v002 bound as `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Boundary evidence: first-frame-to-K06.5 SSIM `0.977998`; last-frame-to-K06.625 SSIM `0.959761`; contact sheet, comparison and forward/reverse review are stored under `review/S07B1A_v002/`.
- Initial QA: the clip performs a continuous camera-only crane/pullback/tilt, keeps the courtyard open and avoids an obvious shell-growth event. The tail is materially closer to K06.625 than rejected v001 (`0.959761` versus `0.705149`).
- Approval: the user approved S07B1A v002 on 2026-07-17. Candidate and approved copies are byte-identical with SHA-256 `F3D028E86B8F97C621C6BE3C491708E79BE4FD7E69D50FB3E5C52CA063C0F435`.
- Follow-up: use the exact approved tail/K06.625 boundary for S07B1B.

### D075 — Approve S07B1A v002 and generate S07B1B v001

- Date: 2026-07-17.
- Status: S07B1A v002 and S07B1B v001 approved and byte-locked; S07B2 subsequently generated after explicit approval.
- Authorization: the user explicitly approved S07B1A and requested the next phase.
- S07B1B evidence: generation ID `AccjVHSW3FnnWqAGWOHFfVv04WuBBd1wWx98uGqcIoyO2mTK3GT1UFv3-bNjFLzIXJ5Cqose`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `616A7F9D8AC81B8AD9050276B1050444A875A9F35D12B31C7FA704B81AB87142`.
- Model/settings: `kling-video-v3_0`; approved K06.625 v002 bound as `first_image`; approved K06.75 v001 bound as `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Boundary evidence: first-frame-to-K06.625 SSIM `0.968087`; last-frame-to-K06.75 SSIM `0.963329`; review assets are stored under `review/S07B1B_v001/`.
- Initial QA: the camera remains visually locked, wall height progresses toward the approved full shell, furniture/site graphics remain flat, and the open right courtyard is retained without a false perimeter. Growth is weighted toward the second half but remains smooth in the sampled frames.
- Approval: the user approved S07B1B v001 on 2026-07-17. Candidate and approved copies are byte-identical with SHA-256 `616A7F9D8AC81B8AD9050276B1050444A875A9F35D12B31C7FA704B81AB87142`.
- Follow-up: use the exact approved K06.75 boundary for S07B2.

### D076 — Approve S07B1B v001 and generate S07B2 v001

- Date: 2026-07-17.
- Status: S07B1B v001 and S07B2 v001 approved and byte-locked; S07 complete; S09 v001 subsequently generated after explicit approval.
- Authorization: the user explicitly approved S07B1B and requested the next phase.
- S07B2 evidence: generation ID `AafWf05hXOPDEQGj0IZwK29G2lDoOs8iIr3c8yVvBsxYqdwLqlo16oWEpcZJejzyioTeI5dL`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `593A0397B18F2D29D4788EB61EF19D45D620BC55C3C899958315528E84032526`.
- Model/settings: `kling-video-v3_0`; approved K06.75 v001 bound as `first_image`; approved K07 v030 bound as `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Boundary evidence: first-frame-to-K06.75 SSIM `0.959460`; last-frame-to-K07 SSIM `0.960555`; review assets are stored under `review/S07B2_v001/`.
- Initial QA: camera/framing and the completed shell remain visually stable; furniture, built-ins, fixtures, plants and terrace elements gain white-clay relief from registered locations; the open courtyard and entry remain intact without a false perimeter.
- Decision: the user approved S07B2 v001 on 2026-07-17. Candidate and approved copies are byte-identical with SHA-256 `593A0397B18F2D29D4788EB61EF19D45D620BC55C3C899958315528E84032526`.
- Follow-up: S09 high-risk material-growth test unblocked.

### D077 — Approve S07B2 v001 and generate S09 v001

- Date: 2026-07-17.
- Status: S07 and S09 approved and closed; S10 v001 subsequently generated after explicit approval.
- Authorization: the user explicitly locked the completed S07 phase and requested the K09 state phase.
- S09 evidence: generation ID `Ac7hkiITQyZwj66m8qgDEjVXUw9_gDyY52IDZItNv2FQhObwjzj0frbEpdTO-amNuxIH1bGr`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `06C8C63F32CF21081BE61416D691085469896B5A450A83069A2A2CD3C51F26E2`.
- Model/settings: `kling-video-v3_0`; approved K08 bound as `first_image`; approved K09 bound as `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Boundary evidence: normalized first-frame-to-K08 SSIM `0.971139`; normalized last-frame-to-K09 SSIM `0.965366`; review assets are stored under `review/S09_v001/`.
- Initial QA: camera/framing and architectural geometry remain visually stable while material and color spread progressively across existing surfaces. The exact tail coverage is reached without an obvious cut.
- Decision: the user approved S09 v001 on 2026-07-17. Candidate and approved copies are byte-identical with SHA-256 `06C8C63F32CF21081BE61416D691085469896B5A450A83069A2A2CD3C51F26E2`.
- Follow-up: S10 unblocked.

### D078 — Approve S09 v001 and generate S10 v001

- Date: 2026-07-17.
- Status: S09 approved and byte-locked; S10 v001 candidate complete and awaiting explicit user review.
- Authorization: the user explicitly approved S09 and requested continuation into the next phases.
- S10 evidence: generation ID `AaD_TQQ1Jk2OluEJHjvvF3pJ03BDjak-JvR_hk94w5rej_G4W8IDOBchNCCI87y5LsCs1je3`; 40 credits; H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds; SHA-256 `3912FFF1B3AD030D4960F15B39EC240C46A3A1B756A5533585981D2C40F22DEA`.
- Model/settings: `kling-video-v3_0`; approved K09 bound as `first_image`; approved K10 bound as `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Boundary evidence: normalized first-frame-to-K09 SSIM `0.962633`; normalized last-frame-to-K10 SSIM `0.960206`; review assets are stored under `review/S10_v001/`.
- Initial QA: architecture and object placement remain stable; the camera change is restrained; finish, glazing and daylight resolve without a visible cut or dramatic exposure event.
- Decision: preserve as an immutable review candidate; do not approve or retry automatically.
- Follow-up: user reviews normal and forward/reverse playback.

## Gate 2 — Geometry and camera

- [ ] Plan cleaned/vectorized.
- [x] Paper fold system approved as the single horizontal K02→K03 reveal; former second unfold omitted by D020.
- [ ] Shell and openings overlay the technical plan.
- [x] Furniture blockout matches footprints through approved visual-source review.
- [x] Camera path K00–K13 approved.
- [x] Final exterior perspective reconciles with chosen render.

## Gate 3 — High-risk motion

- [x] S03/S04 paper registration passes.
- [x] S05 dephysicalization passes.
- [x] S07 structure growth passes.
- [x] S09 material front passes.
- [x] All four scrub forward and backward cleanly.

## Gate 4 — Keyframes

- [x] K00–K13 approved; K04 is an exact K03 alias.
- [x] Every geometry-critical frame passes approved drawing/render review; CAD overlay limitations remain documented.
- [x] Light/material continuity passes.
- [x] Boundary source filenames recorded.

## Gate 5 — Kling clips

- [ ] S01–S13 approved.
- [ ] Exact end/start files reused.
- [ ] No cuts, drift, flicker, or topology change.
- [ ] Candidate/rejection logs complete.

## Gate 6 — Composite

- [ ] Master timeline boundaries clean.
- [ ] Linework restored where required.
- [ ] Exposure/white balance stable.
- [ ] Final grade approved.
- [ ] Mezzanine master exported.

## Gate 7 — Web

- [ ] Adaptive WebP sequences generated.
- [ ] Manifest validated.
- [ ] Initial load within budget.
- [ ] Decode/memory within target devices.
- [ ] Forward/reverse scroll passes.
- [ ] Mobile framing passes.
- [ ] Reduced-motion alternative passes.

## Universal rejection criteria

Reject immediately if:

- A wall, opening, or furniture footprint changes.
- An unapproved object appears.
- The camera cuts or changes lens unexpectedly.
- Plan linework crawls beyond repair.
- Exposure or material identity changes between boundaries.
- The effect becomes fantasy-like or visually louder than the architecture.
- Start or end differs from its approved boundary file.
- Reverse scrub produces an incoherent transformation.

## Review order

Always review in this order:

1. Architectural accuracy.
2. Boundary continuity.
3. Camera logic.
4. Transformation logic.
5. Light/material continuity.
6. Aesthetic quality.

A beautiful candidate that fails an earlier category cannot be approved.
