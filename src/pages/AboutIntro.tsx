import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {motionEases} from "../lib/motion";
import stoneframeFront from "../assets/images/about/stoneframe-front.webp";
import stoneframeEntry from "../assets/images/about/stoneframe-entry.webp";
import stoneframeSide from "../assets/images/about/stoneframe-side.webp";
import sereneDining from "../assets/images/about/serene-dining.webp";
import archmoodArch from "../assets/images/about/archmood-arch.webp";

gsap.registerPlugin(ScrollTrigger);

const headingLines = [
    "Architecture should feel considered,",
    "personal, and quietly effortless.",
];

const statementSentences = [
    "LAGOM Architecture creates sustainable spaces defined by",
    "balance, meaning and purpose.",
    "Every element is carefully considered and feels just right.",
];

const exitRoutes = [
    {xPercent: 26, yPercent: -24, z: 1320, duration: 1.18, offset: 0.04, imageScale: 1.035},
    {xPercent: -36, yPercent: -17, z: 1430, duration: 1.46, offset: 0.12, imageScale: 1.055},
    {xPercent: -42, yPercent: 35, z: 1500, duration: 1.62, offset: 0.18, imageScale: 1.07},
    {xPercent: 19, yPercent: 43, z: 1380, duration: 1.3, offset: 0.09, imageScale: 1.045},
    {xPercent: 58, yPercent: 155, z: 1540, duration: 1.85, offset: 0.3, imageScale: 1.065},
];

const imageField = [
    {
        src: stoneframeFront,
        alt: "L-28 Stoneframe villa viewed from the garden",
        className: "-right-[8vw] top-[24vh] h-[22vh] w-[60vw] sm:right-[1vw] sm:top-[20vh] sm:h-auto sm:aspect-[2.1/1] sm:w-[42vw] md:right-[7vw] md:top-[7vh] md:h-[28vh] md:w-[29vw]",
    },
    {
        src: sereneDining,
        alt: "Quiet dining interior framed by daylight",
        className: "left-[4vw] top-[32vh] z-30 h-[19vh] w-[42vw] sm:top-[27vh] sm:h-auto sm:aspect-[1.85/1] sm:w-[35vw] md:left-[17vw] md:top-[15vh] md:h-[22vh] md:w-[20vw]",
    },
    {
        src: stoneframeSide,
        alt: "L-28 Stoneframe villa side elevation in afternoon light",
        className: "-left-[8vw] bottom-[10vh] h-[22vh] w-[48vw] sm:left-[2vw] sm:bottom-[10vh] sm:h-auto sm:aspect-[1.42/1] sm:w-[32vw] md:bottom-[5vh] md:left-[10vw] md:h-[30vh] md:w-[21vw]",
    },
    {
        src: archmoodArch,
        alt: "Minimal interior with a sculpted architectural arch",
        className: "bottom-[7vh] left-[38vw] z-30 h-[18vh] w-[48vw] sm:bottom-[12vh] sm:h-auto sm:aspect-[1.85/1] sm:w-[30vw] md:bottom-[7vh] md:left-[33vw] md:h-[22vh] md:w-[20vw]",
    },
    {
        src: stoneframeEntry,
        alt: "L-28 Stoneframe villa entrance and stone courtyard",
        className: "left-[17vw] top-[42vh] z-40 h-[27vh] w-[70vw] sm:left-[20vw] sm:top-[38vh] sm:h-auto sm:aspect-[1.82/1] sm:w-[56vw] md:left-[34vw] md:top-[28vh] md:h-[38vh] md:w-[34vw]",
    },
];

