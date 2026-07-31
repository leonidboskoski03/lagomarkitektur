import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loadWorkProjects,
  type WorkProjectItem,
} from "../../hooks/useWorkProjects";
import { motionEaseCurves, motionEases } from "../../lib/motion";
import { preloadImage, type ImageLoadProgress } from "../../lib/preloadImage";
import { WORK_CONTENT_REVEAL_EVENT } from "../../lib/revealEvents";
import styles from "./ProjectTransition.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { siteCopy } from "../../i18n/siteCopy";
import {
  WorkTransitionContext,
  type WorkTransitionContextValue,
} from "./workTransitionContext";

gsap.registerPlugin(useGSAP);

const WORK_CRITICAL_IMAGE_COUNT = 2;
const WORK_REVEAL_HOLD_MS = 120;

const workCoverTransition = {
  duration: 0.96,
  ease: motionEaseCurves.reveal,
};

const workRevealTransition = {
  duration: 1.5,
  ease: motionEaseCurves.reveal,
};

interface ActiveWorkTransition {
  stage: "covering" | "preparing" | "revealing";
  progress: number;
  loadFailed: boolean;
}

interface WorkTransitionBackdropProps {
  visible: boolean;
}

const WorkTransitionBackdrop = memo(function WorkTransitionBackdrop({
  visible,
}: WorkTransitionBackdropProps) {
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

    gsap.set(backdrop, { autoAlpha: 0 });
  }, {
    scope: backdropRef,
    dependencies: [visible],
  });

  return <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />;
});

function nextFrame() {
  return new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

function waitForRevealHold() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, WORK_REVEAL_HOLD_MS));
}

function publishAggregateProgress(
  imageProgress: ImageLoadProgress[],
  onProgress: (progress: number) => void,
) {
  if (imageProgress.length === 0) {
    onProgress(1);
    return;
  }

  const hasKnownTotals = imageProgress.every((item) => item.totalBytes !== null);
  if (hasKnownTotals) {
    const loadedBytes = imageProgress.reduce((total, item) => total + item.loadedBytes, 0);
    const totalBytes = imageProgress.reduce((total, item) => total + (item.totalBytes || 0), 0);
    onProgress(totalBytes > 0 ? Math.min(loadedBytes / totalBytes, 1) : 0);
    return;
  }

  const averageProgress = imageProgress.reduce((total, item) => total + item.progress, 0)
    / imageProgress.length;
  onProgress(Math.min(averageProgress, 1));
}

async function preloadCriticalWorkImages(
  projects: WorkProjectItem[],
  signal: AbortSignal,
  onProgress: (progress: number) => void,
) {
  const sources = Array.from(new Set(
    projects
      .slice(0, WORK_CRITICAL_IMAGE_COUNT)
      .map((project) => project.image.url)
      .filter(Boolean),
  ));
  const imageProgress = sources.map<ImageLoadProgress>(() => ({
    progress: 0,
    loadedBytes: 0,
    totalBytes: null,
  }));

  if (sources.length === 0) {
    onProgress(1);
    return;
  }

  await Promise.all(sources.map((source, index) => preloadImage(source, {
    signal,
    onProgress: (progress) => {
      imageProgress[index] = progress;
      publishAggregateProgress(imageProgress, onProgress);
    },
  })));
}

async function waitForWorkPage(signal: AbortSignal) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (signal.aborted) return;

    const page = document.querySelector<HTMLElement>("[data-work-page]");
    const criticalImages = page
      ? Array.from(page.querySelectorAll<HTMLImageElement>("[data-work-critical-image]"))
      : [];

    if (page && criticalImages.length > 0 && criticalImages.every((image) => image.complete)) {
      await Promise.all(
        criticalImages
          .filter((image) => image.naturalWidth > 0)
          .map((image) => image.decode?.().catch(() => undefined)),
      );
      await nextFrame();
      await nextFrame();
      return;
    }

    await nextFrame();
  }
}

