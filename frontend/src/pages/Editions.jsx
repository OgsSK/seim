import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

export default function Editions() {
  const { t, lang } = useLanguage();
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    api.editions().then(setEditions).catch(() => {});
  }, []);

  return (
    <div data-testid="editions-page">
      <PageHero eyebrow={t("editions.eyebrow")} title={t("editions.title")} subtitle={t("editions.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-navy/10" />
          <div className="space-y-16">
            {editions.map((ed, i) => (
              <Reveal key={ed.id} delay={0.05}>
                <div
                  data-testid={`edition-${ed.year}`}
                  className={`relative grid sm:grid-cols-2 gap-8 items-center ${i % 2 ? "" : ""}`}
                >
                  <div className={`absolute left-5 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-bone shadow`} />
                  <div className={`pl-12 sm:pl-0 ${i % 2 ? "sm:order-2 sm:pl-14" : "sm:pr-14 sm:text-right"}`}>
                    <span className="font-serif-accent italic text-6xl text-gold/50 leading-none">{ed.year}</span>
                    <h3 className="mt-3 font-display font-extrabold text-navy text-xl sm:text-2xl leading-snug">
                      {lang === "fr" ? ed.theme_fr : ed.theme_en}
                    </h3>
                    <p className="mt-2 text-navy/50 text-sm">{lang === "fr" ? ed.venue_fr : ed.venue_en}</p>
                    <p className="mt-3 text-navy/65 leading-relaxed">{lang === "fr" ? ed.summary_fr : ed.summary_en}</p>
                    <div className={`mt-5 flex flex-wrap gap-5 ${i % 2 ? "" : "sm:justify-end"}`}>
                      {[
                        { v: ed.participants, l: t("editions.participants") },
                        { v: ed.speakers, l: t("editions.speakersCount") },
                        { v: ed.exhibitors, l: t("editions.exhibitorsCount") },
                      ].map((s, j) => (
                        <div key={j}>
                          <p className="font-display font-extrabold text-gold-dark text-xl">{s.v}</p>
                          <p className="text-[11px] uppercase tracking-wider text-navy/45 font-semibold">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`pl-12 sm:pl-0 ${i % 2 ? "sm:order-1 sm:pr-14" : "sm:pl-14"}`}>
                    <div className="rounded-2xl overflow-hidden border border-navy/10 shadow-lg shadow-navy/8">
                      <SmartImg src={ed.image} alt={ed.year} className="w-full aspect-[16/10] object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
