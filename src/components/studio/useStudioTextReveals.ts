import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motionEases } from "../../lib/motion";
import styles from "./StudioMotion.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export function useStudioTextReveals(
  scopeRef: RefObject<HTMLElement | null>,
  dependencies: unknown[] = [],
) {
  useGSAP(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const revealTargets = gsap.utils.toArray<HTMLElement>(
      "[data-studio-text-reveal]",
      scope,
    );
    const fadeTargets = gsap.utils.toArray<HTMLElement>(
      "[data-studio-fade-reveal]",
      scope,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([...revealTargets, ...fadeTargets], { clearProps: "all" });
      return;
    }

    const splits = revealTargets.map((target) => SplitText.create(target, {
      type: "lines",
      mask: "lines",
      linesClass: styles.revealLine,
      autoSplit: true,
      aria: "auto",
      onSplit(self) {
        return gsap.fromTo(
          self.lines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 1.18,
            stagger: 0.075,
            ease: motionEases.cinematic,
            scrollTrigger: {
              trigger: target,
              start:
                target.dataset.studioRevealStart === "late"
                  ? "top 58%"
                  : "top 72%",
              once: true,
            },
          },
        );
      },
    }));

    if (fadeTargets.length > 0) {
      gsap.set(fadeTargets, { autoAlpha: 0, y: 18 });

      ScrollTrigger.batch(fadeTargets, {
        start: "top 82%",
        once: true,
        onEnter: (batch) => {
          gsap.to(
            batch,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.065,
              ease: motionEases.enter,
              overwrite: "auto",
            },
          );
        },
      });
    }

    return () => {
      splits.forEach((split) => split.revert());
    };
  }, {
    scope: scopeRef,
    dependencies,
    revertOnUpdate: true,
  });
}
