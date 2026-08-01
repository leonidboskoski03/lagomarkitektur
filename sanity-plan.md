# Sanity production architecture

Sanity is the only production source for project text and imagery. The website
does not bundle a local project catalogue or project-image fallback.

## Runtime flow

- The Work page loads every published project through `workProjectListQuery`.
- Individual `/work/:slug` pages use the same cached project response.
- Project transitions use the same Sanity CDN hero URL.
- Homepage Selected Work uses the `homeProjectShowcase` singleton.
- Sanity's image CDN creates full, preview and atlas image variants on demand.
- A small neutral SVG is the only local project placeholder.

If Sanity is unavailable, the website shows a localized loading/error state. It
does not silently serve stale project content.

## Scripts

- `npm run cms` starts Sanity Studio.
- `npm run cms:deploy` deploys the Studio.
- `npm run cms:seed-home-showcase` creates the initial five-project homepage
  showcase without overwriting an existing client-edited document.
- `npm run cms:migrate-public-project-ids` repairs legacy dotted project IDs.
- `npm run cms:repair-gallery-keys` repairs missing gallery item keys.

## Required environment

```env
VITE_SANITY_PROJECT_ID=jrg1q51h
VITE_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=jrg1q51h
SANITY_STUDIO_DATASET=production
```

Published reads use the public CDN and require no secret token. Studio writes
and one-time content migrations require `SANITY_AUTH_TOKEN` in `.env.local`.
Never place that token in a `VITE_*` variable.

## Current content migration note

The published dataset contains all 11 projects and their image galleries. The
documents were created before localized field objects were introduced, so some
project text and image alt values are still stored in the legacy English-only
shape. The frontend reads both legacy and localized shapes safely. A one-time
authenticated migration is still required to place Swedish and English copy in
the current schema before Swedish project content can be managed entirely in
Studio.

## Client editing workflow

1. Open Studio and choose `Projects`.
2. Fill both Swedish and English values in `Overview`.
3. Complete year, location, category, area and services in `Details`.
4. Upload originals in `Images`; the website requests optimized CDN variants.
5. Add localized alt text to every image.
6. Use `Publishing` to control order and visibility.
7. Use `Homepage — Selected work` to choose exactly five homepage projects.
