import archmoodArch from "../assets/images/about/archmood-arch.webp";
import sereneDining from "../assets/images/about/serene-dining.webp";
import stoneframeEntry from "../assets/images/about/stoneframe-entry.webp";
import stoneframeFront from "../assets/images/about/stoneframe-front.webp";
import stoneframeSide from "../assets/images/about/stoneframe-side.webp";
import founderPortrait from "../assets/LAGOM Arkitektur/viber_image_2023-11-12_14-41-18-196.jpg";
import type { Language } from "../i18n/language";

export interface StudioProjectMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  projectTitle: string;
  projectSlug: string;
  transitionImageId: string;
}

export interface StudioPrinciple {
  index: string;
  title: string;
  summary: string;
  body: string;
  media: StudioProjectMedia;
}

const studioContentEn = {
  loader: {
    label: "About Lagom Arkitektur",
    title: "LAGOM",
  },
  hero: {
    eyebrow: "Lagom Arkitektur",
    meta: "Architecture / Interiors",
    titleLines: ["Spaces that feel", "just right."],
    description:
      "Architecture, interiors and visualisation shaped by precision, simplicity and lasting value.",
    accentMedia: {
      src: archmoodArch,
      alt: "ArchMood Interior Concept with sculpted arches and framed daylight",
      width: 1536,
      height: 1024,
      projectTitle: "ArchMood Interior Concept",
      projectSlug: "archmood-interior-concept",
      transitionImageId: "06:cover",
    } satisfies StudioProjectMedia,
    media: {
      src: sereneDining,
      alt: "Serene Luxe Residence dining space framed by daylight and a distant landscape",
      width: 1536,
      height: 1024,
      projectTitle: "Serene Luxe Residence",
      projectSlug: "serene-luxe-residence",
      transitionImageId: "02:cover",
    } satisfies StudioProjectMedia,
  },
  studio: {
    label: "The studio",
    title: "Architecture in balance, with meaning and precision.",
    paragraphs: [
      "LAGOM Arkitektur creates architecture, interiors and visualisations defined by precision, simplicity and lasting value. Through close collaboration and careful attention to detail, we shape tailored environments that reflect each client’s identity while balancing aesthetics, function and sustainability.",
      "We believe in close dialogue with our clients, where understanding, trust and shared direction form the foundation of every project. The result is timeless architecture with meaning and presence. These spaces support the life lived within them and retain their value over time.",
      "Our portfolio spans interior design, residential architecture and hospitality environments. This breadth of experience lets us approach every commission with flexibility and insight, adapting our process to different scales, contexts and ways of living.",
    ],
    media: [
      {
        src: stoneframeEntry,
        alt: "L-28 Stoneframe Villa entrance shaped by natural stone, plaster and warm timber",
        width: 1800,
        height: 1013,
        projectTitle: "L-28 Stoneframe Villa",
        projectSlug: "l-28-stoneframe-villa",
        transitionImageId: "04:cover",
      },
      {
        src: archmoodArch,
        alt: "ArchMood Interior Concept with a sculpted arch and carefully framed daylight",
        width: 1536,
        height: 1024,
        projectTitle: "ArchMood Interior Concept",
        projectSlug: "archmood-interior-concept",
        transitionImageId: "06:cover",
      },
    ] satisfies StudioProjectMedia[],
  },
  founder: {
    label: "The founder",
    title: "Every space is a dialogue.",
    name: "Nikola Gjorgoski",
    role: "Founder & Licensed Architect (SAR/MSA)",
    portrait: {
      src: founderPortrait,
      alt: "Nikola Gjorgoski, founder and licensed architect at LAGOM Arkitektur",
      width: 600,
      height: 1200,
    },
    paragraphs: [
      "The studio was founded by Nikola Gjorgoski, Licensed Architect (SAR/MSA), with several years of experience as an architect, interior designer and instructor in 3D modelling and rendering.",
      "LAGOM combines creative vision with technical expertise and offers comprehensive services that guide a project through every stage, from concept development, sketches and drawings to building permits, project management and supervision.",
    ],
    philosophy:
      "At the core of our process lies trust. By building strong relationships with our clients, we create the conditions for thoughtful decisions, meaningful design and results that are both lasting and loved. We create spaces where architecture truly serves the people who experience it.",
    facts: [
      { label: "Studio", value: "LAGOM Arkitektur" },
      { label: "Based in", value: "Malmö, Sweden" },
      { label: "Founded", value: "2026" },
    ],
  },
  principles: {
    label: "Our way",
    tabLabel: "Studio principles",
    viewProject: "View",
    title: "The principles behind every project.",
    items: [
      {
        index: "01",
        title: "Balance",
        summary: "Neither too much nor too little.",
        body:
          "We create sustainable architecture defined by balance, meaning and purpose, where every element is carefully considered and feels just right.",
        media: {
          src: sereneDining,
          alt: "Balanced dining composition in Serene Luxe Residence",
          width: 1536,
          height: 1024,
          projectTitle: "Serene Luxe Residence",
          projectSlug: "serene-luxe-residence",
          transitionImageId: "02:cover",
        },
      },
      {
        index: "02",
        title: "Dialogue",
        summary: "Every project begins with listening.",
        body:
          "Successful architecture begins with understanding not only a client’s needs, but also their personality, values and way of living. Every design should feel authentic and deeply personal.",
        media: {
          src: archmoodArch,
          alt: "Layered arches and daylight in ArchMood Interior Concept",
          width: 1536,
          height: 1024,
          projectTitle: "ArchMood Interior Concept",
          projectSlug: "archmood-interior-concept",
          transitionImageId: "06:cover",
        },
      },
      {
        index: "03",
        title: "Trust",
        summary: "Strong relationships make space for clarity.",
        body:
          "Trust creates the conditions for thoughtful decisions, meaningful design and results that remain valued long after a project is complete.",
        media: {
          src: stoneframeFront,
          alt: "Front elevation of L-28 Stoneframe Villa",
          width: 1800,
          height: 1013,
          projectTitle: "L-28 Stoneframe Villa",
          projectSlug: "l-28-stoneframe-villa",
          transitionImageId: "04:cover",
        },
      },
      {
        index: "04",
        title: "Endurance",
        summary: "Lasting value over passing trends.",
        body:
          "We shape functional, enduring and personal environments that support everyday life while respecting people, place and the material life of a building.",
        media: {
          src: stoneframeSide,
          alt: "Stone facade and tree shadows at L-28 Stoneframe Villa",
          width: 1800,
          height: 1062,
          projectTitle: "L-28 Stoneframe Villa",
          projectSlug: "l-28-stoneframe-villa",
          transitionImageId: "04:cover",
        },
      },
    ] satisfies StudioPrinciple[],
  },
  disciplines: [
    "Architecture",
    "Interiors",
    "Visualisation",
    "Project guidance",
  ],
  disciplinesIntro: "One studio, four connected disciplines.",
} as const;

