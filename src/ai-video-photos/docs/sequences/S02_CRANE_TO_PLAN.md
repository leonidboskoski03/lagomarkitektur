# S02 — Crane to Plan

## Status

**State:** Approved — S02 v002 clean split master  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-16  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Move from the medium-high table approach into a calm near-bird's-eye composition while the camera remains optically locked on the folded paper and every tabletop object remains physically static.

## Narrative role

- Service/process label: Opening arrival → architectural focus.
- Story meaning: the viewer leaves the studio overview and commits attention to the concealed project document.
- Scroll range: 10–18%.

## Boundary frames

- Start frame ID: K01 replacement candidate.
- Start filename: `../../production/keyframes/K01-table-approach/approved/K01_v002_hinge-aligned-approach.png`.
- Start SHA-256: `268F9056C7D137CBD2220687DEA8DE164A61D5E6F2957BADD632ECFE667FB520`.
- Start approval: Explicitly approved by the user on 2026-07-16; candidate and approved copies are byte-identical.
- End frame ID: K02.
- End filename: `../../production/keyframes/K02-overhead-folded-plan/approved/K02_v005_user-approved-hinge-aligned-right-half.png`.
- End SHA-256: `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`.
- Previous sequence boundary verified: S01 will be reconciled later because K00 still uses the earlier paper anchor.
- Pixel-identical boundary verified: Yes; K01 v002 candidate/approved bytes match and K02 v005 is immutable and approved.

## Locked invariants

- Geometry: round mineral-composite table, cylindrical base, studio architecture, floor, window recess, curtain, and cabinetry remain rigid.
- Furniture/objects: blank folded paper, limestone sample, oak sample, black ruler, and black mechanical pencil stay fixed to their exact physical tabletop anchors with no independent motion.
- Material state: no unfolding and no plan linework; the paper's visible outer face remains completely blank.
- Light direction/exposure: broad diffused daylight remains from the upper-left with stable warm-neutral exposure and no shadow travel.
- Camera/lens properties that cannot change: one continuous shot, fixed lens character, zero roll, no cut, no lens switch, no independent digital zoom.

## Camera action

**Primary move:** Slow upward crane combined with a restrained inward arc toward the table.  
**Secondary adjustment:** Progressive downward tilt from the K01 medium-high three-quarter angle to K02's near-bird's-eye angle.  
**Camera target:** The center of the blank folded paper remains the optical target throughout; the camera moves around that target instead of translating the paper in frame.  
**Lens:** Fixed natural architectural perspective, approximately 45–50 mm equivalent; preserve straight geometry and avoid wide-angle stretching.  
**Easing character:** Very soft start, nearly constant controlled middle, soft deceleration into K02; no overshoot, rebound, orbit flourish, or acceleration spike.

## Transformation action

None. Only the camera moves. The table, folded packet, four supporting objects, environment, daylight, shadows, materials, and paper state remain physically unchanged.

## Kling settings

- Model/version: verify live schema immediately before submission; prefer the same proven start-tail video model used for S03 if still available.
- Mode: Start & End Frames.
- Aspect: 16:9.
- Duration: 5 seconds.
- Audio: Off.
- Other settings: one output, single shot, 1080p when supported, multi-shot disabled.

## Positive prompt

> Use Image 1 as the exact first frame and Image 2 as the exact final frame. Create one continuous slow cinematic architectural camera move. The camera gently approaches the round mineral-composite table while craning upward and progressively tilting downward until it reaches the near-bird's-eye composition of Image 2. Keep the optical target locked on the center of the blank folded paper for the entire shot, so the camera moves around the stationary tabletop arrangement rather than making the paper slide or recenter independently. Preserve the exact physical tabletop anchors, shapes, proportions, materials, and spacing of the blank folded paper, pale limestone sample, light-oak sample, matte-black ruler, and black mechanical pencil. The paper remains one completely blank folded architectural sheet with no opening, drawing, text, symbols, labels, or page motion. Preserve the rigid round table, table edge, base, calm mineral studio, window recess, curtain, oak cabinetry, floor, upper-left diffused daylight, shadows, exposure, and warm-neutral palette. Use a fixed natural architectural lens with straight geometry and restrained parallax. Motion is slow, smooth, stable, single-shot, minimally blurred, and suitable for precise forward and reverse scroll scrubbing. End exactly on Image 2 without overshoot or settle.

## Negative prompt

