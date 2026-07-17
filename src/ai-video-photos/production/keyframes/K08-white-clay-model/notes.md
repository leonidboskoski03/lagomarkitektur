# K08 — Complete White-Clay Cutaway

## Frame contract

- Previous approved boundary: `../K07-raised-wireframe/approved/K07_v030_user-approved-clean-wireframe.png`.
- Purpose: complete the spatial-planning state by giving fixed elements, furniture, sanitary objects, and storage clear white-clay dimensional volume.
- Camera: preserve the exact approved K07 v030 camera, 16:9 framing, crop, perspective, and courtyard-right orientation.
- Shell lock: preserve every wall, opening, window, glazing span, balcony edge, yard gate, fence, room footprint, circulation path, terrace, paving field, planting zone, and landscape boundary from K07 v030.
- Existing volume warning: K07 v030 already contains substantial dimensional furniture and site content. K08 must not regenerate the full frame or duplicate objects.
- Only permitted change: add or clarify dimensional volume for elements that the K08 audit explicitly identifies as flat or under-resolved.
- Material state: monochrome neutral-white clay with restrained soft-gray side shading and fine graphite edges. No oak, stone, textile colors, black fixtures, material growth, or finished interior lighting yet.
- Furniture lock: count, footprint, orientation, and circulation remain registered to the approved plan and K07 boundary.
- Vertical-data warning: wall, door, window, and ceiling heights remain provisional until section/elevation/CAD height data is supplied.
- Next state: K09 introduces the approved material-growth system only after K08 is approved.

## First production action

Create a room-by-room audit of K07 v030 covering:

1. Primary bedroom furniture and storage.
2. Flexible/office room desks, chairs, storage, and daybed/sofa.
3. Bathroom sanitary and fixed storage elements.
4. Kitchen cabinetry, dining set, and appliances.
5. Living-room L-shaped sofa, lounge chair, and tables.
6. Courtyard and balcony seating, planters, glazing, and balustrade.

Mark every item as `already dimensional`, `needs volume`, or `geometry uncertain`. Do not generate a K08 candidate until that audit is reviewed.

## K07 v030 dimensional audit

| Zone | Elements | Audit result | K08 action |
|---|---|---|---|
| Primary bedroom | Bed, bedside units, rug, wardrobe/storage face | Bed and bedside elements already dimensional; wardrobe/storage remains visually shallow | Preserve bed and footprint; clarify only wardrobe/storage depth |
| Flexible/office room | Two desks, task chairs, storage, daybed/sofa group | Main footprints are present; chairs, storage, and some work/daybed elements are under-resolved | Add restrained white-clay volume without changing count, orientation, or circulation |
| Bathroom | Vanity/basins, toilet/sanitary elements, fixed storage | Mostly pale plan/shallow relief | Give sanitary and fixed elements clear but restrained white-clay volume |
| Kitchen/dining | Cabinetry, appliances, dining table and chairs | Major masses already dimensional; appliance/fixed details remain shallow | Lock all major masses; clarify only shallow fixed details if needed |
| Living room | L-shaped sofa, lounge chair, two small tables | Already dimensional and readable | No change |
| Courtyard/balcony/site | Seating, planters, paving, glazing/balustrade, yard gate, landscape | Already dimensional/readable or architecturally locked | No change |

Audit conclusion: no new object, footprint, room, or circulation decision is required. K08 v001 may target only the under-resolved bathroom, wardrobe/storage, office/flexible-room, and shallow fixed-detail areas listed above.

## K08 v001 edit brief

- Input image 1: approved K07 v030, exact edit/camera/geometry target.
- Input image 2: `architectural-blueprint-drawing.jpg`, footprint and furniture-count reference only.
- Permitted change: clarify dimensional white-clay volume only in the audited under-resolved elements.
- Locked: every already-dimensional object, wall, opening, window, balcony, yard gate, fence, paving field, plant, camera property, line weight, light, and background.
- Prohibited: complete rerender, material/color growth, new furniture, moved objects, duplicated furniture, roof/ceiling, changed landscape, changed room geometry, or readable technical text.

## Candidates

| Version | Date | Construction change | What worked | Risk / failure to inspect | Decision |
|---|---|---|---|---|---|
| K08_v001 | 2026-07-15 | Targeted white-clay volume completion from approved K07 v030 using the architectural plan as footprint/count reference only | Bathroom fixtures become dimensional; bedroom storage reads as built-in cabinetry; flexible-office objects gain clearer depth; major living, kitchen, courtyard, site, and camera relationships remain visually stable | Exact bathroom fixture arrangement and vertical heights remain provisional until architectural height data is supplied | Approved |

Generation route: built-in image-editing model. The generated 1672 × 941 output was resized proportionally to 1680 × 945 without cropping or additional retouching.

## Approval

- Approved candidate: `candidates/K08_v001_targeted-white-clay-volume.png`.
- Approved boundary: `approved/K08_v001_targeted-white-clay-volume.png`.
- Approval date: 2026-07-15.
- Approval: explicit user approval.
- Canvas: 1680 × 945, 16:9.
- SHA-256 for both copies: `88C7A0EA7831CDD0E4DFA099ECAA85D3DE7FFEFE7DB239ECC9EE20611CD90A1C`.
- Continuity rule: K09 must edit this exact approved file and may change surface materials only.

## Status

Approved — `K08_v001_targeted-white-clay-volume.png` is the exact K09 source boundary.
