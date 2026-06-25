import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { getFeaturedProjects } from "../data/projects";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ProjectGrid } from "../components/project/ProjectGrid";
import { StickyOverlapHero } from "../components/sections/StickyOverlapHero";

const featured = getFeaturedProjects();

export function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null!);
  const heroContentRef = useRef<HTMLDivElement>(null!);
  const ctaRef = useGsapReveal<HTMLDivElement>();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 2, ease: "power2.out" }
      );
      gsap.from(heroContentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.5,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        <div
          ref={heroRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

        <div
          ref={heroContentRef}
          className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-40 px-6 md:px-16"
        >
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-xs tracking-widest uppercase text-white/50 mb-4 block">
              Lagom Arkitektur
            </span>
            <h1 className="font-display text-5xl md:text-8xl text-white leading-tight max-w-4xl">
              Arkitektur för människa och plats
            </h1>
            <p className="mt-6 text-white/70 max-w-xl text-base md:text-lg leading-relaxed">
              En svensk arkitektbyrå som skapar hållbara, tidlösa och
              mänskliga rum i samspel med omgivningen.
            </p>
          </div>
        </div>
      </section>

      <StickyOverlapHero
        imageSrc="/images/projects/project-01/hero.jpg"
        imageAlt="Modern villa exterior in the Swedish archipelago"
        eyebrow="Vår filosofi"
        title={
          <>
            Arkitektur med
            <br />
            människan i centrum
          </>
        }
        description="Vi skapar rum som formas av tydlighet, materialärlighet och hur människor faktiskt lever och verkar."
      />

      <section className="px-6 md:px-16 py-24 md:py-40">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Om oss"
            title="Vi ritar rum som varar"
            description="Lagom Arkitektur grundades 2010 med en övertygelse om att god arkitektur handlar om balans. Vi arbetar i skärningspunkten mellan tradition och innovation, med ett starkt fokus på materialkänsla, ljussättning och hållbarhet. Varje projekt är en dialog med platsen, människan och tiden."
          />
          <Link
            to="/om-oss"
            className="inline-block text-sm tracking-widest uppercase border-b border-text-primary pb-1 hover:text-text-muted hover:border-text-muted transition-colors"
          >
            Läs mer om vår filosofi
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-16 py-24 md:py-40 bg-surface/40">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Utvalda projekt"
            title="Utvalda arbeten"
            description="Ett urval av våra senaste projekt. Varje projekt berättar en unik historia om plats, material och mänsklig närvaro."
          />
          <ProjectGrid projects={featured} />
          <div className="mt-16 text-center">
            <Link
              to="/projekt"
              className="inline-block text-sm tracking-widest uppercase border-b border-text-primary pb-1 hover:text-text-muted hover:border-text-muted transition-colors"
            >
              Visa alla projekt
            </Link>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="px-6 md:px-16 py-32 md:py-48">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-widest uppercase text-text-muted mb-4 block">
            Kontakt
          </span>
          <h2 className="font-display text-4xl md:text-7xl text-text-primary leading-tight mb-8">
            Har du ett projekt
            <br /> att diskutera?
          </h2>
          <Link
            to="/kontakt"
            className="inline-block px-10 py-4 border border-text-primary text-sm tracking-widest uppercase hover:bg-text-primary hover:text-bg transition-all duration-300"
          >
            Hör av dig
          </Link>
        </div>
      </section>
    </>
  );
}
