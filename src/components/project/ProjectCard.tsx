import { Link } from "react-router-dom";
import { useRef } from "react";
import type { Project } from "../../types/project";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imgRef = useRef<HTMLImageElement>(null!);
  const prefersReducedMotion = usePrefersReducedMotion();

  function handleMouseEnter() {
    if (prefersReducedMotion) return;
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1.05)";
    }
  }

  function handleMouseLeave() {
    if (prefersReducedMotion) return;
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1)";
    }
  }

  return (
    <Link
      to={`/projekt/${project.slug}`}
      className="group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden bg-surface mb-4">
        <img
          ref={imgRef}
          src={project.featuredImage}
          alt={project.title}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out"
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-xs tracking-widest uppercase text-text-muted">
          {project.category}
        </span>
        <h3 className="font-display text-xl md:text-2xl text-text-primary">
          {project.title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2">{project.excerpt}</p>
      </div>
    </Link>
  );
}
