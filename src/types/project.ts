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
