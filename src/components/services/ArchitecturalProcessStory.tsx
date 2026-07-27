import {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {processStory} from "../../data/processStory";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";
import {motionEases} from "../../lib/motion";
import {
    PROCESS_GRID_LINE_COLOR,
    ProcessCanvasEntranceShader,
} from "./ProcessCanvasEntranceShader";

gsap.registerPlugin(ScrollTrigger);

type SequenceTier = "desktop" | "mobile";

const PROCESS_MOTION_TIMING = {
    desktop: {
        entranceRange: 0.24,
        scrollLength: 640,
    },
    mobile: {
        entranceRange: 0.26,
        scrollLength: 600,
    },
    intro: {
        eyebrowDuration: 0.94,
        eyebrowStagger: 0.11,
        headingDuration: 1.72,
        headingStagger: 0.15,
        apertureDuration: 1.9,
        copyDuration: 1.34,
        cueLineDuration: 1.28,
        cueLabelDuration: 0.98,
    },
    ledgerBorderDuration: 1.18,
    ledgerContentDuration: 1.14,
    gridRevealDuration: 1.85,
    promptRevealDuration: 2.6,
    contentRevealAt: 0.45,
    headerRevealAt: 0.72,
    leadFrameProgress: 0.04,
} as const;

const splitIntoSentences = (text: string) => (
    text.match(/[^.!?]+(?:[.!?]+|$)/g)
        ?.map((sentence) => sentence.trim())
        .filter(Boolean)
    ?? [text]
);

interface CachedFrame {
    image: ImageBitmap | HTMLImageElement;
    width: number;
    height: number;
    lastUsed: number;
}

interface ActiveFrameLoad {
    controller: AbortController;
    startedAt: number;
}

interface FrameSequenceRenderer {
    requestFrame: (index: number) => void;
    resize: () => void;
    dispose: () => void;
}

interface CreateFrameSequenceRendererOptions {
    canvas: HTMLCanvasElement;
    backdropCanvas: HTMLCanvasElement;
    tier: SequenceTier;
    frameCount: number;
    basePath: string;
    onFirstDraw: () => void;
}

interface SequenceFocalStop {
    progress: number;
    y: number;
}

const DESKTOP_SEQUENCE_FOCAL_STOPS: SequenceFocalStop[] = [
    {progress: 0, y: 0.5},
    {progress: 0.48, y: 0.5},
    {progress: 0.68, y: 0.38},
    {progress: 1, y: 0.34},
];

const clampFrameIndex = (frame: number, frameCount: number) => (
    Math.max(0, Math.min(frameCount - 1, Math.round(frame)))
);

const getDesktopSequenceFocalY = (frameIndex: number, frameCount: number) => {
    const progress = frameCount > 1 ? frameIndex / (frameCount - 1) : 0;
    const nextStopIndex = DESKTOP_SEQUENCE_FOCAL_STOPS.findIndex(
        (stop) => stop.progress >= progress,
    );

    if (nextStopIndex <= 0) return DESKTOP_SEQUENCE_FOCAL_STOPS[0].y;

    const previousStop = DESKTOP_SEQUENCE_FOCAL_STOPS[nextStopIndex - 1];
    const nextStop = DESKTOP_SEQUENCE_FOCAL_STOPS[nextStopIndex];
    const stopRange = nextStop.progress - previousStop.progress;
    const localProgress = stopRange > 0
        ? (progress - previousStop.progress) / stopRange
        : 1;
    const easedProgress = localProgress * localProgress * (3 - 2 * localProgress);

    return gsap.utils.interpolate(previousStop.y, nextStop.y, easedProgress);
};

const frameUrl = (basePath: string, zeroBasedIndex: number) => (
    `${basePath}/frame_${String(zeroBasedIndex + 1).padStart(4, "0")}.webp`
);

const createFrameSequenceRenderer = ({
    canvas,
    backdropCanvas,
    tier,
    frameCount,
    basePath,
    onFirstDraw,
}: CreateFrameSequenceRendererOptions): FrameSequenceRenderer => {
    const context = canvas.getContext("2d");
    const backdropContext = backdropCanvas.getContext("2d", {alpha: false});
    if (!context || !backdropContext) {
        return {
            requestFrame: () => undefined,
            resize: () => undefined,
            dispose: () => undefined,
        };
    }

    const deviceMemory = (
        navigator as Navigator & {deviceMemory?: number}
    ).deviceMemory ?? 4;
    const processorCount = navigator.hardwareConcurrency || 4;
    const constrainedDevice = deviceMemory <= 4 || processorCount <= 4;
    const densePreloadAhead = constrainedDevice
        ? (tier === "desktop" ? 9 : 7)
        : (tier === "desktop" ? 16 : 12);
    const sparsePreloadDistance = constrainedDevice
        ? (tier === "desktop" ? 42 : 32)
        : (tier === "desktop" ? 64 : 48);
    const sparsePreloadStep = constrainedDevice ? 8 : 10;
    const preloadBehind = constrainedDevice
        ? (tier === "desktop" ? 4 : 3)
        : (tier === "desktop" ? 7 : 5);
    const cacheLimit = constrainedDevice
        ? (tier === "desktop" ? 18 : 14)
        : (tier === "desktop" ? 28 : 20);
    const maxConcurrentLoads = constrainedDevice
        ? 3
        : (tier === "desktop" ? 6 : 4);
    const maxCanvasWidth = tier === "desktop" ? 1920 : 1280;
    const maxBackdropWidth = constrainedDevice ? 420 : 640;
    const sourceWidth = tier === "desktop" ? 1920 : 1280;
    const sourceHeight = tier === "desktop" ? 1080 : 720;
    const pixelRatioLimit = constrainedDevice ? 1 : 1.25;
    const cache = new Map<number, CachedFrame>();
    const loading = new Map<number, ActiveFrameLoad>();
    const queued = new Set<number>();
    let queue: number[] = [];
    let desiredFrame = 0;
    let direction: -1 | 1 = 1;
    let drawnPosition = -1;
    let drawRequest = 0;
    let forceNextDraw = false;
    let disposed = false;
    let hasDrawn = false;

    const resize = () => {
        const cssWidth = Math.max(1, canvas.clientWidth);
        const cssHeight = Math.max(1, canvas.clientHeight);
        const pixelRatio = Math.min(
            window.devicePixelRatio,
            maxCanvasWidth / cssWidth,
            pixelRatioLimit,
        );
        const nextWidth = Math.max(1, Math.round(cssWidth * pixelRatio));
        const nextHeight = Math.max(1, Math.round(cssHeight * pixelRatio));
        const backdropRatio = Math.min(1, maxBackdropWidth / cssWidth);
        const nextBackdropWidth = Math.max(1, Math.round(cssWidth * backdropRatio));
        const nextBackdropHeight = Math.max(1, Math.round(cssHeight * backdropRatio));

        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
            forceNextDraw = true;
            scheduleDraw();
        }
        if (
            backdropCanvas.width !== nextBackdropWidth
            || backdropCanvas.height !== nextBackdropHeight
        ) {
            backdropCanvas.width = nextBackdropWidth;
            backdropCanvas.height = nextBackdropHeight;
            forceNextDraw = true;
            scheduleDraw();
        }
    };

    const drawImage = (
        targetContext: CanvasRenderingContext2D,
        targetCanvas: HTMLCanvasElement,
        frame: CachedFrame,
        frameIndex: number,
        mode: "cover" | "contain",
    ) => {
        const canvasWidth = targetCanvas.width;
        const canvasHeight = targetCanvas.height;
        const imageRatio = frame.width / frame.height;
        const canvasRatio = canvasWidth / canvasHeight;
        const renderWidth = mode === "cover"
            ? (
                canvasRatio > imageRatio
                    ? canvasWidth
                    : canvasHeight * imageRatio
            )
            : (
                canvasRatio > imageRatio
                    ? canvasHeight * imageRatio
                    : canvasWidth
            );
        const renderHeight = renderWidth / imageRatio;
        const offsetX = (canvasWidth - renderWidth) * 0.5;
        const focalY = tier === "mobile"
            ? 0.26
            : getDesktopSequenceFocalY(frameIndex, frameCount);
        const offsetY = (canvasHeight - renderHeight) * (
            mode === "cover" ? focalY : 0.5
        );

        targetContext.drawImage(frame.image, offsetX, offsetY, renderWidth, renderHeight);
        frame.lastUsed = performance.now();
        if (targetCanvas === canvas) {
            targetCanvas.dataset.processFocalY = focalY.toFixed(3);
            targetCanvas.dataset.processFit = mode;
        }
    };

    const draw = (frame: CachedFrame, frameIndex: number) => {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        backdropContext.fillStyle = "#11110f";
        backdropContext.fillRect(
            0,
            0,
            backdropCanvas.width,
            backdropCanvas.height,
        );
        backdropContext.imageSmoothingEnabled = true;
        backdropContext.imageSmoothingQuality = "medium";
        drawImage(
            backdropContext,
            backdropCanvas,
            frame,
            frameIndex,
            "cover",
        );

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        drawImage(
            context,
            canvas,
            frame,
            frameIndex,
            tier === "desktop" ? "contain" : "cover",
        );

        if (!hasDrawn) {
            hasDrawn = true;
            onFirstDraw();
        }
    };

    const drawClosestFrame = (force = false) => {
        const exactIndex = clampFrameIndex(desiredFrame, frameCount);
        const exactFrame = cache.get(exactIndex);
        if (exactFrame) {
            if (!force && drawnPosition === exactIndex) return;
            draw(exactFrame, exactIndex);
            drawnPosition = exactIndex;
            canvas.dataset.processFrame = String(exactIndex + 1);
            canvas.dataset.processFrameGap = "0";
            return;
        }

        let nearestFrame: CachedFrame | undefined;
        let nearestIndex = -1;
        let nearestScore = Number.POSITIVE_INFINITY;
        cache.forEach((frame, index) => {
            const distance = Math.abs(index - desiredFrame);
            const isAheadOfMotion = (index - desiredFrame) * direction > 0;
            const score = distance + (isAheadOfMotion ? 0.35 : 0);
            if (score < nearestScore) {
                nearestScore = score;
                nearestFrame = frame;
                nearestIndex = index;
            }
        });

        if (
            nearestFrame
            && (force || drawnPosition !== nearestIndex)
        ) {
            draw(nearestFrame, nearestIndex);
            drawnPosition = nearestIndex;
            canvas.dataset.processFrame = String(nearestIndex + 1);
            canvas.dataset.processFrameGap = String(Math.abs(nearestIndex - exactIndex));
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

        const exactIndex = clampFrameIndex(desiredFrame, frameCount);
        const evictionCandidates = Array.from(cache.entries())
            .filter(([index]) => index !== exactIndex)
            .sort(([indexA, frameA], [indexB, frameB]) => {
                const distanceDifference = Math.abs(indexB - desiredFrame) - Math.abs(indexA - desiredFrame);
                return distanceDifference || frameA.lastUsed - frameB.lastUsed;
            });

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
            const sourceRatio = sourceWidth / sourceHeight;
            const canvasRatio = canvas.width / Math.max(canvas.height, 1);
            const coverWidth = canvasRatio > sourceRatio
                ? canvas.width
                : canvas.height * sourceRatio;
            const coverHeight = coverWidth / sourceRatio;
            const resizeScale = Math.min(
                1,
                sourceWidth / Math.max(coverWidth, 1),
                sourceHeight / Math.max(coverHeight, 1),
            );
            const resizeWidth = Math.max(1, Math.round(coverWidth * resizeScale));
            const resizeHeight = Math.max(1, Math.round(coverHeight * resizeScale));
            let image: ImageBitmap;

            try {
                image = await window.createImageBitmap(blob, {
                    resizeWidth,
                    resizeHeight,
                    resizeQuality: "high",
                });
            } catch {
                image = await window.createImageBitmap(blob);
            }
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
            loading.set(index, {
                controller,
                startedAt: performance.now(),
            });

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

    const enqueue = (index: number) => {
        const safeIndex = clampFrameIndex(index, frameCount);
        if (cache.has(safeIndex) || loading.has(safeIndex) || queued.has(safeIndex)) return;
        queued.add(safeIndex);
        queue.push(safeIndex);
    };

    const requestFrame = (index: number) => {
        const nextFrame = clampFrameIndex(index, frameCount);
        if (nextFrame !== desiredFrame) direction = nextFrame > desiredFrame ? 1 : -1;
        desiredFrame = nextFrame;
        canvas.dataset.processRequestedFrame = String(nextFrame + 1);
        if (drawnPosition >= 0) {
            canvas.dataset.processFrameGap = String(Math.abs(drawnPosition - nextFrame));
        }

        loading.forEach(({controller, startedAt}, loadingIndex) => {
            const signedDistance = (loadingIndex - desiredFrame) * direction;
            const outsideCorridor = Math.abs(signedDistance) > sparsePreloadDistance;
            const hasHadTimeToResolve = performance.now() - startedAt > 120;
            if (outsideCorridor && hasHadTimeToResolve) controller.abort();
        });

        queue = [];
        queued.clear();
        enqueue(nextFrame);
        for (let offset = 1; offset <= densePreloadAhead; offset += 1) {
            enqueue(nextFrame + offset * direction);
        }
        for (
            let offset = densePreloadAhead + sparsePreloadStep;
            offset <= sparsePreloadDistance;
            offset += sparsePreloadStep
        ) {
            enqueue(nextFrame + offset * direction);
        }
        for (let offset = 1; offset <= preloadBehind; offset += 1) {
            enqueue(nextFrame - offset * direction);
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
    const backdropCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const posterRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const progressNumberRef = useRef<HTMLSpanElement | null>(null);
    const rendererRef = useRef<FrameSequenceRenderer | null>(null);
    const desiredFrameRef = useRef(0);
    const transitionProgressRef = useRef(0);
    const gridRevealRef = useRef(0);
    const promptRevealRef = useRef(0);
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

        let activated = false;
        const preloadDistance = () => window.innerHeight * 3;
        const isWithinPreloadRange = () => {
            const rect = sequenceStage.getBoundingClientRect();
            const distance = preloadDistance();
            return rect.top <= window.innerHeight + distance && rect.bottom >= -distance;
        };
        const activate = () => {
            if (activated) return;
            activated = true;
            setIsNearSequence(true);
            observer.disconnect();
            window.removeEventListener("scroll", checkProximity);
            window.removeEventListener("resize", checkProximity);
        };
        const checkProximity = () => {
            if (isWithinPreloadRange()) activate();
        };
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) activate();
        }, {rootMargin: "300% 0px"});

        observer.observe(sequenceStage);
        window.addEventListener("scroll", checkProximity, {passive: true});
        window.addEventListener("resize", checkProximity);
        checkProximity();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", checkProximity);
            window.removeEventListener("resize", checkProximity);
        };
    }, [prefersReducedMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const backdropCanvas = backdropCanvasRef.current;
        if (!canvas || !backdropCanvas || !isNearSequence || prefersReducedMotion) return;

        const basePath = tier === "desktop"
            ? processStory.sequence.desktopBasePath
            : processStory.sequence.mobileBasePath;
        const renderer = createFrameSequenceRenderer({
            canvas,
            backdropCanvas,
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
        const eyebrowWords = gsap.utils.toArray<HTMLElement>("[data-process-eyebrow-word]", prelude ?? undefined);
        const headingParts = gsap.utils.toArray<HTMLElement>("[data-process-heading-part]", prelude ?? undefined);
        const introCopy = prelude?.querySelector<HTMLElement>("[data-process-intro-copy]");
        const aperture = prelude?.querySelector<HTMLElement>("[data-process-aperture]");
        const scrollPrompt = prelude?.querySelector<HTMLElement>("[data-process-scroll-prompt]");
        const scrollPromptLine = scrollPrompt?.querySelector<HTMLElement>("[data-process-scroll-line]");
        const scrollPromptLabel = scrollPrompt?.querySelector<HTMLElement>("[data-process-scroll-label]");
        const scrollPromptSignal = scrollPrompt?.querySelector<HTMLElement>("[data-process-scroll-signal]");
        const ledger = prelude?.querySelector<HTMLElement>("[data-process-ledger]");
        const ledgerItems = gsap.utils.toArray<HTMLElement>("[data-process-ledger-item]", prelude ?? undefined);
        const ledgerContents = gsap.utils.toArray<HTMLElement>("[data-process-ledger-content]", prelude ?? undefined);
        const ledgerTopBorders = gsap.utils.toArray<HTMLElement>("[data-process-border='top']", prelude ?? undefined);
        const ledgerRightBorders = gsap.utils.toArray<HTMLElement>("[data-process-border='right']", prelude ?? undefined);
        const ledgerBottomBorders = gsap.utils.toArray<HTMLElement>("[data-process-border='bottom']", prelude ?? undefined);
        const ledgerLeftBorders = gsap.utils.toArray<HTMLElement>("[data-process-border='left']", prelude ?? undefined);
        const ledgerBorders = [
            ...ledgerTopBorders,
            ...ledgerRightBorders,
            ...ledgerBottomBorders,
            ...ledgerLeftBorders,
        ];
        const sequenceSection = root.querySelector<HTMLElement>("[data-process-sequence]");
        const stage = sequenceSection?.querySelector<HTMLElement>("[data-process-stage]");
        const captions = gsap.utils.toArray<HTMLElement>("[data-process-caption]", stage ?? undefined);
        const captionRules = gsap.utils.toArray<HTMLElement>("[data-process-caption-rule]", stage ?? undefined);
        const captionDisciplines = gsap.utils.toArray<HTMLElement>("[data-process-caption-discipline]", stage ?? undefined);
        const captionTitleSentences = gsap.utils.toArray<HTMLElement>("[data-process-caption-title-sentence]", stage ?? undefined);
        const captionDescriptionSentences = gsap.utils.toArray<HTMLElement>("[data-process-caption-description-sentence]", stage ?? undefined);
        const headerTitle = stage?.querySelector<HTMLElement>("[data-process-header-title]");
        const headerDivider = stage?.querySelector<HTMLElement>("[data-process-header-divider]");
        const headerProgress = stage?.querySelector<HTMLElement>("[data-process-header-progress]");
        const progressTrack = stage?.querySelector<HTMLElement>("[data-process-progress-track]");
        const progressBar = stage?.querySelector<HTMLElement>("[data-process-progress-bar]");
        const progressMarker = stage?.querySelector<HTMLElement>("[data-process-progress-marker]");
        const mediaWash = stage?.querySelector<HTMLElement>("[data-process-media-wash]");
        const transitionGuard = stage?.querySelector<HTMLElement>("[data-process-transition-guard]");
        const introTargets = [
            ...eyebrowWords,
            ...headingParts,
            introCopy,
            aperture,
            scrollPromptLine,
            scrollPromptLabel,
            ...ledgerItems,
            ...ledgerContents,
            ...ledgerBorders,
        ]
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
                    transitionProgressRef.current = 1;
                    gridRevealRef.current = 1;
                    promptRevealRef.current = 1;
                    gsap.set(introTargets, {
                        clearProps: "all",
                        autoAlpha: 1,
                    });
                    if (scrollPromptSignal) {
                        gsap.set(scrollPromptSignal, {autoAlpha: 0});
                    }
                    if (transitionGuard) {
                        gsap.set(transitionGuard, {autoAlpha: 0});
                    }
                    return;
                }

                if (prelude && introCopy && aperture) {
                    gsap.set(eyebrowWords, {
                        y: desktop ? 12 : 8,
                        autoAlpha: 0,
                        filter: "blur(4px)",
                        willChange: "transform, opacity, filter",
                    });
                    gsap.set(headingParts, {
                        y: desktop ? 150 : 76,
                        rotation: 1.2,
                        transformOrigin: "left bottom",
                        willChange: "transform",
                    });
                    gsap.set(introCopy, {
                        x: desktop ? -22 : -14,
                        y: desktop ? 12 : 8,
                        autoAlpha: 0,
                        filter: "blur(3px)",
                        clipPath: "inset(0% 0% 0% 6%)",
                        willChange: "transform, opacity, filter, clip-path",
                    });
                    gsap.set(aperture, {scale: 0.78, rotation: -2, transformOrigin: "center"});
                    if (scrollPromptLine) {
                        gsap.set(scrollPromptLine, {
                            scaleX: 0,
                            transformOrigin: "left center",
                            willChange: "transform",
                        });
                    }
                    if (scrollPromptLabel) {
                        gsap.set(scrollPromptLabel, {
                            x: -12,
                            y: 6,
                            autoAlpha: 0,
                            filter: "blur(3px)",
                            willChange: "transform, opacity, filter",
                        });
                    }
                    if (scrollPromptSignal) {
                        gsap.set(scrollPromptSignal, {
                            x: -32,
                            autoAlpha: 0,
                            willChange: "transform, opacity",
                        });
                    }

                    const introTimeline = gsap.timeline({
                        defaults: {ease: motionEases.cinematic},
                        scrollTrigger: {
                            trigger: prelude,
                            start: "top 68%",
                            end: "top 10%",
                            toggleActions: "play none none reverse",
                        },
                    });

                    introTimeline
                        .to(eyebrowWords, {
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: PROCESS_MOTION_TIMING.intro.eyebrowDuration,
                            stagger: PROCESS_MOTION_TIMING.intro.eyebrowStagger,
                            ease: motionEases.cinematic,
                        }, 0)
                        .to(headingParts, {
                            y: 0,
                            rotation: 0,
                            duration: PROCESS_MOTION_TIMING.intro.headingDuration,
                            stagger: PROCESS_MOTION_TIMING.intro.headingStagger,
                            ease: motionEases.cinematic,
                        }, 0)
                        .to(aperture, {
                            scale: 1,
                            rotation: 0,
                            duration: PROCESS_MOTION_TIMING.intro.apertureDuration,
                            ease: motionEases.cinematic,
                        }, 0.24)
                        .to(introCopy, {
                            x: 0,
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: PROCESS_MOTION_TIMING.intro.copyDuration,
                            ease: motionEases.cinematic,
                        }, 0.66);

                    if (scrollPromptLine) {
                        introTimeline.to(scrollPromptLine, {
                            scaleX: 1,
                            duration: PROCESS_MOTION_TIMING.intro.cueLineDuration,
                            ease: motionEases.cinematic,
                        }, 0.78);
                    }
                    if (scrollPromptLabel) {
                        introTimeline.to(scrollPromptLabel, {
                            x: 0,
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: PROCESS_MOTION_TIMING.intro.cueLabelDuration,
                            ease: motionEases.cinematic,
                        }, 1.02);
                    }

                    if (scrollPrompt && scrollPromptLine && scrollPromptSignal) {
                        gsap.timeline({
                            delay: 2.2,
                            repeat: -1,
                            repeatDelay: 1.7,
                            scrollTrigger: {
                                trigger: scrollPrompt,
                                start: "top 92%",
                                end: "bottom top",
                                toggleActions: "play pause resume pause",
                                invalidateOnRefresh: true,
                            },
                        })
                            .to(scrollPromptSignal, {
                                autoAlpha: 0.9,
                                duration: 0.24,
                                ease: "sine.out",
                            }, 0)
                            .to(scrollPromptSignal, {
                                x: () => scrollPromptLine.offsetWidth + 32,
                                duration: 1.72,
                                ease: "sine.inOut",
                            }, 0)
                            .to(scrollPromptSignal, {
                                autoAlpha: 0,
                                duration: 0.34,
                                ease: "sine.in",
                            }, 1.38);
                    }

                    if (ledger && ledgerBorders.length > 0) {
                        gsap.set(ledgerContents, {
                            y: desktop ? 16 : 10,
                            autoAlpha: 0,
                            willChange: "transform, opacity",
                        });
                        gsap.set([...ledgerTopBorders, ...ledgerBottomBorders], {
                            scaleX: 0,
                            transformOrigin: "left center",
                            willChange: "transform",
                        });
                        gsap.set(ledgerBottomBorders, {
                            transformOrigin: "right center",
                        });
                        gsap.set([...ledgerLeftBorders, ...ledgerRightBorders], {
                            scaleY: 0,
                            transformOrigin: "center top",
                            willChange: "transform",
                        });

                        const ledgerTimeline = gsap.timeline({
                            defaults: {
                                duration: PROCESS_MOTION_TIMING.ledgerBorderDuration,
                                ease: motionEases.cinematic,
                            },
                            scrollTrigger: {
                                trigger: ledger,
                                start: "top 82%",
                                once: true,
                            },
                            onComplete: () => {
                                gsap.set(ledgerBorders, {
                                    clearProps: "transform,transform-origin,will-change",
                                });
                            },
                        });

                        ledgerTimeline
                            .addLabel("origin", 0)
                            .to(ledgerTopBorders, {scaleX: 1}, "origin")
                            .to(ledgerLeftBorders, {scaleY: 1}, "origin")
                            .to(ledgerRightBorders, {scaleY: 1}, "origin")
                            .to(ledgerBottomBorders, {scaleX: 1}, "origin")
                            .to(ledgerContents, {
                                y: 0,
                                autoAlpha: 1,
                                duration: PROCESS_MOTION_TIMING.ledgerContentDuration,
                                ease: motionEases.cinematic,
                                clearProps: "transform,opacity,visibility,will-change",
                            }, "origin+=0.88");
                    }

                }

                if (sequenceSection) {
                    gridRevealRef.current = 0;
                    promptRevealRef.current = 0;

                    gsap.to(gridRevealRef, {
                        current: 1,
                        duration: PROCESS_MOTION_TIMING.gridRevealDuration,
                        ease: motionEases.cinematic,
                        scrollTrigger: {
                            trigger: sequenceSection,
                            start: "top 70%",
                            toggleActions: "play none none reverse",
                        },
                    });

                    gsap.to(promptRevealRef, {
                        current: 1,
                        duration: PROCESS_MOTION_TIMING.promptRevealDuration,
                        ease: motionEases.cinematic,
                        scrollTrigger: {
                            trigger: sequenceSection,
                            start: "top 35%",
                            toggleActions: "play none none reverse",
                        },
                    });
                }

                if (!sequenceSection || !stage || !progressBar || !mediaWash || captions.length === 0) return;

                const playhead = {frame: 0};
                const lastFrame = processStory.sequence.frameCount - 1;
                const timing = desktop
                    ? PROCESS_MOTION_TIMING.desktop
                    : PROCESS_MOTION_TIMING.mobile;
                const entranceRange = timing.entranceRange;
                const storyRange = 1 - entranceRange;
                const contentRevealStart = entranceRange * PROCESS_MOTION_TIMING.contentRevealAt;
                const headerRevealStart = entranceRange * PROCESS_MOTION_TIMING.headerRevealAt;
                const slowFrameEnd = lastFrame * PROCESS_MOTION_TIMING.leadFrameProgress;
                const storyTimeForFrameProgress = (frameProgress: number) => {
                    const clampedProgress = gsap.utils.clamp(0, 1, frameProgress);
                    if (clampedProgress <= PROCESS_MOTION_TIMING.leadFrameProgress) {
                        return contentRevealStart + (
                            clampedProgress / PROCESS_MOTION_TIMING.leadFrameProgress
                        ) * (entranceRange - contentRevealStart);
                    }

                    return entranceRange + (
                        (clampedProgress - PROCESS_MOTION_TIMING.leadFrameProgress)
                        / (1 - PROCESS_MOTION_TIMING.leadFrameProgress)
                    ) * storyRange;
                };
                transitionProgressRef.current = 0;
                gsap.set(captions, {autoAlpha: 0});
                gsap.set(captionRules, {
                    scaleX: 0,
                    transformOrigin: "left center",
                    willChange: "transform",
                });
                gsap.set(captionDisciplines, {
                    xPercent: -105,
                    yPercent: 0,
                    opacity: 0.9,
                    willChange: "transform, opacity",
                });
                gsap.set(captionTitleSentences, {
                    yPercent: 112,
                    opacity: 0.92,
                    willChange: "transform, opacity",
                });
                gsap.set(captionDescriptionSentences, {
                    yPercent: 108,
                    opacity: 0.9,
                    willChange: "transform, opacity",
                });
                gsap.set(progressBar, {scaleY: 0, transformOrigin: "top center"});
                if (progressMarker) {
                    gsap.set(progressMarker, {
                        y: 0,
                        autoAlpha: 0,
                        willChange: "transform, opacity",
                    });
                }
                if (headerTitle) {
                    gsap.set(headerTitle, {
                        yPercent: 115,
                        opacity: 0.92,
                        willChange: "transform, opacity",
                    });
                }
                if (headerDivider) {
                    gsap.set(headerDivider, {
                        scaleY: 0,
                        transformOrigin: "center top",
                        willChange: "transform",
                    });
                }
                if (headerProgress) {
                    gsap.set(headerProgress, {
                        yPercent: 115,
                        opacity: 0.9,
                        willChange: "transform, opacity",
                    });
                }
                if (transitionGuard) {
                    gsap.set(transitionGuard, {autoAlpha: 1});
                }

                const storyTimeline = gsap.timeline({
                    defaults: {ease: motionEases.enter},
                    scrollTrigger: {
                        trigger: sequenceSection,
                        start: "top top",
                        end: () => `+=${timing.scrollLength}%`,
                        pin: stage,
                        scrub: desktop ? 0.35 : 0.5,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                storyTimeline.to(transitionProgressRef, {
                    current: 1,
                    duration: entranceRange,
                    ease: "none",
                }, 0);

                if (transitionGuard) {
                    storyTimeline.to(transitionGuard, {
                        autoAlpha: 0,
                        duration: 0.035,
                        ease: "none",
                    }, 0.018);
                }

                const addCaptionEntrance = (
                    caption: HTMLElement,
                    start: number,
                    duration: number,
                ) => {
                    const rule = caption.querySelector<HTMLElement>("[data-process-caption-rule]");
                    const discipline = caption.querySelector<HTMLElement>("[data-process-caption-discipline]");
                    const titleSentences = gsap.utils.toArray<HTMLElement>(
                        "[data-process-caption-title-sentence]",
                        caption,
                    );
                    const descriptionSentences = gsap.utils.toArray<HTMLElement>(
                        "[data-process-caption-description-sentence]",
                        caption,
                    );

                    storyTimeline.set(caption, {autoAlpha: 1}, start);
                    if (rule) {
                        storyTimeline.to(rule, {
                            scaleX: 1,
                            transformOrigin: "left center",
                            duration: duration * 0.4,
                            ease: motionEases.cinematic,
                        }, start);
                    }
                    if (discipline) {
                        storyTimeline.to(discipline, {
                            xPercent: 0,
                            yPercent: 0,
                            opacity: 1,
                            duration: duration * 0.5,
                            ease: motionEases.cinematic,
                        }, start + duration * 0.08);
                    }
                    storyTimeline.to(titleSentences, {
                        yPercent: 0,
                        opacity: 1,
                        duration: duration * 0.56,
                        stagger: duration * 0.08,
                        ease: motionEases.cinematic,
                    }, start + duration * 0.14);
                    storyTimeline.to(descriptionSentences, {
                        yPercent: 0,
                        opacity: 1,
                        duration: duration * 0.5,
                        stagger: duration * 0.07,
                        ease: motionEases.cinematic,
                    }, start + duration * 0.42);
                };

                const addCaptionExit = (
                    caption: HTMLElement,
                    end: number,
                    duration: number,
                ) => {
                    const rule = caption.querySelector<HTMLElement>("[data-process-caption-rule]");
                    const discipline = caption.querySelector<HTMLElement>("[data-process-caption-discipline]");
                    const titleSentences = gsap.utils.toArray<HTMLElement>(
                        "[data-process-caption-title-sentence]",
                        caption,
                    );
                    const descriptionSentences = gsap.utils.toArray<HTMLElement>(
                        "[data-process-caption-description-sentence]",
                        caption,
                    );
                    const start = end - duration;

                    storyTimeline.to(descriptionSentences, {
                        yPercent: -108,
                        opacity: 0.9,
                        duration: duration * 0.72,
                        stagger: duration * 0.05,
                        ease: motionEases.cinematic,
                    }, start);
                    storyTimeline.to(titleSentences, {
                        yPercent: -112,
                        opacity: 0.92,
                        duration: duration * 0.82,
                        stagger: duration * 0.05,
                        ease: motionEases.cinematic,
                    }, start + duration * 0.08);
                    if (discipline) {
                        storyTimeline.to(discipline, {
                            yPercent: -112,
                            opacity: 0.9,
                            duration: duration * 0.62,
                            ease: motionEases.cinematic,
                        }, start + duration * 0.22);
                    }
                    if (rule) {
                        storyTimeline.to(rule, {
                            scaleX: 0,
                            transformOrigin: "right center",
                            duration: duration * 0.58,
                            ease: motionEases.cinematic,
                        }, start + duration * 0.24);
                    }
                    storyTimeline.set(caption, {autoAlpha: 0}, end);
                };

                addCaptionEntrance(
                    captions[0],
                    contentRevealStart,
                    entranceRange * 0.42,
                );

                if (headerTitle) {
                    storyTimeline.to(headerTitle, {
                        yPercent: 0,
                        opacity: 1,
                        duration: entranceRange * 0.24,
                        ease: motionEases.cinematic,
                    }, headerRevealStart + entranceRange * 0.035);
                }
                if (headerDivider) {
                    storyTimeline.to(headerDivider, {
                        scaleY: 1,
                        duration: entranceRange * 0.18,
                        ease: motionEases.cinematic,
                    }, headerRevealStart + entranceRange * 0.075);
                }
                if (headerProgress) {
                    storyTimeline.to(headerProgress, {
                        yPercent: 0,
                        opacity: 1,
                        duration: entranceRange * 0.22,
                        ease: motionEases.cinematic,
                    }, headerRevealStart + entranceRange * 0.11);
                }

                const updateFrame = () => {
                    const nextFrame = clampFrameIndex(playhead.frame, processStory.sequence.frameCount);
                    desiredFrameRef.current = nextFrame;
                    rendererRef.current?.requestFrame(nextFrame);
                    if (progressNumberRef.current) {
                        progressNumberRef.current.textContent = `${Math.round((nextFrame / lastFrame) * 100)}%`;
                        progressNumberRef.current.dataset.processTargetFrame = String(nextFrame + 1);
                    }
                };

                storyTimeline.to(playhead, {
                    frame: slowFrameEnd,
                    duration: entranceRange - contentRevealStart,
                    ease: "none",
                    onUpdate: updateFrame,
                }, contentRevealStart);
                storyTimeline.to(playhead, {
                    frame: lastFrame,
                    duration: storyRange,
                    ease: "none",
                    onUpdate: updateFrame,
                }, entranceRange);
                storyTimeline.to(progressBar, {
                    scaleY: PROCESS_MOTION_TIMING.leadFrameProgress,
                    duration: entranceRange - contentRevealStart,
                    ease: "none",
                }, contentRevealStart);
                if (progressTrack && progressMarker) {
                    storyTimeline.to(progressMarker, {
                        autoAlpha: 1,
                        duration: 0.018,
                        ease: "none",
                    }, contentRevealStart);
                    storyTimeline.to(progressMarker, {
                        y: () => (
                            progressTrack.clientHeight - progressMarker.offsetHeight
                        ) * PROCESS_MOTION_TIMING.leadFrameProgress,
                        duration: entranceRange - contentRevealStart,
                        ease: "none",
                    }, contentRevealStart);
                }
                storyTimeline.to(progressBar, {
                    scaleY: 1,
                    duration: storyRange,
                    ease: "none",
                }, entranceRange);
                if (progressTrack && progressMarker) {
                    storyTimeline.to(progressMarker, {
                        y: () => progressTrack.clientHeight - progressMarker.offsetHeight,
                        duration: storyRange,
                        ease: "none",
                    }, entranceRange);
                }
                storyTimeline.to(mediaWash, {
                    opacity: desktop ? 0.42 : 0.7,
                    duration: 0.16,
                    ease: motionEases.settle,
                }, storyTimeForFrameProgress(0.68));

                processStory.chapters.forEach((chapter, index) => {
                    const caption = captions[index];
                    if (!caption) return;
                    const revealDuration = Math.min(
                        0.075,
                        Math.max(0.048, (chapter.end - chapter.start) * 0.32),
                    ) * storyRange;
                    const exitDuration = index === captions.length - 1
                        ? 0
                        : Math.min(0.058 * storyRange, revealDuration * 0.92);
                    const chapterStart = storyTimeForFrameProgress(chapter.start);
                    const chapterEnd = storyTimeForFrameProgress(chapter.end);

                    if (index > 0) {
                        addCaptionEntrance(caption, chapterStart + 0.006, revealDuration);
                    }

                    if (index < captions.length - 1) {
                        addCaptionExit(caption, chapterEnd - 0.004, exitDuration);
                    }
                });
            },
        );

        return () => matchMedia.revert();
    }, {scope: rootRef});

    return (
        <section ref={rootRef} className="relative z-[2] overflow-x-clip bg-white text-[#171717]">
            <div
                data-process-prelude
                className="relative isolate flex min-h-svh flex-col justify-start overflow-hidden py-14 md:py-16"
            >
                <div className="viewport-container relative z-[1] flex flex-none flex-col justify-start">
                    <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.18em] text-black/48 md:mb-12 md:text-xs">
                        {processStory.intro.eyebrow.split(" ").map((word, index, words) => (
                            <span key={`${word}-${index}`}>
                                <span data-process-eyebrow-word className="inline-block">
                                    {word}
                                </span>
                                {index < words.length - 1 ? " " : null}
                            </span>
                        ))}
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
                        <div data-process-scroll-prompt className="flex items-center gap-4 md:justify-self-end">
                            <span
                                data-process-scroll-line
                                aria-hidden="true"
                                className="relative h-px w-12 overflow-hidden bg-black/32 md:w-20"
                            >
                                <span
                                    data-process-scroll-signal
                                    className="absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-transparent via-black/70 to-transparent"
                                />
                            </span>
                            <span
                                data-process-scroll-label
                                className="text-[11px] uppercase tracking-[0.16em] text-black/54"
                            >
                                {processStory.intro.scrollPrompt}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="viewport-container relative z-[1] mt-16 pb-10 md:mt-24 md:pb-14">
                    <div data-process-ledger className="grid grid-flow-dense grid-cols-2 md:grid-cols-4">
                        {processStory.ledger.map((item, index) => (
                            <article
                                key={item.title}
                                data-process-ledger-item
                                className="relative min-h-44 p-5 md:min-h-48 md:p-7"
                            >
                                <span
                                    data-process-border="top"
                                    aria-hidden="true"
                                    className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
                                        index >= 2 ? "hidden md:block" : ""
                                    }`}
                                    style={{backgroundColor: PROCESS_GRID_LINE_COLOR}}
                                />
                                <span data-process-border="right" aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{backgroundColor: PROCESS_GRID_LINE_COLOR}}/>
                                <span data-process-border="bottom" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{backgroundColor: PROCESS_GRID_LINE_COLOR}}/>
                                {(index === 0 || index === 2) && (
                                    <span
                                        data-process-border="left"
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute inset-y-0 left-0 w-px ${
                                            index === 2 ? "md:hidden" : ""
                                        }`}
                                        style={{backgroundColor: PROCESS_GRID_LINE_COLOR}}
                                    />
                                )}
                                <div data-process-ledger-content>
                                    <h3 className="text-base tracking-[-0.025em] md:text-lg">{item.title}</h3>
                                    <p className="mt-12 max-w-[17rem] text-sm leading-[1.35] text-black/50 md:mt-14 md:text-[15px]">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

            </div>

            {prefersReducedMotion ? (
                <ReducedMotionProcessStory/>
            ) : (
                <section data-process-sequence className="relative min-h-svh bg-[#11110f] text-white">
                    <div data-process-stage className="relative h-svh w-full overflow-hidden bg-[#11110f]">
                        <div
                            ref={posterRef}
                            className="absolute inset-0 overflow-hidden bg-[#11110f] opacity-100 transition-opacity duration-150"
                        >
                            <img
                                src={processStory.sequence.poster}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 blur-2xl"
                            />
                            <img
                                src={processStory.sequence.poster}
                                alt="Architectural drawing and material samples on a studio table"
                                className="absolute inset-0 h-full w-full object-contain"
                            />
                        </div>
                        <canvas
                            ref={backdropCanvasRef}
                            aria-hidden="true"
                            className="absolute inset-[-2rem] h-[calc(100%+4rem)] w-[calc(100%+4rem)] scale-[1.03] opacity-75 blur-xl"
                        />
                        <canvas
                            ref={canvasRef}
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full"
                        />
                        <div
                            data-process-media-wash
                            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.7] [background:linear-gradient(90deg,rgba(12,12,10,0.66)_0%,rgba(12,12,10,0.19)_40%,rgba(12,12,10,0.01)_68%),linear-gradient(0deg,rgba(12,12,10,0.5)_0%,transparent_48%)] md:opacity-[0.44]"
                        />
                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"/>
                        <div
                            data-process-transition-guard
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-[8] bg-white"
                        />
                        <ProcessCanvasEntranceShader
                            progressRef={transitionProgressRef}
                            gridRevealRef={gridRevealRef}
                            promptRevealRef={promptRevealRef}
                            prompt={processStory.gridPrompt}
                            className="pointer-events-none absolute inset-0 z-[9] h-full w-full"
                        />
                        <p className="sr-only">
                            {processStory.gridPrompt.titleLines.join(" ")}{" "}
                            {processStory.gridPrompt.cue}
                        </p>

                        <header
                            data-process-header
                            className="absolute inset-x-0 top-0 z-[2] flex items-center overflow-hidden px-[var(--spacing-viewport-gutter)] py-5 md:py-6"
                        >
                            <span className="block overflow-hidden">
                                <span
                                    data-process-header-title
                                    className="block text-[11px] uppercase tracking-[0.18em] text-white md:text-xs"
                                >
                                    {processStory.sequence.title}
                                </span>
                            </span>
                            <span
                                data-process-header-divider
                                aria-hidden="true"
                                className="ml-5 h-4 w-px shrink-0 bg-white/70"
                            />
                            <span className="ml-5 block overflow-hidden">
                                <span
                                    ref={progressNumberRef}
                                    data-process-header-progress
                                    className="block font-mono text-[11px] tabular-nums tracking-[0.08em] text-white"
                                >
                                    0%
                                </span>
                            </span>
                        </header>

                        <div
                            data-process-progress-track
                            aria-hidden="true"
                            className="absolute bottom-16 top-6 z-[3] hidden w-4 md:right-[var(--spacing-viewport-gutter)] md:block"
                        >
                            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/28"/>
                            <span
                                data-process-progress-bar
                                className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 origin-top bg-white will-change-transform"
                            />
                            <span className="absolute left-1/2 top-0 h-px w-2 -translate-x-1/2 bg-white/72"/>
                            <span className="absolute bottom-0 left-1/2 h-px w-2 -translate-x-1/2 bg-black/42"/>
                            <span
                                data-process-progress-marker
                                className="absolute left-1/2 top-0 h-px w-4 -translate-x-1/2 bg-white"
                            />
                        </div>

                        <div className="absolute inset-x-[var(--spacing-viewport-gutter)] bottom-10 z-[2] h-[19rem] md:right-auto md:bottom-16 md:h-[22rem] md:w-[min(48rem,56vw)]">
                            {processStory.chapters.map((chapter) => (
                                <article
                                    key={chapter.id}
                                    data-process-caption
                                    className="absolute inset-x-0 bottom-0"
                                >
                                    <div className="mb-5 flex items-center gap-3 md:gap-4">
                                        <span
                                            data-process-caption-rule
                                            aria-hidden="true"
                                            className="block h-px w-8 shrink-0 bg-white md:w-11"
                                        />
                                        <p className="overflow-hidden">
                                            <span
                                                data-process-caption-discipline
                                                className="block text-[11px] font-medium uppercase tracking-[0.18em] text-white md:text-xs"
                                            >
                                                {chapter.discipline}
                                            </span>
                                        </p>
                                    </div>
                                    <h3 className="max-w-[48rem] text-[clamp(2.55rem,5.4vw,6rem)] font-normal leading-[0.9] tracking-[-0.058em] text-white">
                                        {splitIntoSentences(chapter.title).map((sentence) => (
                                            <span
                                                key={sentence}
                                                className="block overflow-hidden pb-[0.08em]"
                                            >
                                                <span
                                                    data-process-caption-title-sentence
                                                    className="block"
                                                >
                                                    {sentence}
                                                </span>
                                            </span>
                                        ))}
                                    </h3>
                                    <p className="mt-6 max-w-[35rem] text-[15px] leading-[1.4] text-white/90 md:mt-8 md:text-lg">
                                        {splitIntoSentences(chapter.description).map((sentence) => (
                                            <span
                                                key={sentence}
                                                className="block overflow-hidden"
                                            >
                                                <span
                                                    data-process-caption-description-sentence
                                                    className="block"
                                                >
                                                    {sentence}
                                                </span>
                                            </span>
                                        ))}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div
                            ref={loaderRef}
                            className="absolute bottom-5 right-[var(--spacing-viewport-gutter)] z-[3] flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/85 transition-opacity duration-150 md:bottom-7"
                        >
                            <span className="h-px w-8 bg-white/70"/>
                            Preparing sequence
                        </div>
                    </div>
                </section>
            )}

        </section>
    );
}

function ReducedMotionProcessStory() {
    const basePath = processStory.sequence.mobileBasePath;

    return (
        <section className="bg-[#11110f] py-28 text-[#f7f4ed] md:py-40">
            <div className="viewport-container">
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
