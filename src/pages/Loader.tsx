import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export const Loader = () => {
    const barRef = useRef<HTMLDivElement>(null!);
    const logoWrapperRef = useRef<HTMLDivElement>(null!);
    const svgRef = useRef<SVGSVGElement>(null!);
    const poly1Ref = useRef<SVGPolygonElement>(null!);
    const poly2Ref = useRef<SVGPolygonElement>(null!);
    const poly3Ref = useRef<SVGPolygonElement>(null!);
    const poly4Ref = useRef<SVGPolygonElement>(null!);
    const counterRef = useRef<HTMLDivElement>(null!);
    const slideContainerRef = useRef<HTMLDivElement>(null!);
    const containerRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left" });

            const tl = gsap.timeline();

            // ── Horizontal bar (0s → 5.2s) ──
            tl.to(barRef.current, {
                scaleX: 1,
                duration: 5.2,
                ease: "power3.inOut"
            }, 0);

            // ── Logo polygon clip reveals (0s → 2.3s) ──
            tl.fromTo(poly1Ref.current,
                { clipPath: "inset(100% 0 0 0)" },
                { clipPath: "inset(0% 0 0% 0)", duration: 2.3, ease: "power3.out" }
            , 0);
            tl.fromTo(poly4Ref.current,
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 2.3, ease: "power3.out" }
            , 0);
            tl.fromTo(poly2Ref.current,
                { clipPath: "inset(0% 0% 100% 0)" },
                { clipPath: "inset(0% 0% 0% 0)", duration: 2, ease: "power3.out" }
            , "-=0.3");
            tl.fromTo(poly3Ref.current,
                { clipPath: "inset(0 0% 0 100%)" },
                { clipPath: "inset(0 0% 0 0%)", duration: 2, ease: "power3.out" }
            , "<");

            // ── Logo rotation (2.35s → 3.0s) ──
            tl.to(svgRef.current, {
                rotate: 135,
                duration: 0.65,
                ease: "power3.inOut"
            }, 2.35);

            // ── LAGOM character cycling (column-based infinite, no yoyo) ──
            const tracks = slideContainerRef.current.querySelectorAll<HTMLSpanElement>(".lagom-char-track");
            const charTweens: gsap.core.Timeline[] = [];
            const speedControl = { value: 0.4 };

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
                anim.timeScale(0.4);
                charTweens.push(anim);
            });

            // Speed ramp: hold slow → fast → slow down → settle
            tl.to(speedControl, {
                value: 5,
                duration: 1.5,
                ease: "power4.in",
                onUpdate: () => charTweens.forEach(t => t.timeScale(speedControl.value))
            }, 1);
            tl.to(speedControl, {
                value: 0.15,
                duration: 0.5,
                ease: "power2.in",
                onUpdate: () => charTweens.forEach(t => t.timeScale(speedControl.value))
            }, 3.1);
            tl.call(() => {
                charTweens.forEach(t => t.pause());
                tracks.forEach((track) => {
                    gsap.to(track, {
                        yPercent: 0,
                        duration: 0.3,
                        ease: "back.out(2.5)",
                        overwrite: "auto"
                    });
                });
            }, [], 3.6);

            // ── Counter 000 → 100 (0s → 3.6s) ──
            const counterData = { value: 0 };
            tl.to(counterData, {
                value: 100,
                duration: 3.6,
                ease: "power3.out",
                onUpdate: () => {
                    counterRef.current.textContent = String(Math.floor(counterData.value)).padStart(3, "0");
                }
            }, 0);

            // ── Bottom row exits downward (3.6s → 4.1s) ──
            tl.to(slideContainerRef.current, {
                yPercent: 120,
                duration: 0.5,
                ease: "power4.in"
            }, 3.6);

            // ── Logo flies toward camera via translateZ (3.75s → 5.2s) ──
            tl.to(logoWrapperRef.current, {
                z: 780,
                duration: 1.45,
                ease: "power4.inOut",
                force3D: true
            }, 3.75);

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
                ref={slideContainerRef}
                className="absolute bottom-0 left-0 right-0 px-10 pb-5 flex items-end justify-between will-change-transform"
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

                {/* Counter — clean numeric update, no visual effects */}
                <div className="overflow-hidden">
                    <div
                        ref={counterRef}
                        className="text-4xl md:text-[7rem] text-white font-bold tabular-nums leading-none"
                    >
                        000
                    </div>
                </div>
            </div>
        </div>
    );
};
