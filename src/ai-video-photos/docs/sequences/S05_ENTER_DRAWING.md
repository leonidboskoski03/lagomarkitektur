# S05 — Enter the Drawing

## Status

**State:** Approved — S05 v003 registered micro-blend locked  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-17  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Move continuously from looking at the complete physical drawing on the table to being inside a clean, full-screen black-line plan world.

## Narrative role

- Service/process label: Architecture → Design space.
- Story meaning: the physical document becomes the project’s representational world.
- Scroll range: 32–46%.

## Boundary frames

- Start frame ID: K03; K04 is an exact zero-duration alias.
- Start filename: `../../production/keyframes/K03-horizontal-unfold/approved/K03_v008_horizontal-unfold_L-sofa-restored.png`.
- Start SHA-256: `B95D28B0B61E033BD2F118470838BB13BAAD9F1B6A69BB4AAF7C006BB434884D`.
- End frame ID: K05.
- End filename: `../../production/keyframes/K05-flat-plan-world/approved/K05_v002_flat-blueprint-world_warm-white.png`.
- End SHA-256: `49755E49D4BA176706789A789C2AD8D80EF534C69C8F77A742B04FA8F18E008E`.
- Previous sequence boundary verified: Yes; S03 ends at approved K03.
- Pixel-identical boundary verified: Yes for source files; Kling delivery will be checked after raster resampling.

## References

- Project source: `../../architectural-blueprint-drawing.jpg`.
- Previous approved frame: K03 v008 above.
- Registered ink source: `../../production/keyframes/K03-horizontal-unfold/references/L28_plan_rotated-ccw_bold-interior_with-L-sofa.png`.
- Visual bible: [02_VISUAL_DIRECTION.md](../02_VISUAL_DIRECTION.md), especially paper and drawing language.
- Camera/motion bible: [03_CAMERA_AND_MOTION_SYSTEM.md](../03_CAMERA_AND_MOTION_SYSTEM.md), K03→K05 path and paper-to-plan easing.

Do not attach exterior renders or intermediate process references to this generation.

## Locked invariants

- Geometry: exact K03/K05 plan registration, room order, wall paths, courtyard-right orientation, and site boundary.
- Doors/windows: every opening remains fixed and legible; no new, missing, or shifted opening.
- Furniture/objects: every plan symbol and the canonical top-center L-shaped sofa remain registered. Table objects remain fixed until naturally cropped outside the viewport.
- Material state: physical white paper becomes a continuous warm architectural-white field; black/neutral-gray ink remains unchanged.
- Light direction/exposure: upper-left studio daylight and warm-neutral exposure stay stable while physical relief fades.
- Camera/lens properties that cannot change: perfectly top-down target, no tilt, pan, roll, lateral translation, lens switch, or perspective change.

## Camera action

**Primary move:** One slow, centered, straight push toward the plan until the paper perimeter and complete studio/table environment pass naturally outside the viewport.  
**Secondary adjustment, if any:** None.  
**Camera target:** The central circulation spine of the registered L-28 plan.  
**Lens:** Fixed orthographic-like 50–55 mm full-frame equivalent; apparent scale changes only through the push.  
**Easing character:** Slow start, broad steady middle, and soft finish; no crash zoom or last-second acceleration.  

## Transformation action

After the push is established, the physical paper relief flattens smoothly from the exact plan center outward. Fold highlights, the central crease, contact shadow, fiber, and remaining studio-light relief recede behind one broad invisible center-out front. The front itself must not appear as a ring, crack, glow, ripple, portal, or particle effect. The black and neutral-gray plan ink remains attached, crisp, registered, and unchanged while the surface becomes the continuous warm-white K05 world.

## Kling settings

- Model/version: verify through live `who_am_i`; target Kling 3.0 Omni only if currently declared for first/tail image-to-video.
- Mode: Start & End Frames.
- Aspect: 16:9.
- Duration: 5 seconds.
- Resolution: 1080p.
- Audio: Off.
- Multi-shot: Off.
- Outputs: One.

## Positive prompt

