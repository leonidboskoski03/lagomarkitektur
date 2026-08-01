import type { SanityImageSource } from "@sanity/image-url";
import {
  hasSanityConfig,
  sanityClient,
  sanityImageUrl,
  workProjectListQuery,
} from "../lib/sanity";
import {
  resolveLocalizedText,
  translateCanonicalValue,
  type Language,
  type MaybeLocalizedText,
} from "../i18n/language";
import type {
  Project,
  ProjectImage,
  ProjectStoryPlacement,
} from "../types/project";

interface PortableTextSpan {
  _type?: string;
  text?: string;
}

interface PortableTextBlock {
  _type?: string;
  children?: PortableTextSpan[];
}

type PortableTextValue = PortableTextBlock[];
  
interface LocalizedPortableText {
  sv?: PortableTextValue;
  en?: PortableTextValue;
}

type MaybeLocalizedPortableText =
  | PortableTextValue
  | LocalizedPortableText
  | string
  | null
  | undefined;

interface SanityProjectImage {
  _key?: string;
  alt?: MaybeLocalizedText;
  caption?: MaybeLocalizedText;
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

interface SanityProjectDocument {
  _id: string;
  title: MaybeLocalizedText;
  slug: string;
  excerpt?: MaybeLocalizedText;
  description?: MaybeLocalizedPortableText;
  year: string;
  location?: MaybeLocalizedText;
  category: string;
  siteSize?: string;
  services?: string[];
  featuredImage: SanityProjectImage;
  thumbnailImage?: SanityProjectImage;
  gallery?: SanityProjectImage[];
  workGallery?: SanityProjectImage[];
}

const displayWidths = [640, 960, 1280, 1600, 2000];
const previewWidths = [320, 480, 640];
const atlasWidth = 768;
const storyPlacements: readonly ProjectStoryPlacement[] = [
  "wide",
  "portrait-left",
  "portrait-center",
  "portrait-right",
  "landscape-left",
  "landscape-right",
];
const projectCache = new Map<Language, Project[]>();
const projectPromises = new Map<Language, Promise<Project[]>>();

function availableWidths(widths: number[], sourceWidth?: number) {
  if (!sourceWidth) return widths;
  const requestedMaximum = widths.at(-1) || sourceWidth;
  if (sourceWidth >= requestedMaximum) return widths;
  return Array.from(new Set([
    ...widths.filter((width) => width < sourceWidth),
    sourceWidth,
  ])).sort((first, second) => first - second);
}

function imageUrl(image: SanityProjectImage, width: number, quality: number) {
  return sanityImageUrl(image as SanityImageSource)
    .width(Math.round(width))
    .fit("max")
    .auto("format")
    .quality(quality)
    .url();
}

function imageSrcSet(
  image: SanityProjectImage,
  widths: number[],
  quality: number,
  sourceWidth?: number,
) {
  return availableWidths(widths, sourceWidth)
    .map((width) => `${imageUrl(image, width, quality)} ${width}w`)
    .join(", ");
}

function portableTextToPlainText(value: MaybeLocalizedPortableText, language: Language) {
  if (typeof value === "string") return value.trim();

  const blocks = Array.isArray(value)
    ? value
    : value?.[language] || value?.sv || value?.en || [];

  return blocks
    .map((block) => block.children
      ?.map((child) => child.text || "")
      .join("")
      .trim())
    .filter(Boolean)
    .join(" ");
}

function normalizeImage(
  image: SanityProjectImage | undefined,
  id: string,
  fallbackAlt: string,
  language: Language,
  index: number,
): ProjectImage | null {
  if (!image?.asset?._ref || !image.assetData?._id) return null;

  const dimensions = image.assetData.metadata?.dimensions;
  const sourceWidth = dimensions?.width || 2000;
  const sourceHeight = dimensions?.height || Math.round(sourceWidth / 1.5);
  const aspectRatio = dimensions?.aspectRatio || sourceWidth / sourceHeight;
  const fullWidths = availableWidths(displayWidths, sourceWidth);
  const smallWidths = availableWidths(previewWidths, sourceWidth);
  const width = fullWidths.at(-1) || sourceWidth;
  const height = Math.round(width / aspectRatio);
  const previewWidth = smallWidths.at(-1) || Math.min(sourceWidth, 640);
  const alt = resolveLocalizedText(image.alt, language, fallbackAlt);
  const caption = resolveLocalizedText(image.caption, language);

  return {
    id,
    url: imageUrl(image, width, 84),
    srcSet: imageSrcSet(image, displayWidths, 84, sourceWidth),
    sizes: "(max-width: 767px) 92vw, 66vw",
    previewUrl: imageUrl(image, previewWidth, 72),
    previewSrcSet: imageSrcSet(image, previewWidths, 72, sourceWidth),
    previewSizes: "(max-width: 767px) 48vw, 15vw",
    atlasUrl: imageUrl(image, Math.min(sourceWidth, atlasWidth), 70),
    alt,
    ...(caption ? { caption } : {}),
    width,
    height,
    aspectRatio,
    storyPlacement: storyPlacements[index % storyPlacements.length],
  };
}

function uniqueImages(images: ProjectImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function normalizeProject(
  document: SanityProjectDocument,
  index: number,
  language: Language,
): Project | null {
  if (!document.slug || !document.featuredImage?.asset?._ref) return null;

  const title = resolveLocalizedText(document.title, language);
  if (!title) return null;

  const featured = normalizeImage(
    document.featuredImage,
    `${document._id}:featured`,
    title,
    language,
    0,
  );
  const thumbnail = normalizeImage(
    document.thumbnailImage,
    `${document._id}:thumbnail`,
    title,
    language,
    0,
  );
  const gallery = (document.gallery || [])
    .map((image, imageIndex) => normalizeImage(
      image,
      image._key || `${document._id}:gallery:${imageIndex}`,
      `${title} ${language === "sv" ? "bild" : "view"} ${String(imageIndex + 1).padStart(2, "0")}`,
      language,
      imageIndex,
    ))
    .filter((image): image is ProjectImage => image !== null);
  const workGallery = (document.workGallery || [])
    .map((image, imageIndex) => normalizeImage(
      image,
      image._key || `${document._id}:work:${imageIndex}`,
      `${title} ${language === "sv" ? "atlasbild" : "atlas image"} ${imageIndex + 1}`,
      language,
      imageIndex,
    ))
    .filter((image): image is ProjectImage => image !== null);

  if (!featured) return null;

  const displayImage = thumbnail || featured;
  const completeGallery = uniqueImages(gallery.length > 0 ? gallery : [featured]);
  const atlasImages = uniqueImages(
    workGallery.length > 0
      ? [...workGallery, displayImage, ...completeGallery]
      : [displayImage, ...completeGallery],
  ).slice(0, 5);

  return {
    id: String(index + 1).padStart(2, "0"),
    sanityId: document._id,
    title,
    slug: document.slug,
    excerpt: resolveLocalizedText(document.excerpt, language),
    description: portableTextToPlainText(document.description, language),
    year: document.year,
    location: resolveLocalizedText(document.location, language),
    category: translateCanonicalValue(document.category, language),
    siteSize: document.siteSize,
    services: (document.services || []).map((service) =>
      translateCanonicalValue(service, language)),
    image: displayImage,
    gallery: completeGallery,
    atlasImages,
  };
}

export function loadSanityProjects(language: Language): Promise<Project[]> {
  const cached = projectCache.get(language);
  const pending = projectPromises.get(language);
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;

  const promise = (async () => {
    if (!hasSanityConfig) throw new Error("Sanity is not configured");

    const result = await sanityClient.fetch<SanityProjectDocument[]>(
      workProjectListQuery,
      {},
    );
    const projects = result
      .map((project, index) => normalizeProject(project, index, language))
      .filter((project): project is Project => project !== null);

    if (projects.length === 0) {
      throw new Error("Sanity returned no complete published projects");
    }

    projectCache.set(language, projects);
    return projects;
  })().finally(() => {
    projectPromises.delete(language);
  });

  projectPromises.set(language, promise);
  return promise;
}

export function getCachedSanityProject(slug: string, language: Language) {
  return projectCache.get(language)?.find((project) => project.slug === slug);
}

export async function loadSanityProject(slug: string, language: Language) {
  const cached = getCachedSanityProject(slug, language);
  if (cached) return cached;
  const projects = await loadSanityProjects(language);
  return projects.find((project) => project.slug === slug);
}
