import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
export const sanityDataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? "production";

export const hasSanityConfig = Boolean(sanityProjectId && sanityProjectId !== "replace-me");

export const sanityClient = createClient({
  projectId: sanityProjectId || "replace-me",
  dataset: sanityDataset,
  apiVersion: "2026-07-09",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export const workProjectListQuery = `*[_type == "project" && isPublished != false] | order(orderRank asc, year desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  siteSize,
  year,
  featuredImage {
    alt,
    caption,
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  thumbnailImage {
    alt,
    caption,
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  }
}`;

export const projectListQuery = `*[_type == "project"] | order(orderRank asc, year desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  description,
  year,
  location,
  category,
  siteSize,
  services,
  featuredImage,
  gallery,
  credits,
  isFeatured,
  orderRank
}`;
