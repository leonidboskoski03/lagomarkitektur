import hero1 from '../assets/images/hero.avif'
import hero2 from '../assets/images/hero2.avif'
import {motion} from "motion/react";
import { useRef, useState} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const items = ["featured project", "Myrtle Pool House","Villa House", "2024", "view project"]

export const Hero = () => {
    const [hovered, setHovered] = useState(false);
    const heroRef = useRef<HTMLDivElement | null>(null);
    const heroRef2 = useRef<HTMLDivElement | null>(null);

    const handleHeroMouseOn = () => {
        const tl = gsap.timeline();
        console.log("hovered")
        tl.to(heroRef.current, {
            clipPath: "inset(0 0 100% 0)",
            scale: 1,
            duration: 0.8,
            ease: "power3.inOut",
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero+=0.05")
    }

    const handleHeroMouseOff = () => {
        const tl = gsap.timeline();

        tl.to(heroRef.current, {
            clipPath: "inset(0 0 0% 0)",
            scale: 1.06,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero")

        tl.to(heroRef2.current, {
            scale: 1.08,
            duration: 0.8,
            ease: "power2.inOut",
        },"hero")
    }

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!heroRef.current) return;

        gsap.to(heroRef.current, {
            yPercent: -50,
            filter: "brightness(0.35)",
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });
    });

    return (
        <section className="relative z-[1] h-[200vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">

                <div className={"absolute top-0 z-10"} ref={heroRef} style={{
                    backgroundImage: `url(${hero1})`,
                    backgroundSize: "cover",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(0.55)",
                    scale: 1.06
                }}/>

                <div className={"absolute top-0"} ref={heroRef2} style={{
                    backgroundImage: `url(${hero2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(0.45)",
                    scale: 1.10
                }}/>

                <div className={" h-[10vh]  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-between w-full px-[6.5rem]"}>
                    {items.map((item, index) => {
                        return(
                            <div key={index} className={`${index % 2 ? 'self-end' : ''}`}>
                                <h1
                                    className={`flex justify-center items-center text-sm font-bold uppercase text-white`}
                                    onMouseEnter={() => {
                                        setHovered(true)
                                        if (index === items.length -1) handleHeroMouseOn()
                                    }}
                                    onMouseLeave={() => {
                                        setHovered(false)
                                        if (index === items.length -1) handleHeroMouseOff()
                                    }}
                                >
                                    {items.length === index + 1 ? <NavItemUnderlineAnimation label={item}/> : item}
                                    {items.length === index + 1 ? <DotAnimation hovered={hovered}/> : null}
                                </h1>
                            </div>
                        )
                    })}
                </div>

                <div className={"absolute bottom-10 z-10 w-1/3 pl-[6.5rem]"}>
                    <h1 className={"text-white text-3xl"}>
                        The OH Architecture style is defined by
                        strong, solid forms with subtle elegance,
                        natural balance and enduring appeal
                    </h1>
                </div>
            </div>


        </section>
    )
}

const DotAnimation = ({hovered}:{hovered: boolean}) => {

    return(
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <motion.circle
                cx="8"
                cy="8"
                r="3"
                stroke="white"
                strokeWidth={1}
                initial={false}
                animate={hovered ? {scale: 0.63, fill: "white"} : {scale: 0.85, fill: "none"}}
                transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
            />
        </svg>
    )
}

const NavItemUnderlineAnimation = ({ label }: { label: string }) => {
    const whiteLineRef = useRef<HTMLDivElement | null>(null);
    const redLineRef = useRef<HTMLDivElement | null>(null);

    const handleEnter = () => {
        if (!whiteLineRef.current || !redLineRef.current) return;

        gsap.killTweensOf([whiteLineRef.current, redLineRef.current]);

        const tl = gsap.timeline();

        // Reset both lines before every hover
        gsap.set([whiteLineRef.current], {
            xPercent: 0,
        });

        gsap.set([redLineRef.current], {
            xPercent: -110,
        });

        // First line passes through
        tl.to(
            whiteLineRef.current,
            {
                xPercent: 110,
                duration: 1,
                ease: "power3.inOut",
            },
            0
        );

        // Second line follows shortly after
        tl.to(
            redLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: "power3.inOut",
            },
            0.16
        );
    };

    const handleLeave = () => {
        if (!whiteLineRef.current || !redLineRef.current) return;

        gsap.killTweensOf([whiteLineRef.current, redLineRef.current]);

        const tl = gsap.timeline();

        tl.to(redLineRef.current,{
            xPercent: 110,
            duration: 0.8,
            ease: "power3.inOut",
        })

        gsap.set([whiteLineRef.current], {xPercent: -110});

        tl.to(
            whiteLineRef.current,
            {
                xPercent: 0,
                duration: 1,
                ease: "power3.inOut",
            },
            0.16
        );

    };

    return (
        <div
            className="relative inline-block cursor-pointer text-white"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {label}

            <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">

                <div
                    ref={whiteLineRef}
                    className="absolute inset-0 h-full w-full bg-white"
                />

                <div
                    ref={redLineRef}
                    className="absolute inset-0 h-full w-full bg-white"
                />
            </div>
        </div>
    );
};