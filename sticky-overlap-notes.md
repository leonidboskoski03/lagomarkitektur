# Sticky Overlap Hero — CSS-Only Overlap Technique

## How it works

### 1. Scroll distance (`h-[200vh]`)
The hero wrapper is twice the viewport height. This forces the browser to allocate enough scroll space so the sticky image stays visible while the user scrolls past the first viewport.

### 2. Sticky image (`sticky top-0 h-screen`)
Inside the tall wrapper, the image container uses `position: sticky; top: 0`. It stays locked at the top of the viewport as the user scrolls. The image behaves like a fixed background but stays inside the normal document flow.

### 3. Negative margin (`-mt-[35vh]`)
The next section has a negative margin equal to 35% of the viewport height. This pulls it upward, causing it to overlap the bottom of the sticky image region. On mobile the overlap is reduced to 20vh for better readability.

### 4. Z-index stacking
The overlapping section uses `z-[2]` while the hero section uses `z-[1]`. This ensures the content renders on top of the image.

### 5. Solid background
The overlapping section has a solid background (`bg-bg`). As the user scrolls, this background physically covers the sticky image beneath. Without it, the image would show through.

### 6. Gradient overlay
A subtle `bg-gradient-to-b from-transparent via-transparent to-black/40` on the image wrapper softens the transition, so the content section slides over a slightly darker edge rather than cutting hard against the photograph.

## Why no GSAP

The entire overlap is a pure CSS layout technique. Sticky positioning, z-index, negative margin, and background layering are all native CSS behaviours.

GSAP *can* be added later for polish:
- `gsap.fromTo` the image with `scale: 1.1 -> 1` for a slow cinematic zoom on load
- `gsap.from` the heading/text with `y: 30, opacity: 0` triggered by ScrollTrigger
- But these are enhancements, not the mechanism—the overlap works without JavaScript

## Adjusting overlap strength

| Variable | Effect | Typical range |
|----------|--------|----------------|
| `h-[200vh]` | How long the image stays fixed | `150vh` (shorter) to `250vh` (longer) |
| `-mt-[35vh]` | How much overlap | `-mt-[20vh]` (subtle) to `-mt-[50vh]` (dramatic) |

Increase `-mt-[...]` = more overlap, image disappears sooner.
Increase `h-[...vh]` = image stays visible longer.

## Responsive behaviour

- Mobile: `-mt-[20vh]` — less overlap so the heading stays comfortably positioned
- Tablet/desktop: `-mt-[35vh]` — the full editorial overlap effect

## Known limitations

- The `200vh` wrapper always occupies space in the document flow, which means the total page height includes this section. This is by design.
- On very short viewports (under 600px), the heading may need more vertical space — the `min-h-screen` on the content section guarantees it.
