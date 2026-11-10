import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";

/* ---------- Skeleton ---------- */
function Skeleton() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {[0, 1].map((i) => (
        <div key={i} className="grid sm:grid-cols-2 gap-8 items-center">
          <div className="h-32 sm:h-48 animate-pulse" style={{ backgroundColor: RULE }} />
          <div className="h-48 sm:h-64 animate-pulse" style={{ backgroundColor: RULE }} />
        </div>
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ lang }) {
  return (
    <div className="py-20 text-center border-y" style={{ borderColor: RULE }}>
      <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6" style={{ color: BRONZE }}>
        <CalendarDays size={28} strokeWidth={1} />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les éditions seront présentées ici"
          : "Editions will be shown here"}
      </h3>
      <p className="font-serif italic text-[15px] max-w-md mx-auto leading-relaxed" style={{ color: "rgba(12,45,82,0.55)" }}>
        {lang === "fr"
          ? "L'historique des éditions du SEIM sera publié prochainement."
          : "The SEIM editions history will be published soon."}
      </p>
    </div>
  );
}

/* ---------- Carte édition ---------- */
function EditionCard({ ed, index, lang, t }) {
  const isReversed = index % 2 === 1;

  return (
    <Reveal delay={0.05}>
      <div
        data-testid={`edition-${ed.year}`}
        className="relative grid sm:grid-cols-2 gap-8 sm:gap-16 items-center"
      >
        {/* Point de timeline — petit carré bronze sur le filet */}
        <div 
          className="absolute left-0 sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-1.5 h-1.5 rotate-45 z-10" 
          style={{ backgroundColor: BRONZE }} 
        />

        {/* Bloc texte */}
        <div
          className={`pl-6 sm:pl-0 ${
            isReversed
              ? "sm:order-2 sm:pl-16"
              : "sm:pr-16 sm:text-right"
          }`}
        >
          <span 
            className="font-serif italic text-5xl sm:text-7xl leading-none block mb-4"
            style={{ color: BRONZE }}
          >
            {ed.year}
          </span>
          
          <h3 
            className="font-serif text-xl sm:text-2xl leading-[1.15] tracking-[-0.01em] mb-3"
            style={{ color: INK }}
          >
            {lang === "fr" ? ed.theme_fr : ed.theme_en}
          </h3>
          
          <p 
            className="text-[10px] uppercase tracking-[0.2em] font-medium mb-5"
            style={{ color: "rgba(12,45,82,0.45)" }}
          >
            {lang === "fr" ? ed.venue_fr : ed.venue_en}
          </p>
          
          <p 
            className="text-[14px] sm:text-[15px] leading-[1.75] font-serif"
            style={{ color: "rgba(12,45,82,0.65)" }}
          >
            {lang === "fr" ? ed.summary_fr : ed.summary_en}
          </p>

          {/* Stats compactes en "Ledger" */}
          <div
            className={`mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t pt-4 ${
              isReversed ? "" : "sm:justify-end"
            }`}
            style={{ borderColor: RULE }}
          >
            {[
              { v: ed.participants, l: t("editions.participants") },
              { v: ed.speakers, l: t("editions.speakersCount") },
              { v: ed.exhibitors, l: t("editions.exhibitorsCount") },
            ].map((s, j) => (
              <div key={j} className={isReversed ? "text-left" : "sm:text-right"}>
                <p className="font-serif font-light text-2xl sm:text-3xl leading-none" style={{ color: INK }}>
                  {s.v}
                </p>
                <p className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(12,45,82,0.45)" }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bloc image — SANS CADRE, avec ombre douce */}
        <div
          className={`pl-6 sm:pl-0 ${
            isReversed ? "sm:order-1 sm:pr-16" : "sm:pl-16"
          }`}
        >
          <div className="overflow-hidden shadow-2xl shadow-black/10">
            <SmartImg
              src={ed.image}
              alt={ed.year}
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
          
          {/* Légende éditoriale sous l'image */}
          <p 
            className={`mt-3 text-[10px] sm:text-[11px] italic font-serif ${isReversed ? "text-left" : "sm:text-right"}`}
            style={{ color: "rgba(12,45,82,0.45)" }}
          >
            {lang === "fr" ? "Archives SEIM — CICB, Bamako." : "SEIM Archives — CICB, Bamako."}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Editions() {
  const { t, lang } = useLanguage();
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .editions()
      .then(setEditions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="editions-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("editions.eyebrow")}
        title={t("editions.title")}
        subtitle={t("editions.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          
          {/* Ligne verticale de timeline */}
          <div 
            className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 pointer-events-none" 
            style={{ backgroundColor: RULE }} 
          />

          {loading ? (
            <Skeleton />
          ) : editions.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <div className="space-y-16 sm:space-y-24">
              {editions.map((ed, i) => (
                <EditionCard
                  key={ed.id}
                  ed={ed}
                  index={i}
                  lang={lang}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}