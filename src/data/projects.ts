import type {
  Project,
  ProjectGalleryMedia,
  ProjectStoryPlacement,
} from "../types/project";
import { publicAsset } from "../lib/publicAsset";
import { translateCanonicalValue, type Language } from "../i18n/language";

const projectAssets = import.meta.glob<string>(
  "../assets/LAGOM Arkitektur/**/*.{jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" },
);

function image(folder: string, path: string) {
  const suffix = `${folder}/${path}`.replaceAll("\\", "/").toLowerCase();
  const match = Object.entries(projectAssets).find(([assetPath]) =>
    assetPath.replaceAll("\\", "/").toLowerCase().endsWith(suffix),
  );

  if (!match) {
    throw new Error(`Missing project image: ${folder}/${path}`);
  }

  return match[1];
}

function gallery(folder: string, paths: string[]) {
  return paths.map((path) => image(folder, path));
}

const folder = {
  quiet: "1. Project - A_N - The quiet mid-modernity",
  serene: "2. Project - Serene luxe residence",
  gentleman: "3. Project - Gentleman’s Loft Cave",
  stoneframe: "4. Project - L-28 Stoneframe villa",
  aviator: "5. Project - Lounge bar AVIATOR 2.0",
  archmood: "6. Project - ArchMood interior concept",
  warm: "7. Project - Warm minimal open concept",
  contrast: "8. Project - Contrast & Cohesion Interior",
  oak: "9. Project - The Oak and Shadow cohesion",
  child: "10. Project - Child’s mini creative space",
  blueNest: "11. Project -  Blue Nest 4Y",
} as const;

export interface ProjectShowcaseItem {
  id: string;
  index: string;
  slug: string;
  title: string;
  tags: string[];
  properties: string[];
  image: string;
  thumbnail: string;
  secondaryImage: string;
}

