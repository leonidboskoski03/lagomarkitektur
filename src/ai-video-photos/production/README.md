# Production Asset Guide

This folder contains generated and processed assets. Create subfolders only when work reaches that stage; do not populate the repository with empty candidate structures.

Operational documentation starts at [docs/00_INDEX.md](../docs/00_INDEX.md).

## Planned structure

```text
production/
  keyframes/
    K00-table-wide/
      references/
      candidates/
      approved/
      notes.md
    ...
    K13-exterior-hero/
  kling-clips/
    S01-arrival/
      candidates/
      approved/
    ...
  composite/
    project-files/
    review-exports/
  master/
    process-master.mov
  web/
    desktop/
    mobile/
    manifest.json
    poster.webp
```

## Asset rules

- Original project sources remain outside `production/` and are never overwritten.
- Candidate files are immutable.
- Never use `final`, `final-final`, `new`, or `latest` in filenames.
- Use zero-padded versions: `v001`, `v002`, `v003`.
- Approved files retain the candidate version that was approved.
- Boundary-frame files are shared, not regenerated.
- Keep editable masters and web delivery assets separate.
- Web frames are generated only from the approved composite master.
- Do not commit temporary caches, proxy renders, or failed FFmpeg tests.

## Naming examples

```text
K00_v001_limestone-table.png
K00_v002_mineral-table.png
K00_v003_light-oak-table.png

S03_v001_horizontal-unfold.mp4
S03_v002_horizontal-unfold_less-settle.mp4

process-master_v001_review.mp4
process-master_v002_approved.mov

frame_0001.webp
frame_0002.webp
```

## Notes files

Each active keyframe folder may contain `notes.md` with:

- Prompt version.
- References.
- Edit history.
- Candidate table.
- QA result.
- Approval filename/date.

Each active sequence uses its authoritative card under `docs/sequences/`; avoid maintaining a second detailed sequence log in the asset folder.

## Current state

Phase 3 motion testing is active. `S03_v001_horizontal-unfold.mp4` is preserved but rejected for paper translation, recentering, and booklet-like articulation. `K02_v004_hinge-aligned-right-half.png` remains an immutable superseded review candidate. Exact user-supplied `K02_v005_user-approved-hinge-aligned-right-half.png` is byte-identical in `candidates/` and `approved/` with SHA-256 `FBBD9F5A24A4E597D0B666424769C6C604815CE732DA82C896E5337DAED25468`. `S03_v002_horizontal-unfold_hinge-locked.mp4` is approved and locked byte-for-byte in `candidates/` and `approved/` with SHA-256 `1991BCC24A09D97F90B52E9077527B319B0B69EF4F6AD4294326D2BC1577282C`. It materially corrects v001's whole-sheet translation; its QA loop and contact sheets remain under `kling-clips/S03-horizontal-unfold/review/S03_v002/`. S05 enter-drawing is the active next phase.

K01 camera-boundary registration is complete. `K01_v002_hinge-aligned-approach.png` is byte-identical in `candidates/` and `approved/` at 1672 × 941 with SHA-256 `268F9056C7D137CBD2220687DEA8DE164A61D5E6F2957BADD632ECFE667FB520`. It was derived from K01 v001 with approved K02 v005 used only to set the folded packet's corrected physical tabletop anchor. K02 v005 is unchanged. K01 v001 remains immutable as historical provenance; one paid S02 v001 camera-only test is authorized.

`S02_v001_crane-to-plan.mp4` is complete and preserved as an immutable review candidate. Kling 3.0 Omni produced one 5.041667-second 1920 × 1080 H.264 clip at 24 fps for 40 credits; SHA-256 `03CACCD7222A10B6C294334401CD6298C3D74D897D2189E78E6828FC7587B919`. The camera motion is coherent, the paper stays blank/closed, and no cut is visible, but the delivered final camera remains oblique instead of reaching exact approved K02 v005 bird's-eye geometry. Contact-sheet and forward/reverse review assets are under `kling-clips/S02-crane-to-plan/review/S02_v001/`. The candidate is not approved and no retry is authorized automatically.

