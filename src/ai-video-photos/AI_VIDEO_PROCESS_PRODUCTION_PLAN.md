# LAGOM Arkitektur — Scroll-Driven Process Film

> **Concept archive:** This document preserves the complete initial analysis. Active production now starts at [docs/00_INDEX.md](./docs/00_INDEX.md). Update the focused source-of-truth documents there for day-to-day work rather than extending this archive.

## Creative and production blueprint

**Status:** Discussion and pre-production document — no frames or video have been generated yet  
**Prepared from:** The supplied technical drawing, exterior visualizations, process references, current site service content, and current platform documentation  
**Working format:** 16:9 cinematic master controlled by scroll  
**Core idea:** A physical architectural drawing unfolds, becomes a spatial model, receives interior material and atmosphere, and resolves into the completed L-28 Stoneframe Villa.

---

## 1. Executive decision

The concept is strong, but it should be produced as a **hybrid architectural film**, not as a single unconstrained AI generation.

The recommended pipeline is:

1. Use the real plan as the geometric source of truth.
2. Create a deterministic 2D/3D base for the paper, plan, walls, openings, furniture footprints, camera anchors, and final façade.
3. Use ChatGPT Images for controlled visual exploration and selective image editing around those locked bases.
4. Use Kling for short, controlled motion passages between closely related start and end frames.
5. Composite and color-match the passages into one continuous master.
6. Split the approved master into scene-based WebP frame sequences with FFmpeg and lazy-load them around the active scroll range.
7. Use Lottie only for optional vector linework, measurement marks, or service-label overlays—not as the container for the photorealistic film.
8. Use GSAP ScrollTrigger to map scroll progress to the master with linear runtime progress and subtle scrub smoothing.

This distinction matters because two requirements are non-negotiable:

- The walls, doors, windows, and furniture layout must remain faithful to the technical drawing.
- The experience must look cinematic, dimensional, and natural when scrubbed both forward and backward.

Neither ChatGPT nor Kling should be trusted to reconstruct technical geometry exactly from a JPG. AI can art-direct and animate a controlled architectural base, but it cannot certify dimensions or prevent layout drift by prompt alone.

---

## 2. What this film is communicating

This is not merely a house-build animation. It is a visual metaphor for the studio's services and thought process:

| Story moment | Meaning | Current LAGOM service connection |
|---|---|---|
| The quiet table and material samples | Listening, assessment, and direction | Consultant |
| The drawing unfolds and becomes clear | Proportion, planning, and architectural resolution | Architecture |
| The plan rises into inhabitable space | Spatial design and furniture planning | Interior Design |
| Light, texture, and atmosphere resolve | Making design intent visible before realization | 3D Visualization |
| The full villa and landscape appear | A coherent architectural whole | All services converging |

The current website lists four primary services in `src/data/services.ts`: **Architecture**, **Interior Design**, **3D Visualization**, and **Consultant**. The cinematic order above begins with consultation because it reads as a real process. Before final copy is written, LAGOM should confirm whether the film may reorder the service names or whether it must follow the website's current 01–04 order.

### Recommended narrative sentence

> From dialogue, to line, to space, to atmosphere.

This should guide the film even if it never appears as visible text.

---

## 3. Supplied-material audit

### 3.1 Technical source of truth

[`architectural-blueprint-drawing.jpg`](./architectural-blueprint-drawing.jpg)

- Resolution: 1800 × 1272.
- This is the only supplied source that defines the actual room organization, wall positions, openings, furniture footprints, entry, terraces, and landscape zones.
- It contains red axes/markers, green landscape hatches, gray dimensions, and black construction/furniture lines.
- The cinematic drawing must be restyled to **white architectural paper with black ink**, but the geometry must not be redrawn freely by AI.
- The best preparation method is to trace or extract the relevant linework into separate layers: walls, openings, furniture, dimensions, landscape, axes, and annotations.

### 3.2 Exterior project truth

The factual exterior references are:

- [`Visualizations/1.png`](./Visualizations/1.png) — strongest final frontal hero composition.
- [`Visualizations/2.png`](./Visualizations/2.png) — closer frontal angle and entrance relationship.
- [`Visualizations/3.png`](./Visualizations/3.png) — street-side massing, wall, gate, and number 28.
- [`Visualizations/4.png`](./Visualizations/4.png) — side stone façade, window, landscape, and gate.

These establish:

- Flat-roofed, asymmetrical single-storey volumes.
- Warm white mineral plaster.
- Pale, irregular stacked-stone cladding.
- Large pale ivory façade panels with subtle vertical stone veining.
- Matte-black roof edges, glazing frames, railings, and detailing.
- Warm wood at the entrance door, gate, and canopy soffit.
- Integrated linear lighting below the canopy.
- Low, restrained planting with grasses, rounded shrubs, and small trees.
- Bright natural daylight with crisp but not harsh architectural shadows.

[`Visualizations/15.jpg`](./Visualizations/15.jpg) is a six-panel process concept for a different rectangular house. It is useful only as evidence of the intended plan-to-3D storytelling pattern. It must not influence this villa's geometry, rooms, furniture, windows, or façade.

### 3.3 Process references

[`references/`](./references/)

The 14 images show a different project moving through these states:

1. Folded plan on a neutral table.
2. Paper unfolding.
3. Flat plan.
4. Entrance activation.
5. Camera push toward the plan.
6. Plan lines becoming raised wireframe walls.
7. Full wireframe cutaway.
8. Finished interior cutaway.
9–14. Camera lowering and approaching an illuminated entrance.

What may be borrowed:

- The calm pacing.
- The physical-to-spatial transformation.
- The sense of camera continuity.
- The idea that a single architectural point can initiate transformation.
- The transition from orthographic plan to perspective space.

What must not be borrowed:

- Blue paper and white ink.
- The other project's rectangular plan.
- Its room layout or furniture.
- The glowing entrance-door motif as the main narrative device.
- Its warm fantasy portal ending.
- Its exact camera angles or composition.

The LAGOM film should feel more restrained, white, mineral, black-lined, daylight-led, and specific to Stoneframe Villa.

### 3.4 Project description and remaining unknowns

