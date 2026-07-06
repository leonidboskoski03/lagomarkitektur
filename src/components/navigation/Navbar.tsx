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

gsap.registerPlugin(ScrollTrigger);

const links = [
    {href: "/works", label: "works"},
    {href: "/studio", label: "Studio"},
    {href: "/contact", label: "contact"},
    {href: "/process", label: "process"},
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

    useGSAP((_context, contextSafe) => {
        const navItems = navItemRefs.current.filter(Boolean);
        const animatedItems = [logoMarkRef.current, logoTextRef.current, ...navItems, buttonRef.current].filter(Boolean);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduceMotion) gsap.set(animatedItems, { yPercent: 115 });
        gsap.set(secondaryNavRef.current, {
            y: -24,
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
            gsap.to(secondaryNavRef.current, {
                y: 0,
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: reduceMotion ? 0 : 0.64,
                ease: motionEases.enter,
                overwrite: "auto",
            });
        });

        const hideSecondaryNavbar = contextSafe!(() => {
            gsap.to(secondaryNavRef.current, {
                y: -24,
                autoAlpha: 0,
                pointerEvents: "none",
                duration: reduceMotion ? 0 : 0.48,
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

        ScrollTrigger.create({
            start: () => window.innerHeight * 0.92,
            end: "max",
            invalidateOnRefresh: true,
            onEnter: showSecondaryNavbar,
            onLeaveBack: hideSecondaryNavbar,
        });

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

        window.addEventListener(NAVBAR_REVEAL_EVENT, revealNavbar, { once: true });
        return () => window.removeEventListener(NAVBAR_REVEAL_EVENT, revealNavbar);
    }, { scope: headerRef });

    return (
      <>
        <header ref={headerRef} className="fixed top-0 z-[100] h-[15vh] w-full overflow-hidden">
          <div ref={primaryNavContentRef} className="viewport-container flex h-full items-center justify-between will-change-transform">
            <div className="flex items-start justify-center gap-2 text-white">
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

            <nav className="flex gap-4 text-white">
                {links.map((link, index) => (
                    <div key={link.href} className="overflow-hidden" data-cursor={""}>
                        <div
                            ref={(element) => { navItemRefs.current[index] = element; }}
                            className="will-change-transform"
                            data-cursor={""}
                        >
                            <ClipMaskTextAnimation text={link.label} className="text-sm font-[600]" />
                        </div>
                    </div>
                ))}
            </nav>

            <div className="overflow-hidden rounded-4xl">
                <div ref={buttonRef} className="will-change-transform">
                    <GetInTouchButton onClick={(event) => {
                        contactButtonRef.current = event.currentTarget;
                        setIsContactOpen(true);
                    }} />
                </div>
            </div>
          </div>
        </header>
        <div
            ref={secondaryNavRef}
            className="fixed top-5 right-[var(--spacing-viewport-gutter)] z-[100] flex items-center gap-1 p-2"
            role="navigation"
            aria-label="Secondary navigation"
        >
            <GetInTouchButton variant="dark" onClick={(event) => {
                contactButtonRef.current = event.currentTarget;
                setIsContactOpen(true);
            }} />
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
        <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} triggerRef={menuButtonRef} />
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

