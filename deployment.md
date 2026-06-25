# Deployment — Cloudflare Pages

## Steps

1. Push repository to GitHub.
2. In Cloudflare Dashboard → Pages → Connect to Git.
3. Select the repository.
4. Configure:

   | Setting            | Value            |
   |--------------------|------------------|
   | Framework preset   | Vite (or None)   |
   | Build command      | `npm run build`  |
   | Build output dir   | `dist`           |
   | Environment vars   | (none for v1)    |

5. Deploy.

## Environment variables (future)

When Sanity CMS is added:

```
VITE_SANITY_PROJECT_ID=...
VITE_SANITY_DATASET=production
```
