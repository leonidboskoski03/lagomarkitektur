export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  year: string;
  location: string;
  category: string;
  services: string[];
  featuredImage: string;
  thumbnailImage?: string;
  gallery: string[];
  credits: string;
  isFeatured: boolean;
}

export type ProjectStoryPlacement =
  | "wide"
  | "portrait-left"
  | "portrait-center"
  | "portrait-right"
  | "landscape-left"
  | "landscape-right";

export interface ProjectGalleryMedia {
  id: string;
  src: string;
  previewSrc: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspectRatio: number;
  storyPlacement: ProjectStoryPlacement;
}