const projectsEn: Project[] = [
  {
    id: "01",
    title: "A|N - The Quiet Mid-Modernity",
    slug: "quiet-mid-modernity",
    excerpt:
      "A contemporary apartment in Malmo blending modern and mid-century influences with natural light, metal details, and warm wood accents.",
    description:
      "Nestled in the heart of Malmo, Sweden, this contemporary apartment beautifully blends modern and mid-century modern design influences to create a stylish yet cozy living space. Its open layout maximizes natural light, with large windows that flood each room with sunlight, enhancing the sense of openness and tranquility. Wooden accents bring warmth to the environment, forming a harmonious contrast with the metal details found throughout the apartment.",
    year: "2024",
    location: "Malmo, Sweden",
    category: "Residential",
    services: ["Interior design", "Spatial planning", "Material concept"],
    featuredImage: image(folder.quiet, "Pictures from the apartment - realized project/1.jpg"),
    thumbnailImage: image(folder.quiet, "Pictures from the apartment - realized project/3.jpg"),
    gallery: gallery(folder.quiet, [
      "Pictures from the apartment - realized project/1.jpg",
      "Pictures from the apartment - realized project/2.jpg",
      "Pictures from the apartment - realized project/3.jpg",
      "Pictures from the apartment - realized project/4.jpg",
      "Visualizations/1.png",
      "Visualizations/2.png",
    ]),
    credits: "54 m²",
    isFeatured: true,
  },
  {
    id: "02",
    title: "Serene Luxe Residence",
    slug: "serene-luxe-residence",
    excerpt:
      "A refined residential concept where open planning, natural materials, and layered lighting create calm everyday luxury.",
    description:
      "This project presents a refined Serene Modern residential concept where architecture, light, and materiality work together to create calm, elegant living environments. The open-plan layout connects living, dining, and kitchen areas into a continuous spatial experience, enhanced by large glazed openings that frame curated city-and-landscape views. A soft, natural palette of wood, stone, and textured surfaces is paired with layered architectural lighting to maintain warmth and clarity throughout the day.",
    year: "2024",
    location: "Shtip, N. Macedonia",
    category: "Residential",
    services: ["Interior concept", "Visualization", "Lighting concept"],
    featuredImage: image(folder.serene, "Visualizations/day version/1.png"),
    gallery: gallery(folder.serene, [
      "Visualizations/day version/1.png",
      "Visualizations/day version/2.png",
      "Visualizations/day version/3.png",
      "Visualizations/day version/4.png",
      "Visualizations/night version/1.png",
      "Visualizations/night version/2.png",
    ]),
    credits: "75 m²",
    isFeatured: true,
  },
  {
    id: "03",
    title: "Gentleman's Loft Cave",
    slug: "gentlemans-loft-cave",
    excerpt:
      "A dark, tactile apartment interior balancing anthracite surfaces, cherry wood, orange upholstery, and collected furniture pieces.",
    description:
      "This apartment is conceived as a refined contemporary man cave, balancing a dark, smoky atmosphere with curated elegance. An anthracite microcement floor forms a continuous, monolithic base, setting a dramatic tone while contrasting intentionally with the warmth of the cherry wood kitchen and the bold orange upholstery of the sofa. The result is a space that feels masculine and intimate, yet polished, timeless, and aesthetically composed.",
    year: "2022",
    location: "Skopje, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Furniture curation", "Material concept"],
    featuredImage: image(folder.gentleman, "Visualizations/1.png"),
    gallery: gallery(folder.gentleman, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ]),
    credits: "64 m²",
    isFeatured: true,
  },
  {
    id: "04",
    title: "L-28 Stoneframe Villa",
    slug: "l-28-stoneframe-villa",
    excerpt:
      "A contemporary courtyard home framed by natural stone, plaster, warm wood, and private outdoor lounges.",
    description:
      "L-28 Stoneframe Villa is a contemporary courtyard home that blends architectural clarity with everyday comfort. Clean horizontal volumes are framed by natural stone, plaster, and warm wood to create a timeless, welcoming identity. Large glazed openings connect interior spaces with private outdoor lounges, allowing light and landscape to shape the living experience. Integrated linear lighting emphasizes the architectural edges and adds atmosphere after sunset.",
    year: "2025",
    location: "Prilep, N. Macedonia",
    category: "Residential",
    services: ["Architecture", "Exterior concept", "Visualization"],
    featuredImage: image(folder.stoneframe, "Visualizations/1.png"),
    gallery: gallery(folder.stoneframe, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
    ]),
    credits: "186 m²",
    isFeatured: true,
  },
  {
    id: "05",
    title: "Lounge Bar Aviator 2.0",
    slug: "lounge-bar-aviator",
    excerpt:
      "A contemporary hospitality interior shaped with warm wood, stone texture, soft light, and calm urban openness.",
    description:
      "This contemporary restaurant interior is designed as a refined extension of the city mall, blending hospitality with architectural character. Warm wood, textured stone surfaces, and soft integrated lighting create an inviting atmosphere for everyday dining and social interaction. Carefully composed seating zones balance openness with comfort and privacy, while greenery softens the material palette and enhances the guest experience.",
    year: "2023",
    location: "Skopje, N. Macedonia",
    category: "Hospitality",
    services: ["Interior design", "Hospitality concept", "Visualization"],
    featuredImage: image(folder.aviator, "Visualizations/1.png"),
    gallery: gallery(folder.aviator, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ]),
    credits: "140 m²",
    isFeatured: true,
  },
  {
    id: "06",
    title: "ArchMood Interior Concept",
    slug: "archmood-interior-concept",
    excerpt:
      "A compact shared bedroom transformed into warm, functional zones for rest, grooming, reading, and daily rituals.",
    description:
      "This compact room transformation was a challenge in both space optimization and aesthetic balance. Originally a very small and limited area, the goal was to reimagine it into a warm, functional, and stylish shared bedroom for two teenage girls. Two comfortable single beds, a dedicated make-up and grooming area, and a cozy reading corner give each person a personalized zone within a calm shared interior.",
    year: "2025",
    location: "Skopje, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Small-space planning", "Visualization"],
    featuredImage: image(folder.archmood, "Visualizations/1.png"),
    gallery: gallery(folder.archmood, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ]),
    credits: "12 m²",
    isFeatured: false,
  },
  {
    id: "07",
    title: "Warm Minimal Open Concept",
    slug: "warm-minimal-open-concept",
    excerpt:
      "A compact apartment retreat where kitchen, dining, and lounge areas flow through soft geometry and neutral materiality.",
    description:
      "This apartment is conceived as a warm-modern retreat for two, where open planning and soft geometry create a continuous living experience. Kitchen, dining, and lounge areas flow naturally, enhanced by neutral palettes, wood textures, and stone finishes. Built-in storage and custom furniture optimize the compact footprint, while large openings and reflective surfaces amplify natural light and visual continuity throughout the home.",
    year: "2024",
    location: "Prilep, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Custom furniture", "Visualization"],
    featuredImage: image(folder.warm, "Visualizations/1.png"),
    gallery: gallery(folder.warm, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
    ]),
    credits: "25 m²",
    isFeatured: false,
  },
  {
    id: "08",
    title: "Contrast & Cohesion Interior",
    slug: "contrast-cohesion-interior",
    excerpt:
      "A serious, modern living and dining interior built around pepita pattern, black leather, brown leather, and artful wall composition.",
    description:
      "At the request of the customers, this design helped define the direction for a living room and dining area with a more serious character and modern elements. Furniture material, color, and dining-room wall decoration carry the concept. The pepita pattern and black leather armchairs, combined with the brown leather sofa, create a matched contrast that gives the space depth and confidence.",
    year: "2022",
    location: "Skopje, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Material selection", "Visualization"],
    featuredImage: image(folder.contrast, "Visualizations/1.png"),
    gallery: gallery(folder.contrast, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
    ]),
    credits: "45 m²",
    isFeatured: false,
  },
  {
    id: "09",
    title: "The Oak and Shadow Cohesion",
    slug: "oak-shadow-cohesion",
    excerpt:
      "A contemporary apartment interior where warm oak, natural stone, matte black elements, and Nordic blue accents frame flexible living.",
    description:
      "This contemporary apartment interior is defined by material contrast, spatial flexibility, and refined architectural composition. Warm oak volumes and natural stone surfaces are framed by deep matte black elements, creating a layered dialogue between light and shadow throughout the home. A transformable living and dining area, dedicated bay-window office, and boutique-hotel bedroom build a calm, flexible residential experience.",
    year: "2026",
    location: "Bitola, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Joinery concept", "Visualization"],
    featuredImage: image(folder.oak, "Visualizations/1.png"),
    thumbnailImage: image(folder.oak, "Visualizations/22.png"),
    gallery: gallery(folder.oak, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ]),
    credits: "60 m²",
    isFeatured: true,
  },
  {
    id: "10",
    title: "Child's Mini Creative Space",
    slug: "childs-mini-creative-space",
    excerpt:
      "A child's room shaped as a small personal studio for study, drawing, rest, shared play, and independence.",
    description:
      "This project transforms a room into a child's personal studio for creativity and comfort. Planned around a fixed wardrobe position, the interior unfolds into functional zones for studying, drawing, resting, and shared playtime. Warm materials, playful textures, and balanced proportions give the space architectural clarity while remaining inviting and soft. Natural light and calm colors frame daily activities, allowing the room to grow with the child.",
    year: "2023",
    location: "Prilep, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Children's room concept", "Visualization"],
    featuredImage: image(folder.child, "Visualizations/1.png"),
    gallery: gallery(folder.child, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
    ]),
    credits: "12 m²",
    isFeatured: false,
  },
  {
    id: "11",
    title: "Blue Nest 4Y",
    slug: "blue-nest-4y",
    excerpt:
      "A calm, playful kids interior blending Nordic minimalism, soft geometry, natural wood, and muted blue accents.",
    description:
      "Project Blue Nest is a calm, playful, and architectural kids interior designed for a 4-year-old boy. The space blends Nordic minimalism with soft geometry, natural wood, and muted blue accents to create a balanced environment for sleep, play, and creativity. Clean lines, built-in storage, and sculpted forms transform the room into a small architectural landscape where function meets imagination.",
    year: "2024",
    location: "Skopje, N. Macedonia",
    category: "Residential",
    services: ["Interior design", "Children's room concept", "Visualization"],
    featuredImage: image(folder.blueNest, "Visualizations/1.png"),
    gallery: gallery(folder.blueNest, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
    ]),
    credits: "11 m²",
    isFeatured: false,
  },
];

