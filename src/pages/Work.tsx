import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import {
  HERO_CONTENT_REVEAL_EVENT,
  WORK_CONTENT_REVEAL_EVENT,
  WORK_VIEW_MODE_CHANGE_EVENT,
} from "../lib/revealEvents";
import { motionEaseCurves, motionEases } from "../lib/motion";
import { WorkProjectViews } from "../components/work/WorkProjectViews";
import { WorkViewRail } from "../components/work/WorkViewRail";
import type { WorkViewMode } from "../components/work/workView";
import { useWorkProjects } from "../hooks/useWorkProjects";
import { useLanguage } from "../i18n/LanguageContext";
import { siteCopy } from "../i18n/siteCopy";

gsap.registerPlugin(ScrollTrigger);

interface WorkProps {
  onFooterVisibilityChange?: (visible: boolean) => void;
}

export function Work({ onFooterVisibilityChange }: WorkProps) {
  const { language } = useLanguage();
  const copy = siteCopy[language].work;
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { projects, isLoading, error } = useWorkProjects();
  const [viewMode, setViewMode] = useState<WorkViewMode>("composition");
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useEffect(() => {
    onFooterVisibilityChange?.(viewMode !== "field");

    return () => {
      onFooterVisibilityChange?.(true);
    };
  }, [onFooterVisibilityChange, viewMode]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(WORK_VIEW_MODE_CHANGE_EVENT, {
      detail: { mode: viewMode },
    }));
  }, [viewMode]);

  useEffect(() => () => {
    window.dispatchEvent(new CustomEvent(WORK_VIEW_MODE_CHANGE_EVENT, {
      detail: { mode: "composition" },
    }));
  }, []);

  useGSAP((_context, contextSafe) => {
    const eyebrow = pageRef.current?.querySelector<HTMLElement>("[data-work-eyebrow]");
    const titleLines = gsap.utils.toArray<HTMLElement>("[data-work-title-line]", pageRef.current);
    const description = pageRef.current?.querySelector<HTMLElement>("[data-work-description]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!eyebrow || !description || titleLines.length === 0) return;

    if (reduceMotion) {
      gsap.set([eyebrow, description, ...titleLines], { clearProps: "all" });
      setIsIntroComplete(true);
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

    const revealProjects = contextSafe!(() => {
      setIsIntroComplete(true);
    });
    const introTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: motionEases.enter },
      onComplete: revealProjects,
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

    const workTransitionIsActive = document.documentElement.dataset.workTransition === "true";
    const loader = document.querySelector<HTMLElement>("[data-lagom-loader]");
    const loaderIsHidden = !loader || window.getComputedStyle(loader).display === "none";
    let loaderObserver: MutationObserver | undefined;

    if (workTransitionIsActive) {
      window.addEventListener(WORK_CONTENT_REVEAL_EVENT, playIntro, { once: true });
    } else if (loaderIsHidden) {
      playIntro();
    } else {
      window.addEventListener(HERO_CONTENT_REVEAL_EVENT, playIntro, { once: true });
      loaderObserver = new MutationObserver(() => {
        if (window.getComputedStyle(loader).display === "none") playIntro();
      });
      loaderObserver.observe(loader, { attributes: true, attributeFilter: ["style"] });
    }

    return () => {
      window.removeEventListener(WORK_CONTENT_REVEAL_EVENT, playIntro);
      window.removeEventListener(HERO_CONTENT_REVEAL_EVENT, playIntro);
      loaderObserver?.disconnect();
      introTimeline.eventCallback("onComplete", null);
    };
  }, { scope: pageRef, dependencies: [language], revertOnUpdate: true });

  return (
    <div
      ref={pageRef}
      data-work-page
      className="min-h-screen overflow-x-hidden bg-bg text-text-primary"
    >
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
              className="viewport-container flex flex-col justify-between pb-8 pt-32 md:min-h-[92vh] md:pt-40"
            >
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] xl:items-start">
            <div className="max-w-[min(92vw,76rem)]">
              <p
                data-work-eyebrow
                className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted will-change-[transform,opacity,filter]"
              >
                {copy.eyebrow}
              </p>
              <h1
                aria-label={copy.titleLines.join(" ")}
                className="text-[clamp(2.35rem,10vw,7rem)] font-medium leading-[0.82] tracking-[-0.065em] text-text-primary xl:text-[clamp(4.25rem,13vw,12.5rem)]"
              >
                <span className="block overflow-hidden">
                  <span data-work-title-line aria-hidden="true" className="block will-change-transform">
                    <span className="xl:hidden">{copy.mobileTitleLines[0]}</span>
                    <span className="hidden xl:inline">{copy.titleLines[0]}</span>
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-work-title-line aria-hidden="true" className="block will-change-transform">
                    <span className="xl:hidden">{copy.mobileTitleLines[1]}</span>
                    <span className="hidden xl:inline">{copy.titleLines[1]}</span>
                  </span>
                </span>
              </h1>
            </div>

            <div
              data-work-description
              className="max-w-md justify-self-end pt-2 text-sm leading-relaxed text-text-muted will-change-[transform,opacity,filter] xl:pt-10"
            >
              <p>
                {copy.description}
              </p>
            </div>
          </div>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isLoading ? <WorkViewRail activeMode={viewMode} onModeChange={setViewMode} /> : null}

      <motion.div
        data-work-projects
        initial={false}
        animate={isIntroComplete
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 18 }}
        transition={{
          duration: isIntroComplete ? 0.72 : 0,
          ease: motionEaseCurves.settle,
        }}
        aria-hidden={!isIntroComplete}
        className={isIntroComplete ? "pointer-events-auto" : "pointer-events-none"}
      >
        {isLoading ? (
          <section aria-label={copy.loadingProjects} aria-busy="true" className="min-h-screen" />
        ) : error ? (
          <section className="viewport-container flex min-h-[55vh] items-center justify-center text-center">
            <p role="alert" className="max-w-md text-sm uppercase tracking-[0.16em] text-text-muted">
              {copy.projectsUnavailable}
            </p>
          </section>
        ) : (
          <WorkProjectViews mode={viewMode} projects={projects} />
        )}
      </motion.div>
    </div>
  );
}