export const AboutIntro = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        const heading = gsap.utils.toArray<HTMLElement>("[data-about-heading-line]", stage);
        const figures = gsap.utils.toArray<HTMLElement>("[data-about-image]", stage);
        const images = gsap.utils.toArray<HTMLElement>("[data-about-image-inner]", stage);
        const statementLines = gsap.utils.toArray<HTMLElement>("[data-about-statement-sentence]", stage);
        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                mobile: "(max-width: 767px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const {desktop, reduceMotion} = context.conditions as {desktop: boolean; reduceMotion: boolean};
                if (reduceMotion) return;

                gsap.set(heading, {yPercent: 115, rotation: 0.5});
                gsap.set(statementLines, {yPercent: 115, autoAlpha: 0, filter: "blur(7px)"});
                gsap.set(figures, {
                    yPercent: 16,
                    z: 0,
                    scale: 0.97,
                    transformOrigin: "50% 100%",
                    transformStyle: "preserve-3d",
                    force3D: true,
                    filter: "brightness(0) saturate(0.35)",
                    clipPath: "inset(100% 0 0 0)",
                });
                gsap.set(images, {yPercent: 24, scale: 1.14, transformOrigin: "50% 100%"});

                const pinDistanceVh = desktop ? 560 : 440;
                const projectOverlapVh = 100;
                const projectOverlapStartProgress = 1 - projectOverlapVh / pinDistanceVh;

                const timeline = gsap.timeline({
                    defaults: {ease: motionEases.reveal},
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: `+=${pinDistanceVh}%`,
                        pin: stage,
                        scrub: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                timeline.to(heading, {
                    yPercent: 0,
                    rotation: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    ease: motionEases.enter,
                }, 0);

                figures.forEach((figure, index) => {
                    timeline.to(figure, {
                        yPercent: 0,
                        scale: 1,
                        filter: "brightness(1) saturate(1)",
                        clipPath: "inset(0% 0 0% 0)",
                        duration: 0.92,
                    }, 0.12 + index * 0.13);
                    timeline.to(images[index], {
                        yPercent: 0,
                        scale: 1,
                        duration: 1.05,
                        ease: motionEases.settle,
                    }, 0.12 + index * 0.13);
                });

                const imageRevealComplete = 0.12 + (figures.length - 1) * 0.13 + 1.05;
                const imageExitStart = imageRevealComplete + 0.7;
                timeline.addLabel("images-visible", imageRevealComplete);
                timeline.addLabel("image-exit", imageExitStart);
                timeline.set(figures, {clipPath: "inset(0% 0 0% 0)", z: 0}, "images-visible");

                timeline.to(statementLines, {
                    yPercent: 0,
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: 0.58,
                    stagger: 0.08,
                    ease: motionEases.enter,
                }, 1.12);

                figures.forEach((figure, index) => {
                    const route = exitRoutes[index];
                    const routeStart = `image-exit+=${route.offset}`;

                    timeline.to(figure, {
                        xPercent: route.xPercent,
                        yPercent: route.yPercent,
                        z: route.z,
                        filter: "brightness(0.9) saturate(0.92)",
                        duration: route.duration,
                        force3D: true,
                        ease: motionEases.reveal,
                    }, routeStart);
                    timeline.to(images[index], {
                        scale: route.imageScale,
                        duration: route.duration,
                        ease: motionEases.settle,
                    }, routeStart);
                    timeline.to(figure, {
                        autoAlpha: 0,
                        duration: 0.18,
                        ease: motionEases.depart,
                    }, `image-exit+=${route.offset + route.duration - 0.16}`);
                });

                const imageExitComplete = imageExitStart + Math.max(...exitRoutes.map((route) => route.offset + route.duration));
                const imageExitCompleteProgress = projectOverlapStartProgress;
                timeline.to({}, {
                    duration: imageExitComplete / imageExitCompleteProgress - imageExitComplete,
                });

                const statementExitTimeline = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.depart},
                });
                const headingExitTimeline = gsap.timeline({
                    paused: true,
                    defaults: {ease: motionEases.depart},
                });
                const statementExitProgress = 0.78;
                const headingExitProgress = 0.92;

                const reversedStatementLines = [...statementLines].reverse();
                const reversedHeadingLines = [...heading].reverse();

                statementExitTimeline.to(reversedStatementLines, {
                    yPercent: -115,
                    autoAlpha: 0,
                    filter: "blur(7px)",
                    duration: 0.58,
                    stagger: 0.09,
                });

                headingExitTimeline.to(reversedHeadingLines, {
                    yPercent: -115,
                    autoAlpha: 0,
                    duration: 0.58,
                    stagger: 0.08,
                });

                let statementExited = false;
                let headingExited = false;
                const textExitTrigger = ScrollTrigger.create({
                    trigger: section,
                    start: "top top",
                    end: `+=${pinDistanceVh}%`,
                    invalidateOnRefresh: true,
                    refreshPriority: 1,
                    onUpdate: (self) => {
                        console.log(`AboutIntro progress: ${(self.progress * 100).toFixed(1)}%`);

                        if (self.progress >= statementExitProgress && !statementExited) {
                            statementExited = true;
                            statementExitTimeline.play();
                        } else if (self.progress < statementExitProgress && statementExited) {
                            statementExited = false;
                            statementExitTimeline.reverse();
                        }

                        if (self.progress >= headingExitProgress && !headingExited) {
                            headingExited = true;
                            headingExitTimeline.play();
                        } else if (self.progress < headingExitProgress && headingExited) {
                            headingExited = false;
                            headingExitTimeline.reverse();
                        }
                    },
                });

                return () => {
                    timeline.kill();
                    statementExitTimeline.kill();
                    headingExitTimeline.kill();
                    textExitTrigger?.kill();
                };
            },
            stage,
        );

        return () => matchMedia.revert();
    }, {scope: sectionRef});

    return (
        <section ref={sectionRef} className="relative z-[2] min-h-screen bg-white text-[#171717] -mt-[100vh]">
            <div ref={stageRef} className="relative h-dvh w-full overflow-hidden [perspective:1600px] [perspective-origin:50%_48%]">
                <div data-about-heading-block className="absolute left-[var(--spacing-viewport-gutter)] top-[7vh] z-10 max-w-[58rem] md:top-[8vh]">
                    <h2 className="text-[clamp(1.85rem,3.6vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.055em]">
                        {headingLines.map((line) => (
                            <span key={line} className="block overflow-hidden pb-[0.06em]">
                                <span data-about-heading-line className="block will-change-transform">{line}</span>
                            </span>
                        ))}
                    </h2>
                </div>

                <div aria-hidden="true" className="absolute inset-0 z-30 [transform-style:preserve-3d]">
                    {imageField.map((image) => (
                        <figure
                            key={image.src}
                            data-about-image
                            className={`absolute z-30 overflow-hidden bg-[#d8d4cc] will-change-[transform,filter,clip-path] ${image.className}`}
                        >
                            <img
                                data-about-image-inner
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 !h-full w-full object-cover will-change-transform"
                            />
                        </figure>
                    ))}
                </div>

                <p data-about-statement-block className="absolute bottom-[5vh] right-[var(--spacing-viewport-gutter)] z-10 max-w-[34rem] text-[clamp(1rem,1.45vw,1.35rem)] leading-[1.18] tracking-[-0.025em] max-md:bottom-[3vh] max-md:max-w-[72vw]">
                    {statementSentences.map((sentence) => (
                        <span key={sentence} className="block overflow-hidden pb-[0.04em]">
                            <span data-about-statement-sentence className="block will-change-[transform,filter,opacity]">
                                {sentence}
                            </span>
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
};
