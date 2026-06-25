# Animation Rules — Lagom Arkitektur

- Animations must be subtle, premium and intentional.
- Use GSAP ScrollTrigger for scroll reveals, pinned sections, image parallax and project transitions.
- Use Motion for route/page transitions and simple component entrance animations.
- Avoid too many animations running at the same time.
- Always clean up GSAP animations inside React effects.
- Use `gsap.context()` where appropriate.
- Respect `prefers-reduced-motion`.
- Mobile animations should be simpler than desktop animations.
- Avoid heavy scroll-jacking unless it adds clear value.
- Image reveals should use `clip-path`, `mask`, `opacity`, `y` transform or `scale`.
- Text reveals should be clean and readable, not gimmicky.
- Hover interactions should be subtle and responsive.
