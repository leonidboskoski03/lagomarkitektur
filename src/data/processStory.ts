import { publicAsset } from "../lib/publicAsset";
import type { Language } from "../i18n/language";

export interface ProcessStoryChapter {
  id: string;
  discipline: string;
  title: string;
  description: string;
  start: number;
  end: number;
  stillFrame: number;
  stillAlt: string;
}

export interface ProcessStoryLedgerItem { title: string; description: string }

const sequenceMedia = {
  poster: publicAsset("process-story/poster.webp"),
  desktopBasePath: publicAsset("process-story-v2/desktop"),
  mobileBasePath: publicAsset("process-story-v2/mobile"),
  frameCount: 979,
  durationSeconds: 54.375,
  fps: 18,
  width: 1920,
  height: 1080,
} as const;

interface ProcessStoryContent {
  intro: { eyebrow: string; headingLead: string; headingTail: string; description: string; scrollPrompt: string };
  ledger: ProcessStoryLedgerItem[];
  gridPrompt: { titleLines: [string, string]; cue: string };
  sequence: typeof sequenceMedia & { title: string; mobileLabel: string; preparingLabel: string; posterAlt: string };
  chapters: ProcessStoryChapter[];
  outro: { eyebrow: string; title: string; description: string; actionLabel: string; actionHref: string };
}

export const processStory: Record<Language, ProcessStoryContent> = {
  sv: {
    intro: {
      eyebrow: "Så arbetar vi", headingLead: "Ett samtal", headingTail: "blir en plats.",
      description: "Följ en sammanhängande arkitektonisk process – från den första stilla briefen till ett hem löst i struktur, material och ljus.",
      scrollPrompt: "Scrolla för att gå in i processen",
    },
    ledger: [
      { title: "Rådgivning", description: "Behov, sammanhang och ambition blir en tydlig brief." },
      { title: "Arkitektur", description: "Proportion, rörelse och ljus samlas i en genomarbetad plan." },
      { title: "Inredningsdesign", description: "Material och detaljer gör planen lugn och beboelig." },
      { title: "3D-visualisering", description: "Atmosfären prövas innan något byggs." },
    ],
    gridPrompt: { titleLines: ["Något börjar", "ta form."], cue: "Fortsätt för att se processen" },
    sequence: {
      title: "Gestaltningen av L-28", mobileLabel: "En resa i stillbilder",
      preparingLabel: "Förbereder sekvensen", posterAlt: "Arkitektritningar och materialprover på ett studiobord",
      ...sequenceMedia,
    },
    chapters: [
      { id: "consultation", discipline: "Rådgivning", title: "Varje hem börjar med förståelse.", description: "Hur ni lever, vad ni värdesätter och vad platsen erbjuder blir grunden för allt vi skapar tillsammans.", start: 0, end: 0.18, stillFrame: 1, stillAlt: "En stängd arkitektritning ligger på ett lugnt materialbord." },
      { id: "architecture", discipline: "Arkitektur", title: "Livet ger planen dess form.", description: "Ljus, rörelse och proportion komponeras kring vardagens behov och ger tydlighet åt den första arkitektoniska idén.", start: 0.18, end: 0.53, stillFrame: 320, stillAlt: "Arkitekturplanen vecklas ut över studiobordet." },
      { id: "spatial-planning", discipline: "Rumsplanering", title: "Ritningen blir en plats att leva i.", description: "Rummen får skala, djup och samband och visar hur hemmet kommer att fungera och kännas.", start: 0.53, end: 0.73, stillFrame: 691, stillAlt: "Den plana ritningen reser sig till en exakt tredimensionell arkitekturmodell." },
      { id: "interior-design", discipline: "Inredningsdesign", title: "Arkitekturen finner sin karaktär.", description: "Material, färg och detaljer betraktas som en helhet och ger värme och identitet åt rummen som tar form.", start: 0.73, end: 0.91, stillFrame: 860, stillAlt: "Varma material och interiöra detaljer tar plats i arkitekturmodellen." },
      { id: "visualization", discipline: "3D-visualisering", title: "Helheten blir synlig.", description: "Arkitektur, interiör och ljus möts i en sammanhållen vision – ett hem där varje detalj är genomtänkt och som är redo för livet som väntar.", start: 0.91, end: 1, stillFrame: 979, stillAlt: "Det färdiga gårdshuset syns som en fullbordad arkitekturmodell." },
    ],
    outro: { eyebrow: "Ert projekt", title: "Ta med oss början.", description: "En plats, en ambition, en fråga eller en skiss räcker för att inleda samtalet.", actionLabel: "Starta ett projekt", actionHref: "/contact" },
  },
  en: {
    intro: {
      eyebrow: "How we work", headingLead: "A conversation", headingTail: "becomes a place.",
      description: "Move through one continuous architectural process—from the first quiet brief to a home resolved in structure, material, and light.",
      scrollPrompt: "Scroll to enter the process",
    },
    ledger: [
      { title: "Consultation", description: "Needs, context, and ambition become a clear brief." },
      { title: "Architecture", description: "Proportion, circulation, and light are resolved as one plan." },
      { title: "Interior Design", description: "Material and detail make the plan calm and inhabitable." },
      { title: "3D Visualization", description: "Atmosphere is tested before anything is built." },
    ],
    gridPrompt: { titleLines: ["Something is", "taking shape."], cue: "Continue to reveal the process" },
    sequence: {
      title: "The making of L-28", mobileLabel: "A still-frame journey",
      preparingLabel: "Preparing sequence", posterAlt: "Architectural drawings and material samples on a studio table",
      ...sequenceMedia,
    },
    chapters: [
      { id: "consultation", discipline: "Consultation", title: "Every home begins with understanding.", description: "How you live, what you value, and what the site offers become the foundation for everything we create together.", start: 0, end: 0.18, stillFrame: 1, stillAlt: "A closed architectural drawing rests on a calm material table." },
      { id: "architecture", discipline: "Architecture", title: "Life gives the plan its shape.", description: "Light, movement, and proportion are composed around everyday needs, bringing clarity to the first architectural idea.", start: 0.18, end: 0.53, stillFrame: 320, stillAlt: "The architectural plan unfolds across the studio table." },
      { id: "spatial-planning", discipline: "Spatial planning", title: "The drawing becomes a place to inhabit.", description: "Rooms gain scale, depth, and connection, revealing how the home will flow and how living within it might feel.", start: 0.53, end: 0.73, stillFrame: 691, stillAlt: "The flat plan tilts into a precise three-dimensional architectural model." },
      { id: "interior-design", discipline: "Interior Design", title: "The architecture finds its character.", description: "Material, colour, and detail are considered as one, bringing warmth and identity to the spaces taking shape.", start: 0.73, end: 0.91, stillFrame: 860, stillAlt: "Warm materials and interior details resolve across the architectural model." },
      { id: "visualization", discipline: "3D Visualization", title: "The whole comes into view.", description: "Architecture, interior, and light meet in one coherent vision—a home considered in every detail and ready for the life ahead.", start: 0.91, end: 1, stillFrame: 979, stillAlt: "The completed courtyard house is seen as a resolved architectural model." },
    ],
    outro: { eyebrow: "Your project", title: "Bring us the beginning.", description: "A site, an ambition, a question, or a sketch is enough to start the conversation.", actionLabel: "Start a project", actionHref: "/contact" },
  },
};
