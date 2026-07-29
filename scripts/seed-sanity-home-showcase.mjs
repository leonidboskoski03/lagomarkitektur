import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
  exitWithHelp("Missing SANITY_STUDIO_PROJECT_ID or VITE_SANITY_PROJECT_ID.");
}

if (!token) {
  exitWithHelp("Missing SANITY_AUTH_TOKEN.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-09",
  useCdn: false,
});

const selectedProjects = await fetchSelectedProjects();

if (selectedProjects.length !== 5) {
  console.error(
    `Expected at least five published projects, but Sanity returned ${selectedProjects.length}.`,
  );
  process.exit(1);
}

const stoneframeProject =
  selectedProjects.find((project) => project.slug === "l-28-stoneframe-villa") ||
  selectedProjects[0];

const document = {
  _id: "homeProjectShowcase",
  _type: "homeProjectShowcase",
  introTitle: "Selected work",
  introTags: ["Lagom Arkitektur", "Selected work", "Spatial portfolio"],
  introProperties: ["Architecture", "Interiors", "2022-2026"],
  introBackground: cleanImage(stoneframeProject.featuredImage),
  projects: selectedProjects.map((project, index) => {
    const imagePool = [
      ...(project.gallery || []),
      project.thumbnailImage,
      project.featuredImage,
    ].filter(Boolean);

    return {
      _key: `showcaseProject${index + 1}`,
      _type: "showcaseProject",
      project: {
        _type: "reference",
        _ref: project._id,
      },
      primaryImage: cleanImage(imagePool[1] || imagePool[0]),
      secondaryImage: cleanImage(imagePool[2] || imagePool[1] || imagePool[0]),
    };
  }),
};

if (dryRun) {
  console.log(`Dry run: ready to create ${document._id} in ${projectId}/${dataset}.`);
  for (const [index, project] of selectedProjects.entries()) {
    console.log(`${String(index + 1).padStart(2, "0")} ${project.title}`);
  }
  console.log("No Sanity documents were changed.");
  process.exit(0);
}

const existingDocumentId = await client.fetch(
  "*[_id == $id][0]._id",
  { id: document._id },
);

if (existingDocumentId) {
  console.log(
    "Homepage — Selected work already exists. Nothing was overwritten; edit it in Sanity Studio.",
  );
  process.exit(0);
}

await client.create(document);
console.log("Created Homepage — Selected work with five initial projects.");

async function fetchSelectedProjects() {
  try {
    return await client.fetch(`*[
      _type == "project" &&
      _id match "project-*" &&
      isPublished != false
    ] | order(orderRank asc, year desc)[0...5] {
      _id,
      title,
      "slug": slug.current,
      featuredImage,
      thumbnailImage,
      gallery
    }`);
  } catch (error) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      console.error("Sanity authentication failed.");
      console.error(
        "Create a new Editor token, replace SANITY_AUTH_TOKEN in .env.local, and run this command again.",
      );
      process.exit(1);
    }

    throw error;
  }
}

function cleanImage(image) {
  if (!image) return undefined;
  const { _key: _unusedKey, ...imageValue } = image;
  return imageValue;
}

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

function exitWithHelp(message) {
  console.error(message);
  console.error("");
  console.error("Required .env.local values:");
  console.error("SANITY_STUDIO_PROJECT_ID=<project id>");
  console.error("SANITY_STUDIO_DATASET=production");
  console.error("SANITY_AUTH_TOKEN=<Editor token>");
  process.exit(1);
}
