import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {cn} from "../../lib/utils";

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  active: boolean;
  isDark: boolean;
  unavailableLabel: string;
  onToken: (token: string) => void;
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const DEVELOPMENT_SITE_KEY = "1x00000000000000000000AA";
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  const pending = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    const handleLoad = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile API unavailable"));
    };
    const handleError = () => reject(new Error("Turnstile script failed to load"));

    script.addEventListener("load", handleLoad, {once: true});
    script.addEventListener("error", handleError, {once: true});

    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.append(script);
    }
  });
  const loadPromise = pending.catch((error) => {
    scriptPromise = null;
    throw error;
  });
  scriptPromise = loadPromise;

  return loadPromise;
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  TurnstileWidgetProps
>(function TurnstileWidget({active, isDark, unavailableLabel, onToken}, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const configuredSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const siteKey = configuredSiteKey || (import.meta.env.DEV ? DEVELOPMENT_SITE_KEY : "");

  useImperativeHandle(ref, () => ({
    reset: () => {
      onToken("");
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
    },
  }), [onToken]);

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    if (!siteKey) {
      setIsUnavailable(true);
      onToken("");
      return;
    }

    let disposed = false;
    let observer: IntersectionObserver | null = null;

    const renderWidget = async () => {
      try {
        const turnstile = await loadTurnstile();
        if (disposed || !containerRef.current || widgetIdRef.current) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "project_enquiry",
          appearance: "interaction-only",
          size: "flexible",
          theme: isDark ? "dark" : "light",
          callback: (token: string) => {
            setIsUnavailable(false);
            onToken(token);
          },
          "expired-callback": () => onToken(""),
          "timeout-callback": () => onToken(""),
          "error-callback": () => {
            setIsUnavailable(true);
            onToken("");
          },
        });
      } catch {
        if (!disposed) {
          setIsUnavailable(true);
          onToken("");
        }
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer?.disconnect();
      void renderWidget();
    }, {rootMargin: "320px 0px"});
    observer.observe(container);

    return () => {
      disposed = true;
      observer?.disconnect();
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [active, isDark, onToken, siteKey]);

  return (
    <div className="grid gap-2">
      <div
        ref={containerRef}
        className={cn(
          "min-h-[4.1rem] w-full overflow-hidden rounded-sm",
          isDark ? "bg-white/[0.035]" : "bg-brand-ink/[0.025]",
        )}
      />
      {isUnavailable ? (
        <p className={cn(
          "text-xs leading-relaxed",
          isDark ? "text-white/62" : "text-brand-ink/62",
        )}>
          {unavailableLabel}
        </p>
      ) : null}
    </div>
  );
});
