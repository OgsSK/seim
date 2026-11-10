import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { Reveal, Stagger, StaggerItem, CountUp } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { EditorialIllustration } from "../components/EditorialIllustration";
import { SpeakerModal } from "../components/SpeakerModal";

/* Palette éditoriale premium — charte SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const GOLD = "#F7B731";
const CREAM = "#F2F4F6";
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.15)";
const EASE = [0.22, 1, 0.36, 1];

const getImg = (sp) => sp?.image || sp?.photo || sp?.avatar || null;
const getRole = (sp, lang) =>
  (lang === "fr" ? sp?.role_fr : sp?.role_en) || sp?.role || "";

/* ============================================================
   Hook partagé — compte à rebours (Hero + CountdownSection)
   ============================================================ */
function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

/* ============================================================
   HeroBackdrop — grille perspective + anneaux orbitaux
   ============================================================ */
function HeroBackdrop() {
  return (
    <>
      {/* Grille perspective — converge vers le haut */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[55%] w-full pointer-events-none"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grid-fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="60%" stopColor={GOLD} stopOpacity="0.08" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Lignes verticales qui convergent vers le centre */}
        {Array.from({ length: 21 }).map((_, i) => {
          const xBottom = (i / 20) * 800;
          const xTop = 400 + (xBottom - 400) * 0.15;
          return (
            <line
              key={`v-${i}`}
              x1={xTop}
              y1={0}
              x2={xBottom}
              y2={400}
              stroke="url(#grid-fade)"
              strokeWidth="0.8"
            />
          );
        })}
        {/* Lignes horizontales — perspective densifiée */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = Math.pow(i / 8, 1.6) * 400;
          return (
            <line
              key={`h-${i}`}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="url(#grid-fade)"
              strokeWidth="0.6"
            />
          );
        })}
      </svg>

      {/* Anneaux orbitaux — desktop uniquement pour ne pas surcharger mobile */}
      <motion.svg
        viewBox="0 0 600 600"
        className="absolute -right-32 top-1/4 w-[520px] h-[520px] pointer-events-none opacity-60 hidden lg:block"
        aria-hidden="true"
      >
        {/* Anneau externe */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 300px" }}
        >
          <circle
            cx="300"
            cy="300"
            r="250"
            stroke={GOLD}
            strokeWidth="0.6"
            fill="none"
            strokeDasharray="2 10"
            opacity="0.5"
          />
          <circle cx="300" cy="50" r="3.5" fill={GOLD} />
        </motion.g>

        {/* Anneau intermédiaire */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 300px" }}
        >
          <circle
            cx="300"
            cy="300"
            r="180"
            stroke={BRONZE}
            strokeWidth="0.7"
            fill="none"
            opacity="0.5"
          />
          <circle cx="300" cy="120" r="2.5" fill={GOLD} opacity="0.7" />
        </motion.g>

        {/* Anneau interne — pulsation */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 300px" }}
        >
          <circle
            cx="300"
            cy="300"
            r="110"
            stroke={GOLD}
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="1 5"
            opacity="0.6"
          />
        </motion.g>

        {/* Centre lumineux */}
        <circle cx="300" cy="300" r="55" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.3" />
        <motion.circle
          cx="300"
          cy="300"
          r="3"
          fill={GOLD}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Crosshairs coins techniques */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-24 sm:top-28 left-4 sm:left-8 w-5 h-5 border-t border-l"
          style={{ borderColor: GOLD, opacity: 0.35 }}
        />
        <div
          className="absolute top-24 sm:top-28 right-4 sm:right-8 w-5 h-5 border-t border-r"
          style={{ borderColor: GOLD, opacity: 0.35 }}
        />
        <div
          className="absolute bottom-8 left-4 sm:left-8 w-5 h-5 border-b border-l"
          style={{ borderColor: GOLD, opacity: 0.35 }}
        />
        <div
          className="absolute bottom-8 right-4 sm:right-8 w-5 h-5 border-b border-r"
          style={{ borderColor: GOLD, opacity: 0.35 }}
        />
      </div>
    </>
  );
}

/* ============================================================
   MiniCountdown — compte à rebours inline dans le Hero
   ============================================================ */
function MiniCountdown({ d, h, m, s, label }) {
  const units = [
    { v: d, l: "J" },
    { v: h, l: "H" },
    { v: m, l: "M" },
    { v: s, l: "S" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-white/40">
        {label}
      </span>
      <div className="flex items-baseline gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span
              className="font-mono-num text-xl sm:text-2xl font-light tabular-nums leading-none"
              style={{ color: GOLD, textShadow: "0 0 20px rgba(247,183,49,0.35)" }}
            >
              {String(u.v).padStart(2, "0")}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-white/45">
              {u.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Hero — cockpit futuriste
   ============================================================ */
function Hero() {
  const { t, lang } = useLanguage();
  const target = new Date(EVENT.startDateISO).getTime();
  const { d, h, m, s } = useCountdown(target);

  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden"
      style={{
        backgroundColor: INK,
        color: CREAM,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* ===== Couche 1 : photo de fond ===== */}
      <div className="absolute inset-0 opacity-[0.35] sm:opacity-[0.25] pointer-events-none">
        <SmartImg
          src="/assets/seim/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center grayscale-[0.3]"
        />
      </div>

      {/* ===== Couche 2 : gradient encre ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(12,45,82,0.88) 0%, rgba(12,45,82,0.55) 35%, rgba(12,45,82,0.75) 80%, rgba(12,45,82,0.95) 100%)`,
        }}
      />

      {/* ===== Couche 3 : grille technique globale ===== */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${BRONZE} 1px, transparent 1px), linear-gradient(90deg, ${BRONZE} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* ===== Couche 4 : backdrop futuriste ===== */}
      <HeroBackdrop />

      {/* ===== Couche 5 : vignette ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: `inset 0 0 180px 40px rgba(12,45,82,0.85)` }}
      />

      {/* ===== Contenu ===== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-12 sm:pb-20">

        {/* STATUS BAR top */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex items-center justify-between gap-3 pb-4 mb-10 sm:mb-16 border-b"
          style={{ borderColor: RULE_INK }}
        >
          {/* Live status */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F7B731] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F7B731]" />
            </span>
            <span
              className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Live · SEIM / 2026
            </span>
          </div>

          {/* Lieu */}
          <span className="hidden sm:inline text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/45">
            {lang === "fr" ? EVENT.venue_fr : EVENT.venue_en}
          </span>

          {/* Édition */}
          <span className="font-mono-num text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/55">
            Édition 02
          </span>
        </motion.div>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-9 xl:col-span-8 relative z-10">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="inline-flex items-center gap-2 text-[9px] sm:text-[11px] uppercase tracking-[0.25em] mb-5 sm:mb-7 backdrop-blur-[2px]"
              style={{ color: GOLD }}
            >
              <span className="w-6 sm:w-8 h-px" style={{ backgroundColor: GOLD }} />
              {t("hero.eyebrow")}
            </motion.p>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
              className="font-serif leading-[1.02] sm:leading-[0.98] tracking-[-0.03em] text-[2.5rem] min-[380px]:text-[3rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5rem] max-w-4xl"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}
            >
              <span className="block">{t("hero.line1")}</span>
              <span className="block">{t("hero.line2")}</span>
              <span
                className="block italic"
                style={{
                  color: GOLD,
                  textShadow: "0 0 40px rgba(247,183,49,0.35)",
                }}
              >
                {t("hero.line3")}
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
              className="mt-5 sm:mt-8 text-[14px] sm:text-[17px] text-white/80 max-w-2xl leading-[1.7] sm:leading-[1.8]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5"
            >
              <Link
                to="/inscription"
                data-testid="hero-register-button"
                className="group inline-flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-7 py-3.5 sm:py-4 text-[13px] sm:text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-black/30"
                style={{
                  backgroundColor: GOLD,
                  color: INK,
                  boxShadow: "0 10px 40px -10px rgba(247,183,49,0.5)",
                }}
              >
                {t("hero.cta1")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/programme"
                data-testid="hero-program-button"
                className="group inline-flex justify-center items-center gap-2 px-5 py-3.5 sm:py-4 border text-[13px] sm:text-sm tracking-wide transition-colors hover:bg-white/15 backdrop-blur-md bg-white/5"
                style={{ borderColor: "rgba(242,244,246,0.35)", color: CREAM }}
              >
                {t("hero.cta2")}
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>

          {/* Panneau d'infos — côté droit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.5, ease: EASE }}
            className="lg:col-span-3 xl:col-span-4 relative z-10 mt-8 lg:mt-0"
          >
            <div
              className="border-t sm:border-t-0 sm:border-l pt-5 sm:pt-0 sm:pl-6 flex flex-col gap-4 sm:gap-5"
              style={{ borderColor: RULE_INK }}
            >
              <div className="flex items-start gap-2.5">
                <CalendarDays size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-white/45 mb-1">
                    {lang === "fr" ? "Dates" : "Dates"}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-white/90 leading-snug">
                    {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-white/45 mb-1">
                    {lang === "fr" ? "Lieu" : "Venue"}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-white/90 leading-snug">
                    CICB · Bamako
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bandeau bas : Mini countdown + status code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mt-12 sm:mt-16 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          style={{ borderColor: RULE_INK }}
        >
          <MiniCountdown
            d={d}
            h={h}
            m={m}
            s={s}
            label={t("hero.countdownLabel")}
          />
          <p className="font-mono-num text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-white/30">
            // Signal: stable · Lat 12.6392°N · Lon 8.0029°W
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   CountdownSection — version monumentale (harmonisée)
   ============================================================ */
function CountdownSection() {
  const { t, lang } = useLanguage();
  const target = new Date(EVENT.startDateISO).getTime();
  const { d, h, m, s } = useCountdown(target);

  return (
    <section
      className="relative py-16 sm:py-24 border-b overflow-hidden"
      style={{ backgroundColor: INK, color: CREAM, borderColor: RULE_INK }}
    >
      {/* Photo de fond subtile */}
      <div className="absolute inset-0 opacity-[0.35] sm:opacity-[0.2] pointer-events-none">
        <SmartImg
          src="/assets/seim/stage-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center grayscale"
        />
      </div>

      {/* Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(12,45,82,0.9) 0%, rgba(12,45,82,0.5) 50%, rgba(12,45,82,0.9) 100%)`,
        }}
      />

      {/* Grille technique */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Eyebrow global */}
        <div className="flex items-center gap-3 mb-10 sm:mb-14">
          <span className="w-8 sm:w-12 h-px" style={{ backgroundColor: GOLD }} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            {t("hero.countdownLabel")}
          </span>
        </div>

        {/* SPLIT : J-XXX monumental (gauche) + ledger vertical (droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          
          {/* Colonne gauche — Jour J */}
          <Reveal className="lg:col-span-7">
            <div className="flex flex-col">
              {/* Mention J-XXX */}
              <p
                className="font-mono-num text-[11px] sm:text-[12px] uppercase tracking-[0.28em] mb-3"
                style={{ color: GOLD }}
              >
                J&nbsp;−&nbsp;{String(d).padStart(3, "0")}
              </p>

              {/* Chiffre monumental */}
              <div className="flex items-baseline">
                <span
                  className="font-serif font-light text-[6rem] sm:text-[9rem] lg:text-[11rem] leading-[0.85] tracking-[-0.05em] tabular-nums"
                  style={{
                    color: CREAM,
                    textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {String(d).padStart(2, "0")}
                </span>
                <span
                  className="font-serif italic text-3xl sm:text-4xl lg:text-5xl ml-2 sm:ml-4"
                  style={{ color: GOLD }}
                >
                  jours
                </span>
              </div>

              {/* Ligne titre serif */}
              <p
                className="font-serif text-xl sm:text-3xl lg:text-4xl leading-[1.15] mt-6 sm:mt-8 max-w-md"
                style={{ color: "rgba(242,244,246,0.7)" }}
              >
                {lang === "fr"
                  ? "avant l'ouverture officielle du forum."
                  : "before the official opening of the forum."}
              </p>
            </div>
          </Reveal>

          {/* Colonne droite — Ledger vertical H/M/S */}
          <Reveal delay={0.15} className="lg:col-span-5">
            <div
              className="border-t sm:border-t-0 sm:border-l pt-6 sm:pt-0 sm:pl-8 flex flex-col gap-0"
              style={{ borderColor: RULE_INK }}
            >
              {[
                { v: h, l: lang === "fr" ? "Heures" : "Hours", raw: "heures" },
                { v: m, l: lang === "fr" ? "Minutes" : "Minutes", raw: "minutes" },
                { v: s, l: lang === "fr" ? "Secondes" : "Seconds", raw: "secondes" },
              ].map((u, i) => (
                <div
                  key={i}
                  className={`flex items-baseline justify-between gap-4 py-4 sm:py-5 ${
                    i !== 0 ? "border-t" : ""
                  }`}
                  style={{ borderColor: RULE_INK }}
                >
                  {/* Label */}
                  <span
                    className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.24em] whitespace-nowrap"
                    style={{ color: GOLD }}
                  >
                    {u.l}
                  </span>

                  {/* Chiffre */}
                  <span
                    className="font-serif font-light text-3xl sm:text-5xl lg:text-6xl leading-none tracking-[-0.03em] tabular-nums"
                    style={{
                      color: CREAM,
                      textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {String(u.v).padStart(2, "0")}
                  </span>
                </div>
              ))}

              {/* Mention lat/lon en pied */}
              <div
                className="mt-4 pt-4 border-t flex items-center justify-between gap-3"
                style={{ borderColor: RULE_INK }}
              >
                <span
                  className="font-mono-num text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/30"
                >
                  CICB · Bamako
                </span>
                <span
                  className="font-mono-num text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/30"
                >
                  T-minus active
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Partners
   ============================================================ */
function PartnersStrip({ partners }) {
  const { lang } = useLanguage();
  if (!partners || partners.length === 0) return null;

  return (
    <section
      data-testid="partners-strip"
      className="py-8 sm:py-12 border-y"
      style={{ backgroundColor: PAPER, borderColor: RULE }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#0C2D52]/40 whitespace-nowrap text-center sm:text-left">
          {lang === "fr" ? "Avec le soutien de" : "With the support of"}
        </p>
        <div className="hidden sm:block flex-1 h-px" style={{ backgroundColor: RULE }} />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {partners.slice(0, 6).map((p, i) => (
            <span key={p.id || i} className="text-[11px] sm:text-[13px] tracking-wide text-[#0C2D52]/55">
              {p.name}
            </span>
          ))}
          {partners.length > 6 && (
            <span className="text-[10px] font-mono-num text-[#B57A0A]">
              +{partners.length - 6}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Retrospective
   ============================================================ */
function Retrospective() {
  const { lang } = useLanguage();

  const copy = {
    fr: {
      eyebrow: "Rétrospective",
      title: "La première édition en images.",
      subtitle: "Deux jours d'échanges, de rencontres et d'idées au CICB de Bamako.",
      caption: "CICB · Bamako — Édition 2026",
    },
    en: {
      eyebrow: "Retrospective",
      title: "The first edition in images.",
      subtitle: "Two days of exchanges, encounters and ideas at the CICB in Bamako.",
      caption: "CICB · Bamako — 2026 Edition",
    },
  }[lang];

  const photos = [
    {
      src: "/assets/seim/retro-1.jpg",
      caption: lang === "fr" ? "Session plénière d'ouverture" : "Opening plenary",
      span: "md:col-span-2 md:row-span-2",
    },
    { src: "/assets/seim/retro-2.jpg", caption: lang === "fr" ? "Panel sur l'épargne" : "Savings panel" },
    { src: "/assets/seim/retro-3.jpg", caption: lang === "fr" ? "Échanges" : "Networking" },
    { src: "/assets/seim/retro-4.jpg", caption: lang === "fr" ? "Masterclass" : "Masterclass" },
    { src: "/assets/seim/retro-5.jpg", caption: lang === "fr" ? "Intervenants" : "Speakers" },
    {
      src: "/assets/seim/retro-6.jpg",
      caption: lang === "fr" ? "Public en salle" : "Audience",
      span: "md:col-span-2",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t" style={{ backgroundColor: PAPER, borderColor: RULE }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap" style={{ color: BRONZE }}>
                {copy.eyebrow}
              </span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {copy.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[13px] sm:text-[15px] leading-[1.7] text-[#0C2D52]/60">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <div className="md:hidden grid grid-cols-2 gap-2">
          {photos.map((p, i) => {
            const isWide = i === 0 || i === 5;
            return (
              <div
                key={i}
                className={`relative overflow-hidden ${isWide ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <SmartImg
                  src={p.src}
                  alt={p.caption}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/90 line-clamp-1">
                    {p.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((p, i) => (
            <div key={i} className={`group relative overflow-hidden ${p.span || ""}`}>
              <SmartImg
                src={p.src}
                alt={p.caption}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/90">
                  {p.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] sm:text-[11px] italic font-serif text-right" style={{ color: "rgba(12,45,82,0.45)" }}>
          {copy.caption}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Why attend
   ============================================================ */
function WhyAttend() {
  const { lang } = useLanguage();
  const copy = lang === "fr" ? {
    eyebrow: "Pourquoi participer",
    title: "Faire des rencontres. Ouvrir des perspectives. Concrétiser des projets.",
    intro: "Le SEIM crée un cadre de dialogue entre les acteurs qui font avancer l’économie et ceux qui peuvent contribuer à son financement.",
    items: [
      { n: "01", title: "Rencontrer des investisseurs", desc: "Présentez vos ambitions et échangez avec des acteurs du financement.", icon: "target" },
      { n: "02", title: "Développer son réseau", desc: "Créez des liens avec des entrepreneurs, dirigeants et partenaires.", icon: "network" },
      { n: "03", title: "Identifier des opportunités", desc: "Explorez des secteurs porteurs, des projets et des pistes de collaboration.", icon: "growth" },
      { n: "04", title: "Faire avancer ses projets", desc: "Transformez les échanges en contacts utiles et en prochaines étapes concrètes.", icon: "sprout" },
    ],
  } : {
    eyebrow: "Why attend",
    title: "Meet the right people. Open new perspectives. Move projects forward.",
    intro: "SEIM creates a space for dialogue between the people driving economic growth and those able to support it through investment.",
    items: [
      { n: "01", title: "Meet investors", desc: "Present your ambitions and connect with financing stakeholders.", icon: "target" },
      { n: "02", title: "Expand your network", desc: "Build relationships with entrepreneurs, executives and partners.", icon: "network" },
      { n: "03", title: "Identify opportunities", desc: "Explore promising sectors, projects and potential collaborations.", icon: "growth" },
      { n: "04", title: "Move projects forward", desc: "Turn conversations into useful connections and concrete next steps.", icon: "sprout" },
    ],
  };

  return (
    <section className="py-12 sm:py-24 border-t" style={{ backgroundColor: PAPER, borderColor: RULE }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 mb-8 sm:mb-16">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: BRONZE }} />
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>{copy.eyebrow}</span>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.8rem] leading-[1.15] sm:leading-[1.1]" style={{ color: INK }}>{copy.title}</h2>
              <p className="mt-4 sm:mt-5 max-w-2xl text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] text-[#0C2D52]/60">{copy.intro}</p>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t" style={{ borderColor: RULE }}>
          {copy.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.06} className="h-full">
              <article className={`h-full py-6 sm:py-8 sm:px-6 ${i === 0 ? "lg:pl-0" : "lg:border-l"} border-b sm:border-b-0 flex flex-col`} style={{ borderColor: RULE }}>
                <div className="w-10 h-10 mb-4 sm:mb-5 opacity-80">
                  <EditorialIllustration variant={item.icon} className="w-full h-full" />
                </div>
                <p className="font-mono-num text-[10px] sm:text-[11px] tracking-[0.2em] mb-2" style={{ color: BRONZE }}>{item.n}</p>
                <h3 className="font-serif text-lg sm:text-[1.35rem] leading-tight mb-2 sm:mb-3" style={{ color: INK }}>{item.title}</h3>
                <p className="text-[12px] sm:text-[13px] leading-[1.65] sm:leading-[1.75] text-[#0C2D52]/55 flex-1">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Audience
   ============================================================ */
function Audience() {
  const { lang } = useLanguage();
  const copy = lang === "fr" ? {
    eyebrow: "Un sommet pour les acteurs du changement",
    title: "À qui s’adresse le SEIM ?",
    intro: "Un rendez-vous pour celles et ceux qui souhaitent contribuer au développement économique, porter des projets ou créer des passerelles.",
    items: [
      { n: "01", title: "Investisseurs", desc: "Repérez des opportunités, rencontrez des porteurs de projets et développez votre réseau.", icon: "target" },
      { n: "02", title: "Entrepreneurs", desc: "Présentez votre vision, partagez vos besoins et explorez des pistes de financement.", icon: "sprout" },
      { n: "03", title: "Entreprises", desc: "Identifiez de nouveaux marchés, des partenaires stratégiques et des leviers de croissance.", icon: "arch" },
      { n: "04", title: "Institutions", desc: "Échangez autour des enjeux économiques et contribuez à faire émerger des initiatives.", icon: "globe" },
    ],
    caption: "Public du SEIM — CICB, Bamako · Édition 2026",
  } : {
    eyebrow: "A summit for people driving change",
    title: "Who is SEIM for?",
    intro: "A meeting point for those looking to support economic development, build projects or connect capital with opportunities.",
    items: [
      { n: "01", title: "Investors", desc: "Discover opportunities, meet project owners and expand your network.", icon: "target" },
      { n: "02", title: "Entrepreneurs", desc: "Present your vision, share your needs and explore funding opportunities.", icon: "sprout" },
      { n: "03", title: "Companies", desc: "Identify new markets, strategic partners and growth opportunities.", icon: "arch" },
      { n: "04", title: "Institutions", desc: "Discuss economic priorities and help bring meaningful initiatives to life.", icon: "globe" },
    ],
    caption: "SEIM audience — CICB, Bamako · 2026 Edition",
  };

  return (
    <section className="py-12 sm:py-24" style={{ backgroundColor: "#E3E8ED", color: INK }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl mb-6 sm:mb-10">
          <Reveal>
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em] mb-3 sm:mb-5" style={{ color: BRONZE }}>{copy.eyebrow}</p>
            <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.8rem] leading-[1.15] sm:leading-[1.1]">{copy.title}</h2>
            <p className="mt-4 sm:mt-5 text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] text-[#0C2D52]/60">{copy.intro}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden shadow-sm mb-8 sm:mb-10">
            <SmartImg
              src="/assets/seim/audience-band.jpg"
              alt={copy.caption}
              className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-white/90">
                {copy.caption}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {copy.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.06}>
              <article className="h-full min-h-[200px] sm:min-h-[240px] p-5 sm:p-7 border bg-[#F2F4F6] flex flex-col" style={{ borderColor: RULE }}>
                <div className="w-10 h-10 mb-4 opacity-80">
                  <EditorialIllustration variant={item.icon} className="w-full h-full" />
                </div>
                <p className="font-mono-num text-[10px] sm:text-[11px] tracking-[0.2em] mb-2 sm:mb-3" style={{ color: BRONZE }}>{item.n}</p>
                <h3 className="font-serif text-lg sm:text-xl leading-tight mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-[12px] sm:text-[13px] leading-[1.65] sm:leading-[1.75] text-[#0C2D52]/55 flex-1">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Executive Summary
   ============================================================ */
function ExecutiveSummary() {
  const { t, lang } = useLanguage();
  const items = t("stats.items") || [];
  if (items.length === 0) return null;

  const hero = items[0];
  const rest = items.slice(1, 5);

  return (
    <section
      data-testid="stats-section"
      className="py-12 sm:py-20 lg:py-24 border-t relative overflow-hidden"
      style={{ backgroundColor: PAPER, borderColor: RULE }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-baseline gap-3">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap" style={{ color: BRONZE }}>
              {t("stats.eyebrow")}
            </span>
            <span className="w-8 sm:w-12 h-px" style={{ backgroundColor: RULE }} />
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#0C2D52]/35 whitespace-nowrap hidden sm:block">
            {lang === "fr" ? "Données officielles" : "Official data"}
          </span>
        </div>

        <h2 className="font-serif tracking-[-0.02em] text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.15] mb-8 sm:mb-10 max-w-2xl" style={{ color: INK }}>
          {t("stats.title")}
        </h2>

        <Reveal>
          <div className="relative overflow-hidden shadow-lg">
            <SmartImg
              src="/assets/seim/keynote-closeup.jpg"
              alt={lang === "fr" ? "Keynote d'ouverture" : "Opening keynote"}
              className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] object-cover grayscale-[0.1]"
            />
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "50%",
                background: `linear-gradient(to top, rgba(12,45,82,0.9) 0%, rgba(12,45,82,0.6) 40%, transparent 100%)`,
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-light tracking-[-0.05em] text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] leading-none"
                    style={{ color: CREAM }}
                  >
                    <CountUp value={hero.value} />
                  </span>
                  {hero.suffix && (
                    <span
                      className="font-serif italic text-xl sm:text-2xl lg:text-3xl"
                      style={{ color: BRONZE }}
                    >
                      {hero.suffix}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
                  {hero.label}
                </p>
              </div>
              <p className="text-[9px] sm:text-[10px] italic font-serif leading-relaxed max-w-xs sm:text-right" style={{ color: "rgba(242,244,246,0.7)" }}>
                {lang === "fr"
                  ? "Keynote d'ouverture — CICB, Bamako · Édition 2026"
                  : "Opening keynote — CICB, Bamako · 2026 Edition"}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 sm:mt-10 border-y py-5 sm:py-6" style={{ borderColor: RULE }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
              {rest.map((item, i) => (
                <div
                  key={i}
                  data-testid={`stat-item-${i + 1}`}
                  className={`${i !== 0 ? "border-l" : ""} ${i % 2 === 1 ? "pl-3 sm:pl-5" : "pr-3 sm:pr-5"}`}
                  style={{ borderColor: RULE }}
                >
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="font-light tracking-[-0.02em] text-lg sm:text-xl lg:text-2xl leading-none"
                      style={{ color: INK }}
                    >
                      <CountUp value={item.value} />
                    </span>
                    {item.suffix && (
                      <span className="font-serif italic text-xs sm:text-sm" style={{ color: BRONZE }}>
                        {item.suffix}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#0C2D52]/45 leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-5 flex justify-between items-center">
            <p className="text-[9px] sm:text-[10px] italic font-serif text-[#0C2D52]/40">
              {lang === "fr" ? "Source : organisation SEIM" : "Source: SEIM organization"}
            </p>
            <Link to="/a-propos" className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: INK }}>
              <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
                {lang === "fr" ? "Méthodologie" : "Methodology"}
              </span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Program
   ============================================================ */
function Program() {
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    api.program().then(setSessions).catch(() => {});
    api.speakers().then(setSpeakers).catch(() => {});
  }, []);

  const spMap = Object.fromEntries(speakers.map((s) => [s.id, s]));
  const items = sessions
    .filter((s) => ["keynote", "panel", "masterclass"].includes(s.type))
    .slice(0, 4);

  if (items.length === 0) return null;

  const featured = items[0];
  const rest = items.slice(1);
  const featSpeakers = (featured.speakers || [])
    .map((id) => spMap[id])
    .filter(Boolean)
    .slice(0, 2);

  const getIconVariant = (type) => {
    if (type === "keynote") return "keynote";
    if (type === "masterclass") return "masterclass";
    return "panel";
  };

  return (
    <section data-testid="program-preview-section" className="py-12 sm:py-24 lg:py-32 border-t" style={{ backgroundColor: PAPER, borderColor: RULE }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5 mb-6 sm:mb-16">
          <div>
            <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap" style={{ color: BRONZE }}>
                {t("program.eyebrow")}
              </span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {t("program.previewTitle")}
            </h2>
          </div>
          <Link to="/programme" className="group inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium shrink-0 mt-2 sm:mt-0" style={{ color: INK }}>
            <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>{t("program.viewFull")}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div data-testid={`highlight-session-${featured.id}`} className="lg:col-span-6">
            <div className="overflow-hidden mb-3 sm:mb-5 shadow-sm">
              <SmartImg
                src="/assets/seim/featured-session.jpg"
                alt={lang === "fr" ? featured.title_fr : featured.title_en}
                className="w-full aspect-[16/9] sm:aspect-[16/10] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="pt-3 sm:pt-4 border-t-2" style={{ borderColor: BRONZE }}>
              <div className="flex items-center justify-between gap-3 mb-2 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 opacity-80">
                    <EditorialIllustration variant={getIconVariant(featured.type)} className="w-full h-full" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.24em]" style={{ color: BRONZE }}>
                    {t(`program.types.${featured.type}`)}
                  </span>
                </div>
                <span className="font-mono-num text-[9px] sm:text-[11px] tracking-[0.15em] text-[#0C2D52]/45">
                  J{featured.day} · {featured.time}
                </span>
              </div>

              <h3 className="font-serif tracking-[-0.02em] text-lg sm:text-3xl lg:text-[2.2rem] leading-[1.2] sm:leading-[1.15] break-words" style={{ color: INK }}>
                {lang === "fr" ? featured.title_fr : featured.title_en}
              </h3>

              <p className="mt-2 sm:mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-[13px] text-[#0C2D52]/50">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={11} className="sm:w-[13px] sm:h-[13px] shrink-0" style={{ color: BRONZE }} />
                  {lang === "fr" ? featured.room_fr : featured.room_en}
                </span>
                {featSpeakers.length > 0 && (
                  <>
                    <span className="hidden sm:inline-block w-1 h-1 rounded-full" style={{ backgroundColor: BRONZE }} />
                    <span className="sm:hidden">·</span>
                    <span className="text-[#0C2D52]/60">
                      {featSpeakers.map(sp => sp.name).join(" · ")}
                    </span>
                  </>
                )}
              </p>

              {featSpeakers.length > 0 && (
                <div className="hidden sm:block mt-8 pt-6 border-t" style={{ borderColor: RULE }}>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#0C2D52]/40 mb-3">
                    {lang === "fr" ? "Avec" : "With"}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {featSpeakers.map((sp) => (
                      <div key={sp.id} className="flex items-center gap-2">
                        {getImg(sp) ? (
                          <img src={getImg(sp)} alt={sp.name} className="w-7 h-7 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                        ) : (
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: INK, color: GOLD }}>
                            {sp.name?.[0]}
                          </span>
                        )}
                        <span className="text-[13px] text-[#0C2D52]/75">{sp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 mt-5 sm:mt-8 lg:mt-0 relative">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-[rgba(12,45,82,0.1)] hidden sm:block" />
            {rest.map((s) => (
              <div
                key={s.id}
                data-testid={`highlight-session-${s.id}`}
                className="py-3 sm:py-6 border-b last:border-0 relative flex gap-3 sm:gap-6"
                style={{ borderColor: RULE }}
              >
                <div className="hidden sm:flex flex-col items-center shrink-0 w-6 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full border-2 bg-[#F2F4F6] mt-2" style={{ borderColor: BRONZE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 opacity-70">
                        <EditorialIllustration variant={getIconVariant(s.type)} className="w-full h-full" />
                      </div>
                      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em]" style={{ color: BRONZE }}>
                        {t(`program.types.${s.type}`)}
                      </span>
                    </div>
                    <span className="font-mono-num text-[9px] sm:text-[11px] tracking-[0.15em] text-[#0C2D52]/40 shrink-0">
                      J{s.day} · {s.time}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-xl leading-snug tracking-tight break-words" style={{ color: INK }}>
                    {lang === "fr" ? s.title_fr : s.title_en}
                  </h4>
                  <p className="mt-1 sm:mt-1.5 flex items-center gap-1 text-[10px] sm:text-[12px] text-[#0C2D52]/45">
                    <MapPin size={9} className="sm:w-[10px] sm:h-[10px]" />
                    <span className="break-words">{lang === "fr" ? s.room_fr : s.room_en}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Voices
   ============================================================ */
function Voices({ speakers }) {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState(null);
  if (!speakers || speakers.length === 0) return null;

  const displaySpeakers = speakers.slice(0, 4);
  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <section data-testid="speakers-preview-section" className="py-12 sm:py-24 lg:py-32 border-t" style={{ backgroundColor: PAPER, borderColor: RULE }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5 mb-6 sm:mb-10">
          <div>
            <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap" style={{ color: BRONZE }}>{t("speakers.eyebrow")}</span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {t("speakers.previewTitle")}
            </h2>
          </div>
          <Link to="/intervenants" className="group inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium shrink-0 mt-2 sm:mt-0" style={{ color: INK }}>
            <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>{t("common.viewAll")}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
          </Link>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden shadow-sm mb-6 sm:mb-8">
            <SmartImg
              src="/assets/seim/speakers-stage.jpg"
              alt={lang === "fr" ? "Intervenants sur scène" : "Speakers on stage"}
              className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-white/90">
                {lang === "fr"
                  ? "Panel d'ouverture — CICB, Bamako · Édition 2026"
                  : "Opening panel — CICB, Bamako · 2026 Edition"}
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-2 border-t border-l" style={{ borderColor: RULE }}>
          {displaySpeakers.map((sp) => (
            <StaggerItem key={sp.id}>
              <button
                type="button"
                onClick={() => setSelected(sp)}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 p-3 sm:p-8 border-b border-r w-full h-full text-left transition-colors hover:bg-[#E3E8ED]/50"
                style={{ borderColor: RULE }}
              >
                <div className="w-full h-16 sm:w-20 sm:h-24 md:w-24 md:h-32 shrink-0 border flex items-center justify-center bg-[#F2F4F6]" style={{ borderColor: RULE }}>
                  <span className="font-serif text-xl sm:text-3xl md:text-4xl text-[#B57A0A]">{getInitials(sp.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 line-clamp-2" style={{ color: BRONZE }}>
                    {getRole(sp, lang)}
                  </p>
                  <h3 className="font-serif text-sm sm:text-xl leading-tight tracking-tight mb-0.5 sm:mb-1.5" style={{ color: INK }}>
                    {sp.name}
                  </h3>
                  {sp.company && (
                    <p className="text-[9px] sm:text-[12px] text-[#0C2D52]/50 italic font-serif line-clamp-1">
                      {sp.company}
                    </p>
                  )}
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ============================================================
   Conviction
   ============================================================ */
function Conviction() {
  const { t, lang } = useLanguage();
  const pillars = t("about.pillars") || [];

  const copy = {
    fr: {
      eyebrow: "Notre conviction",
      title: "L'Afrique n'a pas besoin qu'on lui explique son potentiel. Elle a besoin qu'on y investisse.",
      body: "SEIM réunit entrepreneurs, investisseurs, régulateurs et institutions autour d'une même exigence : transformer les intentions en engagements, et les engagements en projets.",
      sign: "Semaine de l'Économie et de l'Innovation — Bamako",
    },
    en: {
      eyebrow: "Our conviction",
      title: "Africa does not need its potential explained. It needs capital committed.",
      body: "SEIM brings together entrepreneurs, investors, regulators and institutions around one requirement: turn intentions into commitments, and commitments into projects.",
      sign: "Week of Economy and Innovation — Bamako",
    },
  }[lang];

  return (
    <section className="py-16 sm:py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: INK, color: CREAM }}>
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <SmartImg src="/assets/seim/ambiance.jpg" alt="" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${INK} 0%, rgba(12,45,82,0.4) 30%, rgba(12,45,82,0.4) 70%, ${INK} 100%)` }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] opacity-10 pointer-events-none -mt-20 -mr-20">
        <EditorialIllustration variant="network" className="w-full h-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: GOLD }} />
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>{copy.eyebrow}</span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="font-serif tracking-[-0.02em] text-xl sm:text-3xl lg:text-[2.5rem] xl:text-[2.8rem] leading-[1.2] sm:leading-[1.15] break-words">
                <span style={{ color: GOLD }}>«&nbsp;</span>
                {copy.title}
                <span style={{ color: GOLD }}>&nbsp;»</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 sm:mt-10 text-[13px] sm:text-[16px] text-[#F2F4F6]/70 max-w-2xl leading-[1.7] sm:leading-[1.8]">{copy.body}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 sm:mt-10 flex items-center gap-3">
                <span className="w-5 sm:w-6 h-px" style={{ backgroundColor: RULE_INK }} />
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.24em] text-[#F2F4F6]/40">{copy.sign}</span>
              </div>
            </Reveal>
          </div>
        </div>

        {pillars.length > 0 && (
          <div className="mt-12 sm:mt-24 pt-8 sm:pt-10 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10" style={{ borderColor: RULE_INK }}>
            {pillars.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div>
                  <p className="font-mono-num text-[10px] sm:text-[11px] tracking-[0.2em] mb-2 sm:mb-3" style={{ color: GOLD }}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-serif text-base sm:text-lg leading-tight mb-1.5 sm:mb-2">{p.title}</h3>
                  <p className="text-[11px] sm:text-[13px] text-[#F2F4F6]/60 leading-[1.6] sm:leading-[1.65]">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
function CtaBand() {
  const { t, lang } = useLanguage();
  return (
    <section data-testid="cta-band" className="py-16 sm:py-32 lg:py-40 border-t relative overflow-hidden" style={{ backgroundColor: PAPER, borderColor: RULE }}>
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <SmartImg src="/assets/seim/cicb.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] opacity-[0.05] pointer-events-none -mb-10 -mr-10">
        <EditorialIllustration variant="seal" className="w-full h-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-8">
            <span className="w-6 sm:w-10 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
              {lang === "fr" ? "Inscription · Places limitées" : "Registration · Limited seats"}
            </span>
            <span className="w-6 sm:w-10 h-px" style={{ backgroundColor: RULE }} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-5xl lg:text-[3.4rem] leading-[1.15] sm:leading-[1.05] break-words" style={{ color: INK }}>
            {t("cta.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-4 sm:mt-7 text-[13px] sm:text-[16px] text-[#0C2D52]/70 max-w-xl mx-auto leading-[1.7] sm:leading-[1.75]">{t("cta.subtitle")}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 sm:mt-12 flex items-center justify-center">
            <Link to="/inscription" data-testid="cta-register-button" className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-8 sm:px-11 py-3.5 sm:py-4 text-[12px] sm:text-sm font-medium tracking-wide transition-opacity hover:opacity-90" style={{ backgroundColor: INK, color: CREAM }}>
              {t("cta.button")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 sm:mt-10 font-mono-num text-[9px] sm:text-[11px] uppercase tracking-[0.22em] text-[#0C2D52]/50">
            {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}{" · "}CICB · Bamako
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   HOME
   ============================================================ */
export default function Home() {
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.speakers().then(setSpeakers).catch(() => {});
    api.partners().then(setPartners).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page" style={{ backgroundColor: PAPER, color: INK }} className="overflow-x-hidden w-full">
      <Hero />
      <CountdownSection />
      <PartnersStrip partners={partners} />
      <Retrospective />
      <WhyAttend />
      <Audience />
      <ExecutiveSummary />
      <Program />
      <Voices speakers={speakers} />
      <Conviction />
      <CtaBand />
    </div>
  );
}