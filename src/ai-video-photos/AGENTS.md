# AGENTS.md — L-28 Process Film

These instructions apply to all work inside `src/ai-video-photos/`.

## Required starting point

- Open [`docs/00_INDEX.md`](./docs/00_INDEX.md) before taking any production action.
- Treat the phase, current objective, next action, approvals, and blockers in the index as authoritative.
- Treat [`AI_VIDEO_PROCESS_PRODUCTION_PLAN.md`](./AI_VIDEO_PROCESS_PRODUCTION_PLAN.md) as a concept archive. Do not extend it with day-to-day production notes.

## Documentation ownership

- Project facts and geometry locks: `docs/01_PROJECT_SOURCE_LOCK.md`.
- Visual materials, lighting, interiors, and prohibitions: `docs/02_VISUAL_DIRECTION.md`.
- Camera, motion, easing, and continuity: `docs/03_CAMERA_AND_MOTION_SYSTEM.md`.
- Keyframes, sequences, progress, dependencies, and status: `docs/04_SEQUENCE_TIMELINE.md`.
- Still-frame generation and image prompts: `docs/05_KEYFRAME_GENERATION.md`.
- Kling prompts, settings, candidates, and motion review: `docs/06_KLING_PRODUCTION.md`.
- Composite, FFmpeg, WebP, manifest, and web delivery: `docs/07_POSTPRODUCTION_AND_WEB.md`.
- Decisions, open questions, and approval gates: `docs/08_QA_AND_DECISIONS.md`.

Update the document that owns the information. Link to stable rules instead of duplicating them.

## Production gates

- Do not generate a Kling clip before both boundary keyframes are approved.
- Do not generate all K00–K13 frames independently.
- Begin with the approved production order in `docs/05_KEYFRAME_GENERATION.md`.
- Create a sequence card from `docs/sequences/SEQUENCE_TEMPLATE.md` only when that sequence becomes active.
- Do not advance a phase until its checklist in `docs/08_QA_AND_DECISIONS.md` passes or an exception is explicitly recorded.

## Architectural integrity

- The real technical drawing controls walls, openings, furniture footprints, circulation, terraces, and landscape organization.
- AI output may not override the drawing or approved exterior visualizations.
- Reject any visually attractive result that changes walls, doors, windows, furniture positions, or façade identity.
- Use the supplied process references only for pacing and transformation grammar; never copy their house, blue-paper style, or room layout.

## Asset handling

- Follow `production/README.md` for folders and naming.
- Original project sources are immutable.
- Candidate versions are immutable and zero-padded (`v001`, `v002`, and so on).
- Never use `final`, `final-final`, `new`, or `latest` in filenames.
- Preserve rejected candidates and record the rejection reason.
- Reuse the exact approved end frame as the next sequence's start frame.
- Do not create empty production folders before the corresponding work begins.

## End-of-session requirement

After material production work:

1. Save candidates in the correct production location.
2. Record prompt/settings and candidate results in the owning keyframe note or sequence card.
3. Record approvals or changed decisions in `docs/08_QA_AND_DECISIONS.md`.
4. Update keyframe/sequence/phase status in `docs/00_INDEX.md` and `docs/04_SEQUENCE_TIMELINE.md`.
5. State the exact next unblocked action.

## Current active work

At the time this rule was created, the active phase is the K00 visual-language test:

1. Generate limestone, mineral-composite, and light-oak table directions using one shared composition.
2. Change only the table material between candidates.
3. Review against the K00 criteria in `docs/05_KEYFRAME_GENERATION.md`.
4. Approve one direction before deriving K02 or any Kling sequence.

If the index later reports a different phase, follow the index rather than this historical note.
