import { useRef } from "react";
import { footerContent, type FooterContent, type FooterLinkItem } from "../../data/footer";
import { cn } from "../../lib/utils";
import { FooterBackToTop } from "./footer/FooterBackToTop";
import { FooterColumn } from "./footer/FooterColumn";
import { FooterLink } from "./footer/FooterLink";
import { FooterMotionMask } from "./footer/FooterMotionMask";
import { FooterWordmark } from "./footer/FooterWordmark";
import { useFooterMotion } from "./footer/useFooterMotion";

interface FooterProps {
  content?: FooterContent;
  className?: string;
  showEnquiry?: boolean;
  showStudioInformation?: boolean;
  showCompactNavigation?: boolean;
}

export function Footer({
  content = footerContent,
  className,
  showEnquiry = true,
  showStudioInformation = true,
  showCompactNavigation = false,
}: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const currentYear = new Date().getFullYear();
  const emailLink: FooterLinkItem = {
    label: content.studio.email,
    href: `mailto:${content.studio.email}`,
  };

  useFooterMotion(footerRef);

  return (
    <footer
      ref={footerRef}
      data-site-footer
      className={cn(
        "relative z-10 overflow-hidden bg-white text-brand-ink",
        className,
      )}
      aria-labelledby={showEnquiry ? "footer-heading" : undefined}
      aria-label={showEnquiry ? undefined : "Lagom Arkitektur footer"}
    >
      <div className="w-full px-[var(--spacing-viewport-gutter)]">
        {showEnquiry ? (
          <section
            data-footer-section
            className="pt-[clamp(5rem,8vw,8rem)]"
            aria-label="Project enquiries"
          >
            <div className="grid grid-cols-1 gap-10 pb-[clamp(4.5rem,7vw,7.5rem)] md:grid-cols-12 md:gap-x-6">
              <FooterMotionMask kind="eyebrow" className="md:col-span-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]">
                  {content.enquiry.eyebrow}
                </p>
              </FooterMotionMask>

              <div className="md:col-span-9 md:col-start-4 md:justify-self-end md:text-right">
                <FooterMotionMask kind="display">
                  <h2
                    id="footer-heading"
                    className="ml-auto max-w-[16ch] text-balance text-[clamp(2.5rem,5.9vw,7.2rem)] font-medium leading-[0.9] tracking-[-0.065em]"
                  >
                    {content.enquiry.title}
                  </h2>
                </FooterMotionMask>
                <FooterMotionMask kind="action" className="mt-8 md:mt-12">
                  <FooterLink
                    item={content.enquiry.link}
                    showArrow
                    variant="menu-utility"
                    className="text-sm font-semibold uppercase tracking-[0.04em]"
                  />
                </FooterMotionMask>
              </div>
            </div>
          </section>
        ) : null}

        {showStudioInformation ? (
          <section
            data-footer-section
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-12 pb-[clamp(4rem,5.5vw,6rem)] md:grid-cols-12",
              !showEnquiry && "pt-[clamp(5rem,8vw,8rem)]",
            )}
            aria-label="Studio information"
          >
            <FooterColumn label="Studio" className="col-span-2 md:col-span-4">
              <p className="max-w-[29rem] text-[clamp(1.1rem,1.55vw,1.55rem)] leading-[1.18] tracking-[-0.025em]">
                {content.studio.description}
              </p>
              <p className="mt-7 max-w-[28rem] text-xs font-medium uppercase leading-relaxed tracking-[0.035em] opacity-55">
                {content.studio.disciplines}
              </p>
            </FooterColumn>

            <FooterColumn label="Navigate" className="md:col-span-2 md:col-start-6">
              <nav aria-label="Footer navigation">
                <ul className="space-y-0.5 text-sm font-medium">
                  {content.navigation.map((item) => (
                    <li key={item.href}>
                      <FooterLink item={item} variant="menu-utility" />
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterColumn>

            <FooterColumn label="Follow" className="md:col-span-2 md:col-start-8">
              <ul className="space-y-0.5 text-sm font-medium">
                {content.social.map((item) => (
                  <li key={item.href}>
                    <FooterLink item={item} showArrow variant="menu-utility" />
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn
              label="Find us"
              className="col-span-2 md:col-span-3 md:col-start-10 md:text-right"
            >
              <address className="space-y-1 text-sm font-medium not-italic md:flex md:flex-col md:items-end">
                <p>{content.studio.location}</p>
                <FooterLink item={emailLink} className="break-all" />
              </address>
            </FooterColumn>
          </section>
        ) : null}

        {showCompactNavigation ? (
          <section
            data-footer-section
            className="grid grid-cols-2 gap-x-6 gap-y-12 pb-[clamp(4rem,6vw,6.5rem)] pt-[clamp(3.5rem,5vw,5rem)] md:grid-cols-12"
            aria-label="Footer navigation"
          >
            <FooterColumn
              label="Navigate"
              className="col-span-2 md:col-span-3"
            >
              <nav aria-label="Footer navigation">
                <ul className="grid grid-cols-2 gap-x-5 gap-y-0.5 text-sm font-medium">
                  {content.navigation.map((item) => (
                    <li key={item.href}>
                      <FooterLink item={item} variant="menu-utility" />
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterColumn>

            <FooterColumn
              label="Follow"
              className="md:col-span-2 md:col-start-6"
            >
              <ul className="space-y-0.5 text-sm font-medium">
                {content.social.map((item) => (
                  <li key={item.href}>
                    <FooterLink item={item} showArrow variant="menu-utility" />
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn
              label="Direct"
              className="col-span-2 md:col-span-3 md:col-start-8"
            >
              <FooterLink
                item={emailLink}
                className="break-all text-sm font-medium"
              />
            </FooterColumn>

            <FooterColumn
              label="Studio"
              className="col-span-2 md:col-span-2 md:col-start-11 md:text-right"
            >
              <p className="text-sm font-medium">{content.studio.location}</p>
            </FooterColumn>
          </section>
        ) : null}

        <div
          className={cn(
            !showEnquiry
              && !showStudioInformation
              && !showCompactNavigation
              && "pt-[clamp(5rem,8vw,8rem)]",
          )}
        >
          <FooterWordmark />
        </div>

        <section
          data-footer-utility-section
          className="pb-[clamp(1.25rem,2vw,2rem)]"
          aria-label="Legal and utilities"
        >
          <div
            data-footer-utility-content
            className="grid grid-cols-2 gap-x-6 gap-y-4 pt-[clamp(0.25rem,0.45vw,0.45rem)] text-[0.64rem] font-semibold uppercase tracking-[0.055em] md:grid-cols-4"
          >
            <FooterMotionMask kind="utility">
              <p>© {currentYear} {content.studio.name}</p>
            </FooterMotionMask>
            <FooterMotionMask kind="utility" className="md:text-center">
              <p>{content.studio.location}</p>
            </FooterMotionMask>
            <FooterMotionMask kind="utility" className="md:text-center">
              <div>
                {content.legal.map((item) => (
                  <FooterLink key={item.href} item={item} />
                ))}
              </div>
            </FooterMotionMask>
            <FooterMotionMask kind="utility" className="justify-self-end">
              <FooterBackToTop />
            </FooterMotionMask>
          </div>
        </section>
      </div>
    </footer>
  );
}
