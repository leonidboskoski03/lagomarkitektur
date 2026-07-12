import { createReadStream, existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const assetsRoot = path.join(rootDir, "src", "assets", "LAGOM Arkitektur");
const dryRun = process.argv.includes("--dry-run");

loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
  exitWithHelp("Missing SANITY_STUDIO_PROJECT_ID or VITE_SANITY_PROJECT_ID.");
}

if (!dryRun && !token) {
  exitWithHelp(
    "Missing SANITY_AUTH_TOKEN. Create a write token in Sanity Manage and add it to .env.local before importing.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-09",
  useCdn: false,
});

const projects = [
  {
    folderNumber: "1.",
    title: "A|N - The Quiet Mid-Modernity",
    slug: "quiet-mid-modernity",
    excerpt:
      "A contemporary apartment in Malmo blending modern and mid-century influences with natural light, metal details, and warm wood accents.",
    description: [
      "Nestled in the heart of Malmo, Sweden, this contemporary apartment beautifully blends modern and mid-century modern design influences to create a stylish yet cozy living space.",
      "Its open layout maximizes natural light, with large windows that flood each room with sunlight, enhancing the sense of openness and tranquility.",
      "Wooden accents bring warmth to the environment, forming a harmonious contrast with the metal details found throughout the apartment.",
    ],
    year: "2024",
    location: "Malmo, Sweden",
    category: "Residential",
    siteSize: "54 sqm",
    services: ["Interior design", "Spatial planning", "Material concept"],
    isFeatured: true,
    orderRank: 10,
    featuredImage: "Pictures from the apartment - realized project/1.jpg",
    thumbnailImage: "Visualizations/1.png",
    gallery: [
      "Pictures from the apartment - realized project/1.jpg",
      "Pictures from the apartment - realized project/2.jpg",
      "Pictures from the apartment - realized project/3.jpg",
      "Pictures from the apartment - realized project/4.jpg",
      "Pictures from the apartment - realized project/5.jpg",
      "Pictures from the apartment - realized project/6.jpg",
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ],
  },
  {
    folderNumber: "2.",
    title: "Serene Luxe Residence",
    slug: "serene-luxe-residence",
    excerpt:
      "A refined residential concept where open planning, natural materials, and layered lighting create calm everyday luxury.",
    description: [
      "This project presents a refined Serene Modern residential concept where architecture, light, and materiality work together to create calm, elegant living environments.",
      "The open-plan layout connects living, dining, and kitchen areas into a continuous spatial experience, enhanced by large glazed openings that frame curated city-and-landscape views.",
      "A soft, natural palette of wood, stone, and textured surfaces is paired with layered architectural lighting to maintain warmth and clarity throughout the day.",
    ],
    year: "2024",
    location: "Shtip, N. Macedonia",
    category: "Residential",
    siteSize: "75 sqm",
    services: ["Interior concept", "Visualization", "Lighting concept"],
    isFeatured: true,
    orderRank: 20,
    featuredImage: "Visualizations/day version/1.png",
    thumbnailImage: "Visualizations/night version/1.png",
    gallery: [
      "Visualizations/day version/1.png",
      "Visualizations/day version/2.png",
      "Visualizations/day version/3.png",
      "Visualizations/day version/4.png",
      "Visualizations/day version/5.png",
      "Visualizations/day version/6.png",
      "Visualizations/day version/7.png",
      "Visualizations/night version/1.png",
      "Visualizations/night version/2.png",
      "Visualizations/night version/3.png",
      "Visualizations/night version/4.png",
    ],
  },
  {
    folderNumber: "3.",
    title: "Gentleman's Loft Cave",
    slug: "gentlemans-loft-cave",
    excerpt:
      "A dark, tactile apartment interior balancing anthracite surfaces, cherry wood, orange upholstery, and collected furniture pieces.",
    description: [
      "This apartment is conceived as a refined contemporary man cave, balancing a dark, smoky atmosphere with curated elegance.",
      "An anthracite microcement floor forms a continuous, monolithic base, setting a dramatic tone while contrasting intentionally with the warmth of the cherry wood kitchen and bold orange upholstery.",
      "The result is a space that feels masculine and intimate, yet polished, timeless, and aesthetically composed.",
    ],
    year: "2022",
    location: "Skopje, N. Macedonia",
    category: "Residential",
    siteSize: "64 sqm",
    services: ["Interior design", "Furniture curation", "Material concept"],
    isFeatured: true,
    orderRank: 30,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 11),
  },
  {
    folderNumber: "4.",
    title: "L-28 Stoneframe Villa",
    slug: "l-28-stoneframe-villa",
    excerpt:
      "A contemporary courtyard home framed by natural stone, plaster, warm wood, and private outdoor lounges.",
    description: [
      "L-28 Stoneframe Villa is a contemporary courtyard home that blends architectural clarity with everyday comfort.",
      "Clean horizontal volumes are framed by natural stone, plaster, and warm wood to create a timeless, welcoming identity.",
      "Large glazed openings connect interior spaces with private outdoor lounges, allowing light and landscape to shape the living experience.",
    ],
    year: "2025",
    location: "Prilep, N. Macedonia",
    category: "Architecture",
    siteSize: "186 sqm",
    services: ["Architecture", "Exterior concept", "Visualization"],
    isFeatured: true,
    orderRank: 40,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 4),
  },
  {
    folderNumber: "5.",
    title: "Lounge Bar Aviator 2.0",
    slug: "lounge-bar-aviator",
    excerpt:
      "A contemporary hospitality interior shaped with warm wood, stone texture, soft light, and calm urban openness.",
    description: [
      "This contemporary restaurant interior is designed as a refined extension of the city mall, blending hospitality with architectural character.",
      "Warm wood, textured stone surfaces, and soft integrated lighting create an inviting atmosphere for everyday dining and social interaction.",
      "Carefully composed seating zones balance openness with comfort and privacy, while greenery softens the material palette and enhances the guest experience.",
    ],
    year: "2023",
    location: "Skopje, N. Macedonia",
    category: "Hospitality",
    siteSize: "140 sqm",
    services: ["Interior design", "Hospitality concept", "Visualization"],
    isFeatured: true,
    orderRank: 50,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 11),
  },
  {
    folderNumber: "6.",
    title: "ArchMood Interior Concept",
    slug: "archmood-interior-concept",
    excerpt:
      "A compact shared bedroom transformed into warm, functional zones for rest, grooming, reading, and daily rituals.",
    description: [
      "This compact room transformation was a challenge in both space optimization and aesthetic balance.",
      "Originally a very small and limited area, the goal was to reimagine it into a warm, functional, and stylish shared bedroom for two teenage girls.",
      "Two comfortable single beds, a dedicated make-up and grooming area, and a cozy reading corner give each person a personalized zone within a calm shared interior.",
    ],
    year: "2025",
    location: "Skopje, N. Macedonia",
    category: "Interior",
    siteSize: "12 sqm",
    services: ["Interior design", "Small-space planning", "Visualization"],
    isFeatured: false,
    orderRank: 60,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 6),
  },
  {
    folderNumber: "7.",
    title: "Warm Minimal Open Concept",
    slug: "warm-minimal-open-concept",
    excerpt:
      "A compact apartment retreat where kitchen, dining, and lounge areas flow through soft geometry and neutral materiality.",
    description: [
      "This apartment is conceived as a warm-modern retreat for two, where open planning and soft geometry create a continuous living experience.",
      "Kitchen, dining, and lounge areas flow naturally, enhanced by neutral palettes, wood textures, and stone finishes.",
      "Built-in storage and custom furniture optimize the compact footprint, while large openings and reflective surfaces amplify natural light and visual continuity.",
    ],
    year: "2024",
    location: "Prilep, N. Macedonia",
    category: "Interior",
    siteSize: "25 sqm",
    services: ["Interior design", "Custom furniture", "Visualization"],
    isFeatured: false,
    orderRank: 70,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 5),
  },
  {
    folderNumber: "8.",
    title: "Contrast & Cohesion Interior",
    slug: "contrast-cohesion-interior",
    excerpt:
      "A serious, modern living and dining interior built around pepita pattern, black leather, brown leather, and artful wall composition.",
    description: [
      "At the request of the customers, this design helped define the direction for a living room and dining area with a more serious character and modern elements.",
      "Furniture material, color, and dining-room wall decoration carry the concept.",
      "The pepita pattern and black leather armchairs, combined with the brown leather sofa, create a matched contrast that gives the space depth and confidence.",
    ],
    year: "2022",
    location: "Skopje, N. Macedonia",
    category: "Interior",
    siteSize: "45 sqm",
    services: ["Interior design", "Material selection", "Visualization"],
    isFeatured: false,
    orderRank: 80,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 5),
  },
  {
    folderNumber: "9.",
    title: "The Oak and Shadow Cohesion",
    slug: "oak-shadow-cohesion",
    excerpt:
      "A contemporary apartment interior where warm oak, natural stone, matte black elements, and Nordic blue accents frame flexible living.",
    description: [
      "This contemporary apartment interior is defined by material contrast, spatial flexibility, and refined architectural composition.",
      "Warm oak volumes and natural stone surfaces are framed by deep matte black elements, creating a layered dialogue between light and shadow throughout the home.",
      "A transformable living and dining area, dedicated bay-window office, and boutique-hotel bedroom build a calm, flexible residential experience.",
    ],
    year: "2026",
    location: "Bitola, N. Macedonia",
    category: "Residential",
    siteSize: "60 sqm",
    services: ["Interior design", "Joinery concept", "Visualization"],
    isFeatured: true,
    orderRank: 90,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 22),
  },
  {
    folderNumber: "10.",
    title: "Child's Mini Creative Space",
    slug: "childs-mini-creative-space",
    excerpt:
      "A child's room shaped as a small personal studio for study, drawing, rest, shared play, and independence.",
    description: [
      "This project transforms a room into a child's personal studio for creativity and comfort.",
      "Planned around a fixed wardrobe position, the interior unfolds into functional zones for studying, drawing, resting, and shared playtime.",
      "Warm materials, playful textures, and balanced proportions give the space architectural clarity while remaining inviting and soft.",
    ],
    year: "2023",
    location: "Prilep, N. Macedonia",
    category: "Interior",
    siteSize: "12 sqm",
    services: ["Interior design", "Children's room concept", "Visualization"],
    isFeatured: false,
    orderRank: 100,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 5),
  },
  {
    folderNumber: "11.",
    title: "Blue Nest 4Y",
    slug: "blue-nest-4y",
    excerpt:
      "A calm, playful kids interior blending Nordic minimalism, soft geometry, natural wood, and muted blue accents.",
    description: [
      "Project Blue Nest is a calm, playful, and architectural kids interior designed for a 4-year-old boy.",
      "The space blends Nordic minimalism with soft geometry, natural wood, and muted blue accents to create a balanced environment for sleep, play, and creativity.",
      "Clean lines, built-in storage, and sculpted forms transform the room into a small architectural landscape where function meets imagination.",
    ],
    year: "2024",
    location: "Skopje, N. Macedonia",
    category: "Interior",
    siteSize: "11 sqm",
    services: ["Interior design", "Children's room concept", "Visualization"],
    isFeatured: false,
    orderRank: 110,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 5),
  },
];

