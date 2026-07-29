# Sanity Integration Plan

Sanity is scaffolded for Lagom Arkitektur. The Work page and the homepage
Selected Work section read published content from Sanity, with
`src/data/projects.ts` retained as a safe fallback when the dataset is empty or
unavailable.

## Scripts

- `npm run cms` starts Sanity Studio.
- `npm run cms:deploy` deploys the Studio.
- `npm run cms:import-projects` imports the 11 local projects and uploads images.
- `npm run cms:seed-home-showcase` creates the initial five-project homepage
  showcase without overwriting an existing client-edited document.
- `npm run cms:migrate-public-project-ids` repairs legacy dotted project IDs,
  updates homepage references, verifies the replacements, and removes only the
  superseded private duplicates.
- Copy `.env.example` to `.env.local` and replace `replace-me` with the real
  project ID before starting Studio.

## Importing Existing Projects

The importer lives at `scripts/import-sanity-projects.mjs`.

1. In Sanity Manage, create an API token with write permissions.
2. Add it to `.env.local`:

   ```env
   SANITY_AUTH_TOKEN=your_write_token
   ```

3. Check the local folders/image paths:

   ```bash
   npm run cms:import-projects -- --dry-run
   ```

4. Import all 11 projects and upload images:

   ```bash
   npm run cms:import-projects
   ```

5. Create the initial Homepage — Selected work document:

   ```bash
   npm run cms:seed-home-showcase
   ```

The importer uses stable document IDs like `project.quiet-mid-modernity`, so
running it again updates the same project documents instead of creating
duplicates.

## Client Editing Workflow

1. Open Studio.
2. Choose `Projects`.
3. Click `Create new`.
4. Fill the `Overview` tab first: title, slug, short intro, and project story.
5. Fill `Details`: year, location, category, site size, and services.
6. Upload the original rendered images in `Images`. The CMS stores originals;
   the website can request high-quality display versions from Sanity.
7. Use `Publishing` to control display order and whether the project is visible
   on the website.
8. Use `SEO` only when the default title/description needs manual control.

## Homepage Selected Work

The `homeProjectShowcase` singleton controls the complete homepage project
showcase while preserving the layout and GSAP animation in code.

- The intro frame controls its title, background image, and two metadata lines.
- The client chooses exactly five published project references and drags them
  into display order.
- Project title, category, service, year, location, area, and URL come from the
  referenced project document.
- Each selected project has an optional full-screen background override and two
  required clip-path animation images.
- Duplicate project references are rejected.
- The seed command uses the first five ordered published projects and does not
  overwrite a singleton that already exists.

## Project Document

| Field | Type |
| --- | --- |
| title | string |
| slug | slug |
| excerpt | text |
| description | block content |
| year | string |
| location | string |
| category | string |
| siteSize | string |
| services | array(string) |
| featuredImage | image with alt |
| gallery | array(image with alt) |
| credits | block content |
| thumbnailImage | image with alt |
| seoTitle | string |
| seoDescription | text |
| isPublished | boolean |
| orderRank | number |

## Singleton Documents

- `siteSettings`

## Migration Strategy

1. Create the Sanity project and dataset.
2. Add env values in `.env.local`.
3. Run `npm run cms`.
4. Create project entries using the folder content as the source.
5. Verify the Work page and Homepage — Selected work section against the
   published dataset.
6. Keep the local project content available as a fault-tolerant fallback.
