import {privacyContent} from "../data/privacy";
import {useLocalizedContent} from "../i18n/LanguageContext";

export function Privacy() {
  const content = useLocalizedContent(privacyContent);

  return (
    <article className="min-h-screen bg-bg px-[var(--spacing-viewport-gutter)] pb-28 pt-36 text-brand-ink md:pb-40 md:pt-48">
      <header className="mx-auto max-w-[84rem] border-t border-brand-ink/35 pt-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-ink/55">
          {content.eyebrow}
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-end md:gap-16">
          <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-medium leading-[0.84] tracking-[-0.065em]">
            {content.title}
          </h1>
          <div className="max-w-xl md:pb-2">
            <p className="text-base leading-relaxed text-brand-ink/72 md:text-lg">
              {content.introduction}
            </p>
            <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
              {content.updated}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-24 max-w-[84rem] md:mt-36">
        {content.sections.map((section, index) => (
          <section
            key={section.title}
            className="grid gap-7 border-t border-brand-ink/18 py-10 md:grid-cols-[minmax(12rem,0.45fr)_minmax(0,1fr)] md:gap-16 md:py-14"
            aria-labelledby={`privacy-section-${index}`}
          >
            <h2
              id={`privacy-section-${index}`}
              className="text-xs font-semibold uppercase tracking-[0.08em]"
            >
              {String(index + 1).padStart(2, "0")} / {section.title}
            </h2>
            <div className="grid max-w-3xl gap-5 text-base leading-[1.65] text-brand-ink/72 md:text-lg">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}

        <section className="border-y border-brand-ink/35 py-10 md:py-14" aria-labelledby="privacy-contact">
          <p id="privacy-contact" className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-ink/50">
            {content.contactLabel}
          </p>
          <a
            href={`mailto:${content.contactEmail}`}
            className="mt-5 inline-block text-[clamp(1.5rem,3.5vw,3.75rem)] tracking-[-0.045em] underline decoration-brand-ink/20 underline-offset-[0.18em] transition-opacity hover:opacity-55"
          >
            {content.contactEmail}
          </a>
        </section>
      </div>
    </article>
  );
}
