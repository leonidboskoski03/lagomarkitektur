import type { Project } from "../types/project";

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
  prefix: string;
  title: string;
  tags: string[];
  properties: string[];
  image: string;
  thumbnail: string;
  secondaryImage: string;
}

export const projectShowcaseIntro = {
  index: "00",
  title: "Selected work",
  tags: ["Lagom Arkitektur", "Selected work", "Spatial portfolio"],
  properties: ["Architecture", "Interiors", "2022-2026"],
};

export const projects: Project[] = [
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
    gallery: gallery(folder.quiet, [
      "Pictures from the apartment - realized project/1.jpg",
      "Pictures from the apartment - realized project/2.jpg",
      "Pictures from the apartment - realized project/3.jpg",
      "Pictures from the apartment - realized project/4.jpg",
      "Visualizations/1.png",
      "Visualizations/2.png",
    ]),
    credits: "Site size: 54 sqm",
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
    credits: "Site size: 75 sqm",
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
    credits: "Site size: 64 sqm",
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
    credits: "Site size: 186 sqm",
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
    credits: "Site size: 140 sqm",
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
    credits: "Site size: 12 sqm",
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
    credits: "Site size: 25 sqm",
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
    credits: "Site size: 45 sqm",
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
    gallery: gallery(folder.oak, [
      "Visualizations/1.png",
      "Visualizations/2.png",
      "Visualizations/3.png",
      "Visualizations/4.png",
      "Visualizations/5.png",
      "Visualizations/6.png",
    ]),
    credits: "Site size: 60 sqm",
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
    credits: "Site size: 12 sqm",
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
    credits: "Site size: 11 sqm",
    isFeatured: false,
  },
];

export const projectShowcaseProjects: ProjectShowcaseItem[] = projects.slice(0, 5).map((project) => ({
  id: project.id,
  index: project.id,
  slug: project.slug,
  prefix: project.title.split(" ")[0].replace("'", ""),
  title: project.title.replace(/^.*? - /, ""),
  tags: [project.category, project.services[0] ?? "Design", project.year, "Lagom"],
  properties: [project.year, project.location, project.credits],
  image: project.featuredImage,
  thumbnail: project.gallery[1] ?? project.featuredImage,
  secondaryImage: project.gallery[2] ?? project.featuredImage,
}));

export const projectCategories = Array.from(new Set(projects.map((project) => project.category)));

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.isFeatured);
}
