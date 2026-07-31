import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { studioContent, type StudioPrinciple } from "../../data/studio";
import { motionEases } from "../../lib/motion";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";
import { StudioImageReveal } from "./StudioImageReveal";
import { StudioProjectCaption } from "./StudioProjectCaption";
import { useStudioTextReveals } from "./useStudioTextReveals";
import { useLocalizedContent } from "../../i18n/LanguageContext";

gsap.registerPlugin(useGSAP);

export function StudioPrinciples() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { principles } = useLocalizedContent(studioContent);
  const activePrinciple = principles.items[activeIndex];

  useStudioTextReveals(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-[clamp(3rem,5vw,5rem)] pt-[clamp(3rem,4.5vw,4.5rem)] text-brand-ink"
      aria-labelledby="studio-principles-heading"
    >
      <div className="viewport-container">
        <p
          data-studio-fade-reveal
          className="text-[0.67rem] font-semibold uppercase tracking-[0.07em] text-black/46"
        >
          {principles.label}
        </p>

        <h2
          id="studio-principles-heading"
          data-studio-text-reveal
          className="mt-[clamp(3.5rem,5.5vw,6rem)] max-w-[16ch] text-[clamp(2.35rem,10vw,3.3rem)] font-medium leading-[0.91] tracking-[-0.073em] md:text-[clamp(3.3rem,7vw,8.6rem)]"
        >
          {principles.title}
        </h2>

        <div className="mt-[clamp(4rem,7vw,7rem)]">
          <div className="grid grid-flow-dense grid-cols-1 border-l border-t border-black/18 lg:grid-cols-12">
            <div
              role="tablist"
              aria-label={principles.tabLabel}
              className="grid grid-flow-dense grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-4"
            >
              {principles.items.map((principle, index) => (
                <PrincipleButton
                  key={principle.index}
                  principle={principle}
                  isActive={index === activeIndex}
                  panelId="studio-principle-panel"
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <div className="border-b border-r border-black/18 lg:col-span-8">
              <StudioPrinciplePanel
                key={activePrinciple.index}
                id="studio-principle-panel"
                principle={activePrinciple}
                viewPrefix={principles.viewProject}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PrincipleButtonProps {
  principle: StudioPrinciple;
  isActive: boolean;
  panelId: string;
  onActivate: () => void;
}

function PrincipleButton({
  principle,
  isActive,
  panelId,
  onActivate,
}: PrincipleButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      onClick={onActivate}
      onFocus={onActivate}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onActivate();
      }}
      className={[
        "flex min-h-24 flex-col justify-end border-b border-r border-black/18 p-4 text-left transition-[background-color,color] duration-700 [transition-timing-function:cubic-bezier(.58,0,.22,1)] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black lg:min-h-36 lg:p-[clamp(1rem,1.5vw,1.6rem)]",
        isActive
          ? "bg-brand-ink text-white"
          : "bg-white text-brand-ink hover:bg-black/[0.035]",
      ].join(" ")}
    >
      <span className="block text-[clamp(1.45rem,7vw,2rem)] font-medium leading-[0.92] tracking-[-0.04em] lg:text-[clamp(1.65rem,2.45vw,3.2rem)] lg:tracking-[-0.058em]">
        {principle.title}
      </span>
      <span className="mt-3 hidden max-w-[18rem] text-[0.64rem] font-semibold uppercase leading-[1.35] tracking-[0.055em] opacity-55 lg:block">
        {principle.summary}
      </span>
    </button>
  );
}

interface StudioPrinciplePanelProps {
  id: string;
  principle: StudioPrinciple;
  viewPrefix: string;
}

function StudioPrinciplePanel({
  id,
  principle,
  viewPrefix,
}: StudioPrinciplePanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const summary = panel.querySelector<HTMLElement>(
      "[data-studio-principle-summary]",
    );
    const heading = panel.querySelector<HTMLElement>(
      "[data-studio-principle-heading]",
    );
    const body = panel.querySelector<HTMLElement>(
      "[data-studio-principle-body]",
    );

    if (!summary || !heading || !body) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([summary, heading, body], { clearProps: "all" });
      return;
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
    });

    timeline
      .fromTo(
        summary,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: motionEases.enter,
        },
        0,
      )
      .fromTo(
        heading,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.08,
          ease: motionEases.enter,
        },
        0.06,
      )
      .fromTo(
        body,
        {
          autoAlpha: 0,
          y: 12,
          filter: "blur(3px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.08,
          ease: motionEases.cinematic,
          clearProps: "filter",
        },
        0.28,
      );
  }, { scope: panelRef, dependencies: [principle.index] });

  return (
    <div
      ref={panelRef}
      id={id}
      role="tabpanel"
      className="grid grid-cols-1 lg:min-h-[36rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      <div
        className="flex min-w-0 flex-col justify-between border-b border-black/18 p-5 sm:p-6 lg:min-h-[36rem] lg:border-b-0 lg:border-r lg:p-[clamp(1.5rem,3vw,3.5rem)]"
      >
        <p
          data-studio-principle-summary
          className="hidden max-w-[20rem] text-[0.66rem] font-semibold uppercase leading-[1.4] tracking-[0.07em] text-black/48 will-change-[transform,opacity] lg:block"
        >
          {principle.summary}
        </p>

        <div className="min-w-0 lg:mt-20">
          <div className="max-w-full overflow-hidden pb-[0.08em]">
            <h3
              data-studio-principle-heading
              className="text-[clamp(2.6rem,12vw,4rem)] font-medium leading-[0.88] tracking-[-0.04em] will-change-transform lg:whitespace-nowrap lg:text-[clamp(2.5rem,3.8vw,5.2rem)] lg:leading-[0.82] lg:tracking-[-0.075em]"
            >
              {principle.title}
            </h3>
          </div>
          <p
            data-studio-principle-body
            className="mt-4 max-w-[38rem] text-[1rem] leading-[1.45] tracking-[-0.02em] text-black/65 will-change-[transform,opacity,filter] lg:mt-[clamp(2rem,3.5vw,3.75rem)] lg:text-[clamp(1.08rem,1.35vw,1.48rem)] lg:tracking-[-0.028em]"
          >
            {principle.body}
          </p>
        </div>
      </div>

      <ProjectTransitionLink
        projectSlug={principle.media.projectSlug}
        aria-label={`${viewPrefix} ${principle.media.projectTitle}`}
        data-cursor=""
        className="group block min-w-0"
      >
        <figure className="flex h-full flex-col p-2.5 sm:p-3 lg:min-h-[36rem] lg:p-[clamp(0.75rem,1.2vw,1.25rem)]">
          <StudioImageReveal
            src={principle.media.src}
            alt={principle.media.alt}
            width={principle.media.width}
            height={principle.media.height}
            transitionImageId={principle.media.transitionImageId}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="aspect-[3/2] lg:min-h-0 lg:flex-1 lg:aspect-auto"
          />
          <StudioProjectCaption
            projectTitle={principle.media.projectTitle}
          />
        </figure>
      </ProjectTransitionLink>
    </div>
  );
}
