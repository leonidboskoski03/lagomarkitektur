import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const projectId = "jrg1q51h";
const dataset = "production";
const apiVersion = "2026-08-01";
const applyChanges = process.argv.includes("--apply");

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

if (!token) {
  throw new Error("SANITY_AUTH_TOKEN is missing from .env.local.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

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

function localizedValue(value, swedish, englishFallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      sv: value.sv || swedish,
      en: value.en || englishFallback || value.sv || swedish,
    };
  }

  return {
    sv: swedish,
    en: typeof value === "string" && value.trim() ? value : englishFallback,
  };
}

function portableText(text, key) {
  return [{
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{
      _key: `${key}-span`,
      _type: "span",
      marks: [],
      text,
    }],
  }];
}

function localizedPortableText(value, swedish, key) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      sv: Array.isArray(value.sv) && value.sv.length ? value.sv : portableText(swedish, `${key}-sv`),
      en: Array.isArray(value.en) && value.en.length ? value.en : portableText(swedish, `${key}-en`),
    };
  }

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing English rich text for ${key}.`);
  }

  return {
    sv: portableText(swedish, `${key}-sv`),
    en: value,
  };
}

function localizedImage(image, swedishAlt) {
  if (!image) return image;

  const nextImage = {
    ...image,
    _type: "projectImage",
    alt: localizedValue(image.alt, swedishAlt, swedishAlt),
  };

  if (image.caption) {
    nextImage.caption = localizedValue(image.caption, swedishAlt, swedishAlt);
  }

  return nextImage;
}

function collectAssetReferences(value, references = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetReferences(item, references));
    return references;
  }

  if (!value || typeof value !== "object") return references;
  if (value._type === "reference" && typeof value._ref === "string" && value._ref.startsWith("image-")) {
    references.push(value._ref);
  }
  Object.values(value).forEach((item) => collectAssetReferences(item, references));
  return references;
}

function projectPatch(document) {
  const slug = document.slug?.current;
  const swedish = swedishProjectCopy[slug];
  if (!swedish) throw new Error(`No approved Swedish copy exists for ${document._id} (${slug || "missing slug"}).`);

  const englishTitle = typeof document.title === "string" ? document.title : document.title?.en;
  const englishExcerpt = typeof document.excerpt === "string" ? document.excerpt : document.excerpt?.en;
  const englishLocation = typeof document.location === "string" ? document.location : document.location?.en;
  if (!englishTitle || !englishExcerpt || !englishLocation) {
    throw new Error(`Missing English title, excerpt, or location on ${document._id}.`);
  }

  const patch = {
    title: localizedValue(document.title, swedish.title, englishTitle),
    excerpt: localizedValue(document.excerpt, swedish.excerpt, englishExcerpt),
    description: localizedPortableText(document.description, swedish.description, slug),
    location: localizedValue(document.location, swedish.location, englishLocation),
    seoTitle: localizedValue(document.seoTitle, swedish.title, englishTitle),
    seoDescription: localizedValue(document.seoDescription, swedish.excerpt, englishExcerpt),
    featuredImage: localizedImage(document.featuredImage, swedish.title),
    gallery: (document.gallery || []).map((image, index) =>
      localizedImage(image, `${swedish.title} bild ${index + 1}`)),
  };

  if (document.thumbnailImage) {
    patch.thumbnailImage = localizedImage(document.thumbnailImage, `${swedish.title} miniatyrbild`);
  }
  if (document.workGallery) {
    patch.workGallery = document.workGallery.map((image, index) =>
      localizedImage(image, `${swedish.title} atlasbild ${index + 1}`));
  }

  return patch;
}

function localizedArray(values, swedishValues, keyPrefix) {
  return (values || []).map((value, index) =>
    ({
      _key: value?._key || `${keyPrefix}-${index + 1}`,
      _type: "localizedString",
      ...localizedValue(
        value,
        swedishValues[index] || swedishValues.at(-1),
        typeof value === "string" ? value : value?.en,
      ),
    }));
}

function showcasePatch(document) {
  return {
    introTitle: localizedValue(document.introTitle, "Utvalda arbeten", "Selected work"),
    introTags: localizedArray(document.introTags, [
      "Lagom Arkitektur",
      "Utvalda projekt",
      "Rumslig portfolio",
    ], "intro-tag"),
    introProperties: localizedArray(document.introProperties, [
      "Arkitektur",
      "Interiörer",
      "2022–2026",
    ], "intro-property"),
    introBackground: localizedImage(document.introBackground, "Utvalda projekt, bakgrundsbild"),
    projects: (document.projects || []).map((item, index) => ({
      ...item,
      ...(item.backgroundImage
        ? { backgroundImage: localizedImage(item.backgroundImage, `Utvalt projekt ${index + 1}, bakgrundsbild`) }
        : {}),
      primaryImage: localizedImage(item.primaryImage, `Utvalt projekt ${index + 1}, bild 1`),
      secondaryImage: localizedImage(item.secondaryImage, `Utvalt projekt ${index + 1}, bild 2`),
    })),
  };
}

const documents = await client.fetch(`*[
  _type == "project" || _type == "homeProjectShowcase"
]`);
const projectDocuments = documents.filter((document) => document._type === "project");
const publishedSlugs = new Set(
  projectDocuments
    .filter((document) => !document._id.startsWith("drafts."))
    .map((document) => document.slug?.current),
);
const expectedSlugs = Object.keys(swedishProjectCopy);

if (publishedSlugs.size !== expectedSlugs.length || expectedSlugs.some((slug) => !publishedSlugs.has(slug))) {
  throw new Error(`Expected exactly ${expectedSlugs.length} published projects matching the approved copy; found ${publishedSlugs.size}.`);
}

const plannedPatches = documents.map((document) => {
  const patch = document._type === "project" ? projectPatch(document) : showcasePatch(document);
  const beforeAssets = collectAssetReferences(document).sort();
  const afterAssets = collectAssetReferences(patch).sort();
  if (JSON.stringify(beforeAssets) !== JSON.stringify(afterAssets)) {
    throw new Error(`Asset-reference safety check failed for ${document._id}.`);
  }
  return {
    id: document._id,
    type: document._type,
    patch,
    removeIsFeatured: document._type === "project" && Object.hasOwn(document, "isFeatured"),
  };
});

console.log(`${applyChanges ? "Applying" : "Dry run for"} ${plannedPatches.length} Sanity document patches:`);
for (const item of plannedPatches) {
  console.log(`- ${item.id}: bilingual ${item.type}${item.removeIsFeatured ? ", remove obsolete isFeatured" : ""}`);
}

if (!applyChanges) {
  console.log("No data changed. Re-run with --apply after reviewing this plan.");
  process.exit(0);
}

let transaction = client.transaction();
for (const item of plannedPatches) {
  transaction = transaction.patch(item.id, (patch) => {
    const nextPatch = patch.set(item.patch);
    return item.removeIsFeatured ? nextPatch.unset(["isFeatured"]) : nextPatch;
  });
}

const result = await transaction.commit({ autoGenerateArrayKeys: true });
console.log(`Migration committed successfully (${result.documentIds.length} documents).`);
