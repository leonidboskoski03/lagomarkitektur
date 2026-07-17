# K11 — Courtyard Exterior Resolution

## Frame contract

- Exact previous approved boundary: `../K10-finished-interior/approved/K10_v001_finished-interior-atmosphere.png`.
- Purpose: rotate/orbit from the finished cutaway approximately 90° toward screen right, translate into the center of the open courtyard, and resolve into the real courtyard façade.
- Camera endpoint: a new mid-elevated architectural-model view from within the courtyard, approximately 90° around from K10 and lower than the cutaway camera. It must remain visibly between K10 and the human-height final render; the final render itself belongs to K13.
- Exterior authority: `../../../Visualizations/1.png` and `../../../Visualizations/2.png` control the courtyard façade, massing language, glazing hierarchy, material placement, timber entrance/canopy, and matte-black detailing. `../../../Visualizations/3.png` and `../../../Visualizations/4.png` remain supplementary side/street references.
- Entrance lock: the warm timber entrance door is on the courtyard-facing façade beside the small raised balcony/terrace and before the taller glazed volume. The false door on the former axonometric screen-bottom elevation is prohibited.
- Permitted transition: camera orbit/rotation, rightward translation into the yard, partial descent/tilt, and resolution of exterior skins/roof into a clean model view. Landscape and photoreal atmosphere remain intentionally less complete than K12–K13.
- Provisional rule: roof and façade heights are visually inferred from the supplied renders because technical elevation dimensions are unavailable; do not treat K11 as construction documentation.
- Prohibited delta: no site redesign, new landscape, new furniture, invented volume, pitched roof, roof equipment, skylight, chimney, pool, pergola, added boundary wall, generic villa substitution, or false entrance on the former axonometric screen-bottom façade.

## Generation prompt — v001 (rejected historical approach)

Use case: precise-object-edit  
Asset type: K11 exterior-envelope/roof boundary keyframe for a scroll-scrubbed architectural process film  
Primary request: close the exact approved K10 cutaway into the L-28 Stoneframe Villa's complete exterior envelope and asymmetrical horizontal flat-roof volumes, while preserving the exact raised camera, footprint, site, courtyard, terraces, landscape, and daylight.  
Input images: Image 1 is the exact K10 edit target and controls all geometry/site/camera relationships; Images 2–3 are real exterior-render references and control façade identity and material hierarchy only.  
Style/medium: premium clean architectural visualization consistent with K10 and the supplied renders.  
Exterior materials: warm-white mineral plaster, pale irregular stacked stone at the lower horizontal courtyard volume, pale ivory large-format panels with restrained vertical veining at the taller volume, matte-black parapet edges/window frames/railings, warm timber entrance door and canopy soffit, and a subtle integrated linear light beneath the canopy.  
Roof/massing: factual asymmetrical flat-roof volumes with slim matte-black parapets; roof plates close inward over the existing house footprint only. Keep the courtyard and terraces uncovered. Use a quiet warm-light-gray roof membrane with no equipment.  
Lighting/mood: preserve K10's broad natural daylight direction and calm neutral-warm balance; restrained architectural shadows; no dusk conversion.  
Constraints: keep the exact 1680 × 945 composition and do not move or redesign any approved wall footprint, opening location, courtyard edge, terrace, balcony glass, gate/fence, paving field, planting, or exterior furniture. Match the real villa rather than a generic Scandinavian house.  
Avoid: pitched or gabled roof, roof tiles, skylights, chimneys, HVAC, solar panels, new walls, closed courtyard approach, pool, pergola, new plants, new furniture, changed openings, camera movement, dramatic sky, orange cast, haze, blur, fantasy assembly effects, text, numbers, labels, logos, or watermark.

## Candidates

| Version | Date | Envelope/roof change | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K11_v001 | 2026-07-16 | Added exterior skins and roof using K10 plus two ground-level exterior references | Captured stacked stone, warm plaster, ivory panels, black roof edges, timber, glazing, and a complete courtyard-facing villa identity | Changed camera scale/crop, rearranged the site, moved exterior furniture and planting, altered courtyard boundaries, and failed exact K10 continuity | Rejected at architectural QA |
| K11_v002 | 2026-07-16 | Rebuilt the roof/envelope using approved K10 as the sole image target and textual L-28 façade rules | Preserved the raised camera, full site, open screen-right courtyard, paving fields, fence/gate, major planting, and clean flat-roof closure much more closely | Covered the approved narrow raised terrace beside the office, removing its four existing seats, plant, and glass-edge relationship | Superseded by isolated terrace correction |
| K11_v003 | 2026-07-16 | Reopened only the narrow raised terrace in v002 and restored its approved K10 contents | Stable camera/site and clean roof envelope retained; four-seat terrace row, plant, adjacent perforated strip, and minimal glass edge restored | Wrong overall K11 concept: retained the axonometric roof view, placed an exterior door on the former screen-bottom façade, and did not rotate/orbit into the real courtyard elevation | Rejected by user review |
| K11_v004 | 2026-07-16 | Replaced the generated axonometric endpoint with the exact wide real courtyard render from Visualization 1 | Camera, façade, entrance, balcony, and exterior identity were factual | Reused the final render too early instead of reproducing the same model from a new lower courtyard-facing camera; removed the required K11→K12→K13 progression | Rejected by user review |
| K11_v005 | 2026-07-16 | Generated a new courtyard-facing exterior view of the evolving model using K10 for model/style continuity and Visualizations 1–2 only for factual façade reference | Correct courtyard direction; factual left raised balcony, timber entrance immediately beside it, taller glazed right volume, flat roofs, stone/plaster/ivory-panel hierarchy, open courtyard foreground, clean neutral model backdrop, and no false bottom-facing door | Camera sits near the lower end of the intermediate range, but the neutral studio environment and simplified realism preserve a clear K11→K12 distinction | Approved by user |

## Status

Approved — `K11_v005_courtyard-model-view.png`. The candidate and approved copies are byte-identical at 1680 × 945.

Generation route: built-in image model for v001–v003; deterministic render reuse for rejected v004. v005 returns to built-in generation, using approved K10 as model/style continuity authority and Visualizations 1–2 only as factual exterior references. The generated 1672 × 941 output was resized proportionally to 1680 × 945 with Lanczos filtering, without crop or retouching. Active v005 SHA-256: `7DCAFB193A2FB1CB62BC705FB109583BFBC9DF0B6696E08A63739CFCCB624DE3`.

## Approval

- Approved: 2026-07-16.
- Candidate: `candidates/K11_v005_courtyard-model-view.png`.
- Exact boundary: `approved/K11_v005_courtyard-model-view.png`.
- Dimensions: 1680 × 945.
- SHA-256: `7DCAFB193A2FB1CB62BC705FB109583BFBC9DF0B6696E08A63739CFCCB624DE3`.
- Next boundary: derive K12 from this exact approved file; do not rebuild or reinterpret K11.
