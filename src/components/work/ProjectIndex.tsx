import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { motionEases } from "../../lib/motion";
import { ProjectIndexStrip } from "./ProjectIndexStrip";

gsap.registerPlugin(ScrollTrigger);

interface ProjectIndexProps {
  projects: WorkProjectItem[];
}

export function ProjectIndex({ projects }: ProjectIndexProps) {
  const indexRef = useRef<HTMLElement | null>(null);
  const hasInteractedRef = useRef(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>("[data-index-row]", indexRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(rows, { clearProps: "all" });
      rows.forEach((row) => { row.dataset.indexRevealed = "true"; });
      return;
    }

    gsap.set(rows, { y: 28, autoAlpha: 0, clipPath: "inset(0% 0% 26% 0%)" });
    ScrollTrigger.batch(rows, {
      start: "top 91%",
      once: true,
      onEnter: (batch) => {
        batch.forEach((row) => { (row as HTMLElement).dataset.indexRevealed = "true"; });
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.86,
          stagger: 0.065,
          ease: motionEases.enter,
          clearProps: "clipPath",
        });
      },
    });
  }, { scope: indexRef, dependencies: [projects] });

  useGSAP(() => {
    if (!hasInteractedRef.current) return;

    const rows = gsap.utils.toArray<HTMLElement>("[data-index-row]", indexRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    rows.forEach((row) => {
      if (row.dataset.indexRevealed !== "true") return;

      const isActive = !activeProjectId || row.dataset.projectId === activeProjectId;
      const images = gsap.utils.toArray<HTMLElement>("[data-index-image]", row);
      const title = row.querySelector<HTMLElement>("[data-index-title]");

      gsap.to(row, {
        autoAlpha: isActive ? 1 : 0.26,
        duration: reduceMotion ? 0 : activeProjectId ? 0.94 : 1.18,
        ease: motionEases.settle,
        overwrite: "auto",
      });

      if (title) {
        gsap.to(title, {
          x: activeProjectId && isActive ? 4 : 0,
          duration: reduceMotion ? 0 : 1.18,
          ease: motionEases.settle,
          overwrite: "auto",
        });
      }

      gsap.to(images, {
        scale: activeProjectId && isActive ? 1.018 : 1,
        autoAlpha: activeProjectId && isActive ? 1 : 0.86,
        filter: activeProjectId && isActive ? "brightness(1.035)" : "brightness(1)",
        duration: reduceMotion ? 0 : activeProjectId && isActive ? 1.65 : 1.28,
        stagger: reduceMotion ? 0 : { amount: 0.16, from: "start" },
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });
  }, { scope: indexRef, dependencies: [activeProjectId] });

  const activateProject = (projectId: string) => {
    hasInteractedRef.current = true;
    setActiveProjectId(projectId);
  };

  const restoreProjects = () => {
    hasInteractedRef.current = true;
    setActiveProjectId(null);
  };

  return (
    <section
      ref={indexRef}
      aria-label="Project index"
      onPointerLeave={restoreProjects}
      className="viewport-container pb-40 pt-14 md:pb-64 md:pt-24"
    >
      <div className="mb-8 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-3 border-b border-black/20 pb-3 text-[0.6rem] uppercase tracking-[0.15em] text-text-muted md:grid-cols-[4rem_minmax(13rem,0.68fr)_minmax(0,2fr)] md:gap-8">
        <span>No.</span>
        <span>Project register</span>
        <span className="text-right md:text-left">Archive</span>
      </div>

      <ol>
        {projects.map((project, projectIndex) => (
          <li
            key={project.id}
            data-index-row
            data-project-id={project.id}
            onPointerEnter={() => activateProject(project.id)}
            onFocusCapture={() => activateProject(project.id)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) restoreProjects();
            }}
            className="border-b border-black/16 will-change-[transform,opacity,clip-path]"
          >
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-8 py-9 md:grid-cols-[4rem_minmax(13rem,0.68fr)_minmax(0,2fr)] md:gap-8 md:py-14">
              <Link
                to={`/work/${project.slug}`}
                data-cursor="open"
                aria-label={`View ${project.title}`}
                className="col-span-2 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 md:grid-cols-[4rem_minmax(13rem,0.68fr)] md:gap-8"
              >
                <span className="text-[0.64rem] tabular-nums tracking-[0.12em] text-text-muted">
                  {String(projectIndex + 1).padStart(2, "0")}
                </span>

                <span className="flex min-w-0 flex-col justify-between gap-8">
                  <span className="block">
                    <span data-index-title className="block text-[clamp(1.3rem,2.15vw,2.45rem)] font-medium leading-[0.98] tracking-[-0.035em] will-change-transform">
                      {project.title}
                    </span>
                    <span className="mt-3 block text-[0.64rem] uppercase tracking-[0.12em] text-text-muted">
                      {project.category}
                    </span>
                  </span>
                  <span className="flex items-center gap-5 text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
                    <span>{project.year}</span>
                    {project.siteSize ? <span>{project.siteSize}</span> : null}
                  </span>
                </span>
              </Link>

              <div className="col-span-2 min-w-0 md:col-span-1">
                <ProjectIndexStrip projectId={project.id} images={project.gallery} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
