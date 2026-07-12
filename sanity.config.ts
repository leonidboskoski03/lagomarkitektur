import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "jrg1q51h";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "lagomarkitektur",
  title: "Lagom Arkitektur CMS",
  projectId,
  dataset,
  basePath: "/cms",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
