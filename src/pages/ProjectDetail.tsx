import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectBySlug,
  getProjectGalleryMedia,
  getProjects,
} from "../data/projects";
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

export function ProjectDetail() {
  const { language } = useLanguage();
  const copy = siteCopy[language].project;
  const { slug } = useParams<{ slug: string }>();
  const projects = getProjects(language);
  const project = slug ? getProjectBySlug(slug, language) : undefined;

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

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
  const galleryMedia = getProjectGalleryMedia(project, language);
  const nextProjectMedia = getProjectGalleryMedia(nextProject, language);
  const heroMedia = galleryMedia[0];
  const nextMedia = nextProjectMedia[0];

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
      <ProjectGallery projectTitle={project.title} media={galleryMedia} />

      <ProjectClosingStory
        projectTitle={project.title}
        projectSlug={project.slug}
        excerpt={project.excerpt}
      />

      <NextProjectFeature project={nextProject} media={nextMedia} />
    </article>
  );
}