[`project-explanation.txt`](./project-explanation.txt) now identifies L-28 Stoneframe Villa as a contemporary courtyard home built around architectural clarity, everyday comfort, clean horizontal volumes, natural stone, plaster, warm wood, large glazed openings, private outdoor lounges, terraces, integrated linear lighting, calm luxury, and functional elegance.

This strengthens the film direction in several ways:

- The courtyard and terraces must read as extensions of the interior, not as background decoration.
- The pullback should demonstrate privacy and openness at the same time.
- Stone, plaster, warm wood, black edge detailing, glazing, and landscape are the final material hierarchy.
- Daylight is the primary version, while integrated linear lighting may appear only as a very subtle late-stage detail or optional dusk variant.
- The final feeling is calm luxury and functional elegance, never spectacle.

The description does not provide technical measurements. Therefore, this document still does **not** invent:

- Project area.
- Plot size.
- Ceiling height.
- Window sill/head heights.
- Exact door heights.
- Construction system.
- Confirmed room names.
- Confirmed north/sun study.
- Client story or scope.

Those facts must still be confirmed before technical prompts, captions, or dimensional claims are finalized.

---

## 4. Reading of the actual plan

The following is a visual reading of the supplied drawing, not a replacement for CAD or architect confirmation.

### 4.1 Spatial organization

| Plan zone | Visible function | Elements that must remain fixed |
|---|---|---|
| A–B / 1–2 | Primary bedroom | Double bed footprint, west-side opening, east-side storage, door from central passage, low furniture at the south wall |
| A–B / 2–3 | Office / guest / flexible room | Two desks along the south opening, two task chairs, long daybed/sofa arrangement at the west side, north storage, door from the central passage |
| B–C | Central circulation and raised entrance | Narrow north–south passage, doors into adjacent rooms, level changes/steps at the southern entry, storage/service niche toward the north |
| C–D / 1 | Bathroom | Double-basin arrangement along the south side, sanitary/storage elements at the north side, east-side opening, door from the passage |
| C–D / 1–2 | Kitchen | Fixed perimeter worktop/appliances, cooktop zone, central pendant/object position, relationship to the living/dining room |
| C–D / 2–3 | Living and dining | Dining table in the northern half, lounge furniture in the southern half, east-side opening, large southern glazed opening to the terrace |
| A–B / south exterior | Inner garden/courtyard | Paving route, lawn/planting zones, small seating area beside the office/guest room |
| C–D / south exterior | Main terrace | Two rounded lounge chairs, small round table, tree/planting, paved surface |

### 4.2 Geometry-lock rules

These are pass/fail requirements:

- No wall may move, disappear, thicken arbitrarily, or appear where the plan has no wall.
- No window may be added, removed, widened, narrowed, or shifted.
- No door may be added, removed, mirrored, or moved.
- Door-swing direction should follow the drawing wherever it is legible.
- Furniture must remain within the exact footprints and orientation shown on the plan.
- Circulation clearances may not be filled with decorative furniture.
- The central entrance, level changes, terraces, and garden relationships must remain recognizable.
- The final exterior must resolve to the supplied façade, not to a generic Scandinavian villa.

### 4.3 What AI may interpret

AI may help determine:

- Upholstery softness and seam detail.
- The precise light-oak grain.
- Linen texture and curtain fold character.
- Styling objects, provided they do not occupy circulation or change the plan.
- Stone surface variation.
- Atmospheric light, fine dust, very subtle paper fibers, and photographic finish.
- The exact shape of non-fixed decorative objects, within an approved object count.

AI may not interpret structural or layout information.

---

## 5. Creative direction

### 5.1 Tone

The film should feel:

- Calm.
- Precise.
- Architectural.
- Tactile.
- Quietly cinematic.
- Premium without appearing luxurious for its own sake.
- Natural and contemporary rather than futuristic.

It should not feel:

- Like a generic CAD software demo.
- Like a magical fantasy portal.
- Like a construction timelapse.
- Like an energetic product commercial.
- Like a blue technical blueprint cliché.
- Like liquid metal, sci-fi holograms, or particle-heavy VFX.

### 5.2 Visual palette

The website design system is almost monochrome: white, black, light gray, and muted gray. The villa adds the warm material layer.

Recommended film palette:

| Role | Direction |
|---|---|
| Background/floor | Warm mineral gray, approximately the feeling of microcement or fine lime plaster |
| Table | Pale honed limestone or warm off-white mineral composite, rounded edge |
| Paper | Natural architectural white—not blue, cream, or bright digital white |
| Drawing | Carbon black with fine gray hierarchy for secondary dimensions |
| Oak | Light natural oak, matte, low saturation |
| Fabric | Light warm gray and stone-colored linen |
| Walls | Matte warm white |
| Stone | Pale limestone/travertine family, low contrast |
| Metal/light fixtures | Matte black |
| Exterior vegetation | Restrained olive and deep natural green |

### 5.3 Opening table

The table should be **uncluttered**, not literally empty. It is the first expression of LAGOM's material judgment.

Recommended object set:

- Folded white plan at exact center.
- One small light-oak sample.
- One pale stone sample.
- One folded light-gray linen swatch.
- One matte-black metal strip or slim architectural ruler.
- One black mechanical pencil.

Maximum: six supporting objects. No coffee cup, hands, laptop, plant styling, books, glasses, or generic architect props unless later approved.

The objects should sit near the frame edges so the plan remains the visual center. Their arrangement should imply careful material comparison rather than decoration.

### 5.4 Light

- Large, soft daylight source from upper left.
- Subtle cooler fill from the opposite side.
- Natural contact shadows, never floating objects.
- No orange portal light.
- No theatrical spotlight cone.
- No exposure pumping between clips.
- Final exterior daylight should be graded toward the supplied renders.

---

## 6. Interior design bible

The interior is unbuilt and therefore must be presented as a **proposed design visualization**, not as a factual realized interior.

### 6.1 Global interior rules

- Light-oak flooring in dry living spaces.
- Matte warm-white wall and ceiling finish.
- Light-gray woven textiles.
- Pale stone at kitchen/bath surfaces.
- Matte-black minimalist lighting.
- Natural linen curtains.
- Abundant natural daylight.
- Clean, low-profile furniture.
- No glossy marble, brass-heavy luxury, dark walnut, boucle overload, or decorative clutter.
- No furniture beyond the approved plan footprints.

### 6.2 Room guidance

#### Primary bedroom