type ProjectTranslation = Pick<Project, "title" | "excerpt" | "description" | "location">;

const swedishProjectCopy: Record<string, ProjectTranslation> = {
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
    description: "Lägenheten är utformad som en förfinad, samtida man cave där en mörk, rökig atmosfär balanseras med omsorgsfull elegans. Ett antracitfärgat mikrocementgolv bildar en sammanhängande, monolitisk bas och sätter en dramatisk ton, samtidigt som det avsiktligt kontrasterar mot kökets varma körsbärsträ och soffans djärva orange klädsel. Resultatet är ett rum som känns maskulint och intimt, men samtidigt elegant, tidlöst och estetiskt välkomponerat.",
    location: "Skopje, Nordmakedonien",
  },
  "l-28-stoneframe-villa": {
    title: "L-28 Stoneframe Villa",
    excerpt: "Ett samtida gårdshus inramat av natursten, puts, varmt trä och privata uteplatser.",
    description: "L-28 Stoneframe Villa är ett samtida gårdshus som förenar arkitektonisk tydlighet med vardaglig komfort. Rena horisontella volymer ramas in av natursten, puts och varmt trä och skapar ett tidlöst, välkomnande uttryck. Stora glaspartier förbinder interiören med privata uteplatser och låter ljus och landskap forma boendeupplevelsen. Integrerad linjär belysning framhäver de arkitektoniska kanterna och tillför atmosfär efter solnedgången.",
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
    description: "Lägenheten är utformad som en varm och modern tillflyktsplats för två, där öppen planering och mjuk geometri skapar en sammanhängande boendeupplevelse. Kök, matplats och vardagsrum flyter naturligt samman, förstärkta av neutrala paletter, trätexturer och stenytor. Inbyggd förvaring och specialritade möbler optimerar den kompakta ytan, medan stora öppningar och reflekterande ytor förstärker dagsljuset och den visuella kontinuiteten genom hela hemmet.",
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
    description: "Projektet förvandlar ett rum till barnets personliga studio för kreativitet och komfort. Med utgångspunkt i garderobens fasta placering delas interiören in i funktionella zoner för studier, teckning, vila och gemensam lek. Varma material, lekfulla texturer och balanserade proportioner ger rummet arkitektonisk tydlighet samtidigt som det förblir inbjudande och mjukt. Naturligt ljus och lugna färger ramar in vardagens aktiviteter och låter rummet växa med barnet.",
    location: "Prilep, Nordmakedonien",
  },
  "blue-nest-4y": {
    title: "Blue Nest 4Y",
    excerpt: "En lugn och lekfull barninteriör som förenar nordisk minimalism, mjuk geometri, naturligt trä och dämpade blå accenter.",
    description: "Projektet Blue Nest är en lugn, lekfull och arkitektonisk barninteriör utformad för en fyraårig pojke. Rummet förenar nordisk minimalism med mjuk geometri, naturligt trä och dämpade blå accenter och skapar en balanserad miljö för sömn, lek och kreativitet. Rena linjer, inbyggd förvaring och skulpturala former förvandlar rummet till ett litet arkitektoniskt landskap där funktion möter fantasi.",
    location: "Skopje, Nordmakedonien",
  },
};

