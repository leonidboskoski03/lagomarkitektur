import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";
import { StudioSectionLabel } from "./StudioSectionLabel";

gsap.registerPlugin(ScrollTrigger);

export function StudioPrinciples() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { principles } = studioContent;
  const activePrinciple = principles.items[activeIndex];

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const heading = section.querySelector<HTMLElement>("[data-principles-heading]");
    const rows = gsap.utils.toArray<HTMLElement>("[data-principle-row]", section);
    const preview = previewRef.current;

    gsap.from(heading, {
      y: 56,
      autoAlpha: 0,
      duration: 1.08,
      ease: motionEases.enter,
      scrollTrigger: {
        trigger: heading,
        start: "top 86%",
        once: true,
      },
    });

    if (rows.length > 0) {
      gsap.from(rows, {
        y: 34,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.075,
        ease: motionEases.enter,
        scrollTrigger: {
          trigger: rows[0],
          start: "top 88%",
          once: true,
        },
      });
    }

    if (preview) {
      gsap.from(preview, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.42,
        ease: motionEases.cinematic,
        scrollTrigger: {
          trigger: preview,
          start: "top 82%",
          once: true,
        },
      });
    }
  }, { scope: sectionRef });

  useGSAP(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    gsap.fromTo(
      preview.querySelector("img"),
      { scale: 1.065, autoAlpha: 0.72 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.92,
        ease: motionEases.settle,
        overwrite: "auto",
      },
    );
  }, { scope: sectionRef, dependencies: [activeIndex] });

  return (
    <section
      ref={sectionRef}
      className="bg-white px-[var(--spacing-viewport-gutter)] pb-[clamp(8rem,14vw,15rem)] pt-28 text-brand-ink lg:pt-0"
      aria-labelledby="studio-principles-heading"
    >
      <div className="mx-auto max-w-[var(--width-viewport-content)]">
        <div data-principles-heading>
          <StudioSectionLabel>{principles.label}</StudioSectionLabel>
          <h2
            id="studio-principles-heading"
            className="mt-[clamp(2.25rem,4vw,4rem)] max-w-[11ch] text-[clamp(3.25rem,6.6vw,8rem)] font-medium leading-[0.92] tracking-[-0.073em]"
          >
            {principles.title}
          </h2>
        </div>

        <div className="mt-[clamp(4rem,8vw,8rem)] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="border-t border-black/20 lg:col-span-7">
            {principles.items.map((principle, index) => {
              const isActive = index === activeIndex;
              const panelId = `studio-principle-${principle.index}`;

              return (
                <article
                  key={principle.index}
                  data-principle-row
                  className="border-b border-black/20"
                >
                  <button
                    type="button"
                    className="group grid w-full grid-cols-[2.25rem_minmax(0,1fr)_2rem] items-center gap-3 py-[clamp(1.35rem,2vw,2.25rem)] text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(index)}
                    onPointerEnter={() => setActiveIndex(index)}
                  >
                    <span className="text-[0.65rem] font-semibold tracking-[0.07em] text-black/42">
                      {principle.index}
                    </span>
                    <span>
                      <span className="block text-[clamp(2.25rem,4.8vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.067em]">
                        {principle.title}
                      </span>
                      <span className="mt-2 block text-[0.72rem] font-medium uppercase tracking-[0.055em] text-black/42">
                        {principle.summary}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative h-5 w-5 transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
                        isActive ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
                    </span>
                  </button>

                  <div
                    id={panelId}
                    aria-hidden={!isActive}
                    className={`grid transition-[grid-template-rows,opacity] duration-700 [transition-timing-function:cubic-bezier(.58,0,.22,1)] ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[37rem] pb-[clamp(1.75rem,3vw,3rem)] pl-[3.1rem] pr-4 text-[clamp(1rem,1.24vw,1.25rem)] leading-[1.5] tracking-[-0.018em] text-black/60">
                        {principle.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-[12vh] lg:col-span-5">
            <ProjectTransitionLink
              key={activePrinciple.media.projectSlug}
              projectSlug={activePrinciple.media.projectSlug}
              aria-label={`View ${activePrinciple.media.projectTitle}`}
              data-cursor=""
              className="group block"
            >
              <figure>
                <div
                  ref={previewRef}
                  data-transition-image={activePrinciple.media.transitionImageId}
                  className="relative aspect-[1.14/1] overflow-hidden bg-[#e9e6e0] will-change-[clip-path]"
                >
                  <img
                    key={activePrinciple.index}
                    src={activePrinciple.media.src}
                    alt={activePrinciple.media.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover will-change-[transform,opacity]"
                    style={{ height: "100%" }}
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-4 border-t border-black/18 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.065em] text-black/55">
                  <span>{activePrinciple.media.projectTitle}</span>
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    View project ↗
                  </span>
                </figcaption>
              </figure>
            </ProjectTransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