const assetCache = new Map();

console.log(`${dryRun ? "Dry run: " : ""}Importing ${projects.length} projects to ${projectId}/${dataset}`);

if (!dryRun) {
  await verifyWriteAccess();
}

for (const project of projects) {
  const folder = resolveProjectFolder(project.folderNumber);
  const featuredImage = await createProjectImage(folder, project.featuredImage, project.title);
  const thumbnailImage = project.thumbnailImage
    ? await createProjectImage(folder, project.thumbnailImage, `${project.title} thumbnail`)
    : undefined;
  const gallery = [];

  for (const [index, imagePath] of project.gallery.entries()) {
    gallery.push(await createProjectImage(
      folder,
      imagePath,
      `${project.title} ${path.basename(imagePath, path.extname(imagePath))}`,
      `galleryImage${index}`,
    ));
  }

  const document = {
    _id: `project.${project.slug}`,
    _type: "project",
    title: project.title,
    slug: { _type: "slug", current: project.slug },
    excerpt: project.excerpt,
    description: toPortableText(project.description),
    year: project.year,
    location: project.location,
    category: project.category,
    siteSize: project.siteSize,
    services: project.services,
    featuredImage,
    ...(thumbnailImage ? { thumbnailImage } : {}),
    gallery,
    credits: toPortableText([`Site size: ${project.siteSize}`]),
    isFeatured: project.isFeatured,
    isPublished: true,
    orderRank: project.orderRank,
    seoTitle: project.title,
    seoDescription: project.excerpt,
  };

  if (dryRun) {
    console.log(`- ${project.title}: ${gallery.length} gallery images (${folder})`);
    continue;
  }

  await client.createOrReplace(document);
  console.log(`Imported ${project.title} (${gallery.length} gallery images)`);
}