- Keep the bed centered in its drawn footprint.
- Light-oak headboard or very low integrated oak detail.
- Pale gray linen bedding with white underlayers.
- Matte-black wall or pendant lights, symmetrical only if the plan allows.
- Full-height storage at the drawn east-side location.
- Linen curtain at the actual opening only.
- No bench, lounge chair, extra nightstand, or large plant unless it fits an existing drawn footprint.

#### Office / guest room

- Preserve the two desks along the south opening and the two chair positions.
- Use thin light-oak worktops with visually quiet storage.
- Matte-black task lights may articulate the two working positions.
- Preserve the daybed/sofa arrangement on the west side.
- Pale gray upholstery and one restrained textile accent.
- No central meeting table or extra shelving.

#### Central entry and circulation

- Treat this as the organizing spine of the animation.
- Use the level change and entry alignment as the point from which plan lines first gain height.
- Keep finishes quiet: light oak or pale stone at the threshold, warm white walls, one black line light if architecturally valid.
- Do not use the glowing fantasy door from the references.

#### Kitchen

- Preserve the worktop, appliance, cooktop, and circulation layout shown in the plan.
- Matte warm-white cabinetry with selective light-oak fronts.
- Pale stone worktop and backsplash.
- Black minimal hardware or integrated pulls.
- The central hanging element should be a quiet black pendant if its position corresponds to the drawing.
- No island may be added unless the architect confirms the central object is an island.

#### Bathroom

- Preserve the double-basin arrangement and all sanitary footprints.
- Pale stone or warm-white large-format surfaces.
- Light-oak vanity only if moisture detailing remains credible.
- Matte-black fittings and a minimal black linear light.
- No freestanding tub or shower reconfiguration unless confirmed by the plan/CAD.

#### Living and dining

- Keep the dining table in the northern portion and the lounge in the southern portion.
- Light-oak dining table and slim chairs in the exact count/footprint shown.
- Pale gray sofa along the drawn east-side position.
- Preserve both lounge-chair footprints and the small tables.
- Use linen curtains only at actual glazing.
- The room should carry the strongest material-growth passage because it is the clearest expression of Interior Design.

#### Terraces and garden

- Preserve the seating arrangements shown in the drawing.
- Pale mineral paving and low architectural planting.
- Match the exterior renders' grasses, rounded shrubs, and small trees.
- No pool, pergola, firepit, outdoor kitchen, or additional furniture.

---

## 7. Camera grammar

### 7.1 One continuous camera idea, built from several clips

The viewer should perceive one continuous camera, but production should use multiple short passages. Each clip must inherit the previous clip's exact end frame as its start frame.

This provides:

- Better architectural consistency.
- Better start/end-frame similarity.
- Easier regeneration of one failed action.
- Cleaner scroll mapping.
- Better reverse playback.
- Lower risk of Kling introducing an unintended cut.

### 7.2 Lens language

- Opening table: 35–40 mm full-frame equivalent.
- Overhead plan: transition toward a 45–55 mm, nearly orthographic feel.
- Plan-to-space axonometric: 40–50 mm.
- Interior cutaway: 35–45 mm.
- Final exterior: match the chosen supplied render; do not impose a new lens if the render already defines perspective.
- Avoid lenses wider than approximately 28 mm because wall and furniture proportions will distort.
- Avoid obvious lens breathing or focal-length changes during individual transitions.

### 7.3 Camera motion principles

- Slow acceleration and deceleration.
- No handheld shake.
- No sudden gimbal correction.
- No orbit greater than necessary in one clip.
- No cut disguised by a blur or flare.
- No depth-of-field so shallow that technical geometry becomes unreadable.
- Motion blur must be restrained because the film will be scrubbed and often paused on intermediate frames.

### 7.4 “Bottom-left” interpretation

The plan's most visually rich living zone is on the lower-right side of the supplied drawing. To respect the requested bottom-left camera movement without hiding that room:

- Move the **camera position** toward the lower-left/southwest side of the plan.
- Keep the **camera target** near the central spine and living/dining zone.
- Tilt from top-down toward a northeast-looking three-quarter view.

This creates strong depth across the house and reveals the living, kitchen, circulation, and bedroom volumes without changing the plan.

---

## 8. Master keyframe system

The film should be designed around 14 approved master frames. These are not 14 independently generated images. Each new frame should be derived from the same geometry, camera rig, material library, and preceding approved frame.

| ID | Master-frame description | Locked state |
|---|---|---|
| K00 | Wide, calm three-quarter view of rounded table | Table, room, object positions, light direction |
| K01 | Medium approach toward folded plan | Same camera axis, closer distance, plan centered |
| K02 | Near-overhead view of folded plan | Camera almost top-down; supporting samples at edges |
| K03 | Plan unfolded horizontally on the x-axis | White paper strip, black drawing fragments aligned across folds |
| K04 | Plan fully unfolded vertically on the y-axis | Entire physical sheet visible; real creases and fold shadows present |
| K05 | Full-screen flat plan world | Table/floor absent; creases and paper relief evacuated; clean black linework |
| K06 | Beginning of spatial tilt | Same plan, slight southwest camera translation and perspective change |
| K07 | Exact wireframe shell partially raised | Wall lines extruded; all openings preserved; furniture still drawn/low |
| K08 | Complete white clay cutaway | Walls/openings/furniture volumes built; no final material yet |
| K09 | Material-growth passage at approximately 50% | Oak, white, stone, gray textile, and black details appearing in controlled waves |
| K10 | Finished Scandinavian interior cutaway | All furniture fixed; daylight coherent; no roof |
| K11 | Exterior envelope and roof assembled from same raised view | Façade, flat roofs, canopies, glazing, and terraces match project renders |
| K12 | Mid-descent/pullback with full house and landscape visible | Camera lower and farther back; house remains centered and stable |
| K13 | Final ground-level exterior hero | Composition resolves to `Visualizations/1.png` or another approved render |

### Continuity rule

For every clip `S(n)`, its end frame must be the exact pixel-identical file used as the start frame of `S(n+1)`. Do not regenerate “similar” boundary frames.

---

## 9. Detailed sequence plan

### S01 — Arrival

