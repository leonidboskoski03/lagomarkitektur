import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motionEases } from "../../lib/motion";
import { formatProjectArea } from "../../lib/projectArea";
import type { Project } from "../../types/project";
import styles from "./ProjectDetail.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { siteCopy } from "../../i18n/siteCopy";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface ProjectStoryIntroProps {
  project: Project;
}

export function ProjectStoryIntro({ project }: ProjectStoryIntroProps) {
  const { language } = useLanguage();
  const copy = siteCopy[language].project;
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectArea = formatProjectArea(project.siteSize);
  const serviceRows = Array.from(
    { length: Math.ceil(project.services.length / 2) },
    (_, rowIndex) => project.services.slice(rowIndex * 2, rowIndex * 2 + 2),
  );

  useGSAP(() => {
    const section = sectionRef.current;
    const storyLead = section?.querySelector<HTMLElement>("[data-project-story-lead]");
    const facts = section?.querySelector<HTMLElement>("[data-project-story-facts]");
    const introIndex = section?.querySelector<HTMLElement>("[data-project-story-index]");

    if (!section || !storyLead || !facts || !introIndex) return;

    const factGroups = Array.from(facts.children) as HTMLElement[];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([storyLead, ...factGroups, introIndex], { clearProps: "all" });
      return;
    }

    SplitText.create(storyLead, {
      type: "lines",
      mask: "lines",
      linesClass: styles.storyLine,
      autoSplit: true,
      aria: "auto",
      onSplit(self) {
        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });

        storyTimeline.fromTo(
          self.lines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 1.18,
            stagger: 0.075,
            ease: motionEases.cinematic,
          },
        );

        return storyTimeline;
      },
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
        defaults: {
          ease: motionEases.enter,
        },
      })
      .fromTo(
        factGroups,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.065,
        },
        0.18,
      )
      .fromTo(
        introIndex,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
        },
        0.3,
      );
  }, { scope: sectionRef, dependencies: [project.slug] });

  return (
    <section ref={sectionRef} aria-labelledby="project-story-heading">
      <div className={`viewport-container ${styles.intro}`}>
        <h2 id="project-story-heading" className="sr-only">
          {copy.about} {project.title}
        </h2>

        <aside
          data-project-story-facts
          className={styles.facts}
          aria-label={copy.facts}
        >
          <ProjectFact label={copy.location} value={project.location} />
          <ProjectFact label={copy.year} value={project.year} />
          <ProjectFact label={copy.type} value={project.category} />
          {projectArea ? <ProjectFact label={copy.scale} value={projectArea} /> : null}

          {project.services.length > 0 ? (
            <div>
              <span className={styles.factLabel}>{copy.services}</span>
              <ul className={styles.services}>
                {serviceRows.map((services) => (
                  <li key={services.join("-")} className={styles.factValue}>
                    {services.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <p data-project-story-lead className={styles.storyLead}>
          {project.description}
        </p>
        <span
          data-project-story-index
          className={styles.introIndex}
          aria-hidden="true"
        >
          ({project.id})
        </span>
      </div>
    </section>
  );
}

function ProjectFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={styles.factLabel}>{label}</span>
      <span className={styles.factValue}>{value}</span>
    </div>
  );
}