console.log(dryRun ? "Dry run complete. No Sanity documents were changed." : "Import complete.");

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
  console.error("VITE_SANITY_PROJECT_ID=jrg1q51h");
  console.error("VITE_SANITY_DATASET=production");
  console.error("SANITY_STUDIO_PROJECT_ID=jrg1q51h");
  console.error("SANITY_STUDIO_DATASET=production");
  console.error("SANITY_AUTH_TOKEN=<write token from sanity.io/manage>");
  process.exit(1);
}

async function verifyWriteAccess() {
  try {
    await client.fetch("*[_id == $id][0]._id", { id: "siteSettings" });
  } catch (error) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      console.error("");
      console.error("Sanity token does not have access to this project.");
      console.error(`Project: ${projectId}`);
      console.error(`Dataset: ${dataset}`);
      console.error("");
      console.error("Fix in Sanity Manage:");
      console.error("1. Open the project with this exact project ID.");
      console.error("2. Make sure your Sanity user is invited as a project member.");
      console.error("3. Create a new API token from that project, with Editor/Write permissions.");
      console.error("4. Replace SANITY_AUTH_TOKEN in .env.local and run this importer again.");
      process.exit(1);
    }

    throw error;
  }
}

function numericGallery(first, last) {
  return Array.from({ length: last - first + 1 }, (_, index) => `Visualizations/${first + index}.png`);
}

