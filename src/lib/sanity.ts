import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
export const sanityDataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? "production";

export const hasSanityConfig = Boolean(sanityProjectId && sanityProjectId !== "replace-me");

export const sanityClient = createClient({
  projectId: sanityProjectId || "replace-me",
  dataset: sanityDataset,
  apiVersion: "2026-08-01",
  useCdn: true,
  perspective: "published",
});

const builder = createImageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export const workProjectListQuery = `*[_type == "project" && isPublished != false] | order(orderRank asc, year desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  description,
  category,
  siteSize,
  services,
  location,
  year,
  featuredImage {
    alt,
    caption,
    crop,
    hotspot,
    asset,
    "assetData": asset-> {
      _id,
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
    crop,
    hotspot,
    asset,
    "assetData": asset-> {
      _id,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  gallery[] {
    alt,
    caption,
    crop,
    hotspot,
    asset,
    "assetData": asset-> {
      _id,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  workGallery[] {
    alt,
    caption,
    crop,
    hotspot,
    asset,
    "assetData": asset-> {
      _id,
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

export const homeProjectShowcaseQuery = `*[
  _type == "homeProjectShowcase" &&
  _id == "homeProjectShowcase"
][0] {
  introTitle,
  introTags,
  introProperties,
  introBackground {
    alt,
    crop,
    hotspot,
    asset,
    "assetData": asset-> {
      _id,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  projects[] {
    _key,
    backgroundImage {
      alt,
      crop,
      hotspot,
      asset,
      "assetData": asset-> {
        _id,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    primaryImage {
      alt,
      crop,
      hotspot,
      asset,
      "assetData": asset-> {
        _id,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    secondaryImage {
      alt,
      crop,
      hotspot,
      asset,
      "assetData": asset-> {
        _id,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    project-> {
      _id,
      title,
      "slug": slug.current,
      category,
      services,
      showcaseTags,
      showcaseDetails,
      year,
      location,
      siteSize,
      isPublished,
      featuredImage {
        alt,
        crop,
        hotspot,
        asset,
        "assetData": asset-> {
          _id,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
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
