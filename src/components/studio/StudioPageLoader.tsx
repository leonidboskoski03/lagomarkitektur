import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { studioContent } from "../../data/studio";
import { useLocalizedContent } from "../../i18n/LanguageContext";

const veilEase = [0.83, 0, 0.17, 1] as const;
const constructionEase = [0.16, 1, 0.3, 1] as const;

export function StudioPageLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [isComplete, setIsComplete] = useState(false);
  const unlockScrollRef = useRef<() => void>(() => undefined);
  const { loader, hero } = useLocalizedContent(studioContent);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    let isUnlocked = false;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    window.dispatchEvent(
      new CustomEvent("lagom:scroll-lock", {
        detail: { locked: true },
      }),
    );

    const unlockScroll = () => {
      if (isUnlocked) return;
      isUnlocked = true;

      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.dispatchEvent(
        new CustomEvent("lagom:scroll-lock", {
          detail: { locked: false },
        }),
      );
    };

    unlockScrollRef.current = unlockScroll;

    return unlockScroll;
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || isComplete) return null;

  return (
    <motion.div
      data-studio-page-loader=""
      aria-hidden="true"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{
        duration: 1.48,
        delay: 1.26,
        ease: veilEase,
      }}
      onAnimationComplete={() => {
        unlockScrollRef.current();
        setIsComplete(true);
      }}
      className="fixed inset-0 z-[1000] overflow-hidden bg-white text-brand-ink will-change-[clip-path]"
    >
      <div className="viewport-container flex min-h-[100dvh] items-center">
        <div className="w-full">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.78,
                delay: 0.04,
                ease: constructionEase,
              }}
              className="text-[0.66rem] font-semibold uppercase tracking-[0.075em] text-black/48 will-change-transform"
            >
              {loader.label}
            </motion.p>
          </div>

          <div className="mt-[clamp(1.75rem,3vw,3.25rem)] flex items-end gap-[clamp(1rem,2.5vw,2.75rem)]">
            <div className="min-w-0 overflow-hidden pb-[0.08em]">
              <motion.p
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.12,
                  delay: 0.08,
                  ease: constructionEase,
                }}
                className="whitespace-nowrap text-[clamp(4.2rem,18vw,15.5rem)] font-medium leading-[0.75] tracking-[-0.078em] will-change-transform"
              >
                {loader.title}
              </motion.p>
            </div>

            <motion.div
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{
                duration: 1.08,
                delay: 0.18,
                ease: veilEase,
              }}
              className="relative mb-[0.09em] h-[clamp(3.75rem,8vw,7.5rem)] w-[clamp(5.25rem,16vw,14rem)] shrink-0 overflow-hidden bg-white will-change-[clip-path]"
            >
              <motion.img
                src={hero.accentMedia.src}
                alt=""
                width={hero.accentMedia.width}
                height={hero.accentMedia.height}
                loading="eager"
                initial={{ scale: 1.1, y: "7%" }}
                animate={{ scale: 1, y: "0%" }}
                transition={{
                  duration: 1.42,
                  delay: 0.18,
                  ease: constructionEase,
                }}
                className="absolute -top-[7%] left-0 !h-[114%] w-full object-cover object-[62%_50%] will-change-transform"
              />
            </motion.div>
          </div>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.18,
              delay: 0.28,
              ease: constructionEase,
            }}
            className="mt-[clamp(1.5rem,3vw,3rem)] block h-px origin-left bg-black/20 will-change-transform"
          />
        </div>
      </div>
    </motion.div>
  );
}
