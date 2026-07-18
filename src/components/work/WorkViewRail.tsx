import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../lib/motion";
import { workViewModes, type WorkViewMode } from "./workView";

gsap.registerPlugin(ScrollTrigger);

interface WorkViewRailProps {
  activeMode: WorkViewMode;
  onModeChange: (mode: WorkViewMode) => void;
}

function ViewIcon({ mode }: { mode: WorkViewMode }) {
  if (mode === "composition") {
    return (
      <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[0.95rem] w-[0.95rem]">
        <rect data-icon-part x="3.5" y="4" width="8" height="6" fill="currentColor" />
        <rect data-icon-part x="12.5" y="14" width="8" height="6" fill="currentColor" />
      </svg>
    );
  }

  if (mode === "index") {
    return (
      <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[0.95rem] w-[0.95rem]">
        <path data-icon-part d="M4 5.5h16" fill="none" stroke="currentColor" strokeWidth="1.65" />
        <path data-icon-part d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.65" />
        <path data-icon-part d="M4 18.5h16" fill="none" stroke="currentColor" strokeWidth="1.65" />
      </svg>
    );
  }

  return (
    <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[0.95rem] w-[0.95rem]">
      <path
        data-icon-part
        d="M9 4H4v5M15 4h5v5M20 15v5h-5M9 20H4v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <circle data-icon-core cx="12" cy="12" r="1.35" fill="currentColor" />
    </svg>
  );
}

interface ViewOptionProps {
  mode: (typeof workViewModes)[number];
  active: boolean;
  expanded: boolean;
  onSelect: () => void;
}

