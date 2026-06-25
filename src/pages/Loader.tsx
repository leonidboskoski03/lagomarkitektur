import {motion} from "motion/react";
import {ClipMaskTextAnimation} from "../components/navigation/Navbar.tsx";
import {useLayoutEffect, useRef} from "react";
import gsap from "gsap";

export const Loader = () => {

    return (
        <div className={"w-screen h-screen fixed top-0 bg-black z-[1000]"}>
            <div className={"w-screen h-2 absolute top-0"}>
                <motion.div
                    className={"bg-white w-full h-full"}
                    style={{transformOrigin: "left"}}
                    initial={{scaleX: 0}}
                    animate={{scaleX: 1}}
                    transition={{duration: 2.5, ease: [0.05, 0.7, 0.95, 0.1]}}>
                </motion.div>
            </div>

            <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                <LogoMark/>
            </div>

            <div className={"absolute bottom-5 left-10"}>
                <ClipMaskTextAnimation text={"LAGOM"} className={"text-4xl md:text-[8rem] text-white font-bold"}/>
            </div>
        </div>
    )
}

export function LogoMark() {
    const svgRef = useRef<SVGSVGElement>(null!);
    const poly1 = useRef<SVGPolygonElement>(null!);
    const poly2 = useRef<SVGPolygonElement>(null!);
    const poly3 = useRef<SVGPolygonElement>(null!);
    const poly4 = useRef<SVGPolygonElement>(null!);

    useLayoutEffect(() => {
        const tl = gsap.timeline();

        // gsap.set(poly2.current,{
        //     clipPath: "inset(20% 0% 0% 0)",
        // })
        //
        // gsap.set(poly1.current,{
        //     clipPath: "inset(10% 0% 0% 0)",
        //     transformOrigin: "top"
        // })
        //
        // gsap.set(poly3.current,{
        //     transformOrigin: "center left",
        //     scaleX: -1,
        //     scaleY: -1,
        //
        // })
        //
        // gsap.set(poly2.current,{
        //     transformOrigin: "bottom center",
        //     scaleX: -1,
        //     scaleY: -1,
        //
        // })

        //First Polygon ClipMask
        tl.fromTo(poly1.current,
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0% 0)", duration: 2, ease: "power3.out" }
        );

        tl.fromTo(poly4.current,
            { clipPath: "inset(0 100% 0 0)", transformOrigin:"left" },
            { clipPath: "inset(0 0% 0 0)", duration: 2, ease: "power3.out" },
            "="
        );

        tl.fromTo(poly2.current,
            { clipPath: "inset(0% 0% 100% 0)", transformOrigin:"left" },
            { clipPath: "inset(0% 0% 0% 0)", duration: 2, ease: "power3.out" },
            "=-0.2"
        );

        tl.fromTo(poly3.current,
            { clipPath: "inset(0 0% 0 100%)", transformOrigin:"left" },
            { clipPath: "inset(0 0% 0 0%)", duration: 2, ease: "power3.out" },
            "<="
        );

        tl.to(svgRef.current, {
            rotate: 135,
            duration: 0.5,
        },)

    }, []);

    return (
        <svg
            ref={svgRef}
            width="120"
            height="180"
            viewBox="60 20 120 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
        >
            {/* outside poly long */}
            <polygon
                ref={poly1}
                id="logo-left"
                points="69,28 89,28 89,122 69,142"
                fill="white"
            />

            {/* inner poly long */}
            <polygon
                ref={poly2}
                id="logo-stem"
                points="102,28 122,28 122,89 102,109"
                fill="white"
            />

            {/* inner poly small */}
            <polygon
                ref={poly3}
                id="logo-top"
                points="126,92 170,92 170,112 106,112"
                fill="white"
            />

            {/* outside poly small */}
            <polygon
                ref={poly4}
                id="logo-bottom"
                points="94,126 170,126 170,146 74,146"
                fill="white"
            />
        </svg>
    );
}

