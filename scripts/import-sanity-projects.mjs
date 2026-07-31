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
    siteSize: "54 m²",
    services: ["Interior design", "Spatial planning", "Material concept"],
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
    siteSize: "75 m²",
    services: ["Interior concept", "Visualization", "Lighting concept"],
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
    siteSize: "64 m²",
    services: ["Interior design", "Furniture curation", "Material concept"],
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
    siteSize: "186 m²",
    services: ["Architecture", "Exterior concept", "Visualization"],
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
    siteSize: "140 m²",
    services: ["Interior design", "Hospitality concept", "Visualization"],
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
    siteSize: "12 m²",
    services: ["Interior design", "Small-space planning", "Visualization"],
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
    siteSize: "25 m²",
    services: ["Interior design", "Custom furniture", "Visualization"],
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
    siteSize: "45 m²",
    services: ["Interior design", "Material selection", "Visualization"],
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
    siteSize: "60 m²",
    services: ["Interior design", "Joinery concept", "Visualization"],
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
    siteSize: "12 m²",
    services: ["Interior design", "Children's room concept", "Visualization"],
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
    siteSize: "11 m²",
    services: ["Interior design", "Children's room concept", "Visualization"],
    orderRank: 110,
    featuredImage: "Visualizations/1.png",
    thumbnailImage: "Visualizations/2.png",
    gallery: numericGallery(1, 5),
  },
];

const swedishProjectCopy = {
  "quiet-mid-modernity": {
    title: "A|N - The Quiet Mid-Modernity",
    excerpt: "En samtida lägenhet i Malmö som förenar moderna influenser med mid-century-design, naturligt ljus, metalldetaljer och varma träinslag.",
    description: "I hjärtat av Malmö ligger denna samtida lägenhet, där moderna influenser och mid-century-design förenas till ett stilfullt men ombonat hem. Den öppna planlösningen tar till vara på dagsljuset, och stora fönster fyller varje rum med sol och förstärker känslan av rymd och stillhet. Träinslag tillför värme och bildar en harmonisk kontrast mot lägenhetens metalldetaljer.",
    location: "Malmö, Sverige",
  },
  "serene-luxe-residence": {
    title: "Serene Luxe Residence",
    excerpt: "Ett förfinat bostadskoncept där öppen planlösning, naturliga material och ljussättning i flera lager skapar en stillsam vardagslyx.",
    description: "Projektet presenterar ett förfinat, modernt och harmoniskt bostadskoncept där arkitektur, ljus och materialitet samverkar för att skapa lugna och eleganta livsmiljöer. Den öppna planlösningen binder samman vardagsrum, matplats och kök till en kontinuerlig rumslig upplevelse, förstärkt av stora glaspartier som ramar in noggrant utvalda vyer över stad och landskap. En mjuk, naturlig palett av trä, sten och texturerade ytor kombineras med arkitektonisk ljussättning i flera lager för att bevara värme och tydlighet under hela dagen.",
    location: "Štip, Nordmakedonien",
  },
  "gentlemans-loft-cave": {
    title: "Gentleman's Loft Cave",
    excerpt: "En mörk och taktil lägenhetsinteriör som balanserar antracitfärgade ytor, körsbärsträ, orange klädsel och utvalda möbler.",
    description: "Lägenheten är utformad som en förfinad, samtida man cave där en mörk, rökig atmosfär balanseras med omsorgsfull elegans. Ett antracitfärgat mikrocementgolv bildar en sammanhängande, monolitisk bas och sätter en dramatisk ton, samtidigt som det avsiktligt kontrasterar mot kökets varma körsbärsträ och den djärva orange klädseln. Resultatet är ett rum som känns maskulint och intimt, men samtidigt elegant, tidlöst och estetiskt välkomponerat.",
    location: "Skopje, Nordmakedonien",
  },
  "l-28-stoneframe-villa": {
    title: "L-28 Stoneframe Villa",
    excerpt: "Ett samtida gårdshus inramat av natursten, puts, varmt trä och privata uteplatser.",
    description: "L-28 Stoneframe Villa är ett samtida gårdshus som förenar arkitektonisk tydlighet med vardaglig komfort. Rena horisontella volymer ramas in av natursten, puts och varmt trä och skapar ett tidlöst, välkomnande uttryck. Stora glaspartier förbinder interiören med privata uteplatser och låter ljus och landskap forma boendeupplevelsen.",
    location: "Prilep, Nordmakedonien",
  },
  "lounge-bar-aviator": {
    title: "Lounge Bar Aviator 2.0",
    excerpt: "En samtida restauranginteriör formad av varmt trä, stenens textur, mjukt ljus och en lugn, urban öppenhet.",
    description: "Denna samtida restauranginteriör är utformad som en förfinad förlängning av stadens köpcentrum och förenar gästfrihet med arkitektonisk karaktär. Varmt trä, texturerade stenytor och mjuk integrerad belysning skapar en inbjudande atmosfär för vardagliga måltider och sociala möten. Omsorgsfullt komponerade sittzoner balanserar öppenhet med komfort och avskildhet, medan grönska mjukar upp materialpaletten och förhöjer gästupplevelsen.",
    location: "Skopje, Nordmakedonien",
  },
  "archmood-interior-concept": {
    title: "ArchMood Interior Concept",
    excerpt: "Ett kompakt delat sovrum omvandlat till varma, funktionella zoner för vila, skönhetsrutiner, läsning och vardagliga ritualer.",
    description: "Omvandlingen av detta kompakta rum innebar en utmaning både vad gäller ytoptimering och estetisk balans. Utgångspunkten var en mycket liten och begränsad yta, och målet var att omgestalta den till ett varmt, funktionellt och stilfullt delat sovrum för två tonårsflickor. Två bekväma enkelsängar, en särskild plats för smink och skönhetsrutiner samt en mysig läshörna ger var och en en personlig zon i en lugn, gemensam interiör.",
    location: "Skopje, Nordmakedonien",
  },
  "warm-minimal-open-concept": {
    title: "Warm Minimal Open Concept",
    excerpt: "En kompakt lägenhet där kök, matplats och vardagsrum flyter samman genom mjuk geometri och neutral materialitet.",
    description: "Lägenheten är utformad som en varm och modern tillflyktsplats för två, där öppen planering och mjuk geometri skapar en sammanhängande boendeupplevelse. Kök, matplats och vardagsrum flyter naturligt samman, förstärkta av neutrala paletter, trätexturer och stenytor. Inbyggd förvaring och specialritade möbler optimerar den kompakta ytan, medan stora öppningar och reflekterande ytor förstärker dagsljuset och den visuella kontinuiteten.",
    location: "Prilep, Nordmakedonien",
  },
  "contrast-cohesion-interior": {
    title: "Contrast & Cohesion Interior",
    excerpt: "En sober och modern vardags- och matsalsinteriör uppbyggd kring pepitamönster, svart läder, brunt läder och en konstnärligt komponerad vägg.",
    description: "På kundernas önskemål hjälpte denna gestaltning till att ange riktningen för ett vardagsrum och en matplats med en mer sober karaktär och moderna inslag. Möblernas material och färger samt dekorationen av matsalens vägg bär konceptet. Pepitamönstret och de svarta läderfåtöljerna skapar tillsammans med den bruna lädersoffan en välavvägd kontrast som ger rummet djup och pondus.",
    location: "Skopje, Nordmakedonien",
  },
  "oak-shadow-cohesion": {
    title: "The Oak and Shadow Cohesion",
    excerpt: "En samtida lägenhetsinteriör där varm ek, natursten, mattsvarta element och nordiskt blå accenter ramar in ett flexibelt boende.",
    description: "Denna samtida lägenhetsinteriör definieras av materialkontrast, rumslig flexibilitet och en förfinad arkitektonisk komposition. Volymer i varm ek och ytor av natursten ramas in av djupa mattsvarta element och skapar en skiktad dialog mellan ljus och skugga. Ett föränderligt vardags- och matrum, en arbetsplats i burspråket och ett sovrum med boutiquehotellkänsla bildar en lugn och flexibel bostadsmiljö.",
    location: "Bitola, Nordmakedonien",
  },
  "childs-mini-creative-space": {
    title: "Child's Mini Creative Space",
    excerpt: "Ett barnrum format som en liten personlig studio för studier, teckning, vila, gemensam lek och självständighet.",
    description: "Projektet förvandlar ett rum till barnets personliga studio för kreativitet och komfort. Med utgångspunkt i garderobens fasta placering delas interiören in i funktionella zoner för studier, teckning, vila och gemensam lek. Varma material, lekfulla texturer och balanserade proportioner ger rummet arkitektonisk tydlighet samtidigt som det förblir inbjudande och mjukt.",
    location: "Prilep, Nordmakedonien",
  },
  "blue-nest-4y": {
    title: "Blue Nest 4Y",
    excerpt: "En lugn och lekfull barninteriör som förenar nordisk minimalism, mjuk geometri, naturligt trä och dämpade blå accenter.",
    description: "Projektet Blue Nest är en lugn, lekfull och arkitektonisk barninteriör utformad för en fyraårig pojke. Rummet förenar nordisk minimalism med mjuk geometri, naturligt trä och dämpade blå accenter och skapar en balanserad miljö för sömn, lek och kreativitet. Rena linjer, inbyggd förvaring och skulpturala former förvandlar rummet till ett litet arkitektoniskt landskap där funktion möter fantasi.",
    location: "Skopje, Nordmakedonien",
  },
};

