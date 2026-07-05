import {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {motionEases} from "../../lib/motion";
import {ClipMaskTextAnimation} from "../animation/ClipMaskTextAnimation";

const menuLinks = [
    {href: "/works", label: "Works"},
    {href: "/studio", label: "Studio"},
    {href: "/process", label: "Process"},
    {href: "/contact", label: "Contact"},
] as const;

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MenuOverlay({isOpen, onClose, triggerRef}: MenuOverlayProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [clipActiveIndex, setClipActiveIndex] = useState<number | null>(null);
    const [closeHovered, setCloseHovered] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeContentRef = useRef<HTMLSpanElement | null>(null);
    const routeRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const routeLabelRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const routeBackgroundRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const routeLineRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const hoveredIndexRef = useRef<number | null>(null);
    const metaRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const overlay = overlayRef.current;
        const routes = routeRefs.current.filter(Boolean);
        if (!overlay) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reduceMotion ? 0 : 0.9;

        if (isOpen) {
            hoveredIndexRef.current = null;
            setHoveredIndex(null);
            setClipActiveIndex(null);
            setCloseHovered(false);
            gsap.set(overlay, {visibility: "visible", pointerEvents: "auto"});
            gsap.set(overlay, {backgroundColor: "#f4f1ea"});
            gsap.set(routes, {opacity: 1});
            gsap.set(routeLabelRefs.current, {x: 0});
            gsap.set(routeBackgroundRefs.current, {scaleX: 0});
            gsap.set(routeLineRefs.current, {scaleX: 0});
            gsap.timeline({defaults: {overwrite: "auto"}})
                .fromTo(overlay,
                    {clipPath: "circle(0% at calc(100% - var(--spacing-viewport-gutter)) 3.5rem)"},
                    {clipPath: "circle(150% at calc(100% - var(--spacing-viewport-gutter)) 3.5rem)", duration, ease: motionEases.reveal},
                )
                .fromTo(routes,
                    {yPercent: 115, rotation: 1.5},
                    {yPercent: 0, rotation: 0, duration: reduceMotion ? 0 : 0.72, stagger: 0.045, ease: motionEases.enter},
                    reduceMotion ? 0 : 0.32,
                )
                .fromTo(closeContentRef.current,
                    {yPercent: 130, rotation: 4},
                    {yPercent: 0, rotation: 0, duration: reduceMotion ? 0 : 0.56, ease: motionEases.enter},
                    reduceMotion ? 0 : 0.28,
                )
                .fromTo(metaRef.current,
                    {y: 16, autoAlpha: 0},
                    {y: 0, autoAlpha: 1, duration: reduceMotion ? 0 : 0.48, ease: motionEases.enter},
                    reduceMotion ? 0 : 0.46,
                );
            return;
        }

        gsap.timeline({
            defaults: {overwrite: "auto"},
            onComplete: () => gsap.set(overlay, {visibility: "hidden", pointerEvents: "none"}),
        })
            .to(closeContentRef.current, {
                yPercent: -130,
                rotation: -4,
                duration: reduceMotion ? 0 : 0.36,
                ease: motionEases.depart,
            })
            .to(routes, {
                yPercent: -115,
                duration: reduceMotion ? 0 : 0.42,
                stagger: {each: 0.025, from: "end"},
                ease: motionEases.depart,
            }, reduceMotion ? 0 : 0.05)
            .to(overlay, {
                clipPath: "circle(0% at calc(100% - var(--spacing-viewport-gutter)) 3.5rem)",
                duration: reduceMotion ? 0 : 0.68,
                ease: motionEases.depart,
            }, reduceMotion ? 0 : 0.12);
    }, {scope: overlayRef, dependencies: [isOpen]});

    const handleRouteEnter = (activeIndex: number) => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        hoveredIndexRef.current = activeIndex;
        setHoveredIndex(activeIndex);
        setClipActiveIndex(null);
        hoverTimelineRef.current?.kill();

        routeRefs.current.forEach((route, index) => {
            gsap.to(route, {
                opacity: index === activeIndex ? 1 : 0.28,
                duration: reduceMotion ? 0 : 0.45,
                ease: motionEases.settle,
                overwrite: "auto",
            });
        });
        hoverTimelineRef.current = gsap.timeline({
            defaults: {overwrite: "auto"},
        })
            .to(overlayRef.current, {
                backgroundColor: "#ece8df",
                duration: reduceMotion ? 0 : 0.6,
                ease: motionEases.settle,
            }, 0)
            .to(routeBackgroundRefs.current[activeIndex], {
                scaleX: 1,
                duration: reduceMotion ? 0 : 0.84,
                ease: motionEases.reveal,
            }, 0)
            .to(routeLabelRefs.current[activeIndex], {
                x: -36,
                duration: reduceMotion ? 0 : 0.58,
                ease: motionEases.enter,
                onComplete: () => {
                    if (hoveredIndexRef.current === activeIndex) setClipActiveIndex(activeIndex);
                },
            }, 0)
            .fromTo(routeLineRefs.current[activeIndex],
                {scaleX: 0, transformOrigin: "left center"},
                {scaleX: 1, duration: reduceMotion ? 0 : 0.72, ease: motionEases.enter},
                0,
            );
    };

    const handleRouteLeave = (activeIndex: number) => {
        hoveredIndexRef.current = null;
        setHoveredIndex(null);
        setClipActiveIndex(null);
        hoverTimelineRef.current?.kill();
        gsap.to(routeRefs.current, {
            opacity: 1,
            duration: 0.42,
            ease: motionEases.settle,
            overwrite: "auto",
        });
        gsap.to(overlayRef.current, {
            backgroundColor: "#f4f1ea",
            duration: 0.52,
            ease: motionEases.settle,
            overwrite: "auto",
        });
        gsap.to(routeBackgroundRefs.current[activeIndex], {
            scaleX: 0,
            duration: 0.52,
            ease: motionEases.depart,
            overwrite: "auto",
        });
        gsap.to(routeLabelRefs.current[activeIndex], {
            x: 0,
            duration: 0.58,
            ease: motionEases.enter,
            overwrite: "auto",
        });
        gsap.to(routeLineRefs.current[activeIndex], {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.38,
            ease: motionEases.depart,
            overwrite: "auto",
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const trigger = triggerRef.current;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            trigger?.focus();
        };
    }, [isOpen, onClose, triggerRef]);

    return (
        <div
            ref={overlayRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            aria-hidden={!isOpen}
            className="invisible fixed inset-0 z-[140] bg-[#f4f1ea] text-black [clip-path:circle(0%_at_calc(100%-var(--spacing-viewport-gutter))_3.5rem)]"
        >
            <div className="viewport-container grid h-full grid-rows-[auto_1fr_auto] py-5 md:py-8">
                <div className="flex items-start justify-between">
                    <a href="/" aria-label="Lagom Arkitektur home" className="py-2">
                        <MenuUtilityText text="Lagom Arkitektur" className="text-sm font-bold tracking-[-0.035em]" />
                    </a>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        onMouseEnter={() => setCloseHovered(true)}
                        onMouseLeave={() => setCloseHovered(false)}
                        onFocus={() => setCloseHovered(true)}
                        onBlur={() => setCloseHovered(false)}
                        className="group relative overflow-hidden rounded-full px-5 py-3 text-xs font-semibold uppercase"
                        aria-label="Close menu"
                    >
                        <span className="block overflow-hidden">
                            <span ref={closeContentRef} className="relative z-10 flex items-center gap-3 text-black">
                                <ClipMaskTextAnimation text="Close" controlled active={closeHovered} />
                                <span className="relative block size-3 transition-transform duration-500 ease-[cubic-bezier(.33,1,.68,1)] group-hover:rotate-90 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-rotate-45 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:rotate-45 after:bg-current" />
                            </span>
                        </span>
                    </button>
                </div>

                <nav aria-label="Main menu" className="flex items-center py-12 md:justify-end">
                    <ol className="w-full md:w-[78%] lg:w-[70%]">
                        {menuLinks.map((link, index) => (
                            <li key={link.href} className="relative border-b border-black/25 first:border-t">
                                <div className="overflow-hidden">
                                    <a
                                        ref={(element) => { routeRefs.current[index] = element; }}
                                        href={link.href}
                                        onClick={onClose}
                                        onMouseEnter={() => handleRouteEnter(index)}
                                        onMouseLeave={() => handleRouteLeave(index)}
                                        onFocus={() => handleRouteEnter(index)}
                                        onBlur={() => handleRouteLeave(index)}
                                        className="group relative flex items-baseline justify-between py-2.5 text-black will-change-[transform,opacity] md:py-3"
                                    >
                                        <span
                                            ref={(element) => { routeBackgroundRefs.current[index] = element; }}
                                            className="absolute inset-0 z-0 origin-right scale-x-0 bg-[#171714] will-change-transform"
                                        />
                                        <span className={`relative z-10 pl-4 text-[0.65rem] font-semibold tabular-nums md:pl-6 ${hoveredIndex === index ? "text-white mix-blend-difference" : "text-black"}`}>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            ref={(element) => { routeLabelRefs.current[index] = element; }}
                                            className={`relative z-10 block pr-[clamp(1.5rem,5vw,5rem)] will-change-transform ${hoveredIndex === index ? "text-white mix-blend-difference" : "text-black"}`}
                                        >
                                            <ClipMaskTextAnimation
                                                text={link.label}
                                                controlled
                                                active={clipActiveIndex === index}
                                                className="text-[clamp(3rem,7.6vw,7.75rem)] font-medium leading-[0.82] tracking-[-0.065em]"
                                            />
                                        </span>
                                        <span
                                            ref={(element) => { routeLineRefs.current[index] = element; }}
                                            className="absolute bottom-0 left-0 z-20 h-px w-full origin-left scale-x-0 bg-white/55 will-change-transform"
                                        />
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div ref={metaRef} className="grid grid-cols-2 items-end text-[0.65rem] font-semibold uppercase md:grid-cols-3">
                    <MenuUtilityText className={"w-fit"} text={`© ${new Date().getFullYear()} Lagom Arkitektur`} />
                    <div className="hidden justify-self-center md:block">
                        <MenuUtilityText text="Architecture · Interior · Landscape" />
                    </div>
                    <div className="flex justify-end gap-5">
                        <a href="mailto:studio@lagomarkitektur.se"><MenuUtilityText text="Email" /></a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><MenuUtilityText text="Instagram" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MenuUtilityText({text, className = ""}: {text: string; className?: string}) {
    const [hovered, setHovered] = useState(false);

    return (
        <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`bg-black group relative -mx-2 block overflow-hidden px-2 py-1 ${className}`}
        >
            <span className="absolute inset-0  bg-[#F4F1EA] transition-transform duration-600 ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-y-[-110%]" />
            <span className="relative z-10 block text-white mix-blend-difference">
                <ClipMaskTextAnimation text={text} controlled active={hovered} />
            </span>
        </span>
    );
}