export function WorkTransitionProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const copy = siteCopy[language].transitions;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [transition, setTransition] = useState<ActiveWorkTransition | null>(null);
  const activeRef = useRef(false);
  const coverResolveRef = useRef<(() => void) | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const actualProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const progressFrameRef = useRef(0);
  const progressResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    void loadWorkProjects(language);
  }, [language]);

  const finishTransition = useCallback(() => {
    window.dispatchEvent(new CustomEvent(WORK_CONTENT_REVEAL_EVENT));
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.workTransition;
    document.documentElement.removeAttribute("aria-busy");
    activeRef.current = false;
    abortRef.current = null;
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    progressResolveRef.current = null;
    setTransition(null);
  }, []);

  const startWorkTransition = useCallback(() => {
    if (pathname === "/work") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    if (activeRef.current) return;

    if (reduceMotion) {
      navigate("/work");
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }

    activeRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    actualProgressRef.current = 0;
    displayedProgressRef.current = 0;
    document.documentElement.dataset.workTransition = "true";
    document.documentElement.setAttribute("aria-busy", "true");
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: true },
    }));
    setTransition({
      stage: "covering",
      progress: 0,
      loadFailed: false,
    });

    const coverPromise = new Promise<void>((resolve) => {
      coverResolveRef.current = resolve;
    });
    const visualProgressPromise = new Promise<void>((resolve) => {
      progressResolveRef.current = resolve;
    });
    const advanceVisibleProgress = () => {
      const current = displayedProgressRef.current;
      const target = actualProgressRef.current;

      if (target > current) {
        const next = Math.min(target, current + 0.018);
        displayedProgressRef.current = next;
        setTransition((active) => active
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

    const readinessPromise = loadWorkProjects(language)
      .then(async (projects) => {
        try {
          await preloadCriticalWorkImages(
            projects,
            controller.signal,
            (progress) => {
              actualProgressRef.current = Math.max(actualProgressRef.current, progress);
            },
          );
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return projects;
          actualProgressRef.current = 1;
          setTransition((active) => active ? { ...active, loadFailed: true } : active);
        }
        return projects;
      })
      .catch(() => {
        actualProgressRef.current = 1;
        setTransition((active) => active ? { ...active, loadFailed: true } : active);
        return [] as WorkProjectItem[];
      });

    void Promise.all([coverPromise, readinessPromise, visualProgressPromise]).then(async () => {
      if (controller.signal.aborted) return;

      navigate("/work");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      await waitForWorkPage(controller.signal);
      if (controller.signal.aborted) return;

      setTransition((active) => active ? { ...active, stage: "preparing" } : active);
      await nextFrame();
      await waitForRevealHold();
      if (controller.signal.aborted) return;
      setTransition((active) => active ? { ...active, stage: "revealing" } : active);
    });
  }, [language, navigate, pathname, reduceMotion]);

  useEffect(() => () => {
    abortRef.current?.abort();
    coverResolveRef.current?.();
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.workTransition;
    document.documentElement.removeAttribute("aria-busy");
  }, []);

  const contextValue = useMemo<WorkTransitionContextValue>(() => ({
    isWorkTransitioning: transition !== null,
    startWorkTransition,
  }), [startWorkTransition, transition]);

  const progressPercent = transition ? Math.round(transition.progress * 100) : 0;
  const loadStatus = transition?.loadFailed
    ? copy.workImageryUnavailable
    : transition?.progress === 1
      ? copy.workImagesDecoded
      : copy.loadingSelectedWork;

  const handleOverlayComplete = () => {
    if (!transition) return;

    if (transition.stage === "covering") {
      coverResolveRef.current?.();
      coverResolveRef.current = null;
      return;
    }

    if (transition.stage === "revealing") finishTransition();
  };

  return (
    <WorkTransitionContext.Provider value={contextValue}>
      {children}

      {transition ? (
        <WorkTransitionBackdrop visible={transition.stage === "covering"} />
      ) : null}

      <AnimatePresence>
        {transition ? (
          <motion.aside
            key="work-transition"
            className={styles.overlay}
            aria-label={`${copy.openingWork}. ${loadStatus}.`}
            initial={{
              opacity: 1,
              clipPath: "inset(100% 0 0 0)",
            }}
            animate={{
              opacity: 1,
              clipPath: transition.stage === "revealing"
                ? "inset(0% 0 100% 0)"
                : "inset(0% 0 0% 0)",
            }}
            transition={
              transition.stage === "covering"
                ? workCoverTransition
                : transition.stage === "revealing"
                  ? workRevealTransition
                  : { duration: 0 }
            }
            onAnimationComplete={handleOverlayComplete}
          >
            <span className="sr-only" role="status" aria-live="polite">
              {`${copy.openingWork}. ${loadStatus}.`}
            </span>

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
              aria-label={copy.loadingCriticalWorkImages}
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
    </WorkTransitionContext.Provider>
  );
}
