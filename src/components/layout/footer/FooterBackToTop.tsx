import { useState } from "react";
import { ClipMaskTextAnimation } from "../../animation/ClipMaskTextAnimation";

export function FooterBackToTop() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <button
      type="button"
      data-cursor=""
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }}
      className="w-fit uppercase outline-none focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-white"
      aria-label="Back to the top of the page"
    >
      <ClipMaskTextAnimation
        text="Back to top ↑"
        controlled
        active={isHovered || isFocused}
        uppercase={false}
        className="leading-[1.25]"
      />
    </button>
  );
}
