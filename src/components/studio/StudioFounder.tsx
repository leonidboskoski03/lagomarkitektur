import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { StudioSectionLabel } from "./StudioSectionLabel";

gsap.registerPlugin(ScrollTrigger);

export function StudioFounder() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { founder } = studioContent;

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
        const reveals = gsap.utils.toArray<HTMLElement>("[data-founder-reveal]", section);
        const portraitFrame = section.querySelector<HTMLElement>("[data-founder-frame]");
        const portrait = section.querySelector<HTMLImageElement>("[data-founder-image]");
        const facts = gsap.utils.toArray<HTMLElement>("[data-founder-fact]", section);

        if (reduceMotion) {
          gsap.set([reveals, portraitFrame, portrait, facts], { clearProps: "all" });
          return;
        }

        reveals.forEach((element, index) => {
          gsap.from(element, {
            y: 54,
            autoAlpha: 0,
            duration: 1.05,
            delay: Math.min(index * 0.075, 0.225),
            ease: motionEases.enter,
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          });
        });

        if (portraitFrame && portrait) {
          const portraitTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: portraitFrame,
              start: "top 80%",
              once: true,
            },
          });

          portraitTimeline
            .from(portraitFrame, {
              clipPath: "inset(0 100% 0 0)",
              duration: 1.48,
              ease: motionEases.cinematic,
            })
            .from(portrait, {
              scale: 1.085,
              duration: 1.82,
              ease: motionEases.settle,
            }, 0);

          if (desktop) {
            gsap.to(portrait, {
              yPercent: 6,
              scale: 1.045,
              ease: "none",
              scrollTrigger: {
                trigger: portraitFrame,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            });
          }
        }

        if (facts.length > 0) {
          gsap.from(facts, {
            y: 32,
            autoAlpha: 0,
            duration: 0.92,
            stagger: 0.1,
            ease: motionEases.enter,
            scrollTrigger: {
              trigger: facts[0],
              start: "top 88%",
              once: true,
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
      className="bg-white px-[var(--spacing-viewport-gutter)] pb-[clamp(7rem,12vw,13rem)] pt-28 text-brand-ink md:pt-0"
      aria-labelledby="studio-founder-heading"
    >
      <div className="mx-auto max-w-[var(--width-viewport-content)]">
        <div className="grid grid-cols-1 items-center gap-[clamp(3.5rem,7vw,8rem)] md:grid-cols-12">
          <div className="md:col-span-5">
            <div data-founder-reveal>
              <StudioSectionLabel>{founder.label}</StudioSectionLabel>
            </div>
            <h2
              id="studio-founder-heading"
              data-founder-reveal
              className="mt-[clamp(2.25rem,4vw,4rem)] max-w-[8ch] text-[clamp(3.25rem,6.4vw,7.6rem)] font-medium leading-[0.91] tracking-[-0.074em]"
            >
              {founder.title}
            </h2>

            <div data-founder-reveal className="mt-[clamp(2.75rem,5vw,5.5rem)]">
              <p className="text-[clamp(1.5rem,2.2vw,2.45rem)] font-medium leading-none tracking-[-0.045em]">
                {founder.name}
              </p>
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-black/48">
                {founder.role}
              </p>
            </div>

            <div className="mt-[clamp(2.75rem,4.5vw,4.5rem)] space-y-5">
              {founder.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  data-founder-reveal
                  className="text-[clamp(1rem,1.15vw,1.18rem)] leading-[1.54] tracking-[-0.015em] text-black/63"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div data-founder-reveal className="mt-[clamp(2.75rem,4.5vw,4.5rem)] border-t border-black/18 pt-5">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.075em] text-black/48">
                Philosophy
              </p>
              <p className="text-[clamp(1.08rem,1.35vw,1.38rem)] leading-[1.45] tracking-[-0.022em]">
                {founder.philosophy}
              </p>
            </div>
          </div>

          <figure className="md:col-span-6 md:col-start-7">
            <div
              data-founder-frame
              className="relative aspect-[0.78/1] overflow-hidden bg-[#e9e6e0] will-change-[clip-path]"
            >
              <img
                data-founder-image
                src={founder.portrait.src}
                alt={founder.portrait.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-[112%] w-full object-cover object-top will-change-transform"
                style={{ height: "112%", top: "-6%" }}
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
            <figcaption className="mt-3 border-t border-black/18 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.065em] text-black/55">
              {founder.role}
            </figcaption>
          </figure>
        </div>

        <dl className="mt-[clamp(5rem,9vw,9rem)] grid grid-cols-1 border-t border-black/18 md:grid-cols-3">
          {founder.facts.map((fact) => (
            <div
              key={fact.label}
              data-founder-fact
              className="flex min-h-32 flex-col justify-between border-b border-black/18 py-5 md:min-h-40 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"
            >
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-black/45">
                {fact.label}
              </dt>
              <dd className="mt-8 max-w-[13ch] text-[clamp(1.55rem,2.4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.052em]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
