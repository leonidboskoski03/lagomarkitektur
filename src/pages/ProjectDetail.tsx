import { useParams, Link } from "react-router-dom";
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
        <h1 className="font-display text-4xl mb-4">Projektet hittades inte</h1>
        <Link
          to="/projekt"
          data-cursor=""
          className="text-sm tracking-widest uppercase underline"
        >
          Tillbaka till projekt
        </Link>
      </PageContainer>
    );
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return (
    <>
      <ProjectHero project={project} />

      <PageContainer ref={contentRef} className="section-space">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2">
            <p className="text-base md:text-lg leading-relaxed text-text-primary">
              {project.description}
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-1">
                År
              </span>
              <span className="text-sm">{project.year}</span>
            </div>
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-1">
                Plats
              </span>
              <span className="text-sm">{project.location}</span>
            </div>
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-1">
                Kategori
              </span>
              <span className="text-sm">{project.category}</span>
            </div>
            {project.services.length > 0 && (
              <div>
                <span className="text-xs tracking-widest uppercase text-text-muted block mb-2">
                  Tjänster
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
          </div>
        </div>

        {project.gallery.length > 0 && (
          <div className="space-y-8 md:space-y-16">
            {project.gallery.map((img, i) => (
              <div key={i} className={i % 2 === 0 ? "md:col-span-2 md:col-start-2" : ""}>
                <ImageReveal
                  src={img}
                  alt={`${project.title} — bild ${i + 1}`}
                  aspectRatio={i === 1 ? "16/9" : "4/3"}
                  className={i % 2 === 0 ? "md:w-2/3 ml-auto" : "md:w-2/3"}
                />
              </div>
            ))}
          </div>
        )}

        {project.credits && (
          <div className="mt-20 pt-12 border-t border-border">
            <span className="text-xs tracking-widest uppercase text-text-muted block mb-2">
              Credits
            </span>
            <p className="text-sm text-text-muted">{project.credits}</p>
          </div>
        )}
      </PageContainer>

      <div className="border-t border-border">
        <Link
          to={`/projekt/${nextProject.slug}`}
          data-cursor=""
          className="group block section-space-sm hover:bg-surface/30 transition-colors"
        >
          <PageContainer className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-2">
                Nästa projekt
              </span>
              <h3 className="font-display text-2xl md:text-4xl text-text-primary group-hover:text-text-muted transition-colors">
                {nextProject.title}
              </h3>
            </div>
            <span className="text-sm tracking-widest uppercase text-text-muted group-hover:text-text-primary transition-colors">
              Visa →
            </span>
          </PageContainer>
        </Link>
      </div>
    </>
  );
}
