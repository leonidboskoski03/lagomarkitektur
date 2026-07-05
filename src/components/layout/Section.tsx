import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { PageContainer } from "./PageContainer";

type SectionSpacing = "small" | "default" | "large";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  containerClassName?: string;
  spacing?: SectionSpacing;
}

const spacingClasses: Record<SectionSpacing, string> = {
  small: "section-space-sm",
  default: "section-space",
  large: "section-space-lg",
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    children,
    className,
    containerClassName,
    spacing = "default",
    ...props
  },
  ref,
) {
  return (
    <section ref={ref} className={cn(spacingClasses[spacing], className)} {...props}>
      <PageContainer className={containerClassName}>{children}</PageContainer>
    </section>
  );
});
