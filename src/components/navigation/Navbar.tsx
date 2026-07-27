import {motion} from "motion/react";
import {useCallback, useRef, useState} from "react";
import gsap from "gsap";
import clsx from "clsx";
import {useGSAP} from "@gsap/react";
import {NAVBAR_REVEAL_EVENT} from "../../lib/revealEvents";
import {motionEaseCurves, motionEases} from "../../lib/motion";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {MenuOverlay} from "./MenuOverlay";
import {LogoMark} from "../branding/LogoMark";
import {ClipMaskTextAnimation} from "../animation/ClipMaskTextAnimation";
import {ContactOverlay} from "../contact/ContactOverlay";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {WorkTransitionLink} from "../transition/WorkTransitionLink";
import {useWorkTransition} from "../transition/workTransitionContext";

gsap.registerPlugin(ScrollTrigger);

const links = [
    {href: "/", label: "Home"},
    {href: "/work", label: "Work"},
    {href: "/studio", label: "About"},
    {href: "/contact", label: "Contact"},
];

const charVariants = {
    initial: {y: 0},
    hover: {y: "-100%"},
};

const handleMouseEnter = () => {
    gsap.fromTo(
        "#logo-left",
        {y: -5, opacity: 0},
        {y: 0, opacity: 1, duration: 0.2, ease: motionEases.settle}
    );
    gsap.fromTo(
        "#logo-stem",
        {y: -5, opacity: 0},
        {y: 0, opacity: 1, duration: 0.2, delay: 0.1, ease: motionEases.settle}
    );
    gsap.fromTo(
        "#logo-top",
        {x: 5, opacity: 0},
        {x: 0, opacity: 1, duration: 0.2, delay: 0.2, ease: motionEases.settle}
    );
    gsap.fromTo(
        "#logo-bottom",
        {x: 5, opacity: 0},
        {x: 0, opacity: 1, duration: 0.2, delay: 0.3, ease: motionEases.settle}
    );
};

