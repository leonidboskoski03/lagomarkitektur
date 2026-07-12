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
  console.error("Missing Sanity config. Make sure .env.local has project ID, dataset, and SANITY_AUTH_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-09",
  useCdn: false,
});

const docs = await client.fetch(
  `*[_type == "project" && defined(gallery)]{
    _id,
    title,
    gallery
  }`,
);

for (const doc of docs) {
  const gallery = doc.gallery.map((item, index) => ({
    _key: item._key || `galleryImage${index}`,
    ...item,
  }));

  await client.patch(doc._id).set({ gallery }).commit();
  console.log(`Repaired gallery keys: ${doc.title || doc._id}`);
}

console.log(`Done. Checked ${docs.length} project documents.`);

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
