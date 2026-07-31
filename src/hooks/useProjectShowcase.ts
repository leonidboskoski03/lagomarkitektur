import { useEffect, useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import projectIntroImage from "../assets/images/hero2.avif";
import {
  getProjectShowcaseIntro,
  getProjectShowcaseProjects,
  type ProjectShowcaseItem,
} from "../data/projects";
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
        height?: number;
        aspectRatio?: number;
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

function getLocalShowcase(language: Language): ProjectShowcaseData {
  const intro = getProjectShowcaseIntro(language);
  return {
    intro: {
      ...intro,
      tags: [...intro.tags],
      properties: [...intro.properties],
      image: projectIntroImage,
    },
    projects: getProjectShowcaseProjects(language),
  };
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
  const localShowcase = getLocalShowcase(language);

  const introImage = buildImageUrl(showcase.introBackground, 2400, 86);
  if (!introImage) return null;

  const projects = (showcase.projects || [])
    .map((item, index): ProjectShowcaseItem | null => {
      const project = item.project;
      if (!project || project.isPublished === false || !project.slug) return null;

      const background =
        buildImageUrl(item.backgroundImage, 2400, 86) ||
        buildImageUrl(project.featuredImage, 2400, 86);
      const primaryImage = buildImageUrl(item.primaryImage, 1200, 84);
      const secondaryImage = buildImageUrl(item.secondaryImage, 1200, 84);

      if (!background || !primaryImage || !secondaryImage) return null;

      const area = formatProjectArea(project.siteSize);

      return {
        id: item._key || project._id,
        index: String(index + 1).padStart(2, "0"),
        slug: project.slug,
        title: resolveLocalizedText(project.title, language),
        tags: [
          translateCanonicalValue(project.category, language),
          translateCanonicalValue(project.services?.[0] || "Design", language),
          project.year,
          "Lagom",
        ],
        properties: [project.year, resolveLocalizedText(project.location, language), area].filter(
          (value): value is string => Boolean(value),
        ),
        image: background,
        thumbnail: primaryImage,
        secondaryImage,
      };
    })
    .filter((project): project is ProjectShowcaseItem => project !== null);

  if (projects.length !== 5) return null;

  const introTags = showcase.introTags
    ?.map((item) => resolveLocalizedText(item, language))
    .filter(Boolean);
  const introProperties = showcase.introProperties
    ?.map((item) => resolveLocalizedText(item, language))
    .filter(Boolean);

  return {
    intro: {
      index: "00",
      title: resolveLocalizedText(showcase.introTitle, language, localShowcase.intro.title),
      tags: introTags?.length ? introTags : localShowcase.intro.tags,
      properties: introProperties?.length
        ? introProperties
        : localShowcase.intro.properties,
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

  const showcasePromise = (async () => {
    try {
      if (!hasSanityConfig) throw new Error("Sanity is not configured");

      const result = await sanityClient.fetch<SanityHomeProjectShowcase | null>(
        homeProjectShowcaseQuery,
        {},
      );
      const normalized = normalizeShowcase(result, language);

      if (!normalized) {
        throw new Error("Sanity returned an incomplete Selected Work document");
      }

      return normalized;
    } catch (error) {
      console.warn(
        "Using the local Selected Work content because Sanity could not be loaded.",
        error,
      );
      return getLocalShowcase(language);
    }
  })()
    .then((showcase) => {
      cachedShowcases.set(language, showcase);
      return showcase;
    })
    .finally(() => {
      showcasePromises.delete(language);
    });

  showcasePromises.set(language, showcasePromise);
  return showcasePromise;
}

export function useProjectShowcase() {
  const { language } = useLanguage();
  const [state, setState] = useState(() => ({
    language,
    showcase: cachedShowcases.get(language) || getLocalShowcase(language),
  }));
  const showcase = state.language === language
    ? state.showcase
    : cachedShowcases.get(language) || getLocalShowcase(language);

  useEffect(() => {
    let active = true;

    void loadProjectShowcase(language).then((loadedShowcase) => {
      if (active) setState({ language, showcase: loadedShowcase });
    });

    return () => {
      active = false;
    };
  }, [language]);

  return showcase;
}
