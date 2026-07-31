import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { motionEases } from "../../lib/motion";
import { useLanguage } from "../../i18n/LanguageContext";
import { siteCopy } from "../../i18n/siteCopy";

gsap.registerPlugin(useGSAP);

export type ProjectGalleryMode = "story" | "mosaic" | "rail";

interface ProjectGalleryModeRailProps {
  mode: ProjectGalleryMode;
  visible: boolean;
  onChange: (mode: ProjectGalleryMode) => void;
}

const modes: ReadonlyArray<{
  id: ProjectGalleryMode;
  label: string;
}> = [
  { id: "story", label: "Story gallery view" },
  { id: "mosaic", label: "Mosaic gallery view" },
  { id: "rail", label: "Horizontal rail gallery view" },
];

function ModeIcon({ mode }: { mode: ProjectGalleryMode }) {
  if (mode === "story") {
    return (
      <svg
        data-gallery-mode-icon
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[0.95rem] w-[0.95rem]"
      >
        <rect data-icon-part x="4" y="4" width="10" height="6" fill="currentColor" />
        <rect data-icon-part x="10" y="14" width="10" height="6" fill="currentColor" />
      </svg>
    );
  }

  if (mode === "mosaic") {
    return (
      <svg
        data-gallery-mode-icon
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[0.95rem] w-[0.95rem]"
      >
        <rect data-icon-part x="3.5" y="3.5" width="7.5" height="10" fill="currentColor" />
        <rect data-icon-part x="12.5" y="3.5" width="8" height="6" fill="currentColor" />
        <rect data-icon-part x="3.5" y="15" width="7.5" height="5.5" fill="currentColor" />
        <rect data-icon-part x="12.5" y="11" width="8" height="9.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      data-gallery-mode-icon
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[0.95rem] w-[0.95rem]"
    >
      <rect data-icon-part x="3.5" y="4" width="5" height="16" fill="currentColor" />
      <rect data-icon-part x="10" y="4" width="5" height="16" fill="currentColor" opacity="0.72" />
      <rect data-icon-part x="16.5" y="4" width="4" height="16" fill="currentColor" opacity="0.46" />
    </svg>
  );
}

interface ModeOptionProps {
  item: (typeof modes)[number];
  active: boolean;
  expanded: boolean;
  onSelect: () => void;
}

function ModeOption({
  item,
  active,
  expanded,
  onSelect,
}: ModeOptionProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useGSAP((_context, contextSafe) => {
    const button = buttonRef.current;
    const icon = button?.querySelector<SVGElement>("[data-gallery-mode-icon]");
    const parts = gsap.utils.toArray<SVGElement>("[data-icon-part]", button);
    if (!button || !icon) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const enter = contextSafe!(() => {
      if (!button.closest('[data-expanded="true"]') || reduceMotion) return;

      gsap.to(icon, {
        scale: 1.12,
        duration: 0.62,
        ease: motionEases.settle,
        overwrite: "auto",
        transformOrigin: "50% 50%",
      });
      gsap.to(parts, {
        x: item.id === "rail"
          ? (index) => (index - 1) * 0.55
          : item.id === "story"
            ? (index) => (index === 0 ? -0.6 : 0.6)
            : 0,
        duration: 0.66,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });

    const leave = contextSafe!(() => {
      gsap.to([icon, ...parts], {
        x: 0,
        scale: 1,
        duration: reduceMotion ? 0 : 0.54,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });

    const press = contextSafe!(() => {
      if (reduceMotion) return;

      gsap.timeline({ defaults: { overwrite: "auto" } })
        .to(icon, {
          scale: 0.76,
          duration: 0.11,
          ease: motionEases.depart,
        })
        .to(icon, {
          scale: 1,
          duration: 0.48,
          ease: motionEases.settle,
        });
    });

    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("blur", leave);
    button.addEventListener("click", press);

    return () => {
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("blur", leave);
      button.removeEventListener("click", press);
    };
  }, {
    scope: buttonRef,
    dependencies: [item.id],
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      data-gallery-mode-option
      data-cursor=""
      aria-label={item.label}
      aria-pressed={active}
      tabIndex={expanded || active ? 0 : -1}
      onClick={onSelect}
      className="group relative grid h-10 w-10 shrink-0 place-items-center text-[#f4f0e8] focus-visible:outline-none"
    >
      <ModeIcon mode={item.id} />
      <span
        data-gallery-active-mark
        aria-hidden="true"
        className="absolute bottom-[0.28rem] h-px w-2 bg-current will-change-transform"
      />
      <span
        aria-hidden="true"
        className="absolute left-[0.24rem] h-1 w-1 scale-0 rounded-full bg-current transition-transform duration-300 group-focus-visible:scale-100"
      />
    </button>
  );
}

export function ProjectGalleryModeRail({
  mode,
  visible,
  onChange,
}: ProjectGalleryModeRailProps) {
  const { language } = useLanguage();
  const copy = siteCopy[language].project;
  const railRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openTimerRef = useRef(0);
  const closeTimerRef = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const localizedModes = modes.map((item) => ({
    ...item,
    label: copy.galleryModes[item.id],
  }));
  const activeIndex = Math.max(
    0,
    localizedModes.findIndex((item) => item.id === mode),
  );

  const open = useCallback((delay = 85) => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = window.setTimeout(() => setExpanded(true), delay);
  }, []);

  const close = useCallback((delay = 180) => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setExpanded(false), delay);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(0);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, expanded]);

  useGSAP(() => {
    const surface = surfaceRef.current;
    const options = gsap.utils.toArray<HTMLElement>(
      "[data-gallery-mode-option]",
      surface,
    );
    const marks = gsap.utils.toArray<HTMLElement>(
      "[data-gallery-active-mark]",
      surface,
    );
    if (!visible || !surface || options.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const centerOffset = (index: number) => (1 - index) * 40;

    timelineRef.current?.kill();
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
    timelineRef.current = timeline;

    if (expanded) {
      gsap.set(options, { pointerEvents: "auto" });
      timeline
        .to(surface, {
          height: 128,
          duration: prefersReducedMotion ? 0 : 0.92,
          ease: motionEases.reveal,
        }, 0)
        .to(options, {
          y: 0,
          scale: 1,
          autoAlpha: (index) => index === activeIndex ? 1 : 0.46,
          duration: prefersReducedMotion ? 0 : 0.76,
          stagger: prefersReducedMotion ? 0 : { amount: 0.12, from: "center" },
          ease: motionEases.reveal,
        }, 0.14)
        .to(marks, {
          scaleX: (index) => index === activeIndex ? 1 : 0,
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: motionEases.settle,
          transformOrigin: "50% 50%",
        }, 0.3);
    } else {
      options.forEach((option, index) => {
        gsap.set(option, {
          pointerEvents: index === activeIndex ? "auto" : "none",
        });
      });
      timeline
        .to(options, {
          y: centerOffset,
          scale: (index) => index === activeIndex ? 1 : 0.82,
          autoAlpha: (index) => index === activeIndex ? 1 : 0,
          duration: prefersReducedMotion ? 0 : 0.62,
          stagger: prefersReducedMotion ? 0 : { amount: 0.06, from: "edges" },
          ease: motionEases.reveal,
        }, 0)
        .to(marks, {
          scaleX: (index) => index === activeIndex ? 1 : 0,
          duration: prefersReducedMotion ? 0 : 0.34,
          ease: motionEases.depart,
          transformOrigin: "50% 50%",
        }, 0)
        .to(surface, {
          height: 40,
          duration: prefersReducedMotion ? 0 : 0.82,
          ease: motionEases.reveal,
        }, 0);
    }

    return () => {
      timeline.kill();
      if (timelineRef.current === timeline) timelineRef.current = null;
    };
  }, {
    dependencies: [activeIndex, expanded, visible],
  });

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      close(80);
    }
  };

  const selectMode = (nextMode: ProjectGalleryMode) => {
    if (nextMode === mode) {
      open(0);
      return;
    }

    onChange(nextMode);
    close(80);
  };

  return (
    <AnimatePresence onExitComplete={() => setExpanded(false)}>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed inset-y-0 right-[var(--spacing-viewport-gutter)] z-[120] flex items-center"
          initial={reduceMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 18 }}
          transition={{
            duration: reduceMotion ? 0 : 0.56,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            ref={railRef}
            className="pointer-events-none relative h-32 w-11 overflow-visible will-change-[transform,opacity]"
          >
            <nav
              ref={surfaceRef}
              data-expanded={expanded}
              aria-label={copy.gallerySelector}
              aria-expanded={expanded}
              className="pointer-events-auto absolute right-0 top-1/2 h-10 w-11 -translate-y-1/2 overflow-hidden rounded-[9px] border border-white/14 bg-[#292824] text-[#f4f0e8] shadow-[0_8px_24px_rgba(19,18,15,0.16)] will-change-[height] [contain:layout_paint]"
              onPointerEnter={() => open()}
              onPointerLeave={() => close()}
              onFocusCapture={() => open(0)}
              onBlurCapture={handleBlur}
            >
              <div className="absolute left-1/2 top-1/2 flex h-[7.5rem] w-10 -translate-x-1/2 -translate-y-1/2 flex-col">
                {localizedModes.map((item) => (
                  <ModeOption
                    key={item.id}
                    item={item}
                    active={mode === item.id}
                    expanded={expanded}
                    onSelect={() => selectMode(item.id)}
                  />
                ))}
              </div>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
