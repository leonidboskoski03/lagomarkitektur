import { createContext, useContext } from "react";

export interface ContactTransitionContextValue {
  isContactTransitioning: boolean;
  startContactTransition: () => void;
}

export const ContactTransitionContext =
  createContext<ContactTransitionContextValue | null>(null);

export function useContactTransition() {
  const context = useContext(ContactTransitionContext);

  if (!context) {
    throw new Error(
      "useContactTransition must be used inside ContactTransitionProvider.",
    );
  }

  return context;
}
