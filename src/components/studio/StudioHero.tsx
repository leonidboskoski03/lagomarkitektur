import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";

gsap.registerPlugin(ScrollTrigger);

export function StudioHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const { hero } = studioContent;

  useGSAP(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const image = imageRef.current;
    const copy = copyRef.current;
    if (!section || !media || !image || !copy) return;

    const titleLines = gsap.utils.toArray<HTMLElement>("[data-studio-hero-line]", copy);
    const supportingCopy = gsap.utils.toArray<HTMLElement>("[data-studio-hero-meta]", copy);
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

        if (reduceMotion) {
          gsap.set([titleLines, supportingCopy, media, image], { clearProps: "all" });
          return;
        }

        const intro = gsap.timeline({
          defaults: { ease: motionEases.cinematic },
        });

        intro
          .from(titleLines, {
            yPercent: 112,
            rotation: 0.35,
            duration: 1.16,
            stagger: 0.075,
          }, 0.08)
          .from(media, {
            clipPath: desktop
              ? "polygon(100% 0, 100% 0, 100% 100%, 76% 100%)"
              : "polygon(0 100%, 100% 94%, 100% 100%, 0 100%)",
            duration: 1.52,
          }, 0)
          .from(image, {
            scale: 1.115,
            duration: 1.95,
            ease: motionEases.settle,
          }, 0)
          .from(supportingCopy, {
            y: 22,
            autoAlpha: 0,
            duration: 0.82,
            stagger: 0.075,
            ease: motionEases.enter,
          }, 0.64);

        if (desktop) {
          gsap.to(image, {
            yPercent: 7,
            scale: 1.075,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });

          gsap.to(copy, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          });
        }
      },
    );

    return () => matchMedia.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative grid min-h-dvh overflow-hidden bg-white text-brand-ink md:grid-cols-[44%_56%]"
      aria-labelledby="studio-hero-heading"
    >
      <div
        ref={copyRef}
        className="relative z-10 flex min-h-[49dvh] flex-col justify-end px-[var(--spacing-viewport-gutter)] pb-8 pt-[17vh] md:min-h-dvh md:pb-[clamp(2.5rem,4vw,4.5rem)]"
      >
        <h1
          id="studio-hero-heading"
          className="text-[clamp(4.2rem,8.15vw,9.8rem)] font-medium leading-[0.76] tracking-[-0.082em]"
        >
          {hero.titleLines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-studio-hero-line className="block will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-[clamp(2.25rem,4.5vw,4.75rem)] grid grid-cols-1 gap-3 pr-[clamp(0rem,4vw,4rem)] text-[0.8rem] leading-[1.42] md:grid-cols-[0.72fr_1.28fr] md:items-end md:gap-8">
          <p
            data-studio-hero-meta
            className="font-semibold uppercase tracking-[0.055em] text-black/48"
          >
            {hero.eyebrow}
          </p>
          <p data-studio-hero-meta className="max-w-[30rem]">
            {hero.description}
          </p>
        </div>
      </div>

      <ProjectTransitionLink
        projectSlug={hero.media.projectSlug}
        aria-label={`View ${hero.media.projectTitle}`}
        className="group block h-[51dvh] overflow-hidden md:h-dvh"
        data-cursor=""
      >
        <figure
          ref={mediaRef}
          data-transition-image={hero.media.transitionImageId}
          className="relative h-[51dvh] overflow-hidden bg-[#e9e6e0] [clip-path:polygon(0_7%,100%_0,100%_100%,0_100%)] will-change-[clip-path] md:h-dvh md:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]"
        >
          <img
            ref={imageRef}
            src={hero.media.src}
            alt={hero.media.alt}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-[114%] w-full object-cover object-center will-change-transform"
            style={{ height: "114%" }}
            onLoad={() => ScrollTrigger.refresh()}
          />
          <figcaption className="absolute bottom-4 right-[var(--spacing-viewport-gutter)] z-10 overflow-hidden text-[0.65rem] font-semibold uppercase tracking-[0.07em] text-white mix-blend-difference">
            <span data-studio-hero-meta className="block">
              {hero.media.projectTitle}
            </span>
          </figcaption>
        </figure>
      </ProjectTransitionLink>
    </section>
  );
}
