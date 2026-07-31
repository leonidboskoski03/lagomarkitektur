import {
  useRef,
  useState,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ContactPageContent } from "../../data/contact";
import { motionEases } from "../../lib/motion";
import { requestSmoothScroll } from "../../lib/smoothScroll";
import { ClipMaskTextAnimation } from "../animation/ClipMaskTextAnimation";
import { CONTACT_CONTENT_REVEAL_EVENT } from "../../lib/revealEvents";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ContactHeroProps {
  content: ContactPageContent;
}

interface DirectoryItemProps {
  label: string;
  children: ReactNode;
  className?: string;
}

interface ContactDirectoryLinkProps {
  href: string;
  text: string;
  className?: string;
  target?: "_blank";
  rel?: string;
  trailing?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function ContactHero({ content }: ContactHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const image = imageRef.current;
      const veil = section?.querySelector<HTMLElement>(
        "[data-contact-hero-veil]",
      );
      const leftMeta = gsap.utils.toArray<HTMLElement>(
        '[data-contact-hero-edge="left"]',
        section ?? undefined,
      );
      const rightMeta = gsap.utils.toArray<HTMLElement>(
        '[data-contact-hero-edge="right"]',
        section ?? undefined,
      );
      const directoryItems = gsap.utils.toArray<HTMLElement>(
        "[data-contact-directory-item]",
        section ?? undefined,
      );

      if (!section || !frame || !image || !veil) return;

      const matchMedia = gsap.matchMedia();

      matchMedia.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(frame, { "--contact-aperture": "0%" });
            gsap.set(image, { scale: 1, yPercent: 0 });
            gsap.set(veil, {
              autoAlpha: 0,
              backdropFilter: "brightness(1)",
              backgroundColor: "rgba(4, 13, 18, 0)",
            });
            gsap.set([...leftMeta, ...rightMeta, ...directoryItems], {
              clearProps: "all",
            });
            return;
          }

          const contactTransitionIsActive =
            document.documentElement.dataset.contactTransition === "true";

          gsap.set(leftMeta, {
            autoAlpha: 0,
            clipPath: "inset(0% 100% 0% 0%)",
            x: -24,
          });
          gsap.set(rightMeta, {
            autoAlpha: 0,
            clipPath: "inset(0% 0% 0% 100%)",
            x: 24,
          });
          gsap.set(frame, {
            "--contact-aperture": "20%",
          });
          gsap.set(veil, {
            autoAlpha: 1,
            backdropFilter: "brightness(0.72)",
            backgroundColor: "rgba(4, 13, 18, 0.055)",
          });
          gsap.set(image, {
            scale: 1.065,
            yPercent: 0,
            transformOrigin: "center center",
          });
          gsap.set(directoryItems, {
            yPercent: 112,
          });

          const introTimeline = gsap
            .timeline({
              paused: contactTransitionIsActive,
              defaults: {
                overwrite: "auto",
              },
            })
            .addLabel("construct", 0)
            .to(
              [...leftMeta.slice(0, 1), ...rightMeta.slice(0, 1)],
              {
                autoAlpha: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                x: 0,
                duration: 1.05,
                stagger: 0.08,
                ease: motionEases.cinematic,
              },
              "construct+=0.08",
            )
            .to(
              frame,
              {
                "--contact-aperture": "0%",
                duration: 1.55,
                ease: motionEases.cinematic,
              },
              "construct+=0.28",
            )
            .to(
              veil,
              {
                backdropFilter: "brightness(1)",
                backgroundColor: "rgba(4, 13, 18, 0)",
                autoAlpha: 0,
                duration: 1.55,
                ease: motionEases.cinematic,
              },
              "construct+=0.28",
            )
            .to(
              image,
              {
                scale: 1,
                duration: 1.65,
                ease: motionEases.settle,
              },
              "construct+=0.28",
            )
            .to(
              [...leftMeta.slice(1), ...rightMeta.slice(1)],
              {
                autoAlpha: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                x: 0,
                duration: 1.08,
                stagger: 0.08,
                ease: motionEases.cinematic,
              },
              "construct+=0.62",
            )
            .to(
              directoryItems,
              {
                yPercent: 0,
                duration: 1.08,
                stagger: 0.09,
                ease: motionEases.enter,
              },
              ">+=0.08",
            );

          const revealContactContent = () => introTimeline.play(0);

          if (contactTransitionIsActive) {
            window.addEventListener(
              CONTACT_CONTENT_REVEAL_EVENT,
              revealContactContent,
              { once: true },
            );
          }

