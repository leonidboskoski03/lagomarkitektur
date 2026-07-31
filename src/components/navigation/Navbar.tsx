import {motion} from "motion/react";
import {useCallback, useEffect, useRef, useState} from "react";
import gsap from "gsap";
import clsx from "clsx";
import {useGSAP} from "@gsap/react";
import {
    CONTACT_CONTENT_REVEAL_EVENT,
    NAVBAR_REVEAL_EVENT,
    WORK_CONTENT_REVEAL_EVENT,
    WORK_VIEW_MODE_CHANGE_EVENT,
    type WorkViewModeChangeEventDetail,
} from "../../lib/revealEvents";
import {motionEaseCurves, motionEases} from "../../lib/motion";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {MenuOverlay} from "./MenuOverlay";
import {LogoMark} from "../branding/LogoMark";
import {ClipMaskTextAnimation} from "../animation/ClipMaskTextAnimation";
import {ContactOverlay} from "../contact/ContactOverlay";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {WorkTransitionLink} from "../transition/WorkTransitionLink";
import {useWorkTransition} from "../transition/workTransitionContext";
import {ContactTransitionLink} from "../transition/ContactTransitionLink";
import {useContactTransition} from "../transition/contactTransitionContext";
import {useLanguage} from "../../i18n/LanguageContext";
import {siteCopy} from "../../i18n/siteCopy";

