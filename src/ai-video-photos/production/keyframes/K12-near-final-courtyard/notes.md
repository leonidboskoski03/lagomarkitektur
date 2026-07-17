# K12 — Near-Final Courtyard Visualization

## Frame contract

- Exact previous approved boundary: `../K11-envelope-roof/approved/K11_v005_courtyard-model-view.png`.
- Purpose: carry the generated courtyard-facing model into a believable exterior world while preserving a visible final handoff for K13.
- Camera endpoint: modestly lower than K11 with no cut, no large reframe, and no jump to the exact ground-level real-render camera.
- Architecture lock: retain the exact flat-roof massing, stacked-stone left façade, raised glass balcony and contents, timber entrance beside the balcony, tall ivory-panel volume, large glazing, steps, courtyard furniture, planting layout, paving, grass, and boundary walls from approved K11.
- Permitted transition: introduce restrained sky and trees, resolve material microdetail, strengthen glass/curtain depth, refine landscape surfaces, and add natural daylight/contact shadows.
- Realism target: approximately 80% of the supplied renders; more resolved than K11 but still a generated intermediate frame rather than a replacement for K13.
- Exterior references: `../../../Visualizations/1.png` and `../../../Visualizations/2.png` control finish, daylight, glazing, curtains, and landscape character only. They do not replace the K11 composition.
- Prohibited delta: no geometry drift, new or removed openings, changed entrance, changed balcony, moved furniture, changed planting structure, new garden feature, pool, pergola, vehicle, person, dusk conversion, dramatic grade, or final-render reuse.

## Generation prompt — v001

Use case: precise-object-edit. Image 1 is exact approved K11 v005 and controls the composition, villa geometry, façade arrangement, courtyard layout, furniture, planting positions, and architectural proportions. Images 2–3 are factual references only for L-28 material detail, natural environment, glazing, curtains, daylight, and landscape finish. Lower the camera only slightly, with at most a very small pullback, while retaining the centered frontal courtyard composition. Replace the neutral studio void with a restrained pale-blue daytime sky, soft clouds, and mature trees behind the existing boundary walls. Increase realism of stone, plaster, ivory panels, timber, black metal, glazing, curtains, grass, paving, plants, daylight, and contact shadows. Stop at roughly 80% of final realism. Do not paste or reuse either supplied render, and do not alter any architecture or object placement.

## Candidates

| Version | Date | Progression | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K12_v001 | 2026-07-16 | Added exterior sky/tree context, natural daylight, richer material depth, glazing/curtains, landscape surface detail, and a restrained camera descent from exact approved K11 v005 | Preserves the balcony–timber entrance–tall glazing order, both seating groups, potted trees, steps, walls, paving organization, and overall courtyard façade; remains generated rather than reusing the supplied final render | The camera change is restrained, but the generated world remains sufficiently distinct from the real-render endpoint | Approved by user |

## Status

Approved — `K12_v001_near-final-courtyard.png`. The candidate and approved copies are byte-identical at 1680 × 945.

Generation route: built-in image model using exact approved K11 v005 as the edit target and Visualizations 1–2 as finish/atmosphere references only. The generated 1672 × 941 output was normalized to 1680 × 945 with Lanczos scaling, without crop or retouching. Candidate SHA-256: `D46EEE38D0727A5DDE123B01B892EC473FCEFF05D020A166B30C515DA2FD10EC`.

## Approval

- Approved: 2026-07-16.
- Candidate: `candidates/K12_v001_near-final-courtyard.png`.
- Exact boundary: `approved/K12_v001_near-final-courtyard.png`.
- Dimensions: 1680 × 945.
- SHA-256: `D46EEE38D0727A5DDE123B01B892EC473FCEFF05D020A166B30C515DA2FD10EC`.
- Next boundary: K13 uses the supplied real courtyard render; do not regenerate the architecture.
