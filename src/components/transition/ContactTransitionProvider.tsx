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
import { useReducedMotion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { contactContent } from "../../data/contact";
import { useLocalizedContent } from "../../i18n/LanguageContext";
import { CONTACT_CONTENT_REVEAL_EVENT } from "../../lib/revealEvents";
import { motionEases } from "../../lib/motion";
import { preloadImage, type ImageLoadProgress } from "../../lib/preloadImage";
import {
  ContactTransitionContext,
  type ContactTransitionContextValue,
} from "./contactTransitionContext";
import styles from "./ContactTransition.module.css";

gsap.registerPlugin(useGSAP);

interface ActiveContactTransition {
  stage: "covering" | "revealing";
  progress: number;
  loadFailed: boolean;
}

interface ContactTransitionOverlayProps {
  transition: ActiveContactTransition;
  onCoverComplete: () => void;
  onRevealComplete: () => void;
}

function nextFrame() {
  return new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

async function waitForContactHero(signal: AbortSignal) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (signal.aborted) return;

    const page = document.querySelector<HTMLElement>("[data-contact-page]");
    const image = page?.querySelector<HTMLImageElement>("[data-contact-hero-image]");

    if (page && image?.complete && image.naturalWidth > 0) {
      await image.decode?.().catch(() => undefined);
      await nextFrame();
      await nextFrame();
      return;
    }

    await nextFrame();
  }
}

const ContactTransitionBackdrop = memo(function ContactTransitionBackdrop() {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    gsap.fromTo(backdrop, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      duration: 0.62,
      ease: motionEases.reveal,
      overwrite: "auto",
    });
  }, { scope: backdropRef });

  return <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />;
});

const ContactTransitionOverlay = memo(function ContactTransitionOverlay({
  transition,
  onCoverComplete,
  onRevealComplete,
}: ContactTransitionOverlayProps) {
  const overlayRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const onCoverCompleteRef = useRef(onCoverComplete);
  const onRevealCompleteRef = useRef(onRevealComplete);
  const pageContent = useLocalizedContent(contactContent);
  const { transition: content } = pageContent;

  useEffect(() => {
    onCoverCompleteRef.current = onCoverComplete;
    onRevealCompleteRef.current = onRevealComplete;
  }, [onCoverComplete, onRevealComplete]);

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const eyebrow = overlay.querySelector<HTMLElement>("[data-contact-transition-eyebrow]");
    const title = overlay.querySelector<HTMLElement>("[data-contact-transition-title]");
    const media = overlay.querySelector<HTMLElement>("[data-contact-transition-media]");
    const image = media?.querySelector<HTMLImageElement>("img");
    const rule = overlay.querySelector<HTMLElement>("[data-contact-transition-rule]");
    const footer = overlay.querySelector<HTMLElement>("[data-contact-transition-footer]");

    if (!eyebrow || !title || !media || !image || !rule || !footer) return;

    if (transition.stage === "covering") {
      gsap.set(overlay, {
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(eyebrow, { yPercent: 120, autoAlpha: 0 });
      gsap.set(title, { yPercent: 112 });
      gsap.set(media, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(image, { scale: 1.08, yPercent: 5 });
      gsap.set(rule, { scaleX: 0 });
      gsap.set(footer, { y: 12, autoAlpha: 0 });

      gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => onCoverCompleteRef.current(),
      })
        .addLabel("cover", 0)
        .addLabel("construct", 0.44)
        .to(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.96,
          ease: motionEases.reveal,
        }, "cover")
        .to(eyebrow, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.72,
          ease: motionEases.enter,
        }, "construct")
        .to(title, {
          yPercent: 0,
          duration: 1.08,
          ease: motionEases.enter,
        }, "construct+=0.04")
        .to(media, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.92,
          ease: motionEases.reveal,
        }, "construct+=0.14")
        .to(image, {
          scale: 1,
          yPercent: 0,
          duration: 1.18,
          ease: motionEases.cinematic,
        }, "construct+=0.14")
        .to(rule, {
          scaleX: 1,
          duration: 0.96,
          ease: motionEases.enter,
        }, "construct+=0.2")
        .to(footer, {
          y: 0,
          autoAlpha: 1,
          duration: 0.64,
          ease: motionEases.enter,
        }, "construct+=0.38");
      return;
    }

    gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => onRevealCompleteRef.current(),
    })
      .to([eyebrow, footer], {
        autoAlpha: 0,
        y: -10,
        duration: 0.24,
        ease: motionEases.depart,
      }, 0)
      .to([title, media], {
        yPercent: -8,
        autoAlpha: 0,
        duration: 0.42,
        ease: motionEases.depart,
      }, 0)
      .to(overlay, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.38,
        ease: motionEases.reveal,
      }, 0.12);
  }, {
    scope: overlayRef,
    dependencies: [transition.stage],
  });

  useGSAP(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      scaleX: transition.progress,
      duration: 0.14,
      ease: "none",
      overwrite: "auto",
    });
  }, {
    scope: overlayRef,
    dependencies: [transition.progress],
  });

  const progressPercent = Math.round(transition.progress * 100);
  const loadStatus = transition.loadFailed
    ? content.imageUnavailable
    : transition.progress === 1
      ? content.pageReady
      : content.preparing;

  return (
    <aside
      ref={overlayRef}
      className={styles.overlay}
      aria-label={`${content.openingLabel}. ${loadStatus}.`}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {`${content.openingLabel}. ${loadStatus}.`}
      </span>

      <div className={styles.shell} aria-hidden="true">
        <header className={styles.header}>
          <span>Lagom Arkitektur</span>
          <span className={styles.headerMeta}>{content.meta}</span>
        </header>

        <div className={styles.construction}>
          <div className={styles.eyebrowMask}>
            <p
              data-contact-transition-eyebrow
              className={styles.eyebrow}
            >
              {content.eyebrow}
            </p>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleMask}>
              <p
                data-contact-transition-title
                className={styles.title}
              >
                {content.title}
              </p>
            </div>

            <div
              data-contact-transition-media
              className={styles.media}
            >
              <img
                src={pageContent.hero.image.src}
                alt=""
                width={1800}
                height={1013}
                decoding="async"
              />
            </div>
          </div>

          <span
            data-contact-transition-rule
            className={styles.rule}
          />
        </div>

        <footer
          data-contact-transition-footer
          className={styles.footer}
        >
          <span className={styles.footerMeta}>{content.note}</span>
          <span className={styles.counter}>
            {String(progressPercent).padStart(2, "0")}
          </span>
        </footer>
      </div>

      <div
        className={styles.progress}
        role="progressbar"
        aria-label={content.loadingImage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div ref={progressRef} className={styles.progressFill} />
      </div>
    </aside>
  );
});

