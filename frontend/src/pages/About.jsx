import { PageHero } from "../components/PageHero";
import { SmartImg } from "../components/SectionHead";
import { Reveal, Stagger, StaggerItem, CountUp } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.15)";

export default function About() {
  const { t, lang } = useLanguage();
  const pillars = t("about.pillars");
  const stats = t("stats.items");

  /* Contenu du manifeste — inline FR/EN pour ne dépendre d'aucune clé manquante */
  const manifesto = {
    fr: {
      eyebrow: "Notre conviction",
      title: "Un événement ne change pas un pays. Une communauté, oui.",
      body:
        "SEIM n'est pas une conférence de plus. C'est un point de rencontre entre ceux qui pensent l'économie africaine et ceux qui la construisent au quotidien. Chaque édition renforce un réseau, alimente des projets, et transforme des intentions en actions concrètes.",
    },
    en: {
      eyebrow: "Our conviction",
      title: "An event does not change a country. A community does.",
      body:
        "SEIM is not just another conference. It is a meeting point between those who think Africa's economy and those who build it every day. Each edition strengthens a network, fuels projects, and turns intentions into concrete action.",
    },
  }[lang];

  return (
    <div data-testid="about-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        subtitle={t("about.p1")}
      />

      {/* ============================================================
          SECTION 1 · VISION — split éditorial
         ============================================================ */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Colonne image */}
          <div className="lg:col-span-5 relative order-1">
            <Reveal delay={0.1}>
              <div className="overflow-hidden relative" style={{ backgroundColor: INK }}>
                <SmartImg
                  src="/assets/seim/g-famille.jpg"
                  alt="SEIM"
                  className="w-full aspect-[4/5] object-cover opacity-90"
                />
                {/* Bloc caption / KPI en bas de l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: INK }}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-light text-5xl sm:text-6xl tracking-[-0.04em]" style={{ color: PAPER }}>
                      <CountUp value={1000} />
                    </span>
                    <span className="font-serif italic text-4xl sm:text-5xl" style={{ color: BRONZE }}>
                      +
                    </span>
                  </div>
                  <p className="mt-2.5 text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(242,244,246,0.6)" }}>
                    {stats[0]?.label}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Colonne texte */}
          <div className="lg:col-span-7 order-2 lg:pt-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                  {lang === "fr" ? "Vision" : "Vision"}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-3xl lg:text-[2.4rem] leading-[1.15] mb-8" style={{ color: INK }}>
                <span style={{ color: BRONZE }}>«&nbsp;</span>
                {t("hero.line1")} {t("hero.line2").toLowerCase()}{" "}
                {t("hero.line3").toLowerCase()}
                <span style={{ color: BRONZE }}>&nbsp;»</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-[15px] sm:text-[16px] leading-[1.75] mb-10" style={{ color: "rgba(12,45,82,0.65)" }}>
                {t("about.p2")}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <Link
                  to="/inscription"
                  data-testid="about-vision-register"
                  className="group inline-flex items-center gap-2.5 text-[13px] font-medium"
                  style={{ color: INK }}
                >
                  <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
                    {t("nav.register")}
                  </span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
                </Link>
                <Link
                  to="/intervenants"
                  className="group inline-flex items-center gap-2 text-[13px] font-medium"
                  style={{ color: INK }}
                >
                  <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
                    {lang === "fr" ? "Voir les intervenants" : "See speakers"}
                  </span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: BRONZE }} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 · PILIERS — grille éditoriale
         ============================================================ */}
      <section className="py-16 sm:py-24 lg:py-32 border-t" style={{ borderColor: RULE }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 sm:mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                  {lang === "fr" ? "Ce qui nous guide" : "What guides us"}
                </span>
              </div>
              <h2 className="font-serif tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.08]" style={{ color: INK }}>
                {lang === "fr" ? "Quatre piliers, une même direction" : "Four pillars, one direction"}
              </h2>
            </div>
            <span className="font-mono-num text-[11px] uppercase tracking-[0.15em] text-[#0C2D52]/40 whitespace-nowrap">
              04 {lang === "fr" ? "Piliers" : "Pillars"}
            </span>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 sm:gap-y-12">
            {pillars.map((p, i) => (
              <StaggerItem key={i}>
                <div data-testid={`about-pillar-${i}`} className="border-t pt-6" style={{ borderColor: RULE }}>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono-num text-[11px] tracking-[0.15em]" style={{ color: BRONZE }}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl tracking-tight mb-3" style={{ color: INK }}>
                    {p.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] leading-[1.7]" style={{ color: "rgba(12,45,82,0.6)" }}>
                    {p.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 · MANIFESTE — moment dark
         ============================================================ */}
      <section className="py-20 sm:py-28 lg:py-36" style={{ backgroundColor: INK, color: PAPER }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-10 h-px" style={{ backgroundColor: BRONZE }} />
              <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                {manifesto.eyebrow}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif tracking-[-0.02em] text-[1.6rem] sm:text-4xl lg:text-[2.8rem] leading-[1.15]">
              <span style={{ color: BRONZE }}>«&nbsp;</span>
              {manifesto.title}
              <span style={{ color: BRONZE }}>&nbsp;»</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 sm:mt-10 text-[15px] sm:text-[16px] leading-[1.8]" style={{ color: "rgba(242,244,246,0.55)" }}>
              {manifesto.body}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex items-center gap-3">
              <span className="w-6 h-px" style={{ backgroundColor: RULE_INK }} />
              <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: "rgba(242,244,246,0.4)" }}>
                {lang === "fr"
                  ? "Semaine de l'Économie et de l'Innovation au Mali"
                  : "Week of Economy and Innovation in Mali"}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          SECTION 4 · CHIFFRES + CTA
         ============================================================ */}
      <section className="py-16 sm:py-24 lg:py-32 border-t" style={{ borderColor: RULE }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
              {t("stats.eyebrow")}
            </span>
          </div>

          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6">
            {stats.map((s, i) => (
              <StaggerItem key={i}>
                <div data-testid={`about-stat-${i}`} className="pt-4 border-t" style={{ borderColor: RULE }}>
                  <div className="flex items-baseline">
                    <span className="font-light tracking-[-0.04em] text-3xl sm:text-4xl" style={{ color: INK }}>
                      <CountUp value={s.value} />
                    </span>
                    {s.suffix && (
                      <span className="font-serif italic text-xl sm:text-2xl ml-1" style={{ color: BRONZE }}>
                        {s.suffix}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] leading-snug" style={{ color: "rgba(12,45,82,0.45)" }}>
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-20 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-px" style={{ backgroundColor: RULE }} />
                <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                  {lang === "fr" ? "Prêt à rejoindre ?" : "Ready to join?"}
                </span>
                <span className="w-10 h-px" style={{ backgroundColor: RULE }} />
              </div>
              <Link
                to="/inscription"
                data-testid="about-register-button"
                className="group inline-flex items-center gap-3 px-9 sm:px-11 py-4 text-[13px] sm:text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                {t("nav.register")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}