export function Navbar() {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const {startWorkTransition} = useWorkTransition();
    const hidePrimaryNav = pathname === "/work";
    const usesProcessNavSequence = pathname === "/" || pathname === "/process";
    const usesLightPrimaryNav = pathname === "/studio"
        || pathname === "/om-oss"
        || pathname === "/contact"
        || pathname === "/kontakt";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const headerRef = useRef<HTMLElement | null>(null);
    const primaryNavContentRef = useRef<HTMLDivElement | null>(null);
    const logoMarkRef = useRef<HTMLDivElement | null>(null);
    const logoTextRef = useRef<HTMLDivElement | null>(null);
    const navItemRefs = useRef<Array<HTMLDivElement | null>>([]);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const secondaryNavRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const contactButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);
    const handleMenuNavigate = useCallback((href: string) => {
        if (href === "/work") {
            startWorkTransition();
            return;
        }

        if (href === pathname) {
            window.scrollTo({top: 0, left: 0, behavior: "auto"});
            return;
        }

        navigate(href);
        window.requestAnimationFrame(() => {
            window.scrollTo({top: 0, left: 0, behavior: "auto"});
        });
    }, [navigate, pathname, startWorkTransition]);

    useGSAP((_context, contextSafe) => {
        const navItems = navItemRefs.current.filter(Boolean);
        const animatedItems = [logoMarkRef.current, logoTextRef.current, ...navItems, buttonRef.current].filter(Boolean);
        const workLogo = hidePrimaryNav
            ? document.querySelector<HTMLElement>("[data-work-logo]")
            : null;
        const secondaryNavTargets = [secondaryNavRef.current, workLogo].filter(Boolean);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduceMotion) gsap.set(animatedItems, { yPercent: 115 });
        gsap.set(secondaryNavTargets, hidePrimaryNav
            ? {
                yPercent: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                autoAlpha: 1,
                pointerEvents: "auto",
            }
            : {
                yPercent: -125,
                clipPath: "inset(0% 0% 100% 0%)",
                autoAlpha: 0,
                pointerEvents: "none",
            });

        const revealNavbar = contextSafe!(() => {
            if (reduceMotion) return;

            const timeline = gsap.timeline({ defaults: { ease: motionEases.enter } })
                .addLabel("logo", 0)
                .addLabel("links", 0.08)
                .addLabel("action", 0.16);

            timeline.to(logoMarkRef.current, { yPercent: 0, duration: 0.62 }, "logo");
            timeline.to(logoTextRef.current, { yPercent: 0, duration: 0.58 }, "logo+=0.035");
            timeline.to(navItems, {
                yPercent: 0,
                duration: 0.54,
                stagger: 0.035,
            }, "links");
            timeline.to(buttonRef.current, { yPercent: 0, duration: 0.6 }, "action");
        });

        const hideNavbar = contextSafe!(() => {
            gsap.to(primaryNavContentRef.current, {
                yPercent: -115,
                duration: reduceMotion ? 0 : 0.72,
                ease: motionEases.depart,
                overwrite: "auto",
                onStart: () => {
                    if (headerRef.current) headerRef.current.style.pointerEvents = "none";
                },
            });
        });

        const showNavbar = contextSafe!(() => {
            gsap.to(primaryNavContentRef.current, {
                yPercent: 0,
                duration: reduceMotion ? 0 : 0.64,
                ease: motionEases.enter,
                overwrite: "auto",
                onStart: () => {
                    if (headerRef.current) headerRef.current.style.pointerEvents = "auto";
                },
            });
        });

        const showSecondaryNavbar = contextSafe!(() => {
            gsap.to(secondaryNavTargets, {
                yPercent: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: reduceMotion ? 0 : 0.72,
                ease: motionEases.enter,
                overwrite: "auto",
            });
        });

        const hideSecondaryNavbar = contextSafe!(() => {
            gsap.to(secondaryNavTargets, {
                yPercent: -125,
                clipPath: "inset(0% 0% 100% 0%)",
                autoAlpha: 0,
                pointerEvents: "none",
                duration: reduceMotion ? 0 : 0.62,
                ease: motionEases.depart,
                overwrite: "auto",
            });
        });

        ScrollTrigger.create({
            start: () => window.innerHeight * 0.12,
            end: "max",
            invalidateOnRefresh: true,
            onEnter: hideNavbar,
            onLeaveBack: showNavbar,
        });

        if (hidePrimaryNav) {
            const workProjects = document.querySelector<HTMLElement>("[data-work-projects]");

            if (workProjects) {
                ScrollTrigger.create({
                    trigger: workProjects,
                    start: "top 12%",
                    end: "max",
                    invalidateOnRefresh: true,
                    onEnter: hideSecondaryNavbar,
                    onLeaveBack: showSecondaryNavbar,
                });
            }
        } else {
            ScrollTrigger.create({
                start: () => window.innerHeight * 0.92,
                end: "max",
                invalidateOnRefresh: true,
                onEnter: showSecondaryNavbar,
                onLeaveBack: hideSecondaryNavbar,
            });
        }

        if (usesProcessNavSequence) {
            const projectSection = document.querySelector("[data-project-section]");

            if (projectSection) {
                ScrollTrigger.create({
                    trigger: projectSection,
                    start: "top 30%",
                    end: "bottom top",
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        hideNavbar();
                        hideSecondaryNavbar();
                    },
                    onLeaveBack: showSecondaryNavbar,
                });
            }

            const servicesSection = document.querySelector("[data-services-section]");

            if (servicesSection) {
                ScrollTrigger.create({
                    trigger: servicesSection,
                    start: "top top",
                    end: "max",
                    invalidateOnRefresh: true,
                    onEnter: showSecondaryNavbar,
                    onLeaveBack: hideSecondaryNavbar,
                });
            }

            const processSequence = document.querySelector("[data-process-sequence]");

            if (processSequence) {
                ScrollTrigger.create({
                    trigger: processSequence,
                    start: "top 12%",
                    end: "max",
                    invalidateOnRefresh: true,
                    onEnter: hideSecondaryNavbar,
                    onLeaveBack: showSecondaryNavbar,
                });
            }

            const footer = document.querySelector("[data-site-footer]");

            if (footer) {
                ScrollTrigger.create({
                    trigger: footer,
                    start: "top 12%",
                    end: "max",
                    invalidateOnRefresh: true,
                    onEnter: showSecondaryNavbar,
                    onLeaveBack: hideSecondaryNavbar,
                });
            }
        }

        const loader = document.querySelector<HTMLElement>("[data-lagom-loader]");
        const loaderIsHidden = !loader || window.getComputedStyle(loader).display === "none";

        if (loaderIsHidden) revealNavbar();
        else window.addEventListener(NAVBAR_REVEAL_EVENT, revealNavbar, { once: true });

        return () => window.removeEventListener(NAVBAR_REVEAL_EVENT, revealNavbar);
    }, { scope: headerRef, dependencies: [pathname], revertOnUpdate: true });

    return (
      <>
        <header
          ref={headerRef}
          className={clsx(
            "fixed top-0 z-[100] h-[15vh] w-full overflow-hidden",
            hidePrimaryNav && "hidden",
          )}
          aria-hidden={hidePrimaryNav || undefined}
        >
          <div ref={primaryNavContentRef} className="viewport-container flex h-full items-center justify-between will-change-transform">
            <div
                className={clsx(
                    "flex items-start justify-center gap-2",
                    usesLightPrimaryNav ? "text-brand-ink" : "text-white",
                )}
            >
                <div className="overflow-hidden">
                    <div ref={logoMarkRef} className="will-change-transform">
                        <LogoMark onMouseEnter={handleMouseEnter} animatedParts />
                    </div>
                </div>
                <div className="self-center overflow-hidden">
                    <div ref={logoTextRef} className="will-change-transform">
                        <ClipMaskTextAnimation text="lagom" className="logo-text text-2xl uppercase font-bold" handleMouseEnter={handleMouseEnter} />
                    </div>
                </div>
            </div>

            <nav
                className={clsx(
                    "hidden gap-4 md:flex",
                    usesLightPrimaryNav ? "text-brand-ink" : "text-white",
                )}
            >
                {links.map((link, index) => {
                    const content = (
                        <div
                            ref={(element) => { navItemRefs.current[index] = element; }}
                            className="will-change-transform"
                        >
                            <ClipMaskTextAnimation text={link.label} className="text-sm font-[600]" />
                        </div>
                    );

                    return link.href === "/work" ? (
                        <WorkTransitionLink
                            key={link.href}
                            className="overflow-hidden"
                            data-cursor=""
                        >
                            {content}
                        </WorkTransitionLink>
                    ) : (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="overflow-hidden"
                            data-cursor=""
                        >
                            {content}
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden overflow-hidden rounded-4xl md:block">
                <div ref={buttonRef} className="will-change-transform">
                    <GetInTouchButton variant={usesLightPrimaryNav ? "dark" : "light"} onClick={(event) => {
                        contactButtonRef.current = event.currentTarget;
                        setIsContactOpen(true);
                    }} />
                </div>
            </div>

            <button
                type="button"
                onClick={(event) => {
                    menuButtonRef.current = event.currentTarget;
                    setIsMenuOpen(true);
                }}
                className="rounded-full bg-[#f4f1ea] px-5 py-4 text-sm font-medium text-black md:hidden"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-controls="site-menu"
            >
                Menu
            </button>
          </div>
        </header>
        <div
            ref={secondaryNavRef}
            className={clsx(
                "fixed top-5 right-[var(--spacing-viewport-gutter)] z-[100] flex items-center gap-1 p-2 will-change-[transform,clip-path,opacity]",
            )}
            role="navigation"
            aria-label="Secondary navigation"
        >
            <div className={clsx(hidePrimaryNav && "hidden sm:block")}>
                <GetInTouchButton variant="dark" onClick={(event) => {
                    contactButtonRef.current = event.currentTarget;
                    setIsContactOpen(true);
                }} />
            </div>
            <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="rounded-full bg-[#f4f1ea] px-5 py-4 text-black"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-controls="site-menu"
            >
                <ClipMaskTextAnimation text="Menu" className="text-sm font-medium" />
            </button>
        </div>
        <MenuOverlay
            isOpen={isMenuOpen}
            onClose={closeMenu}
            onNavigate={handleMenuNavigate}
            triggerRef={menuButtonRef}
        />
        <ContactOverlay
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            triggerRef={contactButtonRef}
        />
      </>
    );
}

function GetInTouchButton({
    variant = "light",
    onClick,
}: {
    variant?: "light" | "dark";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const isDark = variant === "dark";

    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={clsx(
                "rounded-full p-4 flex gap-2 items-center",
                isDark ? "bg-black text-white" : "bg-white text-black"
            )}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <div className="relative overflow-hidden text-sm  uppercase leading-none">
                <motion.div
                    className="relative"
                    animate={hovered ? {y: "-100%"} : {y: "0%"}}
                    transition={{duration: 0.3, ease: motionEaseCurves.settle}}
                >
                    <div>Get in touch</div>
                    <div className="absolute top-full left-0 w-full">Get in touch</div>
                </motion.div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <motion.circle
                    cx="8"
                    cy="8"
                    r="4"
                    stroke={isDark ? "white" : "black"}
                    strokeWidth={1.5}
                    initial={false}
                    animate={hovered
                        ? {scale: 0.63, fill: isDark ? "white" : "black"}
                        : {scale: 0.85, fill: "none"}}
                    transition={{duration: 0.5, ease: motionEaseCurves.settle}}
                />
            </svg>
        </motion.button>
    );
}

export function SplitText({text}: { text: string }) {
    const chars = text.split("");

    return (
        <>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    variants={charVariants}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </>
    );
}

