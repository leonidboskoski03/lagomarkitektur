import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motionEases } from "../../lib/motion";
import type { Project, ProjectGalleryMedia } from "../../types/project";
import styles from "./ProjectDetail.module.css";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface NextProjectFeatureProps {
  project: Project;
  media: ProjectGalleryMedia;
}

export function NextProjectFeature({ project, media }: NextProjectFeatureProps) {
  const sectionRef = useRef<HTMLAnchorElement | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const title = section?.querySelector<HTMLElement>("[data-next-project-title]");
    const label = section?.querySelector<HTMLElement>("[data-next-project-label]");
    const meta = section?.querySelector<HTMLElement>("[data-next-project-meta]");

    if (!section || !title || !label || !meta) return;

    const metaItems = Array.from(meta.children) as HTMLElement[];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([title, label, ...metaItems], { clearProps: "all" });
      return;
    }

    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      linesClass: styles.storyLine,
      autoSplit: true,
      aria: "auto",
      onSplit(self) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        timeline.fromTo(
          self.lines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 1.18,
            stagger: 0.075,
            ease: motionEases.cinematic,
          },
        );

        return timeline;
      },
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
        defaults: {
          ease: motionEases.enter,
        },
      })
      .fromTo(
        label,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
        },
        0.08,
      )
      .fromTo(
        metaItems,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          stagger: 0.065,
        },
        0.28,
      );
  }, { scope: sectionRef, dependencies: [project.slug] });

  useGSAP(() => {
    const section = sectionRef.current;
    const mediaElement = section?.querySelector<HTMLElement>("[data-next-project-media]");
    const image = mediaElement?.querySelector<HTMLImageElement>("[data-next-project-image]");
    const reveal = mediaElement?.querySelector<HTMLElement>("[data-next-project-reveal]");

    if (!mediaElement || !image || !reveal) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(reveal, { autoAlpha: 0 });
      return;
    }

    gsap.set(reveal, { autoAlpha: 1 });

    const revealTween = gsap.to(reveal, {
      autoAlpha: 0,
      duration: 0.72,
      ease: motionEases.reveal,
      overwrite: "auto",
      paused: true,
    });

    const revealImage = () => revealTween.play();

    const trigger = ScrollTrigger.create({
      trigger: mediaElement,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (image.complete && image.naturalWidth > 0) {
          revealImage();
          return;
        }

        image.addEventListener("load", revealImage, { once: true });
      },
    });

    return () => {
      image.removeEventListener("load", revealImage);
      trigger.kill();
    };
  }, { scope: sectionRef, dependencies: [project.slug, media.previewSrc] });

  return (
    <ProjectTransitionLink
      ref={sectionRef}
      projectSlug={project.slug}
      data-next-project
      data-cursor="open"
      aria-label={`View next project: ${project.title}`}
      className={styles.nextProject}
    >
      <div className={styles.nextProjectInner}>
        <div
          data-next-project-media
          data-transition-image={`${project.id}:cover`}
          className={styles.nextMedia}
        >
          <img
            data-next-project-image
            src={media.previewSrc}
            alt=""
            width={Math.min(media.width, 640)}
            height={Math.round(Math.min(media.width, 640) / media.aspectRatio)}
            loading="lazy"
            decoding="async"
          />
          <span
            data-next-project-reveal
            aria-hidden="true"
            className={styles.nextMediaReveal}
          />
        </div>

        <div className={styles.nextCopy}>
          <span data-next-project-label className={styles.sectionLabel}>
            Next project
          </span>
          <h2 data-next-project-title className={styles.nextTitle}>
            {project.title}
          </h2>
          <div data-next-project-meta className={styles.nextMeta}>
            <span>{project.category}</span>
            <span>{project.year} / View project →</span>
          </div>
        </div>
      </div>
    </ProjectTransitionLink>
  );
}