const studioContentSv = {
  ...studioContentEn,
  loader: { label: "Om Lagom Arkitektur", title: "LAGOM" },
  hero: {
    ...studioContentEn.hero,
    eyebrow: "Lagom Arkitektur",
    meta: "Arkitektur / Interiörer",
    titleLines: ["Rum som känns", "precis rätt."],
    description: "Arkitektur, interiörer och visualiseringar präglade av precision, enkelhet och bestående värde.",
    accentMedia: {
      ...studioContentEn.hero.accentMedia,
      alt: "ArchMood Interior Concept med skulpturala valv och inramat dagsljus",
    },
    media: {
      ...studioContentEn.hero.media,
      alt: "Matsalen i Serene Luxe Residence inramad av dagsljus och ett avlägset landskap",
    },
  },
  studio: {
    ...studioContentEn.studio,
    label: "Studion",
    title: "Arkitektur i balans, med mening och precision.",
    paragraphs: [
      "LAGOM Arkitektur skapar arkitektur, interiörer och visualiseringar präglade av precision, enkelhet och bestående värde. Genom nära samarbete och noggrann omsorg om detaljer formar vi skräddarsydda miljöer som speglar varje klients identitet, i balans mellan estetik, funktion och hållbarhet.",
      "Vi tror på en nära dialog med våra klienter där förståelse, förtroende och gemensam riktning är grunden för varje projekt. Resultatet är tidlös arkitektur med mening och närvaro — rum som stödjer livet som levs i dem och som behåller sitt värde över tid.",
      "Vår portfolio omfattar inredningsdesign, bostadsarkitektur och miljöer inom besöksnäringen. Denna bredd av erfarenhet gör att vi kan närma oss varje uppdrag med flexibilitet och insikt och anpassa vår process till olika skalor, sammanhang och sätt att leva.",
    ],
    media: [
      { ...studioContentEn.studio.media[0], alt: "Entrén till L-28 Stoneframe Villa formad av natursten, puts och varmt trä" },
      { ...studioContentEn.studio.media[1], alt: "ArchMood Interior Concept med ett skulpturalt valv och varsamt inramat dagsljus" },
    ],
  },
  founder: {
    ...studioContentEn.founder,
    label: "Grundaren",
    title: "Varje rum är en dialog.",
    role: "Grundare och licensierad arkitekt (SAR/MSA)",
    portrait: { ...studioContentEn.founder.portrait, alt: "Nikola Gjorgoski, grundare och licensierad arkitekt på LAGOM Arkitektur" },
    paragraphs: [
      "Studion är grundad av Nikola Gjorgoski, licensierad arkitekt (SAR/MSA), med flera års erfarenhet som arkitekt, inredningsdesigner samt instruktör inom 3D-modellering och rendering.",
      "Vi kombinerar kreativ vision med teknisk expertis och erbjuder helhetslösningar som följer projektet genom alla faser — från konceptutveckling, skisser och ritningar till bygglov, projektledning och uppföljning under genomförande.",
    ],
    philosophy: "I kärnan av vår process finns förtroende. Genom att bygga starka relationer med våra klienter skapar vi förutsättningar för genomtänkta beslut, meningsfull design och resultat som är både långsiktiga och uppskattade — rum där arkitekturen verkligen tjänar människorna som upplever den.",
    facts: [
      { label: "Studio", value: "LAGOM Arkitektur" },
      { label: "Plats", value: "Malmö, Sverige" },
      { label: "Grundad", value: "2026" },
    ],
  },
  principles: {
    label: "Vårt sätt",
    tabLabel: "Studions principer",
    viewProject: "Se",
    title: "Principerna bakom varje projekt.",
    items: [
      { ...studioContentEn.principles.items[0], title: "Balans", summary: "Varken för mycket eller för lite.", body: "Vi skapar hållbar arkitektur präglad av balans, mening och syfte, där varje element är noggrant genomtänkt och känns precis rätt.", media: { ...studioContentEn.principles.items[0].media, alt: "Balanserad matsalskomposition i Serene Luxe Residence" } },
      { ...studioContentEn.principles.items[1], title: "Dialog", summary: "Varje projekt börjar med att lyssna.", body: "Framgångsrik arkitektur börjar med att förstå, inte bara klientens behov, utan även deras personlighet, värderingar och sätt att leva. Varje design ska kännas autentisk och personlig.", media: { ...studioContentEn.principles.items[1].media, alt: "Skiktade valv och dagsljus i ArchMood Interior Concept" } },
      { ...studioContentEn.principles.items[2], title: "Förtroende", summary: "Starka relationer skapar utrymme för tydlighet.", body: "Förtroende skapar förutsättningar för genomtänkta beslut, meningsfull design och resultat som fortsätter att uppskattas långt efter att projektet är avslutat.", media: { ...studioContentEn.principles.items[2].media, alt: "Framsidan av L-28 Stoneframe Villa" } },
      { ...studioContentEn.principles.items[3], title: "Beständighet", summary: "Bestående värde framför tillfälliga trender.", body: "Vi formar funktionella, hållbara och personliga miljöer som stödjer vardagslivet med respekt för människor, plats och byggnadens materiella liv.", media: { ...studioContentEn.principles.items[3].media, alt: "Stenfasad och trädskuggor vid L-28 Stoneframe Villa" } },
    ],
  },
  disciplines: ["Arkitektur", "Interiörer", "Visualisering", "Projektrådgivning"],
  disciplinesIntro: "En studio, fyra sammanlänkade discipliner.",
} as const;

export const studioContent = {
  sv: studioContentSv,
  en: studioContentEn,
} as const satisfies Record<Language, object>;
