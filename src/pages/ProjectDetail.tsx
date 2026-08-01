import { useLayoutEffect } from "react";
import { useParams } from "react-router";
import { NextProjectFeature } from "../components/project/NextProjectFeature";
import { ProjectClosingStory } from "../components/project/ProjectClosingStory";
import { ProjectGallery } from "../components/project/ProjectGallery";
import styles from "../components/project/ProjectDetail.module.css";
import { ProjectHero } from "../components/project/ProjectHero";
import { ProjectStoryIntro } from "../components/project/ProjectStoryIntro";
import { PageContainer } from "../components/layout/PageContainer";
import { WorkTransitionLink } from "../components/transition/WorkTransitionLink";
import { useLanguage } from "../i18n/LanguageContext";
import { siteCopy } from "../i18n/siteCopy";
import { useWorkProjects } from "../hooks/useWorkProjects";

export function ProjectDetail() {
  const { language } = useLanguage();
  const copy = siteCopy[language].project;
  const { slug } = useParams<{ slug: string }>();
  const { projects, isLoading, error } = useWorkProjects();
  const project = slug
    ? projects.find((item) => item.slug === slug)
    : undefined;

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

  if (isLoading) {
    return (
      <PageContainer className="min-h-screen pt-40 text-center">
        <p aria-live="polite" aria-busy="true" className="text-sm uppercase tracking-widest text-text-muted">
          {copy.loading}
        </p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer className="min-h-screen pt-40 text-center">
        <h1 className="mb-4 font-display text-4xl">{copy.unavailable}</h1>
        <WorkTransitionLink data-cursor="" className="text-sm uppercase tracking-widest underline">
          {copy.backToWork}
        </WorkTransitionLink>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer className="pt-40 text-center">
        <h1 className="mb-4 font-display text-4xl">{copy.notFound}</h1>
        <WorkTransitionLink data-cursor="" className="text-sm uppercase tracking-widest underline">
          {copy.backToWork}
        </WorkTransitionLink>
      </PageContainer>
    );
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];
  const heroMedia = project.gallery[0];
  const nextMedia = nextProject.gallery[0];

  if (!heroMedia || !nextMedia) {
    return (
      <PageContainer className="pt-40 text-center">
        <h1 className="mb-4 font-display text-4xl">{copy.imageryUnavailable}</h1>
        <WorkTransitionLink data-cursor="" className="text-sm uppercase tracking-widest underline">
          {copy.backToWork}
        </WorkTransitionLink>
      </PageContainer>
    );
  }

  return (
    <article className={styles.page}>
      <ProjectHero project={project} media={heroMedia} />
      <ProjectStoryIntro project={project} />
      <ProjectGallery projectTitle={project.title} media={project.gallery} />

      <ProjectClosingStory
        projectTitle={project.title}
        projectSlug={project.slug}
        excerpt={project.excerpt}
      />

      <NextProjectFeature project={nextProject} media={nextMedia} />
    </article>
  );
}
