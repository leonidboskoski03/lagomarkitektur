import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "../components/branding/LogoMark";
import { HERO_CONTENT_REVEAL_EVENT } from "../lib/revealEvents";
import { motionEaseCurves, motionEases } from "../lib/motion";
import { WorkProjectViews } from "../components/work/WorkProjectViews";
import { WorkViewRail } from "../components/work/WorkViewRail";
import type { WorkViewMode } from "../components/work/workView";
import { useWorkProjects } from "../hooks/useWorkProjects";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { projects, isLoading } = useWorkProjects();
  const [viewMode, setViewMode] = useState<WorkViewMode>("composition");

  useGSAP((_context, contextSafe) => {
    const eyebrow = pageRef.current?.querySelector<HTMLElement>("[data-work-eyebrow]");
    const titleLines = gsap.utils.toArray<HTMLElement>("[data-work-title-line]", pageRef.current);
    const description = pageRef.current?.querySelector<HTMLElement>("[data-work-description]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!eyebrow || !description || titleLines.length === 0) return;

    if (reduceMotion) {
      gsap.set([eyebrow, description, ...titleLines], { clearProps: "all" });
      return;
    }

    gsap.set(eyebrow, {
      y: 8,
      autoAlpha: 0,
      filter: "blur(3px)",
      letterSpacing: "0.24em",
    });
    gsap.set(titleLines, { yPercent: 115 });
    gsap.set(description, {
      y: 12,
      autoAlpha: 0,
      filter: "blur(3px)",
    });

    const introTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: motionEases.enter },
    })
      .addLabel("warmth", 0)
      .addLabel("structure", 0.14)
      .addLabel("context", 0.68)
      .to(eyebrow, {
        y: 0,
        autoAlpha: 0.72,
        filter: "blur(0px)",
        letterSpacing: "0.18em",
        duration: 1.05,
      }, "warmth")
      .to(titleLines, {
        yPercent: 0,
        duration: 1.28,
        stagger: 0.11,
        ease: motionEases.enter,
      }, "structure")
      .to(description, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.05,
        clearProps: "filter",
      }, "context");

    let hasStarted = false;
    const playIntro = contextSafe!(() => {
      if (hasStarted) return;
      hasStarted = true;
      introTimeline.play(0);
    });

    const loader = document.querySelector<HTMLElement>("[data-lagom-loader]");
    const loaderIsHidden = !loader || window.getComputedStyle(loader).display === "none";
    let loaderObserver: MutationObserver | undefined;

    if (loaderIsHidden) {
      playIntro();
    } else {
      window.addEventListener(HERO_CONTENT_REVEAL_EVENT, playIntro, { once: true });
      loaderObserver = new MutationObserver(() => {
        if (window.getComputedStyle(loader).display === "none") playIntro();
      });
      loaderObserver.observe(loader, { attributes: true, attributeFilter: ["style"] });
    }

    return () => {
      window.removeEventListener(HERO_CONTENT_REVEAL_EVENT, playIntro);
      loaderObserver?.disconnect();
    };
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-bg text-text-primary">
      <Link
        to="/"
        data-work-logo
        data-cursor=""
        aria-label="Lagom Arkitektur home"
        className="fixed left-[var(--spacing-viewport-gutter)] top-8 z-30 inline-flex items-center gap-2 text-white mix-blend-difference will-change-[transform,clip-path,opacity] md:top-10"
      >
        <LogoMark />
        <span className="logo-text text-xl font-bold uppercase leading-none">Lagom</span>
      </Link>

      <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
        {viewMode === "composition" ? (
          <motion.div
            key="work-context"
            data-work-context-shell
            initial={{ height: 0, opacity: 0, y: -20, clipPath: "inset(0% 0% 20% 0%)" }}
            animate={{ height: "auto", opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{
              height: 0,
              opacity: 0,
              y: -24,
              clipPath: "inset(0% 0% 24% 0%)",
              transition: { duration: 0.54, ease: motionEaseCurves.settle },
            }}
            transition={{ duration: 0.78, ease: motionEaseCurves.settle }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
            className="overflow-hidden"
          >
            <section
              data-work-context
              className="viewport-container flex min-h-[92vh] flex-col justify-between pb-8 pt-32 md:pt-40"
            >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] md:items-start">
            <div className="max-w-[min(92vw,76rem)]">
              <p
                data-work-eyebrow
                className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted will-change-[transform,opacity,filter]"
              >
                Lagom Arkitektur / Work
              </p>
              <h1 className="text-[clamp(4.25rem,13vw,12.5rem)] font-medium leading-[0.82] tracking-[-0.065em] text-text-primary">
                <span className="block overflow-hidden">
                  <span data-work-title-line className="block will-change-transform">Selected</span>
                </span>
                <span className="block overflow-hidden">
                  <span data-work-title-line className="block will-change-transform">spatial work</span>
                </span>
              </h1>
            </div>

            <div
              data-work-description
              className="max-w-md justify-self-end pt-2 text-sm leading-relaxed text-text-muted will-change-[transform,opacity,filter] md:pt-10"
            >
              <p>
                Interiors, residences, hospitality spaces, and quiet architectural concepts shaped through light,
                proportion, material restraint, and carefully staged atmosphere.
              </p>
            </div>
          </div>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isLoading ? <WorkViewRail activeMode={viewMode} onModeChange={setViewMode} /> : null}

      <div data-work-projects>
        {isLoading ? (
          <section aria-label="Loading projects" aria-busy="true" className="min-h-screen" />
        ) : (
          <WorkProjectViews mode={viewMode} projects={projects} />
        )}
      </div>
    </div>
  );
}
