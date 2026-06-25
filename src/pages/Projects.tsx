import { useMemo } from "react";
import { projects } from "../data/projects";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ProjectCard } from "../components/project/ProjectCard";
import { useGsapReveal } from "../hooks/useGsapReveal";

const categories = Array.from(new Set(projects.map((p) => p.category)));

export function Projects() {
  const gridRef = useGsapReveal<HTMLDivElement>();

  const projectList = useMemo(
    () =>
      projects
        .slice()
        .sort((a, b) => Number.parseInt(a.id) - Number.parseInt(b.id)),
    []
  );

  return (
    <div className="pt-32 pb-24 md:pb-40">
      <div className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Projekt"
            title="Alla projekt"
            description="En samling av våra projekt — från villor och stadsvåningar till kontor och offentliga rum."
          />

          <div className="flex flex-wrap gap-3 mb-16">
            <span className="text-xs tracking-widest uppercase px-4 py-2 border border-border rounded-full text-text-primary bg-surface/50">
              Alla
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs tracking-widest uppercase px-4 py-2 border border-border rounded-full text-text-muted hover:text-text-primary hover:border-text-muted transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div ref={gridRef} className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projectList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
