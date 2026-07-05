import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { LoaderRevealUnderlay } from "../components/ui/LoaderRevealUnderlay";
import {
    HERO_CONTENT_REVEAL_EVENT,
    LOADER_REVEAL_EVENT,
} from "../lib/revealEvents";
import { motionEases } from "../lib/motion";

const COUNTER_REELS = [
    [0, 1],
    Array.from({ length: 11 }, (_, index) => index % 10),
    Array.from({ length: 101 }, (_, index) => index % 10),
];

const LOGO_REVEAL_DURATION = 2.65;
const HERO_IMAGE_POST_LOADER_DURATION = 1;
const HERO_CONTENT_START_SCALE_PROGRESS = 0.85;

const getTimeProgressAtEaseValue = (targetValue: number) => {
    const ease = motionEases.reveal;
    let lowerBound = 0;
    let upperBound = 1;

    for (let iteration = 0; iteration < 16; iteration += 1) {
        const midpoint = (lowerBound + upperBound) / 2;
        if (ease(midpoint) < targetValue) lowerBound = midpoint;
        else upperBound = midpoint;
    }

    return (lowerBound + upperBound) / 2;
};

const HERO_IMAGE_REVEAL_DURATION =
    LOGO_REVEAL_DURATION + HERO_IMAGE_POST_LOADER_DURATION;
const HERO_CONTENT_REVEAL_OFFSET =
    LOGO_REVEAL_DURATION * getTimeProgressAtEaseValue(HERO_CONTENT_START_SCALE_PROGRESS);