          if (desktop) {
            gsap.to(image, {
              yPercent: -2.5,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top 84%",
                end: "bottom top",
                scrub: 1.05,
                invalidateOnRefresh: true,
              },
            });
          }

          return () => {
            window.removeEventListener(
              CONTACT_CONTENT_REVEAL_EVENT,
              revealContactContent,
            );
          };
        },
      );

      return () => matchMedia.revert();
    },
    { scope: sectionRef },
  );

  const handleEnquiryClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (
      event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    const target = document.getElementById("contact-enquiry");
    if (!target) return;

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    requestSmoothScroll({
      target,
      immediate: reduceMotion,
    });

    window.history.replaceState(
      window.history.state,
      "",
      "#contact-enquiry",
    );
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Lagom Arkitektur contact directory"
      className="bg-white pb-[clamp(5rem,9vw,9rem)] pt-[15vh] text-brand-ink"
    >
      <div className="viewport-container">
        <div className="mb-[clamp(1.5rem,2.5vw,2.5rem)] flex items-center justify-between gap-6 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-brand-ink/52">
          <p
            data-contact-hero-edge="left"
            className="will-change-[transform,clip-path,opacity]"
          >
            {content.hero.eyebrow}
          </p>
          <p
            data-contact-hero-edge="right"
            className="text-right will-change-[transform,clip-path,opacity]"
          >
            Malmö, Sweden
          </p>
        </div>

        <figure>
          <div
            ref={frameRef}
            data-contact-hero-frame
            className="relative h-[clamp(17rem,54svh,42rem)] overflow-hidden bg-surface will-change-[clip-path]"
          >
            <img
              ref={imageRef}
              data-contact-hero-image
              src={content.hero.image.src}
              alt={content.hero.image.alt}
              width={1800}
              height={1013}
              fetchPriority="high"
              decoding="async"
              onLoad={() => ScrollTrigger.refresh()}
              className="absolute inset-x-0 -top-[8%] !h-[116%] w-full object-cover object-[center_48%] will-change-transform"
            />
            <span
              data-contact-hero-veil
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 will-change-[opacity,backdrop-filter]"
            />
          </div>

          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-[0.6rem] font-semibold uppercase tracking-[0.075em] text-brand-ink/46">
            <span
              data-contact-hero-edge="left"
              className="will-change-[transform,clip-path,opacity]"
            >
              {content.hero.image.caption}
            </span>
            <span
              data-contact-hero-edge="right"
              className="will-change-[transform,clip-path,opacity]"
            >
              55.6050° N / 13.0038° E
            </span>
          </figcaption>
        </figure>

        <div className="mt-[clamp(2.25rem,3.2vw,3.5rem)] grid grid-cols-2 items-start gap-x-5 gap-y-7 sm:gap-x-8 md:gap-x-12 md:gap-y-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          <DirectoryItem
            label={content.direct.locationLabel}
            className="lg:col-span-3"
          >
            {content.direct.location}
          </DirectoryItem>

          <DirectoryItem
            label={content.direct.label}
            className="col-span-2 min-[400px]:col-span-1 lg:col-span-3"
          >
            <ContactDirectoryLink
              href={`mailto:${content.direct.email}`}
              text={content.direct.email}
              className="break-all"
            />
          </DirectoryItem>

          <DirectoryItem
            label={content.social.label}
            className="lg:col-span-2"
          >
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {content.social.links.map((link) => (
                <li key={link.href}>
                  <ContactDirectoryLink
                    href={link.href}
                    text={link.label}
                    target="_blank"
                    rel="noreferrer"
                  />
                </li>
              ))}
            </ul>
          </DirectoryItem>

          <DirectoryItem
            label={content.direct.responseLabel}
            className="lg:col-span-2"
          >
            {content.direct.responseTime}
          </DirectoryItem>

          <div className="col-span-2 overflow-hidden pb-[0.08em] lg:col-span-2">
            <div
              data-contact-directory-item
              className="flex h-full items-start will-change-transform lg:justify-end lg:pt-[1.2rem]"
            >
              <ContactDirectoryLink
                href="#contact-enquiry"
                text={content.hero.scrollLabel}
                onClick={handleEnquiryClick}
                className="text-[0.64rem] font-semibold uppercase tracking-[0.08em]"
                trailing={
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover/action:translate-y-1"
                  >
                    ↓
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectoryItem({ label, children, className }: DirectoryItemProps) {
  return (
    <div
      className={`min-w-0 overflow-hidden pb-[0.08em] ${className ?? ""}`}
    >
      <div
        data-contact-directory-item
        className="text-[clamp(0.94rem,1.08vw,1.08rem)] font-medium leading-[1.35] tracking-[-0.015em] will-change-transform"
      >
        <span className="mb-2.5 block text-[0.59rem] font-semibold uppercase tracking-[0.09em] text-brand-ink/43">
          {label}
        </span>
        <div>{children}</div>
      </div>
    </div>
  );
}

function ContactDirectoryLink({
  href,
  text,
  className = "",
  target,
  rel,
  trailing,
  onClick,
}: ContactDirectoryLinkProps) {
  const [active, setActive] = useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      data-cursor=""
      data-contact-directory-link
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={`group/action inline-flex transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:translate-x-1 focus-visible:translate-x-1 ${className}`}
    >
      <span className="relative -mx-2 block overflow-hidden bg-white px-2 py-1">
        <span
          data-contact-directory-surface
          aria-hidden="true"
          className={`absolute inset-0 bg-brand-ink transition-transform duration-600 ease-[cubic-bezier(.65,0,.35,1)] ${
            active ? "translate-y-0" : "translate-y-full"
          }`}
        />
        <span
          className={`relative z-10 flex items-center gap-2 transition-colors duration-500 ${
            active ? "text-white" : "text-brand-ink"
          }`}
        >
          <ClipMaskTextAnimation
            text={text}
            controlled
            active={active}
            uppercase={false}
          />
          {trailing}
        </span>
      </span>
    </a>
  );
}
