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
}

interface SanityWorkProject {
  _id: string;
  title: string;
  slug: string;
  category: string;
  siteSize?: string;
  year: string;
  featuredImage: {
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
  };
  thumbnailImage?: SanityWorkProject["featuredImage"];
}

const localAspectFallback = [0.8, 1.5, 1.7778, 1.7768, 1.5, 1.7778, 1.7782, 1.5, 0.906, 1.5, 1.5];

function normalizeSanityProject(project: SanityWorkProject): WorkProjectItem | null {
  if (!project.slug || !project.featuredImage?.asset) return null;

  const displayImage = project.thumbnailImage?.asset ? project.thumbnailImage : project.featuredImage;
  const dimensions = displayImage.asset?.metadata?.dimensions;

  if (!displayImage.asset) return null;

  return {
    id: project._id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    siteSize: project.siteSize,
    year: project.year,
    image: {
      url: displayImage.asset.url,
      alt: displayImage.alt || project.title,
      width: dimensions?.width,
      height: dimensions?.height,
      aspectRatio: dimensions?.aspectRatio || 1.4,
    },
  };
}

async function loadLocalFallback(): Promise<WorkProjectItem[]> {
  const { projects } = await import("../data/projects");

  return projects.map((project, index) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    siteSize: project.credits.replace(/^Site size:\s*/i, ""),
    year: project.year,
    image: {
      url: project.thumbnailImage || project.featuredImage,
      alt: project.title,
      aspectRatio: localAspectFallback[index % localAspectFallback.length],
    },
  }));
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
