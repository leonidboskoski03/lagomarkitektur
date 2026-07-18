import { useEffect, useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import {
  hasSanityConfig,
  sanityClient,
  sanityImageUrl,
  workProjectListQuery,
} from "../lib/sanity";

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

interface SanityWorkProject {
  _id: string;
  title: string;
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
    alt: image.alt || fallbackAlt,
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

function normalizeSanityProject(project: SanityWorkProject): WorkProjectItem | null {
  if (!project.slug || !project.featuredImage?.asset?._ref) return null;

  const displayImage = project.thumbnailImage?.asset?._ref ? project.thumbnailImage : project.featuredImage;
  if (!displayImage.asset?._ref) return null;

  const normalizedDisplayImage = normalizeSanityImage(
    displayImage,
    project.title,
    workDisplayWidths,
    "(max-width: 767px) 92vw, 52vw",
  );
  const normalizedGallery = (project.gallery || [])
    .map((image, index) => normalizeSanityImage(
      image,
      `${project.title} image ${index + 1}`,
      workGalleryWidths,
      "(max-width: 767px) 48vw, 24vw",
    ))
    .filter((image): image is WorkProjectImage => image !== null);
  const normalizedWorkGallery = (project.workGallery || [])
    .map((image, index) => normalizeSanityImage(
      image,
      `${project.title} Atlas image ${index + 1}`,
      workGalleryWidths,
      "(max-width: 767px) 48vw, 24vw",
    ))
    .filter((image): image is WorkProjectImage => image !== null);

  if (!normalizedDisplayImage) return null;

  return {
    id: project._id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    siteSize: project.siteSize,
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

async function loadLocalFallback(): Promise<WorkProjectItem[]> {
  const { projects } = await import("../data/projects");

  return projects.map((project, index) => {
    const image: WorkProjectImage = {
      url: project.thumbnailImage || project.featuredImage,
      previewUrl: `/work-previews/${project.id}/cover.webp`,
      sizes: "(max-width: 767px) 92vw, 52vw",
      previewSizes: "(max-width: 767px) 48vw, 15vw",
      alt: project.title,
      aspectRatio: localAspectFallback[index % localAspectFallback.length],
    };
    const galleryImages = project.gallery.map((url, imageIndex) => ({
      url,
      previewUrl: `/work-previews/${project.id}/${imageIndex}.webp`,
      atlasUrl: `/work-previews/${project.id}/${imageIndex}.webp`,
      sizes: "(max-width: 767px) 48vw, 24vw",
      previewSizes: "(max-width: 767px) 48vw, 15vw",
      alt: `${project.title} image ${imageIndex + 1}`,
      aspectRatio: localGalleryAspectFallback[(imageIndex + index) % localGalleryAspectFallback.length],
    }));
    image.atlasUrl = image.previewUrl;

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      siteSize: project.credits.replace(/^Site size:\s*/i, ""),
      year: project.year,
      image,
      gallery: galleryImages,
      atlasImages: uniqueWorkImages([image, ...galleryImages]).slice(0, 5),
    };
  });
}

export function useWorkProjects() {
  const [projects, setProjects] = useState<WorkProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        if (!hasSanityConfig) throw new Error("Sanity is not configured");

        const result = await sanityClient.fetch<SanityWorkProject[]>(
          workProjectListQuery,
          {},
          { signal: controller.signal },
        );
        const normalized = result
          .map(normalizeSanityProject)
          .filter((project): project is WorkProjectItem => project !== null);

        if (normalized.length === 0) throw new Error("Sanity returned no published projects");
        if (!controller.signal.aborted) {
          setProjects(normalized);
          setIsLoading(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn("Using local Work projects because Sanity could not be loaded.", error);
        const fallback = await loadLocalFallback();
        if (!controller.signal.aborted) {
          setProjects(fallback);
          setIsLoading(false);
        }
      }
    }

    void loadProjects();
    return () => controller.abort();
  }, []);

  return { projects, isLoading };
}
