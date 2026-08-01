import { useEffect, useState } from "react";
import { loadSanityProjects } from "../data/sanityProjects";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/language";
import type { Project, ProjectImage } from "../types/project";

export type WorkProjectItem = Project;
export type WorkProjectImage = ProjectImage;

interface WorkProjectState {
  language: Language;
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
}

const stateCache = new Map<Language, Project[]>();

export async function loadWorkProjects(language: Language) {
  const projects = await loadSanityProjects(language);
  stateCache.set(language, projects);
  return projects;
}

export function useWorkProjects() {
  const { language } = useLanguage();
  const [state, setState] = useState<WorkProjectState>(() => ({
    language,
    projects: stateCache.get(language) || [],
    isLoading: !stateCache.has(language),
    error: null,
  }));
  const currentState = state.language === language
    ? state
    : {
      language,
      projects: stateCache.get(language) || [],
      isLoading: !stateCache.has(language),
      error: null,
    };

  useEffect(() => {
    let active = true;

    void loadWorkProjects(language)
      .then((projects) => {
        if (active) setState({ language, projects, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const normalizedError = error instanceof Error
          ? error
          : new Error("Could not load projects");
        setState({ language, projects: [], isLoading: false, error: normalizedError });
      });

    return () => {
      active = false;
    };
  }, [language]);

  return currentState;
}
