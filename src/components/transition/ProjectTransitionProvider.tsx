import {
  useCallback,
  useEffect,
  memo,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { getProjectBySlug, getProjectGalleryMedia } from "../../data/projects";
import { motionEaseCurves, motionEases } from "../../lib/motion";
import { preloadImage, type ImageLoadProgress } from "../../lib/preloadImage";
import { PROJECT_CONTENT_REVEAL_EVENT } from "../../lib/revealEvents";
import {
  ProjectTransitionContext,
  type ProjectTransitionContextValue,
  type ProjectTransitionRequest,
} from "./projectTransitionContext";
import styles from "./ProjectTransition.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { siteCopy } from "../../i18n/siteCopy";

gsap.registerPlugin(useGSAP);

interface ActiveTransition {
  slug: string;
  title: string;
  targetSrc: string;
  progress: number;
  loadFailed: boolean;
  shouldFocusTitle: boolean;
  stage: "covering" | "revealing" | "handoff";
}

const pageCoverTransition = {
  duration: 0.96,
  ease: motionEaseCurves.reveal,
};

const HERO_REVEAL_HOLD = 0.06;
const HERO_CLIP_DURATION = 1.5;
const HERO_SCALE_START = HERO_REVEAL_HOLD + HERO_CLIP_DURATION * 0.12;
const HERO_SCALE_DURATION = 1.42;
const HERO_INITIAL_SCALE = 1.07;

const handoffTransition = {
  duration: 0.12,
  ease: "linear" as const,
};

interface ProjectTransitionBackdropProps {
  visible: boolean;
}

const ProjectTransitionBackdrop = memo(function ProjectTransitionBackdrop({
  visible,
}: ProjectTransitionBackdropProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    if (visible) {
      gsap.fromTo(backdrop, {
        autoAlpha: 0,
      }, {
        autoAlpha: 1,
        duration: 0.62,
        ease: motionEases.reveal,
        overwrite: "auto",
      });
      return;
    }

    gsap.to(backdrop, {
      autoAlpha: 0,
      duration: 0.46,
      ease: motionEases.settle,
      overwrite: "auto",
    });
  }, {
    scope: backdropRef,
    dependencies: [visible],
  });

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      aria-hidden="true"
    />
  );
});

function nextFrame() {
  return new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

async function waitForProjectHero(slug: string, signal: AbortSignal) {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (signal.aborted) return;

    const hero = document.querySelector<HTMLElement>("[data-project-hero]");
    const image = hero?.querySelector<HTMLImageElement>("[data-project-hero-image]");

    if (hero?.dataset.projectHero === slug && image?.complete && image.naturalWidth > 0) {
      await image.decode?.().catch(() => undefined);
      await nextFrame();
      await nextFrame();
      return;
    }

    await nextFrame();
  }
}

interface ProjectHeroRevealProps {
  src: string;
  open: boolean;
  onRevealComplete?: () => void;
}

