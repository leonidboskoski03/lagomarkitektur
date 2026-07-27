import { createContext, useContext } from "react";

export interface WorkTransitionContextValue {
  isWorkTransitioning: boolean;
  startWorkTransition: () => void;
}

export const WorkTransitionContext =
  createContext<WorkTransitionContextValue | null>(null);

export function useWorkTransition() {
  const context = useContext(WorkTransitionContext);
  if (!context) {
    throw new Error("useWorkTransition must be used inside WorkTransitionProvider.");
  }
  return context;
}
