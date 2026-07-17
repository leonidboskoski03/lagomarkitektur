# Postproduction and Web Delivery

This document owns everything after Kling candidate approval: compositing, master export, FFmpeg extraction, WebP organization, manifest data, ScrollTrigger behavior, and performance.

## Composite order

1. Place approved clips on one master timeline.
2. Confirm exact boundary-frame identity.
3. Remove duplicated or missing boundary frames.
4. Restore exact plan/wireframe passes where AI linework crawls.
5. Correct flicker, exposure, and white-balance drift.
6. Normalize crop, scale, and color.
7. Apply one restrained final grade.
8. Export a high-quality mezzanine master.

Optional vector linework and HTML copy remain separate from the photorealistic master.

## Master outputs

- Archival/editing master: 3840 × 2160 if source quality supports it.
- Frame rate: preserve the approved composite timeline.
- Codec: ProRes or another visually lossless mezzanine format.
- No baked service copy.
- No Lottie conversion of the raster master.

## Primary web delivery

Use scene-based lossy WebP frames extracted from the approved master.

```text
production/web/
  desktop/
    s01-arrival/
    ...
    s13-exterior/
  mobile/
    s01-arrival/
    ...
    s13-exterior/
  manifest.json
  poster.webp
```

Frames use zero padding:

```text
frame_0001.webp
frame_0002.webp
```

## Adaptive extraction rates

| Sequence | Rate |
|---|---:|
| S01 | 6 fps |
| S02 | 8 fps |
| S03 | 12 fps |
| S04 | 12 fps |
| S05 | 12 fps |
| S06 | 8 fps |
| S07 | 15 fps |
| S08 | 12 fps |
| S09 | 15 fps |
| S10 | 8 fps |
| S11 | 12 fps |
| S12 | 12 fps |
| S13 | 6 fps |

At five seconds per source passage, the initial target is approximately 690 browser frames. Static holds reuse a frame through progress mapping.

## FFmpeg templates

Desktop:

```powershell
ffmpeg -i process-master.mov -ss <segment-start> -to <segment-end> -vf "fps=<scene-fps>,scale=1920:-2:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 78 -preset picture -an "desktop/<scene>/frame_%04d.webp"
```

Mobile:

```powershell
ffmpeg -i process-master.mov -ss <segment-start> -to <segment-end> -vf "fps=<scene-fps>,scale=1280:-2:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 74 -preset picture -an "mobile/<scene>/frame_%04d.webp"
```

Quality values are starting points. Inspect paper linework, black frames, stone, and material-growth edges at display size.

## Manifest ownership

The machine-readable manifest belongs in JSON/TypeScript later, not Markdown. It contains:

- Sequence ID.
- Desktop/mobile base path.
- Frame count.
- Width/height.
- Scroll start/end.
- Boundary-frame relationship.
- Poster/first/last URLs.
- Preload priority.

Website components consume data rather than hardcoding project sequence content.

## Runtime loading

- Load poster and S01 first.
- Network-preload active sequence; preload the next only after active is ready.
- Keep a small decoded frame window around the playhead.
- Begin testing with 8 decoded frames desktop and 6 mobile.
- Draw to one canvas and release decoded frames outside the window.
- Never create image elements or bitmaps for all frames.
- Cap canvas backing resolution; do not multiply blindly by device pixel ratio.
- Never ship/load 4K browser frames.

## Performance budgets

- Initial poster + S01: target 2–3 MB desktop and 1–1.5 MB mobile.
- Tune nearly static sequence sampling before reducing image quality.
- Measure network, decode time, memory, and dropped frames.
- Test rapid reverse, trackpad, wheel, touch, resize, and route re-entry.

## ScrollTrigger behavior

- One pinned viewport stage.
- One top-level linear media playhead.
- Scene progress maps to manifest frame ranges.
- Numeric scrub smoothing is subtle and device-tested.
- Copy is semantic HTML synchronized to the same progress.
- Refresh after dynamic media/layout changes.
- Animate inside the pinned container, not the pinned container itself.
- Clean up ScrollTrigger and decoded assets on route unmount.

## Fallback

Create a seek-optimized WebM/MP4 comparison only if:

- WebP payload remains excessive after adaptive sampling.
- Browser seeking passes forward/reverse device testing.
- Memory and responsiveness are materially better.

Lottie remains restricted to vector plan strokes, axes, ticks, or markers.

## Reduced motion

Serve five approved stills with normal document flow and semantic text. Do not preload the complete sequence for users who request reduced motion.

## Delivery gate

- Composite master approved.
- Boundaries pixel-identical.
- Desktop/mobile frame tiers generated.
- Manifest validated.
- Initial payload within target or exception documented.
- Rapid forward/reverse scrub passes.
- Reduced-motion flow passes.
- No large project imagery loads unnecessarily.

