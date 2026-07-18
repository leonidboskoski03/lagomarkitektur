# S07 — Structure Growth

## Status

**State:** Approved — S07A v001, S07B1A v002, S07B1B v001 and S07B2 v001 locked; superseded/rejected tests preserved  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-17  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Transform the exact courtyard-perspective plan into the factual raised white-clay villa while proving that walls and openings remain registered.

## Narrative role

- Service/process label: Architecture / structure.
- Story meaning: the technical drawing becomes inhabitable spatial volume without changing its design.
- Scroll range: 53–64%.

## Boundary frames

- Start frame ID: K06.
- Start filename: `../../production/keyframes/K06-spatial-tilt/approved/K06_v002_courtyard-perspective-plan.png`.
- Start SHA-256: `E05F39C48A35677C7F4938089D44162745CED2E1D7821F2D53DEBC31D6BCFD31`.
- End frame ID: K07.
- End filename: `../../production/keyframes/K07-raised-wireframe/approved/K07_v030_user-approved-clean-wireframe.png`.
- End SHA-256: `5FECFDC5D1BF66A40D465E25B6EFDD57CAED26A2FF830FCFA2E264F5B8128F26`.
- Previous sequence boundary verified: N/A for isolated high-risk test; S06 is produced later.
- Pixel-identical boundary verified: Yes for the approved source files.

## References

- Project geometry: `../../architectural-blueprint-drawing.jpg` through [01_PROJECT_SOURCE_LOCK.md](../01_PROJECT_SOURCE_LOCK.md).
- Approved source boundary: K06 v002 above.
- Approved target boundary: K07 v030 above.
- Visual bible: [02_VISUAL_DIRECTION.md](../02_VISUAL_DIRECTION.md), K07 white-clay quality lock.
- Camera/motion bible: [03_CAMERA_AND_MOTION_SYSTEM.md](../03_CAMERA_AND_MOTION_SYSTEM.md), structure growth.

Do not attach exterior renders or earlier rejected K07 candidates to Kling.

## Locked invariants

- Geometry: exact wall footprints, room order, circulation, terraces, site layout, yard boundary, gate, and open courtyard-right condition.
- Doors/windows: all real door gaps, blank hall openings, windows, living glazing, terrace window, storage slider, and balcony glass remain fixed and unobstructed.
- Furniture/objects: every footprint remains registered; no furniture relocates, duplicates, disappears, or changes type.
- Material state: warm-white monochrome architectural clay with neutral-gray floor guides and fine graphite construction edges.
- Light direction/exposure: soft neutral upper-left daylight, clean white balance, stable exposure.
- Camera/lens: exact approved K06 courtyard-side perspective and 16:9 framing; absolutely no camera movement or lens change.

## Camera action

**Primary move:** Locked camera; no move.  
**Secondary adjustment:** None.  
**Camera target:** Central circulation/living zone, looking across the plan toward the upper-left wing.  
**Lens:** Preserve the approved restrained 40–50 mm architectural perspective.  
**Easing character:** Camera remains still; structure uses decisive ease-out with restrained stagger.  

## Transformation action

Exterior/structural walls rise vertically from their exact black footprints first. Internal partitions follow with a small restrained stagger. Real door, window, passage, glazing, and courtyard openings stay clear throughout. Wall side planes resolve as matte warm-white clay and fine graphite top edges settle at full height. Only after the shell is nearly settled may endpoint furniture and site elements gain the restrained white-clay relief required to match K07, without changing any footprint.

## Kling settings

- Model/version: Kling 3.0 Omni, subject to live `who_am_i` verification.
- Mode: Start & End Frames.
- Aspect: 16:9.
- Duration: 5 seconds.
- Resolution: 1080p.
- Audio: Off.
- Multi-shot: Off.
- Outputs: One.

## Positive prompt

