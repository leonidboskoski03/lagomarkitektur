import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const COUNTER_REELS = [
    [0, 1],
    Array.from({ length: 11 }, (_, index) => index % 10),
    Array.from({ length: 101 }, (_, index) => index % 10),
];

export const Loader = () => {
    const barRef = useRef<HTMLDivElement>(null!);
    const logoWrapperRef = useRef<HTMLDivElement>(null!);
    const svgRef = useRef<SVGSVGElement>(null!);
    const poly1Ref = useRef<SVGPolygonElement>(null!);
    const poly2Ref = useRef<SVGPolygonElement>(null!);
    const poly3Ref = useRef<SVGPolygonElement>(null!);
    const poly4Ref = useRef<SVGPolygonElement>(null!);
    const counterTrackRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const bottomMaskRef = useRef<HTMLDivElement>(null!);
    const slideContainerRef = useRef<HTMLDivElement>(null!);
    const containerRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left" });
            gsap.set(bottomMaskRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
            gsap.set(logoWrapperRef.current, {
                z: 0,
                scale: 0.78,
                rotation: -8,
                transformOrigin: "50% 50%",
            });
            gsap.set(poly1Ref.current, {
                x: -28, y: 58, rotation: -9, autoAlpha: 0,
                clipPath: "inset(100% 0 0 0)", transformOrigin: "50% 50%",
            });
            gsap.set(poly2Ref.current, {
                x: 24, y: -52, rotation: 8, autoAlpha: 0,
                clipPath: "inset(0 0 100% 0)", transformOrigin: "50% 50%",
            });
            gsap.set(poly3Ref.current, {
                x: -62, y: 10, rotation: -7, autoAlpha: 0,
                clipPath: "inset(0 0 0 100%)", transformOrigin: "50% 50%",
            });
            gsap.set(poly4Ref.current, {
                x: 68, y: 18, rotation: 6, autoAlpha: 0,
                clipPath: "inset(0 100% 0 0)", transformOrigin: "50% 50%",
            });

            const tl = gsap.timeline();

            // ── Horizontal bar (0s → 5.2s) ──
            tl.to(barRef.current, {
                scaleX: 1,
                duration: 5.2,
                ease: "power3.inOut"
            }, 0);

            // ── Logo polygon clip reveals (0s → 2.3s) ──
            [poly1Ref, poly2Ref, poly3Ref, poly4Ref].forEach((polygonRef, index) => {
                tl.to(polygonRef.current, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    autoAlpha: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.15,
                    ease: "power4.out",
                }, 0.08 + index * 0.11);
            });

            tl.to(logoWrapperRef.current, {
                scale: 1.08,
                rotation: 0,
                duration: 1.55,
                ease: "power3.out",
            }, 0);
            tl.to(logoWrapperRef.current, {
                scale: 1,
                duration: 0.45,
                ease: "power2.inOut",
            }, 1.5);

            // ── Logo rotation (2.35s → 3.0s) ──
            tl.to(svgRef.current, {
                rotation: 132,
                scale: 0.9,
                duration: 0.78,
                ease: "power4.inOut",
                transformOrigin: "50% 50%",
            }, 2.18);
            tl.to(svgRef.current, {
                rotation: 135,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
            }, 2.96);

            // ── LAGOM character cycling (column-based infinite, no yoyo) ──
            const tracks = slideContainerRef.current.querySelectorAll<HTMLSpanElement>(".lagom-char-track");
            const charTweens: gsap.core.Timeline[] = [];
            const speedControl = { value: 0.85 };

            tracks.forEach((track, i) => {
                const isEven = i % 2 === 0;
                const anim = gsap.timeline({ repeat: -1, paused: false });
                if (isEven) {
                    anim.to(track, { yPercent: -50, duration: 0.4, ease: "none" });
                    anim.set(track, { yPercent: 0 });
                } else {
                    anim.set(track, { yPercent: -50 });
                    anim.to(track, { yPercent: 0, duration: 0.4, ease: "none" });
                    anim.set(track, { yPercent: -50 });
                }
                anim.timeScale(speedControl.value);
                charTweens.push(anim);
            });

            // Speed ramp: hold slow → fast → slow down → settle
            tl.to(speedControl, {
                value: 2.7,
                duration: 1.55,
                ease: "power2.inOut",
                onUpdate: () => charTweens.forEach(t => t.timeScale(speedControl.value))
            }, 0.45);
            tl.to(speedControl, {
                value: 0.22,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: () => charTweens.forEach(t => t.timeScale(speedControl.value))
            }, 2);
            tl.call(() => {
                charTweens.forEach(t => t.pause());
                tracks.forEach((track) => {
                    gsap.to(track, {
                        yPercent: 0,
                        duration: 0.45,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                });
            }, [], 3.6);

            // ── Counter 000 → 100: independent clipped digit reels ──
            const counterTracks = counterTrackRefs.current.filter(
                (track): track is HTMLSpanElement => track !== null
            );
            const counterSteps = [1, 10, 100];
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            counterTracks.forEach((track, index) => {
                const digitHeight = track.parentElement?.clientHeight ?? 0;
                const finalY = -(digitHeight * counterSteps[index]);

                if (prefersReducedMotion) {
                    gsap.set(track, { y: finalY });
                    return;
                }

                tl.fromTo(
                    track,
                    { y: 0 },
                    {
                        y: finalY,
                        duration: 3.6,
                        ease: "power3.out",
                        force3D: true,
                    },
                    0
                );
            });

            // ── Bottom row exits downward (3.6s → 4.1s) ──
            tl.to(bottomMaskRef.current, {
                clipPath: "inset(100% 0% 0% 0%)",
                duration: 0.9,
                ease: "power4.in",
            }, 3.72);
            tl.to(barRef.current, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.7,
                ease: "power3.in",
            }, 3.82);

            // ── Logo flies toward camera via translateZ (3.75s → 5.2s) ──
            tl.to(logoWrapperRef.current, {
                z: 790,
                scale: 1.18,
                duration: 1.42,
                ease: "power4.in",
                force3D: true
            }, 4.48);
            tl.to(containerRef.current, {
                autoAlpha: 0,
                duration: 0.18,
                ease: "power1.out",
                onComplete: () => {
                    containerRef.current.style.pointerEvents = "none";
                },
            }, 5.94);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-screen h-screen fixed top-0 bg-black z-[1000] overflow-hidden"
            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
        >
            {/* Horizontal loader bar */}
            <div
                ref={barRef}
                className="w-full h-[3px] absolute top-0 bg-white will-change-transform"
                style={{ transformOrigin: "left", transform: "scaleX(0)" }}
            />

            {/* Logo in center */}
            <div
                ref={logoWrapperRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
            >
                <svg
                    ref={svgRef}
                    width="120"
                    height="180"
                    viewBox="60 20 120 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="will-change-transform"
                >
                    <polygon ref={poly1Ref} points="69,28 89,28 89,122 69,142" fill="white" />
                    <polygon ref={poly2Ref} points="102,28 122,28 122,89 102,109" fill="white" />
                    <polygon ref={poly3Ref} points="126,92 170,92 170,112 106,112" fill="white" />
                    <polygon ref={poly4Ref} points="94,126 170,126 170,146 74,146" fill="white" />
                </svg>
            </div>

            {/* Bottom row: LAGOM text (left) + Counter (right) */}
            <div
                ref={bottomMaskRef}
                className="absolute bottom-0 left-0 right-0 h-[3.5rem] overflow-hidden [contain:paint] [will-change:clip-path] md:h-[8.25rem]"
            >
                <div
                    ref={slideContainerRef}
                    className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-5"
                >
                {/* LAGOM characters — each char has a 2-copy column inside a fixed-height mask */}
                <div className="flex leading-none">
                    {"LAGOM".split("").map((char, i) => (
                        <span
                            key={i}
                            className="lagom-char-mask inline-block overflow-hidden align-top leading-none text-4xl md:text-[7rem] text-white font-bold"
                            style={{ height: "1em" }}
                        >
                            <span
                                className="lagom-char-track block will-change-transform"
                                style={{ lineHeight: 1 }}
                            >
                                <span className="block">{char}</span>
                                <span className="block">{char}</span>
                            </span>
                        </span>
                    ))}
                </div>

                {/* Counter — three independently masked cinematic digit reels */}
                <div
                    className="flex overflow-hidden text-4xl font-bold leading-none tabular-nums text-white md:text-[7rem]"
                    aria-label="Loading 100 percent"
                >
                    {COUNTER_REELS.map((reel, reelIndex) => (
                        <span
                            key={reelIndex}
                            className="block h-[1em] overflow-hidden"
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
