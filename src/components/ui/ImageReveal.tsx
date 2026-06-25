import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageReveal({ src, alt, className, aspectRatio }: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const imgRef = useRef<HTMLImageElement>(null!);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, { scale: 1.1 });
      gsap.to(wrapperRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      style={{ clipPath: prefersReducedMotion ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
      className={cn("overflow-hidden bg-surface", className)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ aspectRatio }}
      />
    </div>
  );
}
