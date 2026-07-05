import {useEffect, useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import heroImage from "../../assets/images/hero2.avif";
import {motionEases} from "../../lib/motion";
import {ClipMaskTextAnimation} from "../animation/ClipMaskTextAnimation";

interface ContactOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const fields = [
    {id: "name", label: "Name", type: "text", autoComplete: "name", required: true, placeholder: "Your name"},
    {id: "email", label: "Email address", type: "email", autoComplete: "email", required: true, placeholder: "you@studio.com"},
    {id: "phone", label: "Phone number", type: "tel", autoComplete: "tel", required: false, placeholder: "+46 00 000 00 00"},
] as const;

export function ContactOverlay({isOpen, onClose, triggerRef}: ContactOverlayProps) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useGSAP(() => {
        const root = rootRef.current;
        const backdrop = backdropRef.current;
        const panel = panelRef.current;
        const rows = gsap.utils.toArray<HTMLElement>(".contact-row", root);
        if (!root || !backdrop || !panel) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (isOpen) {
            gsap.set(root, {visibility: "visible", pointerEvents: "auto"});
            gsap.timeline({defaults: {overwrite: "auto"}})
                .fromTo(backdrop,
                    {autoAlpha: 0, backdropFilter: "blur(0px)"},
                    {autoAlpha: 1, backdropFilter: "blur(10px)", duration: reduceMotion ? 0 : 0.7, ease: motionEases.reveal},
                    0,
                )
                .fromTo(panel,
                    {xPercent: 101},
                    {xPercent: 0, duration: reduceMotion ? 0 : 0.86, ease: motionEases.reveal},
                    0,
                )
                .fromTo(imageRef.current,
                    {clipPath: "inset(100% 0 0 0)", scale: 1.08},
                    {clipPath: "inset(0% 0 0 0)", scale: 1, duration: reduceMotion ? 0 : 0.72, ease: motionEases.enter},
                    reduceMotion ? 0 : 0.38,
                )
                .fromTo(rows,
                    {yPercent: 115, rotation: 0.8},
                    {yPercent: 0, rotation: 0, duration: reduceMotion ? 0 : 0.62, stagger: 0.045, ease: motionEases.enter},
                    reduceMotion ? 0 : 0.34,
                );
            return;
        }

        gsap.timeline({
            defaults: {overwrite: "auto"},
            onComplete: () => gsap.set(root, {visibility: "hidden", pointerEvents: "none"}),
        })
            .to(rows, {
                yPercent: -115,
                duration: reduceMotion ? 0 : 0.34,
                stagger: {each: 0.025, from: "end"},
                ease: motionEases.depart,
            })
            .to(panel, {
                xPercent: 101,
                duration: reduceMotion ? 0 : 0.72,
                ease: motionEases.depart,
            }, reduceMotion ? 0 : 0.08)
            .to(backdrop, {
                autoAlpha: 0,
                backdropFilter: "blur(0px)",
                duration: reduceMotion ? 0 : 0.5,
                ease: motionEases.depart,
            }, "<0.08");
    }, {scope: rootRef, dependencies: [isOpen]});

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const previousRootOverflow = document.documentElement.style.overflow;
        const trigger = triggerRef.current;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {detail: {locked: true}}));
        closeRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.dispatchEvent(new CustomEvent("lagom:scroll-lock", {detail: {locked: false}}));
            document.documentElement.style.overflow = previousRootOverflow;
            document.body.style.overflow = previousOverflow;
            trigger?.focus();
        };
    }, [isOpen, onClose, triggerRef]);

    return (
        <div
            ref={rootRef}
            className="invisible fixed inset-0 z-[160] pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-heading"
            aria-hidden={!isOpen}
        >
            <button
                ref={backdropRef}
                type="button"
                onClick={onClose}
                aria-label="Close enquiry form"
                data-cursor="close"
                className="absolute inset-0 hidden bg-black/45 md:block"
            />

            <section
                ref={panelRef}
                data-cursor="scroll"
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                className="contact-panel absolute inset-y-0 right-0 flex h-dvh w-full touch-pan-y flex-col overflow-y-auto overscroll-contain bg-black text-white will-change-transform md:w-[58vw] lg:w-[54vw]"
            >
                <div className="grid min-h-full grid-rows-[auto_auto_1fr_auto] gap-8 px-[var(--spacing-viewport-gutter)] py-6 md:gap-10 md:py-8">
                    <header className="flex items-start justify-between border-t border-white/70 pt-4">
                        <div className="overflow-hidden">
                            <div className="contact-row will-change-transform">
                                <p className="text-xs font-semibold uppercase tracking-[0.08em]">Project enquiry</p>
                            </div>
                        </div>
                        <button ref={closeRef} type="button" onClick={onClose} data-cursor="default" className="group flex items-center gap-3 text-xs font-semibold uppercase">
                            <ClipMaskTextAnimation text="Close" />
                            <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 transition-transform duration-500 group-hover:rotate-90">
                                <path d="M1 1L11 11M11 1L1 11" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </button>
                    </header>

                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_8rem] md:items-start">
                        <div className="overflow-hidden">
                            <div className="contact-row will-change-transform">
                                <h2 id="contact-heading" className="max-w-2xl text-[clamp(2rem,4vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.055em]">
                                    Tell us about the space you want to create.
                                </h2>
                                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
                                    Share the first details of your project. We’ll review your enquiry and reply with the right next step.
                                </p>
                            </div>
                        </div>
                        <figure className="hidden md:block">
                            <div className="aspect-[3/4] overflow-hidden bg-white/10">
                                <img ref={imageRef} src={heroImage} alt="Lagom residential architecture" className="h-full w-full object-cover will-change-transform" />
                            </div>
                            <figcaption className="mt-2 flex justify-between text-[0.6rem] font-semibold uppercase text-white/55">
                                <span>Lagom</span><span>01/01</span>
                            </figcaption>
                        </figure>
                    </div>

                    <form onSubmit={(event) => event.preventDefault()} className="self-end" aria-label="Project enquiry form">
                        <div className="mb-5 overflow-hidden border-b border-white/25 pb-3">
                            <div className="contact-row flex justify-between text-xs font-semibold uppercase will-change-transform">
                                <span>Your details</span><span>Required *</span>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className={`overflow-hidden ${index === 2 ? "md:col-span-2" : ""}`}>
                                    <div className="contact-row will-change-transform">
                                        <label htmlFor={`contact-${field.id}`} className="mb-2 block text-xs font-medium uppercase">
                                            {field.label}{field.required && <span aria-hidden="true"> *</span>}
                                        </label>
                                        <input
                                            id={`contact-${field.id}`}
                                            name={field.id}
                                            type={field.type}
                                            autoComplete={field.autoComplete}
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            data-cursor="default"
                                            className="h-14 w-full rounded-none border border-transparent bg-[#f4f1ea] px-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-white focus:bg-white"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="overflow-hidden md:col-span-2">
                                <div className="contact-row will-change-transform">
                                    <label htmlFor="contact-message" className="mb-2 block text-xs font-medium uppercase">Project overview *</label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Location, scope, timeline and anything else we should know"
                                        data-cursor="default"
                                        className="w-full resize-none rounded-none border border-transparent bg-[#f4f1ea] px-4 py-4 text-sm text-black outline-none transition-colors placeholder:text-black/40 focus:border-white focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden">
                            <div className="contact-row will-change-transform">
                                <button type="submit" className="group flex w-full items-center justify-between border-t border-white/50 py-4 text-sm font-semibold uppercase">
                                    <span>Send enquiry</span>
                                    <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <footer className="flex justify-between text-[0.62rem] font-semibold uppercase text-white/45">
                        <span>Lagom Arkitektur</span><span>Studio enquiries</span>
                    </footer>
                </div>
            </section>
        </div>
    );
}
