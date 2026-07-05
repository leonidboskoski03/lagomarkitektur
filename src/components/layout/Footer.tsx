import { Link } from "react-router-dom";
import { SITE_TITLE } from "../../lib/constants";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import { PageContainer } from "./PageContainer";

export function Footer() {
  const footerRef = useGsapReveal<HTMLElement>();

  return (
    <footer
      ref={footerRef}
      className="bg-accent-dark text-white/80"
    >
      <PageContainer className="py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          <div>
            <h3 className="font-display text-3xl mb-4 text-white">{SITE_TITLE}</h3>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Svensk arkitektbyrå med fokus på hållbar, tidlös och mänsklig arkitektur.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6 text-white/40">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hej@lagomarkitektur.se"
                  className="hover:text-white transition-colors"
                >
                  hej@lagomarkitektur.se
                </a>
              </li>
              <li>
                <a
                  href="tel:+46701234567"
                  className="hover:text-white transition-colors"
                >
                  +46 70 123 45 67
                </a>
              </li>
              <li className="text-white/60">Skeppsbron 10, 111 30 Stockholm</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6 text-white/40">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Start" },
                { href: "/projekt", label: "Projekt" },
                { href: "/om-oss", label: "Om oss" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-xs text-white/30 flex flex-col md:flex-row justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} {SITE_TITLE}. Alla rättigheter förbehållna.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
