import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface UseGsapRevealOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: string | Element;
  scrub?: boolean;
  markers?: boolean;
}

export function useGsapReveal<T extends HTMLElement>(
  options: UseGsapRevealOptions = {}
) {
  const ref = useRef<T>(null!);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: options.trigger instanceof Element ? options.trigger : el,
          start: "top 85%",
          toggleActions: "play none none none",
          ...options,
        },
        ...options.from,
      });
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion, options]);

  return ref;
}
