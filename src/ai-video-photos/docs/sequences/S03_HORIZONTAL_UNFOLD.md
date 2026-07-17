# S03 — Horizontal Paper Unfold

## Status

**State:** Approved — S03 v002 locked byte-for-byte  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-17  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Open the blank compact paper packet once along its predetermined vertical fold axis until the complete registered L-28 plan lies fully visible on one continuous wide sheet.

## Active-phase entry assessment

- S02 is closed through approved `S02_v002_split-camera-to-bird-pov.mp4`.
- S03 is closed through approved `S03_v002_horizontal-unfold_hinge-locked.mp4`; do not regenerate or overwrite it.
- What currently works: the right paper half remains visually anchored, one main panel opens toward the left, the plan reveal is readable, table/props remain stable, and v001's large whole-sheet translation is removed.
- Review focus: slight taper of the moving panel near the vertical position, broad fold shadow, whether the lift reads too much like a booklet/page turn, and whether reverse scrub feels physically coherent.
- Exact next action: activate S05 and test the K03→K05 camera push/dephysicalization transition.

## Narrative role

- Service/process label: Consultant → Architecture.
- Story meaning: the concealed project brief becomes a precise architectural plan.
- Scroll range: 18–32%.

## Boundary frames

- Start frame ID: K02.
- Start filename: `../../production/keyframes/K02-overhead-folded-plan/approved/K02_v005_user-approved-hinge-aligned-right-half.png`.
- Start SHA-256: `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`.
- End frame ID: K03.
- End filename: `../../production/keyframes/K03-horizontal-unfold/approved/K03_v008_horizontal-unfold_L-sofa-restored.png`.
- End SHA-256: `B95D28B0B61E033BD2F118470838BB13BAAD9F1B6A69BB4AAF7C006BB434884D`.
- Previous sequence boundary verified: Yes; approved S02 v002 reaches the K02 bird's-eye composition and K02 v005 remains the exact paper-unfold boundary.
- Pixel-identical boundary verified: Yes; the v005 candidate and approved copies are byte-identical, and K03 remains the immutable approved file.

### Approved motion-safe start boundary

- Candidate filename: `../../production/keyframes/K02-overhead-folded-plan/candidates/K02_v005_user-approved-hinge-aligned-right-half.png`.
- Approved filename: `../../production/keyframes/K02-overhead-folded-plan/approved/K02_v005_user-approved-hinge-aligned-right-half.png`.
- Candidate/approved SHA-256: `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`.
- Dimensions: 1672 × 941.
- Status: Explicitly approved by the user on 2026-07-16.
- Approved K02 v003 remains retained as the original visual boundary; v004 remains an immutable superseded motion-safe candidate.
- Approved K03 v008 remains byte-unchanged.
- Registration intent: the closed packet occupies K03's stationary right-half footprint so the left edge acts as the hinge and the moving panel opens left.

## References

- Project source: `../../architectural-blueprint-drawing.jpg`.
- Previous approved frame: exact user-approved K02 v005 above.
- Relevant end-state reference: exact approved K03 v008 above.
- Visual bible section: [02_VISUAL_DIRECTION.md](../02_VISUAL_DIRECTION.md), paper and ink language.
- Camera/motion bible section: [03_CAMERA_AND_MOTION_SYSTEM.md](../03_CAMERA_AND_MOTION_SYSTEM.md), paper unfold and K02→K03 camera lock.

## Locked invariants

- Geometry: the round mineral-composite table, table crop, and full studio/tabletop composition remain fixed. K02 v005's left paper edge is the hinge; K03's complete right half is the stationary base.
- Doors/windows: N/A; architectural linework must remain identical to approved K03 once revealed.
- Furniture/objects: limestone sample, oak sample, ruler, and pencil remain completely static with no duplication, drift, or deformation.
- Material state: blank natural-white architectural paper outside; black and neutral-gray plan linework only on the concealed inner face.
- Light direction/exposure: preserve the exact broad upper-left daylight, warm-neutral balance, shadows, and exposure of the boundary frames.
- Camera/lens properties that cannot change: locked near-overhead camera, fixed crop, fixed target, approximately 45–55 mm equivalent, no dolly, crane, tilt, roll, zoom, or lens change.

## Camera action

**Primary move:** Locked camera; no camera movement.  
**Secondary adjustment, if any:** None.  
**Camera target:** Exact center of the complete registered final sheet; the camera and table remain fixed.  
**Lens:** Fixed near-orthographic 45–55 mm architectural perspective.  
**Easing character:** Camera remains static; paper motion starts slowly, accelerates through the middle, and ends with a restrained 1–2% physical settle without bounce.

