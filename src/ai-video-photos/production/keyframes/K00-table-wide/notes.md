# K00 — Table Wide Candidate Log

## Candidate context

- Frame: K00 — opening studio world.
- Current direction: warm off-white mineral-composite table.
- Status: K00 v008 approved by the user on 2026-07-14; v005 is retained as a superseded material-direction milestone.
- Prompt owner: [05_KEYFRAME_GENERATION.md](../../../docs/05_KEYFRAME_GENERATION.md).
- Visual rules: [02_VISUAL_DIRECTION.md](../../../docs/02_VISUAL_DIRECTION.md).

## Source references

- `architectural-blueprint-drawing.jpg` — reference for the small black plan fragment on the folded paper; not an edit target.
- `Visualizations/1.png`–`4.png` — project material, daylight, and calm-luxury references; not geometry for this studio frame.
- `project-explanation.txt` — project character and narrative context.

## Prompt v001 — Limestone baseline

```text
Use case: photorealistic-natural
Asset type: K00 opening keyframe candidate for a scroll-driven architectural process film

Create a cinematic 16:9 architectural studio still for LAGOM Arkitektur. A quiet, premium, minimal studio interior is seen from a controlled three-quarter camera at approximately 35–40 mm full-frame equivalent. At the center is an uncluttered rounded table. The table is pale honed limestone with a softly rounded edge, fine low-contrast natural variation, and a matte tactile surface; the surrounding floor is warm-gray mineral microcement. A compact folded sheet of natural white architectural paper sits exactly at the center, with a small fragment of precise black architectural linework visible on its upper face. Around the outer edges of the composition are no more than five carefully spaced material objects: one pale stone sample, one light-oak sample, one folded light-gray linen swatch, one thin matte-black architectural ruler or metal strip, and one black mechanical pencil. Large soft natural daylight comes from upper left with restrained cool fill, subtle realistic contact shadows, warm mineral-gray surroundings, calm Scandinavian architectural restraint, tactile but not decorative, photorealistic, high material accuracy, generous negative space.

Use the supplied plan only as a visual reference for the small abstract black architectural linework fragment; do not reproduce colored axes, labels, dimensions, or generated technical text. Use the supplied villa visualizations only to understand the project's pale stone, warm-white, light-oak, matte-black, daylight-led material identity; do not depict or recreate the villa in this frame.

No people, no hands, no coffee, no laptop, no books, no plant, no glasses, no blue paper, no white blueprint lines, no text, no logo, no dramatic spotlight, no orange glow, no fantasy particles, no clutter, no fisheye, no extreme depth of field, no additional props, no visible villa model.
```

## Candidates

| Version | Date | Prompt change | What worked | Failure | Decision |
|---|---|---|---|---|---|
| K00_v001 | 2026-07-14 | Pale-limestone baseline from approved K00 prompt | Established first material world | Too tight/high for opening frame | Rejected |
| K00_v002 | 2026-07-14 | Targeted limestone edit: wider/lower establishing camera, calmer studio, corrected folded sheet, text-free plan fragment, softer daylight | Established approved composition family | Superseded during paper/material exploration | Rejected |
| K00_v003 | 2026-07-14 | Paper-only correction: single twice-folded architectural sheet with perpendicular creases and text-free linework | Clean four-panel crease logic | Paper became fully unfolded; wrong K00 story state and closer to K04 | Rejected |
| K00_v004 | 2026-07-14 | Return to v002; replace only paper with a fully closed quarter-size folded packet | Compact folded state and comparison baseline | Limestone not selected | Rejected |
| K00_v005 | 2026-07-14 | Material-only branch from v004: warm off-white mineral-composite table | Established the selected material world | Small paper, linen, and block-like samples were later corrected | Superseded |
| K00_v006 | 2026-07-14 | Material-only branch from v004: very light natural-oak table | Controlled oak alternative | Felt more domestic and competed with background joinery | Rejected |
| K00_v007 | 2026-07-14 | Blank-paper correction derived from approved v005 mineral world | Correct concealed-drawing state | Superseded by larger paper and simplified object decision | Superseded |
| K00_v008 | 2026-07-14 | Larger A3 folded paper; remove linen; refine stone, oak, ruler | Clear architectural prop logic, stronger reveal scale, approved mineral world retained | None at K00 boundary review | Approved |

## Prompt v003 — Paper-only correction

```text
Use case: precise-object-edit
Asset type: K00 opening keyframe candidate for a scroll-driven architectural process film
Input images: Image 1 is the sole edit target.

Edit only the folded paper at the exact center of Image 1. Preserve every other pixel-level aspect of the scene: camera, framing, studio, rounded limestone table, table base, floor, cabinetry, window, curtain, lighting, shadows, five supporting objects, their positions, and all materials.

Replace the center paper with one continuous rectangular sheet of natural white architectural paper folded twice into a compact packet. It must visibly have perpendicular horizontal and vertical fold creases and restrained paper-fold relief. It must not resemble a booklet, notebook, brochure, pad, envelope, bound object, or stack of pages. No spine, binding, cover, rounded page block, or multiple page edges.

Place a small fragment of precise black architectural plan linework across part of its upper face. Use only clean black and neutral-gray lines with no labels, letters, numbers, dimensions, symbols, colored axes, or readable text. Keep the paper's current center position, scale, orientation, natural fiber, and soft contact shadow. Change nothing else.
```

