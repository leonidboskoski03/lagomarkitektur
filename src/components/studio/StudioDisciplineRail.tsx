import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioContent } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import styles from "./StudioMotion.module.css";
import { useLocalizedContent } from "../../i18n/LanguageContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function StudioDisciplineRail() {
  const content = useLocalizedContent(studioContent);
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const track = trackRef.current;
    const intro = section?.querySelector<HTMLElement>(
      "[data-studio-discipline-intro]",
    );
    if (!section || !rail || !track || !intro) return;

    const borderRules = gsap.utils.toArray<HTMLElement>(
      "[data-studio-marquee-rule]",
      rail,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(track, { clearProps: "transform" });
      gsap.set(borderRules, { scaleX: 1 });
      gsap.set(intro, { clearProps: "all" });
      return;
    }

    gsap.set(borderRules, { scaleX: 0, transformOrigin: "left center" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      })
      .fromTo(
        intro,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.92,
          ease: motionEases.enter,
        },
      )
      .to(
        borderRules,
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: motionEases.reveal,
        },
        0.18,
      );

    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      repeat: -1,
      ease: "none",
    });
    const clampRate = gsap.utils.clamp(1, 4.5);
    const updateRate = gsap.quickTo(loop, "timeScale", {
      duration: 0.38,
      ease: "power3.out",
    });
    let direction = 1;
    const settleRate = gsap
      .delayedCall(0.16, () => updateRate(direction))
      .pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: rail,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => loop.play(),
      onEnterBack: () => loop.play(),
      onLeave: () => loop.pause(),
      onLeaveBack: () => loop.pause(),
      onUpdate: (self) => {
        direction = self.direction >= 0 ? 1 : -1;
        const velocityRate = clampRate(
          1 + Math.abs(self.getVelocity()) / 650,
        );

        updateRate(direction * velocityRate);
        settleRate.restart(true);
      },
    });

    return () => {
      settleRate.kill();
      scrollTrigger.kill();
      loop.kill();
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(4.5rem,7vw,8rem)]"
      aria-label={`${content.disciplinesIntro}: ${content.disciplines.join(", ")}`}
    >
      <div className="viewport-container">
        <p
          data-studio-discipline-intro
          className="max-w-[18ch] text-[clamp(2rem,3.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.058em] will-change-[transform,opacity]"
        >
          {content.disciplinesIntro}
        </p>
      </div>

      <div
        ref={railRef}
        className="relative mt-[clamp(3.5rem,5.5vw,6rem)] overflow-hidden py-[clamp(2.6rem,4.2vw,4.75rem)]"
      >
        <span
          data-studio-marquee-rule
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-black/18 will-change-transform"
        />
        <span
          data-studio-marquee-rule
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-black/18 will-change-transform"
        />

        <div ref={trackRef} className={styles.marqueeTrack}>
          {[false, true].map((duplicate) => (
            <div
              key={duplicate ? "duplicate" : "primary"}
              aria-hidden={duplicate || undefined}
              className={styles.marqueeGroup}
            >
              {content.disciplines.map((discipline) => (
                <span
                  key={`${duplicate ? "duplicate" : "primary"}-${discipline}`}
                  className="flex items-center whitespace-nowrap text-[clamp(2.25rem,5.4vw,6.5rem)] font-medium leading-none tracking-[-0.065em]"
                >
                  {discipline}
                  <span
                    aria-hidden="true"
                    className="mx-[clamp(1.5rem,3.5vw,4.5rem)] inline-block h-[0.12em] w-[0.12em] rounded-full bg-current"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
