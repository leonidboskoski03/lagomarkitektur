import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";
import { StudioImageReveal } from "./StudioImageReveal";
import { StudioProjectCaption } from "./StudioProjectCaption";
import { useLanguage, useLocalizedContent } from "../../i18n/LanguageContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StudioHeroProps {
  isReady: boolean;
}

export function StudioHero({ isReady }: StudioHeroProps) {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const apertureRef = useRef<HTMLSpanElement | null>(null);
  const apertureImageRef = useRef<HTMLImageElement | null>(null);
  const featuredMediaRef = useRef<HTMLDivElement | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isReadyRef = useRef(false);
  const { hero } = useLocalizedContent(studioContent);

  useGSAP(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const aperture = apertureRef.current;
    const apertureImage = apertureImageRef.current;
    const featuredMedia = featuredMediaRef.current;
    if (
      !section ||
      !copy ||
      !aperture ||
      !apertureImage ||
      !featuredMedia
    ) {
      return;
    }

    const titleLines = gsap.utils.toArray<HTMLElement>(
      "[data-studio-hero-line]",
      copy,
    );
    const titleDriftLines = gsap.utils.toArray<HTMLElement>(
      "[data-studio-hero-drift]",
      copy,
    );
    const topMeta = gsap.utils.toArray<HTMLElement>(
      "[data-studio-hero-top-meta]",
      copy,
    );
    const bottomMeta = gsap.utils.toArray<HTMLElement>(
      "[data-studio-hero-bottom-meta]",
      copy,
    );
    const leftMeta = [topMeta[0], bottomMeta[0]].filter(
      (element): element is HTMLElement => Boolean(element),
    );
    const rightMeta = [topMeta[1], bottomMeta[1]].filter(
      (element): element is HTMLElement => Boolean(element),
    );
    const matchMedia = gsap.matchMedia();

    matchMedia.add(
      {
        desktop: "(min-width: 768px)",
        wideDesktop: "(min-width: 1700px)",
        mobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, wideDesktop, reduceMotion } = context.conditions as {
          desktop: boolean;
          wideDesktop: boolean;
          mobile: boolean;
          reduceMotion: boolean;
        };

        if (reduceMotion) {
          introTimelineRef.current = null;
          gsap.set(
            [
              ...titleLines,
              ...titleDriftLines,
              ...topMeta,
              ...bottomMeta,
              aperture,
              apertureImage,
              featuredMedia,
            ],
            { clearProps: "all" },
          );
          return;
        }

        gsap.set(titleLines, { yPercent: wideDesktop ? 0 : 112 });
        if (wideDesktop) {
          gsap.set(titleDriftLines, {
            clipPath: "inset(0% 0% 100% 0%)",
          });
        }
        gsap.set(leftMeta, {
          autoAlpha: 0,
          x: -28,
          clipPath: "inset(0% 100% 0% 0%)",
        });
        gsap.set(rightMeta, {
          autoAlpha: 0,
          x: 28,
          clipPath: "inset(0% 0% 0% 100%)",
        });
        gsap.set(aperture, {
          autoAlpha: 1,
          clipPath: "inset(100% 0% 0% 0%)",
        });
        gsap.set(apertureImage, { scale: 1.08, yPercent: 6 });

        const intro = gsap
          .timeline({
            paused: true,
            defaults: { overwrite: "auto" },
          })
          .addLabel("construct", 0)
          .to(
            topMeta,
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.05,
              stagger: 0.08,
              ease: motionEases.cinematic,
            },
            "construct+=0.08",
          );

        intro.to(
          wideDesktop ? titleDriftLines : titleLines,
          wideDesktop
            ? {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.12,
                stagger: 0.1,
                ease: motionEases.enter,
              }
            : {
                yPercent: 0,
                duration: 1.12,
                stagger: 0.1,
                ease: motionEases.enter,
              },
          "construct+=0.28",
        );

        intro
          .to(
            aperture,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.36,
              ease: motionEases.cinematic,
            },
            "construct+=0.48",
          )
          .to(
            apertureImage,
            {
              scale: 1,
              yPercent: 0,
              duration: 1.58,
              ease: motionEases.settle,
            },
            "construct+=0.48",
          )
          .to(
            bottomMeta,
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.08,
              stagger: 0.08,
              ease: motionEases.cinematic,
            },
            "construct+=0.68",
          );

        introTimelineRef.current = intro;
        if (isReadyRef.current) intro.play(0);

        if (desktop) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${Math.min(window.innerHeight * 0.62, 640)}`,
                scrub: 1.05,
                invalidateOnRefresh: true,
              },
            })
            .to(copy, { yPercent: -4.5 }, 0)
            .to(titleDriftLines[0], { xPercent: -2.6 }, 0)
            .to(titleDriftLines[1], { xPercent: 2.3 }, 0)
            .to(aperture, { scale: 1.3 }, 0);

          gsap.fromTo(
            featuredMedia,
            {
              y: 58,
              clipPath: "inset(0% 0% 12% 0%)",
            },
            {
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: featuredMedia,
                start: "top 96%",
                end: "top 48%",
                scrub: 0.9,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      },
    );

    return () => {
      introTimelineRef.current = null;
      matchMedia.revert();
    };
  }, { scope: sectionRef, dependencies: [language], revertOnUpdate: true });

  useLayoutEffect(() => {
    isReadyRef.current = isReady;
    if (!isReady) return;

    introTimelineRef.current?.play(0);
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-[clamp(4rem,7vw,7rem)] text-brand-ink"
      aria-labelledby="studio-hero-heading"
    >
      <div className="viewport-container">
        <div
          ref={copyRef}
          className="flex min-h-[100svh] flex-col pb-[var(--spacing-viewport-gutter)] pt-[15vh]"
        >
          <div className="flex items-center justify-between gap-6 text-[0.66rem] font-semibold uppercase tracking-[0.075em] text-black/54">
            <span
              data-studio-hero-top-meta
              className="will-change-[transform,clip-path,opacity]"
            >
              {hero.eyebrow}
            </span>
            <span
              data-studio-hero-top-meta
              className="text-right will-change-[transform,clip-path,opacity]"
            >
              Malmö, Sweden
            </span>
          </div>

          <div className="my-auto py-[clamp(4rem,8vh,7rem)] text-center">
            <h1
              id="studio-hero-heading"
              className="mx-[-0.25rem] w-[calc(100%+0.5rem)] max-w-none text-[clamp(2.55rem,13.25vw,4.5rem)] font-medium leading-[0.82] tracking-[-0.04em] md:mx-auto md:w-auto md:max-w-[16ch] md:text-[clamp(4.35rem,10.25vw,12.5rem)] md:leading-[0.8] md:tracking-[-0.074em]"
            >
              <span
                data-studio-hero-drift
                className="block overflow-hidden pb-[0.08em] will-change-transform"
              >
                <span
                  data-studio-hero-line
                  className="block whitespace-nowrap will-change-transform"
                >
                  {hero.titleLines[0]}
                </span>
              </span>

              <span className="flex items-center justify-center gap-[clamp(0.75rem,1.6vw,2rem)]">
                <span
                  ref={apertureRef}
                  aria-hidden="true"
                  className="relative block h-[clamp(3.8rem,17vw,5.3rem)] w-[clamp(7rem,31vw,9.5rem)] shrink-0 overflow-hidden bg-white will-change-[transform,clip-path,opacity] md:h-[clamp(3.15rem,7.35vw,8.6rem)] md:w-[clamp(5.75rem,13.1vw,15.75rem)]"
                >
                  <img
                    ref={apertureImageRef}
                    src={hero.accentMedia.src}
                    alt=""
                    width={hero.accentMedia.width}
                    height={hero.accentMedia.height}
                    loading="eager"
                    sizes="(min-width: 768px) 12vw, 22vw"
                    onLoad={() => ScrollTrigger.refresh()}
                    className="absolute -top-[7%] left-0 h-[114%] w-full object-cover object-[62%_50%] will-change-transform"
                  />
                </span>

                <span
                  data-studio-hero-drift
                  className="block overflow-hidden pb-[0.08em] will-change-transform"
                >
                  <span
                    data-studio-hero-line
                    className="block whitespace-nowrap will-change-transform"
                  >
                    {hero.titleLines[1]}
                  </span>
                </span>
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-start justify-between gap-5 text-[0.76rem] leading-[1.45] md:flex-row md:items-end">
            <p
              data-studio-hero-bottom-meta
              className="shrink-0 font-semibold uppercase tracking-[0.06em] text-black/48 will-change-[transform,clip-path,opacity]"
            >
              {hero.meta}
            </p>
            <p
              data-studio-hero-bottom-meta
              className="hidden w-full max-w-[34rem] self-end text-right will-change-[transform,clip-path,opacity] sm:block md:ml-auto"
            >
              {hero.description}
            </p>
          </div>
        </div>

        <div
          ref={featuredMediaRef}
          className="mt-[clamp(2rem,4vw,4.5rem)] will-change-[transform,clip-path]"
        >
          <ProjectTransitionLink
            projectSlug={hero.media.projectSlug}
            aria-label={`${language === "sv" ? "Se" : "View"} ${hero.media.projectTitle}`}
            className="group block"
            data-cursor=""
          >
            <figure>
              <StudioImageReveal
                src={hero.media.src}
                alt={hero.media.alt}
                width={hero.media.width}
                height={hero.media.height}
                transitionImageId={hero.media.transitionImageId}
                loading="eager"
                fetchPriority="high"
                sizes="100vw"
                className="h-[clamp(28rem,70svh,58rem)]"
                imageClassName="object-center"
              />
              <StudioProjectCaption projectTitle={hero.media.projectTitle} />
            </figure>
          </ProjectTransitionLink>
        </div>
      </div>
    </section>
  );
}
