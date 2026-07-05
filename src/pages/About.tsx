import { useGsapReveal } from "../hooks/useGsapReveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { PageContainer } from "../components/layout/PageContainer";

const services = [
  "Arkitektur",
  "Inredning",
  "Bygglovshandlingar",
  "Projektledning",
  "Restaurering",
  "Hållbarhetskonsult",
  "Ljusdesign",
  "Konceptutveckling",
];

const team = [
  { name: "Elin Bergström", role: "Grundare & Arkitekt SAR/MSA" },
  { name: "Oscar Lindgren", role: "Arkitekt SAR/MSA" },
  { name: "Klara Norén", role: "Inredningsarkitekt" },
  { name: "Erik Wallin", role: "Projektledare" },
];

export function About() {
  const servicesRef = useGsapReveal<HTMLDivElement>();
  const teamRef = useGsapReveal<HTMLDivElement>();

  return (
    <div className="pt-32 pb-[var(--spacing-section)]">
      <PageContainer className="space-y-[var(--spacing-section)]">
        <div>
          <SectionHeading
            label="Om oss"
            title="En byrå med rötterna i den svenska arkitekturtraditionen"
            description="Lagom Arkitektur grundades 2010 av Elin Bergström med en vision om att skapa arkitektur som känns självklar — varken för mycket eller för lite, utan precis lagom."
          />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <span className="text-xs tracking-widest uppercase text-text-muted mb-4 block">
                Filosofi
              </span>
              <h3 className="font-display text-2xl md:text-3xl mb-6">
                Enkelhet är den yttersta sofistikationen
              </h3>
              <div className="space-y-4 text-text-muted text-base leading-relaxed">
                <p>
                  Vi tror på arkitektur som utgår från platsen, människan och
                  materialet. Varje projekt börjar med en noggrann analys av
                  platsens förutsättningar — ljus, vind, topografi och befintlig
                  bebyggelse.
                </p>
                <p>
                  Vår process präglas av ett hantverksmässigt förhållningssätt
                  där varje detalj är noga övervägd. Vi arbetar nära våra
                  uppdragsgivare genom hela processen, från skiss till
                  färdig byggnad.
                </p>
                <p>
                  Hållbarhet är inte en adderad faktor för oss — det är
                  grunden i allt vi gör. Vi väljer material med omsorg,
                  optimerar energianvändning och skapar byggnader som är
                  vackra, funktionella och byggda för att hålla.
                </p>
              </div>
            </div>

            <div className="aspect-[3/4] bg-surface" />
          </div>
        </div>

        <div ref={servicesRef}>
          <SectionHeading label="Tjänster" title="Vad vi erbjuder" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service}
                className="border border-border px-6 py-8 text-center"
              >
                <span className="text-sm text-text-primary">{service}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={teamRef}>
          <SectionHeading label="Team" title="Vårt team" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {team.map((member) => (
              <div key={member.name}>
                <div className="aspect-[3/4] bg-surface mb-4" />
                <h4 className="text-sm font-medium">{member.name}</h4>
                <p className="text-xs text-text-muted mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
