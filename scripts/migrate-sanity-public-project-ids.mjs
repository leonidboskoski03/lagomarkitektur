import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  console.error("Missing Sanity project configuration or SANITY_AUTH_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-09",
  useCdn: false,
});

const allProjects = await client.fetch('*[_type == "project"]');
const legacyProjects = allProjects.filter((project) => project._id.startsWith("project."));

if (legacyProjects.length === 0) {
  console.log("No dotted project IDs require migration.");
  process.exit(0);
}

console.log(`Migrating ${legacyProjects.length} project documents to public-safe IDs.`);

for (const legacyProject of legacyProjects) {
  const {
    _rev: _unusedRevision,
    _createdAt: _unusedCreatedAt,
    _updatedAt: _unusedUpdatedAt,
    ...project
  } = legacyProject;
  const publicId = legacyProject._id.replace(/^project\./, "project-");

  await client.createOrReplace({
    ...project,
    _id: publicId,
  });
}

const showcase = await client.fetch(
  '*[_id == "homeProjectShowcase"][0]{projects}',
);

if (showcase?.projects) {
  const projects = showcase.projects.map((item) => {
    const reference = item.project?._ref;
    if (!reference?.startsWith("project.")) return item;

    return {
      ...item,
      project: {
        ...item.project,
        _ref: reference.replace(/^project\./, "project-"),
      },
    };
  });

  await client.patch("homeProjectShowcase").set({ projects }).commit();
}

const publicIds = legacyProjects.map((project) =>
  project._id.replace(/^project\./, "project-"),
);
const verification = await client.fetch(
  `{
    "publicProjects": count(*[_id in $publicIds]),
    "legacyShowcaseReferences": count(
      *[_id == "homeProjectShowcase"][0].projects[
        project._ref in $legacyIds
      ]
    )
  }`,
  {
    publicIds,
    legacyIds: legacyProjects.map((project) => project._id),
  },
);

if (
  verification.publicProjects !== legacyProjects.length ||
  verification.legacyShowcaseReferences !== 0
) {
  throw new Error(
    "Migration verification failed. Legacy documents were preserved.",
  );
}

let cleanup = client.transaction();
for (const legacyProject of legacyProjects) {
  cleanup = cleanup.delete(legacyProject._id);
}
await cleanup.commit();

console.log(
  `Migration complete. Created ${publicIds.length} public projects, updated showcase references, and removed ${legacyProjects.length} private duplicates.`,
);

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
