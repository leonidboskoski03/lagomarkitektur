import {useCallback, useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {services} from "../data/services";
import {motionEases} from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const getServiceLayout = (
    activeIndex: number,
    headerHeight: number,
    compactHeight: number,
    expandedHeight: number,
) => {
    let top = headerHeight;

    return services.map((_, index) => {
        const height = index === activeIndex ? expandedHeight : compactHeight;
        const layout = {top, height};
        top += height;

        return layout;
    });
};

type ServicesMode = "intro" | "accordion";

interface ServicesScrollIntroProps {
    onComplete: () => void;
}

interface ServicesAccordionProps {
    initialActiveIndex?: number;
}

export const ServicesSection = () => {
    const [mode, setMode] = useState<ServicesMode>(() => (
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "accordion"
            : "intro"
    ));
    const showAccordion = useCallback(() => setMode("accordion"), []);

    if (mode === "accordion") {
        return <ServicesAccordion initialActiveIndex={services.length - 1}/>;
    }

    return <ServicesScrollIntro onComplete={showAccordion}/>;
};

const ServicesScrollIntro = ({onComplete}: ServicesScrollIntroProps) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        const panel = stage.querySelector<HTMLElement>("[data-services-panel]");
        const header = stage.querySelector<HTMLElement>("[data-services-header]");
        const heading = stage.querySelector<HTMLElement>("[data-services-heading]");
        const headerLine = stage.querySelector<HTMLElement>("[data-services-header-line]");
        const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]", stage);
        const media = gsap.utils.toArray<HTMLElement>("[data-service-media]", stage);
        const mediaImages = gsap.utils.toArray<HTMLElement>("[data-service-media-image]", stage);
        const descriptions = gsap.utils.toArray<HTMLElement>("[data-service-description]", stage);
        const labels = gsap.utils.toArray<HTMLElement>("[data-service-label]", stage);
        const textItems = gsap.utils.toArray<HTMLElement>("[data-service-text-item]", stage);

        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const {desktop, reduceMotion} = context.conditions as {desktop: boolean; reduceMotion: boolean};
                const compactHeight = desktop ? 60 : 58;
                const headerHeight = desktop ? 108 : 90;
                const expandedHeight = desktop
                    ? gsap.utils.clamp(300, 360, window.innerHeight * 0.38)
                    : gsap.utils.clamp(360, 480, window.innerHeight * 0.56);
                const finalLayout = getServiceLayout(services.length - 1, headerHeight, compactHeight, expandedHeight);
                const initialLayout = getServiceLayout(0, headerHeight, compactHeight, expandedHeight);

                gsap.set(panel, {
                    height: window.innerHeight,
                    willChange: "transform",
                });
                gsap.set(header, {
                    height: headerHeight,
                });

                if (reduceMotion) {
                    rows.forEach((row, index) => {
                        gsap.set(row, {
                            top: finalLayout[index].top,
                            height: finalLayout[index].height,
                            zIndex: index + 1,
                            y: 0,
                            autoAlpha: 1,
                        });
                    });
                    gsap.set([...labels, ...textItems], {y: 0, autoAlpha: 1, clearProps: "filter"});
                    gsap.set(descriptions, {autoAlpha: 0, clearProps: "transform,clipPath"});
                    gsap.set(media, {autoAlpha: 0, clipPath: "inset(0% 0 0% 0)"});
                    gsap.set([descriptions[services.length - 1], media[services.length - 1]], {autoAlpha: 1});
                    gsap.set(mediaImages, {scale: 1, filter: "brightness(1)"});
                    gsap.set(heading, {autoAlpha: 1, y: 0, clearProps: "filter"});
                    gsap.set(headerLine, {scaleX: 1});
                    return;
                }

                gsap.set(heading, {
                    y: 18,
                    autoAlpha: 0,
                    filter: "blur(6px)",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(headerLine, {
                    scaleX: 0,
                    transformOrigin: "left center",
                    willChange: "transform",
                });
                rows.forEach((row, index) => {
                    gsap.set(row, {
                        top: initialLayout[index].top,
                        height: initialLayout[index].height,
                        zIndex: index + 1,
                    });
                });
                gsap.set(rows, {
                    y: () => window.innerHeight * 0.72,
                    autoAlpha: 1,
                    overflow: "hidden",
                    willChange: "transform, top, height",
                });
                gsap.set(labels, {
                    y: 10,
                    autoAlpha: 1,
                });
                gsap.set(textItems, {
                    y: 10,
                    autoAlpha: 0,
                    filter: "blur(4px)",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(descriptions, {
                    autoAlpha: 0,
                });
                gsap.set(media, {
                    autoAlpha: 0,
                    clipPath: "inset(100% 0 0% 0)",
                    willChange: "opacity, clip-path",
                });
                gsap.set(mediaImages, {
                    scale: 1.08,
                    filter: "brightness(0)",
                    transformOrigin: "50% 50%",
                    willChange: "transform, filter",
                });

                const headingReveal = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.enter},
                });

                headingReveal.to(heading, {
                    y: 0,
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: 1.05,
                    ease: motionEases.enter,
                }, 0)
                    .to(headerLine, {
                        scaleX: 1,
                        duration: 1.18,
                        ease: motionEases.depart,
                    }, 0.08);

                ScrollTrigger.create({
                    trigger: heading,
                    start: "top 80%",
                    end: "bottom top",
                    onEnter: () => headingReveal.play(),
                    onEnterBack: () => headingReveal.play(),
                    onLeaveBack: () => headingReveal.reverse(),
                    invalidateOnRefresh: true,
                });

                const revealedRows = new Set<number>();
                const revealServiceCard = (nextIndex: number) => {
                    if (nextIndex < 0 || revealedRows.has(nextIndex)) return;
                    revealedRows.add(nextIndex);

                    const activeTextItems = gsap.utils.toArray<HTMLElement>("[data-service-text-item]", rows[nextIndex]);

                    gsap.killTweensOf([...activeTextItems, media[nextIndex], mediaImages[nextIndex]]);

                    gsap.set(activeTextItems, {
                        y: 12,
                        autoAlpha: 0,
                        filter: "blur(4px)",
                    });
                    gsap.set(media[nextIndex], {
                        autoAlpha: 1,
                        clipPath: "inset(100% 0 0% 0)",
                    });
                    gsap.set(mediaImages[nextIndex], {
                        scale: 1.065,
                        filter: "brightness(0)",
                    });

                    gsap.timeline({defaults: {ease: motionEases.reveal}})
                        .to(activeTextItems, {
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: 0.82,
                            stagger: 0.07,
                            ease: motionEases.enter,
                        }, 0)
                        .to(media[nextIndex], {
                            clipPath: "inset(0% 0 0% 0)",
                            duration: 0.72,
                            ease: motionEases.reveal,
                        }, 0.66)
                        .to(mediaImages[nextIndex], {
                            scale: 1,
                            filter: "brightness(1)",
                            duration: 0.42,
                            ease: motionEases.enter,
                        }, 0.72);
                };

                const timeline = gsap.timeline({
                    defaults: {ease: motionEases.reveal},
                    paused: true,
                });

                services.forEach((_, activeIndex) => {
                    const layout = getServiceLayout(activeIndex, headerHeight, compactHeight, expandedHeight);
                    const start = activeIndex * 1.34;
                    const movingRows = rows.slice(activeIndex);

                    timeline
                        .to(movingRows, {
                            top: (_index, _target, targets) => {
                                const rowIndex = rows.indexOf(targets[_index] as HTMLElement);
                                return layout[rowIndex].top;
                            },
                            height: (_index, _target, targets) => {
                                const rowIndex = rows.indexOf(targets[_index] as HTMLElement);
                                return layout[rowIndex].height;
                            },
                            duration: 1.18,
                            ease: motionEases.reveal,
                        }, start)
                        .to(rows[activeIndex], {
                            y: 0,
                            duration: 1.18,
                            ease: motionEases.reveal,
                        }, start);
                });

                timeline.eventCallback("onUpdate", () => {
                    const currentTime = timeline.time();
                    let nextIndex = -1;

                    services.forEach((_, index) => {
                        if (currentTime >= index * 1.34 + 0.62) nextIndex = index;
                    });

                    revealServiceCard(nextIndex);
                });

                let maxScrollProgress = 0;
                let pinReleased = false;
                const releasePinnedScroll = (trigger: ScrollTrigger) => {
                    if (pinReleased) return;

                    maxScrollProgress = 1;
                    gsap.killTweensOf(timeline);
                    timeline.progress(1);
                    pinReleased = true;

                    trigger.kill(true);
                    gsap.set(stage, {clearProps: "all"});

                    requestAnimationFrame(() => {
                        window.scrollTo({top: section.offsetTop});
                        ScrollTrigger.refresh();
                        onComplete();
                    });
                };

                ScrollTrigger.create({
                    trigger: section,
                    start: "top top",
                    end: () => desktop ? "+=650%" : "+=720%",
                    pin: stage,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (pinReleased) return;

                        if (self.progress <= maxScrollProgress) {
                            timeline.progress(maxScrollProgress);
                            return;
                        }

                        maxScrollProgress = self.progress;

                        gsap.to(timeline, {
                            progress: maxScrollProgress,
                            duration: 0.42,
                            ease: motionEases.settle,
                            overwrite: true,
                            onComplete: () => {
                                if (maxScrollProgress >= 0.995) releasePinnedScroll(self);
                            },
                        });
                    },
                    onLeave: (self) => {
                        releasePinnedScroll(self);
                    },
                    onRefresh: () => {
                        if (pinReleased) return;
                        if (maxScrollProgress > 0) timeline.progress(maxScrollProgress);
                    },
                });
            },
        );

        return () => matchMedia.revert();
    }, {scope: sectionRef});

    return (
        <section ref={sectionRef} className="relative z-[1] min-h-screen bg-white text-[#111]">
            <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-white">
                <div
                    data-services-panel
                    className="relative h-screen w-full overflow-hidden bg-white"
                >
                    <div
                        data-services-header
                        className="absolute left-0 right-0 top-0 flex items-center px-5 md:px-6"
                    >
                        <h2 data-services-heading className="text-[34px] font-normal leading-none tracking-[-0.045em] md:text-[36px]">
                            Services
                        </h2>
                        <span data-services-header-line className="absolute bottom-0 left-0 h-px w-full bg-black/34"/>
                    </div>

                    {services.map((service, index) => (
                        <article
                            key={service.id}
                            data-service-row
                            className={`absolute left-0 right-0 overflow-hidden bg-white ${index === 0 ? "" : "border-t border-black/34"}`}
                        >
                            <div className="grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 px-5 py-5 md:grid-cols-[9.5rem_13.5rem_minmax(0,1fr)] md:gap-x-8 md:px-5">
                                <span data-service-label data-service-text-item className="block text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                    /{service.index}
                                </span>
                                <h3 data-service-label data-service-text-item className="text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                    {service.title}
                                </h3>
                                <div className="col-span-2 grid min-h-0 w-full content-start gap-7 justify-self-end overflow-hidden pt-5 md:col-span-1 md:max-w-[52rem] md:pt-0">
                                    <p
                                        data-service-description
                                        data-service-text-item
                                        className="max-w-[52rem] overflow-hidden text-[16px] font-normal leading-[1.18] tracking-[-0.045em] text-black/42 md:text-[18px]"
                                    >
                                        {service.description}
                                    </p>
                                    <figure data-service-media className="h-[40vw] max-h-[20rem] min-h-[12rem] w-full max-w-[52rem] overflow-hidden md:h-[9.75rem] md:max-h-none lg:h-[12rem] xl:h-[13.25rem]">
                                        <img
                                            data-service-media-image
                                            src={service.image}
                                            alt={service.imageAlt}
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    </figure>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServicesAccordion = ({initialActiveIndex = services.length - 1}: ServicesAccordionProps) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const rowsRef = useRef<HTMLElement[]>([]);
    const layoutRef = useRef({
        compactHeight: 60,
        expandedHeight: 360,
        headerHeight: 108,
        reduceMotion: false,
    });
    const activeIndexRef = useRef(initialActiveIndex);
    const hasMountedRef = useRef(false);
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

    useGSAP(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const panel = stage.querySelector<HTMLElement>("[data-services-panel]");
        const header = stage.querySelector<HTMLElement>("[data-services-header]");
        const headerLine = stage.querySelector<HTMLElement>("[data-services-header-line]");
        const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]", stage);
        const media = gsap.utils.toArray<HTMLElement>("[data-service-media]", stage);
        const mediaImages = gsap.utils.toArray<HTMLElement>("[data-service-media-image]", stage);
        const textItems = gsap.utils.toArray<HTMLElement>("[data-service-text-item]", stage);
        rowsRef.current = rows;

        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const {desktop, reduceMotion} = context.conditions as {desktop: boolean; reduceMotion: boolean};
                const compactHeight = desktop ? 60 : 58;
                const headerHeight = desktop ? 108 : 90;
                const expandedHeight = desktop
                    ? gsap.utils.clamp(300, 360, window.innerHeight * 0.38)
                    : gsap.utils.clamp(360, 480, window.innerHeight * 0.56);
                const layout = getServiceLayout(activeIndexRef.current, headerHeight, compactHeight, expandedHeight);
                layoutRef.current = {
                    compactHeight,
                    expandedHeight,
                    headerHeight,
                    reduceMotion,
                };

                gsap.set(panel, {
                    height: window.innerHeight,
                });
                gsap.set(header, {
                    height: headerHeight,
                });
                gsap.set(headerLine, {
                    scaleX: 1,
                    transformOrigin: "left center",
                });
                gsap.set([...textItems, ...media], {
                    autoAlpha: 1,
                    y: 0,
                    filter: "blur(0px)",
                    clipPath: "inset(0% 0 0% 0)",
                });
                gsap.set(mediaImages, {
                    scale: 1,
                    filter: "brightness(1)",
                });

                if (reduceMotion) {
                    rows.forEach((row, index) => {
                        gsap.set(row, {
                            top: layout[index].top,
                            height: layout[index].height,
                            y: 0,
                            zIndex: index + 1,
                            overflow: "hidden",
                        });
                    });
                    return;
                }

                openTimelineRef.current?.kill();
                rows.forEach((row, index) => {
                    gsap.set(row, {
                        top: layout[index].top,
                        height: layout[index].height,
                        y: 0,
                        zIndex: index + 1,
                        overflow: "hidden",
                    });
                });
            },
        );

        return () => {
            openTimelineRef.current?.kill();
            matchMedia.revert();
        };
    }, {scope: sectionRef});

    useEffect(() => {
        activeIndexRef.current = activeIndex;

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        const rows = rowsRef.current;
        if (rows.length === 0) return;

        const {compactHeight, expandedHeight, headerHeight, reduceMotion} = layoutRef.current;
        const layout = getServiceLayout(activeIndex, headerHeight, compactHeight, expandedHeight);

        openTimelineRef.current?.kill();

        if (reduceMotion) {
            rows.forEach((row, index) => {
                gsap.set(row, {
                    top: layout[index].top,
                    height: layout[index].height,
                    y: 0,
                    zIndex: index + 1,
                    overflow: "hidden",
                });
            });
            return;
        }

        openTimelineRef.current = gsap.timeline({
            defaults: {
                ease: motionEases.reveal,
            },
        })
            .to(rows, {
                top: (index) => layout[index].top,
                height: (index) => layout[index].height,
                y: 0,
                zIndex: (index) => index + 1,
                duration: 0.86,
                stagger: {
                    each: 0.018,
                    from: activeIndex,
                },
                overwrite: true,
            }, 0)
            .set(rows, {
                overflow: "hidden",
            });

        return () => {
            openTimelineRef.current?.kill();
        };
    }, [activeIndex]);

    const handleOpen = (nextIndex: number) => {
        if (nextIndex === activeIndex) return;
        setActiveIndex(nextIndex);
    };

    return (
        <section ref={sectionRef} className="relative z-[1] min-h-screen bg-white text-[#111]">
            <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-white">
                <div
                    data-services-panel
                    className="relative h-screen w-full overflow-hidden bg-white"
                >
                    <div
                        data-services-header
                        className="absolute left-0 right-0 top-0 flex items-center px-5 md:px-6"
                    >
                        <h2 className="text-[34px] font-normal leading-none tracking-[-0.045em] md:text-[36px]">
                            Services
                        </h2>
                        <span data-services-header-line className="absolute bottom-0 left-0 h-px w-full bg-black/34"/>
                    </div>

                    {services.map((service, index) => {
                        const isOpen = index === activeIndex;

                        return (
                            <article
                                key={service.id}
                                data-service-row
                                className={`absolute left-0 right-0 overflow-hidden bg-white ${index === 0 ? "" : "border-t border-black/34"}`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={`service-panel-${service.id}`}
                                    onClick={() => handleOpen(index)}
                                    className="grid h-full w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 px-5 py-5 text-left md:grid-cols-[9.5rem_13.5rem_minmax(0,1fr)] md:gap-x-8 md:px-5"
                                >
                                    <span data-service-text-item className="block text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                        /{service.index}
                                    </span>
                                    <h3 data-service-text-item className="text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                        {service.title}
                                    </h3>
                                    <div
                                        id={`service-panel-${service.id}`}
                                        className={`col-span-2 grid min-h-0 w-full content-start gap-7 justify-self-end pt-5 md:col-span-1 md:max-w-[52rem] md:pt-0 ${isOpen ? "overflow-visible" : "overflow-hidden"}`}
                                    >
                                        <p
                                            data-service-text-item
                                            className="w-full max-w-[52rem] whitespace-normal text-wrap break-words text-[16px] font-normal leading-[1.18] tracking-[-0.045em] text-black/42 md:text-[18px]"
                                        >
                                            {service.description}
                                        </p>
                                        <figure data-service-media className="h-[40vw] max-h-[20rem] min-h-[12rem] w-full max-w-[52rem] overflow-hidden md:h-[9.75rem] md:max-h-none lg:h-[12rem] xl:h-[13.25rem]">
                                            <img
                                                data-service-media-image
                                                src={service.image}
                                                alt={service.imageAlt}
                                                className="h-full w-full object-cover object-center"
                                                loading="lazy"
                                            />
                                        </figure>
                                    </div>
                                </button>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
