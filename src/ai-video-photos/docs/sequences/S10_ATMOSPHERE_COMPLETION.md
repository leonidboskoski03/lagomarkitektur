# S10 — Atmosphere Completion

## Status

**State:** v001 candidate under review  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-17  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Resolve the approved partial-material K09 model into the finished K10 interior visualization through restrained finish, glazing, daylight and atmosphere refinement.

## Boundary frames

- Start: `../../production/keyframes/K09-partial-materials/approved/K09_v007_clean-single-pass-rebuild.png`; SHA-256 `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`.
- End: `../../production/keyframes/K10-finished-interior/approved/K10_v001_finished-interior-atmosphere.png`; SHA-256 `A743B39A9599496F2E30DFE077221FD1A54F1CF1519CFF52BEE74C87541910CD`.
- Pixel-identical approved sources verified: Yes.

## Locked invariants

- All architecture, openings, glazing locations, furniture, fixtures, plants and site geometry remain unchanged.
- The large screen-right courtyard presentation edge remains completely open.
- Exposure and white balance remain warm-neutral and stable.

## Camera and transformation

- Extremely subtle controlled dolly/translation toward the open screen-right courtyard, only as required by K10.
- Complete secondary surface definition, clear low-reflection glazing, textile/wood/stone depth, precise dark details and soft natural daylight/contact shadows.
- No object, topology or layout change.

## Kling settings

- Model: `kling-video-v3_0`.
- Mode: strict first and tail images.
- Duration/resolution: 5 seconds, 1080p.
- Outputs: one; audio off; multi-shot off.

## Candidate log

| Version | Date | Settings | Initial strength | Decision |
|---|---|---|---|---|
| S10_v001 | 2026-07-17 | Exact K09/K10 first-tail; subtle camera settle; finish/light refinement | Stable geometry and restrained motion; normalized start/tail SSIM `0.962633` / `0.960206` | Under user review; no automatic approval or retry |

## Production record

- Generation ID: `AaD_TQQ1Jk2OluEJHjvvF3pJ03BDjak-JvR_hk94w5rej_G4W8IDOBchNCCI87y5LsCs1je3`.
- Credits: 40.
- Candidate: `../../production/kling-clips/S10-atmosphere-completion/candidates/S10_v001_finished-interior-atmosphere_kling.mp4`.
- SHA-256: `3912FFF1B3AD030D4960F15B39EC240C46A3A1B756A5533585981D2C40F22DEA`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Review: `../../production/kling-clips/S10-atmosphere-completion/review/S10_v001/`.

## Approval

- Approved candidate: Pending user review.
- Next action: review normal playback and `forward-reverse.mp4`; approve, reject, or authorize one revised attempt.
