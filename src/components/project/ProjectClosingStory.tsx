import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motionEases } from "../../lib/motion";
import styles from "./ProjectDetail.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface ProjectClosingStoryProps {
  projectTitle: string;
  projectSlug: string;
  excerpt: string;
}

export function ProjectClosingStory({
  projectTitle,
  projectSlug,
  excerpt,
}: ProjectClosingStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const copy = section?.querySelector<HTMLElement>("[data-project-closing-copy]");
    const label = section?.querySelector<HTMLElement>("[data-project-closing-label]");

    if (!section || !copy || !label) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([copy, label], { clearProps: "all" });
      return;
    }

    SplitText.create(copy, {
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

    gsap.fromTo(
      label,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: motionEases.enter,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, { scope: sectionRef, dependencies: [projectSlug] });

  return (
    <section ref={sectionRef} aria-labelledby="project-closing-heading">
      <div className={`viewport-container ${styles.closingStory}`}>
        <div data-project-closing-label className={styles.closingLabel}>
          <span className={styles.sectionLabel}>Spatial character</span>
        </div>
        <h2 id="project-closing-heading" className="sr-only">
          {projectTitle} project summary
        </h2>
        <p data-project-closing-copy className={styles.closingCopy}>
          {excerpt}
        </p>
      </div>
    </section>
  );
}