export const Loader = () => {
    const barRef = useRef<HTMLDivElement>(null!);
    const revealUnderlayRef = useRef<HTMLDivElement>(null!);
    const poly1Ref = useRef<SVGPolygonElement>(null!);
    const poly2Ref = useRef<SVGPolygonElement>(null!);
    const poly3Ref = useRef<SVGPolygonElement>(null!);
    const poly4Ref = useRef<SVGPolygonElement>(null!);
    const maskPositionRef = useRef<SVGGElement>(null!);
    const maskLogoRef = useRef<SVGGElement>(null!);
    const maskRotationRef = useRef<SVGGElement>(null!);
    const maskSvgRef = useRef<SVGSVGElement>(null!);
    const bottomMaskRef = useRef<HTMLDivElement>(null!);
    const lagomDomRef = useRef<HTMLDivElement>(null!);
    const counterDomRef = useRef<HTMLDivElement>(null!);
    const counterTrackRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const containerRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            containerRef.current.style.display = "none";
            return;
        }

        const centerMaskLogo = () => {
            maskSvgRef.current.setAttribute(
                "viewBox",
                `0 0 ${window.innerWidth} ${window.innerHeight}`
            );
            gsap.set(maskPositionRef.current, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
        };

        const revealScale = Math.min(
            120,
            Math.hypot(window.innerWidth, window.innerHeight) / 20
        );
        const ctx = gsap.context(() => {
            gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left" });
            gsap.set(maskPositionRef.current, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
            gsap.set(maskLogoRef.current, {
                scale: 0.78,
                rotation: -8,
                svgOrigin: "0 0",
            });
            gsap.set(maskRotationRef.current, {
                scale: 1,
                rotation: 0,
                svgOrigin: "0 0",
            });
            maskSvgRef.current.setAttribute(
                "viewBox",
                `0 0 ${window.innerWidth} ${window.innerHeight}`
            );
            gsap.set(poly1Ref.current, {
                x: -28,
                y: 58,
                rotation: -9,
                autoAlpha: 0,
                clipPath: "inset(100% 0 0 0)",
                transformOrigin: "50% 50%",
            });
            gsap.set(poly2Ref.current, {
                x: 24,
                y: -52,
                rotation: 8,
                autoAlpha: 0,
                clipPath: "inset(0 0 100% 0)",
                transformOrigin: "50% 50%",
            });
            gsap.set(poly3Ref.current, {
                x: -62,
                y: 10,
                rotation: -7,
                autoAlpha: 0,
                clipPath: "inset(0 0 0 100%)",
                transformOrigin: "50% 50%",
            });
            gsap.set(poly4Ref.current, {
                x: 68,
                y: 18,
                rotation: 6,
                autoAlpha: 0,
                clipPath: "inset(0 100% 0 0)",
                transformOrigin: "50% 50%",
            });
    //
            const timeline = gsap.timeline();
            timeline
                .addLabel("intro", 0)
                .addLabel("settle", 3.6)
                .addLabel("exit", 4.3)
                .addLabel("reveal", 5.32)
                .addLabel("complete", 6.94);
    //
            timeline.to(barRef.current, {
                scaleX: 1,
                duration: 5.2,
                ease: "power3.inOut",
            }, "intro");
    //
            [poly1Ref, poly2Ref, poly3Ref, poly4Ref].forEach(
                (polygonRef, index) => {
                    timeline.to(polygonRef.current, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        autoAlpha: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 1.15,
                        ease: "power4.out",
                    }, 0.08 + index * 0.11);
                }
            );
    //
            timeline.to(maskLogoRef.current, {
                scale: 1.08,
                rotation: 0,
                duration: 1.55,
                ease: "power3.out",
                svgOrigin: "0 0",
            }, "intro");
            timeline.to(maskLogoRef.current, {
                scale: 1,
                duration: 0.45,
                ease: "power2.inOut",
                svgOrigin: "0 0",
            }, 1.5);
            timeline.to(maskRotationRef.current, {
                rotation: 132,
                scale: 0.9,
                duration: 0.78,
                ease: "power4.inOut",
                svgOrigin: "0 0",
            }, 2.18);
            timeline.to(maskRotationRef.current, {
                rotation: 135,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                svgOrigin: "0 0",
            }, 2.96);
    //
            const characterTracks = lagomDomRef.current.querySelectorAll<HTMLSpanElement>(
                ".lagom-char-track"
            );
            const lagomExitItems = lagomDomRef.current.querySelectorAll<HTMLSpanElement>(
                ".lagom-exit-item"
            );
            const counterExitItems = counterDomRef.current.querySelectorAll<HTMLSpanElement>(
                ".counter-exit-item"
            );
            const characterLoops: gsap.core.Timeline[] = [];
            const speed = { value: 0.85 };
    //
            characterTracks.forEach((track, index) => {
                const loop = gsap.timeline({ repeat: -1 });
                if (index % 2 === 0) {
                    loop.to(track, { yPercent: -50, duration: 0.4, ease: "none" });
                    loop.set(track, { yPercent: 0 });
                } else {
                    loop.set(track, { yPercent: -50 });
                    loop.to(track, { yPercent: 0, duration: 0.4, ease: "none" });
                    loop.set(track, { yPercent: -50 });
                }
                loop.timeScale(speed.value);
                characterLoops.push(loop);
            });
    //
            timeline.to(speed, {
                value: 2.7,
                duration: 1.55,
                ease: "power2.inOut",
                onUpdate: () => characterLoops.forEach((loop) => loop.timeScale(speed.value)),
            }, 0.45);
            timeline.to(speed, {
                value: 0.22,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: () => characterLoops.forEach((loop) => loop.timeScale(speed.value)),
            }, 2);
            timeline.call(() => {
                characterLoops.forEach((loop) => loop.pause());
            }, [], "settle");
            timeline.to(characterTracks, {
                yPercent: (index) => index % 2 === 0 ? -50 : 0,
                duration: 0.62,
                ease: motionEases.depart,
                overwrite: "auto",
                onComplete: () => {
                    gsap.set(characterTracks, { yPercent: 0 });
                },
            }, "settle");
    //
            const counterSteps = [1, 10, 100];
            counterTrackRefs.current.forEach((track, index) => {
                if (!track) return;
                const digitHeight = track.parentElement?.clientHeight ?? 0;
                timeline.fromTo(track, { y: 0 }, {
                    y: -(digitHeight * counterSteps[index]),
                    duration: 3.6,
                    ease: "power3.out",
                    force3D: true,
                }, "intro");
            });
    //
            timeline.to(lagomExitItems, {
                yPercent: 117,
                rotation: 3,
                transformOrigin: "left bottom",
                duration: 0.9,
                ease: motionEases.depart,
                stagger: { each: 0.018, from: "end" },
                force3D: true,
            }, "exit");
            timeline.to(counterExitItems, {
                yPercent: 117,
                rotation: 3,
                transformOrigin: "left bottom",
                duration: 0.9,
                ease: motionEases.depart,
                stagger: { each: 0.018, from: "end" },
                force3D: true,
            }, "exit+=0.08");
            timeline.to(barRef.current, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.7,
                ease: motionEases.depart,
            }, "exit+=0.1");
            timeline.to(maskLogoRef.current, {
                scale: revealScale,
                rotation: 60,
                svgOrigin: "0% 20%",
                duration: LOGO_REVEAL_DURATION,
                ease: motionEases.reveal,
            }, "reveal");
            timeline.call(() => {
                window.dispatchEvent(new CustomEvent(LOADER_REVEAL_EVENT, {
                    detail: { imageDuration: HERO_IMAGE_REVEAL_DURATION },
                }));
            }, [], "reveal");
            timeline.call(() => {
                window.dispatchEvent(new Event(HERO_CONTENT_REVEAL_EVENT));
            }, [], `reveal+=${HERO_CONTENT_REVEAL_OFFSET}`);
            timeline.to(revealUnderlayRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: motionEases.settle,
            }, "reveal");

            timeline.set(containerRef.current, {
                display: "none",
                pointerEvents: "none",
            });

        }, containerRef);

        window.addEventListener("resize", centerMaskLogo);

        return () => {
            window.removeEventListener("resize", centerMaskLogo);
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 z-[1000] h-screen w-screen overflow-hidden"
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
        >
            <LoaderRevealUnderlay ref={revealUnderlayRef} />

            <svg
                ref={maskSvgRef}
                className="pointer-events-none absolute inset-0 z-[10] h-full w-full"
                aria-hidden="true"
            >
                <defs>
                    <mask
                        id="loader-logo-reveal"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        style={{ maskType: "luminance" }}
                    >
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <g ref={maskPositionRef}>
                            <g ref={maskLogoRef}>
                                <g ref={maskRotationRef}>
                                    <g transform="scale(1 0.9) translate(-120 -120)">
                                        <polygon ref={poly1Ref} points="69,28 89,28 89,122 69,142" fill="black" />
                                        <polygon ref={poly2Ref} points="102,28 122,28 122,89 102,109" fill="black" />
                                        <polygon ref={poly3Ref} points="126,92 170,92 170,112 106,112" fill="black" />
                                        <polygon ref={poly4Ref} points="94,126 170,126 170,146 74,146" fill="black" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    mask="url(#loader-logo-reveal)"
                />
            </svg>

            <div
                ref={barRef}
                className="absolute top-0 z-[20] h-[3px] w-full bg-white will-change-transform"
                style={{ transformOrigin: "left", transform: "scaleX(0)" }}
            />

            <div
                ref={bottomMaskRef}
                className="absolute bottom-0 left-0 right-0 z-[20] h-[3.5rem] overflow-hidden [contain:paint] md:h-[8.25rem]"
            >
                <div
                    className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-5"
                >
                    <div ref={lagomDomRef} className="flex leading-none overflow-hidden">
                            {"LAGOM".split("").map((character, index) => (
                                <span
                                    key={index}
                                    className="lagom-char-mask lagom-exit-item inline-block h-[1em] overflow-hidden align-top text-4xl font-bold leading-none text-white md:text-[7rem]"
                                >
                                    <span className="lagom-char-track block will-change-transform">
                                        <span className="block">{character}</span>
                                        <span className="block">{character}</span>
                                    </span>
                                </span>
                            ))}
                    </div>

                    <div
                        ref={counterDomRef}
                        className="flex justify-end overflow-hidden text-4xl font-bold leading-none tabular-nums text-white md:text-[7rem]"
                        aria-label="Loading progress"
                    >
                            {COUNTER_REELS.map((reel, reelIndex) => (
                                <span
                                    key={reelIndex}
                                    className="counter-digit-mask counter-exit-item block h-[1em] overflow-hidden"
                                    aria-hidden="true"
                                >
                                    <span
                                        ref={(element) => {
                                            counterTrackRefs.current[reelIndex] = element;
                                        }}
                                        className="block will-change-transform"
                                    >
                                        {reel.map((digit, digitIndex) => (
                                            <span
                                                key={`${reelIndex}-${digitIndex}`}
                                                className="block h-[1em]"
                                            >
                                                {digit}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
