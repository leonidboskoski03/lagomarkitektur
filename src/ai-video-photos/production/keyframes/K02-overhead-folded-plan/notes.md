# K02 — Near-Overhead Folded Plan Candidate Log

## Frame contract

- Frame: K02 — near-overhead folded plan.
- Previous approved spine frame: `K00_v008_mineral-table_large-paper.png`.
- Status: K02 v005 approved by the user on 2026-07-16 as the motion-safe S03 start; K02 v003 remains retained as the original approved visual boundary.
- Purpose: establish the bird's-eye paper system before any unfolding.
- Camera: near-overhead, approximately 45–55 mm full-frame equivalent, nearly orthographic and low distortion.
- Paper state: completely folded compact packet; no panel has begun unfolding.
- Drawing state: completely hidden. The visible outer face is blank; the canonical plan is printed on the concealed inner face.
- Next state: K03 unfolds once horizontally into the complete physical plan; K04 is an exact K03 alias.
- Motion-safe boundary note: v004 remains a superseded review candidate. Exact user-supplied v005 is the approved S03 motion boundary and moves only the folded packet onto K03's stationary right half.

## Source references

- `K00_v008_mineral-table_large-paper.png` — approved environment, large blank folded paper, four supporting objects, lighting, and sole visual continuity source.
- `architectural-blueprint-drawing.jpg` — canonical plan content and spatial organization.
- `docs/03_CAMERA_AND_MOTION_SYSTEM.md` — K02 camera and unfold-axis rules.
- `docs/01_PROJECT_SOURCE_LOCK.md` — geometry authority and plan orientation.

## Deterministic drawing requirement

K02 contains no visible plan linework. Before K03/K04 production:

1. Clean the canonical plan to black and neutral gray.
2. Remove or restyle red axes and green landscape marks.
3. Center the complete plan on the conceptual full sheet.
4. Map the central band only onto the inner panels exposed by K03.
5. Keep the complete concealed plan registered across every hidden fold so K03 and K04 reveal the same drawing continuously.

## Candidate prompt v001

```text
Frame ID: K02
Previous approved frame: K00_v005_mineral-table.png
Frame purpose: near-overhead bird's-eye view of the completely folded architectural plan before unfolding.
Only permitted change: crane/tilt the approved camera into the near-overhead state and enlarge the central folded plan through camera proximity; preserve the world and objects.
Camera position and lens: centered above the table, near-vertical, 45–55 mm full-frame equivalent, nearly orthographic, no fisheye.
Exact locked objects: warm off-white mineral-composite round table; central compact folded white architectural sheet; pale stone sample; light-oak sample; folded light-gray linen; matte-black strip/ruler; black mechanical pencil.
Drawing rule: show only a small central crop of the canonical black/gray plan on the upper folded face. The full drawing remains hidden inside the closed folds.
Material/light state: unchanged from approved K00; broad diffused daylight from upper left.
Required output dimensions: 1680 × 945, 16:9.
Negative constraints: no unfolding, open panels, full plan, colored axes, generated labels, people, hands, new objects, camera roll, fisheye, fantasy effects, or material drift.
```

## Candidates

| Version | Date | Prompt change | What worked | Failure | Decision |
|---|---|---|---|---|---|
| K02_v001 | 2026-07-14 | First near-overhead derivation from approved K00 mineral world | Camera, table, object layout, and top-down continuity work | Drawing is visible before the intended reveal | Rejected |
| K02_v002 | 2026-07-14 | Blank-paper correction derived from v001 | Correct concealed-drawing state | Uses superseded small-paper and five-object layout | Superseded |
| K02_v003 | 2026-07-14 | Fresh near-overhead camera derivation from approved K00 v008 | Near-overhead table read, large blank paper, and simplified architectural object set retained | None at boundary review | Approved |
| K02_v004 | 2026-07-16 | Hinge-align the folded packet to the exact right half of approved K03 after S03 v001 translation review | Left edge follows K03's central crease; top, bottom, and right edges follow the fixed right half; exact K02 pixels preserved outside the central paper edit ROI | Awaiting user boundary review | Candidate only; not approved |
| K02_v005 | 2026-07-16 | Preserve the exact user-supplied hinge-aligned export | User explicitly confirmed the opening analysis and visual result are correct; candidate and approved copies are byte-identical | None at user review | Approved for S03 v002 start |

### K02 v005 approval record

