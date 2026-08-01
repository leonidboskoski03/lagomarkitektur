import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { StudioImageReveal } from "./StudioImageReveal";
import { useStudioTextReveals } from "./useStudioTextReveals";
import { useLocalizedContent } from "../../i18n/LanguageContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function StudioFounder() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { founder } = useLocalizedContent(studioContent);

  useStudioTextReveals(sectionRef);

  useGSAP(() => {
    const section = sectionRef.current;
    const facts = section?.querySelector<HTMLElement>("[data-studio-facts]");
    if (!section || !facts) return;

    const horizontalRules = gsap.utils.toArray<HTMLElement>(
      '[data-studio-fact-rule="horizontal"]',
      facts,
    );
    const verticalRules = gsap.utils.toArray<HTMLElement>(
      '[data-studio-fact-rule="vertical"]',
      facts,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(horizontalRules, { scaleX: 1 });
      gsap.set(verticalRules, { scaleY: 1 });
      return;
    }

    gsap.set(horizontalRules, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(verticalRules, { scaleY: 0, transformOrigin: "center top" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: facts,
          start: "top 82%",
          once: true,
        },
      })
      .to(horizontalRules, {
        scaleX: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: motionEases.reveal,
      })
      .to(
        verticalRules,
        {
          scaleY: 1,
          duration: 1.04,
          stagger: 0.12,
          ease: motionEases.cinematic,
        },
        0.16,
      );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="bg-white px-[var(--spacing-viewport-gutter)] pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(3rem,5vw,5rem)] text-brand-ink"
      aria-labelledby="studio-founder-heading"
    >
      <div className="mx-auto max-w-[var(--width-viewport-content)]">
        <div
          data-studio-fade-reveal
          className="grid grid-cols-1 gap-3 pt-3 text-[0.67rem] font-semibold uppercase tracking-[0.07em] text-black/52 md:grid-cols-12"
        >
          <span className="md:col-span-5">{founder.name}</span>
          <span className="md:col-span-5 md:col-start-8">{founder.role}</span>
        </div>

        <h2
          id="studio-founder-heading"
          data-studio-text-reveal
          className="mt-[clamp(3rem,5vw,5rem)] max-w-[16ch] text-[clamp(2.8rem,11vw,3.45rem)] font-medium leading-[0.89] tracking-[-0.075em] md:text-[clamp(3.45rem,7.25vw,8.8rem)]"
        >
          {founder.title}
        </h2>

        <div className="mt-[clamp(4rem,7vw,7rem)] grid grid-cols-1 gap-[clamp(4rem,7vw,8rem)] md:grid-cols-12 md:items-start">
          <figure className="md:sticky md:top-[12vh] md:col-span-5">
            <StudioImageReveal
              src={founder.portrait.src}
              alt={founder.portrait.alt}
              width={founder.portrait.width}
              height={founder.portrait.height}
              sizes="(max-width: 767px) 100vw, 42vw"
              className="aspect-[0.8/1]"
              imageClassName="object-top grayscale"
            />
            <figcaption
              data-studio-fade-reveal
              className="mt-3 flex items-start justify-between gap-5 border-t border-black/18 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.065em] text-black/55"
            >
              <span>{founder.name}</span>
              <span className="max-w-[18rem] text-right">{founder.role}</span>
            </figcaption>
          </figure>

          <div className="md:col-span-5 md:col-start-8 md:pt-[clamp(1rem,4vw,5rem)]">
            <h3
              data-studio-text-reveal
              className="max-w-[10ch] text-[clamp(2.7rem,5vw,6.2rem)] font-medium leading-[0.92] tracking-[-0.065em]"
            >
              {founder.profileTitle}
            </h3>

            <div className="mt-[clamp(3rem,5vw,5rem)] space-y-[clamp(2.5rem,4vw,4.25rem)]">
              {founder.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  data-studio-text-reveal
                  className="text-[clamp(1.14rem,1.55vw,1.65rem)] leading-[1.46] tracking-[-0.027em] text-black/67"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className="mt-[clamp(3.5rem,5vw,5rem)] border-t border-black/18 pt-[clamp(1.75rem,3vw,3rem)]">
              <p
                data-studio-text-reveal
                className="text-[clamp(1.7rem,2.6vw,3rem)] leading-[1.22] tracking-[-0.045em]"
              >
                {founder.philosophy}
              </p>
            </blockquote>
          </div>
        </div>

        <dl
          data-studio-facts
          className="relative mt-[clamp(5rem,8vw,8rem)] grid grid-cols-1 md:grid-cols-3"
        >
          <span
            data-studio-fact-rule="horizontal"
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-black/18 will-change-transform"
          />

          {founder.facts.map((fact, index) => (
            <div
              key={fact.label}
              data-studio-fade-reveal
              className="relative flex min-h-36 flex-col justify-between py-5 md:min-h-44 md:px-7 md:first:pl-0"
            >
              <dt className="text-[0.67rem] font-semibold uppercase tracking-[0.07em] text-black/45">
                {fact.label}
              </dt>
              <dd className="mt-10 max-w-[15ch] text-[clamp(1.7rem,2.8vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.058em]">
                {fact.value}
              </dd>

              <span
                data-studio-fact-rule="horizontal"
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-black/18 will-change-transform md:hidden"
              />
              {index < founder.facts.length - 1 ? (
                <span
                  data-studio-fact-rule="vertical"
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 hidden w-px bg-black/18 will-change-transform md:block"
                />
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
