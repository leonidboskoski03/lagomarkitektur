import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(function PageContainer(
  { children, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("layout-container", className)} {...props}>
      {children}
    </div>
  );
});
