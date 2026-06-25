# Project Structure — Lagom Arkitektur

```
src/
├── assets/images/       — Static image imports (used sparingly)
├── assets/fonts/        — Local font files (if self-hosted later)
├── components/
│   ├── layout/          — Layout, Footer
│   ├── navigation/      — Navbar
│   ├── project/         — ProjectCard, ProjectGrid, ProjectHero
│   ├── sections/        — Home page sections, etc.
│   └── ui/              — SectionHeading, ImageReveal, PageTransition
├── data/
│   └── projects.ts      — All hardcoded project data (mirrors future Sanity schema)
├── hooks/
│   ├── useGsapReveal.ts — Reusable GSAP ScrollTrigger reveal
│   └── usePrefersReducedMotion.ts
├── lib/
│   ├── animations.ts    — GSAP timeline presets
│   ├── constants.ts     — Site-wide constants
│   └── utils.ts         — Utility functions
├── pages/
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── styles/
│   └── globals.css      — Tailwind import + design tokens
├── types/
│   └── project.ts       — TypeScript interfaces
├── App.tsx              — Router setup
└── main.tsx             — Entry point
```

## Why `src/data/projects.ts`?

- Keeps all project content in one place.
- Components stay reusable and content-agnostic.
- Future Sanity migration just replaces the data source.

## Routing

- `/` — Home
- `/projekt` — Projects listing
- `/projekt/:slug` — Project detail
- `/om-oss` — About
- `/kontakt` — Contact

## Image strategy

- Placeholder images use string paths (`/images/projects/...`).
- Sanity will later provide image URLs.
- Do not import images one-by-one in code.