gsap.registerPlugin(ScrollTrigger);

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
    const {language} = useLanguage();
    const copy = siteCopy[language].navigation;
    const links = [
        {href: "/", label: copy.home},
        {href: "/work", label: copy.work},
        {href: "/about", label: copy.about},
        {href: "/contact", label: copy.contact},
    ];
    const {pathname, key: locationKey} = useLocation();
    const navigate = useNavigate();
    const {startWorkTransition} = useWorkTransition();
    const {startContactTransition} = useContactTransition();
    const usesProcessNavSequence = pathname === "/" || pathname === "/process";
    const usesLightPrimaryNav = pathname === "/work"
        || pathname === "/about"
        || pathname === "/studio"
        || pathname === "/om-oss"
        || pathname === "/contact"
        || pathname === "/kontakt";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const headerRef = useRef<HTMLElement | null>(null);
    const primaryNavContentRef = useRef<HTMLDivElement | null>(null);
    const logoMarkRef = useRef<HTMLAnchorElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const primaryMenuButtonRef = useRef<HTMLButtonElement | null>(null);
    const secondaryNavRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const contactButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);
    const handleMenuNavigate = useCallback((href: string) => {
        if (href === "/work") {
            startWorkTransition();
            return;
        }

        if (href === "/contact") {
            startContactTransition();
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
    }, [navigate, pathname, startContactTransition, startWorkTransition]);

    useEffect(() => {
        const pageLoader = pathname === "/"
            ? document.querySelector<HTMLElement>("[data-lagom-loader]")
            : pathname === "/about"
                ? document.querySelector<HTMLElement>("[data-studio-page-loader]")
                : null;
        const waitsForPageLoader = pageLoader
            ? window.getComputedStyle(pageLoader).display !== "none"
            : false;

        if (waitsForPageLoader || locationKey === "default") return;

        let restoreFrame = 0;
        const restoreNavbar = () => {
            const navItems = gsap.utils.toArray<HTMLElement>(
                "[data-navbar-item]",
                headerRef.current,
            );
            const animatedItems = [
                logoMarkRef.current,
                ...navItems,
                buttonRef.current,
                primaryMenuButtonRef.current,
            ].filter(Boolean);

            gsap.killTweensOf([primaryNavContentRef.current, ...animatedItems]);
            gsap.set(primaryNavContentRef.current, {
                clearProps: "transform",
                pointerEvents: "auto",
            });
            gsap.set(animatedItems, {clearProps: "transform"});
        };

        restoreNavbar();
        const commitFrame = window.requestAnimationFrame(() => {
            restoreFrame = window.requestAnimationFrame(restoreNavbar);
        });

        return () => {
            window.cancelAnimationFrame(commitFrame);
            window.cancelAnimationFrame(restoreFrame);
        };
    }, [locationKey, pathname]);

    useGSAP((_context, contextSafe) => {
        const navItems = gsap.utils.toArray<HTMLElement>(
            "[data-navbar-item]",
            headerRef.current,
        );
        const animatedItems = [
            logoMarkRef.current,
            ...navItems,
            buttonRef.current,
            primaryMenuButtonRef.current,
        ].filter(Boolean);
        const secondaryNavTargets = [secondaryNavRef.current].filter(Boolean);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let workViewSuppressesNavbar = false;

        if (!reduceMotion) {
            gsap.set(animatedItems, {clearProps: "transform"});
            gsap.set(animatedItems, {yPercent: 115});
        }
        gsap.set(secondaryNavTargets, {
            yPercent: -125,
            clipPath: "inset(0% 0% 100% 0%)",
            autoAlpha: 0,
            pointerEvents: "none",
        });

        const revealNavbar = contextSafe!(() => {
            if (workViewSuppressesNavbar) return;
            if (reduceMotion) return;

            const timeline = gsap.timeline({ defaults: { ease: motionEases.enter } })
                .addLabel("logo", 0)
                .addLabel("links", 0.08)
                .addLabel("action", 0.16);

            timeline.to(logoMarkRef.current, { yPercent: 0, duration: 0.62 }, "logo");
            timeline.to(navItems, {
                yPercent: 0,
                duration: 0.54,
                stagger: 0.035,
            }, "links");
            timeline.to(
                [buttonRef.current, primaryMenuButtonRef.current].filter(Boolean),
                { yPercent: 0, duration: 0.6 },
                "action",
            );
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
            if (workViewSuppressesNavbar) return;
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
            if (workViewSuppressesNavbar) return;
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

        const revealContactNavbar = contextSafe!(() => {
            gsap.killTweensOf([
                primaryNavContentRef.current,
                ...animatedItems,
                ...secondaryNavTargets,
            ]);
            gsap.set(primaryNavContentRef.current, {
                clearProps: "transform",
                pointerEvents: "auto",
            });
            gsap.set(animatedItems, {clearProps: "transform"});
            gsap.set(secondaryNavTargets, {
                yPercent: -125,
                clipPath: "inset(0% 0% 100% 0%)",
                autoAlpha: 0,
                pointerEvents: "none",
            });
        });

        const revealWorkNavbar = contextSafe!(() => {
            if (workViewSuppressesNavbar) return;
            const currentNavItems = gsap.utils.toArray<HTMLElement>(
                "[data-navbar-item]",
                headerRef.current,
            );
            const currentAnimatedItems = [
                logoMarkRef.current,
                ...currentNavItems,
                buttonRef.current,
                primaryMenuButtonRef.current,
            ].filter(Boolean);

            gsap.killTweensOf([primaryNavContentRef.current, ...currentAnimatedItems]);
            gsap.set(primaryNavContentRef.current, {
                clearProps: "transform",
                pointerEvents: "auto",
            });
            gsap.set(currentAnimatedItems, {clearProps: "transform"});
        });

        const syncWorkViewNavbar = contextSafe!((event: Event) => {
            const {mode} = (
                event as CustomEvent<WorkViewModeChangeEventDetail>
            ).detail;
            workViewSuppressesNavbar = mode !== "composition";

            if (workViewSuppressesNavbar) {
                hideNavbar();
                hideSecondaryNavbar();
                return;
            }

            if (window.scrollY < window.innerHeight * 0.12) {
                showNavbar();
                hideSecondaryNavbar();
                return;
            }

            hideNavbar();
            showSecondaryNavbar();
        });

        ScrollTrigger.create({
            start: () => window.innerHeight * 0.12,
            end: "max",
            invalidateOnRefresh: true,
            onEnter: hideNavbar,
            onLeaveBack: showNavbar,
        });

        ScrollTrigger.create({
            start: () => window.innerHeight * 0.92,
            end: "max",
            invalidateOnRefresh: true,
            onEnter: showSecondaryNavbar,
            onLeaveBack: hideSecondaryNavbar,
        });

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

        const loader = pathname === "/"
            ? document.querySelector<HTMLElement>("[data-lagom-loader]")
            : pathname === "/about"
                ? document.querySelector<HTMLElement>("[data-studio-page-loader]")
                : null;
        const loaderIsHidden = !loader || window.getComputedStyle(loader).display === "none";

        window.addEventListener(NAVBAR_REVEAL_EVENT, revealNavbar);
        window.addEventListener(CONTACT_CONTENT_REVEAL_EVENT, revealContactNavbar);
        window.addEventListener(WORK_CONTENT_REVEAL_EVENT, revealWorkNavbar);
        window.addEventListener(WORK_VIEW_MODE_CHANGE_EVENT, syncWorkViewNavbar);
        if (loaderIsHidden) revealNavbar();

        return () => {
            window.removeEventListener(NAVBAR_REVEAL_EVENT, revealNavbar);
            window.removeEventListener(WORK_CONTENT_REVEAL_EVENT, revealWorkNavbar);
            window.removeEventListener(
                WORK_VIEW_MODE_CHANGE_EVENT,
                syncWorkViewNavbar,
            );
            window.removeEventListener(
                CONTACT_CONTENT_REVEAL_EVENT,
                revealContactNavbar,
            );
        };
    }, { scope: headerRef, dependencies: [language, pathname], revertOnUpdate: true });

    return (
      <>
        <header
          ref={headerRef}
          className="fixed inset-x-0 top-8 z-[100] h-10 overflow-hidden md:top-10"
        >
          <div
            ref={primaryNavContentRef}
            className="viewport-container grid h-full grid-cols-[1fr_auto_1fr] items-center will-change-transform"
          >
            <div
                className={clsx(
                    "col-start-1 row-start-1 justify-self-start overflow-hidden",
                    usesLightPrimaryNav ? "text-brand-ink" : "text-white",
                )}
            >
                <Link
                    ref={logoMarkRef}
                    to="/"
                    data-cursor=""
                    aria-label={copy.homeLabel}
                    onMouseEnter={handleMouseEnter}
                    className="flex h-10 items-center gap-2.5 will-change-transform"
                >
                    <LogoMark animatedParts className="h-8 w-auto shrink-0" />
                    <span
                        aria-hidden="true"
                        className="flex flex-col justify-center text-[0.68rem] font-semibold uppercase leading-[0.9] tracking-[0.055em]"
                    >
                        <span>Lagom</span>
                        <span>Arkitektur</span>
                    </span>
                </Link>
            </div>

            <nav
                className={clsx(
                    "col-start-2 row-start-1 hidden gap-4 justify-self-center md:flex",
                    usesLightPrimaryNav ? "text-brand-ink" : "text-white",
                )}
            >
                {links.map((link) => {
                    const content = (
                        <div
                            data-navbar-item
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
                    ) : link.href === "/contact" ? (
                        <ContactTransitionLink
                            key={link.href}
                            className="overflow-hidden"
                            data-cursor=""
                        >
                            {content}
                        </ContactTransitionLink>
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

            <div className="col-start-3 row-start-1 hidden justify-self-end overflow-hidden rounded-lg md:block">
                <div ref={buttonRef} className="will-change-transform">
                    <GetInTouchButton label={copy.getInTouch} variant={usesLightPrimaryNav ? "dark" : "light"} onClick={(event) => {
                        contactButtonRef.current = event.currentTarget;
                        setIsContactOpen(true);
                    }} />
                </div>
            </div>

            <button
                ref={primaryMenuButtonRef}
                type="button"
                onClick={(event) => {
                    menuButtonRef.current = event.currentTarget;
                    setIsMenuOpen(true);
                }}
                className="col-start-3 row-start-1 h-10 justify-self-end rounded-lg bg-[#f4f1ea] px-4 text-sm font-medium leading-none text-black will-change-transform md:hidden"
                data-navbar-mobile-menu
                aria-label={copy.openMenu}
                aria-expanded={isMenuOpen}
                aria-controls="site-menu"
            >
                {copy.menu}
            </button>
          </div>
        </header>
        <div
            ref={secondaryNavRef}
            className={clsx(
                "fixed top-8 right-[var(--spacing-viewport-gutter)] z-[100] flex items-center gap-2 will-change-[transform,clip-path,opacity] md:top-10",
            )}
            role="navigation"
            aria-label={copy.secondaryNavigation}
        >
            <div>
                <GetInTouchButton label={copy.getInTouch} variant="dark" onClick={(event) => {
                    contactButtonRef.current = event.currentTarget;
                    setIsContactOpen(true);
                }} />
            </div>
            <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="h-10 rounded-lg bg-[#f4f1ea] px-4 text-sm font-medium leading-none text-black"
                aria-label={copy.openMenu}
                aria-expanded={isMenuOpen}
                aria-controls="site-menu"
            >
                <ClipMaskTextAnimation text={copy.menu} className="text-sm font-medium" />
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
    label,
    variant = "light",
    onClick,
}: {
    label: string;
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
                "flex h-10 items-center gap-2 rounded-lg px-4 font-medium",
                isDark ? "bg-black text-white" : "bg-white text-black"
            )}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <div className="relative overflow-hidden text-sm uppercase leading-none">
                <motion.div
                    className="relative"
                    animate={hovered ? {y: "-100%"} : {y: "0%"}}
                    transition={{duration: 0.3, ease: motionEaseCurves.settle}}
                >
                    <div>{label}</div>
                    <div className="absolute top-full left-0 w-full">{label}</div>
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

