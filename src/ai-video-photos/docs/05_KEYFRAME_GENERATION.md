# Keyframe Generation Workflow

This document owns still-frame creation, image-generation prompts, candidate naming, and keyframe approval. Kling motion prompts belong in [06_KLING_PRODUCTION.md](./06_KLING_PRODUCTION.md) and active sequence cards.

## Principle

Keyframes are architectural assets, not independent concept images.

Every keyframe is derived from:

- The canonical plan and exterior sources.
- One deterministic paper/architecture/camera system.
- The previous approved state.
- Stable direction from the visual and motion bibles.

ChatGPT Images may explore or selectively edit appearance. It does not redraw technical geometry.

## Production order

### Stage A — Opening language

Create three K00 directions that differ only in table material:

1. Pale limestone.
2. Off-white mineral composite.
3. Very light oak.

Approve one before continuing.

### Stage B — Spine frames

Create K02, K03, K05, K07, K10, and K13 around the approved K00 world. K04 is an alias of approved K03 and is not independently generated.

### Stage C — Intermediate frames

Derive K01, K06, K08, K09, K11, and K12 from the approved spine and one shared camera rig.

## Deterministic versus generative responsibilities

| Deterministic/composited | Generative assistance |
|---|---|
| Plan linework | Studio atmosphere |
| Fold geometry | Fine paper character |
| Walls/openings | Material surface refinement |
| Furniture footprints | Textile softness |
| Camera position/lens | Subtle daylight finish |
| Exterior render anchor | Carefully masked environmental extension |
| Exact text/annotations | Non-structural styling variants |

If an AI edit touches a locked area, restore the deterministic pass and recheck the composite.

## Candidate folder and naming system

Create folders only when needed:

```text
production/keyframes/K00-table-wide/
  references/
  candidates/
  approved/
  notes.md
```

Filename pattern:

```text
K00_v001_limestone-table.png
K00_v002_mineral-table.png
K00_v003_light-oak-table.png
```

Rules:

- Never name a candidate `final`.
- Versions are immutable.
- An approved frame is copied into `approved/` with its version retained.
- The exact approved file becomes the boundary source for neighboring clips.
- Preserve the highest-quality, least-compressed master.

## Reference pack for every keyframe

Each generation or edit must receive only relevant references:

- Previous approved keyframe.
- Next spine frame when designing an intermediate state.
- Clean architectural plan or controlled overlay.
- Relevant exterior render for K11–K13.
- Visual bible excerpt or material board.
- Camera statement from the motion bible.

Do not include all 14 process references in every prompt. Excess references introduce conflicting geometry and style.

## Image prompt structure

Use five blocks:

1. **Frame role:** what story state this is.
2. **Locked composition:** camera, table/house position, aspect ratio.
3. **Locked content:** exact objects or architecture that must remain.
4. **Appearance:** materials, light, texture, mood.
5. **Prohibitions:** what may not change or appear.

## Base K00 prompt

Use this as the shared prompt. Replace only the bracketed table sentence for each direction.

> Create a cinematic 16:9 architectural studio still for LAGOM Arkitektur. A quiet, premium, minimal studio interior is seen from a controlled three-quarter camera at approximately 35–40 mm full-frame equivalent. At the center is an uncluttered rounded table. [TABLE MATERIAL DIRECTION.] An A1 natural-white architectural sheet folded twice into an approximately A3 closed packet sits exactly at the center. Its visible outer face is completely blank because the drawing is printed on the concealed inner face; only restrained paper fiber, fold relief, thin folded edges, and a natural contact shadow are visible. Around the outer edges are exactly four subordinate architectural objects: one thin pale-limestone façade sample, one thin light-oak veneer sample, one recognizable slim matte-black architectural ruler with restrained tick marks and no text, and one black mechanical pencil. Large soft natural daylight comes from upper left with restrained cool fill, subtle realistic contact shadows, warm mineral-gray surroundings, calm Scandinavian architectural restraint, tactile but not decorative, photorealistic, high material accuracy, generous negative space. No linen, napkin, textile swatch, thick sample blocks, coasters, people, hands, coffee, laptop, books, plant, glasses, visible drawing or text on the closed paper, blue paper, white blueprint lines, logo, dramatic spotlight, orange glow, fantasy particles, clutter, fisheye, or extreme depth of field.

## Folded-plan reveal rule

- K00, K01, and K02 show a blank outer paper face.
- K03 reveals the complete registered canonical drawing after the shared plan master is rotated 90° counterclockwise; the outdoor courtyard/site reads on the right.
- K04 is an exact alias of K03 retained only for sequence-number continuity; do not generate or export a second boundary file.
- Never reveal the drawing early merely to make the closed packet look more recognizably architectural; paper construction and surrounding tools provide that context.

### K00 table substitutions

**Direction A — Limestone**

> The table is pale honed limestone with a softly rounded edge, fine low-contrast natural variation, and a matte tactile surface; the surrounding floor is warm-gray mineral microcement.

**Direction B — Mineral composite**

> The table is a warm off-white mineral composite with a monolithic rounded edge and nearly seamless matte finish; the surrounding floor is a slightly darker warm-gray microcement.

**Direction C — Light oak**

> The table is very light natural oak with subtle straight grain, a matte finish, and a refined rounded edge; the surrounding floor is neutral warm-gray mineral plaster.

## K00 comparison criteria

Evaluate only:

- Does it feel like LAGOM rather than a generic architect desk?
- Does the table support the white-paper/black-line story?
- Are material samples present but subordinate?
- Is the lighting suitable for later overhead continuity?
- Can K00 plausibly crane into K02 without revealing inconsistent surroundings?
- Is there enough negative space for future HTML copy?

Do not evaluate paper-unfold motion or interior design at this stage.

## Keyframe-specific prompt addendum template

```md
Frame ID:
Previous approved frame:
Frame purpose:
Only permitted change:
Camera position and lens:
Exact locked architecture/objects:
Material/light state:
Required output dimensions:
Negative constraints:
```

## Edit strategy

- Prefer a targeted edit over fresh generation after composition approval.
- Mask only the material/object that changes.
- Reapply exact linework after edits.
- Keep a difference image or quick overlay for geometry-critical states.
- Never accept generated technical text.
- Use the actual exterior render as the K13 base rather than prompting a recreation.

## Architectural approval

For K05, K07, K08, K09, and K10:

1. Align the keyframe with the plan/camera master.
2. Overlay locked geometry.
3. Check exterior and internal walls.
4. Check doors, windows, and swings where visible.
5. Check furniture count, footprint, and orientation.
6. Check circulation.
7. Reject any mismatch before surface styling is considered.

## Candidate notes template

```md
| Version | Date | Prompt change | What worked | Failure | Decision |
|---|---|---|---|---|---|
| K00_v001 | YYYY-MM-DD | Limestone table | ... | ... | Pending |
```

## Approval output

Every approved keyframe records:

- Exact filename.
- Dimensions.
- Source references.
- Prompt version.
- Edit history.
- Geometry QA result.
- Visual QA result.
- Approver/date.
- Neighboring sequence dependencies.

Update [04_SEQUENCE_TIMELINE.md](./04_SEQUENCE_TIMELINE.md) and [08_QA_AND_DECISIONS.md](./08_QA_AND_DECISIONS.md) after approval.
