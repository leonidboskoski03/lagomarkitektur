import archmoodArch from "../assets/images/about/archmood-arch.webp";
import sereneDining from "../assets/images/about/serene-dining.webp";
import stoneframeEntry from "../assets/images/about/stoneframe-entry.webp";
import stoneframeFront from "../assets/images/about/stoneframe-front.webp";
import stoneframeSide from "../assets/images/about/stoneframe-side.webp";
import founderPortrait from "../assets/LAGOM Arkitektur/viber_image_2023-11-12_14-41-18-196.jpg";

export interface StudioProjectMedia {
  src: string;
  alt: string;
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

export const studioContent = {
  hero: {
    eyebrow: "Lagom Arkitektur",
    titleLines: ["Spaces that", "feel just", "right."],
    description:
      "Architecture, interiors and visualisation shaped by precision, simplicity and lasting value.",
    media: {
      src: sereneDining,
      alt: "Serene Luxe Residence dining space framed by daylight and a distant landscape",
      projectTitle: "Serene Luxe Residence",
      projectSlug: "serene-luxe-residence",
      transitionImageId: "02:cover",
    } satisfies StudioProjectMedia,
  },
  studio: {
    label: "The studio",
    title: "Architecture in balance, with meaning and precision.",
    paragraphs: [
      "LAGOM Arkitektur creates architecture, interiors and visualisations defined by precision, simplicity and lasting value. Through close collaboration and careful attention to detail, we shape tailored environments that reflect each client’s identity—in balance between aesthetics, function and sustainability.",
      "We believe in close dialogue with our clients, where understanding, trust and shared direction form the foundation of every project. The result is timeless architecture with meaning and presence—spaces that support the life lived within them and retain their value over time.",
      "Our portfolio spans interior design, residential architecture and hospitality environments. This breadth of experience lets us approach every commission with flexibility and insight, adapting our process to different scales, contexts and ways of living.",
    ],
    media: [
      {
        src: stoneframeEntry,
        alt: "L-28 Stoneframe Villa entrance shaped by natural stone, plaster and warm timber",
        projectTitle: "L-28 Stoneframe Villa",
        projectSlug: "l-28-stoneframe-villa",
        transitionImageId: "04:cover",
      },
      {
        src: archmoodArch,
        alt: "ArchMood Interior Concept with a sculpted arch and carefully framed daylight",
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
    },
    paragraphs: [
      "The studio was founded by Nikola Gjorgoski, Licensed Architect (SAR/MSA), with several years of experience as an architect, interior designer and instructor in 3D modelling and rendering.",
      "LAGOM combines creative vision with technical expertise and offers comprehensive services that guide a project through every stage—from concept development, sketches and drawings to building permits, project management and supervision.",
    ],
    philosophy:
      "At the core of our process lies trust. By building strong relationships with our clients, we create the conditions for thoughtful decisions, meaningful design and results that are both lasting and loved—spaces where architecture truly serves the people who experience it.",
    facts: [
      { label: "Studio", value: "LAGOM Arkitektur" },
      { label: "Based in", value: "Malmö, Sweden" },
      { label: "Founded", value: "2026" },
    ],
  },
  principles: {
    label: "Our way",
    title: "The principles behind every project.",
    items: [
      {
        index: "01",
        title: "Balance",
        summary: "Neither too much nor too little.",
        body:
          "We create sustainable architecture defined by balance, meaning and purpose—where every element is carefully considered and feels just right.",
        media: {
          src: sereneDining,
          alt: "Balanced dining composition in Serene Luxe Residence",
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
          projectTitle: "L-28 Stoneframe Villa",
          projectSlug: "l-28-stoneframe-villa",
          transitionImageId: "04:cover",
        },
      },
    ] satisfies StudioPrinciple[],
  },
} as const;
