import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../lib/motion";
import { workViewModes, type WorkViewMode } from "./workView";

gsap.registerPlugin(ScrollTrigger);

const VIEW_BUTTON_WIDTH = 76;
const VIEW_BUTTON_HEIGHT = 44;

interface WorkViewRailProps {
  activeMode: WorkViewMode;
  onModeChange: (mode: WorkViewMode) => void;
}

function ViewIcon({ mode }: { mode: WorkViewMode }) {
  if (mode === "composition") {
    return (
      <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[1.125rem] w-[1.125rem]">
        <rect data-icon-part x="3.5" y="4" width="8" height="6" fill="currentColor" />
        <rect data-icon-part x="12.5" y="14" width="8" height="6" fill="currentColor" />
      </svg>
    );
  }

  if (mode === "index") {
    return (
      <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[1.125rem] w-[1.125rem]">
        <path data-icon-part d="M4 5.5h16" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path data-icon-part d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path data-icon-part d="M4 18.5h16" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg data-view-icon viewBox="0 0 24 24" aria-hidden="true" className="h-[1.125rem] w-[1.125rem]">
      <path
        data-icon-part
        d="M9 4H4v5M15 4h5v5M20 15v5h-5M9 20H4v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle data-icon-core cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

interface WorkViewButtonProps {
  mode: (typeof workViewModes)[number];
  isActive: boolean;
  onSelect: () => void;
}

function WorkViewButton({ mode, isActive, onSelect }: WorkViewButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useGSAP((_context, contextSafe) => {
    const button = buttonRef.current;
    const icon = button?.querySelector<SVGElement>("[data-view-icon]");
    const parts = gsap.utils.toArray<SVGElement>("[data-icon-part]", button);
    const core = button?.querySelector<SVGElement>("[data-icon-core]");
    const label = button?.querySelector<HTMLElement>("[data-view-label]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!button || !icon || !label) return;

    const animateIn = contextSafe!(() => {
      if (reduceMotion) {
        gsap.set(label, { autoAlpha: 1, x: 2 });
        return;
      }

      const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
      timeline.to(icon, {
        scale: 1.12,
        duration: 0.78,
        ease: motionEases.settle,
        transformOrigin: "50% 50%",
      }, 0);
      timeline.to(label, {
        x: 2,
        autoAlpha: 1,
        letterSpacing: "0.17em",
        duration: 0.72,
        ease: motionEases.settle,
      }, 0.06);

      if (mode.id === "composition") {
        timeline.to(parts, {
          x: (index) => index === 0 ? 1.3 : -1.3,
          y: (index) => index === 0 ? 1.1 : -1.1,
          duration: 0.86,
          ease: motionEases.settle,
        }, 0);
      } else if (mode.id === "index") {
        timeline.to(parts, {
          x: (index) => index === 1 ? 2 : index === 0 ? -1.2 : 1.2,
          duration: 0.86,
          ease: motionEases.settle,
        }, 0);
      } else {
        timeline.to(parts, {
          rotation: 8,
          scale: 1.08,
          duration: 0.9,
          ease: motionEases.settle,
          transformOrigin: "50% 50%",
        }, 0);
        if (core) {
          timeline.to(core, {
            scale: 1.65,
            duration: 0.9,
            ease: motionEases.settle,
            transformOrigin: "50% 50%",
          }, 0);
        }
      }
    });

    const animateOut = contextSafe!(() => {
      gsap.to(label, {
        x: 0,
        autoAlpha: 1,
        letterSpacing: "0.13em",
        duration: reduceMotion ? 0 : 0.68,
        ease: motionEases.settle,
        overwrite: "auto",
      });
      gsap.to([icon, ...parts, ...(core ? [core] : [])], {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: reduceMotion ? 0 : 0.72,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });

    const animatePress = contextSafe!(() => {
      if (reduceMotion) return;
      gsap.timeline({ defaults: { overwrite: "auto" } })
        .to(icon, { scale: 0.82, duration: 0.15, ease: motionEases.depart })
        .to(icon, { scale: 1.12, duration: 0.62, ease: motionEases.settle });
    });

    button.addEventListener("pointerenter", animateIn);
    button.addEventListener("pointerleave", animateOut);
    button.addEventListener("focus", animateIn);
    button.addEventListener("blur", animateOut);
    button.addEventListener("click", animatePress);

    return () => {
      button.removeEventListener("pointerenter", animateIn);
      button.removeEventListener("pointerleave", animateOut);
      button.removeEventListener("focus", animateIn);
      button.removeEventListener("blur", animateOut);
      button.removeEventListener("click", animatePress);
    };
  }, { scope: buttonRef, dependencies: [mode.id] });

  return (
    <button
      ref={buttonRef}
      type="button"
      data-work-view-button
      data-cursor=""
      aria-label={mode.label}
      aria-pressed={isActive}
      title={mode.shortLabel}
      onClick={onSelect}
      className={`relative z-[1] grid h-11 w-[4.75rem] grid-cols-[1.125rem_minmax(0,1fr)] items-center gap-2 px-2.5 text-left transition-colors duration-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-3px] focus-visible:outline-current ${
        isActive ? "text-black" : "text-black/42 hover:text-black"
      }`}
    >
      <ViewIcon mode={mode.id} />
      <span
        data-view-label
        className="pointer-events-none block whitespace-nowrap text-[0.5rem] font-medium uppercase tracking-[0.13em] opacity-100 will-change-transform"
      >
        {mode.shortLabel}
      </span>
    </button>
  );
}

export function WorkViewRail({ activeMode, onModeChange }: WorkViewRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const activeIndex = workViewModes.findIndex((mode) => mode.id === activeMode);

  useGSAP(() => {
    if (!railRef.current) return;

    const projectContainer = document.querySelector<HTMLElement>("[data-work-projects]");
    if (!projectContainer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const buttons = gsap.utils.toArray<HTMLElement>("[data-work-view-button]", railRef.current);
    const showRail = () => {
      gsap.set(railRef.current, { pointerEvents: "auto" });
      gsap.to(railRef.current, {
        x: 0,
        y: 0,
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: reduceMotion ? 0 : 0.72,
        ease: motionEases.enter,
        overwrite: "auto",
      });
      if (!reduceMotion) {
        gsap.fromTo(buttons, { autoAlpha: 0, x: 7 }, {
          autoAlpha: 1,
          x: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: motionEases.enter,
          overwrite: "auto",
        });
      }
    };
    const hideRail = () => {
      gsap.set(railRef.current, { pointerEvents: "none" });
      gsap.to(railRef.current, {
        x: reduceMotion ? 0 : 20,
        autoAlpha: 0,
        clipPath: "inset(0% 0% 0% 100%)",
        duration: reduceMotion ? 0 : 0.46,
        ease: motionEases.depart,
        overwrite: "auto",
      });
    };

    if (activeMode !== "composition") {
      showRail();
      return;
    }

    gsap.set(railRef.current, {
      x: reduceMotion ? 0 : 20,
      autoAlpha: 0,
      clipPath: "inset(0% 0% 0% 100%)",
      pointerEvents: "none",
    });

    const trigger = ScrollTrigger.create({
      trigger: projectContainer,
      start: "top 12%",
      onEnter: showRail,
      onEnterBack: showRail,
      onLeaveBack: hideRail,
    });

    return () => trigger.kill();
  }, { scope: railRef, dependencies: [activeMode], revertOnUpdate: true });

  useGSAP(() => {
    const indicator = railRef.current?.querySelector<HTMLElement>("[data-work-view-indicator]");
    if (!indicator) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      gsap.to(indicator, {
        x: 0,
        y: activeIndex * VIEW_BUTTON_HEIGHT,
        duration: reduceMotion ? 0 : 0.58,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });

    media.add("(max-width: 767px)", () => {
      gsap.to(indicator, {
        x: activeIndex * VIEW_BUTTON_WIDTH,
        y: 0,
        duration: reduceMotion ? 0 : 0.58,
        ease: motionEases.settle,
        overwrite: "auto",
      });
    });

    return () => media.revert();
  }, { scope: railRef, dependencies: [activeIndex] });

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-[var(--spacing-viewport-gutter)] z-40 md:inset-y-0 md:flex md:items-center"
    >
      <div
        ref={railRef}
        data-work-view-rail
        className="pointer-events-auto will-change-[transform,clip-path,opacity]"
      >
        <nav
          aria-label="Choose project view"
          className="relative flex border border-black/12 bg-[#efebe3] p-1 text-black shadow-[0_10px_30px_rgba(25,22,18,0.1)] md:flex-col"
        >
          <span
            data-work-view-indicator
            aria-hidden="true"
            className="pointer-events-none absolute left-1 top-1 h-11 w-[4.75rem] border border-black/10 bg-white/80 shadow-[0_2px_8px_rgba(25,22,18,0.06)] will-change-transform"
          />
          {workViewModes.map((mode) => (
            <WorkViewButton
              key={mode.id}
              mode={mode}
              isActive={activeMode === mode.id}
              onSelect={() => onModeChange(mode.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
