import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { FooterMotionMask } from "./FooterMotionMask";

interface FooterColumnProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FooterColumn({ label, children, className }: FooterColumnProps) {
  return (
    <div data-footer-column className={cn("min-w-0", className)}>
      <FooterMotionMask kind="column-label" className="mb-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] opacity-45">
          {label}
        </p>
      </FooterMotionMask>
      <FooterMotionMask kind="column-body">
        <div>{children}</div>
      </FooterMotionMask>
    </div>
  );
}
