import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "jrg1q51h";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "lagom-arkitektur",
  deployment: {
    appId: "plj812naa56s681q3lglt6xy",
  },
});
