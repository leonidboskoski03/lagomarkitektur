import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isLanguage, type Language } from "./language";
import {
  LANGUAGE_STORAGE_KEY,
  LanguageContext,
  type LanguageContextValue,
} from "./LanguageContext";

function readStoredLanguage(): Language {
  try {
    const storedLanguage = window.sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(storedLanguage) ? storedLanguage : "sv";
  } catch {
    return "sv";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(readStoredLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    updateLanguage(nextLanguage);
    try {
      window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // The active tab still keeps the selected language in React state.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