**Frames:** K00 → K01  
**Purpose:** Establish Consultant / the beginning of a project.  
**Camera:** Slow straight dolly toward the plan; almost imperceptible vertical lift.  
**Object motion:** None. Linen may have no visible movement; this is a still, controlled studio.  
**Light:** Soft daylight remains fixed.  
**Feeling:** Observation, not reveal.

Avoid a perfectly symmetrical frame. A small lateral offset gives the table depth while the plan remains the compositional anchor.

### S02 — Crane to plan

**Frames:** K01 → K02  
**Purpose:** Move from studio context to design focus.  
**Camera:** Continuous crane/tilt toward bird's-eye rather than a hard POV switch.  
**Target:** The center crease of the folded plan.  
**Constraint:** Supporting material samples drift toward the frame edges only because of camera motion; they must not move physically.

### S03 — Horizontal unfold

**Frames:** K02 → K03  
**Purpose:** Architecture begins to disclose itself.  
**Paper motion:** Left and right panels open along the fold lines.  
**Camera:** Locked top-down with a very small push-in.  
**Physics:** Light paper inertia with a 1–2% settling movement; no bounce, flutter, wind, or cloth-like behavior.  
**Linework:** The drawing remains attached to the paper surface and meets exactly across folds.

### S04 — Vertical unfold

**Frames:** K03 → K04  
**Purpose:** Reveal the complete plan.  
**Paper motion:** Upper and lower sections unfold on the y-axis.  
**Camera:** Locked, then a subtle final centering adjustment.  
**End state:** Full drawing, physical creases, slight edge curl, soft fold shadows.

The two-stage unfold is better than opening all panels at once because it gives scroll two distinct tactile events and reduces AI geometry errors.

### S05 — Enter the drawing

**Frames:** K04 → K05  
**Purpose:** Cross from physical document into design space.  
**Camera:** Slow push toward the center until the paper fills the viewport and its outer edges disappear.  
**Transition:** A center-origin “dephysicalization wave” travels outward.

The requested “outcrack/outfold” should not look like paper breaking. Recommended behavior:

1. A soft circular pressure wave starts at the central circulation spine.
2. Crease highlights and fold shadows are pushed outward ahead of the wave.
3. Fine paper-fiber relief becomes flatter behind it.
4. The black linework remains perfectly fixed.
5. The wave passes beyond the viewport, leaving a clean, flat white field.

This is the moment the viewer understands that they are no longer looking **at** the drawing; they are now **inside its representational world**.

### S06 — Orthographic plan becomes perspective

**Frames:** K05 → K06  
**Purpose:** Prepare the plan to gain depth without a visual cut.  
**Camera:** Translate toward the lower-left/southwest, lower slightly, tilt from approximately 90° top-down toward 60–65°.  
**Line behavior:** Lines remain planar during most of the camera move.  
**End cue:** At the last portion, major wall lines gain a hairline black shadow or duplicate edge, suggesting height is imminent.

### S07 — Structure grows

**Frames:** K06 → K07  
**Purpose:** Express Architecture and spatial planning.  
**Trigger point:** Begin at the central entrance/circulation spine, not at a fantasy doorway.  
**Build order:**

1. Structural/exterior wall lines.
2. Main internal partitions.
3. Door and window voids.
4. Fixed joinery and sanitary elements.
5. Furniture guide lines.

Walls should not simply scale upward as identical slabs. A more architectural behavior is:

- Black line doubles and gains a thin side plane.
- A white wall plane rises from the line.
- The top edge remains black for a short interval.
- The black construction edge softens as the wall reaches its final height.

This preserves the drawing language while making the transition dimensional.

### S08 — Clay spatial model

**Frames:** K07 → K08  
**Purpose:** Complete the spatial model before decoration.  
**Motion:** Furniture volumes and fixed elements rise in a staggered but controlled order.  
**Camera:** Slow lateral drift toward the living/dining zone; no major orbit.  
**Material:** One matte off-white clay material, light gray floor plane, black line remnants.

Finishing geometry before material growth is essential. If walls, furniture, and textures all transform simultaneously, Kling is more likely to melt forms or invent objects.

### S09 — Material grows through space

**Frames:** K08 → K09  
**Purpose:** Express Interior Design.  
**Camera:** Continued slow descent and southwest drift, targeted across the living/dining area.  
**Material order:**

1. Light-oak floor and fixed oak joinery.
2. Matte-white walls and cabinetry.
3. Pale stone worktops/bath surfaces.
4. Light-gray upholstery and linen curtains.
5. Matte-black fixtures and fine details.

The requested liquid/watery reveal should behave like a controlled **capillary material front**, not literal colored water:

- A soft, irregular edge advances over a surface.
- A very small wet specular highlight exists only at the leading edge.
- Behind the edge, the material dries instantly to a matte finish.
- The reveal follows each surface's plane and never crosses open air.
- Adjacent surfaces start a fraction later, producing organic propagation.
- The wave cannot deform furniture or wall geometry.

### S10 — Atmosphere completes

**Frames:** K09 → K10  
**Purpose:** Express 3D Visualization as the moment a design becomes emotionally legible.  
**Motion:** Material fronts finish, curtains settle, daylight gains its final soft contrast, and black lighting elements resolve.  
**Camera:** Small pullback to re-establish the complete cutaway.  
**Constraint:** No object should pop into existence in the final 10%.

### S11 — Interior becomes architectural envelope

**Frames:** K10 → K11  
**Purpose:** Move from room-scale thinking to the complete villa.  
**Build order:**

1. Exterior wall skins resolve to plaster, stone, and ivory panels.
2. Black frames and roof edges appear.
3. Flat-roof planes assemble or close over the cutaway.
4. Entrance canopy, timber soffit, and glazing complete.
5. Terraces and external walls lock into the real project composition.

Do not let the roof simply drop from the sky. It can grow inward from the parapet lines or resolve through a planar wipe consistent with the earlier material language.

### S12 — Landscape and scale

**Frames:** K11 → K12  
**Purpose:** Reveal the house as part of a complete site.  
**Camera:** Dolly backward while descending from raised three-quarter view toward human height.  
**Tilt:** Gradually reduces toward a near-level exterior view.  
**Landscape order:** Paving, low grasses, rounded shrubs, then small trees and their shadows.  
**House behavior:** The house does not shrink independently; apparent scale changes only through camera movement.

This is the requested “scaling off” moment, but it should read as a camera pullback rather than a model being scaled down.

