# K06 — Courtyard-Side Spatial Tilt Candidate Log

## Frame contract

- Frame: K06 — beginning of the plan-to-space camera transition.
- Previous approved boundary: `K05_v002_flat-blueprint-world_warm-white.png`.
- Purpose: establish depth through camera projection before any structure grows.
- Camera: translate toward the screen lower-right/courtyard side, lower slightly, and tilt from top-down toward an architectural 60–65° elevation using a controlled 40–50 mm-equivalent perspective.
- Target: central circulation and living zone; look direction continues across the plan toward the opposite upper-left wing.
- Perspective restraint: mild projective taper only; the near foreground must remain proportionate and must not read as wide-angle stretching.
- Plan state: completely flat, exact, and unchanged. Every line remains on one plane with zero wall height.
- Background: the same continuous warm architectural white as K05; no paper boundary, horizon line, table, or studio.
- Next state: K07 raises exact walls/openings from this fixed camera.

## Candidate construction v002

```text
Use case: precise-object-edit / deterministic projective transform
Asset type: K06 spatial-tilt boundary
Input: approved K05 v002 as the sole image and geometry source.

Change only the virtual camera projection. Move toward the screen lower-right/courtyard side, target the central circulation/living area, and tilt from the exact top-down view into a restrained architectural perspective. Keep the projective taper mild so the near foreground remains proportionate. Preserve every plan line, room, wall footprint, door, window, furniture symbol, courtyard, and the L-shaped living-room sofa through one continuous projective transform. Keep the plan entirely flat on a continuous warm-white plane. No wall height, extrusion, 3D furniture, materials, shadows, paper edges, horizon, camera roll, fisheye, or new geometry.
```

## Candidates

| Version | Date | Construction change | What worked | Failure | Decision |
|---|---|---|---|---|---|
| K06_v001 | 2026-07-15 | First deterministic southwest/lower-left projective tilt from approved K05 | Exact plan geometry and line hierarchy preserved through one projective transform; plan remains flat | Camera approaches from the wrong side and the near foreground stretches too strongly | Rejected |
| K06_v002 | 2026-07-15 | Revised deterministic lower-right/courtyard-side projection with milder taper | Exact plan geometry remains fixed; courtyard side becomes the approach edge; foreground proportions are calmer; plan remains completely flat | Awaiting user review of direction, tilt, and framing | Pending review |

## Approval

`K06_v002_courtyard-perspective-plan.png` was approved by the user on 2026-07-15 and copied byte-for-byte into `approved/`. It is the exact camera/composition source for K07 and the end boundary for future S06 production.
