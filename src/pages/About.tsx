import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StudioDisciplineRail } from "../components/studio/StudioDisciplineRail";
import { StudioFounder } from "../components/studio/StudioFounder";
import { StudioHero } from "../components/studio/StudioHero";
import { StudioOverview } from "../components/studio/StudioOverview";
import { StudioPageLoader } from "../components/studio/StudioPageLoader";
import { StudioPrinciples } from "../components/studio/StudioPrinciples";

export function About() {
  const [isIntroReady, setIsIntroReady] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsIntroReady(true);
  }, []);

  useEffect(() => {
    if (!isIntroReady) return;

    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(refreshFrame);
  }, [isIntroReady]);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white text-brand-ink">
      <StudioPageLoader onComplete={handleLoaderComplete} />
      <StudioHero isReady={isIntroReady} />
      <StudioOverview />
      <StudioFounder />
      <StudioDisciplineRail />
      <StudioPrinciples />
    </div>
  );
}