### S13 — Exterior resolution

**Frames:** K12 → K13  
**Purpose:** Resolve to the factual finished exterior.  
**Camera:** Complete the descent and settle into the approved render composition.  
**Target:** Prefer `Visualizations/1.png` because it gives the strongest frontal relationship between stone, entrance, pale panel volume, glazing, terrace, and planting.  
**End hold:** The final 4–6% of film progress should contain only tiny daylight/foliage movement or be completely still.

The end frame should be the actual render or a minimally extended version of it—not an AI reinterpretation of the façade.

---

## 10. Motion and easing

There are two different easing systems:

1. **Cinematic motion inside the rendered frames.**
2. **Scroll-to-playhead mapping in the browser.**

They must not fight one another.

### 10.1 Runtime rule

The master playhead should use linear mapping (`ease: none`) so that scroll position corresponds predictably to film progress. GSAP ScrollTrigger's `scrub` provides the follow behavior; a numeric scrub may add a short catch-up delay.

Recommended testing range:

- Desktop pointer/trackpad: approximately 0.35–0.65 seconds of scrub smoothing.
- Touch/mobile: direct or lighter smoothing to avoid a sluggish feel.
- No mandatory snapping during the main film.
- Pin the scene container, not the media layer that is being transformed.

### 10.2 Cinematic easing by action

| Action | Character | Suggested curve behavior |
|---|---|---|
| Table approach | Nearly constant, soft arrival | Gentle sine in/out |
| Crane to overhead | Confident, weightless | Smooth cubic in/out |
| Paper unfolding | Tactile, slightly weighted | Faster middle, controlled 1–2% settle; no bounce |
| Dephysicalization wave | Quiet release | Slow start, broad middle, soft completion |
| Camera tilt into plan | Continuous and spatial | Symmetrical ease in/out |
| Wall growth | Decisive but not mechanical | Individual ease-out with restrained stagger |
| Furniture rise | Slightly softer than walls | Smooth ease-out, shorter stagger |
| Material propagation | Organic | Irregular front with globally smooth progress |
| Exterior pullback/descent | Grand but restrained | Long ease in/out with no last-second acceleration |
| Final settle | Almost imperceptible | Long ease-out to stillness |

### 10.3 Scroll-authored holds

A normal film uses time-based pauses. A scrubbed film uses **scroll distance allocation**. Story beats need additional near-static frames or duplicated visual states so the user can register them without the camera abruptly stopping.

Recommended holds:

- Full physical plan at K04.
- Clean flat plan world at K05.
- Complete wireframe at K07.
- Finished interior at K10.
- Final exterior at K13.

---

## 11. Suggested scroll map

| Master progress | Sequence | Visual state | Narrative label |
|---:|---|---|---|
| 0–10% | S01 | Approach table | Consultant / “Every project begins with listening.” |
| 10–18% | S02 | Crane to overhead | Focus |
| 18–28% | S03 | Horizontal unfold | Architecture |
| 28–37% | S04 | Vertical unfold | Plan revealed |
| 37–46% | S05 | Enter plan world | “From line…” |
| 46–53% | S06 | Tilt to perspective | Spatial intent |
| 53–64% | S07 | Walls grow | Architecture |
| 64–72% | S08 | Clay model completes | Spatial planning |
| 72–82% | S09 | Material growth | Interior Design |
| 82–87% | S10 | Atmosphere completes | 3D Visualization |
| 87–92% | S11 | Envelope/roof | Complete architecture |
| 92–97% | S12 | Pullback and landscape | Place and scale |
| 97–100% | S13 | Exterior hero | LAGOM Arkitektur |

The visible text should be normal HTML synchronized to progress, not baked into generated images or video. This keeps typography sharp, copy editable, localization possible, and content accessible.

---

## 12. ChatGPT Images vs. Kling

### 12.1 Recommended role of ChatGPT Images

Use ChatGPT Images for:

- Table, paper, material, and lighting style exploration.
- Generating several K00 visual directions before choosing one.
- Controlled edits to an existing approved frame.
- Replacing or refining specific materials with masked edits.
- Producing frame variants while preserving the overall composition.
- Prompt development and visual QA against the supplied references.

Do not use ChatGPT Images to:

- Independently redraw the technical floor plan.
- Decide walls, windows, doors, or furniture positions.
- Generate every keyframe from a fresh text prompt.
- Recreate the final façade from memory instead of using the supplied render.

OpenAI's current official guidance confirms that ChatGPT Images can create images, edit uploaded images, perform selected-area edits, and generate different aspect ratios. It also warns that selected edits may extend beyond the highlighted area. That is why masked AI editing is useful for finish exploration but cannot be the geometry-certification layer.

### 12.2 Recommended role of Kling

Use Kling for:

- Camera interpolation between approved, similar frames.
- Paper micro-physics after the geometric unfold is established.
- The dephysicalization wave.
- Subtle line-to-volume transitions.
- Controlled material propagation.
- Small daylight and atmospheric movement.

Do not ask Kling to perform all of the following in one prompt:

- A major camera orbit.
- Paper unfolding.
- Plan redrawing.
- Walls growing.
- Furniture appearing.
- Materials changing.
- Landscape growing.
- Final façade matching.

Kling's official start/end-frame guidance says the two images should be similar; large differences may trigger a lens switch, and similar transitions work best within short passages. This strongly supports the 14-keyframe, multi-clip structure.

### 12.3 Best combined answer

**Use neither tool alone.**

The highest-confidence workflow is:

> deterministic geometry and composition → ChatGPT image exploration/editing → approved keyframes → Kling motion → compositing and web optimization

### 12.4 AI-only fallback

If no 3D base model can be created:

1. Clean the plan and create a black-line transparent overlay.
2. Generate the table/background independently.
3. Composite the exact plan onto the folded/unfolded paper rather than prompting AI to draw it.
4. Derive each frame from the last approved frame with targeted image edits.
5. Keep the room build limited to a stylized diagrammatic wireframe rather than claiming technical 3D accuracy.
6. Use the actual exterior render as the final frame.

This can produce a persuasive film, but it should be described as a visual interpretation. It cannot honestly guarantee dimensionally exact 3D architecture.

---

## 13. Start/end-frame generation protocol

### 13.1 Frame canvas

