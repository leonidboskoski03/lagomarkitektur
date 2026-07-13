import { useMemo, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { motionEases } from "../../lib/motion";
import { EditorialProjectCard } from "./EditorialProjectCard";

gsap.registerPlugin(ScrollTrigger);

interface EditorialProjectGridProps {
  projects: WorkProjectItem[];
}

interface EditorialPlacement {
  project: WorkProjectItem;
  index: number;
  columnStart: number;
  columnSpan: number;
  topOffset: string;
}

function getColumnSpan(aspectRatio: number) {
  if (aspectRatio < 0.9) return 4;
  if (aspectRatio < 1.2) return 5;
  if (aspectRatio >= 1.4) return 7;
  return 6;
}

function composeEditorialRows(projects: WorkProjectItem[]) {
  const rows: EditorialPlacement[][] = [];

  for (let index = 0; index < projects.length; index += 2) {
    const rowIndex = rows.length;
    const first = projects[index];
    const second = projects[index + 1];
    let firstSpan = getColumnSpan(first.image.aspectRatio);
    let secondSpan = second ? getColumnSpan(second.image.aspectRatio) : 0;
    const reverseWeight = rowIndex % 2 === 1;

    if (second) {
      if (reverseWeight) firstSpan = Math.min(firstSpan, 11 - secondSpan);
      else secondSpan = Math.min(secondSpan, 11 - firstSpan);
    }

    const row: EditorialPlacement[] = [{
      project: first,
      index,
      columnStart: !second && reverseWeight ? 13 - firstSpan : 1,
      columnSpan: firstSpan,
      topOffset: reverseWeight ? "clamp(7rem, 16vh, 12rem)" : "0",
    }];

    if (second) {
      row.push({
        project: second,
        index: index + 1,
        columnStart: 13 - secondSpan,
        columnSpan: secondSpan,
        topOffset: reverseWeight ? "0" : "clamp(8rem, 19vh, 15rem)",
      });
    }

    rows.push(row);
  }

  return rows;
}

export function EditorialProjectGrid({ projects }: EditorialProjectGridProps) {
  const gridRef = useRef<HTMLElement | null>(null);
  const hasFocusedProjectRef = useRef(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const rows = useMemo(() => composeEditorialRows(projects), [projects]);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-editorial-project]", gridRef.current);
    const reveals = gsap.utils.toArray<HTMLElement>("[data-project-reveal]", gridRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(cards, { autoAlpha: 1 });
      gsap.set(reveals, { autoAlpha: 0 });
      return;
    }

    gsap.set(cards, { autoAlpha: 1 });
    gsap.set(reveals, { autoAlpha: 1 });

    ScrollTrigger.batch(reveals, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        batch.forEach((reveal, index) => {
          const image = reveal.previousElementSibling as HTMLImageElement | null;
          const revealImage = () => gsap.to(reveal, {
            autoAlpha: 0,
            duration: 0.72,
            delay: index * 0.055,
            ease: motionEases.reveal,
            overwrite: "auto",
          });

          if (image?.complete && image.naturalWidth > 0) {
            revealImage();
            return;
          }

          image?.addEventListener("load", revealImage, { once: true });
        });
      },
    });

    const parallaxDistance = 40;

    cards.forEach((card) => {
      gsap.fromTo(card, {
        y: parallaxDistance,
      }, {
        y: -parallaxDistance,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });
    });

  }, { scope: gridRef, dependencies: [projects] });

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-editorial-project]", gridRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !hasFocusedProjectRef.current) return;

    gsap.to(cards, {
      opacity: (_index, card) => {
        if (!activeSlug) return 1;
        return (card as HTMLElement).dataset.projectSlug === activeSlug ? 1 : 0.12;
      },
      duration: activeSlug ? 0.46 : 0.58,
      ease: motionEases.settle,
      overwrite: "auto",
    });
  }, { scope: gridRef, dependencies: [activeSlug] });

  const activateProject = (slug: string) => {
    hasFocusedProjectRef.current = true;
    setActiveSlug(slug);
  };

  const deactivateProjects = () => {
    hasFocusedProjectRef.current = true;
    setActiveSlug(null);
  };

  return (
    <section
      ref={gridRef}
      aria-label="Projects"
      onPointerLeave={deactivateProjects}
      className="viewport-container pb-40 pt-16 md:pb-64 md:pt-32"
    >
      <div className="space-y-[clamp(9rem,20vh,18rem)]">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-1 gap-y-20 md:grid-cols-12 md:gap-y-0">
            {row.map((placement) => (
              <div
                key={placement.project.id}
                className={placement.columnStart > 6
                  ? "md:col-span-[var(--project-span)] md:col-start-[var(--project-start)] md:mt-[var(--project-offset)] md:justify-self-end md:pl-6"
                  : "md:col-span-[var(--project-span)] md:col-start-[var(--project-start)] md:mt-[var(--project-offset)] md:justify-self-start md:pr-6"}
                style={{
                  "--project-span": placement.columnSpan,
                  "--project-start": placement.columnStart,
                  "--project-offset": placement.topOffset,
                } as CSSProperties}
              >
                <EditorialProjectCard
                  project={placement.project}
                  index={placement.index}
                  isActive={activeSlug === placement.project.slug}
                  onActivate={activateProject}
                  onDeactivate={deactivateProjects}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
