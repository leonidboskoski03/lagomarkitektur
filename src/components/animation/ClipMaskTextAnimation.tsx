import {motion} from "motion/react";
import clsx from "clsx";
import {motionEaseCurves} from "../../lib/motion";

interface ClipMaskTextAnimationProps {
    text: string;
    className?: string;
    handleMouseEnter?: () => void;
    controlled?: boolean;
    active?: boolean;
}

export function ClipMaskTextAnimation({
    text,
    className,
    handleMouseEnter,
    controlled = false,
    active = false,
}: ClipMaskTextAnimationProps) {
    return (
        <span onMouseEnter={handleMouseEnter} className={clsx("relative block overflow-hidden uppercase", className)}>
            <motion.span
                className="relative block"
                animate={controlled ? {y: active ? "-100%" : "0%"} : undefined}
                whileHover={controlled ? undefined : {y: "-100%"}}
                transition={{duration: controlled ? 0.42 : 0.3, ease: motionEaseCurves.settle}}
            >
                <span className="block">{text}</span>
                <span className="absolute left-0 top-full block w-full">{text}</span>
            </motion.span>
        </span>
    );
}
