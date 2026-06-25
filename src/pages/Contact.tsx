import type { FormEvent } from "react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from "../lib/constants";

export function Contact() {
  const formRef = useGsapReveal<HTMLDivElement>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    console.log({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    });
  }

  return (
    <div className="pt-32 pb-24 md:pb-40">
      <div className="px-6 md:px-16 mb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Kontakt"
            title="Låt oss skapa något tillsammans"
            description="Är du intresserad av att samarbeta? Tveka inte att höra av dig. Vi tar gärna en första kopp kaffe och pratar om ditt projekt."
          />
        </div>
      </div>

      <div className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-12">
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-3">
                Mejl
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-display text-2xl md:text-3xl text-text-primary hover:text-text-muted transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-3">
                Telefon
              </span>
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="font-display text-2xl md:text-3xl text-text-primary hover:text-text-muted transition-colors"
              >
                {CONTACT_PHONE}
              </a>
            </div>

            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted block mb-3">
                Besök oss
              </span>
              <p className="text-text-primary text-base leading-relaxed">
                {CONTACT_ADDRESS}
              </p>
            </div>
          </div>

          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs tracking-widest uppercase text-text-muted block mb-2"
                >
                  Namn
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-border pb-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-text-primary transition-colors"
                  placeholder="Ditt namn"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs tracking-widest uppercase text-text-muted block mb-2"
                >
                  E-post
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-border pb-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-text-primary transition-colors"
                  placeholder="din@epost.se"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-xs tracking-widest uppercase text-text-muted block mb-2"
                >
                  Meddelande
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-transparent border-b border-border pb-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-text-primary transition-colors resize-none"
                  placeholder="Berätta gärna om ditt projekt..."
                />
              </div>

              <button
                type="submit"
                className="px-10 py-4 border border-text-primary text-sm tracking-widest uppercase hover:bg-text-primary hover:text-bg transition-all duration-300"
              >
                Skicka
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
