import {useEffect, useLayoutEffect} from "react";

const RESIZE_RELOAD_DEBOUNCE_MS = 320;
const VIEWPORT_CHANGE_TOLERANCE = 24;

export function useReloadOnResize() {
    useEffect(() => {
        const initialWidth = window.innerWidth;
        let reloadTimer = 0;

        const handleResize = () => {
            const loader = document.querySelector<HTMLElement>("[data-lagom-loader]");
            const loaderIsActive = loader && window.getComputedStyle(loader).display !== "none";

            // Keep the loader live while it is being previewed or revealed.
            if (loaderIsActive) return;

            const widthChanged = Math.abs(window.innerWidth - initialWidth)
                > VIEWPORT_CHANGE_TOLERANCE;

            // Height-only changes are commonly caused by mobile browser controls.
            if (!widthChanged) return;

            window.clearTimeout(reloadTimer);
            reloadTimer = window.setTimeout(() => {
                window.location.reload();
            }, RESIZE_RELOAD_DEBOUNCE_MS);
        };

        window.addEventListener("resize", handleResize, {passive: true});

        return () => {
            window.removeEventListener("resize", handleResize);
            window.clearTimeout(reloadTimer);
        };
    }, []);
}

export function useScrollToTopOnLoad() {
    useLayoutEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const resetScroll = () => window.scrollTo({top: 0, left: 0, behavior: "auto"});
        const resetAfterBrowserRestore = () => {
            resetScroll();

            // Browsers can restore the previous position after React has mounted.
            window.requestAnimationFrame(() => {
                resetScroll();
                window.requestAnimationFrame(resetScroll);
            });
        };

        resetAfterBrowserRestore();
        window.addEventListener("beforeunload", resetScroll);
        window.addEventListener("pagehide", resetScroll);
        window.addEventListener("pageshow", resetAfterBrowserRestore);

        return () => {
            window.removeEventListener("beforeunload", resetScroll);
            window.removeEventListener("pagehide", resetScroll);
            window.removeEventListener("pageshow", resetAfterBrowserRestore);
        };
    }, []);
}
