import {
  forwardRef,
  type MouseEvent,
} from "react";
import { Link, type LinkProps } from "react-router";
import { useWorkTransition } from "./workTransitionContext";

interface WorkTransitionLinkProps extends Omit<LinkProps, "to"> {
  to?: LinkProps["to"];
}

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
    || event.currentTarget.target === "_blank"
    || event.currentTarget.hasAttribute("download");
}

export const WorkTransitionLink = forwardRef<
  HTMLAnchorElement,
  WorkTransitionLinkProps
>(function WorkTransitionLink(
  {
    to = "/work",
    onClick,
    ...props
  },
  ref,
) {
  const { startWorkTransition } = useWorkTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || shouldUseNativeNavigation(event)) return;

    event.preventDefault();
    startWorkTransition();
  };

  return (
    <Link
      {...props}
      ref={ref}
      to={to}
      data-work-transition-link=""
      onClick={handleClick}
    />
  );
});
