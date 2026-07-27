interface StudioSectionLabelProps {
  children: string;
}

export function StudioSectionLabel({ children }: StudioSectionLabelProps) {
  return (
    <p className="w-max border-b border-current pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-black/55">
      {children}
    </p>
  );
}