## Transformation action

The compact blank packet occupies the exact stationary right-half footprint of the final sheet. Its left edge is a fixed vertical hinge. The complete right half, hinge, corners, and contact shadow remain pinned to the table while only the upper folded panel rotates 180° toward the left until one continuous wide sheet lies open. The exact approved black/neutral-gray L-28 plan is revealed only from the concealed inner face and stays registered to the paper. Paper remains quality architectural stock with restrained crease relief and contact shadows—never cloth, a booklet, loose pages, or a translating object.

## Kling settings

- Model/version: `kling-video-v3_0_omni`.
- Mode: Start & End Frames.
- Aspect: 16:9.
- Duration: 5 seconds.
- Audio: Off.
- Other settings: resolution `1080p`; image count `1`; `prefer_multi_shots=false`; `enable_audio=false`; exact K02 start image plus exact K03 tail image.

## Positive prompt

> Use Image 1 as the exact first frame and Image 2 as the exact final frame. One continuous locked top-down architectural shot. Preserve the exact warm off-white round mineral-composite table, fixed camera, crop, lens, pale limestone sample, light-oak veneer sample, matte-black ruler, black mechanical pencil, material palette, object positions, shadows, exposure, and upper-left daylight. The folded packet in Image 1 already occupies the exact right-half footprint of the final open sheet in Image 2. Its left paper edge is the permanent vertical hinge. The complete right half of the paper, its right edge, top-right corner, bottom-right corner, contact shadow, and hinge line remain pixel-locked to the table for the entire shot. Only the single folded upper panel rotates 180 degrees around that stationary vertical hinge and opens toward the left until the exact Image 2 sheet lies flat. There is zero planar translation, sliding, recentering, scaling, drifting, or repositioning of the fixed paper half. Reveal the exact black and neutral-gray L-28 plan only from the concealed inner face, continuously registered to the rotating paper and exact Image 2 geometry. Use physically plausible architectural drawing stock: slow initial lift, smooth controlled rotation, gentle flattening, no bounce. Preserve the exact final room layout, courtyard orientation, openings, interior linework, furniture footprints, and L-shaped sofa. Motion is slow, cinematic, stable, restrained, continuous, single-shot, and suitable for forward and reverse scroll scrubbing with minimal motion blur.

## Negative prompt

> camera movement, zoom, dolly, crane, tilt, roll, lens switch, cut, reframing, table deformation, object drift, duplicated object, missing object, moving ruler, moving pencil, moving material sample, moving hinge, moving fixed right half, paper translation, paper sliding, paper recentering, paper scale change, base-panel drift, changing contact shadow, booklet, notebook, brochure, bound pages, spine, page stack, loose sheets, page turning, second moving panel, cloth motion, wind, flutter, curling chaos, elastic bounce, tearing, cracking, extra fold, vertical unfold, mirrored plan, rotated plan, blue paper, blueprint blue, white ink, new linework, crawling linework, warped plan, changed room, missing room, added wall, shifted opening, furniture drift, missing L-shaped sofa, text, logo, watermark, hands, people, magical particles, glow, flicker, texture boiling, exposure pumping, heavy motion blur

## Candidate log

| Version | Date | Prompt/settings change | Strength | Failure | Decision |
|---|---|---|---|---|---|
| S03_v001 | 2026-07-16 | Initial locked-camera first-tail unfold; Kling 3.0 Omni, 5.04 s, 1080p, 24 fps, audio off, single shot | Stable table/camera/props; clear blank-to-plan reveal; end composition remains close to K03 | Folded packet translates across the table and recenters while opening because both boundaries were independently centered; middle lift also reads somewhat like a booklet/multi-panel page action | Rejected; preserve unchanged |
| S03_v002 | 2026-07-16 | Replace start with user-approved K02 v005; pixel-lock hinge and complete right half; only one panel rotates left | The obvious whole-sheet translation/recentering from v001 is removed in sampled frames; fixed right edge/base remain visually anchored and the panel opens left in one continuous shot | Slight moving-panel taper and broad fold shadow remain acceptable at the approved review threshold; Kling watermark/resampling remain delivery artifacts | Approved and locked by the user on 2026-07-17 |

### S03 v001 generation record