> One continuous top-down architectural shot from Image 1 to Image 2. Preserve the exact registered L-28 plan: identical room order, walls, doors, windows, furniture symbols, central circulation spine, courtyard on the right, and the top-center L-shaped sofa. Begin immediately with one slow centered straight camera push toward the center of the open plan. Keep the camera perfectly perpendicular to the table with no tilt, pan, roll, lateral drift, reframing, or lens change. The paper and all tabletop objects remain completely stationary; the table, samples, ruler, pencil, paper perimeter, and studio environment leave the frame only because of the camera push. Once the paper fills the viewport, smoothly flatten only its physical surface relief from the central circulation spine outward: the central fold crease, fold highlights, contact shadow, subtle fiber, and studio-light relief quietly recede behind a broad invisible center-out front. Keep every black and neutral-gray plan line sharp, attached to the surface, and geometrically registered throughout; the linework only enlarges naturally with the camera and never redraws, crawls, dissolves, or morphs. Finish exactly as Image 2: a continuous warm architectural-white full-screen plan world with no visible paper edge, table, prop, crease, fiber, contact shadow, or studio cue. Motion is slow, cinematic, stable, restrained, reversible, and continuous with minimal motion blur and a soft finish.

## Negative prompt

> camera cut, lens switch, camera tilt, camera roll, camera pan, lateral drift, recentering jump, crash zoom, fisheye, wide-angle stretch, perspective change, paper sliding, paper scaling independently, moving table object, disappearing prop before crop, plan redraw, crawling line, dissolving ink, warped plan, changed room, missing room, added wall, moving wall, shifted window, extra window, shifted door, extra door, furniture drift, missing L-shaped sofa, mirrored plan, rotated plan, blue paper, blueprint blue, white ink, visible wave ring, ripple, crack, tearing, paper breaking, portal, glow, particles, hologram, liquid effect, heavy bloom, heavy motion blur, flicker, texture boiling, exposure pumping, text, logo, hands, people

## Candidate log

| Version | Date | Prompt/settings change | Strength | Failure | Decision |
|---|---|---|---|---|---|
| S05_v001 | 2026-07-17 | Initial exact K03→K05 first/tail test; centered push plus invisible center-out relief flattening; Kling 3.0 Omni, 5.04 s, 1080p, 24 fps, audio/multi-shot off | Coherent continuous centered push; table and props exit through the camera move; the clip reaches a clean white plan world without a cut or fantasy effect | The physical sheet briefly gains a stronger floating edge/drop shadow before flattening; delivered K05 framing is horizontally overscaled/warped relative to the exact approved boundary, so thin-line endpoint SSIM is low | Pending user review; not approved |
| S05A_v003 | 2026-07-17 | Exact user-supplied eight-second camera-push clip; 1080p, 24 fps | Stable high-quality forward push; table texture holds; props leave naturally through the viewport; plan remains centered and sharp | Final frame is close but not pixel-identical to S05C v001 opening, so a direct dissolve ghosts architectural lines | Approved and locked as authoritative camera-push segment; registered S05C join still required |
| S05_v002 | 2026-07-17 | Registered S05C opening with a six-frame dissolve | Removes the positional jump and preserves native S05C ending | Six-frame overlap visibly softens/doubles architectural lines | Superseded; preserved in candidates |
| S05_v003 | 2026-07-17 | S05C opening registered approximately 20 px vertically, eased to native over 60 frames; two-frame micro-blend; CRF 10 | Stable high-quality join with substantially reduced line ghosting; ends on native S05C framing | Complete joined sequence still requires normal-speed and reverse-scrub user review | Active candidate; not approved automatically |

### S05 v001 generation record