- Work in 16:9 from the beginning.
- Create masters at 3840 × 2160 when the tool and source quality allow.
- Downsample for final delivery after compositing.
- Keep a central safe area for mobile crops, but do not force the desktop composition into a vertical frame.
- Generate a separate mobile framing later if mobile is a major experience, rather than blindly cropping the desktop master.

### 13.2 Frame derivation

For every keyframe:

1. Begin from the approved base model or previous approved frame.
2. Change only the variables required for that step.
3. Overlay the plan/wireframe again after any generative pass if line fidelity has degraded.
4. Compare against the technical plan.
5. Compare against the previous frame for camera and light continuity.
6. Approve before generating motion.

### 13.3 Prompt hierarchy

Each motion prompt should use this order:

1. **Locked invariants:** house geometry, openings, furniture, palette, light direction.
2. **Camera motion:** one primary move and, at most, one small secondary move.
3. **Object/material motion:** one main transformation.
4. **Movement quality:** slow, continuous, controlled, reversible-feeling.
5. **Prohibitions:** no cuts, no shake, no object drift, no geometry changes.

### 13.4 Generic Kling motion-prompt template

> One continuous architectural shot. Preserve the exact building layout, wall positions, door positions, window positions, furniture footprints, material palette, and lighting direction from the start and end frames. The camera [single precise movement]. At the same time, [single transformation] progresses smoothly and physically. Motion is slow, cinematic, stable, and restrained, with minimal motion blur. No cuts, no lens switch, no camera shake, no added objects, no removed objects, no warped geometry, no moving walls, no relocated windows or doors, no furniture drift, no text, no people.

### 13.5 Master negative prompt

> blueprint blue, blue paper, white ink, extra room, missing room, added wall, moving wall, melting wall, warped architecture, changed floor plan, shifted window, extra window, shifted door, extra door, mirrored door, furniture drift, new furniture, duplicated furniture, floating furniture, distorted table, fisheye, extreme wide angle, camera cut, lens switch, crash zoom, handheld shake, time-lapse workers, people, hands, fantasy portal, orange glow, magical particles, hologram, liquid metal, oversaturated color, heavy bloom, heavy motion blur, text, logo distortion, flicker, texture boiling, exposure pumping

This negative list should be shortened for each clip so the positive action remains clear; it is a master checklist, not necessarily a single pasted field.

---

## 14. Why the photorealistic master should not be Lottie

The proposed film contains:

- Photorealistic raster imagery.
- Realistic camera movement.
- Paper deformation.
- 3D walls, furniture, roofs, and landscape.
- Natural shadows, blur, depth, texture, and organic material fronts.

Lottie is a JSON animation format optimized for supported vector/After Effects properties. Current LottieFiles guidance lists 3D layers, cameras, lights, most effects, blur/distortion/generation effects, and several other features as unsupported. Converting a rendered AI video into raster frames inside a Lottie package would retain the weight of raster animation while losing Lottie's main advantages.

### Recommended delivery architecture

| Layer | Format | Purpose |
|---|---|---|
| Cinematic master | Scene-based, lazy-loaded WebP frame sequence extracted with FFmpeg | Photorealistic table, plan, spatial build, interior, and exterior with deterministic forward/reverse scrubbing |
| Diagram overlay | Optional Lottie/SVG | Black plan strokes, axes, dimension ticks, service markers |
| Copy and controls | Semantic HTML/CSS | Accessible service titles, captions, progress, reduced-motion alternative |
| Scroll controller | GSAP ScrollTrigger | Pinning, progress mapping, scrub behavior, lazy scene activation |

### WebP image sequence as the primary delivery

This project should use a WebP sequence as its primary delivery candidate because:

- Exact frame control is the priority.
- Reverse scrub must be perfect.
- Intermediate frames must remain sharp.
- The 13 sequences already provide natural loading boundaries.
- ScrollTrigger can address an exact visual frame without waiting for video seeking.

The main risk is payload and decoded-image memory:

- A 65-second master sampled at 24 fps would produce approximately 1,560 images, which is excessive for this page.
- A decoded 1920 × 1080 frame can occupy roughly 8 MB in RGBA memory even if its compressed WebP file is small.
- Creating an `<img>` element or decoded `ImageBitmap` for every frame would violate the requirement not to load all large project imagery at once.

Controls:

- Extract each sequence into its own directory.
- Use different sampling rates per sequence instead of forcing every scene to 24 fps.
- Target approximately 600–750 frames for the complete experience.
- Network-preload the active sequence and, when budget allows, the next sequence as compressed files.
- Keep only a small decoded window around the current playhead—approximately two to four frames on either side.
- Draw one frame to a canvas, then release decoded frames outside the active window.
- Produce separate desktop and mobile resolution tiers.
- Use a poster frame while the first active sequence is loading.
- Never preload or decode the complete sequence.
- Never ship or load 4K frames in the browser; 4K remains the production master only.

### Recommended adaptive sampling

All Kling passages may be rendered at normal cinematic frame rate for compositing, but the website sequence should sample according to visible change:

| Sequence | Suggested WebP sampling | Reason |
|---|---:|---|
| S01 Arrival | 6 fps | Slow camera approach |
| S02 Crane to plan | 8 fps | Smooth but restrained camera change |
| S03 Horizontal unfold | 12 fps | Paper articulation needs more temporal detail |
| S04 Vertical unfold | 12 fps | Paper articulation needs more temporal detail |
| S05 Enter drawing | 12 fps | Radial transition and zoom |
| S06 Plan to perspective | 8 fps | Slow tilt and translation |
| S07 Structure grows | 15 fps | Highest geometric change |
| S08 Clay model | 12 fps | Furniture and fixed-element build |
| S09 Material growth | 15 fps | Organic propagation front |
| S10 Atmosphere | 8 fps | Mostly lighting and finishing detail |
| S11 Envelope and roof | 12 fps | Architectural assembly |
| S12 Landscape and descent | 12 fps | Camera and landscape change |
| S13 Exterior resolution | 6 fps | Long settle into the hero frame |

For 13 five-second source passages, this produces roughly 690 browser frames before any additional hold-frame pruning. Static holds should reuse one frame through progress mapping rather than duplicate files.

### FFmpeg extraction specification

