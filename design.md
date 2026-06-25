# Design System — Lagom Arkitektur

## Brand feeling

Scandinavian · architectural · quiet luxury · minimal · editorial · image-led · calm but cinematic · precise · premium · timeless

## Visual direction

- Large whitespace
- Large architectural images
- Strong typography hierarchy
- Thin borders
- Muted neutral palette
- Soft off-white backgrounds
- Deep charcoal text
- Warm grey secondary tones
- Editorial project grids
- Calm page transitions
- No childish gradients
- No generic SaaS look
- No overused glassmorphism
- No random bright colors

## Palette

| Token         | Value     |
|---------------|-----------|
| Background    | `#f4f1ea` |
| Surface       | `#ebe7de` |
| Text primary  | `#171717` |
| Text muted    | `#6f6a60` |
| Border        | `#d8d2c7` |
| Accent dark   | `#2b2a27` |
| Accent warm   | `#9a8f7f` |

## Typography

- **Primary font:** `Satoshi` — premium grotesk sans-serif for all text, headings, and UI
- **Fallback stack:** Geist, Helvetica Neue, Arial, sans-serif
- **Display / headings:** use `font-display` class (maps to same Satoshi stack)
- **Body / UI:** use `font-sans` or `font-body` class (maps to same Satoshi stack)
- Aim for an architecture book or design magazine feel
- Font variables declared in `globals.css`
- TODO: Place `Satoshi-Variable.woff2` in `src/assets/fonts/` and uncomment the `@font-face` block