const projectsSv: Project[] = projectsEn.map((project) => ({
  ...project,
  ...swedishProjectCopy[project.slug],
  category: translateCanonicalValue(project.category, "sv"),
  services: project.services.map((service) => translateCanonicalValue(service, "sv")),
}));

export const projects = projectsSv;

export function getProjects(language: Language): Project[] {
  return language === "sv" ? projectsSv : projectsEn;
}

const projectShowcaseIntros = {
  sv: {
    index: "00", title: "Utvalda arbeten",
    tags: ["Lagom Arkitektur", "Utvalda projekt", "Rumslig portfolio"],
    properties: ["Arkitektur", "Interiörer", "2022–2026"],
  },
  en: {
    index: "00", title: "Selected work",
    tags: ["Lagom Arkitektur", "Selected work", "Spatial portfolio"],
    properties: ["Architecture", "Interiors", "2022-2026"],
  },
} as const;

function createProjectShowcaseProjects(language: Language): ProjectShowcaseItem[] {
  return getProjects(language).slice(0, 5).map((project) => ({
  id: project.id,
  index: project.id,
  slug: project.slug,
  title: project.title,
  tags: [project.category, project.services[0] ?? "Design", project.year, "Lagom"],
  properties: [project.year, project.location, project.credits],
  image: project.featuredImage,
  thumbnail: project.gallery[1] ?? project.featuredImage,
  secondaryImage: project.gallery[2] ?? project.featuredImage,
  }));
}

