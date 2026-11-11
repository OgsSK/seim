import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { Reveal, Stagger, StaggerItem, CountUp } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { EditorialIllustration } from "../components/EditorialIllustration";
import { SpeakerModal } from "../components/SpeakerModal";

/* Palette officielle SEIM (Charte Graphique) */
const PAPER = "#F2F4F6"; // Gris clair de la charte
const INK = "#0C2D52";   // Bleu foncé de la charte
const GOLD = "#F7B731";  // Jaune exact du logo
const BRONZE = "#D49B0F"; // Version assombrie du jaune pour lisibilité sur fond clair
const CREAM = "#F2F4F6";
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.15)";
const EASE = [0.22, 1, 0.36, 1];

const getImg = (sp) => sp?.image || sp?.photo || sp?.avatar || null;
const getRole = (sp, lang) =>
  (lang === "fr" ? sp?.role_fr : sp?.role_en) || sp?.role || "";

/* ============================================================
   Hook partagé — compte à rebours
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
   AnimatedNumber
   ============================================================ */
function AnimatedNumber({ value, className = "", style = {} }) {
  const formatted = String(value).padStart(2, "0");
  return (
    <span
      className={`relative inline-flex overflow-hidden ${className}`}
      style={style}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={formatted}
          initial={{ y: "85%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-85%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block tabular-nums"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ============================================================
   Hero — sobre et premium
   ============================================================ */
function Hero() {
  const { t, lang } = useLanguage();

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
      <div className="absolute inset-0 opacity-[0.35] sm:opacity-[0.28] pointer-events-none">
        <SmartImg
          src="/assets/seim/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center grayscale-[0.3]"
        />
      </div>

      {/* Overlay assombri pour une meilleure lisibilité du texte blanc (Feedback Word) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(12,45,82,0.95) 0%, rgba(12,45,82,0.75) 40%, rgba(12,45,82,0.95) 100%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: `inset 0 0 200px 60px rgba(12,45,82,0.9)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-20 sm:pt-32 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="hidden sm:flex items-center justify-between gap-4 pb-4 mb-16 border-b"
          style={{ borderColor: RULE_INK }}
        >
          <span
            className="font-mono-num text-[11px] tracking-[0.22em] uppercase"
            style={{ color: GOLD }}
          >
            SEIM <span className="opacity-50">/</span> 2026
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">
            {lang === "fr" ? EVENT.venue_fr : EVENT.venue_en}
          </span>
        </motion.div>

        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-6 sm:mb-8 font-bold"
            style={{ color: GOLD }}
          >
            <span className="w-8 h-px" style={{ backgroundColor: GOLD }} />
            {t("hero.eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
            className="font-serif font-extrabold leading-[1.02] tracking-[-0.03em] text-[2.5rem] min-[380px]:text-[3rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5rem]"
          >
            <span className="block">{t("hero.line1")}</span>
            <span className="block">{t("hero.line2")}</span>
            <span className="block italic" style={{ color: GOLD }}>
              {t("hero.line3")}
            </span>
          </motion.h1>

          {/* Sous-titre mis en gras (Feedback Word) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
            className="mt-6 sm:mt-8 text-[15px] sm:text-[18px] text-white font-semibold max-w-2xl leading-[1.6]"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <Link
              to="/inscription"
              data-testid="hero-register-button"
              className="group inline-flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-7 py-3.5 sm:py-4 text-[13px] sm:text-sm font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              {t("hero.cta1")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/programme"
              data-testid="hero-program-button"
              className="group inline-flex justify-center items-center gap-2 px-5 py-3.5 sm:py-4 border text-[13px] sm:text-sm font-bold tracking-wide transition-colors hover:bg-white/10 backdrop-blur-sm"
              style={{ borderColor: "rgba(242,244,246,0.4)", color: CREAM }}
            >
              {t("hero.cta2")}
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.55, ease: EASE }}
            className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row gap-6 sm:gap-12"
            style={{ borderColor: RULE_INK }}
          >
            <div className="flex items-start gap-3">
              <CalendarDays
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: GOLD }}
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 mb-1 font-semibold">
                  {lang === "fr" ? "Dates" : "Dates"}
                </p>
                <p className="text-[13px] sm:text-[14px] text-white font-bold">
                  {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 mb-1 font-semibold">
                  {lang === "fr" ? "Lieu" : "Venue"}
                </p>
                <p className="text-[13px] sm:text-[14px] text-white font-bold">
                  CICB · Bamako
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CountdownSection — ticket
   ============================================================ */
function CountdownSection() {
  const { t, lang } = useLanguage();
  const target = new Date(EVENT.startDateISO).getTime();
  const { d, h, m, s } = useCountdown(target);

  const TICKET_PAPER = "#F8F5EE";
  const TICKET_PAPER_DARK = "#EFEBE0";
  const TICKET_LINE = "rgba(12,45,82,0.18)";

  const copy = {
    fr: {
      sideLabel: "Compte à rebours",
      stubLabel: "Temps",
      days: "jours",
      narrative: "avant l'ouverture officielle du forum.",
      narrativeShort: "avant l'ouverture officielle.",
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
      access: "ACCÈS · Admit One",
    },
    en: {
      sideLabel: "Countdown",
      stubLabel: "Time",
      days: "days",
      narrative: "before the official opening of the forum.",
      narrativeShort: "before the official opening.",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      access: "ACCESS · Admit One",
    },
  }[lang];

  const barcode = [2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 1, 3];

  const notchStyle = {
    backgroundColor: INK,
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.35)",
  };

  return (
    <section
      className="relative py-14 sm:py-20 lg:py-24 border-b overflow-hidden"
      style={{ backgroundColor: INK, color: CREAM, borderColor: RULE_INK }}
    >
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <SmartImg
          src="/assets/seim/stage-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center grayscale"
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(12,45,82,0.92) 0%, rgba(12,45,82,0.75) 50%, rgba(12,45,82,0.95) 100%)`,
        }}
      />

      <div className="relative max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 lg:mb-14">
          <span className="w-6 sm:w-8 lg:w-12 h-px" style={{ backgroundColor: GOLD }} />
          <span
            className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-center font-bold"
            style={{ color: GOLD }}
          >
            {t("hero.countdownLabel")}
          </span>
          <span className="w-6 sm:w-8 lg:w-12 h-px" style={{ backgroundColor: GOLD }} />
        </div>

        <Reveal>
          {/* MOBILE / TABLETTE : ticket compact horizontal */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
                style={{ backgroundColor: TICKET_PAPER, color: INK }}
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 z-20 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                    transform: "skewX(-20deg)",
                  }}
                  animate={{ left: ["-40%", "140%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 6,
                    ease: "easeInOut",
                  }}
                />

                <div
                  className="flex items-center justify-between gap-2 px-4 py-2 border-b relative z-10"
                  style={{ borderColor: TICKET_LINE }}
                >
                  <span
                    className="font-mono-num text-[9px] tracking-[0.2em] uppercase font-bold"
                    style={{ color: INK }}
                  >
                    SEIM <span style={{ color: GOLD }}>/</span> 2026
                  </span>
                  <span
                    className="text-[8px] uppercase tracking-[0.18em] font-bold"
                    style={{ color: BRONZE }}
                  >
                    {copy.access}
                  </span>
                </div>

                <div className="relative flex z-10">
                  <div className="flex-1 min-w-0 px-4 py-3.5">
                    <div className="flex items-baseline">
                      <AnimatedNumber
                        value={d}
                        className="font-serif font-light text-[3rem] min-[380px]:text-[3.5rem] leading-[0.85] tracking-[-0.05em]"
                        style={{ color: INK }}
                      />
                      <span
                        className="font-serif italic text-lg min-[380px]:text-xl ml-1.5 font-bold"
                        style={{ color: BRONZE }}
                      >
                        {copy.days}
                      </span>
                    </div>
                    <p
                      className="font-serif text-[10.5px] leading-[1.35] mt-1.5 pr-2 font-medium"
                      style={{ color: "rgba(12,45,82,0.7)" }}
                    >
                      {copy.narrativeShort}
                    </p>
                  </div>

                  <div className="relative w-px shrink-0">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-px border-l-2 border-dashed"
                      style={{ borderColor: "rgba(12,45,82,0.35)" }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 left-0 w-6 h-6 rounded-full -translate-x-1/2 z-10"
                      style={notchStyle}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3 left-0 w-6 h-6 rounded-full -translate-x-1/2 z-10"
                      style={notchStyle}
                    />
                  </div>

                  <div className="w-[42%] shrink-0 px-2 py-3.5 grid grid-cols-3 gap-0.5">
                    {[
                      { v: h, l: copy.hours },
                      { v: m, l: copy.minutes },
                      { v: s, l: copy.seconds },
                    ].map((u, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <AnimatedNumber
                          value={u.v}
                          className="font-serif font-light text-xl min-[380px]:text-2xl leading-none tracking-[-0.02em]"
                          style={{ color: INK }}
                        />
                        <span
                          className="block w-3 h-px my-1"
                          style={{ backgroundColor: "rgba(12,45,82,0.28)" }}
                        />
                        <span
                          className="font-mono-num text-[7px] uppercase tracking-[0.12em] leading-none font-bold"
                          style={{ color: "rgba(12,45,82,0.6)" }}
                        >
                          {u.l}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between gap-2 px-4 py-2 border-t relative z-10"
                  style={{ borderColor: TICKET_LINE }}
                >
                  <div
                    className="relative flex items-end gap-[1px] h-3 overflow-hidden"
                    aria-hidden="true"
                  >
                    {barcode.slice(0, 12).map((w, i) => (
                      <span
                        key={i}
                        className="block h-full"
                        style={{ width: `${w}px`, backgroundColor: INK }}
                      />
                    ))}
                    <motion.span
                      className="absolute inset-y-0 w-px z-10 pointer-events-none"
                      style={{
                        backgroundColor: BRONZE,
                        boxShadow: "0 0 6px 1px rgba(212,155,15,0.8)",
                      }}
                      animate={{ left: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 2,
                      }}
                    />
                  </div>

                  <span
                    className="font-mono-num text-[7px] uppercase tracking-[0.15em] font-bold"
                    style={{ color: BRONZE }}
                  >
                    CICB · Bamako
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* DESKTOP : ticket horizontal 3.2:1 */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotate: 0, scale: 1.005 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative flex flex-row shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)]">
                  {/* PARTIE PRINCIPALE */}
                  <div
                    className="flex-1 relative flex flex-col justify-between py-8 px-12 rounded-l-xl overflow-hidden"
                    style={{ backgroundColor: TICKET_PAPER, color: INK }}
                  >
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-y-0 w-1/3 z-20 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                        transform: "skewX(-20deg)",
                      }}
                      animate={{ left: ["-40%", "140%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 7,
                        ease: "easeInOut",
                      }}
                    />

                    <div
                      className="flex items-baseline justify-between gap-4 pb-4 border-b relative z-10"
                      style={{ borderColor: TICKET_LINE }}
                    >
                      <span
                        className="font-mono-num text-[11px] tracking-[0.24em] uppercase font-bold"
                        style={{ color: INK }}
                      >
                        SEIM <span style={{ color: GOLD }}>/</span> 2026
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-[0.28em] font-bold"
                        style={{ color: BRONZE }}
                      >
                        {copy.sideLabel}
                      </span>
                    </div>

                    <div className="my-9 relative z-10">
                      <div className="flex items-baseline flex-wrap">
                        <AnimatedNumber
                          value={d}
                          className="font-serif font-light text-[6.5rem] leading-[0.85] tracking-[-0.05em]"
                          style={{ color: INK }}
                        />
                        <span
                          className="font-serif italic text-4xl ml-3 font-bold"
                          style={{ color: BRONZE }}
                        >
                          {copy.days}
                        </span>
                      </div>

                      <p
                        className="font-serif text-lg leading-[1.35] mt-4 max-w-sm font-medium"
                        style={{ color: "rgba(12,45,82,0.7)" }}
                      >
                        {copy.narrative}
                      </p>
                    </div>

                    <div
                      className="flex items-end justify-between gap-4 pt-4 border-t relative z-10"
                      style={{ borderColor: TICKET_LINE }}
                    >
                      <span
                        className="font-mono-num text-[11px] tracking-[0.22em] uppercase font-bold"
                        style={{ color: INK }}
                      >
                        {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}
                      </span>
                      <span
                        className="font-serif text-base font-bold"
                        style={{ color: INK }}
                      >
                        CICB · Bamako
                      </span>
                    </div>
                  </div>

                  {/* Perforation */}
                  <div className="relative flex lg:block justify-center lg:w-px lg:self-stretch">
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute inset-y-0 left-0 w-px border-l-2 border-dashed"
                      style={{ borderColor: "rgba(12,45,82,0.35)" }}
                    />
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute -top-3 left-0 w-6 h-6 rounded-full -translate-x-1/2 z-10"
                      style={notchStyle}
                    />
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute -bottom-3 left-0 w-6 h-6 rounded-full -translate-x-1/2 z-10"
                      style={notchStyle}
                    />
                  </div>

                  {/* SOUCHE */}
                  <div
                    className="lg:w-[30%] relative flex flex-col justify-between py-8 px-8 rounded-r-xl"
                    style={{ backgroundColor: TICKET_PAPER_DARK, color: INK }}
                  >
                    <div className="pb-3 border-b" style={{ borderColor: TICKET_LINE }}>
                      <span
                        className="text-[10px] uppercase tracking-[0.28em] font-bold"
                        style={{ color: BRONZE }}
                      >
                        {copy.stubLabel}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 my-6">
                      {[
                        { v: h, l: copy.hours },
                        { v: m, l: copy.minutes },
                        { v: s, l: copy.seconds },
                      ].map((u, i) => (
                        <div key={i} className="flex items-end justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <span
                              className="font-mono-num text-[9px] uppercase tracking-[0.22em] font-bold"
                              style={{ color: "rgba(12,45,82,0.6)" }}
                            >
                              {u.l}
                            </span>
                            <span
                              className="w-5 h-px"
                              style={{ backgroundColor: "rgba(12,45,82,0.25)" }}
                            />
                          </div>
                          <AnimatedNumber
                            value={u.v}
                            className="font-serif font-light text-[2.75rem] leading-none tracking-[-0.03em]"
                            style={{ color: INK }}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <div
                        className="relative flex items-end gap-[1.5px] h-7 mb-2.5 overflow-hidden"
                        aria-hidden="true"
                      >
                        {barcode.map((w, i) => (
                          <span
                            key={i}
                            className="block h-full"
                            style={{ width: `${w}px`, backgroundColor: INK }}
                          />
                        ))}
                        <motion.span
                          className="absolute inset-y-0 w-[2px] z-10 pointer-events-none"
                          style={{
                            backgroundColor: BRONZE,
                            boxShadow: "0 0 10px 2px rgba(212,155,15,0.85)",
                          }}
                          animate={{ left: ["0%", "100%", "0%"] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 2,
                          }}
                        />
                      </div>

                      <div
                        className="pt-2.5 border-t flex items-center justify-end gap-2"
                        style={{ borderColor: TICKET_LINE }}
                      >
                        <span
                          className="font-mono-num text-[9px] uppercase tracking-[0.2em] font-bold"
                          style={{ color: BRONZE }}
                        >
                          {copy.access}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Reveal>
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

  const official = partners.find((p) => p.tier === "principal");
  const others = partners.filter((p) => p.tier !== "principal").slice(0, 5);
  const remaining = partners.filter((p) => p.tier !== "principal").length - others.length;

  return (
    <section
      data-testid="partners-strip"
      className="py-8 sm:py-10 border-y"
      style={{ backgroundColor: PAPER, borderColor: RULE }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#0C2D52]/50 whitespace-nowrap text-center lg:text-left shrink-0 font-bold">
            {lang === "fr" ? "Avec le soutien de" : "With the support of"}
          </p>

          <div className="hidden lg:block w-px h-12" style={{ backgroundColor: RULE }} />

          {official && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
              <div className="bg-white rounded p-1.5 shadow-sm border" style={{ borderColor: RULE }}>
                <img
                  src="/assets/seim/logos/facej.png"
                  alt="FACEJ"
                  className="h-12 sm:h-14 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] mb-0.5 font-bold" style={{ color: BRONZE }}>
                  {lang === "fr" ? "Parrain officiel" : "Official Sponsor"}
                </span>
                <span className="font-serif font-extrabold text-[18px] text-[#0C2D52] leading-none">
                  FACEJ
                </span>
              </div>
            </div>
          )}

          <div className="hidden lg:block w-px h-12" style={{ backgroundColor: RULE }} />

          <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
            {others.map((p, i) => (
              <span
                key={p.id || i}
                className="text-[12px] tracking-wide text-[#0C2D52]/70 text-center font-semibold"
                title={p.name}
              >
                {p.name}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-[11px] font-mono-num font-bold" style={{ color: BRONZE }}>
                +{remaining}
              </span>
            )}
          </div>
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
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap font-bold" style={{ color: BRONZE }}>
                {copy.eyebrow}
              </span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {copy.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[14px] sm:text-[16px] leading-[1.7] text-[#0C2D52]/70 font-medium">
              {copy.subtitle}
            </p>
          </div>
        </div>

        {/* Ajustement des tailles d'images (Feedback Word) */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {photos.map((p, i) => {
            const isWide = i === 0 || i === 5;
            return (
              <div
                key={i}
                className={`relative overflow-hidden rounded-sm ${isWide ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                <SmartImg
                  src={p.src}
                  alt={p.caption}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-[#0C2D52]/95 backdrop-blur-sm pointer-events-none">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white font-bold line-clamp-1">
                    {p.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-[220px]">
          {photos.map((p, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-sm ${p.span || ""}`}>
              <SmartImg
                src={p.src}
                alt={p.caption}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-[#0C2D52]/95 backdrop-blur-sm pointer-events-none">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white font-bold">
                  {p.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] italic font-serif text-right font-medium" style={{ color: "rgba(12,45,82,0.5)" }}>
          {copy.caption}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Why attend — illustrations plus grandes
   ============================================================ */
function WhyAttend() {
  const { lang } = useLanguage();
  const copy = lang === "fr" ? {
    eyebrow: "Pourquoi participer",
    title: "Faire des rencontres. Ouvrir des perspectives. Concrétiser des projets.",
    intro: "Le SEIM crée un cadre de dialogue entre les acteurs qui font avancer l'économie et ceux qui peuvent contribuer à son financement.",
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
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>{copy.eyebrow}</span>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.8rem] leading-[1.15] sm:leading-[1.1]" style={{ color: INK }}>{copy.title}</h2>
              {/* Texte mis en gras (Feedback Word) */}
              <p className="mt-4 sm:mt-5 max-w-2xl text-[14px] sm:text-[16px] font-semibold leading-[1.7] sm:leading-[1.8] text-[#0C2D52]/70">{copy.intro}</p>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t" style={{ borderColor: RULE }}>
          {copy.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.06} className="h-full">
              <article className={`h-full py-6 sm:py-8 sm:px-6 ${i === 0 ? "lg:pl-0" : "lg:border-l"} border-b sm:border-b-0 flex flex-col`} style={{ borderColor: RULE }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-5">
                  <EditorialIllustration variant={item.icon} className="w-full h-full" />
                </div>
                <p className="font-mono-num text-[11px] sm:text-[12px] tracking-[0.2em] mb-2 font-bold" style={{ color: BRONZE }}>{item.n}</p>
                <h3 className="font-serif font-extrabold text-lg sm:text-[1.35rem] leading-tight mb-2 sm:mb-3" style={{ color: INK }}>{item.title}</h3>
                <p className="text-[13px] leading-[1.65] sm:leading-[1.75] text-[#0C2D52]/65 flex-1 font-medium">{item.desc}</p>
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
    title: "À qui s'adresse le SEIM ?",
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
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-3 sm:mb-5 font-bold" style={{ color: BRONZE }}>{copy.eyebrow}</p>
            <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.8rem] leading-[1.15] sm:leading-[1.1]">{copy.title}</h2>
            <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] font-semibold leading-[1.7] sm:leading-[1.8] text-[#0C2D52]/70">{copy.intro}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden shadow-sm mb-8 sm:mb-10 rounded-md">
            <SmartImg
              src="/assets/seim/audience-band.jpg"
              alt={copy.caption}
              className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-[#0C2D52]/95 backdrop-blur-sm pointer-events-none">
              <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-white font-bold">
                {copy.caption}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {copy.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.06}>
              <article className="h-full min-h-[220px] sm:min-h-[260px] p-5 sm:p-7 border bg-[#F2F4F6] flex flex-col rounded-sm" style={{ borderColor: RULE }}>
                <div className="w-16 h-16 mb-4">
                  <EditorialIllustration variant={item.icon} className="w-full h-full" />
                </div>
                <p className="font-mono-num text-[11px] sm:text-[12px] tracking-[0.2em] mb-2 sm:mb-3 font-bold" style={{ color: BRONZE }}>{item.n}</p>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl leading-tight mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-[13px] leading-[1.65] sm:leading-[1.75] text-[#0C2D52]/65 flex-1 font-medium">{item.desc}</p>
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
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap font-bold" style={{ color: BRONZE }}>
              {t("stats.eyebrow")}
            </span>
            <span className="w-8 sm:w-12 h-px" style={{ backgroundColor: RULE }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#0C2D52]/50 whitespace-nowrap hidden sm:block font-bold">
            {lang === "fr" ? "Données officielles" : "Official data"}
          </span>
        </div>

        <h2 className="font-serif font-extrabold tracking-[-0.02em] text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.15] mb-8 sm:mb-10 max-w-2xl" style={{ color: INK }}>
          {t("stats.title")}
        </h2>

        <Reveal>
          <div className="relative overflow-hidden shadow-lg rounded-md">
            <SmartImg
              src="/assets/seim/keynote-closeup.jpg"
              alt={lang === "fr" ? "Keynote d'ouverture" : "Opening keynote"}
              className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] object-cover grayscale-[0.1]"
            />
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "70%",
                background: `linear-gradient(to top, rgba(12,45,82,0.98) 0%, rgba(12,45,82,0.8) 40%, transparent 100%)`,
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-serif font-extrabold tracking-[-0.05em] text-[3rem] sm:text-[4rem] lg:text-[5rem] leading-none"
                    style={{ color: CREAM }}
                  >
                    <CountUp value={hero.value} />
                  </span>
                  {hero.suffix && (
                    <span
                      className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-bold"
                      style={{ color: GOLD }}
                    >
                      {hero.suffix}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[11px] sm:text-[12px] lg:text-[13px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD }}>
                  {hero.label}
                </p>
              </div>
              <p className="text-[11px] sm:text-[12px] italic font-serif leading-relaxed max-w-xs sm:text-right font-medium" style={{ color: "rgba(242,244,246,0.9)" }}>
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
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-serif font-extrabold tracking-[-0.02em] text-xl sm:text-2xl lg:text-3xl leading-none"
                      style={{ color: INK }}
                    >
                      <CountUp value={item.value} />
                    </span>
                    {item.suffix && (
                      <span className="font-serif italic text-sm sm:text-base font-bold" style={{ color: BRONZE }}>
                        {item.suffix}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#0C2D52]/70 leading-snug font-bold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-5 flex justify-between items-center">
            <p className="text-[10px] italic font-serif text-[#0C2D52]/50 font-medium">
              {lang === "fr" ? "Source : organisation SEIM" : "Source: SEIM organization"}
            </p>
            <Link to="/a-propos" className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: INK }}>
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
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap font-bold" style={{ color: BRONZE }}>
                {t("program.eyebrow")}
              </span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {t("program.previewTitle")}
            </h2>
          </div>
          <Link to="/programme" className="group inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold shrink-0 mt-2 sm:mt-0" style={{ color: INK }}>
            <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>{t("program.viewFull")}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Featured Session (Gauche) */}
          <div data-testid={`highlight-session-${featured.id}`} className="lg:col-span-6">
            <div className="overflow-hidden mb-4 shadow-sm rounded-sm">
              <SmartImg
                src="/assets/seim/featured-session.jpg"
                alt={lang === "fr" ? featured.title_fr : featured.title_en}
                className="w-full aspect-[16/9] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="pt-4 border-t-2" style={{ borderColor: BRONZE }}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 opacity-80">
                    <EditorialIllustration variant={getIconVariant(featured.type)} className="w-full h-full" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.24em] font-bold" style={{ color: BRONZE }}>
                    {t(`program.types.${featured.type}`)}
                  </span>
                </div>
                <span className="font-mono-num text-[12px] tracking-[0.15em] text-[#0C2D52]/60 font-bold">
                  J{featured.day} · {featured.time}
                </span>
              </div>

              <h3 className="font-serif font-extrabold tracking-[-0.01em] text-xl leading-snug mb-4 break-words" style={{ color: INK }}>
                {lang === "fr" ? featured.title_fr : featured.title_en}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <p className="flex items-center gap-1.5 text-[13px] text-[#0C2D52]/70 font-medium">
                  <MapPin size={14} style={{ color: BRONZE }} />
                  <span className="break-words">
                    {lang === "fr" ? featured.room_fr : featured.room_en}
                  </span>
                </p>

                {featSpeakers.length > 0 && (
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-[#0C2D52]/30" />
                )}

                {/* Intervenants (Noms uniquement, sans images - Feedback) */}
                {featSpeakers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4">
                    {featSpeakers.map((sp) => (
                      <div key={sp.id} className="flex items-center">
                        <span className="text-[13px] font-semibold text-[#0C2D52]/90">{sp.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des 3 autres sessions (Droite) */}
          <div className="lg:col-span-6 mt-5 sm:mt-8 lg:mt-0 relative">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-[rgba(12,45,82,0.15)] hidden sm:block" />
            {rest.map((s) => (
              <div
                key={s.id}
                data-testid={`highlight-session-${s.id}`}
                className="py-3 sm:py-6 border-b last:border-0 relative flex gap-3 sm:gap-6"
                style={{ borderColor: RULE }}
              >
                <div className="hidden sm:flex flex-col items-center shrink-0 w-6 relative z-10">
                  <div className="w-3 h-3 rounded-full border-2 bg-[#F2F4F6] mt-2" style={{ borderColor: BRONZE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 opacity-75">
                        <EditorialIllustration variant={getIconVariant(s.type)} className="w-full h-full" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: BRONZE }}>
                        {t(`program.types.${s.type}`)}
                      </span>
                    </div>
                    <span className="font-mono-num text-[10px] sm:text-[11px] tracking-[0.15em] text-[#0C2D52]/60 shrink-0 font-bold">
                      J{s.day} · {s.time}
                    </span>
                  </div>
                  <h4 className="font-serif font-extrabold text-base sm:text-lg leading-snug tracking-tight break-words" style={{ color: INK }}>
                    {lang === "fr" ? s.title_fr : s.title_en}
                  </h4>
                  <p className="mt-1 sm:mt-1.5 flex items-center gap-1 text-[11px] sm:text-[12px] text-[#0C2D52]/60 font-medium">
                    <MapPin size={10} className="sm:w-[11px] sm:h-[11px]" />
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
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] whitespace-nowrap font-bold" style={{ color: BRONZE }}>{t("speakers.eyebrow")}</span>
              <span className="w-12 sm:w-20 h-px" style={{ backgroundColor: RULE }} />
            </div>
            <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] sm:leading-[1.08] break-words" style={{ color: INK }}>
              {t("speakers.previewTitle")}
            </h2>
          </div>
          <Link to="/intervenants" className="group inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold shrink-0 mt-2 sm:mt-0" style={{ color: INK }}>
            <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>{t("common.viewAll")}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: BRONZE }} />
          </Link>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden shadow-sm mb-6 sm:mb-8 rounded-md">
            <SmartImg
              src="/assets/seim/speakers-stage.jpg"
              alt={lang === "fr" ? "Intervenants sur scène" : "Speakers on stage"}
              className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-[#0C2D52]/95 backdrop-blur-sm pointer-events-none">
              <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] text-white font-bold">
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
                  <span className="font-serif font-extrabold text-xl sm:text-3xl md:text-4xl" style={{ color: BRONZE }}>{getInitials(sp.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 line-clamp-2 font-bold" style={{ color: BRONZE }}>
                    {getRole(sp, lang)}
                  </p>
                  <h3 className="font-serif font-extrabold text-base sm:text-xl leading-tight tracking-tight mb-0.5 sm:mb-1.5" style={{ color: INK }}>
                    {sp.name}
                  </h3>
                  {sp.company && (
                    <p className="text-[10px] sm:text-[12px] text-[#0C2D52]/60 italic font-serif line-clamp-1 font-medium">
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${INK} 0%, rgba(12,45,82,0.5) 30%, rgba(12,45,82,0.5) 70%, ${INK} 100%)` }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] opacity-10 pointer-events-none -mt-20 -mr-20">
        <EditorialIllustration variant="network" className="w-full h-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: GOLD }} />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold" style={{ color: GOLD }}>{copy.eyebrow}</span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="font-serif font-extrabold tracking-[-0.02em] text-xl sm:text-3xl lg:text-[2.5rem] xl:text-[2.8rem] leading-[1.2] sm:leading-[1.15] break-words">
                <span style={{ color: GOLD }}>«&nbsp;</span>
                {copy.title}
                <span style={{ color: GOLD }}>&nbsp;»</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 sm:mt-10 text-[14px] sm:text-[16px] text-[#F2F4F6]/90 max-w-2xl leading-[1.7] sm:leading-[1.8] font-medium">{copy.body}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 sm:mt-10 flex items-center gap-3">
                <span className="w-5 sm:w-6 h-px" style={{ backgroundColor: RULE_INK }} />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#F2F4F6]/60 font-bold">{copy.sign}</span>
              </div>
            </Reveal>
          </div>
        </div>

        {pillars.length > 0 && (
          <div className="mt-12 sm:mt-24 pt-8 sm:pt-10 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10" style={{ borderColor: RULE_INK }}>
            {pillars.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div>
                  <p className="font-mono-num text-[11px] tracking-[0.2em] mb-2 sm:mb-3 font-bold" style={{ color: GOLD }}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-serif font-extrabold text-base sm:text-lg leading-tight mb-1.5 sm:mb-2">{p.title}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#F2F4F6]/70 leading-[1.6] sm:leading-[1.65] font-medium">{p.desc}</p>
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
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>
              {lang === "fr" ? "Inscription · Places limitées" : "Registration · Limited seats"}
            </span>
            <span className="w-6 sm:w-10 h-px" style={{ backgroundColor: RULE }} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-5xl lg:text-[3.4rem] leading-[1.15] sm:leading-[1.05] break-words" style={{ color: INK }}>
            {t("cta.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-4 sm:mt-7 text-[14px] sm:text-[16px] text-[#0C2D52]/80 max-w-xl mx-auto leading-[1.7] sm:leading-[1.75] font-semibold">{t("cta.subtitle")}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 sm:mt-12 flex items-center justify-center">
            <Link to="/inscription" data-testid="cta-register-button" className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-8 sm:px-11 py-3.5 sm:py-4 text-[13px] sm:text-sm font-bold tracking-wide transition-opacity hover:opacity-90" style={{ backgroundColor: INK, color: CREAM }}>
              {t("cta.button")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: GOLD }} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-8 sm:mt-10 font-mono-num text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#0C2D52]/60 font-bold">
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