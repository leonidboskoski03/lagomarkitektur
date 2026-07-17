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
  const lastFocusedSlugRef = useRef<string | null>(null);
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

    if (!hasFocusedProjectRef.current) return;

    if (reduceMotion) {
      gsap.set(cards, { clipPath: "inset(0% 0% 0% 0%)", pointerEvents: "auto" });
      return;
    }

    const focusSlug = activeSlug || lastFocusedSlugRef.current;
    const focusCard = cards.find((card) => card.dataset.projectSlug === focusSlug);
    const focusRect = focusCard?.getBoundingClientRect();
    const focusCenter = focusRect
      ? { x: focusRect.left + focusRect.width / 2, y: focusRect.top + focusRect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const siblingCards = cards.filter((card) => card !== focusCard);
    const visibleSiblingCards = siblingCards
      .filter((card) => {
        const rect = card.getBoundingClientRect();
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return visibleWidth > 1 && visibleHeight > 1;
      })
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        const isFirstInFocusRow = focusRect
          ? firstRect.top < focusRect.bottom && firstRect.bottom > focusRect.top
          : false;
        const isSecondInFocusRow = focusRect
          ? secondRect.top < focusRect.bottom && secondRect.bottom > focusRect.top
          : false;

        if (isFirstInFocusRow !== isSecondInFocusRow) {
          return isFirstInFocusRow ? -1 : 1;
        }

        const firstDistance = Math.hypot(
          firstRect.left + firstRect.width / 2 - focusCenter.x,
          firstRect.top + firstRect.height / 2 - focusCenter.y,
        );
        const secondDistance = Math.hypot(
          secondRect.left + secondRect.width / 2 - focusCenter.x,
          secondRect.top + secondRect.height / 2 - focusCenter.y,
        );
        return firstDistance - secondDistance;
      });
    const visibleCards = new Set(visibleSiblingCards);
    const offscreenSiblingCards = siblingCards.filter((card) => !visibleCards.has(card));

    cards.forEach((card) => {
      const isFocused = !activeSlug || card.dataset.projectSlug === activeSlug;
      gsap.set(card, { pointerEvents: isFocused ? "auto" : "none" });
    });

    const targetClipPath = activeSlug ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)";
    const duration = activeSlug ? 0.72 : 0.84;
    const ease = activeSlug ? motionEases.reveal : motionEases.settle;
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

    if (focusCard) {
      timeline.to(focusCard, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: activeSlug ? 0.36 : duration,
        ease,
      }, 0);
    }

    if (offscreenSiblingCards.length > 0) {
      timeline.to(offscreenSiblingCards, {
        clipPath: targetClipPath,
        duration,
        ease,
      }, 0);
    }

    visibleSiblingCards.forEach((card, index) => {
      timeline.to(card, {
        clipPath: targetClipPath,
        duration,
        ease,
      }, index * 0.045);
    });
  }, { scope: gridRef, dependencies: [activeSlug] });

  const activateProject = (slug: string) => {
    hasFocusedProjectRef.current = true;
    lastFocusedSlugRef.current = slug;
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
