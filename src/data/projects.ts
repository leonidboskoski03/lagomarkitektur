import type { Project } from "../types/project";
import quietMidModernityHero from "../assets/LAGOM Arkitektur/1. Project - A_N - The quiet mid-modernity/Pictures from the apartment - realized project/1.jpg";
import quietMidModernityThumb from "../assets/LAGOM Arkitektur/1. Project - A_N - The quiet mid-modernity/Visualizations/1.png";
import sereneLuxeHero from "../assets/LAGOM Arkitektur/2. Project - Serene luxe residence/Visualizations/day version/1.png";
import sereneLuxeThumb from "../assets/LAGOM Arkitektur/2. Project - Serene luxe residence/Visualizations/night version/1.png";
import gentlemanLoftHero from "../assets/LAGOM Arkitektur/3. Project - Gentleman’s Loft Cave/Visualizations/1.png";
import gentlemanLoftThumb from "../assets/LAGOM Arkitektur/3. Project - Gentleman’s Loft Cave/Visualizations/2.png";
import stoneframeHero from "../assets/LAGOM Arkitektur/4. Project - L-28 Stoneframe villa/Visualizations/1.png";
import stoneframeThumb from "../assets/LAGOM Arkitektur/4. Project - L-28 Stoneframe villa/Visualizations/2.png";
import aviatorHero from "../assets/LAGOM Arkitektur/5. Project - Lounge bar AVIATOR 2.0/Visualizations/1.png";
import aviatorThumb from "../assets/LAGOM Arkitektur/5. Project - Lounge bar AVIATOR 2.0/Visualizations/2.png";

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
}

export const projectShowcaseProjects: ProjectShowcaseItem[] = [
  {
    id: "01",
    index: "01",
    slug: "quiet-mid-modernity",
    prefix: "A/N",
    title: "The Quiet Mid-Modernity",
    tags: ["Apartment", "Minimalism", "Natural", "Materials"],
    properties: ["2023", "Malmö, Sweden", "Area: 78 sqm"],
    image: quietMidModernityHero,
    thumbnail: quietMidModernityThumb,
  },
  {
    id: "02",
    index: "02",
    slug: "serene-luxe-residence",
    prefix: "S/L",
    title: "Serene Luxe Residence",
    tags: ["Residence", "Soft luxury", "Warm stone", "Interior"],
    properties: ["2024", "Skopje", "Area: 146 sqm"],
    image: sereneLuxeHero,
    thumbnail: sereneLuxeThumb,
  },
  {
    id: "03",
    index: "03",
    slug: "gentlemans-loft-cave",
    prefix: "G/L",
    title: "Gentleman’s Loft Cave",
    tags: ["Loft", "Private lounge", "Dark timber", "Atmosphere"],
    properties: ["2024", "Urban residence", "Area: 112 sqm"],
    image: gentlemanLoftHero,
    thumbnail: gentlemanLoftThumb,
  },
  {
    id: "04",
    index: "04",
    slug: "l-28-stoneframe-villa",
    prefix: "L-28",
    title: "Stoneframe Villa",
    tags: ["Villa", "Architecture", "Stone", "Courtyard"],
    properties: ["2024", "Residential", "Area: 240 sqm"],
    image: stoneframeHero,
    thumbnail: stoneframeThumb,
  },
  {
    id: "05",
    index: "05",
    slug: "lounge-bar-aviator",
    prefix: "AV",
    title: "Lounge Bar Aviator 2.0",
    tags: ["Hospitality", "Bar", "Moody", "Lighting"],
    properties: ["2023", "Commercial", "Area: 185 sqm"],
    image: aviatorHero,
    thumbnail: aviatorThumb,
  },
];

