# AGENTS.md — Lagom Arkitektur

## Code standards

- Always use TypeScript.
- Keep components small and reusable.
- Do not hardcode project content inside components.
- Put project content inside `src/data/projects.ts`.
- Build components as if data will later come from Sanity.
- Avoid unnecessary libraries.
- Prefer CSS/Tailwind for layout and GSAP only for animation.
- Use Motion for simple page/component transitions.
- Use GSAP for scroll-based and timeline-based animations.
- Respect `prefers-reduced-motion`.
- Keep performance high.
- Never load all large project images at once.
- Use semantic HTML.
- Use accessible buttons, links, labels and alt text.
- Do not copy reference websites directly.
- Keep the visual direction premium, calm and architectural.
- Test `npm run build` before finishing each major phase.
