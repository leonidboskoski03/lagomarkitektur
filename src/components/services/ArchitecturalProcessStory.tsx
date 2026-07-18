import {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Link} from "react-router-dom";
import {processStory} from "../../data/processStory";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";
import {motionEases} from "../../lib/motion";

gsap.registerPlugin(ScrollTrigger);

type SequenceTier = "desktop" | "mobile";

interface CachedFrame {
    image: ImageBitmap | HTMLImageElement;
    width: number;
    height: number;
    lastUsed: number;
}

interface ActiveFrameLoad {
    controller: AbortController;
}

interface FrameSequenceRenderer {
    requestFrame: (index: number) => void;
    resize: () => void;
    dispose: () => void;
}

interface CreateFrameSequenceRendererOptions {
    canvas: HTMLCanvasElement;
    tier: SequenceTier;
    frameCount: number;
    basePath: string;
    onFirstDraw: () => void;
}

const clampFrame = (frame: number, frameCount: number) => (
    Math.max(0, Math.min(frameCount - 1, Math.round(frame)))
);

const frameUrl = (basePath: string, zeroBasedIndex: number) => (
    `${basePath}/frame_${String(zeroBasedIndex + 1).padStart(4, "0")}.webp`
);

const createFrameSequenceRenderer = ({
    canvas,
    tier,
    frameCount,
    basePath,
    onFirstDraw,
}: CreateFrameSequenceRendererOptions): FrameSequenceRenderer => {
    const context = canvas.getContext("2d", {alpha: false});
    if (!context) {
        return {
            requestFrame: () => undefined,
            resize: () => undefined,
            dispose: () => undefined,
        };
    }

    const preloadAhead = tier === "desktop" ? 6 : 4;
    const preloadBehind = tier === "desktop" ? 2 : 1;
    const cacheLimit = tier === "desktop" ? 16 : 10;
    const maxConcurrentLoads = tier === "desktop" ? 3 : 2;
    const maximumFallbackDistance = tier === "desktop" ? 4 : 3;
    const maxCanvasWidth = tier === "desktop" ? 1920 : 1280;
    const cache = new Map<number, CachedFrame>();
    const loading = new Map<number, ActiveFrameLoad>();
    const queued = new Set<number>();
    let queue: number[] = [];
    let desiredFrame = 0;
    let direction: -1 | 1 = 1;
    let drawnFrame = -1;
    let drawRequest = 0;
    let forceNextDraw = false;
    let disposed = false;
    let hasDrawn = false;

    const resize = () => {
        const cssWidth = Math.max(1, canvas.clientWidth);
        const cssHeight = Math.max(1, canvas.clientHeight);
        const pixelRatio = Math.min(window.devicePixelRatio, maxCanvasWidth / cssWidth, 1.5);
        const nextWidth = Math.max(1, Math.round(cssWidth * pixelRatio));
        const nextHeight = Math.max(1, Math.round(cssHeight * pixelRatio));

        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
            forceNextDraw = true;
            scheduleDraw();
        }
    };

    const draw = (frame: CachedFrame) => {
        const {image} = frame;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imageRatio = frame.width / frame.height;
        const canvasRatio = canvasWidth / canvasHeight;
        const renderWidth = canvasRatio > imageRatio ? canvasHeight * imageRatio : canvasWidth;
        const renderHeight = renderWidth / imageRatio;
        const offsetX = (canvasWidth - renderWidth) * 0.5;
        const offsetY = (canvasHeight - renderHeight) * (tier === "mobile" ? 0.26 : 0.5);

        context.fillStyle = "#11110f";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
        frame.lastUsed = performance.now();

        if (!hasDrawn) {
            hasDrawn = true;
            onFirstDraw();
        }
    };

    const drawClosestFrame = (force = false) => {
        const exactFrame = cache.get(desiredFrame);
        if (exactFrame) {
            if (!force && drawnFrame === desiredFrame) return;
            draw(exactFrame);
            drawnFrame = desiredFrame;
            return;
        }

        let nearestFrame: CachedFrame | undefined;
        let nearestIndex = -1;
        let nearestDistance = Number.POSITIVE_INFINITY;
        cache.forEach((frame, index) => {
            const distance = Math.abs(index - desiredFrame);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestFrame = frame;
                nearestIndex = index;
            }
        });

        if (
            nearestFrame
            && (drawnFrame < 0 || nearestDistance <= maximumFallbackDistance)
            && (force || drawnFrame !== nearestIndex)
        ) {
            draw(nearestFrame);
            drawnFrame = nearestIndex;
        }
    };

    function scheduleDraw(force = false) {
        forceNextDraw ||= force;
        if (drawRequest || disposed) return;

        drawRequest = window.requestAnimationFrame(() => {
            drawRequest = 0;
            const shouldForce = forceNextDraw;
            forceNextDraw = false;
            drawClosestFrame(shouldForce);
        });
    }

    const releaseFrame = (frame: CachedFrame) => {
        if (typeof ImageBitmap !== "undefined" && frame.image instanceof ImageBitmap) {
            frame.image.close();
        }
    };

    const trimCache = () => {
        if (cache.size <= cacheLimit) return;

        const evictionCandidates = Array.from(cache.entries())
            .filter(([index]) => index !== drawnFrame && Math.abs(index - desiredFrame) > preloadAhead)
            .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);

        while (cache.size > cacheLimit && evictionCandidates.length > 0) {
            const [index, frame] = evictionCandidates.shift()!;
            cache.delete(index);
            releaseFrame(frame);
        }
    };

    const decodeFrame = async (index: number, signal: AbortSignal) => {
        const response = await fetch(frameUrl(basePath, index), {
            cache: "force-cache",
            signal,
        });
        if (!response.ok) throw new Error(`Unable to load process frame ${index + 1}`);

        const blob = await response.blob();
        if (typeof window.createImageBitmap === "function") {
            const image = await window.createImageBitmap(blob);
            return {image, width: image.width, height: image.height};
        }

        const objectUrl = URL.createObjectURL(blob);
        try {
            const image = new Image();
            image.decoding = "async";
            image.src = objectUrl;
            await image.decode();
            return {image, width: image.naturalWidth, height: image.naturalHeight};
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const pumpQueue = () => {
        if (disposed) return;

        while (loading.size < maxConcurrentLoads && queue.length > 0) {
            const index = queue.shift()!;
            queued.delete(index);
            if (cache.has(index) || loading.has(index)) continue;

            const controller = new AbortController();
            loading.set(index, {controller});

            void decodeFrame(index, controller.signal)
                .then(({image, width, height}) => {
                    if (disposed || controller.signal.aborted) {
                        if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) image.close();
                        return;
                    }

                    cache.set(index, {image, width, height, lastUsed: performance.now()});
                    scheduleDraw();
                    trimCache();
                })
                .catch((error: unknown) => {
                    if (!(error instanceof DOMException && error.name === "AbortError")) {
                        console.warn(error);
                    }
                })
                .finally(() => {
                    const activeLoad = loading.get(index);
                    if (activeLoad?.controller === controller) loading.delete(index);
                    pumpQueue();
                });
        }
    };

    const enqueue = (index: number, priority = false) => {
        const safeIndex = clampFrame(index, frameCount);
        if (cache.has(safeIndex) || loading.has(safeIndex) || queued.has(safeIndex)) return;
        queued.add(safeIndex);
        if (priority) queue.unshift(safeIndex);
        else queue.push(safeIndex);
    };

    const requestFrame = (index: number) => {
        const nextFrame = clampFrame(index, frameCount);
        if (nextFrame !== desiredFrame) direction = nextFrame > desiredFrame ? 1 : -1;
        desiredFrame = nextFrame;

        queue = queue.filter((queuedIndex) => {
            const keep = Math.abs(queuedIndex - desiredFrame) <= preloadAhead * 2;
            if (!keep) queued.delete(queuedIndex);
            return keep;
        });

        loading.forEach(({controller}, loadingIndex) => {
            if (Math.abs(loadingIndex - desiredFrame) > preloadAhead * 3) controller.abort();
        });

        enqueue(desiredFrame, true);
        for (let offset = 1; offset <= preloadAhead; offset += 1) {
            enqueue(desiredFrame + (offset * direction));
        }
        for (let offset = 1; offset <= preloadBehind; offset += 1) {
            enqueue(desiredFrame - (offset * direction));
        }

        scheduleDraw();
        pumpQueue();
    };

    const dispose = () => {
        disposed = true;
        if (drawRequest) window.cancelAnimationFrame(drawRequest);
        queue = [];
        queued.clear();
        loading.forEach(({controller}) => controller.abort());
        loading.clear();
        cache.forEach(releaseFrame);
        cache.clear();
    };

    resize();
    return {requestFrame, resize, dispose};
};

