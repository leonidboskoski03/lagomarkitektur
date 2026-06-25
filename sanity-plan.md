# Sanity Integration Plan — Future

## Document: Project

| Field          | Type          |
|----------------|---------------|
| title          | string        |
| slug           | slug          |
| excerpt        | text          |
| description    | block content |
| year           | string        |
| location       | string        |
| category       | string        |
| services       | array(string) |
| featuredImage  | image         |
| gallery        | array(image)  |
| credits        | block content |
| seoTitle       | string        |
| seoDescription | text          |
| isFeatured     | boolean       |
| orderRank      | number        |

## Singleton documents

- `siteSettings`
- `homepage`
- `aboutPage`
- `contactPage`

## Migration strategy

1. Add `@sanity/client` and `@portabletext/react`.
2. Create Sanity project and get dataset ID.
3. Replace `src/data/projects.ts` with Sanity queries.
4. Keep component interfaces the same — only swap data source.
5. The hardcoded data structure already mirrors the future schema.
