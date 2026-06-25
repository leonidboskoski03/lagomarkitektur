import { useGsapReveal } from "../../hooks/useGsapReveal";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  const ref = useGsapReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="mb-16 md:mb-24">
      <span className="text-xs tracking-widest uppercase text-text-muted mb-4 block">
        {label}
      </span>
      <h2 className="font-display text-4xl md:text-6xl text-text-primary leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-text-muted max-w-xl text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
