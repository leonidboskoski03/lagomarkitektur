import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";
import { StudioSectionLabel } from "./StudioSectionLabel";

gsap.registerPlugin(ScrollTrigger);

export function StudioOverview() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { studio } = studioContent;

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const matchMedia = gsap.matchMedia();
    matchMedia.add(
      {
        desktop: "(min-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduceMotion } = context.conditions as {
          desktop: boolean;
          reduceMotion: boolean;
        };
        const reveals = gsap.utils.toArray<HTMLElement>("[data-studio-overview-reveal]", section);
        const frames = gsap.utils.toArray<HTMLElement>("[data-studio-media-frame]", section);
        const images = gsap.utils.toArray<HTMLImageElement>("[data-studio-media-image]", section);

        if (reduceMotion) {
          gsap.set([reveals, frames, images], { clearProps: "all" });
          return;
        }

        reveals.forEach((element, index) => {
          gsap.from(element, {
            y: 58,
            autoAlpha: 0,
            duration: 1.08,
            delay: Math.min(index * 0.075, 0.225),
            ease: motionEases.enter,
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          });
        });

        frames.forEach((frame, index) => {
          gsap.from(frame, {
            clipPath: index === 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
            duration: 1.42,
            ease: motionEases.cinematic,
            scrollTrigger: {
              trigger: frame,
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(images[index], {
            scale: 1.09,
            duration: 1.78,
            ease: motionEases.settle,
            scrollTrigger: {
              trigger: frame,
              start: "top 82%",
              once: true,
            },
          });

          if (desktop) {
            gsap.to(images[index], {
              yPercent: index === 0 ? 7 : -7,
              scale: 1.055,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            });
          }
        });
      },
    );

    return () => matchMedia.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="bg-white px-[var(--spacing-viewport-gutter)] py-[clamp(7rem,13vw,14rem)] text-brand-ink"
      aria-labelledby="studio-overview-heading"
    >
      <div className="mx-auto max-w-[var(--width-viewport-content)]">
        <div data-studio-overview-reveal>
          <StudioSectionLabel>{studio.label}</StudioSectionLabel>
        </div>

        <h2
          id="studio-overview-heading"
          data-studio-overview-reveal
          className="mt-[clamp(2.5rem,4vw,4.5rem)] max-w-[11ch] text-[clamp(3.25rem,7.2vw,8.8rem)] font-medium leading-[0.91] tracking-[-0.073em]"
        >
          {studio.title}
        </h2>

        <div className="ml-auto mt-[clamp(3.5rem,7vw,7rem)] grid max-w-[72rem] grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-10">
          {studio.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              data-studio-overview-reveal
              className={`text-[clamp(1rem,1.18vw,1.2rem)] leading-[1.52] tracking-[-0.016em] text-black/63 ${
                index === 2
                  ? "md:col-span-4 md:col-start-9"
                  : index === 1
                    ? "md:col-span-4 md:col-start-5"
                    : "md:col-span-4"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="relative mt-[clamp(5rem,10vw,10rem)] grid grid-cols-1 items-end gap-4 md:grid-cols-12 md:gap-6">
          {studio.media.map((media, index) => (
            <ProjectTransitionLink
              key={media.projectSlug}
              projectSlug={media.projectSlug}
              aria-label={`View ${media.projectTitle}`}
              data-cursor=""
              className={
                index === 0
                  ? "group md:col-span-8"
                  : "group ml-auto w-[72%] -translate-y-[8%] md:col-span-3 md:col-start-10 md:w-full md:translate-y-0"
              }
            >
              <figure>
                <div
                  data-studio-media-frame
                  data-transition-image={media.transitionImageId}
                  className={`relative overflow-hidden bg-[#e9e6e0] will-change-[clip-path] ${
                    index === 0 ? "aspect-[1.55/1]" : "aspect-[0.72/1]"
                  }`}
                >
                  <img
                    data-studio-media-image
                    src={media.src}
                    alt={media.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-[114%] w-full object-cover will-change-transform"
                    style={{ height: "114%", top: "-7%" }}
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-4 border-t border-black/18 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.065em] text-black/55">
                  <span>{media.projectTitle}</span>
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    ↗
                  </span>
                </figcaption>
              </figure>
            </ProjectTransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
