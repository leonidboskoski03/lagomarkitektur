# S09 — Material Growth

## Status

**State:** Approved — v001 locked byte-for-byte  
**Owner:** LAGOM Arkitektur / Codex  
**Last update:** 2026-07-17  
**Sequence map:** [04_SEQUENCE_TIMELINE.md](../04_SEQUENCE_TIMELINE.md)

## Objective

Transform the exact white-clay K08 model into the approved partial-material K09 state by changing surface shading only.

## Narrative role

- Service/process label: Interior design.
- Story meaning: architectural volume receives the approved Scandinavian material system.
- Scroll range: 72–82%.

## Boundary frames

- Start: `../../production/keyframes/K08-white-clay-model/approved/K08_v001_targeted-white-clay-volume.png`; SHA-256 `88C7A0EA7831CDD0E4DFA099ECAA85D3DE7FFEFE7DB239ECC9EE20611CD90A1C`.
- End: `../../production/keyframes/K09-partial-materials/approved/K09_v007_clean-single-pass-rebuild.png`; SHA-256 `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`.
- Pixel-identical approved sources verified: Yes.

## Locked invariants

- Camera, lens, framing, crop, perspective, exposure and shadows remain fixed.
- Walls, openings, glass balustrade, furniture, fixtures, plants, terraces, paving and landscape geometry remain fixed.
- Material fronts change shading only; no topology, position or object changes.

## Transformation action

Light oak, matte white, pale stone, light-gray textiles, black details and restrained plant green spread progressively across their assigned existing surfaces in calm organic liquid-watercolor fronts. The effect remains surface-bound and ends at the exact K09 coverage.

## Kling settings

- Model: `kling-video-v3_0`.
- Mode: strict first and tail images.
- Duration/resolution: 5 seconds, 1080p.
- Outputs: one; audio off; multi-shot off.

## Candidate log

| Version | Date | Prompt/settings | Initial strength | Decision |
|---|---|---|---|---|
| S09_v001 | 2026-07-17 | Locked camera/geometry; organic surface-bound material fronts; exact K08/K09 endpoints | Progressive material reveal, stable composition, normalized start/tail SSIM `0.971139` / `0.965366` | Approved and byte-locked |

## S09 v001 production record

- Generation ID: `Ac7hkiITQyZwj66m8qgDEjVXUw9_gDyY52IDZItNv2FQhObwjzj0frbEpdTO-amNuxIH1bGr`.
- Credits: 40.
- Candidate: `../../production/kling-clips/S09-material-growth/candidates/S09_v001_locked-camera-organic-material-growth_kling.mp4`.
- SHA-256: `06C8C63F32CF21081BE61416D691085469896B5A450A83069A2A2CD3C51F26E2`.
- Technical: H.264, 1920 x 1080, 24 fps, 121 frames, 5.041667 seconds.
- Review: `../../production/kling-clips/S09-material-growth/review/S09_v001/`.
- Initial QA: camera and architectural geometry remain visually stable; material coverage progresses across existing surfaces and reaches the approved tail; no automatic approval.

## Approval

- Approved candidate: S09 v001.
- Approved file: `../../production/kling-clips/S09-material-growth/approved/S09_v001_locked-camera-organic-material-growth_kling.mp4`.
- Approval date: 2026-07-17.
- Candidate and approved SHA-256: `06C8C63F32CF21081BE61416D691085469896B5A450A83069A2A2CD3C51F26E2`.
- Next sequence unblocked: S10.