> One continuous locked-camera architectural transformation from 图片1 to 图片2. Preserve the exact 16:9 composition, courtyard-side architectural perspective, plan orientation, every wall footprint, room, circulation path, door, window, open passage, terrace, yard boundary, pedestrian gate, storage slider, furniture footprint, landscape guide and the completely open screen-right courtyard edge. Keep the camera absolutely stationary with no zoom, pan, tilt, roll, orbit, translation, reframing or lens change. Starting from the exact black structural lines in 图片1, raise the exterior and structural walls vertically first with a decisive controlled ease-out; then raise the internal partitions with a small restrained stagger. Every real door, window, glazing and passage void stays clear and fixed while the surrounding wall rises. Matte warm-white clay side planes emerge directly from the registered wall lines, with restrained soft-gray side shading and fine graphite top edges that settle cleanly at full height. After the structural shell is nearly settled, allow only the endpoint furniture and site elements to gain the subtle registered white-clay relief necessary to finish exactly as 图片2; nothing changes footprint or position. Keep the large screen-right courtyard presentation edge completely open throughout. Motion is precise, calm, stable, reversible and continuous with minimal motion blur. End exactly on 图片2.

## Negative prompt

> camera movement, camera shake, pan, tilt, orbit, zoom, reframing, lens change, perspective drift, changed plan, shifted wall, added wall, missing wall, melted wall, diagonal wall growth, changed room, shifted window, missing window, extra window, shifted door, extra door, closed passage, blocked living glazing, opaque balcony wall, perimeter wall or gate across the open screen-right courtyard, furniture drift, duplicated furniture, disappearing furniture, floating furniture, roof, ceiling, finished materials, color, blue blueprint, text, people, workers, construction machinery, particles, glow, fantasy effect, heavy motion blur, flicker, exposure pumping, cloudy texture, beige or pink mottling, blurred edges

## Candidate log

| Version | Date | Prompt/settings change | Strength | Failure | Decision |
|---|---|---|---|---|---|
| S07_v001 | 2026-07-17 | Kling 3.0 Omni; exact K06→K07; 5 s; 1080p; locked camera | Camera and open courtyard remain broadly stable | Starts as an already-raised 3D model; no readable flat-plan-to-wall growth; endpoint state is front-loaded into frame zero | Rejected; preserve as diagnostic evidence and do not retry the same boundary pair |
| S07A_v001 | 2026-07-17 | Kling 3.0 Omni; K06→K06.5; 5 s; 1080p; audio off; multi-shot off | Starts flat, camera stays locked, walls grow progressively, furniture/site guides remain flat, open courtyard preserved | Most growth finishes within roughly the first two seconds, leaving a long hold; trim/retime in post | Approved and locked by the user |
| S07B_v001 | 2026-07-17 | Kling 3.0 Omni; K06.5→K07; 5 s; 1080p; restrained framing settle | Smooth presentation and stable exposure | Frame zero preloads completed 3D furniture/walls instead of K06.5; invents a raised right/bottom courtyard perimeter; fails both approved boundaries | Rejected; preserve and do not retry the same pair |
| S07B1_v001 | 2026-07-17 | Kling 3.0 Omni; approved K06.5→approved K06.75; 5 s; 1080p; audio/multi-shot off; restrained pullback/elevation | Clean exposure and a readable wall-height increase | Immediate camera/geometry drift; furniture becomes dimensional; false continuous right/bottom courtyard perimeter; first and last frames fail their approved boundaries | Rejected; preserve; no automatic retry |

## QA

### Architecture

- [ ] Geometry unchanged.
- [ ] Openings unchanged and remain clear throughout growth.
- [ ] Furniture and site elements remain registered.
- [ ] Screen-right courtyard edge remains completely open.

### Camera

- [ ] Camera remains completely locked.
- [ ] No cut or lens switch.
- [ ] Target and perspective remain stable.

### Motion

- [ ] Structural walls rise before internal partitions.
- [ ] No unwanted secondary transformation.
- [ ] Minimal motion blur.
- [ ] Forward and reverse scrub are coherent.

### Continuity

- [ ] Start matches approved K06 v002.
- [ ] End matches approved K07 v030.
- [ ] Exposure and white balance remain stable.
- [ ] No boundary compression or crop difference.

## Approval

- Approved candidates: S07A v001, S07B1A v002, S07B1B v001 and S07B2 v001.
- Final approved part: `../../production/kling-clips/S07-structure-growth/approved/S07B2_v001_locked-camera-furniture-relief_kling.mp4`.
- Approval date: 2026-07-17.
- Notes: S07B2 candidate and approved copies are byte-identical with SHA-256 `593A0397B18F2D29D4788EB61EF19D45D620BC55C3C899958315528E84032526`.
- Next sequence unblocked: S09 high-risk material-growth test.

## Blocker, if any