function resolveProjectFolder(folderNumber) {
  const folderName = readdirSync(assetsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .find((name) => name.startsWith(folderNumber));

  if (!folderName) {
    throw new Error(`Could not find project folder starting with ${folderNumber}`);
  }

  return path.join(assetsRoot, folderName);
}

async function createProjectImage(projectFolder, relativePath, alt, key) {
  const filePath = path.join(projectFolder, relativePath);

  if (!existsSync(filePath)) {
    throw new Error(`Missing image: ${filePath}`);
  }

  const asset = await uploadImageAsset(filePath);

  return {
    _type: "projectImage",
    ...(key ? { _key: key } : {}),
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt,
  };
}

async function uploadImageAsset(filePath) {
  if (assetCache.has(filePath)) return assetCache.get(filePath);

  if (dryRun) {
    const dryAsset = { _id: `dry-run-${path.basename(filePath)}` };
    assetCache.set(filePath, dryAsset);
    return dryAsset;
  }

  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: path.basename(filePath),
    source: {
      name: "Lagom local project importer",
      id: path.relative(rootDir, filePath).replaceAll("\\", "/"),
    },
  });

  assetCache.set(filePath, asset);
  return asset;
}

function toPortableText(paragraphs) {
  return paragraphs.map((paragraph, index) => ({
    _key: `p${index}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `p${index}span0`,
        _type: "span",
        marks: [],
        text: paragraph,
      },
    ],
  }));
}
