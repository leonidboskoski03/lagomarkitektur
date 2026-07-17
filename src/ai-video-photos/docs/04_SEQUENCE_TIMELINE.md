# Sequence and Timeline Map

This document owns the macro structure and status of the complete film. Detailed active-sequence prompts live in individual cards under `docs/sequences/`.

## Boundary keyframes

| ID | State | Status |
|---|---|---|
| K00 | Wide three-quarter view of mineral-composite table | Approved — v008 |
| K01 | Medium table approach | Approved — v002 hinge-aligned camera midpoint; v001 preserved as historical approved boundary |
| K02 | Near-overhead folded plan | Approved — v005 user-approved hinge-aligned motion boundary; v003 retained; v004 superseded candidate preserved |
| K03 | Horizontally unfolded complete physical plan | Approved — v008 |
| K04 | Former perpendicular-unfold boundary | Absorbed — exact K03 v008 alias; no separate asset |
| K05 | Full-screen flat black-line plan world | Approved — v002 |
| K06 | Beginning of lower-right courtyard-side spatial tilt | Approved — v002 |
| K07 | Exact raised wireframe shell | Approved — v030 user-supplied clean boundary; heights remain provisional |
| K08 | Complete white-clay cutaway | Approved — v001 targeted furniture/fixed-element volume boundary |
| K09 | Distributed intermediate material growth | Approved — v007 clean single-pass boundary |
| K10 | Finished Scandinavian interior cutaway | Approved — v001 finished-interior/atmosphere boundary |
| K11 | Mid-elevated courtyard-facing exterior model | Approved — v005 generated model boundary; candidate and approved files are identical |
| K12 | Near-final courtyard visualization | Approved — v001 generated exterior-world/material/landscape transition; candidate and approved files are identical |
| K13 | Final ground-level exterior hero | Approved — v001 deterministic Visualization 1 boundary; candidate and approved files are identical |

## Spine-frame order

Create these first:

1. K00 — opening world.
2. K02 — overhead paper system.
3. K03/K04 alias — complete physical plan.
4. K05 — clean plan world.
5. K07 — exact wireframe.
6. K10 — finished interior.
7. K13 — final exterior.

Only when the seven states feel like one film should intermediate frames be derived.

## Sequence map

| ID | Boundary | Action | Primary change | Source duration | WebP sampling | Status |
|---|---|---|---|---:|---:|---|
| S01 | K00→K01 | Arrival | Camera dolly | 5 s | 6 fps | Boundary frames approved; motion not started |
| S02 | K01→K02 | Crane to plan | Camera crane/tilt | 10.04 s approved split master | 8 fps | Approved — S02A v001 + user-supplied five-second S02B v002; clean master and reverse QA locked; S02B v001 rejected |
| S03 | K02→K03 | Horizontal unfold | Paper | 5 s | 12 fps | Approved — hinge-locked v002; v001 rejected and preserved |
| S04 | K03→K04 alias | Former vertical unfold | None; exact frame reuse | 0 s | 0 fps | Omitted by approved simplification |
| S05 | K03/K04→K05 | Enter drawing | Camera push + dephysicalization | 11 s approved split master | 12 fps | Approved — S05 v003 registered micro-blend; candidate and approved files byte-identical; six-frame v002 superseded for line softening |
| S06 | K05→K06 | Plan to perspective | Camera tilt/translation | 5 s | 8 fps | Not started |
| S07 | K06→K06.5→K06.625→K06.75→K07 | Structure grows | Camera, then walls/openings | K06.625 v002 under review | 15 fps | S07A approved. S07B1 v001 rejected. Proposed repair: camera-only K06.5→K06.625, then locked-camera shell growth K06.625→K06.75. S07B2 remains blocked. |
| S08 | K07→K08 | Clay model completes | Fixed elements/furniture | 5 s | 12 fps | Boundary frames approved; ready for later test |
| S09 | K08→K09 | Material grows | Surface materials | 5 s | 15 fps | High-risk test |
| S10 | K09→K10 | Atmosphere completes | Finish/light | 5 s | 8 fps | Not started |
| S11 | K10→K11 | Rotate/orbit into the courtyard and build the exterior model | 90° camera orbit + rightward translation + partial descent + envelope assembly | 5 s | 12 fps | Boundary frames approved; motion not started |
| S12 | K11→K12 | Landscape and scale resolve | Continued camera descent + site/material/detail refinement | 5 s | 12 fps | Boundary frames approved; motion not started |
| S13 | K12→K13 | Exterior resolution | Final camera settle + handoff into approved real render | 5 s | 6 fps | Boundary frames approved; motion not started |

Five-second source passages produce approximately 690 browser frames at the proposed adaptive rates. Static holds reuse frames rather than duplicate files.

## Scroll allocation

| Progress | Sequence | Meaning |
|---:|---|---|
| 0–10% | S01 | Consultation / a project begins |
| 10–18% | S02 | Focus on the drawing |
| 18–32% | S03 | Architecture discloses into the complete physical plan |
| 32–46% | S05 | Enter representational space |
| 46–53% | S06 | Line gains perspective |
| 53–64% | S07 | Architecture / structure |
| 64–72% | S08 | Spatial planning |
| 72–82% | S09 | Interior design |
| 82–87% | S10 | Visualization and atmosphere |
| 87–92% | S11 | Complete building envelope |
| 92–97% | S12 | Place and landscape |
| 97–100% | S13 | Final villa |

Scroll percentages are provisional until the media prototype is tested.

## Narrative labels

Recommended process order:

1. Consultant — “Every project begins with listening.”
2. Architecture — “Proportion becomes plan.”
3. Interior Design — “Plan becomes inhabitable space.”
4. 3D Visualization — “Material and light reveal atmosphere.”
5. LAGOM Arkitektur — Complete villa.

Visible text remains HTML, never generated into the media.

## Dependency rule

A sequence may enter production only when:

- Both boundary frames are approved.
- Geometry relevant to the clip passes QA.
- The sequence card has been created from the template.
- The exact positive prompt and negative constraints are recorded.
- Output location and version name are assigned.

## Candidate rule

- Generate several candidates for one active sequence.
- Approve or reject before moving to the next sequence.
- Record rejection reasons in the sequence card.
- Do not overwrite previous candidates.
- Approved output is copied to the approved location without renaming its source candidate record.