> paper sliding, paper translation, paper recentering, paper rotation, paper opening, unfolding, page turning, booklet, notebook, brochure, spine, binding, plan drawing, linework, text, numbers, symbols, object drift, moving ruler, moving pencil, moving sample, duplicated object, missing object, table deformation, changing table shape, wide-angle stretching, fisheye, foreground distortion, digital zoom, lens breathing, focal-length change, roll, sideways orbit, abrupt acceleration, overshoot, bounce, cut, transition, multi-shot, lighting change, shadow travel, exposure pumping, texture boiling, blur, flicker, people, hands, logo, watermark

## Subdivision rule

Do not add a K01.5 frame before the first S02 test. K01 already exists specifically as the midpoint that divides the full K00→K02 compound camera journey. Introduce `K01.5` and split S02 into two clips only if the first 5-second test produces structural warping, object drift, an unintended orbit, or an unstable approach to the final overhead angle.

## Candidate log

| Version | Date | Prompt/settings change | Strength | Failure | Decision |
|---|---|---|---|---|---|
| S02_v001 | 2026-07-16 | Initial camera-only crane/tilt using approved K01 v002 and K02 v005; Kling 3.0 Omni, 5 s, 1080p, one output, audio/multi-shot off | Smooth single camera passage; paper remains closed and blank; supporting object set remains coherent | Does not reach K02 alone | Approved only as the S02A component of the final split master |
| S02B_v001 | 2026-07-16 | Three-second continuation from the exact clean final frame of S02 v001 to approved K02 v005 | Continues toward a more overhead angle; paper remains blank/closed and object set stays coherent inside the clip | Kling re-renders the supplied bridge at a closer crop, causing a visible A→B seam jump; final frame still does not match exact K02 framing | Rejected as seamless assembly candidate; preserve for review |
| S02B_v002 | 2026-07-16 | User-supplied five-second continuation from the S02A clean tail toward K02 | Near-pixel opening registration, slow coherent continuation, stable blank paper and objects, convincing bird's-eye landing | Minor normal Kling resampling/grade differences remain | Approved; supersedes S02B v001 |

## S02 v001 generation record

- Candidate: `../../production/kling-clips/S02-crane-to-plan/candidates/S02_v001_crane-to-plan.mp4`.
- Forward/reverse QA loop: `../../production/kling-clips/S02-crane-to-plan/review/S02_v001/S02_v001_forward-reverse-review.mp4`.
- Contact sheet: `../../production/kling-clips/S02-crane-to-plan/review/S02_v001/S02_v001_contact-sheet.png`.
- Kling generation ID: `AZvU3f2RTGosTKysRJigNVPswSlxre_IsHYx_Y-jQ5J9hvBXwwEBPB6DwHJy7mmywe63xrfP`.
- Task trace ID: `019f6bc4-bd62-7c9e-868b-b12d205a5757`.
- Credits consumed: `40`.
- Candidate SHA-256: `03CACCD7222A10B6C294334401CD6298C3D74D897D2189E78E6828FC7587B919`.
- Delivered media: H.264, 1920 × 1080, 24 fps, 5.041667 seconds, approximately 10.12 Mb/s.
- Boundary comparison: after scaling the approved images to the delivered raster and excluding the bottom-right watermark region, first-frame SSIM against K01 v002 is `0.775978`; last-frame SSIM against K02 v005 is `0.774809`.
- Initial QA: the motion reads as a continuous upward/inward crane with downward tilt and the paper remains blank/closed. However, the delivered final frame remains materially oblique and does not reach K02 v005's full bird's-eye table geometry. No automatic retry is authorized.

## S02 split-continuation record

