import { useLayoutEffect } from "react";
import { StudioDisciplineRail } from "../components/studio/StudioDisciplineRail";
import { StudioFounder } from "../components/studio/StudioFounder";
import { StudioHero } from "../components/studio/StudioHero";
import { StudioOverview } from "../components/studio/StudioOverview";
import { StudioPageLoader } from "../components/studio/StudioPageLoader";
import { StudioPrinciples } from "../components/studio/StudioPrinciples";

export function About() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white text-brand-ink">
      <StudioPageLoader />
      <StudioHero />
      <StudioOverview />
      <StudioFounder />
      <StudioDisciplineRail />
      <StudioPrinciples />
    </div>
  );
}
