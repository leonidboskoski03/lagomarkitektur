import { useEffect, useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import projectIntroImage from "../assets/images/hero2.avif";
import {
  projectShowcaseIntro,
  projectShowcaseProjects,
  type ProjectShowcaseItem,
} from "../data/projects";
import { formatProjectArea } from "../lib/projectArea";
import {
  hasSanityConfig,
  homeProjectShowcaseQuery,
  sanityClient,
  sanityImageUrl,
} from "../lib/sanity";

interface SanityProjectImage {
  alt?: string;
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
  title: string;
  slug: string;
  category: string;
  services?: string[];
  year: string;
  location: string;
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
  introTitle?: string;
  introTags?: string[];
  introProperties?: string[];
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

const localShowcase: ProjectShowcaseData = {
  intro: {
    ...projectShowcaseIntro,
    image: projectIntroImage,
  },
  projects: projectShowcaseProjects,
};

let cachedShowcase: ProjectShowcaseData | null = null;
let showcasePromise: Promise<ProjectShowcaseData> | null = null;

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
): ProjectShowcaseData | null {
  if (!showcase) return null;

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
        title: project.title,
        tags: [
          project.category,
          project.services?.[0] || "Design",
          project.year,
          "Lagom",
        ],
        properties: [project.year, project.location, area].filter(
          (value): value is string => Boolean(value),
        ),
        image: background,
        thumbnail: primaryImage,
        secondaryImage,
      };
    })
    .filter((project): project is ProjectShowcaseItem => project !== null);

  if (projects.length !== 5) return null;

  const introTags = showcase.introTags?.filter(Boolean);
  const introProperties = showcase.introProperties?.filter(Boolean);

  return {
    intro: {
      index: "00",
      title: showcase.introTitle?.trim() || "Selected work",
      tags: introTags?.length ? introTags : localShowcase.intro.tags,
      properties: introProperties?.length
        ? introProperties
        : localShowcase.intro.properties,
      image: introImage,
    },
    projects,
  };
}

export function loadProjectShowcase(): Promise<ProjectShowcaseData> {
  if (cachedShowcase) return Promise.resolve(cachedShowcase);
  if (showcasePromise) return showcasePromise;

  showcasePromise = (async () => {
    try {
      if (!hasSanityConfig) throw new Error("Sanity is not configured");

      const result = await sanityClient.fetch<SanityHomeProjectShowcase | null>(
        homeProjectShowcaseQuery,
        {},
      );
      const normalized = normalizeShowcase(result);

      if (!normalized) {
        throw new Error("Sanity returned an incomplete Selected Work document");
      }

      return normalized;
    } catch (error) {
      console.warn(
        "Using the local Selected Work content because Sanity could not be loaded.",
        error,
      );
      return localShowcase;
    }
  })()
    .then((showcase) => {
      cachedShowcase = showcase;
      return showcase;
    })
    .finally(() => {
      showcasePromise = null;
    });

  return showcasePromise;
}

export function useProjectShowcase() {
  const [showcase, setShowcase] = useState<ProjectShowcaseData>(
    () => cachedShowcase || localShowcase,
  );

  useEffect(() => {
    let active = true;

    void loadProjectShowcase().then((loadedShowcase) => {
      if (active) setShowcase(loadedShowcase);
    });

    return () => {
      active = false;
    };
  }, []);

  return showcase;
}