## Prompt v004 — Closed packet correction

```text
Use case: precise-object-edit
Asset type: K00 opening keyframe candidate for a scroll-driven architectural process film
Input images: Image 1 is the sole edit target. Image 2 is a failure reference only and must not be copied.

Return to Image 1 and edit only its central paper. Keep the sheet completely closed in its compact quarter-size state. Both folding actions have already happened; no panel is open or lying beside another panel. The object is one large architectural sheet folded down into one small flat rectangular packet, with four aligned square corners, a thin paper-only edge, one subtle central crease impression on the upper face, and a barely visible folded flap along one edge. It must be physically capable of unfolding first along one axis and then along the perpendicular axis later.

Do not show four side-by-side quadrants, an open cross, an open sheet, or adjacent panels. Do not create a booklet, binding, spine, cover, page block, multiple page edges, notebook, brochure, envelope, or stack. Add a small fragment of clean black/gray architectural linework on the top face only, without text, symbols, labels, numbers, or dimensions.

Preserve everything outside the paper area exactly. Do not copy Image 2's open-paper state or its changed tabletop texture.
```

## Prompt v005 — Mineral-composite table

```text
Use case: precise-object-edit
Input images: Image 1 is K00 v004 and the sole edit target.
Edit only the complete rounded table, including tabletop, rounded edge, and cylindrical pedestal base. Replace its pale honed limestone with a warm off-white mineral composite with a monolithic, nearly seamless matte finish and extremely subtle fine mineral character. Preserve exact table geometry, perspective, highlights, and shadows. Preserve every other aspect exactly. Do not change anything except the table material.
```

## Prompt v006 — Light-oak table

```text
Use case: precise-object-edit
Input images: Image 1 is K00 v004 and the sole edit target.
Edit only the complete rounded table, including tabletop, rounded edge, and cylindrical pedestal base. Replace its pale honed limestone with very light natural oak using subtle straight grain, low color variation, low saturation, and a refined matte architectural finish. Keep it pale and quiet, not yellow, rustic, domestic, or showroom-like. Preserve exact table geometry, perspective, highlights, and shadows. Preserve every other aspect exactly. Do not change anything except the table material.
```

## Prompt v002 — Targeted limestone refinement

```text
Use case: precise-object-edit
Asset type: K00 opening keyframe candidate for a scroll-driven architectural process film
Input images: Image 1 is the edit target; Image 2 is a supporting plan-line reference only.

Refine Image 1 through a controlled edit. Preserve the 16:9 landscape format, pale honed rounded limestone table, all five supporting objects, their identities and relative positions, the material palette, upper-left daylight direction, and the folded paper at the exact visual center. Pull the virtual camera back moderately and lower the three-quarter viewing angle slightly, revealing more calm warm-gray mineral studio around the table and more usable negative space. The result must read as a wide opening establishing frame rather than an overhead detail.

Correct only the paper construction and drawing: make it unmistakably one compact geometrically folded sheet of natural white architectural paper, not a booklet, pad, brochure, or bound object. Place a small, precise, abstract fragment of black architectural plan linework on its upper face. Image 2 may guide the line character only. Include no labels, dimensions, numerals, letters, colored axes, hatches, symbols, or readable/generated technical text.

Soften the sunlight into broad diffused natural daylight from upper left, reduce strong diagonal light bands, retain restrained cool fill and realistic soft contact shadows. Preserve photorealistic tactile limestone, paper fiber, oak, linen, matte-black metal, and calm Scandinavian architectural restraint.

Change nothing else. Do not add, remove, replace, duplicate, or substantially reposition supporting objects. No people, hands, logos, text, villa model, building, fantasy effects, particles, orange glow, dramatic spotlight, fisheye, extreme depth of field, clutter, new props, saturated colors, glossy marble, heavy bloom, crushed shadows, or watermark.
```

## Approval

- Approved filename: `K00_v008_mineral-table_large-paper.png`
- Dimensions: 1680 × 945 (16:9)
- Approved by: user
- Approval date: 2026-07-14
- Visual QA: passed for K00 environment, table material, light direction, larger blank folded paper, four-object supporting set, and overhead-camera plausibility.
- Controlled-overlay note: the outer face remains blank through K02. The registered plan from `architectural-blueprint-drawing.jpg` belongs on the concealed inner face and begins revealing only in K03.
- Neighbor dependencies: K01 is derived later; K02 is the next active spine frame.

## Prompt v007 — Concealed drawing

```text
Edit only the visible upper face of the folded white paper at the exact table center. Remove every architectural line, mark, symbol, and trace of drawing so the outer face is completely blank natural-white paper. Preserve its physical folded construction, dimensions, position, angle, paper fiber, folded edges, relief, and contact shadow. Preserve every other pixel-level aspect of K00 v005 exactly.
```

## Prompt v008 — Architectural object system and paper scale

```text
Derive from K00 v007. Preserve the camera, mineral-composite table, studio, floor, cabinetry, window, lighting, and color balance. Enlarge the centered blank folded paper to approximately A3 scale, about 1.7 times its current linear size, while preserving its closed folded state. Remove the gray linen swatch completely and restore uninterrupted tabletop beneath it. Convert the left stone and oak blocks into thin architectural material samples while preserving their locations and identities. Refine the black strip into a recognizable matte-black architectural ruler with restrained tick marks and no text. Preserve the mechanical pencil. Do not add replacement objects.
```
