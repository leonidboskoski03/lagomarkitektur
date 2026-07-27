import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

type FooterMotionKind =
  | "eyebrow"
  | "display"
  | "action"
  | "column-label"
  | "column-body"
  | "utility";

interface FooterMotionMaskProps {
  children: ReactNode;
  kind: FooterMotionKind;
  className?: string;
  motionClassName?: string;
}

export function FooterMotionMask({
  children,
  kind,
  className,
  motionClassName,
}: FooterMotionMaskProps) {
  return (
    <div data-footer-mask className={cn("overflow-hidden", className)}>
      <div
        data-footer-motion
        data-footer-motion-kind={kind}
        className={motionClassName}
      >
        {children}
      </div>
    </div>
  );
}
