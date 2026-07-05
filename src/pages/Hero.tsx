import hero1 from '../assets/images/hero.avif'
import hero2 from '../assets/images/hero2.avif'
import heroPortal from '../assets/images/hero-portal-v4.png'
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
import { motionEases } from "../lib/motion";

const items = ["featured project", "Myrtle Pool House","Villa House", "2024", "view project"]
const descriptionLines = [
    "The OH Architecture style is defined by",
    "strong, solid forms with subtle elegance,",
    "natural balance and enduring appeal",
];

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const [hovered, setHovered] = useState(false);
    const heroRef = useRef<HTMLDivElement | null>(null);
    const heroRef2 = useRef<HTMLDivElement | null>(null);
    const heroPortalRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const descriptionLineRefs = useRef<Array<HTMLSpanElement | null>>([]);

    const handleHeroMouseOn = () => {
        const tl = gsap.timeline();
        console.log("hovered")
        tl.to(heroRef.current, {
            clipPath: "inset(0 0 100% 0)",
            scale: 1,
            duration: 0.8,
            ease: "power3.inOut",
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero+=0.05")
    }

    const handleHeroMouseOff = () => {
        const tl = gsap.timeline();

        tl.to(heroRef.current, {
            clipPath: "inset(0 0 0% 0)",
            scale: 1.06,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1.08,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero")
    }

    useGSAP((_context, contextSafe) => {
        if (!heroRef.current || !heroRef2.current || !heroPortalRef.current) return;

        const projectItems = gsap.utils.toArray<HTMLDivElement>(
            "[data-hero-project-item]",
            sectionRef.current
        );
        const descriptionLines = descriptionLineRefs.current.filter(Boolean);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduceMotion) {
            gsap.set(descriptionLines, { yPercent: 115 });
            gsap.set(projectItems, { yPercent: 115 });
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
                .addLabel("description", 0)
                .addLabel("projects", 0.12)
                .addLabel("navbar", 0.35);

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

                <div className={"absolute top-1/2 left-1/2 z-10 flex h-[10vh] w-full -translate-x-1/2 -translate-y-1/2 items-start justify-between px-[6.5rem]"}>
                    {items.map((item, index) => {
                        return(
                            <div
                                key={item}
                                className={`flex h-full ${index % 2 ? "items-end" : "items-start"}`}
                            >
                                <div className="overflow-hidden">
                                    <div
                                        data-hero-project-item
                                        className="flex items-center justify-center text-sm font-bold uppercase text-white"
                                        onMouseEnter={() => {
                                            setHovered(true)
                                            if (index === items.length -1) handleHeroMouseOn()
                                        }}
                                        onMouseLeave={() => {
                                            setHovered(false)
                                            if (index === items.length -1) handleHeroMouseOff()
                                        }}
                                    >
                                        {items.length === index + 1 ? <NavItemUnderlineAnimation label={item}/> : item}
                                        {items.length === index + 1 ? <DotAnimation hovered={hovered}/> : null}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className={"absolute bottom-10 z-10 w-1/2 pl-[6.5rem]"}>
                    <h1 className={"text-white text-3xl"}>
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
                transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
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
                ease: "power3.inOut",
            },
            0
        );

        // Second line follows shortly after
        tl.to(
            redLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: "power3.inOut",
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
            ease: "power3.inOut",
        })

        gsap.set([whiteLineRef.current], {xPercent: -110});

        tl.to(
            whiteLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: "power3.inOut",
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
