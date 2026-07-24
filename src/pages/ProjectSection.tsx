import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {motionEases} from "../lib/motion";
import {projectShowcaseIntro, projectShowcaseProjects} from "../data/projects";
import projectIntroImage from "../assets/images/hero2.avif";

gsap.registerPlugin(ScrollTrigger);

type PathPoint = {
    x: number;
    y: number;
};

const titleJoin = (prefix: string, title: string) => `${prefix} - ${title}`;
const renderMetaItems = (items: string[]) => (
    items.map((item, index) => (
        <span key={item} data-project-meta-item className="inline-block will-change-[transform,opacity]">
            {item}{index < items.length - 1 ? "\u00A0\u00B7\u00A0" : ""}
        </span>
    ))
);

const cubicPoint = (start: PathPoint, controlA: PathPoint, controlB: PathPoint, end: PathPoint, progress: number) => {
    const inverse = 1 - progress;
    const inverseSquared = inverse * inverse;
    const progressSquared = progress * progress;

    return {
        x: inverseSquared * inverse * start.x
            + 3 * inverseSquared * progress * controlA.x
            + 3 * inverse * progressSquared * controlB.x
            + progressSquared * progress * end.x,
        y: inverseSquared * inverse * start.y
            + 3 * inverseSquared * progress * controlA.y
            + 3 * inverse * progressSquared * controlB.y
            + progressSquared * progress * end.y,
    };
};

const createArcLengthCurve = (start: PathPoint, controlA: PathPoint, controlB: PathPoint, end: PathPoint) => {
    const samples = 90;
    const lengths = [{progress: 0, length: 0}];
    let previous = start;
    let totalLength = 0;

    for (let index = 1; index <= samples; index += 1) {
        const progress = index / samples;
        const point = cubicPoint(start, controlA, controlB, end, progress);
        totalLength += Math.hypot(point.x - previous.x, point.y - previous.y);
        lengths.push({progress, length: totalLength});
        previous = point;
    }

    return (distanceProgress: number) => {
        const targetLength = gsap.utils.clamp(0, 1, distanceProgress) * totalLength;
        const nextIndex = lengths.findIndex((item) => item.length >= targetLength);

        if (nextIndex <= 0) return start;

        const before = lengths[nextIndex - 1];
        const after = lengths[nextIndex];
        const segmentProgress = (targetLength - before.length) / Math.max(after.length - before.length, 1);
        const bezierProgress = gsap.utils.interpolate(before.progress, after.progress, segmentProgress);

        return cubicPoint(start, controlA, controlB, end, bezierProgress);
    };
};

