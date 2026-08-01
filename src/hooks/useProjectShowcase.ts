import { useEffect, useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import { formatProjectArea } from "../lib/projectArea";
import {
  hasSanityConfig,
  homeProjectShowcaseQuery,
  sanityClient,
  sanityImageUrl,
} from "../lib/sanity";
import { useLanguage } from "../i18n/LanguageContext";
import {
  resolveLocalizedText,
  translateCanonicalValue,
  type Language,
  type MaybeLocalizedText,
} from "../i18n/language";

interface SanityProjectImage {
  alt?: MaybeLocalizedText;
  asset?: {
    _ref: string;
    _type: "reference";
  };
  crop?: {
    _type?: "sanity.imageCrop";
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    _type?: "sanity.imageHotspot";
    x: number;
    y: number;
    height: number;
    width: number;
  };
  assetData?: {
    _id: string;
    metadata?: {
      dimensions?: {
        width?: number;
      };
    };
  };
}

interface SanityShowcaseProject {
  _id: string;
  title: MaybeLocalizedText;
  slug: string;
  category: string;
  services?: string[];
  showcaseTags?: MaybeLocalizedText[];
  showcaseDetails?: MaybeLocalizedText[];
  year: string;
  location: MaybeLocalizedText;
  siteSize?: string;
  isPublished?: boolean;
  featuredImage?: SanityProjectImage;
}

interface SanityShowcaseItem {
  _key: string;
  project?: SanityShowcaseProject;
  backgroundImage?: SanityProjectImage;
  primaryImage?: SanityProjectImage;
  secondaryImage?: SanityProjectImage;
}

interface SanityHomeProjectShowcase {
  introTitle?: MaybeLocalizedText;
  introTags?: MaybeLocalizedText[];
  introProperties?: MaybeLocalizedText[];
  introBackground?: SanityProjectImage;
  projects?: SanityShowcaseItem[];
}

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

export interface ProjectShowcaseIntro {
  index: string;
  title: string;
  tags: string[];
  properties: string[];
  image: string;
}

export interface ProjectShowcaseData {
  intro: ProjectShowcaseIntro;
  projects: ProjectShowcaseItem[];
}

interface ProjectShowcaseState {
  language: Language;
  showcase: ProjectShowcaseData | null;
  isLoading: boolean;
  error: Error | null;
}

const cachedShowcases = new Map<Language, ProjectShowcaseData>();
const showcasePromises = new Map<Language, Promise<ProjectShowcaseData>>();

function buildImageUrl(
  image: SanityProjectImage | undefined,
  width: number,
  quality: number,
) {
  if (!image?.asset?._ref || !image.assetData?._id) return null;

  const sourceWidth = image.assetData.metadata?.dimensions?.width;
  return sanityImageUrl(image as SanityImageSource)
    .width(Math.min(sourceWidth || width, width))
    .fit("max")
    .auto("format")
    .quality(quality)
    .url();
}

function normalizeShowcase(
  showcase: SanityHomeProjectShowcase | null,
  language: Language,
): ProjectShowcaseData | null {
  if (!showcase) return null;

  const introImage = buildImageUrl(showcase.introBackground, 2400, 86);
  if (!introImage) return null;

  const projects = (showcase.projects || [])
    .map((item, index): ProjectShowcaseItem | null => {
      const project = item.project;
      if (!project || project.isPublished === false || !project.slug) return null;

      const background =
        buildImageUrl(item.backgroundImage, 2400, 86)
        || buildImageUrl(project.featuredImage, 2400, 86);
      const primaryImage = buildImageUrl(item.primaryImage, 1200, 84);
      const secondaryImage = buildImageUrl(item.secondaryImage, 1200, 84);

      if (!background || !primaryImage || !secondaryImage) return null;

      const area = formatProjectArea(project.siteSize);
      const title = resolveLocalizedText(project.title, language);
      if (!title) return null;

      const configuredTags = (project.showcaseTags || [])
        .map((tag) => resolveLocalizedText(tag, language))
        .filter(Boolean);
      const configuredDetails = (project.showcaseDetails || [])
        .map((detail) => resolveLocalizedText(detail, language))
        .filter(Boolean);

      return {
        id: item._key || project._id,
        index: String(index + 1).padStart(2, "0"),
        slug: project.slug,
        title,
        tags: configuredTags.length > 0
          ? configuredTags
          : [
            translateCanonicalValue(project.category, language),
            translateCanonicalValue(project.services?.[0] || "Design", language),
            project.year,
            "Lagom",
          ],
        properties: configuredDetails.length > 0
          ? configuredDetails
          : [
            project.year,
            resolveLocalizedText(project.location, language),
            area,
          ].filter((value): value is string => Boolean(value)),
        image: background,
        thumbnail: primaryImage,
        secondaryImage,
      };
    })
    .filter((project): project is ProjectShowcaseItem => project !== null);

  if (projects.length !== 5) return null;

  const introTags = (showcase.introTags || [])
    .map((item) => resolveLocalizedText(item, language))
    .filter(Boolean);
  const introProperties = (showcase.introProperties || [])
    .map((item) => resolveLocalizedText(item, language))
    .filter(Boolean);

  return {
    intro: {
      index: "00",
      title: resolveLocalizedText(
        showcase.introTitle,
        language,
        language === "sv" ? "Utvalda arbeten" : "Selected work",
      ),
      tags: introTags,
      properties: introProperties,
      image: introImage,
    },
    projects,
  };
}

export function loadProjectShowcase(language: Language): Promise<ProjectShowcaseData> {
  const cached = cachedShowcases.get(language);
  const pending = showcasePromises.get(language);
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;

  const promise = (async () => {
    if (!hasSanityConfig) throw new Error("Sanity is not configured");

    const result = await sanityClient.fetch<SanityHomeProjectShowcase | null>(
      homeProjectShowcaseQuery,
      {},
    );
    const normalized = normalizeShowcase(result, language);
    if (!normalized) {
      throw new Error("Sanity returned an incomplete Selected Work document");
    }

    cachedShowcases.set(language, normalized);
    return normalized;
  })().finally(() => {
    showcasePromises.delete(language);
  });

  showcasePromises.set(language, promise);
  return promise;
}

export function useProjectShowcase() {
  const { language } = useLanguage();
  const [state, setState] = useState<ProjectShowcaseState>(() => ({
    language,
    showcase: cachedShowcases.get(language) || null,
    isLoading: !cachedShowcases.has(language),
    error: null,
  }));
  const currentState = state.language === language
    ? state
    : {
      language,
      showcase: cachedShowcases.get(language) || null,
      isLoading: !cachedShowcases.has(language),
      error: null,
    };

  useEffect(() => {
    let active = true;

    void loadProjectShowcase(language)
      .then((showcase) => {
        if (active) setState({ language, showcase, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const normalizedError = error instanceof Error
          ? error
          : new Error("Could not load Selected Work");
        setState({ language, showcase: null, isLoading: false, error: normalizedError });
      });

    return () => {
      active = false;
    };
  }, [language]);

  return currentState;
}
