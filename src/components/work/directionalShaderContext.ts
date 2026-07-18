import { createContext, useContext } from "react";

export interface DirectionalShaderSurfaceRegistration {
  host: HTMLElement;
  fallback: HTMLImageElement;
  src: string;
}

export type RegisterDirectionalShaderSurface = (
  registration: DirectionalShaderSurfaceRegistration,
) => () => void;

export const DirectionalShaderContext = createContext<RegisterDirectionalShaderSurface | null>(null);

export function useDirectionalShaderSurface() {
  return useContext(DirectionalShaderContext);
}
