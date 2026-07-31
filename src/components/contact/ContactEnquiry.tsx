import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ContactPageContent } from "../../data/contact";
import { motionEases } from "../../lib/motion";
import { ContactForm } from "./ContactForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ContactEnquiryProps {
  content: ContactPageContent;
}

export function ContactEnquiry({ content }: ContactEnquiryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const statementLines = gsap.utils.toArray<HTMLElement>(
        "[data-contact-statement-line]",
        section,
      );
      const statementMetaLeft = gsap.utils.toArray<HTMLElement>(
        '[data-contact-statement-meta="left"]',
        section,
      );
      const statementMetaRight = gsap.utils.toArray<HTMLElement>(
        '[data-contact-statement-meta="right"]',
        section,
      );
      const statementDetails = gsap.utils.toArray<HTMLElement>(
        "[data-contact-statement-detail]",
        section,
      );
      const emailReveal = section.querySelector<HTMLElement>(
        "[data-contact-email-reveal]",
      );
      const formRule = section.querySelector<HTMLElement>(
        "[data-contact-form-rule]",
      );
      const formMeta = gsap.utils.toArray<HTMLElement>(
        "[data-contact-form-meta]",
        section,
      );
      const formHeadingReveals = gsap.utils.toArray<HTMLElement>(
        "[data-contact-form-heading-reveal]",
        section,
      );
      const formRows = gsap.utils.toArray<HTMLElement>(
        "[data-contact-form-row]",
        section,
      );
      const formImageFrame = section.querySelector<HTMLElement>(
        "[data-contact-form-image-frame]",
      );
      const formImage = section.querySelector<HTMLElement>(
        "[data-contact-form-image]",
      );
      const formImageVeil = section.querySelector<HTMLElement>(
        "[data-contact-form-image-veil]",
      );
      const formImageMeta = section.querySelector<HTMLElement>(
        "[data-contact-form-image-meta]",
      );

      if (
        statementLines.length !== 2
        || statementDetails.length !== 2
        || !emailReveal
        || !formRule
        || !formImageFrame
        || !formImage
        || !formImageVeil
        || !formImageMeta
      ) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [
            ...statementLines,
            ...statementMetaLeft,
            ...statementMetaRight,
            ...statementDetails,
            emailReveal,
            formRule,
            ...formMeta,
            ...formHeadingReveals,
            ...formRows,
            formImageFrame,
            formImage,
            formImageVeil,
            formImageMeta,
          ],
          { clearProps: "all" },
        );
        gsap.set(formImageVeil, { autoAlpha: 0 });
        gsap.set(formImage, { scale: 1, filter: "brightness(1)" });
        return;
      }

      gsap.set(statementLines, { yPercent: 112 });
      gsap.set(emailReveal, { yPercent: 112 });
      gsap.set(statementDetails, { yPercent: 112 });
      gsap.set(statementMetaLeft, {
        autoAlpha: 0,
        clipPath: "inset(0% 100% 0% 0%)",
        x: -28,
      });
      gsap.set(statementMetaRight, {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 0% 100%)",
        x: 28,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-contact-statement-shell]",
            start: () => window.innerWidth < 768
              ? "clamp(top 88%)"
              : "clamp(top 62%)",
            once: true,
            invalidateOnRefresh: true,
          },
          defaults: {
            overwrite: "auto",
          },
        })
        .addLabel("statement", 0)
        .to(
          [...statementMetaLeft, ...statementMetaRight],
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            x: 0,
            duration: 1.05,
            stagger: 0.08,
            ease: motionEases.cinematic,
          },
          "statement",
        )
        .to(
          statementLines,
          {
            yPercent: 0,
            duration: 1.12,
            stagger: 0.095,
            ease: motionEases.enter,
          },
          "statement+=0.28",
        )
        .to(
          emailReveal,
          {
            yPercent: 0,
            duration: 1.04,
            ease: motionEases.enter,
          },
          "statement+=0.68",
        )
        .to(
          statementDetails,
          {
            yPercent: 0,
            duration: 1.08,
            stagger: 0.09,
            ease: motionEases.enter,
          },
          ">+=0.14",
        );

      gsap.set(formRule, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set([...formMeta, ...formHeadingReveals, ...formRows, formImageMeta], {
        yPercent: 112,
      });
      gsap.set(formImageVeil, { autoAlpha: 1 });
      gsap.set(formImage, {
        scale: 1.045,
        filter: "brightness(0.66)",
        transformOrigin: "center center",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-contact-form-shell]",
            start: () => window.innerWidth < 768
              ? "clamp(top 84%)"
              : "clamp(top 72%)",
            once: true,
            invalidateOnRefresh: true,
          },
          defaults: {
            overwrite: "auto",
          },
        })
        .addLabel("form", 0)
        .to(
          formRule,
          {
            scaleX: 1,
            duration: 1.15,
            ease: motionEases.cinematic,
          },
          "form",
        )
        .to(
          formMeta,
          {
            yPercent: 0,
            duration: 1.08,
            ease: motionEases.enter,
          },
          "form+=0.08",
        )
        .to(
          formHeadingReveals,
          {
            yPercent: 0,
            duration: 1.08,
            stagger: 0.09,
            ease: motionEases.enter,
          },
          "form+=0.18",
        )
        .to(
          formImageVeil,
          {
            autoAlpha: 0,
            duration: 0.78,
            ease: motionEases.reveal,
          },
          "form+=0.42",
        )
        .to(
          formImage,
          {
            scale: 1,
            filter: "brightness(1)",
            duration: 1.34,
            ease: motionEases.settle,
            clearProps: "filter",
          },
          "form+=0.42",
        )
        .to(
          formRows,
          {
            yPercent: 0,
            duration: 1.02,
            stagger: 0.075,
            ease: motionEases.enter,
          },
          "form+=0.74",
        )
        .to(
          formImageMeta,
          {
            yPercent: 0,
            duration: 1.08,
            ease: motionEases.enter,
          },
          "form+=1.02",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="contact-enquiry"
      ref={sectionRef}
      aria-labelledby="contact-page-title"
      className="scroll-mt-24 overflow-hidden bg-white text-brand-ink md:scroll-mt-28"
    >
      <div className="viewport-container">
        <div
          data-contact-statement-shell
          className="flex min-h-[92svh] flex-col justify-between py-[clamp(4rem,7vw,7rem)]"
        >
          <div className="flex flex-wrap justify-between gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-brand-ink/50">
            <p
              data-contact-statement-meta="left"
              className="will-change-[transform,clip-path,opacity]"
            >
              {content.enquiry.eyebrow}
            </p>
            <p
              data-contact-statement-meta="right"
              className="will-change-[transform,clip-path,opacity]"
            >
              {content.direct.location}
            </p>
          </div>

          <div className="mx-auto my-[clamp(4.5rem,8vw,8rem)] text-center">
            <h1
              id="contact-page-title"
              aria-label={content.enquiry.titleLines.join(" ")}
              className="mx-auto max-w-[12ch] text-[clamp(2.7rem,9.4vw,11rem)] font-medium leading-[0.84] tracking-[-0.068em]"
            >
              {content.enquiry.titleLines.map((line) => (
                <span
                  key={line}
                  aria-hidden="true"
                  className="block overflow-hidden pb-[0.055em]"
                >
                  <span
                    data-contact-statement-line
                    className="block whitespace-nowrap will-change-transform"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <div className="mt-[clamp(2.5rem,5vw,5rem)] overflow-hidden pb-[0.25em]">
              <a
                data-contact-email-reveal
                data-cursor=""
                href={`mailto:${content.direct.email}`}
                className="group inline-flex max-w-full items-end gap-2 whitespace-nowrap text-[clamp(1.15rem,calc(0.76rem+2.4vw),3.4rem)] font-medium leading-none tracking-[-0.045em] will-change-transform sm:gap-3"
              >
                <span>{content.direct.email}</span>
                <span
                  aria-hidden="true"
                  className="mb-[0.05em] shrink-0 text-[0.42em] transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="overflow-hidden pb-[0.08em] md:col-span-6">
              <p
                data-contact-statement-detail
                className="max-w-2xl text-[clamp(1.12rem,1.65vw,1.55rem)] leading-[1.28] tracking-[-0.025em] will-change-transform"
              >
                {content.enquiry.introduction}
              </p>
            </div>

            <div
              className="overflow-hidden pb-[0.08em] md:col-span-3 md:col-start-10 md:justify-self-end"
            >
              <div
                data-contact-statement-detail
                className="max-w-xs will-change-transform md:text-right"
              >
                <span className="mb-2 block text-[0.59rem] font-semibold uppercase tracking-[0.09em] text-brand-ink/42">
                  {content.direct.responseLabel}
                </span>
                <p className="text-sm font-medium leading-relaxed">
                  {content.direct.responseTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          data-contact-form-shell
          className="relative grid gap-12 pb-[clamp(3.5rem,5vw,5rem)] pt-[clamp(5rem,9vw,9rem)] md:grid-cols-12 md:items-stretch md:gap-x-6"
        >
          <span
            data-contact-form-rule
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-brand-ink/24 will-change-transform"
          />

          <div className="md:col-span-4 lg:col-span-3">
            <div className="overflow-hidden pb-[0.08em]">
              <p
                data-contact-form-meta
                className="text-[0.64rem] font-semibold uppercase tracking-[0.11em] text-brand-ink/52 will-change-transform"
              >
                {content.form.eyebrow}
              </p>
            </div>

            <figure
              className="mt-9 w-[52vw] max-w-[14rem] md:mt-[clamp(4rem,8vw,8rem)] md:w-full md:max-w-none"
            >
              <div
                data-contact-form-image-frame
                className="relative aspect-[3/4] overflow-hidden bg-surface"
              >
                <img
                  data-contact-form-image
                  src={content.form.image.src}
                  alt={content.form.image.alt}
                  width={960}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => ScrollTrigger.refresh()}
                  className="absolute inset-0 !h-full w-full object-cover object-[center_54%] will-change-[transform,filter]"
                />
                <span
                  data-contact-form-image-veil
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 bg-white will-change-opacity"
                />
              </div>
              <figcaption className="mt-2 overflow-hidden pb-[0.08em]">
                <span
                  data-contact-form-image-meta
                  className="flex justify-between gap-4 text-[0.58rem] font-semibold uppercase tracking-[0.07em] text-brand-ink/42 will-change-transform"
                >
                  <span>{content.form.image.caption}</span>
                  <span>01 / 01</span>
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5">
            <div className="mb-[clamp(3.5rem,6vw,6rem)] grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,21rem)] lg:items-end">
              <h2
                id="contact-form-heading"
                className="overflow-hidden pb-[0.06em] text-[clamp(2.9rem,5.8vw,6.7rem)] font-medium leading-[0.86] tracking-[-0.06em]"
              >
                <span
                  data-contact-form-heading-reveal
                  className="block will-change-transform"
                >
                  {content.form.title}
                </span>
              </h2>
              <div className="overflow-hidden pb-[0.08em] lg:justify-self-end">
                <p
                  data-contact-form-heading-reveal
                  className="max-w-md text-[clamp(0.98rem,1.18vw,1.15rem)] leading-[1.45] tracking-[-0.016em] text-brand-ink/62 will-change-transform"
                >
                  {content.form.introduction}
                </p>
              </div>
            </div>

            <ContactForm
              content={content.form}
              recipient={content.direct.email}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
