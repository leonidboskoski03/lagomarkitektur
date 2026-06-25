import type { ClassValue } from "clsx";
import clsx from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
