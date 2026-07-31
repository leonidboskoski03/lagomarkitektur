export const LOADER_REVEAL_EVENT = "lagom:loader-reveal";
export const HERO_CONTENT_REVEAL_EVENT = "lagom:hero-content-reveal";
export const NAVBAR_REVEAL_EVENT = "lagom:navbar-reveal";
export const PROJECT_CONTENT_REVEAL_EVENT = "lagom:project-content-reveal";
export const WORK_CONTENT_REVEAL_EVENT = "lagom:work-content-reveal";
export const WORK_VIEW_MODE_CHANGE_EVENT = "lagom:work-view-mode-change";
export const CONTACT_CONTENT_REVEAL_EVENT = "lagom:contact-content-reveal";

export interface LoaderRevealEventDetail {
    imageDuration: number;
}

export interface WorkViewModeChangeEventDetail {
    mode: "composition" | "index" | "field";
}
