import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { FooterLinkItem } from "../../../data/footer";
import { ClipMaskTextAnimation } from "../../animation/ClipMaskTextAnimation";
import { cn } from "../../../lib/utils";
import { WorkTransitionLink } from "../../transition/WorkTransitionLink";

interface FooterLinkProps {
  item: FooterLinkItem;
  className?: string;
  showArrow?: boolean;
  variant?: "default" | "menu-utility";
}

export function FooterLink({
  item,
  className,
  showArrow = false,
  variant = "default",
}: FooterLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isMenuUtility = variant === "menu-utility";
  const flipText = showArrow
    ? `${item.label} ${item.external ? "↗" : "→"}`
    : item.label;
  const linkClassName = cn(
    "inline-block w-fit outline-none",
    isMenuUtility && "group relative -mx-2 overflow-hidden bg-white px-2 py-1",
    "focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-white",
    className,
  );
  const interactionProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
  const content = (
    <>
      {isMenuUtility && (
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[110%] bg-black transition-transform duration-600 ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        />
      )}
      <span
        className={cn(
          "relative z-10 block",
          isMenuUtility && "text-white mix-blend-difference",
        )}
      >
        <ClipMaskTextAnimation
          text={flipText}
          controlled
          active={isHovered || isFocused}
          uppercase={false}
          className="leading-[1.25]"
        />
      </span>
    </>
  );

  if (item.external || item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
    return (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
        data-cursor=""
        className={linkClassName}
        {...interactionProps}
      >
        {content}
      </a>
    );
  }

  if (item.href === "/work") {
    return (
      <WorkTransitionLink
        data-cursor=""
        className={linkClassName}
        {...interactionProps}
      >
        {content}
      </WorkTransitionLink>
    );
  }

  return (
    <NavLink
      to={item.href}
      data-cursor=""
      onClick={() => window.scrollTo({ top: 0, left: 0 })}
      className={linkClassName}
      {...interactionProps}
    >
      {content}
    </NavLink>
  );
}
