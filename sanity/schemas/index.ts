import { homeProjectShowcase } from "./homeProjectShowcase";
import { project } from "./project";
import { projectImage } from "./projectImage";
import { siteSettings } from "./siteSettings";
import { localizedString } from "./localizedString";
import { localizedText } from "./localizedText";
import { localizedBlockContent } from "./localizedBlockContent";

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedBlockContent,
  projectImage,
  project,
  homeProjectShowcase,
  siteSettings,
];
