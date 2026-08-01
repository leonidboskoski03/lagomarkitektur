export type ProjectStoryPlacement =
  | "wide"
  | "portrait-left"
  | "portrait-center"
  | "portrait-right"
  | "landscape-left"
  | "landscape-right";

export interface ProjectImage {
  id: string;
  url: string;
  srcSet?: string;
  sizes?: string;
  previewUrl: string;
  previewSrcSet?: string;
  previewSizes?: string;
  atlasUrl: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspectRatio: number;
  storyPlacement: ProjectStoryPlacement;
}

export interface Project {
  id: string;
  sanityId: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  year: string;
  location: string;
  category: string;
  siteSize?: string;
  services: string[];
  image: ProjectImage;
  gallery: ProjectImage[];
  atlasImages: ProjectImage[];
}
