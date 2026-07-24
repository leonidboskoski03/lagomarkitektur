import {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {services} from "../data/services";
import {motionEases} from "../lib/motion";
import {ArchitecturalProcessStory} from "../components/services/ArchitecturalProcessStory";

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

interface ServicesAccordionProps {
    initialActiveIndex?: number;
}

export const ServicesSection = () => (
    <>
        <ServicesAccordion initialActiveIndex={services.length - 1}/>
        <ArchitecturalProcessStory/>
    </>
);

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
        const heading = stage.querySelector<HTMLElement>("[data-services-heading]");
        const headerLine = stage.querySelector<HTMLElement>("[data-services-header-line]");
        const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]", stage);
        const panelBodies = gsap.utils.toArray<HTMLElement>("[data-service-reveal]", stage);
        const rowRules = gsap.utils.toArray<HTMLElement>("[data-service-rule]", stage);
        const summaryItems = gsap.utils.toArray<HTMLElement>("[data-service-summary]", stage);
        const detailItems = gsap.utils.toArray<HTMLElement>("[data-service-detail]", stage);
        const media = gsap.utils.toArray<HTMLElement>("[data-service-media]", stage);
        const mediaImages = gsap.utils.toArray<HTMLElement>("[data-service-media-image]", stage);
        const textItems = gsap.utils.toArray<HTMLElement>("[data-service-text-item]", stage);
        rowsRef.current = rows;

        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                mobile: "(max-width: 767px)",
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
                const panelHeight = headerHeight + expandedHeight + compactHeight * (services.length - 1);
                layoutRef.current = {
                    compactHeight,
                    expandedHeight,
                    headerHeight,
                    reduceMotion,
                };

                gsap.set([stage, panel], {
                    height: panelHeight,
                });
                gsap.set(header, {
                    height: headerHeight,
                });
                gsap.set(headerLine, {
                    transformOrigin: "left center",
                });
                gsap.set(rowRules, {
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
                    gsap.set(heading, {
                        autoAlpha: 1,
                        y: 0,
                        clearProps: "filter",
                    });
                    gsap.set(headerLine, {
                        scaleX: 1,
                    });
                    gsap.set(rowRules, {
                        scaleX: 1,
                    });
                    gsap.set(panelBodies, {
                        autoAlpha: 1,
                        clearProps: "transform,clipPath",
                    });
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

                gsap.set(heading, {
                    y: 18,
                    autoAlpha: 0,
                    filter: "blur(6px)",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(headerLine, {
                    scaleX: 0,
                    willChange: "transform",
                });

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

                gsap.set(panelBodies, {
                    y: desktop ? 44 : 26,
                    autoAlpha: 0,
                    clipPath: "inset(100% 0% 0% 0%)",
                    willChange: "transform, opacity, clip-path",
                });
                gsap.set(rowRules, {
                    scaleX: 0,
                    willChange: "transform",
                });
                gsap.set(summaryItems, {
                    y: desktop ? 14 : 9,
                    autoAlpha: 0,
                    filter: desktop ? "blur(4px)" : "blur(2px)",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(detailItems, {
                    y: desktop ? 18 : 10,
                    autoAlpha: 0,
                    filter: desktop ? "blur(5px)" : "blur(2px)",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(media, {
                    autoAlpha: 0,
                    clipPath: desktop
                        ? "inset(0% 0% 100% 0%)"
                        : "inset(0% 0% 55% 0%)",
                    willChange: "opacity, clip-path",
                });
                gsap.set(mediaImages, {
                    scale: desktop ? 1.055 : 1.025,
                    transformOrigin: "50% 50%",
                    willChange: "transform",
                });

                const panelEntrance = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.enter},
                });

                panelEntrance
                    .to(heading, {
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
                    }, 0.08)
                    .to(panelBodies, {
                        y: 0,
                        autoAlpha: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: desktop ? 1.08 : 0.82,
                        stagger: desktop ? 0.075 : 0.055,
                        ease: motionEases.reveal,
                    }, desktop ? 0.26 : 0.2)
                    .to(rowRules, {
                        scaleX: 1,
                        duration: desktop ? 0.92 : 0.68,
                        stagger: desktop ? 0.075 : 0.055,
                        ease: motionEases.depart,
                    }, desktop ? 0.44 : 0.32)
                    .to(summaryItems, {
                        y: 0,
                        autoAlpha: 1,
                        filter: "blur(0px)",
                        duration: desktop ? 0.82 : 0.62,
                        stagger: desktop ? 0.035 : 0.025,
                        ease: motionEases.enter,
                    }, desktop ? 0.52 : 0.38)
                    .to(detailItems, {
                        y: 0,
                        autoAlpha: 1,
                        filter: "blur(0px)",
                        duration: desktop ? 0.9 : 0.68,
                        stagger: desktop ? 0.035 : 0.02,
                        ease: motionEases.enter,
                    }, desktop ? 0.86 : 0.58)
                    .to(media, {
                        autoAlpha: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: desktop ? 1.02 : 0.72,
                        stagger: desktop ? 0.04 : 0.025,
                        ease: motionEases.reveal,
                    }, desktop ? 0.94 : 0.64)
                    .to(mediaImages, {
                        scale: 1,
                        duration: desktop ? 1.24 : 0.82,
                        stagger: desktop ? 0.04 : 0.025,
                        ease: motionEases.settle,
                    }, desktop ? 0.94 : 0.64)
                    .set(panelBodies, {
                        clearProps: "transform,opacity,visibility,clipPath,willChange",
                    })
                    .set([...summaryItems, ...detailItems], {
                        clearProps: "transform,opacity,visibility,filter,willChange",
                    })
                    .set(media, {
                        clearProps: "opacity,visibility,clipPath,willChange",
                    })
                    .set(mediaImages, {
                        clearProps: "transform,willChange",
                    });

                ScrollTrigger.create({
                    trigger: heading,
                    start: "top 80%",
                    end: "bottom top",
                    onEnter: () => panelEntrance.play(),
                    onEnterBack: () => panelEntrance.play(),
                    onLeaveBack: () => panelEntrance.reverse(),
                    invalidateOnRefresh: true,
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
        <section ref={sectionRef} className="relative z-[1] bg-white text-[#111]">
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

                    {services.map((service, index) => {
                        const isOpen = index === activeIndex;

                        return (
                            <article
                                key={service.id}
                                data-service-row
                                className="absolute left-0 right-0 overflow-hidden bg-white"
                            >
                                {index > 0 && (
                                    <span
                                        data-service-rule
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-black/34"
                                    />
                                )}
                                <button
                                    data-service-reveal
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={`service-panel-${service.id}`}
                                    onClick={() => handleOpen(index)}
                                    className="relative z-[1] grid h-full w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 px-5 py-5 text-left md:grid-cols-[9.5rem_13.5rem_minmax(0,1fr)] md:gap-x-8 md:px-5"
                                >
                                    <span data-service-text-item data-service-summary className="block text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                        /{service.index}
                                    </span>
                                    <h3 data-service-text-item data-service-summary className="text-[17px] font-normal leading-none tracking-[-0.035em] text-black md:text-[18px]">
                                        {service.title}
                                    </h3>
                                    <div
                                        id={`service-panel-${service.id}`}
                                        className={`col-span-2 grid min-h-0 w-full content-start gap-7 justify-self-end pt-5 md:col-span-1 md:max-w-[52rem] md:pt-0 ${isOpen ? "overflow-visible" : "overflow-hidden"}`}
                                    >
                                        <p
                                            data-service-text-item
                                            data-service-detail
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