export const projectShowcaseIntro = projectShowcaseIntros.sv;
export const projectShowcaseProjects = createProjectShowcaseProjects("sv");

export function getProjectShowcaseIntro(language: Language) {
  return projectShowcaseIntros[language];
}

export function getProjectShowcaseProjects(language: Language) {
  return createProjectShowcaseProjects(language);
}

export const projectCategories = Array.from(new Set(projects.map((project) => project.category)));

const galleryDimensions: Record<string, ReadonlyArray<readonly [number, number]>> = {
  "01": [[4032, 2688], [4032, 2268], [3024, 3780], [3024, 3024], [1920, 1080], [1920, 1080]],
  "02": [[1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024]],
  "03": [[1920, 1080], [1920, 1080], [1816, 1062], [1920, 1080], [1920, 1080], [1811, 1080]],
  "04": [[1672, 941], [1672, 941], [1672, 941], [1830, 1080]],
  "05": [[1536, 1024], [1295, 1024], [1536, 1024], [1536, 1024], [1536, 1024], [1920, 1000]],
  "06": [[1920, 1080], [1536, 1024], [1920, 1080], [1920, 1080], [1920, 1080], [1536, 1024]],
  "07": [[2100, 1181], [2100, 1181], [2100, 1181], [2100, 1181], [2100, 1181]],
  "08": [[1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024]],
  "09": [[1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080]],
  "10": [[1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024], [1536, 1024]],
  "11": [[1536, 1024], [1536, 1024], [1536, 1024], [1920, 1200], [1536, 1024]],
};

const defaultStoryPlacements: readonly ProjectStoryPlacement[] = [
  "wide",
  "portrait-left",
  "portrait-center",
  "portrait-right",
  "landscape-left",
  "landscape-right",
];

export function getProjectGalleryMedia(
  project: Project,
  language: Language = "sv",
): ProjectGalleryMedia[] {
  const dimensions = galleryDimensions[project.id] ?? [];

  return project.gallery.map((src, index) => {
    const [width, height] = dimensions[index] ?? [1600, 1000];

    return {
      id: `${project.id}-gallery-${index}`,
      src,
      previewSrc: publicAsset(`work-previews/${project.id}/${index}.webp`),
      alt: `${project.title} — ${language === "sv" ? "bild" : "view"} ${String(index + 1).padStart(2, "0")}`,
      width,
      height,
      aspectRatio: width / height,
      storyPlacement: defaultStoryPlacements[index % defaultStoryPlacements.length],
    };
  });
}

export function getProjectBySlug(slug: string, language: Language = "sv"): Project | undefined {
  return getProjects(language).find((project) => project.slug === slug);
}

export function getFeaturedProjects(language: Language = "sv"): Project[] {
  return getProjects(language).filter((project) => project.isFeatured);
}
