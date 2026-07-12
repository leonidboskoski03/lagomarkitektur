import { Link, useParams } from "react-router-dom";
import { getProjectBySlug, projects } from "../data/projects";
import { ProjectHero } from "../components/project/ProjectHero";
import { ImageReveal } from "../components/ui/ImageReveal";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { PageContainer } from "../components/layout/PageContainer";

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const contentRef = useGsapReveal<HTMLDivElement>();

  if (!project) {
    return (
      <PageContainer className="pt-40 text-center">
        <h1 className="mb-4 font-display text-4xl">Project not found</h1>
        <Link to="/work" data-cursor="" className="text-sm uppercase tracking-widest underline">
          Back to work
        </Link>
      </PageContainer>
    );
  }

  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return (
    <>
      <ProjectHero project={project} />

      <PageContainer ref={contentRef} className="section-space">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-base leading-relaxed text-text-primary md:text-lg">
              {project.description}
            </p>
          </div>
          <aside className="space-y-6">
            <ProjectMeta label="Year" value={project.year} />
            <ProjectMeta label="Location" value={project.location} />
            <ProjectMeta label="Category" value={project.category} />
            {project.services.length > 0 && (
              <div>
                <span className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
                  Services
                </span>
                <ul className="space-y-1">
                  {project.services.map((service) => (
                    <li key={service} className="text-sm">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <div className="space-y-8 md:space-y-16">
            {project.gallery.map((img, index) => (
              <div key={img} className={index % 2 === 0 ? "md:col-span-2 md:col-start-2" : ""}>
                <ImageReveal
                  src={img}
                  alt={`${project.title} image ${index + 1}`}
                  aspectRatio={index === 1 ? "16/9" : "4/3"}
                  className={index % 2 === 0 ? "ml-auto md:w-2/3" : "md:w-2/3"}
                />
              </div>
            ))}
          </div>
        )}

        {project.credits && (
          <div className="mt-20 border-t border-border pt-12">
            <span className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
              Scale
            </span>
            <p className="text-sm text-text-muted">{project.credits}</p>
          </div>
        )}
      </PageContainer>

      <div className="border-t border-border">
        <Link
          to={`/work/${nextProject.slug}`}
          data-cursor=""
          className="group block section-space-sm transition-colors hover:bg-surface/30"
        >
          <PageContainer className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
                Next project
              </span>
              <h3 className="font-display text-2xl text-text-primary transition-colors group-hover:text-text-muted md:text-4xl">
                {nextProject.title}
              </h3>
            </div>
            <span className="text-sm uppercase tracking-widest text-text-muted transition-colors group-hover:text-text-primary">
              View →
            </span>
          </PageContainer>
        </Link>
      </div>
    </>
  );
}

function ProjectMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-widest text-text-muted">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
