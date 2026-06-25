# Typography — Lagom Arkitektur

## Primary font

**Satoshi** — premium grotesk sans-serif.

Satoshi is used for all text: headings, body copy, navigation, buttons, project cards, and forms.

## Font file

The `.woff2` file should be placed at:

```
src/assets/fonts/Satoshi-Variable.woff2
```

Once the file exists, uncomment the `@font-face` block in `src/styles/globals.css`.

## Fallback stack

```
"Geist", "Helvetica Neue", Arial, sans-serif
```

The stack degrades gracefully through Geist → Helvetica Neue → system sans-serif until the local Satoshi file is added.

## Tailwind font classes

| Class         | Maps to                        |
|---------------|--------------------------------|
| `font-sans`   | Satoshi → Geist → ... → sans   |
| `font-display`| Satoshi → Geist → ... → sans   |
| `font-body`   | Satoshi → Geist → ... → sans   |

All three point to the same grotesk system. `font-display` exists for semantic clarity on editorial headings.

## Where configured

All font settings are centralized in `src/styles/globals.css` under `@theme`.

The body element inherits `var(--font-sans)` by default. No per-element font classes are needed for normal text.

## Replacing Satoshi later

To switch to a different premium font:

1. Place the new `.woff2` file in `src/assets/fonts/`.
2. Update the `@font-face` family name in `globals.css`.
3. Update `--font-sans`, `--font-display`, `--font-body` in the `@theme` block.

No component code needs to change.