export const projects: Project[] = [
  {
    id: "01",
    title: "Villa Skärgård",
    slug: "villa-skargard",
    excerpt: "En modern sommarvilla på Stockholms södra skärgård med fokus på ljus, material och landskap.",
    description:
      "Villa Skärgård ligger på en klippig udde i Stockholms södra skärgård. Huset är utformat som en serie sammanlänkade volymer som följer terrängens naturliga former. Stora glaspartier öppnar upp mot havet i söder medan träfasaden i termobehandlad furu smälter in i tallskogen. Interiören präglas av ljusa ytor, ekparkett och skräddarsydda detaljer i mässing och natursten.",
    year: "2024",
    location: "Stockholms skärgård",
    category: "Villor",
    services: ["Arkitektur", "Inredning", "Bygglovshandlingar", "Projektledning"],
    featuredImage: "/images/projects/project-01/hero.jpg",
    gallery: [
      "/images/projects/project-01/01.jpg",
      "/images/projects/project-01/02.jpg",
      "/images/projects/project-01/03.jpg",
      "/images/projects/project-01/04.jpg",
    ],
    credits: "Foto: Johan Pihlström. Byggherre: Privat.",
    isFeatured: true,
  },
  {
    id: "02",
    title: "Stadsvåning Östermalm",
    slug: "stadsvaning-ostermalm",
    excerpt: "Renovering och omgestaltning av en 1800-talsvåning på Östermalm med bevarade originaldetaljer.",
    description:
      "En 1800-talsvåning på Östermalm har varsamt renoverats och omgestaltats med fokus på att bevara och framhäva de ursprungliga detaljerna. Stuckaturer, fiskbensparkett och kakelugnar har restaurerats samtidigt som en modern planlösning har skapats med öppna sällskapsytor. Ett nytt kök i valnöt och skiffer bildar våningens hjärta.",
    year: "2023",
    location: "Östermalm, Stockholm",
    category: "Bostäder",
    services: ["Arkitektur", "Inredning", "Restaurering", "Kök"],
    featuredImage: "/images/projects/project-02/hero.jpg",
    gallery: [
      "/images/projects/project-02/01.jpg",
      "/images/projects/project-02/02.jpg",
      "/images/projects/project-02/03.jpg",
    ],
    credits: "Foto: Mikael Lundblad. Byggherre: Privat.",
    isFeatured: true,
  },
  {
    id: "03",
    title: "Kontorshuset Kvarnen",
    slug: "kontorshuset-kvarnen",
    excerpt: "Ombyggnad av ett äldre industrilager till moderna kontorslokaler i Södermalm.",
    description:
      "Ett äldre industrilager på Södermalm har omvandlats till moderna kontorslokaler för en kreativ verksamhet. Den befintliga betongstommen har behållits och kompletterats med nya träelement. En ny takterrass har skapats med utsikt över Stockholm. Planlösningen är flexibel med möjlighet till både öppna landskap och avskilda rum.",
    year: "2023",
    location: "Södermalm, Stockholm",
    category: "Kontor",
    services: ["Arkitektur", "Ombyggnad", "Inredning"],
    featuredImage: "/images/projects/project-03/hero.jpg",
    gallery: [
      "/images/projects/project-03/01.jpg",
      "/images/projects/project-03/02.jpg",
      "/images/projects/project-03/03.jpg",
      "/images/projects/project-03/04.jpg",
    ],
    credits: "Foto: Åke E:son Lindman. Byggherre: Fastighets AB Kvarnen.",
    isFeatured: true,
  },
  {
    id: "04",
    title: "Sommarbostad Gotland",
    slug: "sommarbostad-gotland",
    excerpt: "En fristående ateljé och gästhus på Gotland i kalksten och lärk.",
    description:
      "På en öppen slätt på Gotland har vi ritat ett fristående ateljé- och gästhus i kalksten och lärk. Husets enkla volym och noggrant avvägda proportioner skapar en rofylld arbetsmiljö. Ett stort fönster i norr ger jämnt ljus för måleri och skulptur. Byggnaden smälter in i landskapet tack vare materialval i lokala toner.",
    year: "2022",
    location: "Gotland",
    category: "Ateljéer",
    services: ["Arkitektur", "Bygglovshandlingar"],
    featuredImage: "/images/projects/project-04/hero.jpg",
    gallery: [
      "/images/projects/project-04/01.jpg",
      "/images/projects/project-04/02.jpg",
    ],
    credits: "Foto: Johan Pihlström. Byggherre: Privat.",
    isFeatured: false,
  },
  {
    id: "05",
    title: "Radhus Lidingö",
    slug: "radhus-lidingo",
    excerpt: "Nybyggda radhus i suterräng med privata trädgårdar och gemensamhetsyta.",
    description:
      "Ett radhusprojekt i suterräng på Lidingö med åtta enheter. Varje radhus har en privat trädgård och en gemensamhetsyta med växthus och odlingslotter. Fasaderna är klädda i obehandlad lärk som med tiden får en vacker silvrig patina. Planlösningarna är genomtänkta med god rumslighet och generösa förvaringslösningar.",
    year: "2022",
    location: "Lidingö",
    category: "Bostäder",
    services: ["Arkitektur", "Bygglovshandlingar", "Projektledning"],
    featuredImage: "/images/projects/project-05/hero.jpg",
    gallery: [
      "/images/projects/project-05/01.jpg",
      "/images/projects/project-05/02.jpg",
      "/images/projects/project-05/03.jpg",
    ],
    credits: "Foto: Mikael Lundblad. Byggherre: Lidingö Bostads AB.",
    isFeatured: true,
  },
  {
    id: "06",
    title: "Restaurang Lux",
    slug: "restaurang-lux",
    excerpt: "Inredning och ljusdesign för en finare restaurang i Gamla Stan.",
    description:
      "En intim restaurang i Gamla Stan har fått en ny inredning som balanserar historisk atmosfär med modern känsla. Väggarna är klädda i ljuddämpande ekpanel och belysningen är noggrant utformad för att skapa en varm och inbjudande stämning. Ett öppet kök med bardisk i oxiderad koppar är rummets blickfång.",
    year: "2024",
    location: "Gamla Stan, Stockholm",
    category: "Restaurang",
    services: ["Inredning", "Ljusdesign", "Kök"],
    featuredImage: "/images/projects/project-06/hero.jpg",
    gallery: [
      "/images/projects/project-06/01.jpg",
      "/images/projects/project-06/02.jpg",
    ],
    credits: "Foto: Åke E:son Lindman. Byggherre: Lux Gastronomi AB.",
    isFeatured: false,
  },
  {
    id: "07",
    title: "Fritidshus Vättern",
    slug: "fritidshus-vattern",
    excerpt: "Modernt fritidshus vid Vätterns västra strand med fokus på utsikt och hållbarhet.",
    description:
      "Ett modernt fritidshus vid Vätterns västra strand ritat med fokus på utsikten över sjön och hållbara materialval. Huset är uppvärmt med bergvärme och har ett grönt tak med sedum. Stora skjutdörrar i glas öppnar upp hela söderväggen mot en trätrall som sträcker sig ut över ängen.",
    year: "2021",
    location: "Vättern",
    category: "Villor",
    services: ["Arkitektur", "Hållbarhetskonsult", "Bygglovshandlingar"],
    featuredImage: "/images/projects/project-07/hero.jpg",
    gallery: [
      "/images/projects/project-07/01.jpg",
      "/images/projects/project-07/02.jpg",
      "/images/projects/project-07/03.jpg",
    ],
    credits: "Foto: Johan Pihlström. Byggherre: Privat.",
    isFeatured: true,
  },
  {
    id: "08",
    title: "Butik Artilleri",
    slug: "butik-artilleri",
    excerpt: "Koncept och inredning för en designbutik i Vasastan.",
    description:
      "En designbutik i Vasastan med inriktning på skandinavisk konst och konsthantverk. Inredningen är avskalad med vita kalkputsade väggar och ett golv av gjuten terrazzo. Butikens möbler är specialritade och tillverkade i samarbete med lokala snickerier. Belysningen är utformad för att framhäva produkterna.",
    year: "2023",
    location: "Vasastan, Stockholm",
    category: "Kommersiellt",
    services: ["Arkitektur", "Inredning", "Konceptutveckling"],
    featuredImage: "/images/projects/project-08/hero.jpg",
    gallery: [
      "/images/projects/project-08/01.jpg",
      "/images/projects/project-08/02.jpg",
      "/images/projects/project-08/03.jpg",
      "/images/projects/project-08/04.jpg",
    ],
    credits: "Foto: Mikael Lundblad. Byggherre: Artilleri AB.",
    isFeatured: false,
  },
  {
    id: "09",
    title: "Skola Solbacken",
    slug: "skola-solbacken",
    excerpt: "Nybyggd förskola i Upplands Väsby med fokus på naturmaterial och utemiljö.",
    description:
      "En nybyggd förskola i Upplands Väsby med fyra avdelningar. Byggnaden är utformad som en långsträckt volym i en våning med ett centralt torg som sammanbinder avdelningarna. Materialen är noga utvalda med fokus på hållbarhet: ek, kork, linoleum och lera. Utemiljön är integrerad med pedagogiken.",
    year: "2022",
    location: "Upplands Väsby",
    category: "Utbildning",
    services: ["Arkitektur", "Bygglovshandlingar", "Projektledning"],
    featuredImage: "/images/projects/project-09/hero.jpg",
    gallery: [
      "/images/projects/project-09/01.jpg",
      "/images/projects/project-09/02.jpg",
      "/images/projects/project-09/03.jpg",
    ],
    credits: "Foto: Åke E:son Lindman. Byggherre: Upplands Väsby Kommun.",
    isFeatured: false,
  },
  {
    id: "10",
    title: "Takvåning Gärdet",
    slug: "takvaning-gardet",
    excerpt: "Takvåning med terrass på Gärdet. Ljus, rymd och utsikt över Stockholm.",
    description:
      "En takvåning på Gärdet med en generös terrass som löper längs hela södra fasaden. Lägenheten har genomgått en total omgestaltning med nya ytskikt i kalksten, ek och linne. Köket är utformat med en stor ö i massiv ek och bänkskiva i Calacatta-marmor. Badrummet har golvvärme och en vägg i terrazzo.",
    year: "2024",
    location: "Gärdet, Stockholm",
    category: "Bostäder",
    services: ["Arkitektur", "Inredning", "Kök", "Badrum"],
    featuredImage: "/images/projects/project-10/hero.jpg",
    gallery: [
      "/images/projects/project-10/01.jpg",
      "/images/projects/project-10/02.jpg",
    ],
    credits: "Foto: Johan Pihlström. Byggherre: Privat.",
    isFeatured: false,
  },
  {
    id: "11",
    title: "Paviljong Berga",
    slug: "paviljong-berga",
    excerpt: "En öppen paviljong i Berga naturreservat för undervisning och samling.",
    description:
      "En öppen paviljong i Berga naturreservat som fungerar som samlingsplats för naturpedagogisk verksamhet. Paviljongen består av en stålstomme med ett tak av glas och solceller. Golvet är i obehandlad ek och sittplatser i betong är integrerade i konstruktionen. Byggnaden är helt självförsörjande på energi.",
    year: "2021",
    location: "Berga, Stockholm",
    category: "Offentligt",
    services: ["Arkitektur", "Hållbarhetskonsult", "Bygglovshandlingar"],
    featuredImage: "/images/projects/project-11/hero.jpg",
    gallery: [
      "/images/projects/project-11/01.jpg",
      "/images/projects/project-11/02.jpg",
    ],
    credits: "Foto: Mikael Lundblad. Byggherre: Stockholms Stad.",
    isFeatured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.isFeatured);
}
