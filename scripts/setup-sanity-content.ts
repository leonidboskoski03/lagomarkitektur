import { createHash } from "node:crypto";
import {
  createReadStream,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { createClient } from "@sanity/client";

type Language = "sv" | "en";

interface LocalizedText {
  _key?: string;
  _type?: string;
  sv?: string;
  en?: string;
}

interface ImageValue {
  _key?: string;
  _type?: string;
  alt?: string | LocalizedText;
  caption?: string | LocalizedText;
  asset?: { _type?: string; _ref?: string };
  [key: string]: unknown;
}

interface ProjectDocument {
  _id: string;
  _type: "project";
  title: LocalizedText;
  slug?: { current?: string };
  excerpt: LocalizedText;
  description?: { sv?: unknown[]; en?: unknown[] };
  location: LocalizedText;
  category?: string;
  services?: string[];
  year?: string;
  siteSize?: string;
  featuredImage?: ImageValue;
  thumbnailImage?: ImageValue;
  gallery?: ImageValue[];
  workGallery?: ImageValue[];
  [key: string]: unknown;
}

interface ShowcaseItem {
  _key?: string;
  _type?: string;
  project?: { _type?: string; _ref?: string };
  backgroundImage?: ImageValue;
  primaryImage?: ImageValue;
  secondaryImage?: ImageValue;
}

interface ShowcaseDocument {
  _id: string;
  _type: "homeProjectShowcase";
  introTitle?: LocalizedText;
  introTags?: LocalizedText[];
  introProperties?: LocalizedText[];
  introBackground?: ImageValue;
  projects?: ShowcaseItem[];
}

const projectId = "jrg1q51h";
const dataset = "production";
const apiVersion = "2026-08-01";
const applyChanges = process.argv.includes("--apply");
const sourceArgumentIndex = process.argv.indexOf("--source");
const sourceRoot = sourceArgumentIndex >= 0
  ? resolve(process.argv[sourceArgumentIndex + 1] || "")
  : "";

if (!sourceRoot || !existsSync(sourceRoot)) {
  throw new Error(
    "Pass the supplied content folder with --source, for example: --source \"C:\\path\\to\\LAGOM Arkitektur\".",
  );
}

function readLocalEnv() {
  try {
    return Object.fromEntries(
      readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const separatorIndex = line.indexOf("=");
          const key = line.slice(0, separatorIndex).trim();
          const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/gu, "");
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

const localEnv = readLocalEnv();
const token = process.env.SANITY_AUTH_TOKEN || localEnv.SANITY_AUTH_TOKEN;
if (!token) throw new Error("SANITY_AUTH_TOKEN is missing from .env.local.");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

const folderPrefixes: Record<string, string> = {
  "quiet-mid-modernity": "1.",
  "serene-luxe-residence": "2.",
  "gentlemans-loft-cave": "3.",
  "l-28-stoneframe-villa": "4.",
  "lounge-bar-aviator": "5.",
  "archmood-interior-concept": "6.",
  "warm-minimal-open-concept": "7.",
  "contrast-cohesion-interior": "8.",
  "oak-shadow-cohesion": "9.",
  "childs-mini-creative-space": "10.",
  "blue-nest-4y": "11.",
};

const translations: Record<string, Record<Language, string>> = {
  Residential: { sv: "Bostad", en: "Residential" },
  Hospitality: { sv: "Hotell & restaurang", en: "Hospitality" },
  Architecture: { sv: "Arkitektur", en: "Architecture" },
  Interior: { sv: "Interiör", en: "Interior" },
  Commercial: { sv: "Kommersiellt", en: "Commercial" },
  Concept: { sv: "Koncept", en: "Concept" },
  Design: { sv: "Design", en: "Design" },
  "Interior design": { sv: "Inredningsdesign", en: "Interior design" },
  "Interior concept": { sv: "Interiörkoncept", en: "Interior concept" },
  "Furniture curation": { sv: "Möbelurval", en: "Furniture curation" },
  "Material selection": { sv: "Materialval", en: "Material selection" },
  "Spatial planning": { sv: "Rumsplanering", en: "Spatial planning" },
  "Material concept": { sv: "Materialkoncept", en: "Material concept" },
  "Lighting concept": { sv: "Ljuskoncept", en: "Lighting concept" },
  Visualization: { sv: "Visualisering", en: "Visualization" },
  "Custom furniture": { sv: "Specialritad inredning", en: "Custom furniture" },
  "Hospitality concept": { sv: "Hotell- och restaurangkoncept", en: "Hospitality concept" },
  "Exterior concept": { sv: "Exteriört koncept", en: "Exterior concept" },
  "Children's room concept": { sv: "Barnrumskoncept", en: "Children's room concept" },
  "Small-space planning": { sv: "Planering av små ytor", en: "Small-space planning" },
  "Joinery concept": { sv: "Snickerikoncept", en: "Joinery concept" },
};

const naturalOrder = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const imagePattern = /\.(avif|jpe?g|png|webp)$/iu;

function walkImages(directory: string, output: string[] = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stats = statSync(path);
    if (stats.isDirectory()) walkImages(path, output);
    else if (imagePattern.test(name)) output.push(path);
  }
  return output;
}

function fileSha1(path: string) {
  return createHash("sha1").update(readFileSync(path)).digest("hex");
}

function findProjectFolder(prefix: string) {
  const directoryName = readdirSync(sourceRoot, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith(prefix))?.name;
  if (!directoryName) throw new Error(`Missing source project folder beginning with ${prefix}`);
  return join(sourceRoot, directoryName);
}

function localizedMember(
  key: string,
  sv: string,
  en: string,
  current?: LocalizedText,
): LocalizedText {
  return {
    _key: current?._key || key,
    _type: "localizedString",
    sv: current?.sv?.trim() || sv,
    en: current?.en?.trim() || en,
  };
}

function localizedField(value: string | LocalizedText | undefined, sv: string, en: string) {
  if (typeof value === "string") return { sv, en: value.trim() || en };
  return { sv: value?.sv?.trim() || sv, en: value?.en?.trim() || en };
}

function translated(value: string | undefined, language: Language) {
  if (!value) return language === "sv" ? "Design" : "Design";
  return translations[value]?.[language] || value;
}

function requireBilingualProject(document: ProjectDocument) {
  const slug = document.slug?.current || document._id;
  const missing = [
    document.title?.sv,
    document.title?.en,
    document.excerpt?.sv,
    document.excerpt?.en,
    document.location?.sv,
    document.location?.en,
    document.description?.sv?.length,
    document.description?.en?.length,
  ].some((value) => !value);
  if (missing) throw new Error(`${slug} is missing required Swedish or English project text.`);
}

function normalizeImage(
  image: ImageValue,
  fallbackSv: string,
  fallbackEn: string,
  key?: string,
) {
  return {
    ...image,
    ...(key ? { _key: image._key || key } : {}),
    _type: "projectImage",
    alt: localizedField(image.alt, fallbackSv, fallbackEn),
    ...(image.caption
      ? { caption: localizedField(image.caption, fallbackSv, fallbackEn) }
      : {}),
  };
}

function allAssetReferences(value: unknown, references = new Set<string>()) {
  if (Array.isArray(value)) {
    value.forEach((item) => allAssetReferences(item, references));
    return references;
  }
  if (!value || typeof value !== "object") return references;
  const object = value as Record<string, unknown>;
  if (object._type === "reference" && typeof object._ref === "string" && object._ref.startsWith("image-")) {
    references.add(object._ref);
  }
  Object.values(object).forEach((item) => allAssetReferences(item, references));
  return references;
}

const documents = await client.fetch<Array<ProjectDocument | ShowcaseDocument>>(`*[
  _type == "project" || _id == "homeProjectShowcase"
]`);
const projects = documents.filter((document): document is ProjectDocument => document._type === "project");
const showcase = documents.find((document): document is ShowcaseDocument =>
  document._type === "homeProjectShowcase");

if (projects.length !== Object.keys(folderPrefixes).length) {
  throw new Error(`Expected ${Object.keys(folderPrefixes).length} projects; found ${projects.length}.`);
}
if (!showcase || showcase.projects?.length !== 5) {
  throw new Error("The homepage showcase document must contain exactly five projects.");
}

const imageAssets = await client.fetch<Array<{ _id: string }>>(`*[_type == "sanity.imageAsset"]{_id}`);
const assetIdByHash = new Map(
  imageAssets.map((asset) => [asset._id.split("-")[1], asset._id]),
);

const projectSources = new Map<string, Array<{ hash: string; path: string }>>();
for (const [slug, prefix] of Object.entries(folderPrefixes)) {
  const folder = findProjectFolder(prefix);
  const files = walkImages(folder)
    .toSorted((first, second) => naturalOrder.compare(relative(folder, first), relative(folder, second)));
  if (files.length === 0) throw new Error(`No source images found for ${slug}.`);
  projectSources.set(slug, files.map((path) => ({ path, hash: fileSha1(path) })));
}

const missingSourceImages = [...projectSources.values()]
  .flat()
  .filter((image) => !assetIdByHash.has(image.hash));

console.log(
  `${applyChanges ? "Applying" : "Dry run:"} ${projects.length} projects, `
  + `${[...projectSources.values()].flat().length} source images, `
  + `${missingSourceImages.length} images to upload.`,
);

if (!applyChanges) {
  for (const image of missingSourceImages) {
    console.log(`- missing asset: ${relative(sourceRoot, image.path)}`);
  }
  console.log("No data changed. Re-run with --apply after reviewing this plan.");
  process.exit(0);
}

for (const [index, image] of missingSourceImages.entries()) {
  console.log(`Uploading source image ${index + 1}/${missingSourceImages.length}: ${relative(sourceRoot, image.path)}`);
  const asset = await client.assets.upload("image", createReadStream(image.path), {
    filename: basename(image.path),
  });
  assetIdByHash.set(image.hash, asset._id);
}

const plannedProjectPatches = projects.map((project) => {
  requireBilingualProject(project);
  const slug = project.slug?.current;
  if (!slug || !projectSources.has(slug)) throw new Error(`No source mapping for ${project._id}.`);

  const titleSv = project.title.sv as string;
  const titleEn = project.title.en as string;
  const existingGallery = new Map(
    (project.gallery || [])
      .filter((image) => image.asset?._ref)
      .map((image) => [image.asset?._ref as string, image]),
  );
  const gallery = (projectSources.get(slug) || []).map((source, index) => {
    const assetId = assetIdByHash.get(source.hash);
    if (!assetId) throw new Error(`Upload did not produce an asset for ${source.path}.`);
    const existing = existingGallery.get(assetId) || {
      _type: "projectImage",
      asset: { _type: "reference", _ref: assetId },
    };
    return normalizeImage(
      existing,
      `${titleSv} bild ${index + 1}`,
      `${titleEn} image ${index + 1}`,
      `source-${source.hash.slice(0, 16)}`,
    );
  });

  const targetGalleryReferences = new Set(gallery.map((image) => image.asset?._ref));
  for (const image of project.gallery || []) {
    const reference = image.asset?._ref;
    if (reference && !targetGalleryReferences.has(reference)) {
      gallery.push(normalizeImage(
        image,
        `${titleSv} kompletterande bild`,
        `${titleEn} additional image`,
        image._key || `preserved-${reference.slice(6, 22)}`,
      ));
    }
  }

  const category = project.category || "Design";
  const primaryService = project.services?.[0] || "Design";
  const year = project.year || "";
  const locationSv = project.location.sv as string;
  const locationEn = project.location.en as string;
  const showcaseTags = [
    localizedMember("category", translated(category, "sv"), translated(category, "en")),
    localizedMember("service", translated(primaryService, "sv"), translated(primaryService, "en")),
    localizedMember("year", year, year),
    localizedMember("studio", "Lagom", "Lagom"),
  ];
  const showcaseDetails = [
    localizedMember("year", year, year),
    localizedMember("location", locationSv, locationEn),
    ...(project.siteSize
      ? [localizedMember("area", project.siteSize, project.siteSize)]
      : []),
  ];

  const patch: Record<string, unknown> = {
    gallery,
    showcaseTags,
    showcaseDetails,
  };
  if (project.featuredImage) {
    patch.featuredImage = normalizeImage(project.featuredImage, titleSv, titleEn);
  }
  if (project.thumbnailImage) {
    patch.thumbnailImage = normalizeImage(
      project.thumbnailImage,
      `${titleSv} miniatyrbild`,
      `${titleEn} thumbnail`,
    );
  }
  if (project.workGallery) {
    patch.workGallery = project.workGallery.map((image, index) => normalizeImage(
      image,
      `${titleSv} atlasbild ${index + 1}`,
      `${titleEn} atlas image ${index + 1}`,
      image._key || `atlas-${index + 1}`,
    ));
  }

  const beforeReferences = allAssetReferences(project);
  const afterReferences = allAssetReferences(patch);
  for (const reference of beforeReferences) {
    if (!afterReferences.has(reference)) {
      throw new Error(`Asset safety check failed for ${project._id}: ${reference}`);
    }
  }

  console.log(`- ${slug}: ${gallery.length} connected gallery images, bilingual tags and details`);
  return { id: project._id, patch };
});

const introTags = [
  localizedMember("studio", "Lagom Arkitektur", "Lagom Arkitektur", showcase.introTags?.[0]),
  localizedMember("selection", "Utvalda projekt", "Selected work", showcase.introTags?.[1]),
  localizedMember("portfolio", "Rumslig portfolio", "Spatial portfolio", showcase.introTags?.[2]),
];
const introProperties = [
  localizedMember("architecture", "Arkitektur", "Architecture", showcase.introProperties?.[0]),
  localizedMember("interiors", "Interiörer", "Interiors", showcase.introProperties?.[1]),
  localizedMember("years", "2022–2026", "2022-2026", showcase.introProperties?.[2]),
];
const showcasePatch = {
  introTitle: localizedField(showcase.introTitle, "Utvalda arbeten", "Selected work"),
  introTags,
  introProperties,
  ...(showcase.introBackground
    ? { introBackground: normalizeImage(
      showcase.introBackground,
      "Utvalda projekt, bakgrundsbild",
      "Selected work background",
    ) }
    : {}),
  projects: (showcase.projects || []).map((item, index) => ({
    ...item,
    _key: item._key || `showcase-project-${index + 1}`,
    _type: "showcaseProject",
    ...(item.backgroundImage
      ? { backgroundImage: normalizeImage(
        item.backgroundImage,
        `Utvalt projekt ${index + 1}, bakgrundsbild`,
        `Selected project ${index + 1} background`,
      ) }
      : {}),
    ...(item.primaryImage
      ? { primaryImage: normalizeImage(
        item.primaryImage,
        `Utvalt projekt ${index + 1}, bild 1`,
        `Selected project ${index + 1}, image 1`,
      ) }
      : {}),
    ...(item.secondaryImage
      ? { secondaryImage: normalizeImage(
        item.secondaryImage,
        `Utvalt projekt ${index + 1}, bild 2`,
        `Selected project ${index + 1}, image 2`,
      ) }
      : {}),
  })),
};

let transaction = client.transaction();
for (const item of plannedProjectPatches) {
  transaction = transaction.patch(item.id, (patch) => patch.set(item.patch));
}
transaction = transaction.patch(showcase._id, (patch) => patch.set(showcasePatch));

const result = await transaction.commit({ autoGenerateArrayKeys: true });
console.log(`Sanity content setup completed (${result.documentIds.length} documents updated).`);
