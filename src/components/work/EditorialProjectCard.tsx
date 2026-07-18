import { useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { motionEases } from "../../lib/motion";

interface EditorialProjectCardProps {
  project: WorkProjectItem;
  index: number;
  isActive: boolean;
  onActivate: (slug: string) => void;
  onDeactivate: () => void;
}

export function EditorialProjectCard({
  project,
  index,
  isActive,
  onActivate,
  onDeactivate,
}: EditorialProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const metadataTrackRef = useRef<HTMLDivElement | null>(null);
  const viewLineRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(() => {
    if (!imageRef.current || !metadataTrackRef.current || !viewLineRef.current) return;

    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

    timeline.to(metadataTrackRef.current, {
      yPercent: isActive ? -50 : 0,
      duration: 0.68,
      ease: motionEases.settle,
    }, 0);
    timeline.to(imageRef.current, {
      scale: isActive ? 1.022 : 1,
      duration: isActive ? 0.78 : 0.62,
      ease: motionEases.settle,
      transformOrigin: "center center",
    }, 0);
    timeline.to(viewLineRef.current, {
      scaleX: isActive ? 1 : 0,
      duration: isActive ? 0.86 : 0.46,
      ease: isActive ? motionEases.reveal : motionEases.depart,
      transformOrigin: "left center",
    }, isActive ? 0.16 : 0);
  }, { scope: cardRef, dependencies: [isActive] });

  return (
    <article
      ref={cardRef}
      data-editorial-project
      data-project-slug={project.slug}
      onPointerEnter={() => onActivate(project.slug)}
      onPointerLeave={onDeactivate}
      onFocusCapture={() => onActivate(project.slug)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onDeactivate();
      }}
      className="w-full will-change-[clip-path,transform] md:w-[min(100%,46vw,52rem,calc(64vh*var(--editorial-aspect)))]"
      style={{ "--editorial-aspect": project.image.aspectRatio } as CSSProperties}
    >
      <Link
        to={`/work/${project.slug}`}
        data-cursor="open"
        className="group block"
        aria-label={`View ${project.title}`}
      >
        <div
          data-project-image
          data-mode-project={project.id}
          data-mode-project-image
          data-transition-image={`${project.id}:cover`}
          className="relative overflow-hidden bg-black"
          style={{ aspectRatio: project.image.aspectRatio }}
        >
          <img
            ref={imageRef}
            src={project.image.url}
            srcSet={project.image.srcSet}
            sizes={project.image.sizes}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            className="!h-full w-full object-cover will-change-transform"
          />
          <span
            data-project-reveal
            className="pointer-events-none absolute inset-0 bg-black will-change-opacity"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-start justify-between gap-5 pt-3 text-[0.7rem] uppercase leading-none tracking-[0.1em] text-text-primary md:text-xs">
          <span className="max-w-[72%] leading-[1.2]">{project.title}</span>
          <span className="relative h-[1.55em] min-w-[6rem] overflow-hidden text-right leading-[1.2]">
            <span ref={metadataTrackRef} className="block will-change-transform">
              <span className="block h-[1.55em] whitespace-nowrap text-text-muted">
                {project.siteSize || project.year}
              </span>
              <span className="block h-[1.55em] whitespace-nowrap">
                <span className="relative inline-block h-[1.55em]">
                  View project
                  <span
                    ref={viewLineRef}
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current will-change-transform"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
