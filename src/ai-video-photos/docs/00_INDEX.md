# L-28 Process Film — Working Index

This is the operational entry point for the LAGOM Arkitektur scroll-driven process film. Open this file first whenever work resumes.

The original [production plan](../AI_VIDEO_PROCESS_PRODUCTION_PLAN.md) is preserved as the concept archive. Day-to-day decisions, prompts, status, and approvals belong in the focused documents below.

## Current position

**Phase:** 5 — Kling production  
**Current objective:** Review S10 v001, the subtle finish/light and atmosphere transition from approved K09 to approved K10.  
**Next production action:** User reviews S10 v001 at normal speed and in forward/reverse playback. Do not approve or retry automatically.  
**Do not start yet:** Composite/master export or WebP extraction.

**Web prototype exception (2026-07-19):** The user explicitly authorized a reversible 18 fps scroll-playback prototype from the current merged preview. This does not approve S10, start the final composite, or satisfy Gate 7; the original 10 fps web sequence remains preserved.

## Source-of-truth documents

| Document | Owns | Update when |
|---|---|---|
| [01_PROJECT_SOURCE_LOCK.md](./01_PROJECT_SOURCE_LOCK.md) | Project facts, source assets, plan reading, geometry locks | New architectural information arrives |
| [02_VISUAL_DIRECTION.md](./02_VISUAL_DIRECTION.md) | Materials, paper, interior, exterior, light, visual prohibitions | A visual decision is approved |
| [03_CAMERA_AND_MOTION_SYSTEM.md](./03_CAMERA_AND_MOTION_SYSTEM.md) | Camera coordinates, lens, motion, easing, transformation behavior | The movement language changes |
| [04_SEQUENCE_TIMELINE.md](./04_SEQUENCE_TIMELINE.md) | K00–K13, S01–S13, scroll allocation, dependencies, status | A frame or sequence changes status |
| [05_KEYFRAME_GENERATION.md](./05_KEYFRAME_GENERATION.md) | Still-frame workflow, image prompts, candidate naming, K00 brief | Creating or approving keyframes |
| [06_KLING_PRODUCTION.md](./06_KLING_PRODUCTION.md) | Start/end workflow, Kling prompt system, clip candidates | Producing motion clips |
| [07_POSTPRODUCTION_AND_WEB.md](./07_POSTPRODUCTION_AND_WEB.md) | Composite, master export, FFmpeg, WebP, manifest, web delivery | The film reaches postproduction |
| [08_QA_AND_DECISIONS.md](./08_QA_AND_DECISIONS.md) | Decisions, open questions, approval gates, rejection reasons | Any material decision is made |
| [Sequence template](./sequences/SEQUENCE_TEMPLATE.md) | Standard operating card for one active sequence | A sequence enters production |
| [Production folder guide](../production/README.md) | Asset locations and file naming | Creating production files |

## Approved foundations

- Project: L-28 Stoneframe Villa.
- Paper: architectural white.
- Ink: black; secondary technical hierarchy may use neutral gray.
- Geometry: walls, windows, doors, and furniture footprints follow the real drawing.
- Interior: proposed Scandinavian scheme using light oak, matte white, light-gray textiles, pale stone, black minimal lighting, linen, and daylight.
- Production: deterministic architectural base plus controlled AI finishing.
- Still-image role: ChatGPT Images for exploration and selective edits, not technical reconstruction.
- Motion role: Kling for short transitions between closely related approved frames.
- Runtime: scene-based WebP sequences are the primary candidate.
- Lottie: vector overlays only, not the photorealistic master.
- Scroll: GSAP ScrollTrigger drives one top-level linear playhead.

## Decisions still required

1. Service-story order: Consultant first or current website numbering.
2. Which plan annotations remain in the black-ink cinematic drawing.
3. Whether CAD/PDF/DWG and vertical dimensions can be supplied.
4. Desktop-only first or simultaneous dedicated mobile framing.

Record every answer in [08_QA_AND_DECISIONS.md](./08_QA_AND_DECISIONS.md).

