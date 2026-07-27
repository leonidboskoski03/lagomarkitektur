import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../lib/motion";
import { PROJECT_CONTENT_REVEAL_EVENT } from "../../lib/revealEvents";
import type { Project, ProjectGalleryMedia } from "../../types/project";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectHeroProps {
  project: Project;
  media: ProjectGalleryMedia;
}

export function ProjectHero({ project, media }: ProjectHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const siteSizeValue = project.credits.match(/[\d.,]+/)?.[0];

  useGSAP(() => {
    const image = imageRef.current;
    const content = contentRef.current;
    if (!image || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const textItems = gsap.utils.toArray<HTMLElement>("[data-project-hero-reveal]", content);
    const isTransitionEntry =
      document.documentElement.dataset.projectTransition === project.slug;

    if (reduceMotion) {
      gsap.set([image, ...textItems], { clearProps: "all" });
      return;
    }

    gsap.set(image, isTransitionEntry
      ? { scale: 1, yPercent: 0 }
      : { scale: 1.035, yPercent: -4 });
    gsap.set(textItems, { yPercent: 112 });

    const timeline = gsap.timeline({
      paused: true,
      defaults: { overwrite: "auto" },
    });

    if (!isTransitionEntry) {
      timeline.to(image, {
        scale: 1,
        duration: 1.45,
        ease: motionEases.cinematic,
      }, 0);
    }

    timeline.to(textItems, {
      yPercent: 0,
      duration: 1.08,
      stagger: 0.09,
      ease: motionEases.enter,
    }, isTransitionEntry ? 0 : 0.18);

    const transitionSlug = document.documentElement.dataset.projectTransition;
    const revealContent = (event?: Event) => {
      if (event instanceof CustomEvent) {
        const detail = event.detail as { slug?: string } | undefined;
        if (detail?.slug && detail.slug !== project.slug) return;
      }
      if (isTransitionEntry) {
        gsap.killTweensOf(image, "scale");
        gsap.set(image, { scale: 1 });
      }
      timeline.play(0);
    };

    if (transitionSlug === project.slug) {
      window.addEventListener(PROJECT_CONTENT_REVEAL_EVENT, revealContent);
    } else {
      revealContent();
    }

    gsap.to(image, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      window.removeEventListener(PROJECT_CONTENT_REVEAL_EVENT, revealContent);
    };
  }, { scope: heroRef, dependencies: [project.slug] });

  return (
    <section
      ref={heroRef}
      data-project-hero={project.slug}
      aria-labelledby="project-title"
      className="relative h-dvh min-h-dvh overflow-hidden bg-black"
    >
      <img
        ref={imageRef}
        data-project-hero-image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-x-0 -top-[8%] !h-[116%] w-full object-cover will-change-transform"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,14,0.2)_0%,rgba(3,10,14,0.02)_42%,rgba(3,10,14,0.72)_100%)]"
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 pb-[clamp(1.5rem,3.2vw,3.5rem)] text-white"
      >
        <div className="viewport-container">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-[clamp(3rem,7vw,9rem)]">
            <div className="max-w-[min(90vw,78rem)] md:max-w-[min(72vw,78rem)]">
              <div className="mb-4 overflow-hidden">
                <p
                  data-project-hero-reveal
                  className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/66"
                >
                  {project.category} / {project.id}
                </p>
              </div>

              <h1
                id="project-title"
                tabIndex={-1}
                className="font-display text-[clamp(3.4rem,7.2vw,8.75rem)] font-medium leading-[0.86] tracking-[-0.06em] text-balance"
              >
                <span className="block overflow-hidden pb-[0.06em]">
                  <span data-project-hero-reveal className="block">
                    {project.title}
                  </span>
                </span>
              </h1>
            </div>

            {siteSizeValue ? (
              <div className="hidden overflow-hidden md:block">
                <div
                  data-project-hero-reveal
                  className="flex items-start justify-end font-display tabular-nums"
                  aria-label={`${siteSizeValue} square metres`}
                >
                  <span
                    aria-hidden="true"
                    className="text-[clamp(7.5rem,10.7vw,12.75rem)] font-medium leading-[0.72] tracking-[-0.075em]"
                  >
                    {siteSizeValue}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-2 pt-[0.15em] text-[clamp(0.72rem,0.85vw,1rem)] font-medium normal-case tracking-[-0.02em]"
                  >
                    m²
                  </span>
                </div>
              </div>
            ) : null}

            <div className="overflow-hidden md:hidden">
              <div
                data-project-hero-reveal
                className="flex gap-6 text-[0.68rem] uppercase tracking-[0.1em] text-white/72"
              >
                {siteSizeValue ? <span>{siteSizeValue} m²</span> : null}
                <span>{project.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
