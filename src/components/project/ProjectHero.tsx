import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { Project } from "../../types/project";
import { PageContainer } from "../layout/PageContainer";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const imgRef = useRef<HTMLDivElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.8, ease: "power2.out" }
      );
      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative h-[80vh] md:h-[90vh] overflow-hidden">
      <div
        ref={imgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.featuredImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 pb-12 md:pb-24"
      >
        <PageContainer>
          <span className="text-xs tracking-widest uppercase text-white/60 mb-3 block">
            {project.category}
          </span>
          <h1 className="font-display text-4xl md:text-7xl text-white leading-tight max-w-3xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/70">
            <span>{project.year}</span>
            <span>{project.location}</span>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
