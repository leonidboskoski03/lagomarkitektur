import {motion} from "motion/react";
import {useRef, useState} from "react";
import gsap from "gsap";
import clsx from "clsx";

const links = [
    {href: "/works", label: "works"},
    {href: "/studio", label: "Studio"},
    {href: "/contact", label: "contact"},
    {href: "/process", label: "process"},
];

const charVariants = {
    initial: {y: 0},
    hover: {y: "-100%"},
};

const handleMouseEnter = () => {
    gsap.fromTo(
        "#logo-left",
        {y: -5, opacity: 0},
        {y: 0, opacity: 1, duration: 0.2, ease: "power3.out"}
    );
    gsap.fromTo(
        "#logo-stem",
        {y: -5, opacity: 0},
        {y: 0, opacity: 1, duration: 0.2, delay: 0.1, ease: "power3.out"}
    );
    gsap.fromTo(
        "#logo-top",
        {x: 5, opacity: 0},
        {x: 0, opacity: 1, duration: 0.2, delay: 0.2, ease: "power3.out"}
    );
    gsap.fromTo(
        "#logo-bottom",
        {x: 5, opacity: 0},
        {x: 0, opacity: 1, duration: 0.2, delay: 0.3, ease: "power3.out"}
    );
};

export function Navbar() {
    return (
        <header className="fixed top-0 z-[100] flex h-[15vh] w-full items-center justify-between px-8 md:px-16 mix-blend-difference">
            <div className="text-white mix-blend-difference">
                <Logo />
            </div>

            <nav className="flex gap-4 text-white mix-blend-difference">
                {links.map((link) => (
                    <ClipMaskTextAnimation
                        text={link.label}
                        key={link.href}
                        className="text-sm"
                    />
                ))}
            </nav>

            <GetInTouchButton />
        </header>
    );
}

function GetInTouchButton() {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.button
            className={"rounded-4xl bg-white p-4 flex gap-2 items-center text-black"}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <div className="relative overflow-hidden text-sm  uppercase leading-none">
                <motion.div
                    className="relative"
                    animate={hovered ? {y: "-100%"} : {y: "0%"}}
                    transition={{duration: 0.3, ease: "easeOut"}}
                >
                    <div>Get in touch</div>
                    <div className="absolute top-full left-0 w-full">Get in touch</div>
                </motion.div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <motion.circle
                    cx="8"
                    cy="8"
                    r="4"
                    stroke="black"
                    strokeWidth={1.5}
                    initial={false}
                    animate={hovered ? {scale: 0.63, fill: "black"} : {scale: 0.85, fill: "none"}}
                    transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
                />
            </svg>
        </motion.button>
    );
}

export function ClipMaskTextAnimation({text, className, handleMouseEnter}: { text: string, className?: string, handleMouseEnter?: () => void }) {
    return (
        <div onMouseEnter={handleMouseEnter} className={clsx("relative overflow-hidden cursor-pointer uppercase", className)}>
            <motion.div
                className="relative"
                whileHover={{y: "-100%"}}
                transition={{duration: 0.3, ease: "easeOut"}}
            >
                <div>{text}</div>
                <div className="absolute top-full left-0 w-full">{text}</div>
            </motion.div>
        </div>
    );
}

const Logo = () => {

    return (
        <div className={"flex items-start justify-center gap-2 cursor-pointer"}>
            <LogoMark/>
            <ClipMaskTextAnimation text={"lagom"} className={"logo-text text-2xl self-center uppercase font-bold"} handleMouseEnter={handleMouseEnter} />
        </div>
    );
};

export function LogoMark() {
    const svgRef = useRef<SVGSVGElement>(null!);

    return (
        <svg
            ref={svgRef}
            onMouseEnter={handleMouseEnter}
            width="60"
            height="60"
            viewBox="0 0 150 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
        >
            {/*<rect width="256" height="204" fill="none"/>*/}

            <polygon
                id="logo-left"
                points="69,28 89,28 90,122 69,142"
                fill="currentColor"
            />

            <polygon
                id="logo-stem"
                points="102,28 122,28 123,89 102,109"
                fill="currentColor"
            />

            <polygon
                id="logo-top"
                points="126,92 170,92 170,113 105,113"
                fill="currentColor"
            />

            <polygon
                id="logo-bottom"
                points="94,125 170,126 170,146 72,146"
                fill="currentColor"
            />
        </svg>
    );
}

export function SplitText({text}: { text: string }) {
    const chars = text.split("");

    return (
        <>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    variants={charVariants}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </>
    );
}