The approved K06 and K07 states ask Kling to solve too many simultaneous changes: flat line drawing to full-height structure plus 3D furniture and site relief. In v001, Kling preloaded the K07 volume at frame zero instead of honoring K06. Create one K06.5 walls-only, low/half-height white-clay boundary with furniture and site elements still flat. After approval, split the test into S07A (K06 to K06.5) and S07B (K06.5 to K07). No automatic retry is authorized.

## S07 v001 production record

- Generation ID: `AS48Nz4n2V8EExfJD0gjchjU31uBc-_aVrGx240gRh4hdzAKKwMj5s1496qw5cmPUa4bWGlo`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07_v001_locked-camera-structure-growth.mp4`.
- SHA-256: `55D629D1F35DD4592D1BFCAAC7F7273E1965DF09763EB0B85E56378F7C284562`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Boundary SSIM after normalization: first frame versus K06 `0.692762`; last frame versus K07 `0.766385`. These metrics support visual review but do not replace it.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07_v001/`.

## Approved intermediate boundary

- Frame ID: K06.5.
- Approved filename: `../../production/keyframes/K06-5-wall-growth-intermediate/approved/K06-5_v001_low-wall-intermediate.png`.
- SHA-256: `92CED813A3927A1367AEE7BD71D7A67A250E33658761111D4937DCB82F1FBB41`.
- Technical: PNG, 1680 x 945, RGB24.
- Approval date: 2026-07-17.
- Approval: explicitly approved and locked by the user.
- S07A boundary: approved K06 v002 to approved K06.5 v001.
- S07B boundary: approved K06.5 v001 to approved K07 v030; blocked until S07A passes.

## S07A v001 production record

- Generation ID: `Ad-fgqtKyesO_2jDa8RJf6yRjxDs3PbUHH68SWk6rj9eBbtLMwyM5oVdMUqTLYT4TAXYNpVj`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07A_v001_flat-plan-to-low-walls_kling.mp4`.
- SHA-256: `4E5230A4B29C4558971542AADC660E9DCE630C7A230091E913E59CA8A0222C92`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Boundary SSIM after normalization: first frame versus K06 `0.891109`; last frame versus K06.5 `0.858904`.
- Initial QA: flat first state passes; camera and plan registration remain stable; only walls gain height; furniture/site guides remain flat; screen-right courtyard remains open. Growth is front-weighted but continuous and can be trimmed/retimed without another Kling job.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07A_v001/`.
- Approval: approved by the user on 2026-07-17 and locked byte-for-byte under `approved/`.

## S07B v001 production record

- Generation ID: `AVfTvWktbakQPz1gWWh_PCh7zajJWLi_HtzCCNQszcdQsqibe6WIqV5Ye1cQFP86_4Zux9VJ`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B_v001_low-walls-to-complete-clay_kling.mp4`.
- SHA-256: `594EC1543FA13090BFA9BA3AE8CE20F8858A8DECADBEEE02CA267136009C7DE2`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Boundary SSIM after normalization: first frame versus K06.5 `0.707323`; last frame versus K07 `0.664375`.
- Rejection: the opening state is already a fully dimensional model, the approved K06.5 low/flat state is absent, and a false raised perimeter closes the screen-right courtyard. The last frame also remains far from approved K07 framing and geometry.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B_v001/`.
- Replacement boundary: K06.75 now uses the exact K07 camera/framing and full-height wall shell while leaving furniture and site elements flat; it is approved and locked. The first K06.5-to-K06.75 motion attempt is recorded below.

## K06.75 v001 approved boundary

- Candidate: `../../production/keyframes/K06-75-full-shell-flat-furniture/candidates/K06-75_v001_full-shell-flat-furniture.png`.
- Approved: `../../production/keyframes/K06-75-full-shell-flat-furniture/approved/K06-75_v001_full-shell-flat-furniture.png`.
- SHA-256: `48C447C38873826C3ED3EFC5BC86E0125C5BF3A0F07A42473EBD9B34C1F35F71`.
- Technical: PNG, 1680 x 945, RGB24.
- State: full-height K07 wall shell and exact K07 framing; furniture, fixtures, plants and site objects flattened into registered plan graphics.
- Architectural review: the screen-right courtyard remains open; no false right perimeter is present; wall shell and openings remain aligned to K07.
- Comparison: `../../production/keyframes/K06-75-full-shell-flat-furniture/review/K06-5_to_K06-75_to_K07_contact-sheet.png`.
- Approval: approved by the user on 2026-07-17; candidate and approved copies are byte-identical.