The exact clean S02A tail was extracted as `bridge/approved/K01_5_v001_exact-S02A-clean-tail.png` and used for one authorized three-second S02B continuation to approved K02. `S02B_v001_bridge-to-bird-pov.mp4` consumed 24 credits and is preserved with SHA-256 `70571B22228AA6936B5AAB91D6FB0DC60030C8787C2B46A8A7BF5838D877C0AF`. The split idea is structurally sound, but Kling re-rendered the bridge at a closer crop: seam SSIM is `0.781007`, and endpoint SSIM against K02 is `0.754342`. The clean eight-second combined review visibly jumps at the A→B join. S02B is rejected as a seamless assembly candidate; no further generation is authorized automatically.

S02 is now approved and closed through user-supplied `S02B_v002_user-5s.mp4`, preserved byte-identically in candidates and approved with SHA-256 `A35748787DBDF8CDBF46BFD4B553C5F2794DCBEF94DEBB1CBD8CB6C79297E2A2`. Its opening SSIM against the exact S02A clean tail is `0.977735`, and its endpoint SSIM against approved K02 v005 is `0.922653`. The authoritative clean master is `approved/S02_v002_split-camera-to-bird-pov.mp4`: 1920 × 1080 H.264, 24 fps, 10.041667 seconds, 241 frames, SHA-256 `00630193BC406BF12DE04FFD6ECD7541E1E96184CFB6169760DAE5C70187E3FA`. Encoded seam SSIM is `0.936875`; encoded endpoint SSIM is `0.918426`. Contact-sheet and forward/reverse QA assets live under `review/S02_v002/`. S02B v001 remains preserved but rejected. S03 v002 is now approved and closed; S05 is the active review phase.

`S05_v001_enter-drawing.mp4` is complete and preserved as an immutable review candidate with SHA-256 `D3C379120165C1BE55709C2CA30F87751E7E6E2177450AE0674559629CCF1ACC`. Kling 3.0 Omni produced one 5.041667-second 1920 × 1080 H.264 clip at 24 fps for 40 credits. The centered push and physical-to-flat transition are coherent, but the middle briefly strengthens the floating paper edge/drop shadow and the delivered end-plan footprint is horizontally wider than approved K05. Endpoint comparison and forward/reverse QA assets live under `kling-clips/S05-enter-drawing/review/S05_v001/`. The candidate is not approved and no retry is authorized automatically.

The user-supplied `S05A_v003_user-approved-camera-push.mp4` is now the approved S05 camera-push segment. Its candidate and approved copies are byte-identical to the upload with SHA-256 `4D3B71161C596E1D5F33472DFD10DF6361AB2189BCE6CAE673098AE5291FDD3B`; H.264, 1920 × 1080, 24 fps, 193 frames, 8.041667 seconds. S05C v001 remains the intended paper-to-blueprint continuation, but the complete joined S05 is not approved until its opening is registered to the exact S05A tail and the handoff passes review.

`S05_v003_registered-microblend.mp4` is the active complete S05 review candidate. It registers S05C to the approved S05A tail, eases the correction back to native S05C geometry, and uses a two-frame micro-blend. It is H.264, 1920 × 1080, 24 fps, 264 frames, 11 seconds, with SHA-256 `C71430C2587DF47F54E188C9A24737755A50ADCB532A12FAB818DB45B8302934`. The six-frame S05 v002 test remains preserved but superseded for visible line softening. S05 v003 is not approved until user review.