export function ArchitecturalProcessStory() {
    const rootRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const posterRef = useRef<HTMLImageElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const progressNumberRef = useRef<HTMLSpanElement | null>(null);
    const rendererRef = useRef<FrameSequenceRenderer | null>(null);
    const desiredFrameRef = useRef(0);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isNearSequence, setIsNearSequence] = useState(false);
    const [tier, setTier] = useState<SequenceTier>(() => (
        typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
            ? "mobile"
            : "desktop"
    ));

    useEffect(() => {
        const query = window.matchMedia("(max-width: 767px)");
        const updateTier = () => setTier(query.matches ? "mobile" : "desktop");
        query.addEventListener("change", updateTier);
        return () => query.removeEventListener("change", updateTier);
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || prefersReducedMotion) return;

        const sequenceStage = root.querySelector<HTMLElement>("[data-process-sequence]");
        if (!sequenceStage) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setIsNearSequence(true);
            observer.disconnect();
        }, {rootMargin: "125% 0px"});

        observer.observe(sequenceStage);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isNearSequence || prefersReducedMotion) return;

        const basePath = tier === "desktop"
            ? processStory.sequence.desktopBasePath
            : processStory.sequence.mobileBasePath;
        const renderer = createFrameSequenceRenderer({
            canvas,
            tier,
            frameCount: processStory.sequence.frameCount,
            basePath,
            onFirstDraw: () => {
                if (posterRef.current) posterRef.current.style.opacity = "0";
                if (loaderRef.current) loaderRef.current.style.opacity = "0";
            },
        });
        rendererRef.current = renderer;
        renderer.requestFrame(desiredFrameRef.current);

        const resizeObserver = new ResizeObserver(renderer.resize);
        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.disconnect();
            renderer.dispose();
            rendererRef.current = null;
        };
    }, [isNearSequence, prefersReducedMotion, tier]);

    useGSAP(() => {
        const root = rootRef.current;
        if (!root) return;

        const prelude = root.querySelector<HTMLElement>("[data-process-prelude]");
        const headingParts = gsap.utils.toArray<HTMLElement>("[data-process-heading-part]", prelude ?? undefined);
        const introCopy = prelude?.querySelector<HTMLElement>("[data-process-intro-copy]");
        const aperture = prelude?.querySelector<HTMLElement>("[data-process-aperture]");
        const ledgerItems = gsap.utils.toArray<HTMLElement>("[data-process-ledger-item]", prelude ?? undefined);
        const railTrack = prelude?.querySelector<HTMLElement>("[data-process-rail-track]");
        const sequenceSection = root.querySelector<HTMLElement>("[data-process-sequence]");
        const stage = sequenceSection?.querySelector<HTMLElement>("[data-process-stage]");
        const captions = gsap.utils.toArray<HTMLElement>("[data-process-caption]", stage ?? undefined);
        const progressBar = stage?.querySelector<HTMLElement>("[data-process-progress-bar]");
        const mediaWash = stage?.querySelector<HTMLElement>("[data-process-media-wash]");
        const introTargets = [...headingParts, introCopy, aperture, ...ledgerItems]
            .filter((target): target is HTMLElement => Boolean(target));
        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                mobile: "(max-width: 767px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (mediaContext) => {
                const {desktop, reduceMotion} = mediaContext.conditions as {
                    desktop: boolean;
                    reduceMotion: boolean;
                };

                if (reduceMotion) {
                    gsap.set(introTargets, {
                        clearProps: "all",
                        autoAlpha: 1,
                    });
                    return;
                }

                if (prelude && introCopy && aperture) {
                    gsap.set(headingParts, {
                        yPercent: 118,
                        rotation: 1.2,
                        transformOrigin: "left bottom",
                        willChange: "transform",
                    });
                    gsap.set(introCopy, {y: 24, autoAlpha: 0});
                    gsap.set(aperture, {scale: 0.78, rotation: -2, transformOrigin: "center"});
                    gsap.set(ledgerItems, {y: 22, autoAlpha: 0});

                    gsap.timeline({
                        defaults: {ease: motionEases.enter},
                        scrollTrigger: {
                            trigger: prelude,
                            start: "top 68%",
                            end: "top 10%",
                            toggleActions: "play none none reverse",
                        },
                    })
                        .to(headingParts, {
                            yPercent: 0,
                            rotation: 0,
                            duration: 1.22,
                            stagger: 0.11,
                        }, 0)
                        .to(aperture, {
                            scale: 1,
                            rotation: 0,
                            duration: 1.35,
                            ease: motionEases.reveal,
                        }, 0.18)
                        .to(introCopy, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.92,
                        }, 0.44)
                        .to(ledgerItems, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.82,
                            stagger: 0.07,
                        }, 0.58);

                    if (railTrack) {
                        const railTween = gsap.to(railTrack, {
                            xPercent: -50,
                            duration: 34,
                            repeat: -1,
                            ease: "none",
                            paused: true,
                        });

                        ScrollTrigger.create({
                            trigger: prelude,
                            start: "top bottom",
                            end: "bottom top",
                            onEnter: () => railTween.play(),
                            onEnterBack: () => railTween.play(),
                            onLeave: () => railTween.pause(),
                            onLeaveBack: () => railTween.pause(),
                        });
                    }
                }

                if (!sequenceSection || !stage || !progressBar || !mediaWash || captions.length === 0) return;

                const playhead = {frame: 0};
                const lastFrame = processStory.sequence.frameCount - 1;
                gsap.set(captions, {y: 34, autoAlpha: 0});
                gsap.set(captions[0], {y: 0, autoAlpha: 1});
                gsap.set(progressBar, {scaleY: 0, transformOrigin: "top center"});

                const storyTimeline = gsap.timeline({
                    defaults: {ease: motionEases.enter},
                    scrollTrigger: {
                        trigger: sequenceSection,
                        start: "top top",
                        end: () => desktop ? "+=720%" : "+=620%",
                        pin: stage,
                        scrub: desktop ? 0.78 : 0.48,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                storyTimeline.to(playhead, {
                    frame: lastFrame,
                    duration: 1,
                    ease: "none",
                    onUpdate: () => {
                        const nextFrame = clampFrame(playhead.frame, processStory.sequence.frameCount);
                        desiredFrameRef.current = nextFrame;
                        rendererRef.current?.requestFrame(nextFrame);
                        if (progressNumberRef.current) {
                            progressNumberRef.current.textContent = `${Math.round((nextFrame / lastFrame) * 100)}%`;
                        }
                    },
                }, 0);
                storyTimeline.to(progressBar, {scaleY: 1, duration: 1, ease: "none"}, 0);
                storyTimeline.to(mediaWash, {
                    opacity: desktop ? 0.42 : 0.7,
                    duration: 0.16,
                    ease: motionEases.settle,
                }, 0.68);

                processStory.chapters.forEach((chapter, index) => {
                    const caption = captions[index];
                    if (!caption) return;
                    const revealDuration = Math.min(0.055, Math.max(0.032, (chapter.end - chapter.start) * 0.24));
                    const exitDuration = index === captions.length - 1 ? 0 : Math.min(0.045, revealDuration);

                    if (index > 0) {
                        storyTimeline.to(caption, {
                            y: 0,
                            autoAlpha: 1,
                            duration: revealDuration,
                            ease: motionEases.enter,
                        }, chapter.start + 0.01);
                    }

                    if (index < captions.length - 1) {
                        storyTimeline.to(caption, {
                            y: -24,
                            autoAlpha: 0,
                            duration: exitDuration,
                            ease: motionEases.depart,
                        }, chapter.end - exitDuration - 0.008);
                    }
                });
            },
        );

        return () => matchMedia.revert();
    }, {scope: rootRef});

    return (
        <section ref={rootRef} className="relative z-[2] overflow-x-clip bg-[#f4f1ea] text-[#171717]">
            <div
                data-process-prelude
                className="relative isolate flex min-h-[145svh] flex-col justify-between overflow-hidden px-5 py-28 md:min-h-[160svh] md:px-10 md:py-40 lg:px-16"
            >
                <div className="relative z-[1] mx-auto flex w-full max-w-[120rem] flex-1 flex-col justify-center">
                    <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.18em] text-black/48 md:mb-12 md:text-xs">
                        {processStory.intro.eyebrow}
                    </p>
                    <h2 className="max-w-[92rem] text-[clamp(3.5rem,8.7vw,9.6rem)] font-normal leading-[0.84] tracking-[-0.067em]">
                        <span className="block overflow-hidden pb-[0.08em]">
                            <span data-process-heading-part className="block">{processStory.intro.headingLead}</span>
                        </span>
                        <span className="flex flex-wrap items-center gap-x-[0.16em] overflow-hidden pb-[0.1em]">
                            <figure
                                data-process-aperture
                                className="mt-[0.07em] aspect-[16/9] w-[clamp(5.25rem,13vw,14rem)] shrink-0 overflow-hidden bg-[#ded9cf]"
                            >
                                <img
                                    src={processStory.sequence.poster}
                                    alt="The first frame of the architectural process film"
                                    className="h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.035]"
                                    loading="lazy"
                                />
                            </figure>
                            <span data-process-heading-part className="block">{processStory.intro.headingTail}</span>
                        </span>
                    </h2>

                    <div className="mt-16 grid items-end gap-10 md:mt-24 md:grid-cols-[minmax(0,1fr)_minmax(20rem,35rem)]">
                        <p
                            data-process-intro-copy
                            className="max-w-[44rem] text-[clamp(1.35rem,2.2vw,2.35rem)] leading-[1.08] tracking-[-0.035em] text-black/72"
                        >
                            {processStory.intro.description}
                        </p>
                        <div className="flex items-center gap-4 md:justify-self-end">
                            <span className="h-px w-12 bg-black/40 md:w-20"/>
                            <span className="text-[11px] uppercase tracking-[0.16em] text-black/54">
                                {processStory.intro.scrollPrompt}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative z-[1] mx-auto mt-24 w-full max-w-[120rem] md:mt-36">
                    <div className="grid grid-flow-dense grid-cols-2 border-l border-t border-black/20 md:grid-cols-4">
                        {processStory.ledger.map((item) => (
                            <article
                                key={item.title}
                                data-process-ledger-item
                                className="min-h-44 border-b border-r border-black/20 p-5 md:min-h-48 md:p-7"
                            >
                                <h3 className="text-base tracking-[-0.025em] md:text-lg">{item.title}</h3>
                                <p className="mt-12 max-w-[17rem] text-sm leading-[1.35] text-black/50 md:mt-14 md:text-[15px]">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-8 z-[1] overflow-hidden border-y border-black/14 py-3 md:bottom-10">
                    <div data-process-rail-track className="flex w-max will-change-transform">
                        {[0, 1].map((setIndex) => (
                            <div key={setIndex} className="flex shrink-0 items-center" aria-hidden={setIndex === 1}>
                                {processStory.rail.map((word) => (
                                    <span key={`${setIndex}-${word}`} className="flex items-center text-[11px] uppercase tracking-[0.2em] text-black/46">
                                        <span className="px-6 md:px-10">{word}</span>
                                        <span className="h-1 w-1 rounded-full bg-black/30"/>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {prefersReducedMotion ? (
                <ReducedMotionProcessStory/>
            ) : (
                <section data-process-sequence className="relative min-h-svh bg-[#11110f] text-[#f7f4ed]">
                    <div data-process-stage className="relative h-svh w-full overflow-hidden bg-[#11110f]">
                        <img
                            ref={posterRef}
                            src={processStory.sequence.poster}
                            alt="Architectural drawing and material samples on a studio table"
                            className="absolute inset-0 h-full w-full bg-[#11110f] object-contain opacity-100 transition-opacity duration-150"
                        />
                        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full"/>
                        <div
                            data-process-media-wash
                            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.7] [background:linear-gradient(90deg,rgba(12,12,10,0.66)_0%,rgba(12,12,10,0.19)_40%,rgba(12,12,10,0.01)_68%),linear-gradient(0deg,rgba(12,12,10,0.5)_0%,transparent_48%)] md:opacity-[0.44]"
                        />
                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"/>

                        <header className="absolute inset-x-0 top-0 z-[2] flex items-center border-b border-white/18 px-5 py-5 md:px-8 md:py-6">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-white/72 md:text-xs">
                                {processStory.sequence.title}
                            </p>
                            <span ref={progressNumberRef} className="ml-5 border-l border-white/24 pl-5 font-mono text-[11px] tabular-nums tracking-[0.08em] text-white/56">
                                0%
                            </span>
                        </header>

                        <div className="absolute bottom-8 left-5 top-24 z-[2] hidden w-px bg-white/18 mix-blend-difference md:left-auto md:right-8 md:block">
                            <span data-process-progress-bar className="block h-full w-px bg-[#f7f4ed] will-change-transform"/>
                        </div>

                        <div className="absolute inset-x-5 bottom-10 z-[2] h-[19rem] md:inset-x-auto md:bottom-16 md:left-8 md:h-[22rem] md:w-[min(48rem,56vw)] lg:left-16">
                            {processStory.chapters.map((chapter) => (
                                <article
                                    key={chapter.id}
                                    data-process-caption
                                    className="absolute inset-x-0 bottom-0 will-change-[transform,opacity]"
                                >
                                    <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/58 md:text-xs">
                                        {chapter.discipline}
                                    </p>
                                    <h3 className="max-w-[48rem] text-[clamp(2.55rem,5.4vw,6rem)] font-normal leading-[0.9] tracking-[-0.058em]">
                                        {chapter.title}
                                    </h3>
                                    <p className="mt-6 max-w-[35rem] text-[15px] leading-[1.4] text-white/66 md:mt-8 md:text-lg">
                                        {chapter.description}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div
                            ref={loaderRef}
                            className="absolute bottom-5 right-5 z-[3] flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/46 transition-opacity duration-150 md:bottom-7 md:right-14"
                        >
                            <span className="h-px w-8 bg-white/40"/>
                            Preparing sequence
                        </div>
                    </div>
                </section>
            )}

            <section className="flex min-h-[88svh] items-center bg-[#11110f] px-5 py-28 text-[#f7f4ed] md:px-10 md:py-40 lg:px-16">
                <div className="mx-auto grid w-full max-w-[120rem] gap-16 border-t border-white/20 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:pt-12">
                    <div>
                        <p className="mb-8 text-[11px] uppercase tracking-[0.18em] text-white/46 md:text-xs">
                            {processStory.outro.eyebrow}
                        </p>
                        <h2 className="max-w-[72rem] text-[clamp(3.8rem,9vw,10rem)] font-normal leading-[0.86] tracking-[-0.065em]">
                            {processStory.outro.title}
                        </h2>
                        <p className="mt-10 max-w-[36rem] text-lg leading-[1.35] text-white/58 md:text-xl">
                            {processStory.outro.description}
                        </p>
                    </div>
                    <Link
                        to={processStory.outro.actionHref}
                        data-cursor=""
                        className="group flex min-w-64 items-center justify-between gap-12 border-b border-white/48 py-5 text-sm uppercase tracking-[0.14em] transition-colors duration-500 hover:border-white"
                    >
                        {processStory.outro.actionLabel}
                        <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">&#8594;</span>
                    </Link>
                </div>
            </section>
        </section>
    );
}

function ReducedMotionProcessStory() {
    const basePath = processStory.sequence.mobileBasePath;

    return (
        <section className="bg-[#11110f] px-5 py-28 text-[#f7f4ed] md:px-10 md:py-40 lg:px-16">
            <div className="mx-auto w-full max-w-[120rem]">
                <header className="mb-20 flex items-center justify-between border-b border-white/18 pb-5">
                    <h2 className="text-sm uppercase tracking-[0.16em] text-white/76">{processStory.sequence.title}</h2>
                    <span className="text-xs text-white/42">A still-frame journey</span>
                </header>
                <div className="space-y-28 md:space-y-40">
                    {processStory.chapters.map((chapter) => (
                        <article key={chapter.id} className="grid gap-8 md:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] md:items-end md:gap-16">
                            <img
                                src={frameUrl(basePath, chapter.stillFrame - 1)}
                                alt={chapter.stillAlt}
                                className="aspect-video h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div className="border-t border-white/18 pt-6">
                                <p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-white/48">{chapter.discipline}</p>
                                <h3 className="max-w-[44rem] text-[clamp(2.6rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.052em]">{chapter.title}</h3>
                                <p className="mt-6 max-w-[34rem] text-base leading-[1.45] text-white/58 md:text-lg">{chapter.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
