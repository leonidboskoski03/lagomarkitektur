import { useLayoutEffect } from "react";
import { StudioFounder } from "../components/studio/StudioFounder";
import { StudioHero } from "../components/studio/StudioHero";
import { StudioOverview } from "../components/studio/StudioOverview";
import { StudioPrinciples } from "../components/studio/StudioPrinciples";

export function About() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="bg-white text-brand-ink">
      <StudioHero />
      <StudioOverview />
      <StudioFounder />
      <StudioPrinciples />
    </div>
  );
}
