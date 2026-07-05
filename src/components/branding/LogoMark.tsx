import {useRef} from "react";

interface LogoMarkProps {
    onMouseEnter?: () => void;
    animatedParts?: boolean;
}

export function LogoMark({onMouseEnter, animatedParts = false}: LogoMarkProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    return (
        <svg
            ref={svgRef}
            onMouseEnter={onMouseEnter}
            width="60"
            height="60"
            viewBox="0 0 150 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
            aria-hidden="true"
        >
            <polygon id={animatedParts ? "logo-left" : undefined} points="69,28 89,28 90,122 69,142" fill="currentColor" />
            <polygon id={animatedParts ? "logo-stem" : undefined} points="102,28 122,28 123,89 102,109" fill="currentColor" />
            <polygon id={animatedParts ? "logo-top" : undefined} points="126,92 170,92 170,113 105,113" fill="currentColor" />
            <polygon id={animatedParts ? "logo-bottom" : undefined} points="94,125 170,126 170,146 72,146" fill="currentColor" />
        </svg>
    );
}