## S07B1 v001 production record

- Generation ID: `AUk8ZlSOmzCXsg2Bd-YJyNxcbnGltYNA7btyQwmfdZ6ZtSbEnxTTHya5Slt3chELoHm2ZC3Y`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B1_v001_low-walls-to-full-shell_kling.mp4`.
- SHA-256: `6B23C7A8A13B0BCD620246588294108BE7775DB9AF017CFDF04AB31341B42608`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Settings: Kling 3.0 Omni; start/end images; 5 seconds; 16:9; 1080p; one output; audio off; multi-shot off.
- Prompt intent: begin exactly on K06.5, raise only walls/partitions/opening frames to the K06.75 shell, keep every furniture/site element flat, preserve the open screen-right courtyard, and use only a restrained pullback/elevation to settle onto K06.75.
- Boundary SSIM after normalization: first frame versus K06.5 `0.669325`; last frame versus K06.75 `0.682679`.
- Rejection: Kling changes the camera immediately, makes furniture/site objects dimensional, and creates a false continuous raised right/bottom courtyard perimeter. Neither endpoint matches its approved boundary closely enough for a scrubbed handoff.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B1_v001/`.
- Next action: do not generate S07B2 or retry automatically. Choose a deterministic local shell pass/closer boundary or explicitly authorize one revised Kling retry.

## K06.625 camera-matched low-wall bridge

- v001 candidate: `../../production/keyframes/K06-625-camera-matched-low-walls/candidates/K06-625_v001_camera-matched-low-walls.png`; SHA-256 `EF0CDE9803B798362C2FD4C2896C5A9302E511992D4AF0E00AEB6D3DE0FFDBC6`.
- v002 review candidate: `../../production/keyframes/K06-625-camera-matched-low-walls/candidates/K06-625_v002_lower-camera-matched-walls.png`; PNG, 1680 x 945, RGB24; SHA-256 `5FE6B7477F2C0AD8C72177E55BC148DA3DB5F4C98BEE4B7BCEA2CF75F726D437`.
- Generation method: built-in image edit. K06.75 controls camera, framing, geometry, flat furniture/site graphics and open courtyard; K06.5 controls only the earlier low-wall stage.
- v002 change from v001: lower only architectural wall/frame height to a clearer early construction state; preserve all other content.
- Initial QA: exact K06.75-style camera/framing retained; room footprints and openings remain stable; furniture/site elements remain flat; right courtyard remains open; no false raised perimeter.
- Comparison: `../../production/keyframes/K06-625-camera-matched-low-walls/review/K06-5_to_K06-625-v001-v002_to_K06-75_contact-sheet.png`.
- Approval: approved by the user on 2026-07-17; candidate and approved copies are byte-identical.
- Proposed split: S07B1A K06.5→K06.625 camera-only; S07B1B K06.625→K06.75 locked-camera shell growth.

## S07B1A v001 production record

- Generation ID: `AZ0tnPoU8Ls0OG445gfphkQsRmwBcyNKP2QLBPX3neUIpkl8lvxwSKWp8lvXOdfvzC6VUqJh`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B1A_v001_camera-only-to-K06-625_kling.mp4`.
- SHA-256: `E391B846B3897260CD7C9DF8F28D5785A0CBE38DC021A93BDA1972CAA752FAF2`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Settings: Kling 3.0 Omni; start/end images; 5 seconds; 16:9; 1080p; one output; audio off; multi-shot off.
- Prompt intent: camera-only crane upward, pullback and gentle tilt from approved K06.5 to approved K06.625; freeze all geometry, low-wall heights and flat elements.
- Boundary SSIM after normalization: first frame versus K06.5 `0.674807`; last frame versus K06.625 `0.705149`.
- Strength: smooth continuous camera motion, stable exposure, open courtyard retained, no false right/bottom perimeter.
- Rejection: the clip finishes on a narrowed top-down K06.5-derived composition instead of approved K06.625; plan content and framing therefore cannot hand off cleanly to the locked-camera wall-growth clip.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B1A_v001/`.
- Decision: reject and preserve. Do not submit S07B1B from this incorrect endpoint.

## S07B1A v002 production record

