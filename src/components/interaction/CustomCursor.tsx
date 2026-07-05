import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {motionEases} from "../../lib/motion";

const interactiveSelector = " button, input, textarea, select, [data-cursor]";

export function CustomCursor() {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const ringRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);
    const arrowRef = useRef<HTMLSpanElement | null>(null);

    useGSAP((_context, contextSafe) => {
        const root = rootRef.current;
        const ring = ringRef.current;
        const label = labelRef.current;
        const arrow = arrowRef.current;
        if (!root || !ring || !label || !arrow) return;

        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!finePointer || reduceMotion) return;

        document.documentElement.classList.add("has-custom-cursor");

        const ringX = gsap.quickTo(ring, "x", {duration: 0.62, ease: motionEases.settle});
        const ringY = gsap.quickTo(ring, "y", {duration: 0.62, ease: motionEases.settle});
        let stateDelay: gsap.core.Tween | null = null;
        let stateTimeline: gsap.core.Timeline | null = null;
        let queuedInteractive: Element | null = null;

        const setCursorState = contextSafe!((target: Element | null) => {
            const candidate = target?.closest(interactiveSelector) as HTMLElement | null;
            const input = candidate?.matches("input, textarea, select");
            const anchor = candidate?.matches("a");
            const plainCloseState = candidate?.dataset.cursor === "close";
            const closeControl = candidate?.matches('[aria-label*="close" i]');
            const logoLink = candidate?.matches('a[aria-label*="home" i]');
            const forcedDefault = candidate?.dataset.cursor === "default" || input || anchor || (closeControl && !plainCloseState) || logoLink;
            const interactive = forcedDefault ? null : candidate;
            const explicitLabel = interactive?.dataset.cursor;
            const scrollState = explicitLabel?.toLowerCase() === "scroll";
            const closeState = explicitLabel?.toLowerCase() === "close";
            const openState = Boolean(interactive && !scrollState && !closeState);
            const text = closeState ? "Close" : scrollState ? "Scroll" : explicitLabel || (interactive ? "Open" : "");
            const width = closeState ? 54 : openState ? 46 : interactive ? 88 : 46;
            const height = closeState ? 54 : openState ? 46 : interactive ? 44 : 46;
            const scale = interactive ? 1 : 12 / 46;

            label.textContent = text;
            stateTimeline?.kill();
            stateTimeline = gsap.timeline({defaults: {overwrite: "auto"}})
                .set(root, {mixBlendMode: closeState ? "normal" : "difference"}, 0)
                .to(ring, {
                    width,
                    height,
                    borderRadius: 999,
                    borderColor: interactive ? "#ffffff" : "transparent",
                    backgroundColor: "#ffffff",
                    scale,
                    duration: 0.52,
                    ease: motionEases.enter,
                }, 0)
                .to(label, {
                    autoAlpha: text ? 1 : 0,
                    y: text ? 0 : 5,
                    scale: text ? 1 : 0.82,
                    duration: 0.4,
                    ease: motionEases.enter,
                }, 0.04)
                .to(arrow, {
                    autoAlpha: scrollState ? 1 : 0,
                    scale: scrollState ? 1 : 0.75,
                    duration: 0.36,
                    ease: motionEases.settle,
                }, 0.05);
        });

        const queueCursorState = (target: Element | null) => {
            const nextInteractive = target?.closest(interactiveSelector) || null;
            if (nextInteractive === queuedInteractive) return;
            queuedInteractive = nextInteractive;
            stateDelay?.kill();
            stateDelay = gsap.delayedCall(0.09, () => setCursorState(nextInteractive));
        };

        const handlePointerMove = (event: PointerEvent) => {
            ringX(event.clientX);
            ringY(event.clientY);
            gsap.to(root, {autoAlpha: 1, duration: 0.24, overwrite: "auto"});
        };
        const handlePointerOver = (event: PointerEvent) => queueCursorState(event.target as Element);
        const handlePointerOut = (event: PointerEvent) => {
            if (!event.relatedTarget) queueCursorState(null);
        };
        const handlePointerLeave = () => gsap.to(root, {autoAlpha: 0, duration: 0.24, overwrite: "auto"});
        const handleWheel = () => {
            gsap.fromTo(arrow, {y: -4}, {y: 4, duration: 0.4, repeat: 1, yoyo: true, ease: motionEases.settle, overwrite: "auto"});
        };

        window.addEventListener("pointermove", handlePointerMove, {passive: true});
        document.addEventListener("pointerover", handlePointerOver, {passive: true});
        document.addEventListener("pointerout", handlePointerOut, {passive: true});
        document.documentElement.addEventListener("mouseleave", handlePointerLeave);
        window.addEventListener("wheel", handleWheel, {passive: true});

        return () => {
            stateDelay?.kill();
            stateTimeline?.kill();
            document.documentElement.classList.remove("has-custom-cursor");
            window.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerover", handlePointerOver);
            document.removeEventListener("pointerout", handlePointerOut);
            document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
            window.removeEventListener("wheel", handleWheel);
        };
    }, {scope: rootRef});

    return (
        <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2000] opacity-0 mix-blend-difference">
            <div
                ref={ringRef}
                className="fixed left-0 top-0 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 scale-[0.26087] items-center justify-center rounded-full border border-transparent bg-white text-black will-change-transform"
            >
                <span ref={labelRef} className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] opacity-0" />
                <span ref={arrowRef} className="absolute right-3 text-xs opacity-0">↕</span>
            </div>
        </div>
    );
}