const ProjectHeroReveal = memo(function ProjectHeroReveal({
  src,
  open,
  onRevealComplete,
}: ProjectHeroRevealProps) {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const onRevealCompleteRef = useRef(onRevealComplete);

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
  }, [onRevealComplete]);

  useGSAP(() => {
    const reveal = revealRef.current;
    const image = imageRef.current;
    if (!reveal || !image) return;

    if (!open) {
      gsap.set(reveal, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(image, { scale: HERO_INITIAL_SCALE });
      return;
    }

    gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => onRevealCompleteRef.current?.(),
    })
      .addLabel("mask", HERO_REVEAL_HOLD)
      .addLabel("media", HERO_SCALE_START)
      .fromTo(reveal, {
        clipPath: "inset(100% 0% 0% 0%)",
      }, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: HERO_CLIP_DURATION,
        ease: motionEases.reveal,
      }, "mask")
      .fromTo(image, {
        scale: HERO_INITIAL_SCALE,
      }, {
        scale: 1,
        duration: HERO_SCALE_DURATION,
        ease: motionEases.cinematic,
        force3D: true,
      }, "media");
  }, {
    scope: revealRef,
    dependencies: [open],
    revertOnUpdate: true,
  });

  return (
    <div
      ref={revealRef}
      className={styles.heroReveal}
    >
      <img
        ref={imageRef}
        data-project-transition-media
        src={src}
        alt=""
        aria-hidden="true"
      />
      <div className={styles.veil} aria-hidden="true" />
    </div>
  );
});

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const copy = siteCopy[language].transitions;
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [transition, setTransition] = useState<ActiveTransition | null>(null);
  const activeRef = useRef(false);
  const coverResolveRef = useRef<(() => void) | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const actualProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const progressFrameRef = useRef(0);
  const progressResolveRef = useRef<(() => void) | null>(null);

  const finishTransition = useCallback((activeTransition: ActiveTransition) => {
    window.dispatchEvent(new CustomEvent(PROJECT_CONTENT_REVEAL_EVENT, {
      detail: { slug: activeTransition.slug },
    }));
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.projectTransition;
    document.documentElement.removeAttribute("aria-busy");
    activeRef.current = false;
    abortRef.current = null;
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    progressResolveRef.current = null;
    setTransition(null);

    if (activeTransition.shouldFocusTitle) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("#project-title")?.focus({ preventScroll: true });
      });
    }
  }, []);

  const startProjectTransition = useCallback((request: ProjectTransitionRequest) => {
    if (activeRef.current) return;

    const project = getProjectBySlug(request.slug, language);
    const heroMedia = project ? getProjectGalleryMedia(project, language)[0] : undefined;

    if (!project || !heroMedia || reduceMotion) {
      navigate(`/work/${request.slug}`);
      return;
    }

    activeRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    const initialTransition: ActiveTransition = {
      slug: project.slug,
      title: project.title,
      targetSrc: heroMedia.src,
      progress: 0,
      loadFailed: false,
      shouldFocusTitle: request.shouldFocusTitle,
      stage: "covering",
    };

    document.documentElement.dataset.projectTransition = project.slug;
    document.documentElement.setAttribute("aria-busy", "true");
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: true },
    }));
    setTransition(initialTransition);

    const coverPromise = new Promise<void>((resolve) => {
      coverResolveRef.current = resolve;
    });
    actualProgressRef.current = 0;
    displayedProgressRef.current = 0;
    const visualProgressPromise = new Promise<void>((resolve) => {
      progressResolveRef.current = resolve;
    });
    const advanceVisibleProgress = () => {
      const current = displayedProgressRef.current;
      const target = actualProgressRef.current;
      const remaining = target - current;

      if (remaining > 0) {
        const next = Math.min(target, current + 0.018);
        displayedProgressRef.current = next;
        setTransition((active) => active?.slug === project.slug
          ? { ...active, progress: next }
          : active);
      }

      if (actualProgressRef.current >= 1 && displayedProgressRef.current >= 1) {
        progressResolveRef.current?.();
        progressResolveRef.current = null;
        return;
      }

      progressFrameRef.current = window.requestAnimationFrame(advanceVisibleProgress);
    };
    progressFrameRef.current = window.requestAnimationFrame(advanceVisibleProgress);

    const imagePromise = preloadImage(heroMedia.src, {
      signal: controller.signal,
      onProgress: (progress: ImageLoadProgress) => {
        actualProgressRef.current = Math.max(actualProgressRef.current, progress.progress);
      },
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      progressResolveRef.current?.();
      progressResolveRef.current = null;
      setTransition((current) => current?.slug === project.slug
        ? { ...current, loadFailed: true }
        : current);
    });

    void Promise.all([coverPromise, imagePromise, visualProgressPromise]).then(async () => {
      if (controller.signal.aborted) return;

      navigate(`/work/${project.slug}`);
      await waitForProjectHero(project.slug, controller.signal);
      if (controller.signal.aborted) return;

      setTransition((current) => current?.slug === project.slug
        ? { ...current, stage: "revealing" }
        : current);
    });
  }, [language, navigate, reduceMotion]);

  useEffect(() => () => {
    abortRef.current?.abort();
    coverResolveRef.current?.();
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.projectTransition;
    document.documentElement.removeAttribute("aria-busy");
  }, []);

  const contextValue = useMemo<ProjectTransitionContextValue>(() => ({
    isTransitioning: transition !== null,
    startProjectTransition,
  }), [startProjectTransition, transition]);

  const handleCoverComplete = useCallback(() => {
    coverResolveRef.current?.();
    coverResolveRef.current = null;
  }, []);

  const handleRevealComplete = useCallback(() => {
    setTransition((current) => current?.stage === "revealing"
      ? { ...current, stage: "handoff" }
      : current);
  }, []);

  const handleOverlayComplete = () => {
    if (!transition) return;

    if (transition.stage === "covering") {
      handleCoverComplete();
      return;
    }

    if (transition.stage === "handoff") {
      finishTransition(transition);
    }
  };

  const progressPercent = transition ? Math.round(transition.progress * 100) : 0;
  const loadStatus = transition?.loadFailed
    ? copy.imageUnavailable
    : transition?.progress === 1
      ? copy.imageDecoded
      : copy.loadingHero;

  return (
    <ProjectTransitionContext.Provider value={contextValue}>
      {children}

      {transition ? (
        <ProjectTransitionBackdrop visible={transition.stage === "covering"} />
      ) : null}

      <AnimatePresence>
        {transition ? (
          <motion.aside
            key={transition.slug}
            className={styles.overlay}
            aria-label={`${copy.opening} ${transition.title}. ${loadStatus}.`}
            initial={{
              opacity: 1,
              clipPath: "inset(100% 0 0 0)",
            }}
            animate={{
              opacity: transition.stage === "handoff" ? 0 : 1,
              clipPath: "inset(0% 0 0 0)",
            }}
            transition={
              transition.stage === "covering"
                ? pageCoverTransition
                : transition.stage === "handoff"
                  ? handoffTransition
                  : { duration: 0 }
            }
            onAnimationComplete={handleOverlayComplete}
          >
            <span className="sr-only" role="status" aria-live="polite">
              {`${copy.opening} ${transition.title}. ${loadStatus}.`}
            </span>

            <ProjectHeroReveal
              src={transition.targetSrc}
              open={transition.stage !== "covering"}
              onRevealComplete={
                transition.stage === "revealing"
                  ? handleRevealComplete
                  : undefined
              }
            />

            <motion.div
              className={styles.measure}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: transition.stage === "covering" ? 1 : 0 }}
              transition={{
                duration: transition.stage === "covering" ? 0.28 : 0.18,
                ease: motionEaseCurves.settle,
              }}
            >
              <span className={styles.brand}>Lagom Arkitektur</span>
              <span className={styles.counter} aria-hidden="true">
                {String(progressPercent).padStart(2, "0")}
              </span>
            </motion.div>

            <motion.div
              className={styles.progress}
              role="progressbar"
              aria-label={`${copy.loadingImageFor} ${transition.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              initial={{ opacity: 0 }}
              animate={{ opacity: transition.stage === "covering" ? 1 : 0 }}
              transition={{
                duration: transition.stage === "covering" ? 0.24 : 0.16,
                ease: motionEaseCurves.settle,
              }}
            >
              <motion.div
                className={styles.progressFill}
                animate={{ scaleX: transition.progress }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </motion.div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </ProjectTransitionContext.Provider>
  );
}
