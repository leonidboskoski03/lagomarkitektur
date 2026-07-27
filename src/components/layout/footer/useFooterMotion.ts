import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../../lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useFooterMotion(footerRef: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = footerRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = gsap.utils.toArray<HTMLElement>("[data-footer-section]", root);
    const motionItems = gsap.utils.toArray<HTMLElement>("[data-footer-motion]", root);
    const motionMasks = gsap.utils.toArray<HTMLElement>("[data-footer-mask]", root);
    const wordmark = root.querySelector<HTMLElement>("[data-footer-wordmark]");
    const letters = gsap.utils.toArray<HTMLElement>("[data-footer-letter]", root);
    const utilityContent = root.querySelector<HTMLElement>("[data-footer-utility-content]");
    const utilityItems = utilityContent
      ? gsap.utils.toArray<HTMLElement>('[data-footer-motion-kind="utility"]', utilityContent)
      : [];
    const utilityMasks = utilityContent
      ? gsap.utils.toArray<HTMLElement>("[data-footer-mask]", utilityContent)
      : [];

    if (reduceMotion) {
      gsap.set(motionItems, {
        yPercent: 0,
        autoAlpha: 1,
        clearProps: "transform,visibility,willChange",
      });
      gsap.set(motionMasks, { overflow: "visible" });
      gsap.set(letters, { yPercent: 0 });
      return;
    }

    sections.forEach((section) => {
      const sectionItems = gsap.utils.toArray<HTMLElement>("[data-footer-motion]", section);
      const sectionMasks = gsap.utils.toArray<HTMLElement>("[data-footer-mask]", section);
      const isEnquiry = section.getAttribute("aria-label") === "Project enquiries";
      const sectionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "clamp(top 84%)",
          once: true,
        },
      });

      sectionTimeline.set(sectionItems, { willChange: "transform" }, 0);

      if (isEnquiry) {
        const eyebrow = section.querySelector<HTMLElement>('[data-footer-motion-kind="eyebrow"]');
        const display = section.querySelector<HTMLElement>('[data-footer-motion-kind="display"]');
        const action = section.querySelector<HTMLElement>('[data-footer-motion-kind="action"]');

        if (eyebrow) {
          sectionTimeline.fromTo(
            eyebrow,
            { yPercent: 112 },
            {
              yPercent: 0,
              duration: 1.08,
              ease: motionEases.cinematic,
            },
            0,
          );
        }

        if (display) {
          sectionTimeline.fromTo(
            display,
            { yPercent: 104 },
            {
              yPercent: 0,
              duration: 1.46,
              ease: motionEases.cinematic,
            },
            0.08,
          );
        }

        if (action) {
          sectionTimeline.fromTo(
            action,
            { yPercent: 116 },
            {
              yPercent: 0,
              duration: 1.08,
              ease: motionEases.cinematic,
            },
            0.42,
          );
        }
      } else {
        const columns = gsap.utils.toArray<HTMLElement>("[data-footer-column]", section);

        columns.forEach((column, index) => {
          const label = column.querySelector<HTMLElement>(
            '[data-footer-motion-kind="column-label"]',
          );
          const body = column.querySelector<HTMLElement>(
            '[data-footer-motion-kind="column-body"]',
          );
          const columnStart = index * 0.1;

          if (label) {
            sectionTimeline.fromTo(
              label,
              { yPercent: 112 },
              {
                yPercent: 0,
                duration: 0.98,
                ease: motionEases.cinematic,
              },
              columnStart,
            );
          }

          if (body) {
            sectionTimeline.fromTo(
              body,
              { yPercent: 104 },
              {
                yPercent: 0,
                duration: 1.28,
                ease: motionEases.cinematic,
              },
              columnStart + 0.08,
            );
          }
        });
      }

      sectionTimeline
        .set(sectionItems, {
          clearProps: "transform,willChange",
        })
        .set(
          sectionMasks,
          {
            overflow: "visible",
          },
          "<",
        );
    });

    if (!wordmark || letters.length !== 5 || !utilityContent) return;

    const closingTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: wordmark,
        start: "clamp(top 78%)",
        once: true,
      },
    });

    closingTimeline.fromTo(
      letters,
      {
        yPercent: 110,
      },
      {
        yPercent: 0,
        duration: 1.32,
        stagger: {
          each: 0.09,
          from: "start",
        },
        ease: motionEases.reveal,
      },
      0,
    );

    closingTimeline.set(utilityItems, { willChange: "transform" }, 0.36);

    closingTimeline.fromTo(
      utilityItems,
      { yPercent: 116 },
      {
        yPercent: 0,
        duration: 1.08,
        stagger: 0.07,
        ease: motionEases.cinematic,
      },
      0.36,
    );

    closingTimeline
      .set(
        utilityItems,
        {
          clearProps: "transform,willChange",
        },
        1.68,
      )
      .set(
        utilityMasks,
        {
          overflow: "visible",
        },
        1.68,
      );
  }, { scope: footerRef });
}
