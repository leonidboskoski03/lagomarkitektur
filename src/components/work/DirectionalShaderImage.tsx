import { useEffect, useRef } from "react";
import { useDirectionalShaderSurface } from "./directionalShaderContext";

interface DirectionalShaderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio: number;
  enabled?: boolean;
}

export function DirectionalShaderImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  enabled = true,
}: DirectionalShaderImageProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const fallbackRef = useRef<HTMLImageElement | null>(null);
  const registerSurface = useDirectionalShaderSurface();

  useEffect(() => {
    const host = hostRef.current;
    const fallback = fallbackRef.current;
    if (!host || !fallback || !enabled || !registerSurface) return;

    return registerSurface({ host, fallback, src });
  }, [enabled, registerSurface, src]);

  return (
    <span
      ref={hostRef}
      className="relative isolate block overflow-visible"
      style={{ aspectRatio }}
    >
      <img
        ref={fallbackRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        draggable={false}
        className="pointer-events-none !h-full w-full object-cover transition-opacity duration-100 ease-out"
      />
    </span>
  );
}
