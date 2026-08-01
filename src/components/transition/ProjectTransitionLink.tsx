import {
  forwardRef,
  type MouseEvent,
} from "react";
import { Link, type LinkProps } from "react-router";
import { useProjectTransition } from "./projectTransitionContext";

interface ProjectTransitionLinkProps extends Omit<LinkProps, "to"> {
  projectSlug: string;
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

export const ProjectTransitionLink = forwardRef<
  HTMLAnchorElement,
  ProjectTransitionLinkProps
>(function ProjectTransitionLink(
  {
    projectSlug,
    to = `/work/${projectSlug}`,
    onClick,
    ...props
  },
  ref,
) {
  const { startProjectTransition } = useProjectTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || shouldUseNativeNavigation(event)) return;

    event.preventDefault();
    startProjectTransition({
      slug: projectSlug,
      shouldFocusTitle: event.detail === 0,
    });
  };

  return (
    <Link
      {...props}
      ref={ref}
      to={to}
      data-project-transition-link=""
      onClick={handleClick}
    />
  );
});
