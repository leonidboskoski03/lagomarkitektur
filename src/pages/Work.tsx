import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { projectCategories, projects } from "../data/projects";
import { motionEaseCurves, motionEases } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

type WorkView = "grid" | "list" | "gallery";

const viewLabels: Record<WorkView, string> = {
  grid: "Grid",
  list: "List",
  gallery: "Gallery",
};

const categoryFilters = ["All", ...projectCategories];

export function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeView, setActiveView] = useState<WorkView>("grid");
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? "");
  const pageRef = useRef<HTMLDivElement | null>(null);

  const filteredProjects = useMemo(() => {
    const list = projects
      .slice()
      .sort((a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10));

    if (activeCategory === "All") return list;
    return list.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const activeProject =
    filteredProjects.find((project) => project.id === activeProjectId) ??
    filteredProjects[0] ??
    projects[0];

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop } = context.conditions as { desktop: boolean; reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set("[data-work-reveal], [data-work-card]", { autoAlpha: 1, y: 0, scale: 1 });
          return;
        }

        gsap.from("[data-work-hero-line]", {
          yPercent: 112,
          rotation: 1.5,
          duration: 0.9,
          stagger: 0.06,
          ease: motionEases.enter,
        });

        gsap.from("[data-work-reveal]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.82,
          stagger: 0.08,
          ease: motionEases.enter,
          delay: 0.12,
        });

        ScrollTrigger.batch("[data-work-card]", {
          start: "top 82%",
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: desktop ? 42 : 20, autoAlpha: 0, scale: 0.985 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.86,
                stagger: 0.06,
                ease: motionEases.enter,
                overwrite: true,
              },
            );
          },
        });

        gsap.to("[data-work-feature-image]", {
          scale: 1.045,
          autoAlpha: 0.72,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-work-feature]",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      },
    );

    return () => mm.revert();
  }, { scope: pageRef, dependencies: [activeView, activeCategory] });

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-bg text-text-primary">
      <section className="viewport-container flex min-h-[92vh] flex-col justify-between pb-8 pt-32 md:pt-40">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] md:items-start">
          <div className="max-w-[min(92vw,76rem)]">
            <p data-work-reveal className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Lagom Arkitektur / Work
            </p>
            <h1 className="overflow-hidden text-[clamp(4.25rem,13vw,12.5rem)] font-medium leading-[0.82] tracking-[-0.065em] text-text-primary">
              <span data-work-hero-line className="block will-change-transform">Selected</span>
              <span data-work-hero-line className="block will-change-transform">spatial work</span>
            </h1>
          </div>
          <div data-work-reveal className="max-w-md justify-self-end pt-2 text-sm leading-relaxed text-text-muted md:pt-10">
            <p>
              Interiors, residences, hospitality spaces, and quiet architectural concepts shaped through light,
              proportion, material restraint, and carefully staged atmosphere.
            </p>
          </div>
        </div>

        <div data-work-reveal className="mt-20 grid gap-5 border-t border-border pt-5 text-xs uppercase tracking-[0.14em] text-text-muted md:grid-cols-3">
          <p>11 projects</p>
          <p>Residential / Hospitality</p>
          <p className="md:text-right">2022-2026</p>
        </div>
      </section>

      <section data-work-feature className="viewport-container pb-24 md:pb-36">
        <div className="grid min-h-[72vh] gap-4 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
          <div className="order-2 flex flex-col justify-end border-t border-border py-5 md:order-1 md:border-y">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: motionEaseCurves.settle }}
                className="max-w-xl"
              >
                <p className="mb-6 text-xs uppercase tracking-[0.18em] text-text-muted">
                  {activeProject.id} / {activeProject.category}
                </p>
                <h2 className="text-[clamp(2.4rem,6vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                  {activeProject.title}
                </h2>
                <p className="mt-7 max-w-md text-sm leading-relaxed text-text-muted md:text-base">
                  {activeProject.excerpt}
                </p>
                <Link
                  to={`/work/${activeProject.slug}`}
                  data-cursor=""
                  className="mt-9 inline-flex border-b border-text-primary pb-1 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-text-muted hover:text-text-muted"
                >
                  View project
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          <Link
            to={`/work/${activeProject.slug}`}
            data-cursor="open"
            className="group order-1 block overflow-hidden bg-surface md:order-2"
            aria-label={`View ${activeProject.title}`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeProject.featuredImage}
                data-work-feature-image
                src={activeProject.featuredImage}
                alt={activeProject.title}
                loading="eager"
                className="h-full min-h-[58vh] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.7, ease: motionEaseCurves.settle }}
              />
            </AnimatePresence>
          </Link>
        </div>
      </section>

      <section className="viewport-container pb-32 md:pb-44">
        <div className="sticky top-0 z-20 -mx-[var(--spacing-viewport-gutter)] mb-10 border-y border-border bg-bg/88 px-[var(--spacing-viewport-gutter)] py-3 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Project category filters">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  type="button"
                  data-cursor=""
                  onClick={() => setActiveCategory(category)}
                  className={clsx(
                    "border px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] transition-colors",
                    activeCategory === category
                      ? "border-text-primary bg-text-primary text-bg"
                      : "border-border text-text-muted hover:border-text-muted hover:text-text-primary",
                  )}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex w-fit border border-border bg-surface/45 p-1" aria-label="Work view">
              {(Object.keys(viewLabels) as WorkView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  data-cursor=""
                  onClick={() => setActiveView(view)}
                  className={clsx(
                    "min-w-20 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] transition-colors",
                    activeView === view ? "bg-text-primary text-bg" : "text-text-muted hover:text-text-primary",
                  )}
                  aria-pressed={activeView === view}
                >
                  {viewLabels[view]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeView}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: motionEaseCurves.settle }}
          >
            {activeView === "grid" && (
              <div className="grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-12">
                {filteredProjects.map((project, index) => (
                  <WorkGridCard
                    key={project.id}
                    project={project}
                    index={index}
                    onPreview={() => setActiveProjectId(project.id)}
                  />
                ))}
              </div>
            )}

            {activeView === "list" && (
              <div className="border-t border-border">
                {filteredProjects.map((project) => (
                  <WorkListRow
                    key={project.id}
                    project={project}
                    active={project.id === activeProject.id}
                    onPreview={() => setActiveProjectId(project.id)}
                  />
                ))}
              </div>
            )}

            {activeView === "gallery" && (
              <div className="grid gap-4 md:grid-cols-12">
                {filteredProjects.map((project, index) => (
                  <WorkGalleryTile
                    key={project.id}
                    project={project}
                    index={index}
                    onPreview={() => setActiveProjectId(project.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="bg-text-primary py-24 text-bg md:py-36">
        <div className="viewport-container grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <h2 className="max-w-4xl text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.06em]">
            Shape the next quiet space.
          </h2>
          <Link
            to="/contact"
            data-cursor=""
            className="inline-flex border-b border-bg pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-bg/90 hover:text-bg"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </div>
  );
}

function WorkGridCard({
  project,
  index,
  onPreview,
}: {
  project: (typeof projects)[number];
  index: number;
  onPreview: () => void;
}) {
  const spanClass = index % 5 === 0 || index % 5 === 1 ? "md:col-span-6" : "md:col-span-4";

  return (
    <Link
      to={`/work/${project.slug}`}
      data-work-card
      data-cursor="open"
      onMouseEnter={onPreview}
      onFocus={onPreview}
      className={clsx("group block opacity-0", spanClass)}
    >
      <div className="overflow-hidden bg-surface">
        <img
          src={project.featuredImage}
          alt={project.title}
          loading={index < 2 ? "eager" : "lazy"}
          className="aspect-[1.18/1] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] md:aspect-[1.42/1]"
        />
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 border-b border-border py-4 text-xs uppercase tracking-[0.12em] text-text-muted">
        <span>{project.id}</span>
        <span className="truncate text-text-primary">{project.title}</span>
        <span>{project.credits.replace("Site size: ", "")}</span>
      </div>
    </Link>
  );
}

function WorkListRow({
  project,
  active,
  onPreview,
}: {
  project: (typeof projects)[number];
  active: boolean;
  onPreview: () => void;
}) {
  return (
    <Link
      to={`/work/${project.slug}`}
      data-work-card
      data-cursor="open"
      onMouseEnter={onPreview}
      onFocus={onPreview}
      className="group grid gap-5 border-b border-border py-5 opacity-0 md:grid-cols-[5rem_minmax(0,1fr)_11rem_10rem]"
    >
      <span className="text-xs uppercase tracking-[0.16em] text-text-muted">{project.id}</span>
      <span className={clsx("text-[clamp(2rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.055em] transition-colors", active ? "text-text-primary" : "text-text-muted group-hover:text-text-primary")}>
        {project.title}
      </span>
      <span className="self-end text-xs uppercase tracking-[0.14em] text-text-muted">{project.location}</span>
      <span className="self-end text-xs uppercase tracking-[0.14em] text-text-muted md:text-right">{project.credits.replace("Site size: ", "")}</span>
    </Link>
  );
}

function WorkGalleryTile({
  project,
  index,
  onPreview,
}: {
  project: (typeof projects)[number];
  index: number;
  onPreview: () => void;
}) {
  return (
    <Link
      to={`/work/${project.slug}`}
      data-work-card
      data-cursor="open"
      onMouseEnter={onPreview}
      onFocus={onPreview}
      className={clsx(
        "group block overflow-hidden bg-surface opacity-0",
        index % 4 === 0 ? "md:col-span-8" : "md:col-span-4",
      )}
    >
      <img
        src={project.gallery[0] ?? project.featuredImage}
        alt={project.title}
        loading={index < 2 ? "eager" : "lazy"}
        className="h-full min-h-[42vh] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
      />
      <div className="flex justify-between gap-4 bg-bg px-0 py-4 text-xs uppercase tracking-[0.12em] text-text-muted">
        <span className="text-text-primary">{project.title}</span>
        <span>{project.year}</span>
      </div>
    </Link>
  );
}