## Phase status

| Phase | State | Exit condition |
|---|---|---|
| 0. Source lock | Partially complete | Architectural unknowns either supplied or explicitly accepted |
| 1. Visual-language test | Complete | K00 v008 mineral-composite composition approved |
| 2. Geometry and camera master | Complete for motion prototype | Approved visual boundaries and camera path; CAD/elevation limitations remain documented |
| 3. High-risk motion tests | Complete | S03, S05, S07, and S09 scrub cleanly |
| 4. Final keyframes | Complete | K00–K13 approved; K04 is an exact K03 alias |
| 5. Kling production | **Active** | S01–S13 approved with exact boundaries |
| 6. Composite and grade | Not started | One clean master is approved |
| 7. Web delivery | Not started | Desktop, mobile, and reduced-motion QA pass |

## Keyframe status

| Frame | Status | Dependency |
|---|---|---|
| K00 — table wide | Approved — v008 | Larger blank paper and simplified architectural object set |
| K01 — table approach | Approved — v001 | Exact medium-high camera midpoint; candidate and approved files are identical |
| K02 — overhead folded plan | Approved — v005 user-approved hinge-aligned motion boundary; v003 retained | v004 remains an immutable superseded candidate; v005 is the exact user-supplied approved S03 start |
| K03 — complete physical plan reveal | Approved — v008 | Full rotated plan, bold interiors, canonical L-shaped sofa |
| K04 — former second-unfold boundary | Absorbed into K03 | Reuses the exact K03 v008 file; no separate frame or clip |
| K05 — flat plan world | Approved — v002 | Exact start boundary for K06 |
| K06 — spatial tilt | Approved — v002 | Exact courtyard-side camera boundary for K07 |
| K06.5 — low-wall intermediate | Approved — v001 | Exact S07A end / S07B1 start boundary |
| K06.625 — camera-matched low walls | Approved — v002 | Candidate and approved files are byte-identical; exact S07B1A end / S07B1B start boundary |
| K06.75 — full shell, flat furniture | Approved — v001 | Exact S07B1 end / future S07B2 start boundary; candidate and approved files are identical |
| K07 — raised wireframe | Approved — v030 | User-supplied clean white-clay frame; proportional canvas normalization only |
| K08 — white clay model | Approved — v001 | Exact approved source boundary for K09; candidate and approved files are identical |
| K09 — partial materials | Approved — v007 | Exact clean single-pass material boundary; candidate and approved files are identical |
| K10 — finished interior | Approved — v001 | Exact finished-interior/atmosphere boundary; candidate and approved files are identical |
| K11 — courtyard-facing exterior model | Approved — v005 | Exact generated model boundary; candidate and approved files are identical |
| K12 — near-final courtyard visualization | Approved — v001 | Exact generated near-final boundary; candidate and approved files are identical |
| K13 — final exterior hero | Approved — v001 | Exact deterministic Visualization 1 hero boundary; candidate and approved files are identical |

## Rules for every work session

1. Read this index and the document that owns the current decision.
2. Do not repeat stable rules inside candidate notes; link to the owning bible.
3. Do not generate a motion clip before both boundary frames are approved.
4. Do not approve visual beauty over architectural accuracy.
5. Record rejected candidates and the reason; do not overwrite them.
6. Update statuses and the decision log before ending a production session.
7. Create a sequence card only when that sequence becomes active.

## Immediate workflow

1. Preserve rejected S03 v001 and approved S03 v002 with their review evidence unchanged.
2. Preserve completed S05 v001 and all QA evidence unchanged.
3. Preserve superseded S05 v001 and the locally rendered hybrid tests unchanged.
4. Preserve approved `S05_v003_registered-microblend.mp4` and its review evidence unchanged.
5. Replace the over-wide S07 boundary pair with an approved K06.5 walls-only intermediate; generate no retry until that boundary is reviewed.
6. S07 and S09 are approved and closed; the high-risk motion grammar passes.
7. Review S10 v001 before any retry or later sequence production.