- Generation ID: `AdQd1LYspqi0pDuTx4-aOkuN6YlbLEic451NXMeCfgJ9A1t1xHXX8crwRFGfVkfYK4I33W4l`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B1A_v002_strict-first-tail-camera-only_kling.mp4`.
- SHA-256: `F3D028E86B8F97C621C6BE3C491708E79BE4FD7E69D50FB3E5C52CA063C0F435`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Settings: `kling-video-v3_0`; approved K06.5 as dedicated `first_image`; approved K06.625 v002 as dedicated `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Prompt intent: one camera-only crane upward, slight pullback and gentle tilt; freeze model geometry, low-wall heights, openings, flat furniture/site graphics and the open right courtyard; preserve both exact endpoints.
- Boundary SSIM after normalization: first frame versus K06.5 `0.977998`; last frame versus K06.625 `0.959761`.
- Initial QA: one continuous camera move; no obvious wall-growth event; furniture/site graphics remain flat; open right courtyard remains intact; both endpoints are materially closer than v001.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B1A_v002/`.
- Approval: approved by the user on 2026-07-17 and copied byte-for-byte to `../../production/kling-clips/S07-structure-growth/approved/S07B1A_v002_strict-first-tail-camera-only_kling.mp4`; candidate and approved SHA-256 are both `F3D028E86B8F97C621C6BE3C491708E79BE4FD7E69D50FB3E5C52CA063C0F435`.

## S07B1B v001 production record

- Generation ID: `AccjVHSW3FnnWqAGWOHFfVv04WuBBd1wWx98uGqcIoyO2mTK3GT1UFv3-bNjFLzIXJ5Cqose`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B1B_v001_locked-camera-shell-growth_kling.mp4`.
- SHA-256: `616A7F9D8AC81B8AD9050276B1050444A875A9F35D12B31C7FA704B81AB87142`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Settings: `kling-video-v3_0`; approved K06.625 v002 as dedicated `first_image`; approved K06.75 v001 as dedicated `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Prompt intent: completely lock camera/framing and raise only existing low walls vertically into the full-height shell; preserve all footprints/openings, flat furniture/site graphics and the open right courtyard.
- Boundary SSIM after normalization: first frame versus K06.625 `0.968087`; last frame versus K06.75 `0.963329`.
- Initial QA: camera remains visually fixed; walls rise smoothly and most visible growth occurs in the second half; furniture/site graphics remain flat; open courtyard remains intact; no false right/bottom perimeter is visible.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B1B_v001/`.
- Approval: approved by the user on 2026-07-17 and copied byte-for-byte to `../../production/kling-clips/S07-structure-growth/approved/S07B1B_v001_locked-camera-shell-growth_kling.mp4`; candidate and approved SHA-256 are both `616A7F9D8AC81B8AD9050276B1050444A875A9F35D12B31C7FA704B81AB87142`.

## S07B2 v001 production record

- Generation ID: `AafWf05hXOPDEQGj0IZwK29G2lDoOs8iIr3c8yVvBsxYqdwLqlo16oWEpcZJejzyioTeI5dL`.
- Credits used: 40.
- Candidate: `../../production/kling-clips/S07-structure-growth/candidates/S07B2_v001_locked-camera-furniture-relief_kling.mp4`.
- SHA-256: `593A0397B18F2D29D4788EB61EF19D45D620BC55C3C899958315528E84032526`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Settings: `kling-video-v3_0`; approved K06.75 v001 as dedicated `first_image`; approved K07 v030 as dedicated `tail_image`; 5 seconds; 1080p; one output; audio off; multi-shot off.
- Prompt intent: lock camera, framing and completed wall shell; raise only registered furniture, built-ins, fixtures, plants, terrace seating and small landscape elements from their exact footprints into restrained white-clay relief.
- Boundary SSIM after normalization: first frame versus K06.75 `0.959460`; last frame versus K07 `0.960555`.
- Initial QA: camera and shell remain visually stable; registered objects gain relief progressively without obvious relocation; open right courtyard and house entry remain intact; no false perimeter is visible.
- Review evidence: `../../production/kling-clips/S07-structure-growth/review/S07B2_v001/`, including the complete S07 four-part playback.
- Decision: approved by the user on 2026-07-17 and copied byte-for-byte to `../../production/kling-clips/S07-structure-growth/approved/S07B2_v001_locked-camera-furniture-relief_kling.mp4`.
