# Kling Production Workflow

This document owns AI motion generation. No sequence enters Kling before both start and end frames are approved.

## Role of Kling

Kling provides short controlled interpolation for:

- Camera movement between approved viewpoints.
- Restrained paper physics.
- Dephysicalization of paper relief.
- Line-to-volume transformation.
- Surface-bound material propagation.
- Subtle daylight/atmospheric motion.

Kling does not decide the plan, wall layout, openings, furniture layout, or final façade.

## Default generation record

Record these fields for every candidate because product settings may change:

```md
Kling model/version:
Mode:
Aspect ratio: 16:9
Duration: 5 seconds
Audio: off
Start frame:
End frame:
Positive prompt version:
Negative prompt version:
Generation date:
Candidate filename:
```

Use start/end-frame mode. Five seconds is the default passage length because adjacent frames are intentionally similar.

## Readiness gate

Before generation:

- Start frame approved.
- End frame approved.
- Exact end file of previous sequence reused where applicable.
- Sequence card created from [SEQUENCE_TEMPLATE.md](./sequences/SEQUENCE_TEMPLATE.md).
- One primary camera move specified.
- One primary transformation specified.
- All locked invariants listed.
- Output folder exists.
- Candidate version assigned.

## Prompt formula

Write prompts in this order:

1. Continuous-shot statement.
2. Architectural invariants.
3. Camera action.
4. Object/material action.
5. Motion quality.
6. Prohibitions.

### Master template

> One continuous architectural shot. Preserve the exact building or paper layout, all wall positions, door positions, window positions, furniture footprints, material palette, object positions, and lighting direction defined by the start and end frames. The camera [ONE PRECISE CAMERA ACTION]. At the same time, [ONE PRECISE TRANSFORMATION] progresses smoothly and physically. Motion is slow, cinematic, stable, restrained, and continuous with minimal motion blur. No cuts, no lens switch, no camera shake, no added objects, no removed objects, no warped geometry, no moving walls, no relocated windows or doors, no furniture drift, no text, and no people.

## Prompt-writing rules

- Describe motion, not every visible object already fixed in the images.
- Use one unambiguous direction: dolly forward, crane upward, tilt downward, translate southwest, descend, or pull back.
- Do not combine orbit, zoom, pan, and tilt unless the end frames demand it.
- State what is fixed before describing transformation.
- Avoid poetic terms that can imply uncontrolled magic.
- Prefer “surface-bound capillary reveal” over “liquid paint explosion.”
- Prefer “paper relief smoothly flattens outward” over “paper cracks open.”
- Prefer “walls rise from exact black wall lines” over “the house constructs itself.”

## Master negative checklist

Use only the items relevant to the clip:

> blueprint blue, blue paper, white ink, extra room, missing room, added wall, moving wall, melted wall, warped architecture, changed floor plan, shifted window, extra window, shifted door, extra door, mirrored door, furniture drift, new furniture, duplicated furniture, floating furniture, distorted table, fisheye, extreme wide angle, camera cut, lens switch, crash zoom, handheld shake, people, hands, workers, fantasy portal, orange glow, magical particles, hologram, liquid metal, heavy bloom, heavy motion blur, text, logo distortion, flicker, texture boiling, exposure pumping

## Candidate strategy

- Generate multiple candidates for one sequence, not one candidate for many sequences.
- Change one prompt variable between candidates.
- Preserve rejected outputs and record the reason.
- Do not use a failed result as the start of another clip.
- Do not extend a failed clip to hide a discontinuity.
- When all candidates fail similarly, revise the boundary frames or split the action.

## When to split a sequence

Split if Kling introduces:

- An unwanted cut.
- Architecture morphing during a large camera change.
- Furniture appearance and material growth competing.
- Paper unfold plus camera crane becoming unstable.
- Landscape, roof, façade, and camera descent happening simultaneously.

Add an intermediate keyframe only after documenting why the existing pair is too different.

## High-risk tests first

1. S03/S04 — paper unfolding and line registration.
2. S05 — physical paper becoming flat plan space.
3. S07 — exact wall growth.
4. S09 — surface-bound material growth.

Do not generate all other sequences until these establish a reliable motion language.

## Review protocol

Review each candidate:

- At normal playback.
- Frame-by-frame.
- Forward scrub.
- Reverse scrub.
- Rapid direction changes.
- Paused at visually important intermediate states.

Pass criteria:

- No cut or lens jump.
- No plan/architecture drift.
- No disappearing or duplicated object.
- Stable exposure and color.
- No compression-damaged boundary.
- Start and end match their source files.
- Reversal remains believable.

## Candidate naming

```text
S03_v001_horizontal-unfold.mp4
S03_v002_horizontal-unfold_less-settle.mp4
S03_v003_horizontal-unfold_locked-camera.mp4
```

Approved copies retain the source version:

```text
approved/S03_v003_horizontal-unfold.mp4
```

## Sequence-card responsibility

Final positive prompt, negative prompt, settings, candidate table, rejection notes, and approval live in the active sequence card. This global document keeps only shared rules.

