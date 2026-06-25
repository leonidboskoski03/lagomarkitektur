import type { Project } from "../../types/project";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  columns?: 2 | 3;
}

export function ProjectGrid({ projects, columns = 2 }: ProjectGridProps) {
  const gridClass = columns === 3
    ? "grid-cols-1 md:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-12 md:gap-16`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