- Candidate: `../../production/kling-clips/S03-horizontal-unfold/candidates/S03_v001_horizontal-unfold.mp4`.
- Forward/reverse QA loop: `../../production/kling-clips/S03-horizontal-unfold/review/S03_v001/S03_v001_forward-reverse-review.mp4`.
- Contact sheet: `../../production/kling-clips/S03-horizontal-unfold/review/S03_v001/S03_v001_contact-sheet.png`.
- Kling generation ID: `AT-TdcEYkezS4tu0R7JUTL7zYpZ4LqrKpXrJU1BEVWXzBr_zvmgcZjw2XmivgNxLWBdIFKyD`.
- Task trace ID: `019f6b12-d519-79a5-b107-a55183bcb23b`.
- Credits consumed: `40`.
- Candidate SHA-256: `7E9BE58E75823700D681B25FF8CF3454D3874ADD566EF3B2D5BD655230CA46E0`.
- Delivered media: H.264, 1920 × 1080, 24 fps, 5.041667 seconds, approximately 6.70 Mb/s.
- Boundary comparison: after scaling the approved 1672 × 941 frames to the delivered raster and excluding the watermark side, first-frame SSIM against K02 is `0.956224`; last-frame SSIM against K03 is `0.950127`.

### S03 v002 generation record

- Candidate: `../../production/kling-clips/S03-horizontal-unfold/candidates/S03_v002_horizontal-unfold_hinge-locked.mp4`.
- Forward/reverse QA loop: `../../production/kling-clips/S03-horizontal-unfold/review/S03_v002/S03_v002_forward-reverse-review.mp4`.
- Full contact sheet: `../../production/kling-clips/S03-horizontal-unfold/review/S03_v002/S03_v002_contact-sheet.png`.
- Paper-motion contact sheet: `../../production/kling-clips/S03-horizontal-unfold/review/S03_v002/S03_v002_paper-motion-contact-sheet.png`.
- Kling generation ID: `AceVRNBQiYnR0LlGhbZoZqukdwpNwJdo_gBGtA1g1Ef_EkYs3MTPncEjUVFYN1eu_xWiWCwp`.
- Task trace ID: `019f6b81-4ee1-78c7-93ff-35cb78cfe533`.
- Credits consumed: `40`.
- Candidate SHA-256: `1991BCC24A09D97F90B52E9077527B319B0B69EF4F6AD4294326D2BC1577282C`.
- Delivered media: H.264, 1920 × 1080, 24 fps, 5.041667 seconds, approximately 7.15 Mb/s.
- Boundary comparison: after scaling approved boundaries to the delivered raster and excluding the watermark side, first-frame SSIM against K02 v005 is `0.941359`; last-frame SSIM against K03 v008 is `0.920147`.
- Initial motion QA: the complete right side is visually anchored across the six-frame paper crop and the moving panel opens left; v001's large recentering is not visible. Final judgment belongs to normal-speed and reverse-scrub review.

## QA

### Architecture

- [x] Geometry remains registered through the reveal at the approved review threshold.
- [x] Openings remain registered through the reveal at the approved review threshold.
- [x] Tabletop furniture/objects remain fixed and are not intentionally animated.

### Camera

- [x] One continuous path.
- [x] No cut or lens switch.
- [x] Target and perspective remain stable.

### Motion

- [x] Primary blank-to-plan opening action is clear.
- [x] No objectionable secondary transformation at the approved review threshold.
- [x] Minimal motion blur.
- [x] Forward and reverse scrub are accepted by the user.

### Continuity

- [x] Start remains visually close to approved K02; SSIM `0.956224` after raster normalization and watermark exclusion.
- [x] End remains visually close to approved K03; SSIM `0.950127` after raster normalization and watermark exclusion.
- [x] Exposure/grade remain stable across the clip.
- [ ] No boundary delivery difference; Kling resampled 1672 × 941 inputs to 1920 × 1080 and added its standard delivery watermark.

## Approval

- Approved candidate: S03 v002.
- Approved filename: `../../production/kling-clips/S03-horizontal-unfold/approved/S03_v002_horizontal-unfold_hinge-locked.mp4`.
- Approval date: 2026-07-17.
- Notes: S03 v001 remains rejected. The approved file is byte-identical to the immutable v002 candidate with SHA-256 `1991BCC24A09D97F90B52E9077527B319B0B69EF4F6AD4294326D2BC1577282C`.
- Next sequence unblocked: S05 high-risk dephysicalization test.

## Blocker, if any

None. S03 is closed; do not submit another paid retry.