const assetCache = new Map();

console.log(`${dryRun ? "Dry run: " : ""}Importing ${projects.length} projects to ${projectId}/${dataset}`);

if (!dryRun) {
  await verifyWriteAccess();
}

for (const project of projects) {
  const swedish = swedishProjectCopy[project.slug];
  if (!swedish) throw new Error(`Missing Swedish copy for ${project.slug}`);
  const folder = resolveProjectFolder(project.folderNumber);
  const featuredImage = await createProjectImage(
    folder,
    project.featuredImage,
    { sv: swedish.title, en: project.title },
  );
  const thumbnailImage = project.thumbnailImage
    ? await createProjectImage(folder, project.thumbnailImage, {
      sv: `${swedish.title} miniatyrbild`,
      en: `${project.title} thumbnail`,
    })
    : undefined;
  const gallery = [];

  for (const [index, imagePath] of project.gallery.entries()) {
    gallery.push(await createProjectImage(
      folder,
      imagePath,
      {
        sv: `${swedish.title} bild ${index + 1}`,
        en: `${project.title} image ${index + 1}`,
      },
      `galleryImage${index}`,
    ));
  }

  const document = {
    _id: `project-${project.slug}`,
    _type: "project",
    title: { sv: swedish.title, en: project.title },
    slug: { _type: "slug", current: project.slug },
    excerpt: { sv: swedish.excerpt, en: project.excerpt },
    description: {
      sv: toPortableText([swedish.description]),
      en: toPortableText(project.description),
    },
    year: project.year,
    location: { sv: swedish.location, en: project.location },
    category: project.category,
    siteSize: project.siteSize,
    services: project.services,
    featuredImage,
    ...(thumbnailImage ? { thumbnailImage } : {}),
    gallery,
    isPublished: true,
    orderRank: project.orderRank,
    seoTitle: { sv: swedish.title, en: project.title },
    seoDescription: { sv: swedish.excerpt, en: project.excerpt },
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
