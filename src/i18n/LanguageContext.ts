import { createContext, useContext } from "react";
import type { Language } from "./language";

export const LANGUAGE_STORAGE_KEY = "lagom-language";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function useLocalizedContent<const T extends Record<Language, unknown>>(
  content: T,
): T[Language] {
  const { language } = useLanguage();
  return content[language];
}
