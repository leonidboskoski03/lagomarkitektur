# Project Source Lock

This document owns factual project information and architectural invariants. Creative and motion documents may link here but must not redefine the building.

## Project description

L-28 Stoneframe Villa is a contemporary courtyard home combining architectural clarity with everyday comfort. Clean horizontal volumes use natural stone, plaster, warm wood, large glazed openings, private outdoor lounges, terraces, and integrated linear lighting. The intended character is calm luxury and functional elegance.

Canonical copy: [project-explanation.txt](../project-explanation.txt).

## Canonical assets

| Asset | Authority | Permitted use |
|---|---|---|
| [architectural-blueprint-drawing.jpg](../architectural-blueprint-drawing.jpg) | Primary plan geometry | Walls, openings, furniture footprints, circulation, terraces, landscape organization |
| [Visualizations/1.png](../Visualizations/1.png) | Exterior reference / recommended final hero | Front façade, material hierarchy, entrance, terrace, planting |
| [Visualizations/2.png](../Visualizations/2.png) | Exterior reference | Closer entrance and façade relationship |
| [Visualizations/3.png](../Visualizations/3.png) | Exterior reference | Street wall, gate, massing, number 28 |
| [Visualizations/4.png](../Visualizations/4.png) | Exterior reference | Side stone façade, opening, planting, gate |
| [Visualizations/15.jpg](../Visualizations/15.jpg) | Process inspiration only | Plan-to-3D storytelling grammar; never project geometry |
| [references/](../references/) | Process inspiration only | Pacing, unfolding, camera continuity, dimensional transition |
| [K07 courtyard-façade reference](../production/keyframes/K07-raised-wireframe/references/courtyard-open-facade-reference.png) | User-supplied real exterior render / supplementary authority | Completely open courtyard side, broad living glazing, small terrace glass balustrade, and later courtyard-facing camera direction |

## Source hierarchy

When sources conflict, use this order:

1. Future architect-approved CAD/PDF/DWG.
2. The supplied architectural drawing.
3. Exterior visualizations 1–4 for the exterior only.
4. Approved production blockout.
5. AI-generated imagery.

AI output never overrides a higher source.

## Plan coordinate convention

To avoid ambiguous camera language:

- **Top/north:** grid line 1 side of the displayed drawing.
- **Bottom/south:** grid line 3 and main garden/terrace side.
- **Left/west:** grid A side.
- **Right/east:** grid D side.
- **Southwest/lower-left:** A–B garden and office side.
- **Southeast/lower-right:** C–D living terrace.

The north symbol on the drawing remains the final authority if a later orientation correction is needed.

## Spatial reading

This reading must be confirmed against better technical files if available.

| Zone | Working function | Fixed visible content |
|---|---|---|
| A–B / 1–2 | Primary bedroom | Double bed, west opening, east storage, central-passage door, low south furniture |
| A–B / 2–3 | Office / guest / flexible room | Two south desks, two chairs, west daybed/sofa arrangement, north storage |
| B–C | Central circulation and entrance | North–south passage, adjacent doors, south entry and level change, storage/service niche |
| C–D / 1 | Bathroom | Double basins, sanitary/storage elements, east opening, passage door |
| C–D / 1–2 | Kitchen | Perimeter worktop/appliances, cooktop zone, central hanging/object position |
| C–D / 2–3 | Living and dining | Northern dining table, southern lounge, east opening, southern terrace glazing |
| A–B / south | Inner garden/courtyard | Paving, lawn/planting, compact seating beside office/guest room |
| C–D / south | Main terrace | Two lounge chairs, small round table, tree/planting, paving |

## Geometry locks

