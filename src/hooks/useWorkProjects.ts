import { useEffect, useState } from "react";
import { publicAsset } from "../lib/publicAsset";
import type { SanityImageSource } from "@sanity/image-url";
import {
  hasSanityConfig,
  sanityClient,
  sanityImageUrl,
  workProjectListQuery,
} from "../lib/sanity";
import { formatProjectArea } from "../lib/projectArea";
import { useLanguage } from "../i18n/LanguageContext";
import {
  resolveLocalizedText,
  translateCanonicalValue,
  type Language,
  type MaybeLocalizedText,
} from "../i18n/language";

export interface WorkProjectImage {
  url: string;
  srcSet?: string;
  sizes?: string;
  previewUrl?: string;
  previewSrcSet?: string;
  previewSizes?: string;
  atlasUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio: number;
}

export interface WorkProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  siteSize?: string;
  year: string;
  image: WorkProjectImage;
  gallery: WorkProjectImage[];
  atlasImages: WorkProjectImage[];
}

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

interface SanityWorkProject {
  _id: string;
  title: MaybeLocalizedText;
  slug: string;
  category: string;
  siteSize?: string;
  year: string;
  featuredImage: SanityProjectImage;
  thumbnailImage?: SanityProjectImage;
  gallery?: SanityProjectImage[];
  workGallery?: SanityProjectImage[];
}

const localAspectFallback = [0.8, 1.5, 1.7778, 1.7768, 1.5, 1.7778, 1.7782, 1.5, 0.906, 1.5, 1.5];
const localGalleryAspectFallback = [1.5, 1, 0.8, 1.7778, 1.25, 0.906];
const workPreviewWidths = [320, 480, 640];
const workDisplayWidths = [640, 960, 1280, 1600];
const workGalleryWidths = [480, 720, 900, 1200];
const workAtlasWidth = 768;
const cachedWorkProjects = new Map<Language, WorkProjectItem[]>();
const workProjectsPromises = new Map<Language, Promise<WorkProjectItem[]>>();

function getAvailableWidths(widths: number[], sourceWidth?: number) {
  if (!sourceWidth) return widths;
  const maximumRequestedWidth = widths.at(-1) || sourceWidth;
  if (sourceWidth >= maximumRequestedWidth) return widths;
  const available = widths.filter((width) => width < sourceWidth);
  available.push(sourceWidth);
  return Array.from(new Set(available)).sort((first, second) => first - second);
}

function buildSanityUrl(image: SanityProjectImage, width: number, quality: number) {
  return sanityImageUrl(image as SanityImageSource)
    .width(Math.round(width))
    .fit("max")
    .auto("format")
    .quality(quality)
    .url();
}

function buildSanitySrcSet(
  image: SanityProjectImage,
  widths: number[],
  quality: number,
  sourceWidth?: number,
) {
  return getAvailableWidths(widths, sourceWidth)
    .map((width) => `${buildSanityUrl(image, width, quality)} ${width}w`)
    .join(", ");
}

function normalizeSanityImage(
  image: SanityProjectImage,
  fallbackAlt: string,
  widths: number[],
  sizes: string,
  language: Language,
): WorkProjectImage | null {
  if (!image.asset?._ref || !image.assetData) return null;

  const dimensions = image.assetData.metadata?.dimensions;
  const sourceWidth = dimensions?.width;
  const displayWidths = getAvailableWidths(widths, sourceWidth);
  const previewWidths = getAvailableWidths(workPreviewWidths, sourceWidth);
  const displayWidth = displayWidths.at(-1) || widths.at(-1) || 1200;
  const previewWidth = previewWidths.at(-1) || workPreviewWidths.at(-1) || 640;

  return {
    url: buildSanityUrl(image, displayWidth, 84),
    srcSet: buildSanitySrcSet(image, widths, 84, sourceWidth),
    sizes,
    previewUrl: buildSanityUrl(image, previewWidth, 72),
    previewSrcSet: buildSanitySrcSet(image, workPreviewWidths, 72, sourceWidth),
    previewSizes: "(max-width: 767px) 48vw, 15vw",
    atlasUrl: buildSanityUrl(image, Math.min(sourceWidth || workAtlasWidth, workAtlasWidth), 70),
    alt: resolveLocalizedText(image.alt, language, fallbackAlt),
    width: dimensions?.width,
    height: dimensions?.height,
    aspectRatio: dimensions?.aspectRatio || 1.4,
  };
}

