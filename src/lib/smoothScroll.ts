export const SMOOTH_SCROLL_EVENT = "lagom:smooth-scroll";

export interface SmoothScrollRequest {
  target: string | HTMLElement;
  offset?: number;
  immediate?: boolean;
}

export function requestSmoothScroll(detail: SmoothScrollRequest) {
  window.dispatchEvent(
    new CustomEvent<SmoothScrollRequest>(SMOOTH_SCROLL_EVENT, { detail }),
  );
}
