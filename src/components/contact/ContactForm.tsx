import { useState, type FormEvent } from "react";
import type { ContactFormField, ContactPageContent } from "../../data/contact";
import { cn } from "../../lib/utils";

interface ContactFormProps {
  content: ContactPageContent["form"];
  recipient: string;
}

export function ContactForm({ content, recipient }: ContactFormProps) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = `${content.mailSubject} — ${name}`;
    const body = [
      `${content.bodyLabels.name}: ${name}`,
      `${content.bodyLabels.email}: ${email}`,
      `${content.bodyLabels.location}: ${location || content.bodyLabels.notSpecified}`,
      "",
      message,
    ].join("\n");
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus(content.openingStatus);
    window.location.assign(mailto);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={content.formLabel}
      className="grid gap-[clamp(2.25rem,3.5vw,3.5rem)]"
    >
      <div className="overflow-hidden">
        <div
          data-contact-form-row
          className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-brand-ink/46 will-change-transform"
        >
          <span>{content.detailsLabel}</span>
          <span>{content.requiredLabel}</span>
        </div>
      </div>

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {content.fields.map((field) => (
          <ContactField key={field.id} field={field} />
        ))}
      </div>

      <div className="overflow-hidden">
        <div
          data-contact-form-row
          className="flex flex-col items-start justify-between gap-5 pt-1 will-change-transform sm:flex-row sm:items-center"
        >
          <p className="max-w-xs text-xs leading-relaxed text-brand-ink/50">
            {content.submitNote}
          </p>
          <button
            type="submit"
            data-cursor=""
            className="group inline-flex items-center gap-4 rounded-full bg-brand-ink py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.06em] text-white"
          >
            <span>{content.submitLabel}</span>
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-white text-base text-brand-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:rotate-45"
            >
              ↗
            </span>
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

function ContactField({ field }: { field: ContactFormField }) {
  const fieldClassName = cn(
    "overflow-hidden",
    field.wide && "sm:col-span-2",
  );
  const controlClassName =
    "w-full rounded-none border border-brand-ink/12 bg-brand-ink/[0.025] px-4 py-4 text-base text-brand-ink outline-none transition-[background-color,border-color] duration-500 placeholder:text-brand-ink/32 hover:border-brand-ink/18 hover:bg-brand-ink/[0.035] focus:border-brand-ink/32 focus:bg-white";

  return (
    <div className={fieldClassName}>
      <div
        data-contact-form-row
        className="group grid gap-2 will-change-transform"
      >
        <label
          htmlFor={`contact-${field.id}`}
          className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand-ink/58"
        >
          {field.label}
          {field.required ? <span aria-hidden="true"> *</span> : null}
        </label>

        {field.multiline ? (
          <textarea
            id={`contact-${field.id}`}
            name={field.id}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            rows={4}
            className={`${controlClassName} resize-none leading-relaxed`}
          />
        ) : (
          <input
            id={`contact-${field.id}`}
            name={field.id}
            type={field.type}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            className={controlClassName}
          />
        )}
      </div>
    </div>
  );
}
