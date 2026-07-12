import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Lagom CMS")
    .items([
      S.listItem()
        .title("Projects")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("All projects")
            .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
        ),
      S.listItem()
        .title("Featured projects")
        .schemaType("project")
        .child(
          S.documentList()
            .title("Featured projects")
            .schemaType("project")
            .filter('_type == "project" && isFeatured == true')
            .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
        ),
      S.listItem()
        .title("Draft / hidden projects")
        .schemaType("project")
        .child(
          S.documentList()
            .title("Draft / hidden projects")
            .schemaType("project")
            .filter('_type == "project" && isPublished != true')
            .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