S05 v003 is now approved and locked byte-for-byte in candidates and approved with the same SHA-256 `C71430C2587DF47F54E188C9A24737755A50ADCB532A12FAB818DB45B8302934`. S05 is closed. S07 v001 was generated with Kling 3.0 Omni and preserved at `kling-clips/S07-structure-growth/candidates/S07_v001_locked-camera-structure-growth.mp4`, but it is rejected because it begins with the raised 3D state instead of the approved flat K06 plan. `K06-5_v001_low-wall-intermediate.png` is approved byte-for-byte in candidates and approved at 1680 x 945 with SHA-256 `92CED813A3927A1367AEE7BD71D7A67A250E33658761111D4937DCB82F1FBB41`. `S07A_v001_flat-plan-to-low-walls_kling.mp4` is approved and locked byte-for-byte in candidates and approved with SHA-256 `4E5230A4B29C4558971542AADC660E9DCE630C7A230091E913E59CA8A0222C92`. `S07B_v001_low-walls-to-complete-clay_kling.mp4` is rejected and preserved with SHA-256 `594EC1543FA13090BFA9BA3AE8CE20F8858A8DECADBEEE02CA267136009C7DE2`; it preloads the 3D endpoint and invents a false raised courtyard perimeter. `K06-75_v001_full-shell-flat-furniture.png` is approved and byte-locked in candidates and approved at 1680 x 945 with SHA-256 `48C447C38873826C3ED3EFC5BC86E0125C5BF3A0F07A42473EBD9B34C1F35F71`. `S07B1_v001_low-walls-to-full-shell_kling.mp4` is rejected and preserved with SHA-256 `6B23C7A8A13B0BCD620246588294108BE7775DB9AF017CFDF04AB31341B42608`; it changes the camera, raises furniture, invents a false right/bottom courtyard perimeter, and fails both approved endpoints. `K06-625_v002_lower-camera-matched-walls.png` is the active K06.625 review candidate at 1680 x 945 with SHA-256 `5FE6B7477F2C0AD8C72177E55BC148DA3DB5F4C98BEE4B7BCEA2CF75F726D437`. S07B1A, S07B1B and S07B2 remain blocked pending approval and QA.

All K00–K13 boundary states are approved; K04 is an exact alias of K03 v008 and has no separate asset. `K01_v001_medium-high-approach.png` closes the last deferred boundary between K00 and K02; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `ECCE98F9018356C88DFAA15487A63D706ACBE1D5BA2C1DB1FFB2784DF5461166`. `K07_v030_user-approved-clean-wireframe.png` is a user-supplied clean replacement, normalized proportionally from 1672 × 941 to 1680 × 945 with no crop or visual edit; the candidate and approved copies are identical. `K08_v001_targeted-white-clay-volume.png` derives from K07 v030 and targets only under-resolved bathroom fixtures, bedroom storage, flexible-office furniture/storage, and shallow fixed details. Its candidate and approved copies are identical. `K09_v007_clean-single-pass-rebuild.png` is the exact approved K09 boundary; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `F75A8B5DFEF711124050772BE871599DCF21063FE24E12C28FFA88EED963B600`. `K10_v001_finished-interior-atmosphere.png` is the exact approved K10 boundary; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `A743B39A9599496F2E30DFE077221FD1A54F1CF1519CFF52BEE74C87541910CD`. K11 v001–v003 are rejected/superseded axonometric roof attempts and K11 v004 is rejected because it reused the final render too early. `K11_v005_courtyard-model-view.png` is the exact approved K11 boundary; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `7DCAFB193A2FB1CB62BC705FB109583BFBC9DF0B6696E08A63739CFCCB624DE3`. `K12_v001_near-final-courtyard.png` is the exact approved K12 boundary; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `D46EEE38D0727A5DDE123B01B892EC473FCEFF05D020A166B30C515DA2FD10EC`. `K13_v001_visualization-1-hero.png` is the exact approved K13 boundary; its candidate and approved copies are byte-identical at 1680 × 945 with SHA-256 `8BC8EA7056841803E22309FD310166E0D2FB3BF1DCFB788FDD06D6721E791441`.
