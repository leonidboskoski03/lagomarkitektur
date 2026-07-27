import { cn } from "../../lib/utils";

interface StudioProjectCaptionProps {
  projectTitle: string;
  className?: string;
}

export function StudioProjectCaption({
  projectTitle,
  className,
}: StudioProjectCaptionProps) {
  return (
    <figcaption
      className={cn(
        "flex items-start justify-between gap-5 pt-3 text-[0.7rem] uppercase leading-none tracking-[0.1em] text-brand-ink md:text-xs",
        className,
      )}
    >
      <span className="max-w-[72%] leading-[1.2] transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
        {projectTitle}
      </span>

      <span
        aria-hidden="true"
        className="relative h-[1.55em] min-w-[6rem] overflow-hidden text-right leading-[1.2]"
      >
        <span className="block transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2">
          <span className="block h-[1.55em] text-black/48">↗</span>
          <span className="block h-[1.55em] whitespace-nowrap">
            <span className="relative inline-block h-[1.55em]">
              View project
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform delay-100 duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </span>
          </span>
        </span>
      </span>
    </figcaption>
  );
}
