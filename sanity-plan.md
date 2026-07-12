# Sanity Integration Plan

Sanity is scaffolded for Lagom Arkitektur. The website still reads from
`src/data/projects.ts` until the real Sanity project ID and first content import
are ready.

## Scripts

- `npm run cms` starts Sanity Studio.
- `npm run cms:deploy` deploys the Studio.
- `npm run cms:import-projects` imports the 11 local projects and uploads images.
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
7. Use `Publishing` to control featured status, order, and whether the project
   is visible on the website.
8. Use `SEO` only when the default title/description needs manual control.

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
| isFeatured | boolean |
| isPublished | boolean |
| orderRank | number |

## Singleton Documents

- `siteSettings`

## Migration Strategy

1. Create the Sanity project and dataset.
2. Add env values in `.env.local`.
3. Run `npm run cms`.
4. Create project entries using the folder content as the source.
5. Replace the local `projects` import with `projectListQuery` from
   `src/lib/sanity.ts` when the client is ready to manage live content.
6. Keep component interfaces aligned with `src/types/project.ts` so the swap is
   mostly a data-normalization step.