- Candidate: `candidates/K02_v005_user-approved-hinge-aligned-right-half.png`.
- Approved: `approved/K02_v005_user-approved-hinge-aligned-right-half.png`.
- SHA-256: `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`.
- Dimensions: 1672 × 941.
- Provenance: exact bytes copied from the user-supplied `Generated image 1 (1).png`; no edit, resize, crop, recompression, or overwrite.
- Approval: explicitly approved by the user on 2026-07-16 for the corrected S03 start boundary.

## Candidate prompt v004 — Hinge-aligned right half

```text
Use case: precise-object-edit
Asset type: L-28 process-film K02 motion-safe boundary candidate
Input images: Image 1 is approved K02 v003 and the edit target. Image 2 is approved K03 v008 and a registration reference only.
Edit only the blank folded paper. Its footprint must occupy exactly K03's right half: the left edge coincides with K03's central vertical crease, while top, bottom, and right edges coincide with the stationary right-half sheet edges. Preserve the exact K02 camera, table, lighting, samples, ruler, pencil, shadows, materials, and blank exterior paper face. The packet is not centered independently. No plan ink, booklet spine, extra page, extra fold, recentering, translation, object drift, text, logo, or watermark.
```

### K02 v004 registration record

- Candidate: `candidates/K02_v004_hinge-aligned-right-half.png`.
- SHA-256: `FE8A084B6E942E189545E88CFD934FA27518D5138263154059334F8169DE061D`.
- Dimensions: 1672 × 941.
- Measured K03 hinge: `(831, 299)` to `(831, 634)`.
- Measured K03 right edge: `(1052, 300)` to `(1054, 634)`.
- Fixed-half top/bottom widths: 221/223 px; the two-pixel difference preserves K03's slight perspective taper.
- Pixel-preservation QA: zero changed pixels outside the central paper-relocation edit ROI.
- Approval: Pending user review. Do not copy to `approved/` and do not generate S03 v002 automatically.

## Candidate prompt v002 — Concealed drawing

```text
Edit only the visible upper face of the folded white paper at the exact center. Remove all architectural linework and make the entire visible outer face completely blank natural-white paper. Preserve the compact closed folded construction, position, dimensions, orientation, fine paper fiber, folded edges, relief, and contact shadow. Preserve every other pixel-level aspect of K02 v001 exactly.
```

## Approval

- Approved motion filename: `K02_v005_user-approved-hinge-aligned-right-half.png`
- Retained original filename: `K02_v003_overhead-large-paper.png`
- Motion-boundary dimensions: 1672 × 941 (16:9)
- Approved by: user
- Approval date: 2026-07-16
- Geometry QA: not yet applicable to hidden plan content; outer paper remains blank.
- Visual QA: passed for overhead camera, table continuity, paper scale, four-object system, lighting, and concealed-drawing state.
- Neighbor dependencies: v005 is the exact S03 v002 start; unchanged K03 v008 is its end. v003 remains the retained S02 visual boundary.

## Candidate prompt v003 — Near-overhead camera from approved composition

```text
Use case: precise-object-edit
Asset type: K02 near-overhead boundary keyframe for a scroll-driven architectural process film
Input images: Image 1 is approved K00 v008 and the sole continuity source.

Move only the virtual camera from the wide three-quarter opening view into a centered near-overhead bird's-eye view of the same unchanged scene. Use a near-vertical 45–55 mm full-frame-equivalent camera with nearly orthographic perspective, no camera roll, and no fisheye. Let the round warm off-white mineral-composite table fill most of the 16:9 frame, leaving a restrained perimeter of the same studio floor.

Preserve the exact tabletop composition and identities: one large central natural-white architectural sheet folded closed into an approximately A3 packet; one thin pale-limestone façade sample at upper left; one thin light-oak veneer sample at lower left; one matte-black architectural ruler with restrained ticks at right; and one black mechanical pencil at lower right. Keep their relative spatial relationships and material identity. There is no linen and no replacement object.

The folded paper's visible outer face must remain completely blank. Do not show plan linework, marks, labels, symbols, text, colored axes, unfolding, open panels, or an interior sheet. The plan remains fully concealed until K03. Preserve broad diffused upper-left daylight, calm Scandinavian mineral palette, realistic contact shadows, and tactile material fidelity.

Change nothing except the camera position and the perspective naturally produced by that move. No people, hands, new objects, deleted objects, duplicated objects, object redesign, clutter, villa model, fantasy effects, dramatic lighting, depth-of-field blur, or watermark.
```
