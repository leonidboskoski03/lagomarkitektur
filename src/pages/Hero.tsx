import hero1 from '../assets/images/hero.avif'
import hero2 from '../assets/images/hero2.avif'
import heroPortal from '../assets/images/hero-portal-v4.png'
import heroWordmark from '../assets/branding/lagom-wordmark.svg'
import {motion} from "motion/react";
import { useRef, useState} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    HERO_CONTENT_REVEAL_EVENT,
    LOADER_REVEAL_EVENT,
    NAVBAR_REVEAL_EVENT,
    type LoaderRevealEventDetail,
} from "../lib/revealEvents";
import { motionEaseCurves, motionEases } from "../lib/motion";

const descriptionLines = [
    "Sustainable architecture shaped by",
    "balance, meaning, and purpose."
];

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const [hovered, setHovered] = useState(false);
    const heroRef = useRef<HTMLDivElement | null>(null);
    const heroRef2 = useRef<HTMLDivElement | null>(null);
    const heroPortalRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const descriptionLineRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const wordmarkRef = useRef<HTMLDivElement | null>(null);

    const handleHeroMouseOn = () => {
        const tl = gsap.timeline();
        tl.to(heroRef.current, {
            clipPath: "inset(0 0 100% 0)",
            scale: 1,
            duration: 0.8,
            ease: motionEases.settle,
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1,
            duration: 0.8,
            ease: motionEases.settle,
        },"hero+=0.05")
    }

    const handleHeroMouseOff = () => {
        const tl = gsap.timeline();

        tl.to(heroRef.current, {
            clipPath: "inset(0 0 0% 0)",
            scale: 1.06,
            duration: 0.8,
            ease: motionEases.settle,
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1.08,
            duration: 0.8,
            ease: motionEases.settle,
        },"hero")
    }

    useGSAP((_context, contextSafe) => {
        if (!heroRef.current || !heroRef2.current || !heroPortalRef.current) return;

        const projectItems = gsap.utils.toArray<HTMLElement>(
            "[data-hero-project-item]",
            sectionRef.current
        );
        const descriptionLines = descriptionLineRefs.current.filter(Boolean);
        const wordmark = wordmarkRef.current;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduceMotion) {
            gsap.set(descriptionLines, { yPercent: 115 });
            gsap.set(projectItems, { yPercent: 115 });
            gsap.set(wordmark, { yPercent: 115, rotation: 0.75 });
            gsap.set([heroRef.current, heroRef2.current], { scale: 0.8 });
            gsap.set(heroPortalRef.current, { scale: 1 });
        }

        const revealImage = contextSafe!((event: Event) => {
            if (reduceMotion) {
                return;
            }

            const { imageDuration } = (event as CustomEvent<LoaderRevealEventDetail>).detail;

            gsap.to([heroRef.current, heroRef2.current], {
                scale: 1.15,
                duration: imageDuration,
                ease: motionEases.reveal,
                force3D: true,
            });
            gsap.to(heroPortalRef.current, {
                scale: 1.5,
                duration: imageDuration,
                ease: motionEases.reveal,
                force3D: true,
                delay: 0.085,
                onComplete: () => {
                    if(heroPortalRef.current !== null) heroPortalRef.current.style.display = "none";
                }
            });
        });

        const revealContent = contextSafe!(() => {
            if (reduceMotion) {
                window.dispatchEvent(new Event(NAVBAR_REVEAL_EVENT));
                return;
            }

            const revealTimeline = gsap.timeline()
                .addLabel("wordmark", 0)
                .addLabel("description", 0.1)
                .addLabel("projects", 0.16)
                .addLabel("navbar", 0.35);

            revealTimeline.to(wordmark, {
                yPercent: 0,
                rotation: 0,
                duration: 0.72,
                ease: motionEases.enter,
            }, "wordmark");
            revealTimeline.to(descriptionLines, {
                yPercent: 0,
                duration: 0.62,
                ease: motionEases.enter,
                stagger: { each: 0.055, from: "end" },
            }, "description");
            revealTimeline.to(projectItems, {
                yPercent: 0,
                duration: 0.56,
                ease: motionEases.enter,
                stagger: { each: 0.045, from: "start" },
            }, "projects");
            revealTimeline.call(() => {
                window.dispatchEvent(new Event(NAVBAR_REVEAL_EVENT));
            }, [], "navbar");
        });

        window.addEventListener(LOADER_REVEAL_EVENT, revealImage, { once: true });
        window.addEventListener(HERO_CONTENT_REVEAL_EVENT, revealContent, { once: true });

        gsap.to(heroRef.current, {
            yPercent: -50,
            filter: "brightness(0.35)",
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        return () => {
            window.removeEventListener(LOADER_REVEAL_EVENT, revealImage);
            window.removeEventListener(HERO_CONTENT_REVEAL_EVENT, revealContent);
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative z-[1] h-[200vh] bg-white">
            <div className="sticky top-0 h-screen overflow-hidden">

                <div
                    ref={heroPortalRef}
                    className="absolute inset-0 z-20 h-full w-full bg-cover bg-center will-change-transform"
                    style={{ backgroundImage: `url(${heroPortal})` }}
                    aria-hidden="true"
                />

                <div className={"absolute top-0 z-10"} ref={heroRef} style={{
                    backgroundImage: `url(${hero1})`,
                    backgroundSize: "cover",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(0.55)",
                    scale: 1.06
                }}/>

                <div className={"absolute top-0 z-[1]"} ref={heroRef2} style={{
                    backgroundImage: `url(${hero2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(0.45)",
                    scale: 1.10
                }}/>

                <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-[var(--spacing-viewport-gutter)]">
                    <div className="overflow-hidden py-4">
                        <div ref={wordmarkRef} className="w-full will-change-transform">
                            <img src={heroWordmark} alt="Lagom Arkitektur" className="block h-auto w-full" />
                        </div>
                    </div>
                </div>

                <div className="viewport-container absolute inset-x-0 bottom-8 z-10 flex items-end justify-between gap-8 md:bottom-10">
                    <div className="overflow-hidden">
                        <a
                            href="/works"
                            data-cursor=""
                            data-hero-project-item
                            className="flex items-center gap-1.5 text-sm font-semibold uppercase text-white will-change-transform"
                            onMouseEnter={() => {
                                setHovered(true)
                                handleHeroMouseOn()
                            }}
                            onMouseLeave={() => {
                                setHovered(false)
                                handleHeroMouseOff()
                            }}
                        >
                            <NavItemUnderlineAnimation label="View project" />
                            <DotAnimation hovered={hovered} />
                        </a>
                    </div>

                    <h1 className="w-fit max-w-[29rem] text-left text-[clamp(1rem,1.7vw,1.5rem)] font-normal leading-[1.12] tracking-[-0.035em] text-white">
                        {descriptionLines.map((line, index) => (
                            <span key={line} className="block overflow-hidden">
                                <span
                                    ref={(element) => { descriptionLineRefs.current[index] = element; }}
                                    className="block"
                                >
                                    {line}
                                </span>
                            </span>
                        ))}
                    </h1>
                </div>
            </div>


        </section>
    )
}

const DotAnimation = ({hovered}:{hovered: boolean}) => {

    return(
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <motion.circle
                cx="8"
                cy="8"
                r="3"
                stroke="white"
                strokeWidth={1}
                initial={false}
                animate={hovered ? {scale: 0.63, fill: "white"} : {scale: 0.85, fill: "none"}}
                transition={{duration: 0.5, ease: motionEaseCurves.settle}}
            />
        </svg>
    )
}

const NavItemUnderlineAnimation = ({ label }: { label: string }) => {
    const whiteLineRef = useRef<HTMLDivElement | null>(null);
    const redLineRef = useRef<HTMLDivElement | null>(null);

    const handleEnter = () => {
        if (!whiteLineRef.current || !redLineRef.current) return;

        gsap.killTweensOf([whiteLineRef.current, redLineRef.current]);

        const tl = gsap.timeline();

        // Reset both lines before every hover
        gsap.set([whiteLineRef.current], {
            xPercent: 0,
        });

        gsap.set([redLineRef.current], {
            xPercent: -110,
        });

        // First line passes through
        tl.to(
            whiteLineRef.current,
            {
                xPercent: 110,
                duration: 1,
                ease: motionEases.settle,
            },
            0
        );

        // Second line follows shortly after
        tl.to(
            redLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: motionEases.settle,
            },
            0.16
        );
    };

    const handleLeave = () => {
        if (!whiteLineRef.current || !redLineRef.current) return;

        gsap.killTweensOf([whiteLineRef.current, redLineRef.current]);

        const tl = gsap.timeline();

        tl.to(redLineRef.current,{
            xPercent: 110,
            duration: 0.8,
            ease: motionEases.settle,
        })

        gsap.set([whiteLineRef.current], {xPercent: -110});

        tl.to(
            whiteLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: motionEases.settle,
            },
            0.16
        );

    };

    return (
        <div
            className="relative inline-block cursor-pointer text-white"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {label}

            <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">

                <div
                    ref={whiteLineRef}
                    className="absolute inset-0 h-full w-full bg-white"
                />

                <div
                    ref={redLineRef}
                    className="absolute inset-0 h-full w-full bg-white"
                />
            </div>
        </div>
    );
};
