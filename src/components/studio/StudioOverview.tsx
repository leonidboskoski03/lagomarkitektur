import { useRef } from "react";
import { studioContent } from "../../data/studio";
import { ProjectTransitionLink } from "../transition/ProjectTransitionLink";
import { StudioImageReveal } from "./StudioImageReveal";
import { StudioProjectCaption } from "./StudioProjectCaption";
import { useStudioTextReveals } from "./useStudioTextReveals";
import { useLanguage, useLocalizedContent } from "../../i18n/LanguageContext";

export function StudioOverview() {
  const { language } = useLanguage();
  const viewPrefix = language === "sv" ? "Se" : "View";
  const sectionRef = useRef<HTMLElement | null>(null);
  const { studio } = useLocalizedContent(studioContent);
  const [primaryProject, narrativeProject] = studio.media;

  useStudioTextReveals(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-[clamp(3rem,5vw,5rem)] pt-[clamp(5rem,8vw,8rem)] text-brand-ink"
      aria-labelledby="studio-overview-heading"
    >
      <div className="viewport-container">
        <h2
          id="studio-overview-heading"
          data-studio-text-reveal
          data-studio-reveal-start="late"
          className="max-w-[18ch] text-[clamp(2.65rem,10vw,3.55rem)] font-medium leading-[0.9] tracking-[-0.073em] md:text-[clamp(3.6rem,7vw,8.6rem)]"
        >
          {studio.title}
        </h2>

        <div className="mt-[clamp(4rem,7vw,7.5rem)] grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-start md:gap-x-[clamp(1.5rem,2.5vw,3rem)] xl:grid-cols-12">
          <p
            data-studio-text-reveal
            className="text-[clamp(1.3rem,1.85vw,2rem)] leading-[1.38] tracking-[-0.03em] md:col-span-1 xl:col-span-5"
          >
            {studio.paragraphs[0]}
          </p>

          <ProjectTransitionLink
            projectSlug={narrativeProject.projectSlug}
            aria-label={`${viewPrefix} ${narrativeProject.projectTitle}`}
            data-cursor=""
            className="group w-full justify-self-end md:col-span-1 xl:col-span-3 xl:col-start-7"
          >
            <figure>
              <StudioImageReveal
                src={narrativeProject.src}
                alt={narrativeProject.alt}
                width={narrativeProject.width}
                height={narrativeProject.height}
                transitionImageId={narrativeProject.transitionImageId}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                className="aspect-[3/2] md:aspect-[0.82/1]"
              />
              <StudioProjectCaption
                projectTitle={narrativeProject.projectTitle}
              />
            </figure>
          </ProjectTransitionLink>

          <div className="grid grid-cols-1 gap-[clamp(2.5rem,4vw,4.5rem)] md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:col-start-10 xl:block xl:space-y-[clamp(2.5rem,4vw,4.5rem)]">
            {studio.paragraphs.slice(1).map((paragraph) => (
              <p
                key={paragraph}
                data-studio-text-reveal
                className="text-[clamp(1.04rem,1.25vw,1.34rem)] leading-[1.5] tracking-[-0.022em] text-black/64"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ProjectTransitionLink
          projectSlug={primaryProject.projectSlug}
          aria-label={`${viewPrefix} ${primaryProject.projectTitle}`}
          data-cursor=""
          className="group mt-[clamp(5rem,8vw,8rem)] block"
        >
          <figure>
            <StudioImageReveal
              src={primaryProject.src}
              alt={primaryProject.alt}
              width={primaryProject.width}
              height={primaryProject.height}
              transitionImageId={primaryProject.transitionImageId}
              sizes="100vw"
              className="aspect-[1.777/1] md:aspect-[1.72/1] md:min-h-[24rem]"
            />
            <StudioProjectCaption projectTitle={primaryProject.projectTitle} />
          </figure>
        </ProjectTransitionLink>
      </div>
    </section>
  );
}
