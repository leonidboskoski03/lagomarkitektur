# K01 — Medium Table Approach

## Frame contract

- Exact previous approved boundary: `../K00-table-wide/approved/K00_v008_mineral-table_large-paper.png`.
- Exact next approved boundary: `../K02-overhead-folded-plan/approved/K02_v003_overhead-large-paper.png`.
- Purpose: divide the K00→K02 compound camera journey into a gentle forward arrival and a separate crane/tilt into the near-overhead view.
- Camera endpoint: medium-high three-quarter view, closer and more downward-facing than K00 but still visibly oblique and materially short of K02's bird's-eye composition.
- Scene lock: preserve the warm off-white mineral-composite table and base, blank centered folded paper, thin limestone sample, light-oak veneer sample, matte-black ruler, black mechanical pencil, studio architecture, curtain, oak cabinetry, floor, daylight, materials, and object relationships.
- Prohibited delta: no paper opening, visible drawing, object movement, new prop, material change, lighting change, full overhead view, or complete flat circular tabletop.

## Generation prompt — v001

Use case: precise-object-edit. Image 1 is exact approved K00 v008 and controls the entire scene, material system, paper, objects, studio, and daylight. Image 2 is approved K02 v003 and controls only the future camera direction. Move the camera moderately forward, crane upward, and tilt down, then stop at a medium-high three-quarter view. Keep the table more prominent but retain studio context, table edge, and part of the cylindrical base. Preserve the blank centered paper and exactly four supporting architectural objects without independent movement. Do not reach the full K02 bird's-eye view.

## Candidates

| Version | Date | Camera progression | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K01_v001 | 2026-07-16 | Moderate dolly-in, upward crane, and increased downward tilt between approved K00 and K02 | Preserves the mineral table, blank centered paper, limestone/oak samples, ruler, pencil, studio context, soft daylight, table edge, and base while establishing a clear camera midpoint | S01/S02 motion must keep all objects registered and avoid turning the folded paper into a bound booklet during interpolation | Approved by user |
| K01_v002 | 2026-07-16 | Same medium-high camera role as v001; folded packet moved toward the ruler to register with approved K02 v005's corrected tabletop anchor | Keeps the blank packet, four supporting objects, calm mineral studio, oblique camera, lighting, and 16:9 composition while removing the forced K01-to-K02 paper translation | S02 must preserve rigid object registration throughout the crane/tilt | Approved by user |

## Status

Approved — `K01_v001_medium-high-approach.png`. Candidate and approved copies are byte-identical at 1680 × 945.

Generation route: built-in image model using K00 v008 as the edit/scene authority and K02 v003 only as the camera-direction reference. The generated 1672 × 941 output was normalized to 1680 × 945 with Lanczos scaling, without crop or retouching.

## Approval

- Approved: 2026-07-16.
- Candidate: `candidates/K01_v001_medium-high-approach.png`.
- Exact boundary: `approved/K01_v001_medium-high-approach.png`.
- Dimensions: 1680 × 945.
- SHA-256: `ECCE98F9018356C88DFAA15487A63D706ACBE1D5BA2C1DB1FFB2784DF5461166`.
- Next action: create the S03 high-risk horizontal-unfold sequence card and motion test.

## K01 v002 replacement candidate

- Route: built-in image-model targeted edit.
- Edit target: approved K01 v001.
- Registration-only reference: approved K02 v005.
- Intended delta: move only the blank folded packet to K02 v005's corrected physical tabletop anchor while retaining K01's oblique camera and scene.
- Candidate: `candidates/K01_v002_hinge-aligned-approach.png`.
- Dimensions: 1672 × 941, matching approved K02 v005.
- SHA-256: `268F9056C7D137CBD2220687DEA8DE164A61D5E6F2957BADD632ECFE667FB520`.
- Approval state: explicitly approved by the user on 2026-07-16; v001 remains immutable in `approved/` as historical provenance.
- Approved boundary: `approved/K01_v002_hinge-aligned-approach.png`, byte-identical to the candidate.
- Exact next action: submit one K01 v002 → K02 v005 camera-only Kling test and hold the returned video for review.