- Exact clean S02A tail/bridge: `../../production/kling-clips/S02-crane-to-plan/bridge/approved/K01_5_v001_exact-S02A-clean-tail.png`.
- Bridge provenance: frame 120 of 121 from the clean S02A source; 1920 × 1080; SHA-256 `ADDD37A6A29FBB145414C3E0859BB558FF29061A3E34904A8AD476AC44C0F44C`.
- S02B candidate: `../../production/kling-clips/S02-crane-to-plan/continuations/candidates/S02B_v001_bridge-to-bird-pov.mp4`.
- S02B generation ID: `AeiK-VISdFRPDfJX7oI4cKRFsmLu7I3UwRhEGSk2hJRusKM82VGBVrDULXy2ZT1bnhYX4f_D`.
- Task trace ID: `019f6bc4-bd62-7c9e-868b-b12d205a5757`.
- Credits consumed: `24`.
- S02B candidate SHA-256: `70571B22228AA6936B5AAB91D6FB0DC60030C8787C2B46A8A7BF5838D877C0AF`.
- Delivered media: H.264, 1920 × 1080, 24 fps, 3.041667 seconds, approximately 11.64 Mb/s.
- S02B contact sheet: `../../production/kling-clips/S02-crane-to-plan/review/S02B_v001/S02B_v001_contact-sheet.png`.
- S02B forward/reverse loop: `../../production/kling-clips/S02-crane-to-plan/review/S02B_v001/S02B_v001_forward-reverse-review.mp4`.
- Combined clean A+B review: `../../production/kling-clips/S02-crane-to-plan/review/S02_split_v001/S02_split_v001_combined-clean.mp4`; 8.041667 seconds; SHA-256 `A491DEA9A82AF0BC18D9C894237A4CC9C3B6C024B181AD2E34E81C577A88A72B`.
- Combined forward/reverse loop: `../../production/kling-clips/S02-crane-to-plan/review/S02_split_v001/S02_split_v001_forward-reverse-review.mp4`.
- Seam evidence: SSIM between the exact clean S02A tail and delivered S02B first frame is `0.781007`; the closer crop is plainly visible.
- Endpoint evidence: SSIM between delivered S02B last frame and approved K02 v005 is `0.754342`; the final table crop and object registration remain materially different.
- Decision: the conceptual split is sound, but this generated S02B does not provide a seamless assembly boundary and must not be approved automatically.

## Approved S02 v002 split master

- Approved continuation candidate: `../../production/kling-clips/S02-crane-to-plan/continuations/approved/S02B_v002_user-5s.mp4`.
- Candidate/approved S02B v002 SHA-256: `A35748787DBDF8CDBF46BFD4B553C5F2794DCBEF94DEBB1CBD8CB6C79297E2A2`.
- S02B v002 media: H.264, 1920 × 1080, 24 fps, 5.041667 seconds.
- Opening registration: SSIM against exact clean S02A tail `0.977735`.
- Endpoint registration: SSIM against approved K02 v005 `0.922653` before final master encoding.
- Approved assembled master: `../../production/kling-clips/S02-crane-to-plan/approved/S02_v002_split-camera-to-bird-pov.mp4`.
- Master construction: exact clean S02A source followed by S02B v002 with its duplicate first frame omitted; no audio; H.264 1920 × 1080 at 24 fps.
- Master duration: 10.041667 seconds; 241 frames.
- Master SHA-256: `00630193BC406BF12DE04FFD6ECD7541E1E96184CFB6169760DAE5C70187E3FA`.
- Encoded A→B seam SSIM: `0.936875` between master frames 120 and 121.
- Encoded master endpoint SSIM against K02 v005: `0.918426`.
- Contact sheet: `../../production/kling-clips/S02-crane-to-plan/review/S02_v002/S02_v002_contact-sheet.png`.
- Forward/reverse QA loop: `../../production/kling-clips/S02-crane-to-plan/review/S02_v002/S02_v002_forward-reverse-review.mp4`.
- Approval: explicitly locked by the user; S02B v001 remains immutable but rejected.

## QA

### Camera

- [x] One continuous upward/inward crane with progressive downward tilt across the approved split.
- [x] Paper center remains the optical target.
- [x] No cut, roll, sideways orbit, lens switch, or digital zoom.
- [x] K02 bird's-eye composition is reached without visible overshoot.

### Scene and objects

- [x] Paper stays blank, folded, rigidly anchored, and closed.
- [x] Limestone, oak, ruler, and pencil remain coherent on the table.
- [x] Table and studio geometry remain visually rigid.
- [x] Daylight, shadows, exposure, and material color remain stable.

### Scrub continuity

- [x] Start preserves the approved K01 camera world through S02A.
- [x] End visually matches approved K02 v005 within accepted Kling resampling.
- [x] Forward and reverse playback remain coherent.
- [x] No objectionable high-motion blur or mid-shot deformation.

## Approval

- Approved candidate: S02A v001 + user-supplied S02B v002.
- Approved filename: `S02_v002_split-camera-to-bird-pov.mp4`.
- Approval date: 2026-07-16.
- Notes: ten-second clean split master; three-second S02B v001 remains rejected.
- Next sequence unblocked: S03 horizontal paper unfold.

## Blocker

None. S02 is approved and closed.
