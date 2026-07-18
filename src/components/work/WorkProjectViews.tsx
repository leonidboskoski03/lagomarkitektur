import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { motionEaseCurves } from "../../lib/motion";
import { EditorialProjectGrid } from "./EditorialProjectGrid";
import { ProjectField } from "./ProjectField";
import { ProjectIndex } from "./ProjectIndex";
import type { WorkViewMode } from "./workView";

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
  const reduceMotion = useReducedMotion();

  return (
    <div data-work-project-views className="relative">
      <p className="sr-only" aria-live="polite">{`${mode} project view selected`}</p>

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => window.requestAnimationFrame(() => ScrollTrigger.refresh())}
      >
        <motion.div
          key={mode}
          data-work-view-current
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0 : 0.46,
            ease: motionEaseCurves.settle,
          }}
          onAnimationComplete={() => window.requestAnimationFrame(() => ScrollTrigger.refresh())}
          className="will-change-[transform,opacity]"
        >
          <ActiveView mode={mode} projects={projects} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
