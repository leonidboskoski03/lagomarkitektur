import type { ReactNode } from "react";
import { Section } from "../layout/Section";

type StickyOverlapHeroProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
};

export function StickyOverlapHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
}: StickyOverlapHeroProps) {
  return (
    <>
      {/*
        Sticky hero section — creates the scroll distance.
        The outer wrapper is 200vh tall. Without this extra height,
        the sticky image would have no room to stay fixed before
        the next section arrives.
      */}
      <section className="relative z-[1] h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/*
            Subtle overlay softens the bottom edge of the image
            so the overlapping section below transitions smoothly
            rather than cutting hard against the photograph.
          */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>
      </section>

      {/*
        Overlapping content section — slides up and covers the image.
        Negative margin-top pulls it upward over the sticky hero.
        Higher z-index and solid background colour ensure it renders
        on top. The bg-bg value physically hides the image beneath
        as the user scrolls.
      */}
      <Section
        spacing="large"
        className="relative z-[2] -mt-[20vh] min-h-screen bg-bg md:-mt-[35vh]"
      >
          {eyebrow && (
            <span className="mb-5 block font-sans text-[0.6875rem] leading-none tracking-[0.12em] uppercase text-text-muted">
              {eyebrow}
            </span>
          )}

          <h2 className="font-display text-4xl leading-[1.08] text-balance text-text-primary md:text-6xl lg:text-7xl">
            {title}
          </h2>

          {description && (
            <p className="mt-7 max-w-prose text-[0.9375rem] leading-relaxed text-text-muted md:text-base/7">
              {description}
            </p>
          )}
      </Section>
    </>
  );
}
