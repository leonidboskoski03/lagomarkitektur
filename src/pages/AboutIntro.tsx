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

const statement = "LAGOM Architecture creates sustainable spaces defined by balance, meaning, and purpose — where every element is carefully considered and feels just right.";

const exitRoutes = [
    {xPercent: 26, yPercent: -24, z: 1320, duration: 1.18, offset: 0.04, imageScale: 1.035},
    {xPercent: -36, yPercent: -17, z: 1430, duration: 1.46, offset: 0.12, imageScale: 1.055},
    {xPercent: 58, yPercent: 155, z: 1540, duration: 1.85, offset: 0.3, imageScale: 1.065},
    {xPercent: -42, yPercent: 35, z: 1500, duration: 1.62, offset: 0.18, imageScale: 1.07},
    {xPercent: 19, yPercent: 43, z: 1380, duration: 1.3, offset: 0.09, imageScale: 1.045},
];

const imageField = [
    {
        src: stoneframeFront,
        alt: "L-28 Stoneframe villa viewed from the garden",
        className: "right-[7vw] top-[7vh] h-[28vh] w-[29vw] max-md:-right-[8vw] max-md:top-[24vh] max-md:h-[22vh] max-md:w-[60vw]",
    },
    {
        src: sereneDining,
        alt: "Quiet dining interior framed by daylight",
        className: "left-[17vw] top-[15vh] z-30 h-[22vh] w-[20vw] max-md:left-[4vw] max-md:top-[32vh] max-md:h-[19vh] max-md:w-[42vw]",
    },
    {
        src: stoneframeEntry,
        alt: "L-28 Stoneframe villa entrance and stone courtyard",
        className: "left-[34vw] top-[28vh] z-40 h-[38vh] w-[34vw] max-md:left-[17vw] max-md:top-[42vh] max-md:h-[27vh] max-md:w-[70vw]",
    },
    {
        src: stoneframeSide,
        alt: "L-28 Stoneframe villa side elevation in afternoon light",
        className: "bottom-[5vh] left-[10vw] h-[30vh] w-[21vw] max-md:-left-[8vw] max-md:bottom-[10vh] max-md:h-[22vh] max-md:w-[48vw]",
    },
    {
        src: archmoodArch,
        alt: "Minimal interior with a sculpted architectural arch",
        className: "bottom-[7vh] left-[33vw] z-30 h-[22vh] w-[20vw] max-md:bottom-[7vh] max-md:left-[38vw] max-md:h-[18vh] max-md:w-[48vw]",
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
        const words = gsap.utils.toArray<HTMLElement>("[data-about-word]", stage);
        const matchMedia = gsap.matchMedia();

        matchMedia.add(
            {
                desktop: "(min-width: 768px)",
                reduceMotion: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const {desktop, reduceMotion} = context.conditions as {desktop: boolean; reduceMotion: boolean};
                if (reduceMotion) return;

                gsap.set(heading, {yPercent: 115, rotation: 0.5});
                gsap.set(words, {yPercent: 115, autoAlpha: 0, filter: "blur(7px)"});
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

                const timeline = gsap.timeline({
                    defaults: {ease: motionEases.reveal},
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: desktop ? "+=460%" : "+=340%",
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

                timeline.to(words, {
                    yPercent: 0,
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: 0.5,
                    stagger: 0.018,
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

                return () => timeline.kill();
            },
            stage,
        );

        return () => matchMedia.revert();
    }, {scope: sectionRef});

    return (
        <section ref={sectionRef} className="relative z-[2] min-h-screen bg-white text-[#171717] -mt-[100vh]">
            <div ref={stageRef} className="relative h-dvh w-full overflow-hidden [perspective:1600px] [perspective-origin:50%_48%]">
                <div className="absolute left-[var(--spacing-viewport-gutter)] top-[7vh] z-10 max-w-[58rem] md:top-[8vh]">
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
                                className="h-full w-full object-cover will-change-transform"
                            />
                        </figure>
                    ))}
                </div>

                <p className="absolute bottom-[5vh] right-[var(--spacing-viewport-gutter)] z-10 max-w-[34rem] text-[clamp(1rem,1.45vw,1.35rem)] leading-[1.18] tracking-[-0.025em] max-md:bottom-[3vh] max-md:max-w-[72vw]">
                    {statement.split(" ").map((word, index) => (
                        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                            <span data-about-word className="inline-block will-change-[transform,filter,opacity]">
                                {word}{index < statement.split(" ").length - 1 ? "\u00a0" : ""}
                            </span>
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
};