const findClosestCurveProgress = (curve: (progress: number) => PathPoint, distance: (point: PathPoint) => number) => {
    let closestProgress = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let sample = 0; sample <= 180; sample += 1) {
        const progress = sample / 180;
        const point = curve(progress);
        const currentDistance = distance(point);

        if (currentDistance < closestDistance) {
            closestDistance = currentDistance;
            closestProgress = progress;
        }
    }

    return closestProgress;
};

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const ProjectSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        const backgrounds = gsap.utils.toArray<HTMLElement>("[data-project-bg]", stage);
        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]", stage);
        const titles = gsap.utils.toArray<HTMLElement>("[data-project-title]", stage);
        const indexes = gsap.utils.toArray<HTMLElement>("[data-project-index]", stage);
        const tags = gsap.utils.toArray<HTMLElement>("[data-project-tags]", stage);
        const properties = gsap.utils.toArray<HTMLElement>("[data-project-properties]", stage);
        const introBackground = stage.querySelector<HTMLElement>("[data-project-intro-bg]");
        const introTagsElement = stage.querySelector<HTMLElement>("[data-project-intro-tags]");
        const introPropertiesElement = stage.querySelector<HTMLElement>("[data-project-intro-properties]");
        const introIndexElement = stage.querySelector<HTMLElement>("[data-project-intro-index]");
        const introTitleElement = stage.querySelector<HTMLElement>("[data-project-intro-title]");
        const introMetaItems = [
            ...gsap.utils.toArray<HTMLElement>("[data-project-meta-item]", introTagsElement),
            ...gsap.utils.toArray<HTMLElement>("[data-project-meta-item]", introPropertiesElement),
        ];
        const metaItems = gsap.utils.toArray<HTMLElement>("[data-project-meta-item]", stage);
        const backgroundFrame = stage.querySelector<HTMLElement>("[data-project-bg-frame]");
        const centerGroup = stage.querySelector<HTMLElement>("[data-project-center-group]");
        const indexWrap = stage.querySelector<HTMLElement>("[data-project-index-wrap]");
        const titleWrap = stage.querySelector<HTMLElement>("[data-project-title-wrap]");
        const line = stage.querySelector<HTMLElement>("[data-project-line]");
        const rail = stage.querySelector<HTMLElement>("[data-project-rail]");

        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const {desktop, reduceMotion} = context.conditions as {desktop: boolean; reduceMotion: boolean};

                if (reduceMotion) {
                    gsap.set([introBackground, introTagsElement, introPropertiesElement, introIndexElement, introTitleElement], {
                        autoAlpha: 0,
                        clipPath: "inset(0% 0 0% 0)",
                        clearProps: "transform",
                    });
                    gsap.set([backgrounds[0], cards, titles[0], indexes[0], tags[0], properties[0]], {
                        autoAlpha: 1,
                        clipPath: "inset(0% 0 0% 0)",
                        clearProps: "transform",
                    });
                    gsap.set(metaItems, {autoAlpha: 1, clearProps: "transform"});
                    gsap.set([centerGroup, indexWrap, titleWrap, line], {autoAlpha: 1, clearProps: "transform"});
                    gsap.set(line, {scaleX: 1});
                    gsap.set(backgroundFrame, {
                        clipPath: "inset(0px)",
                        clearProps: "transform,willChange",
                    });
                    return;
                }

                const cardWidth = desktop ? 340 : Math.min(252, window.innerWidth * 0.64);
                const cardHeight = cardWidth * 0.5625;
                const enterX = -window.innerWidth * 0.5 - cardWidth - 32;
                const enterY = window.innerHeight * 0.5 + cardHeight * 0.5 + 32;
                const exitX = -cardWidth / 2;
                const exitY = -window.innerHeight * 0.88;
                const cardCurve = createArcLengthCurve(
                    {x: enterX, y: enterY},
                    {x: -window.innerWidth * 0.42, y: window.innerHeight * 0.5},
                    {x: desktop ? window.innerWidth * 0.08 : window.innerWidth * 0.04, y: -window.innerHeight * 0.18},
                    {x: exitX, y: exitY},
                );
                const cardRevealStartProgress = findClosestCurveProgress(
                    cardCurve,
                    (point) => Math.abs(point.y),
                );
                const cardRevealEndProgress = findClosestCurveProgress(
                    cardCurve,
                    (point) => Math.abs(point.y + cardHeight),
                );
                const cardTopHitProgress = cardRevealStartProgress;
                const cardFadeStartProgress = 0.94;
                const cardGap = desktop ? 0.72 : 0.78;
                const cardStart = 0.42;
                const crossDelay = 1.08;
                const pathDuration = crossDelay + 1.08;

                gsap.set(introBackground, {
                    autoAlpha: 1,
                    scale: 1,
                    filter: "brightness(0.48) contrast(1.08) saturate(0.86)",
                    transformOrigin: "50% 50%",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(backgrounds, {
                    autoAlpha: 0,
                    scale: 1.08,
                    filter: "brightness(0.44) contrast(1.1) saturate(0.88)",
                    transformOrigin: "50% 50%",
                    willChange: "transform, opacity, filter",
                });

                gsap.set([titles, indexes, tags, properties], {
                    yPercent: 112,
                    autoAlpha: 0,
                    clipPath: "inset(100% 0 0% 0)",
                    willChange: "transform, opacity, clip-path",
                });
                gsap.set([introTagsElement, introPropertiesElement, introIndexElement, introTitleElement], {
                    yPercent: 0,
                    autoAlpha: 1,
                    clipPath: "inset(0% 0 0% 0)",
                    willChange: "transform, opacity, clip-path",
                });
                gsap.set(metaItems, {yPercent: 0, autoAlpha: 1});
                gsap.set(introMetaItems, {yPercent: 112, autoAlpha: 0});
                gsap.set(line, {scaleX: 0, autoAlpha: 1, transformOrigin: "center center"});
                gsap.set(centerGroup, {autoAlpha: 0.74, scale: 0.985, willChange: "transform, opacity"});
                gsap.set(indexWrap, {x: desktop ? window.innerWidth * 0.18 : window.innerWidth * 0.12, willChange: "transform"});
                gsap.set(titleWrap, {x: desktop ? -window.innerWidth * 0.18 : -window.innerWidth * 0.12, willChange: "transform, width"});
                gsap.set(rail, {transformPerspective: 1200});
                gsap.set(backgroundFrame, {
                    clipPath: `inset(${desktop ? 128 : 64}px)`,
                    force3D: true,
                    willChange: "clip-path",
                });

                gsap.timeline({
                    defaults: {ease: "none"},
                    scrollTrigger: {
                        trigger: section,
                        start: "top center",
                        end: "top top",
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(centerGroup, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 1,
                    }, 0)
                    .to(indexWrap, {
                        x: 0,
                        duration: 1,
                    }, 0)
                    .to(titleWrap, {
                        x: 0,
                        duration: 1,
                    }, 0)
                    .to(line, {
                        scaleX: 1,
                        duration: 1,
                    }, 0.08);

                gsap.to(backgroundFrame, {
                    clipPath: "inset(0px)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                        end: "top top",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });

                const introMetadataIntro = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.enter},
                });

                introMetadataIntro.to(introMetaItems, {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 0.58,
                    stagger: 0.035,
                }, 0);

                ScrollTrigger.create({
                    trigger: section,
                    start: "top -10%",
                    end: "bottom top",
                    onEnter: () => introMetadataIntro.play(),
                    onLeaveBack: () => introMetadataIntro.reverse(),
                    invalidateOnRefresh: true,
                });

                const uniqueElements = (items: Array<HTMLElement | null | undefined>) => (
                    Array.from(new Set(items.filter((item): item is HTMLElement => Boolean(item))))
                );
                const getContentTargets = (index: number) => (
                    index >= 0
                        ? uniqueElements([indexes[index], titles[index], tags[index], properties[index]])
                        : uniqueElements([introIndexElement, introTitleElement, introTagsElement, introPropertiesElement])
                );
                const allContentTargets = uniqueElements([
                    introIndexElement,
                    introTitleElement,
                    introTagsElement,
                    introPropertiesElement,
                    ...indexes,
                    ...titles,
                    ...tags,
                    ...properties,
                ]);
                const switchTimes = projectShowcaseProjects.map((_, index) => (
                    cardStart + index * cardGap + cardTopHitProgress * pathDuration
                ));
                const layoutPreviewTimes = switchTimes;
                let activeProjectIndex = -1;
                let activeLayoutIndex = -1;
                let contentTransitionTimeline: gsap.core.Timeline | undefined;

                const getTitleElement = (index: number) => (
                    index >= 0 ? titles[index] : introTitleElement
                );

                const getTitleWidth = (index: number) => {
                    const titleElement = getTitleElement(index);
                    const sideGutter = desktop ? 40 : 24;
                    const centerGap = desktop ? 16 : 12;
                    const indexWidth = indexWrap?.getBoundingClientRect().width ?? 82;
                    const minimumLineWidth = desktop ? 96 : 48;
                    const availableWidth = window.innerWidth - sideGutter * 2 - indexWidth - centerGap * 2 - minimumLineWidth;
                    const measuredWidth = titleElement?.scrollWidth ?? 0;
                    const titleSafetyBuffer = desktop ? 36 : 24;

                    return clampValue(measuredWidth + titleSafetyBuffer, desktop ? 260 : 168, availableWidth);
                };

                const previewProjectLayout = (nextIndex: number) => {
                    if (nextIndex === activeLayoutIndex) return;

                    activeLayoutIndex = nextIndex;

                    gsap.to(titleWrap, {
                        width: getTitleWidth(nextIndex),
                        delay: 0.12,
                        duration: 0.78,
                        ease: motionEases.reveal,
                        overwrite: "auto",
                    });
                    gsap.fromTo(line, {
                        autoAlpha: 0.72,
                    }, {
                        autoAlpha: 1,
                        delay: 0.12,
                        duration: 0.78,
                        ease: motionEases.reveal,
                        overwrite: "auto",
                    });
                };

                gsap.set(titleWrap, {width: getTitleWidth(-1)});

                const switchProjectContent = (nextIndex: number) => {
                    if (nextIndex === activeProjectIndex) return;

                    const previousIndex = activeProjectIndex;
                    const direction = nextIndex > previousIndex ? 1 : -1;
                    const outgoingTargets = getContentTargets(previousIndex);
                    const incomingTargets = getContentTargets(nextIndex);
                    const transitionTargets = new Set([...outgoingTargets, ...incomingTargets]);
                    const staleTargets = allContentTargets.filter((target) => !transitionTargets.has(target));

                    contentTransitionTimeline?.kill();
                    gsap.killTweensOf(allContentTargets);
                    gsap.set(staleTargets, {
                        yPercent: 112 * direction,
                        autoAlpha: 0,
                        clipPath: direction > 0 ? "inset(100% 0 0% 0)" : "inset(0% 0 100% 0)",
                    });
                    activeProjectIndex = nextIndex;

                    contentTransitionTimeline = gsap.timeline({
                        defaults: {
                            ease: motionEases.enter,
                            overwrite: true,
                        },
                        onComplete: () => {
                            const activeTargets = new Set(getContentTargets(activeProjectIndex));
                            const inactiveTargets = allContentTargets.filter((target) => !activeTargets.has(target));

                            gsap.set(inactiveTargets, {
                                yPercent: 112 * direction,
                                autoAlpha: 0,
                                clipPath: direction > 0 ? "inset(100% 0 0% 0)" : "inset(0% 0 100% 0)",
                            });
                        },
                    })
                        .to(outgoingTargets, {
                            yPercent: -112 * direction,
                            autoAlpha: 0.84,
                            clipPath: direction > 0 ? "inset(0% 0 100% 0)" : "inset(100% 0 0% 0)",
                            duration: 0.62,
                            stagger: 0.032,
                            ease: motionEases.reveal,
                            overwrite: true,
                        }, 0)
                        .fromTo(incomingTargets, {
                            yPercent: 112 * direction,
                            autoAlpha: 0.86,
                            clipPath: direction > 0 ? "inset(100% 0 0% 0)" : "inset(0% 0 100% 0)",
                        }, {
                            yPercent: 0,
                            autoAlpha: 1,
                            clipPath: "inset(0% 0 0% 0)",
                            duration: 0.82,
                            stagger: 0.038,
                            ease: motionEases.reveal,
                            immediateRender: false,
                            overwrite: true,
                        }, 0.22);
                };

                cards.forEach((card) => {
                    const primaryImage = card.querySelector("[data-project-card-primary]");
                    const secondaryImage = card.querySelector("[data-project-card-secondary]");
                    gsap.set(card, {
                        width: cardWidth,
                        height: cardHeight,
                        x: enterX,
                        y: enterY,
                        scale: 0.88,
                        rotation: 0,
                        clipPath: "inset(100% 0 0% 0)",
                        autoAlpha: 1,
                        transformOrigin: "50% 50%",
                        willChange: "transform, clip-path",
                    });
                    gsap.set(primaryImage, {
                        clipPath: "inset(0% 0 0% 0)",
                        scale: 1.12,
                        yPercent: 10,
                        willChange: "transform, clip-path",
                    });
                    gsap.set(secondaryImage, {
                        clipPath: "inset(0% 0 0% 0)",
                        scale: 1.06,
                        willChange: "transform",
                    });
                });

                const timeline = gsap.timeline({
                    defaults: {ease: motionEases.enter},
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });

                timeline.eventCallback("onUpdate", () => {
                    const currentTime = timeline.time();
                    let nextIndex = -1;
                    let previewIndex = -1;

                    switchTimes.forEach((switchAt, index) => {
                        if (currentTime >= switchAt) nextIndex = index;
                    });
                    layoutPreviewTimes.forEach((switchAt, index) => {
                        if (currentTime >= switchAt) previewIndex = index;
                    });

                    previewProjectLayout(previewIndex);
                    switchProjectContent(nextIndex);
                });

                timeline
                    .to(cards, {
                        clipPath: "inset(0% 0 0% 0)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: motionEases.reveal,
                    }, 0.06)
                    .to(cards.map((card) => card.querySelector("[data-project-card-primary]")), {
                        yPercent: 0,
                        scale: 1,
                        duration: 0.95,
                        stagger: 0.1,
                        ease: motionEases.enter,
                    }, 0.06);

                cards.forEach((card, index) => {
                    const start = cardStart + index * cardGap;
                    const pathState = {progress: 0};
                    const primaryImage = card.querySelector("[data-project-card-primary]");
                    const revealStart = start + Math.min(cardRevealStartProgress, cardRevealEndProgress) * pathDuration;
                    const revealDuration = Math.max(Math.abs(cardRevealEndProgress - cardRevealStartProgress) * pathDuration, 0.24);

                    timeline
                        .to(pathState, {
                            progress: 1,
                            duration: pathDuration,
                            ease: "none",
                            onUpdate: () => {
                                const point = cardCurve(pathState.progress);
                                const scale = pathState.progress < 0.56
                                    ? gsap.utils.interpolate(0.88, 0.94, pathState.progress / 0.56)
                                    : gsap.utils.interpolate(0.94, 0.9, (pathState.progress - 0.56) / 0.44);
                                const fadeProgress = gsap.utils.clamp(0, 1, (pathState.progress - cardFadeStartProgress) / (1 - cardFadeStartProgress));

                                gsap.set(card, {
                                    x: point.x,
                                    y: point.y,
                                    scale,
                                    autoAlpha: 1 - fadeProgress,
                                });
                            },
                        }, start)
                        .to(primaryImage, {
                            clipPath: "inset(100% 0 0% 0)",
                            duration: revealDuration,
                            ease: "none",
                        }, revealStart)
                        .set(card, {autoAlpha: 0}, start + pathDuration);
                });

                projectShowcaseProjects.forEach((_, index) => {
                    const switchAt = switchTimes[index];
                    const previous = index - 1;
                    const previousBackground = previous >= 0 ? backgrounds[previous] : introBackground;

                    timeline
                        .to(previousBackground, {
                            autoAlpha: 0,
                            scale: 1.035,
                            filter: "brightness(0.28) contrast(1.14) saturate(0.72)",
                            duration: 0.5,
                            ease: motionEases.depart,
                        }, switchAt)
                        .to(backgrounds[index], {
                            autoAlpha: 1,
                            scale: 1,
                            filter: "brightness(0.5) contrast(1.08) saturate(0.92)",
                            duration: 0.68,
                            ease: motionEases.enter,
                        }, switchAt + 0.14);
                });

                timeline.to(backgrounds[backgrounds.length - 1], {
                    scale: 1.025,
                    filter: "brightness(0.42) contrast(1.1) saturate(0.86)",
                    duration: 0.9,
                    ease: motionEases.settle,
                }, 4.1);

                return () => {
                    contentTransitionTimeline?.kill();
                    gsap.killTweensOf(allContentTargets);
                };
            },
        );

        return () => matchMedia.revert();
    }, {scope: sectionRef});

    return (
        <section
            ref={sectionRef}
            data-project-section
            className="relative z-[3] -mt-[100vh] h-[570vh] text-white md:h-[660vh]"
        >
            <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden bg-transparent">
                <div data-project-bg-frame className="absolute inset-0 overflow-hidden ">
                    <div className="relative h-full w-full overflow-hidden">
                        <div data-project-intro-bg className="absolute inset-0" aria-hidden="true">
                            <img
                                src={projectIntroImage}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="eager"
                            />
                        </div>
                        {projectShowcaseProjects.map((project, index) => (
                            <div
                                key={project.id}
                                data-project-bg
                                className="absolute inset-0"
                                aria-hidden={index !== 0}
                            >
                                <img
                                    src={project.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-black/26"/>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_48%,transparent_0%,rgba(0,0,0,0.05)_36%,rgba(0,0,0,0.4)_100%)]"/>
                    </div>
                </div>

                <div className="pointer-events-none absolute left-6 right-6 top-10 z-30 flex items-start justify-between gap-8 text-[24px] font-normal leading-none tracking-[-0.045em] text-white/94 md:left-10 md:right-10">
                    <div className="relative h-[1.08em] min-w-0 flex-1 overflow-hidden">
                        <span data-project-intro-tags className="absolute left-0 top-0 block max-w-full whitespace-nowrap">
                            {renderMetaItems(projectShowcaseIntro.tags)}
                        </span>
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-tags className="absolute left-0 top-0 block max-w-full whitespace-nowrap">
                                {renderMetaItems(project.tags)}
                            </span>
                        ))}
                    </div>
                    <div className="relative hidden h-[1.08em] min-w-[38vw] overflow-hidden text-right md:block">
                        <span data-project-intro-properties className="absolute right-0 top-0 block whitespace-nowrap">
                            {renderMetaItems(projectShowcaseIntro.properties)}
                        </span>
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-properties className="absolute right-0 top-0 block whitespace-nowrap">
                                {renderMetaItems(project.properties)}
                            </span>
                        ))}
                    </div>
                </div>

                <div data-project-center-group className="pointer-events-none absolute left-6 right-6 top-1/2 z-30 flex -translate-y-1/2 items-center gap-3 text-[52px] font-normal leading-none tracking-[-0.055em] md:left-10 md:right-10 md:gap-4">
                    <div data-project-index-wrap className="relative h-[1.06em] w-[82px] shrink-0 overflow-hidden">
                        <span data-project-intro-index className="absolute left-0 top-0 block">
                            {projectShowcaseIntro.index}
                        </span>
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-index className="absolute left-0 top-0 block">
                                /{project.index}
                            </span>
                        ))}
                    </div>
                    <div data-project-line className="h-px flex-1 bg-white/58"/>
                    <div data-project-title-wrap className="relative h-[1.08em] shrink-0 overflow-hidden text-right">
                        <span data-project-intro-title className="absolute right-0 top-0 block whitespace-nowrap">
                            {projectShowcaseIntro.title}
                        </span>
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-title className="absolute right-0 top-0 block whitespace-nowrap">
                                {titleJoin(project.prefix, project.title)}
                            </span>
                        ))}
                    </div>
                </div>

                <div data-project-rail className="absolute inset-0 z-20">
                    {projectShowcaseProjects.map((project) => (
                        <a
                            key={project.id}
                            data-project-card
                            data-cursor="open"
                            href={`/projects/${project.slug}`}
                            className="group absolute left-1/2 top-1/2 block overflow-hidden shadow-[0_2rem_5rem_rgba(0,0,0,0.36)] outline outline-1 outline-white/14"
                            aria-label={`Open project ${project.title}`}
                        >
                            <img
                                data-project-card-secondary
                                src={project.secondaryImage}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 z-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                            <img
                                data-project-card-primary
                                src={project.thumbnail}
                                alt={project.title}
                                className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
