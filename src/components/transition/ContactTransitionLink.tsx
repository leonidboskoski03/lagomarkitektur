import {
  forwardRef,
  type MouseEvent,
} from "react";
import { Link, type LinkProps } from "react-router";
import { useContactTransition } from "./contactTransitionContext";

interface ContactTransitionLinkProps extends Omit<LinkProps, "to"> {
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

export const ContactTransitionLink = forwardRef<
  HTMLAnchorElement,
  ContactTransitionLinkProps
>(function ContactTransitionLink(
  {
    to = "/contact",
    onClick,
    ...props
  },
  ref,
) {
  const { startContactTransition } = useContactTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || shouldUseNativeNavigation(event)) return;

    event.preventDefault();
    startContactTransition();
  };

  return (
    <Link
      {...props}
      ref={ref}
      to={to}
      data-contact-transition-link=""
      onClick={handleClick}
    />
  );
});