- No wall may move, disappear, appear, or change proportion arbitrarily.
- No window may be added, removed, mirrored, resized, or relocated.
- No door may be added, removed, mirrored, or relocated.
- Door swings follow the drawing wherever legible.
- Furniture footprints and orientation follow the drawing.
- Circulation clearances stay open.
- Entry steps/level changes and terrace relationships remain recognizable.
- The large screen-right courtyard remains completely open; no continuous perimeter wall, fence, gate posts, or raised threshold may be invented along that presentation edge.
- The small terrace beside the flexible/bedroom zone uses a transparent glass balustrade rather than an opaque wall.
- The kitchen and living/dining zone remain open-plan where the drawing shows only a planning boundary rather than a wall.
- The top-left bathroom/closet connects to the central hall through an opening; K07 shows the opening without a rendered door leaf.
- The two door-like panels previously generated inside the central hall are not real doors and must be removed; the courtyard-to-house door is the hall's exterior entry.
- The bottom-left room connects to the hall through a clean wall opening without a visible door leaf in K07.
- The living room connects to the circulation zone through a clean opening in its screen-lower wall without a visible door leaf in K07.
- A real wall separates the kitchen's screen-lower edge from the central hall, while the kitchen remains open toward living/dining.
- The central-lower desk room has a terrace-facing window in its screen-right wall beside the desks.
- Glass balustrade exists only around the true small balcony/terrace platform and terminates before the dotted grass/planting zone; no second railing continues after the grass.
- The small balcony's transparent glass is indicated in K07 by a thin top rail/edge line, not an opaque wall.
- A boundary fence runs along the screen-bottom yard edge only; the screen-right/front courtyard approach remains completely open.
- The screen-bottom yard fence includes one narrow pedestrian yard-access gate at the plan-indicated position.
- The small storage/service room keeps its hall-facing sliding door and track; it must not become a blank opening or hinged door.
- The primary exterior entrance is on the courtyard-facing façade, positioned beside the real small raised balcony/terrace and before the taller glazed volume, exactly as shown in Visualizations 1–2. Do not place an exterior entrance door on the former axonometric screen-bottom façade.
- Roof massing and exterior façade resolve to Visualizations 1–4.
- The final image cannot become a generic Scandinavian villa.

## Exterior locks

- Asymmetrical horizontal flat-roof volumes.
- Warm-white mineral plaster.
- Pale irregular stacked stone.
- Pale ivory panels with subtle vertical veining.
- Matte-black roof edges, frames, railings, and fine detailing.
- Warm wood entrance door, gate, and canopy soffit.
- Integrated linear light beneath the canopy.
- Low grasses, rounded shrubs, and restrained small trees.
- Large glazing connecting interior and private terraces.

## Information still missing

- Project and plot area.
- Wall and ceiling heights.
- Window sill and head heights.
- Door heights.
- Construction system.
- Confirmed room names.
- Confirmed furniture schedule.
- Confirmed north/sun study.
- CAD/PDF/DWG source.
- Whether the interior shown is part of the architect's real scope or solely a film proposal.

## Source-lock gate

Technical 3D keyframes may begin when:

- Better technical sources are supplied, or existing uncertainty is explicitly accepted.
- Ambiguous plan symbols are reviewed.
- Room functions are confirmed.
- Furniture positions are confirmed.
- The chosen exterior hero is approved.

## Revision log

| Date | Change | Source |
|---|---|---|
| 2026-07-14 | Added approved descriptive project text | User-provided `project-explanation.txt` content |
| 2026-07-14 | Established initial source hierarchy and plan reading | Supplied drawing and visualizations |
| 2026-07-15 | Confirmed completely open courtyard edge, courtyard-facing glazing, and glass-balustrade relationship | User-supplied real courtyard render and marked plan crops |
| 2026-07-15 | Confirmed bathroom/hall door logic, kitchen hall-side wall, desk-side terrace window, and exact small-balcony glass extent | User-marked K07 crops and technical-plan details |
| 2026-07-15 | Confirmed two blank hall openings, blank bathroom/closet opening, bottom-edge-only yard fence, open screen-right/front approach, and thin balcony-glass rail | User-annotated K07 refinement map |
| 2026-07-15 | Restored the pedestrian yard gate and hall-facing storage sliding door as required geometry | User K07 v028 review and marked locations |
| 2026-07-16 | Confirmed the exterior camera must rotate/orbit approximately 90° into the courtyard and the timber entrance belongs on the courtyard façade beside the raised balcony/terrace, not the former axonometric screen-bottom edge | User K11 v003 review and Visualizations 1–2 |