- Candidate: `../../production/kling-clips/S05-enter-drawing/candidates/S05_v001_enter-drawing.mp4`.
- Forward/reverse QA loop: `../../production/kling-clips/S05-enter-drawing/review/S05_v001/S05_v001_forward-reverse-review.mp4`.
- Contact sheet: `../../production/kling-clips/S05-enter-drawing/review/S05_v001/S05_v001_contact-sheet.png`.
- First/last comparison images: `../../production/kling-clips/S05-enter-drawing/review/S05_v001/S05_v001_first-vs-K03.png` and `../../production/kling-clips/S05-enter-drawing/review/S05_v001/S05_v001_last-vs-K05.png`.
- Kling generation ID: `AcuC3ct-Zdno7kYsoX0ss6On9hGwTgPuUvx4Rxy1752a6qt4eiLOqdSzpfny21q5-oL7jfB0`.
- Task trace ID: `019f6d16-92bf-7000-8000-000000000000`.
- Credits consumed: `40`.
- Candidate SHA-256: `D3C379120165C1BE55709C2CA30F87751E7E6E2177450AE0674559629CCF1ACC`.
- Delivered media: H.264, 1920 × 1080, 24 fps, 121 frames, 5.041667 seconds, approximately 17.73 Mb/s.
- Boundary comparison after raster normalization and watermark-side exclusion: first frame versus K03 raw SSIM `0.840124`; first-frame low-pass SSIM `0.953602`; last frame versus K05 raw SSIM `0.435366`. The last-frame side-by-side shows a wider delivered plan footprint than the approved K05 boundary, not merely watermark resampling.
- Preliminary motion QA: the main camera push is readable and continuous. The middle temporarily presents the plan as a more strongly floating rectangular sheet, and exact line registration needs user judgment in the forward/reverse loop.

## QA

### Architecture

- [ ] Geometry unchanged.
- [ ] Openings unchanged.
- [ ] Furniture and plan symbols remain registered.

### Camera

- [x] One continuous centered push.
- [x] No visible cut, lens switch, tilt, roll, or lateral drift in sampled frames.
- [ ] Target and top-down perspective remain exact; delivered end-plan horizontal scale differs from K05.

### Motion

- [ ] Physical relief flattening is clear but the mid-transition sheet shadow becomes stronger before disappearing.
- [x] No visible fantasy wave, crack, glow, or particle effect in sampled frames.
- [ ] Minimal motion blur.
- [ ] Forward and reverse scrub are coherent.

### Continuity

- [x] Start remains visually close to approved K03 v008 after delivery normalization; low-pass SSIM `0.953602`.
- [ ] End does not match approved K05 v002 closely enough for automatic approval; the plan footprint is horizontally wider and raw endpoint SSIM is `0.435366`.
- [ ] Exposure/grade match adjacent sequences.
- [ ] No objectionable boundary compression/crop difference.

## Approval

- Approved segment: S05A v003 camera push.
- Approved filename: `../../production/kling-clips/S05-enter-drawing/approved/S05A_v003_user-approved-camera-push.mp4`.
- Approval date: 2026-07-17.
- SHA-256: `4D3B71161C596E1D5F33472DFD10DF6361AB2189BCE6CAE673098AE5291FDD3B`.
- Media: H.264, 1920 × 1080, 24 fps, 193 frames, 8.041667 seconds.
- Notes: Candidate and approved files are byte-identical to the user upload. This approval locks only the camera-push segment; the complete joined S05 remains pending.
- Approved complete sequence: `../../production/kling-clips/S05-enter-drawing/approved/S05_v003_registered-microblend.mp4`.
- Complete-sequence SHA-256: `C71430C2587DF47F54E188C9A24737755A50ADCB532A12FAB818DB45B8302934`.
- Complete-sequence approval: user-approved and locked on 2026-07-17; candidate and approved copies are byte-identical.
- Next sequence unblocked: S07 high-risk structure-growth test.
- Next sequence unblocked: S07 high-risk wall-growth test after S05 passes.

## Blocker, if any

S05 v001 requires user review. The likely failure is geometric: Kling reaches the flat-plan world but widens/overscales the registered plan and briefly strengthens the floating paper shadow. Preserve v001 unchanged. If rejected, the recommended next action is one registered physical-plan close-up intermediate boundary that already matches K05 scale, splitting camera push from dephysicalization; do not retry automatically.
