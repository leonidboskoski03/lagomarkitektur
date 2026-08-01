import {useCallback, useId, useRef, useState, type FormEvent} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import type {ContactFormField} from "../../data/contact";
import {
  projectEnquiryContent,
  type ChoiceQuestion,
  type ProjectEnquiryContent,
} from "../../data/projectEnquiry";
import {useLanguage, useLocalizedContent} from "../../i18n/LanguageContext";
import {motionEases} from "../../lib/motion";
import {
  submitEnquiry,
  type EnquiryMode,
} from "../../lib/submitEnquiry";
import {cn} from "../../lib/utils";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "./TurnstileWidget";

type EnquiryVariant = "light" | "dark";
type SubmissionState = "idle" | "submitting" | "success" | "error";

interface QuickEnquiryContent {
  formLabel: string;
  detailsLabel: string;
  requiredLabel: string;
  fields: readonly ContactFormField[];
  submitLabel: string;
  submitNote: string;
  mailSubject: string;
  openingStatus: string;
}

interface ProjectEnquiryFormProps {
  quickContent: QuickEnquiryContent;
  recipient: string;
  variant?: EnquiryVariant;
  isActive?: boolean;
}

interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  size: string;
  sizeUnknown: boolean;
  timeframe: string;
  source: string;
  additional: string;
  projectTypes: string[];
  priorities: string[];
}

const STRUCTURED_LAST_STEP = 8;

const initialValues: EnquiryValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  message: "",
  size: "",
  sizeUnknown: false,
  timeframe: "",
  source: "",
  additional: "",
  projectTypes: [],
  priorities: [],
};

