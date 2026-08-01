import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";
import type { Language } from "../../i18n/language";
import { motionEaseCurves } from "../../lib/motion";

interface LanguageSwitcherProps {
    language: Language;
    onChange: (language: Language) => void;
    variant?: "light" | "dark";
    switchToEnglishLabel: string;
    switchToSwedishLabel: string;
}

export function LanguageSwitcher({
    language,
    onChange,
    variant = "light",
    switchToEnglishLabel,
    switchToSwedishLabel,
}: LanguageSwitcherProps) {
    const reduceMotion = useReducedMotion();
    const isDark = variant === "dark";
    const isEnglish = language === "en";
    const nextLanguage: Language = isEnglish ? "sv" : "en";
    const label = isEnglish ? switchToSwedishLabel : switchToEnglishLabel;

    return (
        <motion.button
            type="button"
            data-navbar-language
            data-cursor=""
            aria-label={label}
            title={label}
            onClick={() => onChange(nextLanguage)}
            className={clsx(
                "relative grid h-10 w-[4.5rem] grid-cols-2 items-center overflow-hidden rounded-lg border p-[3px] text-[0.66rem] font-semibold uppercase leading-none tracking-[0.08em] backdrop-blur-md",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                isDark
                    ? "border-black/15 bg-white/58 text-black shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.08)] focus-visible:outline-black"
                    : "border-white/25 bg-black/15 text-white shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.16)] focus-visible:outline-white",
            )}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.3, ease: motionEaseCurves.settle }}
        >
            <motion.span
                aria-hidden="true"
                className={clsx(
                    "absolute bottom-[3px] left-[3px] top-[3px] w-[calc(50%-3px)] rounded-[0.38rem]",
                    isDark
                        ? "bg-black shadow-[0_0.25rem_0.8rem_rgba(0,0,0,0.16)]"
                        : "bg-[#f4f1ea] shadow-[0_0.25rem_0.8rem_rgba(0,0,0,0.18)]",
                )}
                initial={false}
                animate={{ x: isEnglish ? "100%" : "0%" }}
                transition={{
                    duration: reduceMotion ? 0 : 0.68,
                    ease: motionEaseCurves.cinematic,
                }}
            />
            <span
                lang="sv"
                className={clsx(
                    "relative z-10 text-center transition-colors duration-500 ease-[cubic-bezier(0.58,0,0.22,1)]",
                    !isEnglish
                        ? isDark ? "text-white" : "text-black"
                        : isDark ? "text-black/48" : "text-white/58",
                )}
            >
                SE
            </span>
            <span
                lang="en"
                className={clsx(
                    "relative z-10 text-center transition-colors duration-500 ease-[cubic-bezier(0.58,0,0.22,1)]",
                    isEnglish
                        ? isDark ? "text-white" : "text-black"
                        : isDark ? "text-black/48" : "text-white/58",
                )}
            >
                EN
            </span>
        </motion.button>
    );
}
