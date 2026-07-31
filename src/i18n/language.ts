export const languages = ["sv", "en"] as const;

export type Language = (typeof languages)[number];

export interface LocalizedText {
  sv?: string;
  en?: string;
}

export type MaybeLocalizedText = string | LocalizedText | null | undefined;

export function isLanguage(value: unknown): value is Language {
  return value === "sv" || value === "en";
}

export function resolveLocalizedText(
  value: MaybeLocalizedText,
  language: Language,
  fallback = "",
) {
  if (typeof value === "string") return value.trim() || fallback;
  if (!value) return fallback;

  return value[language]?.trim()
    || value.sv?.trim()
    || value.en?.trim()
    || fallback;
}

const canonicalTranslations: Record<string, Record<Language, string>> = {
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

export function translateCanonicalValue(value: string, language: Language) {
  return canonicalTranslations[value]?.[language] ?? value;
}