export function ProjectEnquiryForm({
  quickContent,
  recipient,
  variant = "light",
  isActive = true,
}: ProjectEnquiryFormProps) {
  const structuredContent = useLocalizedContent(projectEnquiryContent);
  const {language} = useLanguage();
  const rootRef = useRef<HTMLFormElement | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle | null>(null);
  const directionRef = useRef(1);
  const animateChangeRef = useRef<(commit: () => void, direction: number) => void>(
    (commit) => commit(),
  );
  const id = useId().replaceAll(":", "");
  const [mode, setMode] = useState<EnquiryMode>("quick");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [values, setValues] = useState<EnquiryValues>(initialValues);
  const isDark = variant === "dark";
  const isSubmitting = submissionState === "submitting";
  const delivery = structuredContent.delivery;
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useGSAP((_context, contextSafe) => {
    animateChangeRef.current = contextSafe!((commit: () => void, direction: number) => {
      const panel = rootRef.current?.querySelector<HTMLElement>("[data-enquiry-panel]");
      directionRef.current = direction;

      if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit();
        return;
      }

      gsap.killTweensOf(panel);
      gsap.timeline({defaults: {overwrite: "auto"}})
        .to(panel, {
          autoAlpha: 0,
          y: direction > 0 ? -18 : 18,
          clipPath: direction > 0
            ? "inset(0% 0% 14% 0%)"
            : "inset(14% 0% 0% 0%)",
          duration: 0.34,
          ease: motionEases.depart,
        })
        .call(commit);
    });

    return () => {
      animateChangeRef.current = (commit) => commit();
    };
  }, {scope: rootRef});

  useGSAP(() => {
    const panel = rootRef.current?.querySelector<HTMLElement>("[data-enquiry-panel]");
    if (!panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panel, {clearProps: "all"});
      return;
    }

    gsap.fromTo(panel, {
      autoAlpha: 0,
      y: directionRef.current > 0 ? 22 : -22,
      clipPath: directionRef.current > 0
        ? "inset(12% 0% 0% 0%)"
        : "inset(0% 0% 12% 0%)",
    }, {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.78,
      ease: motionEases.cinematic,
      overwrite: "auto",
      clearProps: "transform,clipPath",
    });
  }, {scope: rootRef, dependencies: [mode, step], revertOnUpdate: true});

  const updateText = (key: keyof EnquiryValues, value: string) => {
    setValues((current) => ({...current, [key]: value}));
  };

  const toggleMultiple = (
    key: "projectTypes" | "priorities",
    optionId: string,
  ) => {
    setValues((current) => {
      const selected = current[key];
      return {
        ...current,
        [key]: selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      };
    });
  };

  const changeMode = (nextMode: EnquiryMode) => {
    if (nextMode === mode) return;
    animateChangeRef.current(
      () => setMode(nextMode),
      nextMode === "structured" ? 1 : -1,
    );
  };

  const changeStep = (nextStep: number) => {
    if (nextStep > step && !rootRef.current?.reportValidity()) return;
    const boundedStep = Math.max(0, Math.min(STRUCTURED_LAST_STEP, nextStep));
    if (boundedStep === step) return;
    animateChangeRef.current(
      () => setStep(boundedStep),
      boundedStep > step ? 1 : -1,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (mode === "structured" && (!values.name.trim() || !values.email.trim())) {
      changeStep(0);
      return;
    }
    if (mode === "structured" && values.projectTypes.length === 0) {
      changeStep(1);
      return;
    }
    if (mode === "structured" && !values.message.trim()) {
      changeStep(2);
      return;
    }
    if (mode === "structured" && !values.location.trim()) {
      changeStep(3);
      return;
    }

    if (!turnstileToken) {
      setSubmissionState("error");
      setStatus(delivery.verificationRequired);
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmissionState("submitting");
    setStatus(delivery.sending);

    try {
      await submitEnquiry({
        submissionId: crypto.randomUUID(),
        mode,
        language,
        ...values,
        turnstileToken,
        website: String(formData.get("website") ?? ""),
      });
      setSubmissionState("success");
      setStatus(delivery.success);
      setValues(initialValues);
      setStep(0);
      turnstileRef.current?.reset();
    } catch {
      setSubmissionState("error");
      setStatus(delivery.error);
      turnstileRef.current?.reset();
    }
  };

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      aria-label={mode === "quick"
        ? quickContent.formLabel
        : structuredContent.structured.formLabel}
      className="grid gap-[clamp(2rem,3.5vw,3.25rem)] [overflow-anchor:none]"
    >
      <ModeSelector
        id={id}
        mode={mode}
        content={structuredContent}
        isDark={isDark}
        onChange={changeMode}
      />

      {mode === "structured" ? (
        <div className="grid gap-6">
          <div
            aria-hidden="true"
            className={cn(
              "h-px overflow-hidden",
              isDark ? "bg-white/18" : "bg-brand-ink/14",
            )}
          >
            <span
              className={cn(
                "block h-full origin-left transition-transform duration-[900ms] ease-[cubic-bezier(.58,0,.22,1)]",
                isDark ? "bg-white" : "bg-brand-ink",
              )}
              style={{transform: `scaleX(${(step + 1) / (STRUCTURED_LAST_STEP + 1)})`}}
            />
          </div>

          <div data-enquiry-panel className="will-change-[transform,clip-path,opacity]">
            <StructuredStep
              id={id}
              step={step}
              values={values}
              content={structuredContent}
              isDark={isDark}
              updateText={updateText}
              toggleMultiple={toggleMultiple}
              setValues={setValues}
            />

            <StructuredNavigation
              step={step}
              content={structuredContent}
              isDark={isDark}
              isSubmitting={isSubmitting}
              sendingLabel={delivery.sending}
              onBack={() => changeStep(step - 1)}
              onNext={() => changeStep(step + 1)}
            />
          </div>
        </div>
      ) : (
        <div data-enquiry-panel className="will-change-[transform,clip-path,opacity]">
          <QuickEnquiry
            id={id}
            content={quickContent}
            values={values}
            isDark={isDark}
            isSubmitting={isSubmitting}
            sendingLabel={delivery.sending}
            updateText={updateText}
          />
        </div>
      )}

      <div className="grid gap-4">
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-auto size-px overflow-hidden opacity-0"
        />
        <TurnstileWidget
          ref={turnstileRef}
          active={isActive}
          isDark={isDark}
          unavailableLabel={delivery.verificationUnavailable}
          onToken={handleTurnstileToken}
        />
        <p className={cn(
          "text-xs leading-relaxed",
          isDark ? "text-white/46" : "text-brand-ink/48",
        )}>
          {delivery.privacyPrefix}{" "}
          <a
            href="/privacy"
            className="underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-60"
          >
            {delivery.privacyLabel}
          </a>.
        </p>
        {status ? (
          <div
            role={submissionState === "error" ? "alert" : "status"}
            aria-live="polite"
            className={cn(
              "border-l-2 px-4 py-3 text-sm leading-relaxed",
              submissionState === "success"
                ? isDark ? "border-emerald-300/70 bg-emerald-300/10 text-white" : "border-emerald-700/60 bg-emerald-800/[0.06] text-brand-ink"
                : submissionState === "error"
                  ? isDark ? "border-amber-200/70 bg-amber-200/10 text-white" : "border-amber-800/55 bg-amber-700/[0.06] text-brand-ink"
                  : isDark ? "border-white/30 bg-white/[0.05] text-white/72" : "border-brand-ink/20 bg-brand-ink/[0.035] text-brand-ink/70",
            )}
          >
            <span>{status}</span>
            {submissionState === "error" ? (
              <>{" "}<a className="font-semibold underline underline-offset-4" href={`mailto:${recipient}`}>{delivery.directFallback}</a>.</>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}

function ModeSelector({
  id,
  mode,
  content,
  isDark,
  onChange,
}: {
  id: string;
  mode: EnquiryMode;
  content: ProjectEnquiryContent;
  isDark: boolean;
  onChange: (mode: EnquiryMode) => void;
}) {
  return (
    <fieldset className="contact-row grid gap-3 will-change-transform" data-contact-form-row>
      <legend className={cn(
        "text-[0.6rem] font-semibold uppercase tracking-[0.09em]",
        isDark ? "text-white/52" : "text-brand-ink/48",
      )}>
        {content.mode.legend}
      </legend>
      <div className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg border",
        isDark ? "border-white/18 bg-white/18" : "border-brand-ink/14 bg-brand-ink/14",
      )}>
        {(["quick", "structured"] as const).map((option) => {
          const active = mode === option;
          const label = option === "quick"
            ? content.mode.quickLabel
            : content.mode.structuredLabel;
          const description = option === "quick"
            ? content.mode.quickDescription
            : content.mode.structuredDescription;

          return (
            <button
              key={option}
              id={`${id}-${option}-mode`}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={cn(
                "group flex min-h-[4.25rem] items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors duration-500 ease-[cubic-bezier(.58,0,.22,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] sm:min-h-16 sm:gap-4 sm:px-4 sm:py-3",
                active
                  ? isDark ? "bg-[#f4f1ea] text-black" : "bg-brand-ink text-white"
                  : isDark ? "bg-black text-white hover:bg-white/[0.07]" : "bg-white text-brand-ink hover:bg-brand-ink/[0.035]",
                isDark ? "focus-visible:outline-white" : "focus-visible:outline-brand-ink",
              )}
            >
              <span className="min-w-0">
                <span className="block text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.05em] sm:text-xs sm:tracking-[0.06em]">{label}</span>
                <span className={cn(
                  "mt-1 block text-[0.58rem] leading-[1.25] sm:text-[0.68rem] sm:leading-tight",
                  active
                    ? isDark ? "text-black/55" : "text-white/58"
                    : isDark ? "text-white/46" : "text-brand-ink/46",
                )}>
                  {description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 shrink-0 rounded-full border transition-[background-color,transform] duration-500",
                  active
                    ? isDark ? "border-black bg-black scale-100" : "border-white bg-white scale-100"
                    : isDark ? "border-white/45 scale-75" : "border-brand-ink/35 scale-75",
                )}
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function QuickEnquiry({
  id,
  content,
  values,
  isDark,
  isSubmitting,
  sendingLabel,
  updateText,
}: {
  id: string;
  content: QuickEnquiryContent;
  values: EnquiryValues;
  isDark: boolean;
  isSubmitting: boolean;
  sendingLabel: string;
  updateText: (key: keyof EnquiryValues, value: string) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className={cn(
        "contact-row flex items-center justify-between border-b pb-3 text-[0.6rem] font-semibold uppercase tracking-[0.08em] will-change-transform",
        isDark ? "border-white/22 text-white/58" : "border-brand-ink/14 text-brand-ink/46",
      )} data-contact-form-row>
        <span>{content.detailsLabel}</span>
        <span>{content.requiredLabel}</span>
      </div>

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {content.fields.map((field) => (
          <EnquiryField
            key={field.id}
            id={`${id}-quick-${field.id}`}
            field={field}
            value={String(values[field.id])}
            isDark={isDark}
            onChange={(value) => updateText(field.id, value)}
          />
        ))}
      </div>

      <div className="contact-row overflow-hidden will-change-transform" data-contact-form-row>
        <div className="flex flex-col items-start justify-between gap-5 pt-1 sm:flex-row sm:items-center">
          <p className={cn(
            "max-w-xs text-xs leading-relaxed",
            isDark ? "text-white/48" : "text-brand-ink/50",
          )}>
            {content.submitNote}
          </p>
          <SubmitButton
            label={isSubmitting ? sendingLabel : content.submitLabel}
            isDark={isDark}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

function EnquiryField({
  id,
  field,
  value,
  isDark,
  onChange,
}: {
  id: string;
  field: ContactFormField;
  value: string;
  isDark: boolean;
  onChange: (value: string) => void;
}) {
  const controlClassName = cn(
    "w-full rounded-none border px-4 py-4 text-base outline-none transition-[background-color,border-color] duration-500",
    isDark
      ? "border-white/12 bg-white/[0.07] text-white placeholder:text-white/32 hover:border-white/22 hover:bg-white/[0.09] focus:border-white/48 focus:bg-white/[0.1]"
      : "border-brand-ink/12 bg-brand-ink/[0.025] text-brand-ink placeholder:text-brand-ink/32 hover:border-brand-ink/18 hover:bg-brand-ink/[0.035] focus:border-brand-ink/32 focus:bg-white",
  );

  return (
    <div className={cn("contact-row overflow-hidden will-change-transform", field.wide && "sm:col-span-2")} data-contact-form-row>
      <div className="grid gap-2">
        <label htmlFor={id} className={cn(
          "text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
          isDark ? "text-white/62" : "text-brand-ink/58",
        )}>
          {field.label}{field.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {field.multiline ? (
          <textarea
            id={id}
            name={field.id}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            rows={4}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            className={`${controlClassName} resize-none leading-relaxed`}
          />
        ) : (
          <input
            id={id}
            name={field.id}
            type={field.type}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            className={controlClassName}
          />
        )}
      </div>
    </div>
  );
}

function StructuredStep({
  id,
  step,
  values,
  content,
  isDark,
  updateText,
  toggleMultiple,
  setValues,
}: {
  id: string;
  step: number;
  values: EnquiryValues;
  content: ProjectEnquiryContent;
  isDark: boolean;
  updateText: (key: keyof EnquiryValues, value: string) => void;
  toggleMultiple: (key: "projectTypes" | "priorities", optionId: string) => void;
  setValues: React.Dispatch<React.SetStateAction<EnquiryValues>>;
}) {
  const copy = content.structured;
  const stepNumber = String(step).padStart(2, "0");
  const lastStep = String(STRUCTURED_LAST_STEP).padStart(2, "0");

  return (
    <section className="grid min-h-[18rem] content-start gap-8" aria-labelledby={`${id}-step-heading`}>
      <div className={cn(
        "flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.08em]",
        isDark ? "text-white/55" : "text-brand-ink/48",
      )}>
        <span id={step === 0 ? `${id}-step-heading` : undefined}>
          {step === 0 ? copy.personalDetails : copy.projectParticulars}
        </span>
        <span>{stepNumber}/{lastStep}</span>
      </div>

      {step === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <StructuredTextField
            id={`${id}-structured-name`}
            label={copy.contact.name}
            placeholder={copy.contact.namePlaceholder}
            value={values.name}
            type="text"
            autoComplete="name"
            required
            isDark={isDark}
            onChange={(value) => updateText("name", value)}
          />
          <StructuredTextField
            id={`${id}-structured-email`}
            label={copy.contact.email}
            placeholder={copy.contact.emailPlaceholder}
            value={values.email}
            type="email"
            autoComplete="email"
            required
            isDark={isDark}
            onChange={(value) => updateText("email", value)}
          />
          <StructuredTextField
            id={`${id}-structured-phone`}
            label={copy.contact.phone}
            placeholder={copy.contact.phonePlaceholder}
            value={values.phone}
            type="tel"
            autoComplete="tel"
            isDark={isDark}
            className="sm:col-span-2"
            onChange={(value) => updateText("phone", value)}
          />
        </div>
      ) : null}

      {step === 1 ? (
        <ChoiceStep
          id={`${id}-project-type`}
          headingId={`${id}-step-heading`}
          question={copy.projectType}
          selected={values.projectTypes}
          multiple
          required
          isDark={isDark}
          onToggle={(optionId) => toggleMultiple("projectTypes", optionId)}
        />
      ) : null}

      {step === 2 ? (
        <QuestionShell id={`${id}-step-heading`} title={copy.description.title} meta={copy.required} isDark={isDark}>
          <textarea
            name="projectDescription"
            required
            rows={6}
            value={values.message}
            placeholder={copy.description.placeholder}
            onChange={(event) => updateText("message", event.currentTarget.value)}
            className={structuredControlClass(isDark, "resize-none leading-relaxed")}
          />
        </QuestionShell>
      ) : null}

      {step === 3 ? (
        <QuestionShell id={`${id}-step-heading`} title={copy.location.title} meta={copy.required} isDark={isDark}>
          <input
            name="projectLocation"
            required
            value={values.location}
            placeholder={copy.location.placeholder}
            onChange={(event) => updateText("location", event.currentTarget.value)}
            className={structuredControlClass(isDark)}
          />
        </QuestionShell>
      ) : null}

      {step === 4 ? (
        <QuestionShell id={`${id}-step-heading`} title={copy.size.title} meta={copy.optional} isDark={isDark}>
          <div className="grid gap-3">
            <input
              name="projectSize"
              disabled={values.sizeUnknown}
              value={values.size}
              placeholder={copy.size.placeholder}
              onChange={(event) => updateText("size", event.currentTarget.value)}
              className={cn(structuredControlClass(isDark), "disabled:cursor-not-allowed disabled:opacity-35")}
            />
            <label className={cn(
              "flex cursor-pointer items-center gap-3 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] transition-colors duration-500",
              values.sizeUnknown
                ? isDark ? "border-white bg-white text-black" : "border-brand-ink bg-brand-ink text-white"
                : isDark ? "border-white/14 text-white/65 hover:border-white/30" : "border-brand-ink/14 text-brand-ink/62 hover:border-brand-ink/30",
            )}>
              <input
                type="checkbox"
                checked={values.sizeUnknown}
                onChange={(event) => {
                  const isUnknown = event.currentTarget.checked;
                  setValues((current) => ({
                    ...current,
                    sizeUnknown: isUnknown,
                    size: isUnknown ? "" : current.size,
                  }));
                }}
                className="sr-only"
              />
              <span aria-hidden="true" className="size-2 rounded-full border border-current" />
              {copy.size.unknown}
            </label>
          </div>
        </QuestionShell>
      ) : null}

      {step === 5 ? (
        <ChoiceStep
          id={`${id}-timeframe`}
          headingId={`${id}-step-heading`}
          question={copy.timeframe}
          selected={values.timeframe ? [values.timeframe] : []}
          isDark={isDark}
          onToggle={(optionId) => updateText("timeframe", optionId)}
        />
      ) : null}

      {step === 6 && copy.questionOrder === "priorities-first" ? (
        <ChoiceStep
          id={`${id}-priorities`}
          headingId={`${id}-step-heading`}
          question={copy.priorities}
          selected={values.priorities}
          multiple
          isDark={isDark}
          onToggle={(optionId) => toggleMultiple("priorities", optionId)}
        />
      ) : null}

      {step === 6 && copy.questionOrder === "source-first" ? (
        <ChoiceStep
          id={`${id}-source`}
          headingId={`${id}-step-heading`}
          question={copy.source}
          selected={values.source ? [values.source] : []}
          isDark={isDark}
          onToggle={(optionId) => updateText("source", optionId)}
        />
      ) : null}

      {step === 7 && copy.questionOrder === "priorities-first" ? (
        <ChoiceStep
          id={`${id}-source`}
          headingId={`${id}-step-heading`}
          question={copy.source}
          selected={values.source ? [values.source] : []}
          isDark={isDark}
          onToggle={(optionId) => updateText("source", optionId)}
        />
      ) : null}

      {step === 7 && copy.questionOrder === "source-first" ? (
        <ChoiceStep
          id={`${id}-priorities`}
          headingId={`${id}-step-heading`}
          question={copy.priorities}
          selected={values.priorities}
          multiple
          isDark={isDark}
          onToggle={(optionId) => toggleMultiple("priorities", optionId)}
        />
      ) : null}

      {step === 8 ? (
        <QuestionShell id={`${id}-step-heading`} title={copy.additional.title} meta={copy.optional} isDark={isDark}>
          <textarea
            name="additionalInformation"
            rows={6}
            value={values.additional}
            placeholder={copy.additional.placeholder}
            onChange={(event) => updateText("additional", event.currentTarget.value)}
            className={structuredControlClass(isDark, "resize-none leading-relaxed")}
          />
        </QuestionShell>
      ) : null}
    </section>
  );
}

function QuestionShell({
  id,
  title,
  meta,
  isDark,
  children,
}: {
  id: string;
  title: string;
  meta: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-6">
        <h3 id={id} className="max-w-2xl text-[clamp(1.45rem,2.6vw,2.35rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          {title}
        </h3>
        <span className={cn(
          "mt-1 shrink-0 text-[0.58rem] font-semibold uppercase tracking-[0.07em]",
          isDark ? "text-white/42" : "text-brand-ink/42",
        )}>
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
}

function ChoiceStep({
  id,
  headingId,
  question,
  selected,
  multiple = false,
  required = false,
  isDark,
  onToggle,
}: {
  id: string;
  headingId: string;
  question: ChoiceQuestion;
  selected: string[];
  multiple?: boolean;
  required?: boolean;
  isDark: boolean;
  onToggle: (optionId: string) => void;
}) {
  return (
    <fieldset className="grid gap-5" aria-labelledby={headingId}>
      <legend className="w-full pb-1">
        <span id={headingId} className="block text-[clamp(1.45rem,2.6vw,2.35rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          {question.title}
        </span>
        <span className={cn("mt-2 block text-xs font-normal tracking-normal", isDark ? "text-white/44" : "text-brand-ink/44")}>
          {question.hint}
        </span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const active = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={cn(
                "group flex min-h-12 cursor-pointer items-center justify-between gap-4 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.045em] transition-colors duration-500 ease-[cubic-bezier(.58,0,.22,1)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-3px]",
                active
                  ? isDark ? "border-white bg-white text-black" : "border-brand-ink bg-brand-ink text-white"
                  : isDark ? "border-white/14 bg-white/[0.055] text-white hover:border-white/28" : "border-brand-ink/14 bg-brand-ink/[0.025] text-brand-ink hover:border-brand-ink/28",
                isDark ? "focus-within:outline-white" : "focus-within:outline-brand-ink",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={id}
                value={option.id}
                checked={active}
                required={required && index === 0 && selected.length === 0}
                onChange={() => onToggle(option.id)}
                className="sr-only"
              />
              <span>{option.label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 shrink-0 border border-current transition-transform duration-500",
                  multiple ? "rounded-[1px]" : "rounded-full",
                  active ? "scale-100 bg-current" : "scale-75 bg-transparent opacity-55",
                )}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function StructuredTextField({
  id,
  label,
  placeholder,
  value,
  type,
  autoComplete,
  required = false,
  isDark,
  className,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  required?: boolean;
  isDark: boolean;
  className?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className={cn(
        "text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
        isDark ? "text-white/62" : "text-brand-ink/58",
      )}>
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={structuredControlClass(isDark)}
      />
    </div>
  );
}

function StructuredNavigation({
  step,
  content,
  isDark,
  isSubmitting,
  sendingLabel,
  onBack,
  onNext,
}: {
  step: number;
  content: ProjectEnquiryContent;
  isDark: boolean;
  isSubmitting: boolean;
  sendingLabel: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const copy = content.structured;
  return (
    <div className={cn(
      "mt-6 grid items-center gap-x-4 border-t pt-4",
      step > 0 ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-1",
      isDark ? "border-white/18" : "border-brand-ink/14",
    )}>
      {step > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-55",
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          ← {copy.back}
        </button>
      ) : null}
      {step < STRUCTURED_LAST_STEP ? (
        <button
          type="button"
          onClick={onNext}
          className={cn(
            "group inline-flex items-center justify-self-end gap-4 rounded-full py-2 pl-5 pr-2 text-xs font-semibold uppercase tracking-[0.06em]",
            isDark ? "bg-[#f4f1ea] text-black" : "bg-brand-ink text-white",
          )}
        >
          <span>{copy.next}</span>
          <span className={cn(
            "grid size-9 place-items-center rounded-full text-sm transition-transform duration-700 ease-[cubic-bezier(.58,0,.22,1)] group-hover:translate-x-1",
            isDark ? "bg-black text-white" : "bg-white text-brand-ink",
          )}>→</span>
        </button>
      ) : (
        <>
          <div className="justify-self-end">
            <SubmitButton
              label={isSubmitting ? sendingLabel : copy.submit}
              isDark={isDark}
              disabled={isSubmitting}
            />
          </div>
          <p className={cn(
            "col-start-2 mt-2 max-w-xs justify-self-end text-right text-[0.6rem] leading-relaxed sm:text-[0.66rem]",
            isDark ? "text-white/42" : "text-brand-ink/42",
          )}>
            {copy.submitNote}
          </p>
        </>
      )}
    </div>
  );
}

function SubmitButton({
  label,
  isDark,
  disabled = false,
}: {
  label: string;
  isDark: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.055em] disabled:cursor-wait disabled:opacity-60 sm:gap-4 sm:py-2 sm:pl-6 sm:pr-2 sm:text-xs sm:tracking-[0.06em]",
        isDark ? "bg-[#f4f1ea] text-black" : "bg-brand-ink text-white",
      )}
    >
      <span>{label}</span>
      <span className={cn(
        "grid size-8 place-items-center rounded-full text-sm transition-transform duration-700 ease-[cubic-bezier(.58,0,.22,1)] group-hover:rotate-45 sm:size-10 sm:text-base",
        isDark ? "bg-black text-white" : "bg-white text-brand-ink",
      )}>↗</span>
    </button>
  );
}

function structuredControlClass(isDark: boolean, extra = "") {
  return cn(
    "w-full rounded-none border px-4 py-4 text-base outline-none transition-[background-color,border-color] duration-500",
    isDark
      ? "border-white/12 bg-white/[0.07] text-white placeholder:text-white/32 hover:border-white/22 hover:bg-white/[0.09] focus:border-white/48 focus:bg-white/[0.1]"
      : "border-brand-ink/12 bg-brand-ink/[0.025] text-brand-ink placeholder:text-brand-ink/32 hover:border-brand-ink/18 hover:bg-brand-ink/[0.035] focus:border-brand-ink/32 focus:bg-white",
    extra,
  );
}