The master should first be composited and graded as a high-quality mezzanine file, ideally ProRes or another visually lossless editing master. WebP extraction happens only after all clips are stitched, corrected, and approved.

Recommended directory structure:

```text
process-film/
  desktop/
    s01-arrival/
      frame_0001.webp
      frame_0002.webp
    s02-crane/
    ...
    s13-exterior/
  mobile/
    s01-arrival/
    ...
  manifest.json
  poster.webp
```

The zero-padded naming is important because lexical and numeric order remain identical.

Desktop extraction template:

```powershell
ffmpeg -i process-master.mov -ss <segment-start> -to <segment-end> -vf "fps=<scene-fps>,scale=1920:-2:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 78 -preset picture -an "desktop/<scene>/frame_%04d.webp"
```

Mobile extraction template:

```powershell
ffmpeg -i process-master.mov -ss <segment-start> -to <segment-end> -vf "fps=<scene-fps>,scale=1280:-2:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 74 -preset picture -an "mobile/<scene>/frame_%04d.webp"
```

These quality values are starting points, not fixed truth. Each sequence should be visually checked at actual display size. Paper linework, thin black window frames, stone texture, and the material-growth edge are the most likely to show compression damage.

The local FFmpeg installation exposes the `libwebp` encoder, so this pipeline is available when the master film exists.

### Frame manifest

The extraction stage should produce a manifest containing, for each sequence:

- Sequence ID.
- Desktop and mobile directory.
- Frame count.
- Width and height.
- Scroll start and end progress.
- First and last frame URL.
- Whether the boundary frame is shared with the previous sequence.
- Optional preload priority.

The future website implementation should consume this data from a dedicated data file rather than hardcoding it inside a component.

### Performance budgets

- Initial poster plus S01 compressed payload: target no more than approximately 2–3 MB on desktop and 1–1.5 MB on mobile.
- Only the current sequence is required before it becomes active.
- The next sequence may preload only after the current sequence is ready.
- Decoded-frame window: begin with 6 frames total on mobile and 8 frames total on desktop, then measure.
- Canvas backing resolution must follow the selected tier, not device pixel ratio without a cap.
- If the complete WebP payload remains too large after scene-specific sampling, reduce nearly static scene rates before reducing image quality.

### Seek-optimized video as the fallback

Best when:

- Payload efficiency matters more than frame-perfect seeking.
- Encoding can use frequent keyframes/short GOPs.
- Browser testing confirms smooth reverse and forward seeking.

Risk:

- Seeking can lag or land on neighboring decoded frames, especially on mobile.

### Delivery recommendation

Build the first delivery prototype with segmented WebP frames for S01–S05. Create a seek-optimized video prototype only as a comparison/fallback. Keep Lottie for true vector overlays only.

---

## 15. ScrollTrigger behavior specification

This section defines behavior, not implementation code.

- The film occupies one pinned viewport-height stage.
- Scroll progress drives one top-level master playhead.
- Runtime playhead mapping is linear.
- Numeric scrub smoothing should be subtle and tested, not assumed.
- Each film segment maps to a labeled master range.
- Active media segments are lazy-loaded around the current range.
- Text overlays are synchronized independently but use the same master progress.
- Text may ease in/out visually, while the media playhead remains linear.
- Dynamic layout/media loading must be followed by a ScrollTrigger refresh during implementation.
- The pinned container should remain stable; animate content inside it.
- The experience must reverse cleanly when the user scrolls upward.
- No autoplay-only action may be required to understand the story.

### Reduced motion

For `prefers-reduced-motion`:

- Do not pin a very long scrub sequence.
- Show four or five approved still states: table, plan, wireframe, interior, exterior.
- Pair each still with the same semantic service copy.
- Use no camera travel and no liquid propagation.
- A short opacity transition may be used only if the user has not requested all motion removed.
- Preserve the complete story and information hierarchy.

### Mobile

- Do not assume a desktop 16:9 crop will remain legible.
- Prefer a dedicated mobile crop or alternate keyframe set.
- Reduce scroll length.
- Use fewer frames or a lower-resolution tier.
- Avoid keeping the plan's important rooms under browser UI/safe-area edges.
- Test low-memory devices before choosing the final sequence format.

---

## 16. Quality-control gates

### 16.1 Geometry gate

- Overlay the top view of the 3D/blockout state on the source drawing.
- Check every exterior wall and internal partition.
- Check every opening.
- Check every furniture footprint and orientation.
- Check the central entrance and level changes.
- Reject the frame if an architectural element has moved, even if the image is aesthetically better.

### 16.2 Camera gate

- Start/end frames share a believable single path.
- Horizon/vanishing points do not jump.
- Lens character remains stable.
- The target point does not drift across rooms unintentionally.
- The camera never intersects walls, furniture, paper, or roof planes.

### 16.3 Temporal gate

- No accidental shot cut.
- No line crawling or redraw flicker.
- No texture boiling.
- No exposure or white-balance shift.
- No furniture deformation.
- No object appears for one frame and disappears.
- Forward and reverse scrub both read logically.

### 16.4 Material gate

- Oak remains light and matte.
- White surfaces remain warm-neutral, not yellow or blue.
- Gray textiles remain light and restrained.
- Stone is pale and natural.
- Black fixtures stay minimal and do not multiply.
- Liquid reveal changes only material, never geometry.

### 16.5 Exterior gate

- Roof massing matches the renders.
- Stone/plaster/panel placement matches the renders.
- Entrance door and canopy match.
- Black frames/railings/edges match.
- Landscape remains consistent with the project.
- Final frame is the approved render or a controlled extension of it.

### 16.6 Boundary-frame gate

- The last frame of one segment is pixel-identical to the first frame of the next.
- No color-grade, crop, scale, or compression difference at the boundary.
- The stitched master contains no duplicated-motion jump.

---

## 17. Main risks and controls

