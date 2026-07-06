import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {motionEases} from "../lib/motion";
import {projectShowcaseProjects} from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const titleJoin = (prefix: string, title: string) => `${prefix} - ${title}`;
const renderMetaItems = (items: string[]) => (
    items.map((item, index) => (
        <span key={item} data-project-meta-item className="inline-block will-change-[transform,opacity]">
            {item}{index < items.length - 1 ? "\u00A0\u00B7\u00A0" : ""}
        </span>
    ))
);

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
        const firstMetaItems = [
            ...gsap.utils.toArray<HTMLElement>("[data-project-meta-item]", tags[0]),
            ...gsap.utils.toArray<HTMLElement>("[data-project-meta-item]", properties[0]),
        ];
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
                    gsap.set([backgrounds[0], cards, titles[0], indexes[0], tags[0], properties[0]], {
                        autoAlpha: 1,
                        clipPath: "inset(0% 0 0% 0)",
                        clearProps: "transform",
                    });
                    gsap.set(firstMetaItems, {autoAlpha: 1, clearProps: "transform"});
                    gsap.set([centerGroup, indexWrap, titleWrap, line], {autoAlpha: 1, clearProps: "transform"});
                    gsap.set(line, {scaleX: 1});
                    gsap.set(backgroundFrame, {padding: 0});
                    return;
                }

                const cardWidth = desktop ? 340 : Math.min(252, window.innerWidth * 0.64);
                const cardHeight = cardWidth * 0.5625;
                const enterX = -window.innerWidth * 0.5 - cardWidth - 32;
                const enterY = window.innerHeight * 0.5 + cardHeight * 0.5 + 32;
                const passX = -cardWidth * 0.22;
                const passY = -window.innerHeight * 0.36;
                const exitX = desktop ? window.innerWidth * 0.04 : window.innerWidth * 0.02;
                const exitY = -window.innerHeight * 0.76;
                const cardGap = desktop ? 0.72 : 0.78;
                const cardStart = 0.42;
                const crossDelay = 1.08;

                gsap.set(backgrounds, {
                    autoAlpha: 0,
                    scale: 1.08,
                    filter: "brightness(0.44) contrast(1.1) saturate(0.88)",
                    transformOrigin: "50% 50%",
                    willChange: "transform, opacity, filter",
                });
                gsap.set(backgrounds[0], {
                    autoAlpha: 1,
                    scale: 1,
                    filter: "brightness(0.5) contrast(1.08) saturate(0.92)",
                });

                gsap.set([titles, indexes, tags, properties], {
                    yPercent: 112,
                    autoAlpha: 0,
                    willChange: "transform, opacity",
                });
                gsap.set([titles[0], indexes[0]], {yPercent: 0, autoAlpha: 1});
                gsap.set([tags[0], properties[0]], {yPercent: 0, autoAlpha: 1});
                gsap.set(firstMetaItems, {yPercent: 112, autoAlpha: 0});
                gsap.set(line, {scaleX: 0, transformOrigin: "center center"});
                gsap.set(centerGroup, {autoAlpha: 0.74, scale: 0.985, willChange: "transform, opacity"});
                gsap.set(indexWrap, {x: desktop ? window.innerWidth * 0.18 : window.innerWidth * 0.12, willChange: "transform"});
                gsap.set(titleWrap, {x: desktop ? -window.innerWidth * 0.18 : -window.innerWidth * 0.12, willChange: "transform"});
                gsap.set(rail, {transformPerspective: 1200});
                gsap.set(backgroundFrame, {padding: desktop ? 128 : 64});

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

                const metadataIntro = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.enter},
                });

                metadataIntro
                    .to(firstMetaItems, {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.58,
                        stagger: 0.035,
                    }, 0)
                    .to([tags[0], properties[0]], {
                        autoAlpha: 1,
                        duration: 0.01,
                    }, 0);

                ScrollTrigger.create({
                    trigger: section,
                    start: "top -10%",
                    end: "bottom top",
                    onEnter: () => metadataIntro.play(),
                    onLeaveBack: () => metadataIntro.reverse(),
                    invalidateOnRefresh: true,
                });

                gsap.to(backgroundFrame, {
                    padding: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                        end: "top -5%",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });

                cards.forEach((card) => {
                    const image = card.querySelector("img");
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
                    gsap.set(image, {
                        scale: 1.12,
                        yPercent: 10,
                        willChange: "transform",
                    });
                });

                const timeline = gsap.timeline({
                    defaults: {ease: motionEases.enter},
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => desktop ? "+=560%" : "+=470%",
                        scrub: 0.8,
                        pin: stage,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                timeline
                    .to(cards, {
                        clipPath: "inset(0% 0 0% 0)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: motionEases.reveal,
                    }, 0.06)
                    .to(cards.map((card) => card.querySelector("img")), {
                        yPercent: 0,
                        scale: 1,
                        duration: 0.95,
                        stagger: 0.1,
                        ease: motionEases.enter,
                    }, 0.06);

                cards.forEach((card, index) => {
                    const start = cardStart + index * cardGap;
                    const cross = start + crossDelay;

                    timeline
                        .to(card, {
                            x: passX,
                            y: passY,
                            scale: 0.94,
                            rotation: 0,
                            duration: crossDelay,
                            ease: "none",
                        }, start)
                        .to(card, {
                            x: exitX,
                            y: exitY,
                            scale: 0.9,
                            rotation: 0,
                            duration: 1.08,
                            ease: "none",
                        }, cross)
                        .to(card, {
                            autoAlpha: 0,
                            scale: 0.9,
                            duration: 0.28,
                            ease: motionEases.depart,
                        }, cross + 0.9);
                });

                projectShowcaseProjects.forEach((_, index) => {
                    if (index === 0) return;

                    const switchAt = cardStart + (index - 1) * cardGap + crossDelay;
                    const previous = index - 1;

                    timeline
                        .to(backgrounds[previous], {
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
                        }, switchAt + 0.05)
                        .to([titles[previous], indexes[previous], tags[previous], properties[previous]], {
                            yPercent: -112,
                            autoAlpha: 0,
                            duration: 0.32,
                            stagger: 0.018,
                            ease: motionEases.depart,
                        }, switchAt)
                        .fromTo([indexes[index], titles[index], tags[index], properties[index]], {
                            yPercent: 112,
                            autoAlpha: 0,
                        }, {
                            yPercent: 0,
                            autoAlpha: 1,
                            duration: 0.5,
                            stagger: 0.026,
                            ease: motionEases.enter,
                            immediateRender: false,
                        }, switchAt + 0.14);
                });

                timeline.to(backgrounds[backgrounds.length - 1], {
                    scale: 1.025,
                    filter: "brightness(0.42) contrast(1.1) saturate(0.86)",
                    duration: 0.9,
                    ease: motionEases.settle,
                }, 4.1);
            },
        );

        return () => matchMedia.revert();
    }, {scope: sectionRef});

    return (
        <section ref={sectionRef} data-project-section className="relative z-[3] min-h-screen  text-white -mt-[100vh]">
            <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-transparent">
                <div data-project-bg-frame className="absolute inset-0 overflow-hidden ">
                    <div className="relative h-full w-full overflow-hidden">
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
                        <div className="absolute inset-0 bg-black/46"/>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_48%,transparent_0%,rgba(0,0,0,0.14)_36%,rgba(0,0,0,0.6)_100%)]"/>
                    </div>
                </div>

                <div className="pointer-events-none absolute left-6 right-6 top-10 z-30 flex items-start justify-between gap-8 text-[24px] font-normal leading-none tracking-[-0.045em] text-white/94 md:left-10 md:right-10">
                    <div className="relative h-[1.08em] min-w-0 flex-1 overflow-hidden">
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-tags className="absolute left-0 top-0 block max-w-full whitespace-nowrap">
                                {renderMetaItems(project.tags)}
                            </span>
                        ))}
                    </div>
                    <div className="relative hidden h-[1.08em] min-w-[38vw] overflow-hidden text-right md:block">
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-properties className="absolute right-0 top-0 block whitespace-nowrap">
                                {renderMetaItems(project.properties)}
                            </span>
                        ))}
                    </div>
                </div>

                <div data-project-center-group className="pointer-events-none absolute left-6 right-6 top-1/2 z-30 flex -translate-y-1/2 items-center gap-3 text-[52px] font-normal leading-none tracking-[-0.055em] md:left-10 md:right-10 md:gap-4">
                    <div data-project-index-wrap className="relative h-[1.06em] w-[82px] shrink-0 overflow-hidden">
                        {projectShowcaseProjects.map((project) => (
                            <span key={project.id} data-project-index className="absolute left-0 top-0 block">
                                /{project.index}
                            </span>
                        ))}
                    </div>
                    <div data-project-line className="h-px flex-1 bg-white/58"/>
                    <div data-project-title-wrap className="relative h-[1.08em] min-w-[45vw] overflow-hidden text-right">
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
                            className="group absolute left-1/2 top-1/2 block overflow-hidden bg-white/10 shadow-[0_2rem_5rem_rgba(0,0,0,0.36)] outline outline-1 outline-white/14"
                            aria-label={`Open project ${project.title}`}
                        >
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            <span className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"/>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