export function ContactTransitionProvider({ children }: { children: ReactNode }) {
  const pageContent = useLocalizedContent(contactContent);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [transition, setTransition] = useState<ActiveContactTransition | null>(null);
  const activeRef = useRef(false);
  const coverResolveRef = useRef<(() => void) | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const actualProgressRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const progressFrameRef = useRef(0);
  const progressResolveRef = useRef<(() => void) | null>(null);

  const finishTransition = useCallback(() => {
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.contactTransition;
    document.documentElement.removeAttribute("aria-busy");
    activeRef.current = false;
    abortRef.current = null;
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    progressResolveRef.current = null;
    setTransition(null);

    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(CONTACT_CONTENT_REVEAL_EVENT));
    });
  }, []);

  const startContactTransition = useCallback(() => {
    if (pathname === "/contact" || pathname === "/kontakt") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    if (activeRef.current) return;

    if (reduceMotion) {
      navigate("/contact");
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
    document.documentElement.dataset.contactTransition = "true";
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

    const imagePromise = preloadImage(pageContent.hero.image.src, {
      signal: controller.signal,
      onProgress: (progress: ImageLoadProgress) => {
        actualProgressRef.current = Math.max(
          actualProgressRef.current,
          progress.progress,
        );
      },
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;

      actualProgressRef.current = 1;
      setTransition((active) => active
        ? { ...active, loadFailed: true }
        : active);
    });

    void Promise.all([coverPromise, imagePromise, visualProgressPromise]).then(async () => {
      if (controller.signal.aborted) return;

      navigate("/contact");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      await waitForContactHero(controller.signal);
      if (controller.signal.aborted) return;

      setTransition((active) => active
        ? { ...active, stage: "revealing" }
        : active);
    });
  }, [navigate, pageContent.hero.image.src, pathname, reduceMotion]);

  useEffect(() => () => {
    abortRef.current?.abort();
    coverResolveRef.current?.();
    window.cancelAnimationFrame(progressFrameRef.current);
    progressResolveRef.current?.();
    window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {
      detail: { locked: false },
    }));
    delete document.documentElement.dataset.contactTransition;
    document.documentElement.removeAttribute("aria-busy");
  }, []);

  const isContactTransitioning = transition !== null;
  const contextValue = useMemo<ContactTransitionContextValue>(() => ({
    isContactTransitioning,
    startContactTransition,
  }), [isContactTransitioning, startContactTransition]);

  const handleCoverComplete = useCallback(() => {
    coverResolveRef.current?.();
    coverResolveRef.current = null;
  }, []);

  return (
    <ContactTransitionContext.Provider value={contextValue}>
      {children}

      {transition ? <ContactTransitionBackdrop /> : null}

      {transition ? (
        <ContactTransitionOverlay
          transition={transition}
          onCoverComplete={handleCoverComplete}
          onRevealComplete={finishTransition}
        />
      ) : null}
    </ContactTransitionContext.Provider>
  );
}