| Risk | Likely symptom | Control |
|---|---|---|
| AI redraws the plan | Walls/openings shift | Use traced linework and deterministic 3D base |
| Independent keyframes drift | Furniture and camera change | Derive each frame from one rig/previous approved state |
| Start/end frames differ too much | Kling inserts a cut | Use more, shorter clips with similar boundary frames |
| Plan linework crawls | Technical drawing flickers | Re-composite exact vector/raster line pass in post |
| Furniture melts during growth | Changing topology | Complete clay geometry first; material pass second |
| Liquid effect feels fantastical | Blob/paint commercial look | Restrict to surface-bound capillary fronts and matte dry-down |
| Camera becomes disorienting | Sudden tilt/orbit/lens shift | One primary move per clip; locked lens family |
| Final house becomes generic | Wrong façade/materials | Use real render as final anchor and reference exterior passes |
| Lottie becomes enormous or fails | Heavy JSON/assets, missing effects | Use raster master; reserve Lottie for vector overlays |
| Scroll seeking stutters | Delayed or skipped frames | Test segmented image sequence vs. short-GOP video |
| Mobile payload is excessive | Long blank loading or crashes | Separate mobile tier, lazy scene loading, fewer frames |
| Reduced-motion users lose content | Empty or incomplete section | Provide still-state narrative with semantic copy |

---

## 18. Production phases

### Phase 0 — Source lock

Required before frame generation:

- Confirm the supplied project description as final approved copy.
- Add project area, plot size, and other technical facts if they are intended to appear in the experience.
- Obtain CAD/PDF/DWG if available.
- Confirm room names and intended use.
- Confirm wall/ceiling heights.
- Confirm window and door heights.
- Confirm furniture footprints and any ambiguous plan symbols.
- Confirm the final exterior hero image.
- Confirm the service order and visible copy language.

**Gate:** No technical 3D keyframes until these are approved.

### Phase 1 — Visual language test

Create only three opening-table directions:

1. Pale limestone table / warm gray floor.
2. Off-white mineral table / slightly darker microcement floor.
3. Very light oak table / mineral floor, only if it still feels aligned with the project.

All three use the same folded white plan and object count.

**Gate:** Approve one palette, light direction, paper character, and lens.

### Phase 2 — Geometry and camera master

- Clean/vectorize plan.
- Build paper fold geometry.
- Build the villa shell and openings.
- Block the exact furniture footprints.
- Establish K00–K13 camera rig.
- Create clay renders and source overlays.

**Gate:** Plan-overlay approval and camera-path approval.

### Phase 3 — High-risk motion tests

Test only:

- S03/S04 paper unfold.
- S05 dephysicalization wave.
- S07 plan-to-wall growth.
- S09 material propagation.

These are the most likely to reveal whether Kling is suitable for the intended finish.

**Gate:** Each test must pass forward and reverse scrub review.

### Phase 4 — Final keyframes

- Complete all 14 frames.
- Apply final Scandinavian interior direction.
- Match the real exterior.
- Approve all geometry/material/camera gates.

### Phase 5 — Kling generation

- Generate one short passage at a time.
- Prefer 5-second controlled transitions even if longer model durations are available.
- Produce multiple candidates for high-risk passages.
- Do not extend a failed clip; fix its frames or prompt and regenerate.

### Phase 6 — Composite and grade

- Stitch with exact boundary frames.
- Restore technical linework where needed.
- Remove flicker and exposure drift.
- Normalize crop, scale, and color.
- Add optional vector overlays separately.
- Create the final master and segment map.

### Phase 7 — Delivery test

- Extract scene-specific desktop and mobile WebP sequences with FFmpeg.
- Generate and validate the sequence manifest.
- Prototype S01–S05 as the primary segmented WebP/canvas delivery.
- Compare against seek-optimized video only as a fallback benchmark.
- Measure load, decode, memory, and scrub performance.
- Test desktop mouse wheel, trackpad, touch, rapid reverse, resize, and route re-entry.
- Test reduced motion.
- Tune sampling per sequence before lowering visual quality.
- Confirm the final delivery format after device testing.

---

## 19. Approval checklist before generating the first frame

- [x] `project-explanation.txt` contains the approved descriptive project text.
- [ ] Project dimensions and other technical facts are supplied if they will appear in captions or prompts.
- [ ] CAD/PDF/DWG or the best available technical source has been supplied.
- [ ] Room names are confirmed.
- [ ] The four-service narrative and order are approved.
- [ ] White paper / black ink is approved as the permanent drawing language.
- [ ] The exact table material is chosen.
- [ ] The supporting object set is chosen.
- [ ] `Visualizations/1.png` is approved as the ending composition, or another render is named.
- [ ] The bottom-left camera interpretation is approved.
- [ ] The proposed Scandinavian interior is explicitly understood as a design proposal.
- [ ] The Lottie/raster split is accepted.
- [ ] Desktop and mobile aspect-ratio strategies are defined.

---

## 20. Recommended immediate next discussion

The next discussion should approve only five decisions, in this order:

1. **Story order:** Consultant → Architecture → Interior Design → 3D Visualization, or the current website order.
2. **Opening world:** exact table material, room background, object set, and daylight direction.
3. **Plan representation:** which annotations remain visible after the drawing is converted to white paper/black ink.
4. **Hero camera:** confirm the southwest/bottom-left camera position looking across the living zone.
5. **Final exterior:** choose the exact supplied render that K13 must match.

Only after those five decisions should K00, K02, K04, K05, K07, K10, and K13 be designed as the first “spine frames.” The intermediate frames can then be derived from them.

---

## 21. Current official product references

These links were checked for the production recommendation as of 14 July 2026:

- [OpenAI — Images in ChatGPT](https://help.openai.com/en/articles/11084440-images-in-chatgpt): generation, uploaded-image editing, selected-area editing, and aspect-ratio controls.
- [Kling AI — Start and End Frames](https://home.kling.ai/quickstart/ai-video-start-end-frames): start/end frame workflow and the recommendation to keep boundary images similar for smooth short transitions.
- [Kling AI — VIDEO 3.0 Model User Guide](https://kling.ai/quickstart/klingai-video-3-model-user-guide): current image-to-video, start/end-frame, reference, and duration capabilities.
- [LottieFiles — Supported After Effects Features](https://help.lottiefiles.com/supported-after-effects-features): current limitations around 3D layers, cameras, lights, and complex effects.
- [GSAP — ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): scrub, pin, progress mapping, responsive behavior, refresh, and lifecycle guidance.

---

## Final principle

The film should never ask the viewer to admire an effect at the expense of believing the architecture.

The transformation is successful when the final villa feels as though it was always latent inside the folded black-line drawing: consultation gives it direction, architecture gives it order, interior design gives it inhabitable character, and visualization gives it atmosphere.
