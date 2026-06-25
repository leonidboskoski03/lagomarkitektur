import { useSyncExternalStore } from "react";

function getMatchMedia(): MediaQueryList | null {
  return typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
}

function subscribe(callback: () => void) {
  const mql = getMatchMedia();
  if (!mql) return () => {};
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  const mql = getMatchMedia();
  return mql ? mql.matches : false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