function ViewOption({ mode, active, expanded, onSelect }: ViewOptionProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useGSAP((_context, contextSafe) => {
    const button = buttonRef.current;
    const icon = button?.querySelector<SVGElement>("[data-view-icon]");
    const parts = gsap.utils.toArray<SVGElement>("[data-icon-part]", button);
    const core = button?.querySelector<SVGElement>("[data-icon-core]");
    if (!button || !icon) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        x: mode.id === "index" ? (index) => index === 1 ? 1.3 : index === 0 ? -0.55 : 0.55 : 0,
        rotation: mode.id === "field" ? 5 : 0,
        duration: 0.66,
        ease: motionEases.settle,
        overwrite: "auto",
        transformOrigin: "50% 50%",
      });
      if (core) {
        gsap.to(core, {
          scale: 1.5,
          duration: 0.66,
          ease: motionEases.settle,
          overwrite: "auto",
          transformOrigin: "50% 50%",
        });
      }
    });
    const leave = contextSafe!(() => {
      gsap.to([icon, ...parts, ...(core ? [core] : [])], {
        x: 0,
        scale: 1,
        rotation: 0,
        duration: reduceMotion ? 0 : 0.54,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });
    const press = contextSafe!(() => {
      if (reduceMotion) return;
      gsap.timeline({ defaults: { overwrite: "auto" } })
        .to(icon, { scale: 0.76, duration: 0.11, ease: motionEases.depart })
        .to(icon, { scale: 1, duration: 0.48, ease: motionEases.settle });
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
    dependencies: [mode.id],
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      data-work-view-option
      data-cursor=""
      aria-label={mode.label}
      aria-pressed={active}
      tabIndex={expanded || active ? 0 : -1}
      onClick={onSelect}
      className="group relative grid h-10 w-10 shrink-0 place-items-center text-[#f4f0e8] focus-visible:outline-none"
    >
      <ViewIcon mode={mode.id} />
      <span
        data-view-active-mark
        aria-hidden="true"
        className="absolute bottom-[0.28rem] h-px w-2 bg-current will-change-transform"
      />
      <span
        aria-hidden="true"
        className="absolute left-[0.24rem] h-1 w-1 scale-0 rounded-full bg-current transition-transform duration-300 group-focus-visible:scale-100"
      />
      <span className="sr-only">{mode.shortLabel}</span>
    </button>
  );
}

export function WorkViewRail({ activeMode, onModeChange }: WorkViewRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const capsuleTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const openTimerRef = useRef(0);
  const closeTimerRef = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const activeIndex = Math.max(0, workViewModes.findIndex((mode) => mode.id === activeMode));

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
    const options = gsap.utils.toArray<HTMLElement>("[data-work-view-option]", surface);
    const marks = gsap.utils.toArray<HTMLElement>("[data-view-active-mark]", surface);
    if (!surface || options.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const centerOffset = (index: number) => (1 - index) * 40;
    capsuleTimelineRef.current?.kill();
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
    capsuleTimelineRef.current = timeline;

    if (expanded) {
      gsap.set(options, { pointerEvents: "auto" });
      timeline
        .to(surface, {
          height: 128,
          duration: reduceMotion ? 0 : 0.92,
          ease: motionEases.reveal,
        }, 0)
        .to(options, {
          y: 0,
          scale: 1,
          autoAlpha: (index) => index === activeIndex ? 1 : 0.46,
          duration: reduceMotion ? 0 : 0.76,
          stagger: reduceMotion ? 0 : { amount: 0.12, from: "center" },
          ease: motionEases.reveal,
        }, 0.14)
        .to(marks, {
          scaleX: (index) => index === activeIndex ? 1 : 0,
          duration: reduceMotion ? 0 : 0.5,
          ease: motionEases.settle,
          transformOrigin: "50% 50%",
        }, 0.3);
    } else {
      options.forEach((option, index) => {
        gsap.set(option, { pointerEvents: index === activeIndex ? "auto" : "none" });
      });
      timeline
        .to(options, {
          y: centerOffset,
          scale: (index) => index === activeIndex ? 1 : 0.82,
          autoAlpha: (index) => index === activeIndex ? 1 : 0,
          duration: reduceMotion ? 0 : 0.62,
          stagger: reduceMotion ? 0 : { amount: 0.06, from: "edges" },
          ease: motionEases.reveal,
        }, 0)
        .to(marks, {
          scaleX: (index) => index === activeIndex ? 1 : 0,
          duration: reduceMotion ? 0 : 0.34,
          ease: motionEases.depart,
          transformOrigin: "50% 50%",
        }, 0)
        .to(surface, {
          height: 40,
          duration: reduceMotion ? 0 : 0.82,
          ease: motionEases.reveal,
        }, 0);
    }

    return () => {
      timeline.kill();
      if (capsuleTimelineRef.current === timeline) capsuleTimelineRef.current = null;
    };
  }, {
    scope: railRef,
    dependencies: [activeIndex, expanded],
  });

  useGSAP(() => {
    const rail = railRef.current;
    const projectContainer = document.querySelector<HTMLElement>("[data-work-projects]");
    if (!rail || !projectContainer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = () => {
      gsap.set(rail, { pointerEvents: "none" });
      gsap.set(surfaceRef.current, { pointerEvents: "auto" });
      gsap.to(rail, {
        x: 0,
        autoAlpha: 1,
        duration: reduceMotion ? 0 : 0.72,
        ease: motionEases.enter,
        overwrite: "auto",
      });
    };
    const hide = () => {
      setExpanded(false);
      gsap.set(rail, { pointerEvents: "none" });
      gsap.set(surfaceRef.current, { pointerEvents: "none" });
      gsap.to(rail, {
        x: reduceMotion ? 0 : 18,
        autoAlpha: 0,
        duration: reduceMotion ? 0 : 0.46,
        ease: motionEases.depart,
        overwrite: "auto",
      });
    };

    if (activeMode !== "composition") {
      show();
      return;
    }

    gsap.set(rail, {
      x: reduceMotion ? 0 : 18,
      autoAlpha: 0,
      pointerEvents: "none",
    });
    gsap.set(surfaceRef.current, { pointerEvents: "none" });

    const trigger = ScrollTrigger.create({
      trigger: projectContainer,
      start: "top 12%",
      onEnter: show,
      onEnterBack: show,
      onLeaveBack: hide,
    });

    return () => trigger.kill();
  }, { scope: railRef, dependencies: [activeMode], revertOnUpdate: true });

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(80);
  };

  const selectMode = (mode: WorkViewMode) => {
    if (mode === activeMode) {
      open(0);
      return;
    }
    onModeChange(mode);
    close(80);
  };

  return (
    <div className="pointer-events-none fixed inset-y-0 right-[var(--spacing-viewport-gutter)] z-40 flex items-center">
      <div
        ref={railRef}
        data-work-view-rail
        className="pointer-events-none relative h-32 w-11 overflow-visible will-change-[transform,opacity]"
      >
        <nav
          ref={surfaceRef}
          data-view-capsule-surface
          data-expanded={expanded}
          aria-label="Choose project view"
          className="absolute right-0 top-1/2 h-10 w-11 -translate-y-1/2 overflow-hidden rounded-[9px] border border-white/14 bg-[#292824] text-[#f4f0e8] shadow-[0_8px_24px_rgba(19,18,15,0.16)] will-change-[height] [contain:layout_paint]"
          onPointerEnter={() => open()}
          onPointerLeave={() => close()}
          onMouseEnter={() => open()}
          onMouseLeave={() => close()}
          onFocusCapture={() => open(0)}
          onBlurCapture={handleBlur}
        >
          <div className="absolute left-1/2 top-1/2 flex h-[7.5rem] w-10 -translate-x-1/2 -translate-y-1/2 flex-col">
            {workViewModes.map((mode) => (
              <ViewOption
                key={mode.id}
                mode={mode}
                active={activeMode === mode.id}
                expanded={expanded}
                onSelect={() => selectMode(mode.id)}
              />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