function uniqueWorkImages(images: WorkProjectImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const key = image.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeSanityProject(project: SanityWorkProject, language: Language): WorkProjectItem | null {
  if (!project.slug || !project.featuredImage?.asset?._ref) return null;

  const displayImage = project.thumbnailImage?.asset?._ref ? project.thumbnailImage : project.featuredImage;
  if (!displayImage.asset?._ref) return null;

  const title = resolveLocalizedText(project.title, language);
  const imageLabel = language === "sv" ? "bild" : "image";
  const atlasLabel = language === "sv" ? "Atlasbild" : "Atlas image";
  const normalizedDisplayImage = normalizeSanityImage(
    displayImage,
    title,
    workDisplayWidths,
    "(max-width: 767px) 92vw, 52vw",
    language,
  );
  const normalizedGallery = (project.gallery || [])
    .map((image, index) => normalizeSanityImage(
      image,
      `${title} ${imageLabel} ${index + 1}`,
      workGalleryWidths,
      "(max-width: 767px) 48vw, 24vw",
      language,
    ))
    .filter((image): image is WorkProjectImage => image !== null);
  const normalizedWorkGallery = (project.workGallery || [])
    .map((image, index) => normalizeSanityImage(
      image,
      `${title} ${atlasLabel} ${index + 1}`,
      workGalleryWidths,
      "(max-width: 767px) 48vw, 24vw",
      language,
    ))
    .filter((image): image is WorkProjectImage => image !== null);

  if (!normalizedDisplayImage) return null;

  return {
    id: project._id,
    title,
    slug: project.slug,
    category: translateCanonicalValue(project.category, language),
    siteSize: formatProjectArea(project.siteSize),
    year: project.year,
    image: normalizedDisplayImage,
    gallery: normalizedGallery.length > 0 ? normalizedGallery : [normalizedDisplayImage],
    atlasImages: uniqueWorkImages(
      normalizedWorkGallery.length > 0
        ? [...normalizedWorkGallery, normalizedDisplayImage, ...normalizedGallery]
        : [normalizedDisplayImage, ...normalizedGallery],
    ).slice(0, 5),
  };
}

async function loadLocalFallback(language: Language): Promise<WorkProjectItem[]> {
  const { getProjects } = await import("../data/projects");
  const projects = getProjects(language);

  return projects.map((project, index) => {
    const imageLabel = language === "sv" ? "bild" : "image";
    const image: WorkProjectImage = {
      url: project.thumbnailImage || project.featuredImage,
      previewUrl: publicAsset(`work-previews/${project.id}/cover.webp`),
      sizes: "(max-width: 767px) 92vw, 52vw",
      previewSizes: "(max-width: 767px) 48vw, 15vw",
      alt: project.title,
      aspectRatio: localAspectFallback[index % localAspectFallback.length],
    };
    const galleryImages = project.gallery.map((url, imageIndex) => ({
      url,
      previewUrl: publicAsset(`work-previews/${project.id}/${imageIndex}.webp`),
      atlasUrl: publicAsset(`work-previews/${project.id}/${imageIndex}.webp`),
      sizes: "(max-width: 767px) 48vw, 24vw",
      previewSizes: "(max-width: 767px) 48vw, 15vw",
      alt: `${project.title} ${imageLabel} ${imageIndex + 1}`,
      aspectRatio: localGalleryAspectFallback[(imageIndex + index) % localGalleryAspectFallback.length],
    }));
    image.atlasUrl = image.previewUrl;

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      siteSize: formatProjectArea(project.credits),
      year: project.year,
      image,
      gallery: galleryImages,
      atlasImages: uniqueWorkImages([image, ...galleryImages]).slice(0, 5),
    };
  });
}

export function loadWorkProjects(language: Language): Promise<WorkProjectItem[]> {
  const cached = cachedWorkProjects.get(language);
  const pending = workProjectsPromises.get(language);
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;

  const workProjectsPromise = (async () => {
      try {
        if (!hasSanityConfig) throw new Error("Sanity is not configured");

        const result = await sanityClient.fetch<SanityWorkProject[]>(
          workProjectListQuery,
          {},
        );
        const normalized = result
          .map((project) => normalizeSanityProject(project, language))
          .filter((project): project is WorkProjectItem => project !== null);

        if (normalized.length === 0) throw new Error("Sanity returned no published projects");
        return normalized;
      } catch (error) {
        console.warn("Using local Work projects because Sanity could not be loaded.", error);
        return loadLocalFallback(language);
      }
    })()
    .then((projects) => {
      cachedWorkProjects.set(language, projects);
      return projects;
    })
    .finally(() => {
      workProjectsPromises.delete(language);
    });

  workProjectsPromises.set(language, workProjectsPromise);
  return workProjectsPromise;
}

export function useWorkProjects() {
  const { language } = useLanguage();
  const [state, setState] = useState(() => ({
    language,
    projects: cachedWorkProjects.get(language) || [],
    isLoading: !cachedWorkProjects.has(language),
  }));
  const currentState = state.language === language
    ? state
    : {
      language,
      projects: cachedWorkProjects.get(language) || [],
      isLoading: !cachedWorkProjects.has(language),
    };

  useEffect(() => {
    let active = true;

    void loadWorkProjects(language).then((loadedProjects) => {
      if (!active) return;
      setState({ language, projects: loadedProjects, isLoading: false });
    });

    return () => {
      active = false;
    };
  }, [language]);

  return { projects: currentState.projects, isLoading: currentState.isLoading };
}
