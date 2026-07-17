import { useEffect, useState } from "react";
import {
  hasSanityConfig,
  sanityClient,
  workProjectListQuery,
} from "../lib/sanity";

export interface WorkProjectImage {
  url: string;
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
}

interface SanityProjectImage {
  alt?: string;
  asset?: {
    _id: string;
    url: string;
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
}

const localAspectFallback = [0.8, 1.5, 1.7778, 1.7768, 1.5, 1.7778, 1.7782, 1.5, 0.906, 1.5, 1.5];
const localGalleryAspectFallback = [1.5, 1, 0.8, 1.7778, 1.25, 0.906];

function optimizeSanityImage(url: string, width: number) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&fit=max&auto=format&q=84`;
}

function normalizeSanityImage(
  image: SanityProjectImage,
  fallbackAlt: string,
  width: number,
): WorkProjectImage | null {
  if (!image.asset) return null;

  const dimensions = image.asset.metadata?.dimensions;

  return {
    url: optimizeSanityImage(image.asset.url, width),
    alt: image.alt || fallbackAlt,
    width: dimensions?.width,
    height: dimensions?.height,
    aspectRatio: dimensions?.aspectRatio || 1.4,
  };
}

function normalizeSanityProject(project: SanityWorkProject): WorkProjectItem | null {
  if (!project.slug || !project.featuredImage?.asset) return null;

  const displayImage = project.thumbnailImage?.asset ? project.thumbnailImage : project.featuredImage;
  if (!displayImage.asset) return null;

  const normalizedDisplayImage = normalizeSanityImage(displayImage, project.title, 1600);
  const normalizedGallery = (project.gallery || [])
    .map((image, index) => normalizeSanityImage(image, `${project.title} image ${index + 1}`, 900))
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
  };
}

async function loadLocalFallback(): Promise<WorkProjectItem[]> {
  const { projects } = await import("../data/projects");

  return projects.map((project, index) => {
    const image: WorkProjectImage = {
      url: project.thumbnailImage || project.featuredImage,
      alt: project.title,
      aspectRatio: localAspectFallback[index % localAspectFallback.length],
    };

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      siteSize: project.credits.replace(/^Site size:\s*/i, ""),
      year: project.year,
      image,
      gallery: project.gallery.map((url, imageIndex) => ({
        url,
        alt: `${project.title} image ${imageIndex + 1}`,
        aspectRatio: localGalleryAspectFallback[(imageIndex + index) % localGalleryAspectFallback.length],
      })),
    };
  });
}

export function useWorkProjects() {
  const [projects, setProjects] = useState<WorkProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      const fallbackPromise = loadLocalFallback();

      void fallbackPromise.then((fallback) => {
        if (controller.signal.aborted) return;
        setProjects(fallback);
        setIsLoading(false);
      });

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
        await fallbackPromise;
      }
    }

    void loadProjects();
    return () => controller.abort();
  }, []);

  return { projects, isLoading };
}
