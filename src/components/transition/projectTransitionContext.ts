import { createContext, useContext } from "react";

export interface ProjectTransitionRequest {
  slug: string;
  shouldFocusTitle: boolean;
}

export interface ProjectTransitionContextValue {
  isTransitioning: boolean;
  startProjectTransition: (request: ProjectTransitionRequest) => void;
}

export const ProjectTransitionContext =
  createContext<ProjectTransitionContextValue | null>(null);

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);
  if (!context) {
    throw new Error("useProjectTransition must be used inside ProjectTransitionProvider.");
  }
  return context;
}
