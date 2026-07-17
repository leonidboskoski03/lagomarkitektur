import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { motionEases } from "../../lib/motion";
import { EditorialProjectGrid } from "./EditorialProjectGrid";
import { ProjectField } from "./ProjectField";
import { ProjectIndex } from "./ProjectIndex";
import type { WorkViewMode } from "./workView";

gsap.registerPlugin(ScrollTrigger);

interface WorkProjectViewsProps {
  mode: WorkViewMode;
  projects: WorkProjectItem[];
}

function ActiveView({ mode, projects }: WorkProjectViewsProps) {
  if (mode === "index") return <ProjectIndex projects={projects} />;
  if (mode === "field") return <ProjectField projects={projects} />;
  return <EditorialProjectGrid projects={projects} />;
}

export function WorkProjectViews({ mode, projects }: WorkProjectViewsProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [displayedMode, setDisplayedMode] = useState<WorkViewMode>(mode);

  useGSAP((_context, contextSafe) => {
    const view = stageRef.current?.querySelector<HTMLElement>("[data-work-view-current]");
    if (!view) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (displayedMode !== mode) {
      if (reduceMotion) {
        setDisplayedMode(mode);
        return;
      }

      gsap.to(view, {
        y: -22,
        autoAlpha: 0,
        clipPath: "inset(0% 0% 18% 0%)",
        duration: 0.48,
        ease: motionEases.depart,
        overwrite: "auto",
        onComplete: contextSafe!(() => setDisplayedMode(mode)),
      });
      return;
    }

    if (!reduceMotion) {
      gsap.fromTo(view, {
        y: 26,
        autoAlpha: 0,
        clipPath: "inset(12% 0% 0% 0%)",
      }, {
        y: 0,
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.82,
        ease: motionEases.enter,
        clearProps: "clipPath",
      });
    } else {
      gsap.set(view, { clearProps: "all" });
    }

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, { scope: stageRef, dependencies: [mode, displayedMode] });

  return (
    <div ref={stageRef}>
      <p className="sr-only" aria-live="polite">{`${displayedMode} project view selected`}</p>
      <div key={displayedMode} data-work-view-current className="will-change-[transform,opacity,clip-path]">
        <ActiveView mode={displayedMode} projects={projects} />
      </div>
    </div>
  );
}
