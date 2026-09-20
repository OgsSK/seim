import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Mic2, Users, Landmark, GraduationCap, Briefcase, Sparkles, Tv, Store, Coffee } from "lucide-react";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { Countdown } from "../components/Countdown";
import { Marquee } from "../components/Marquee";
import { Reveal, Stagger, StaggerItem, CountUp } from "../components/Reveal";
import { SectionHead, SmartImg } from "../components/SectionHead";
import { SpeakerCard } from "../components/SpeakerCard";
import { SpeakerModal } from "../components/SpeakerModal";

const FORMAT_ICONS = [Mic2, Users, GraduationCap, Briefcase, Sparkles, Coffee, Tv, Store];

const lineReveal = {
  hidden: { y: "110%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] } }),
};

function Hero() {
  const { t, lang } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative min-h-screen bg-bone overflow-hidden flex items-center">
      <div className="absolute inset-0 zigzag-bg" />
      <div
        className="absolute -left-40 top-1/4 w-[560px] h-[560px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 65%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-40 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div style={{ opacity: fade }} className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light border border-gold/40 text-gold-dark text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={13} /> {lang === "fr" ? EVENT.edition_fr : EVENT.edition_en}
            </span>
            <span className="text-navy/45 text-xs font-semibold uppercase tracking-[0.2em]">{t("hero.eyebrow")}</span>
          </motion.div>

          <h1 className="font-display font-extrabold tracking-tight text-navy leading-[0.95] text-[13vw] sm:text-6xl lg:text-7xl">
            {[t("hero.line1"), t("hero.line2")].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span custom={i} variants={lineReveal} initial="hidden" animate="show" className="block">
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span custom={2} variants={lineReveal} initial="hidden" animate="show" className="block text-gold">
                {t("hero.line3")}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-7 text-navy/65 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/inscription"
              data-testid="hero-register-button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-display font-bold hover:bg-gold-dark transition-colors animate-pulse-glow"
            >
              {t("hero.cta1")} <ArrowRight size={18} />
            </Link>
            <Link
              to="/programme"
              data-testid="hero-program-button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-navy/20 text-navy font-display font-semibold hover:border-gold hover:text-gold-dark transition-colors"
            >
              {t("hero.cta2")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <div>
              <p className="text-navy/45 text-[10px] uppercase tracking-[0.25em] mb-2">{t("hero.countdownLabel")}</p>
              <Countdown dark={false} />
            </div>
            <div className="hidden sm:block h-14 w-px bg-navy/15" />
            <div className="space-y-2 text-sm text-navy/70">
              <p className="flex items-center gap-2"><CalendarDays size={15} className="text-gold-dark" /> {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-gold-dark" /> {lang === "fr" ? EVENT.venue_fr : EVENT.venue_en}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imgY }} className="lg:col-span-5 relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden border border-navy/10 shadow-2xl shadow-navy/20"
          >
            <SmartImg src={EVENT.banner} alt="SEIM" className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-navy/10 rounded-2xl" />
          </motion.div>
          <div className="absolute -bottom-6 -left-6 bg-gold text-navy rounded-xl px-5 py-4 shadow-xl">
            <p className="font-display font-extrabold text-2xl leading-none">CICB</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-1">Bamako · Mali</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 py-5 bg-gold">
        <Marquee items={t("marquee")} slow inkClass="text-navy/70" iconClass="text-navy" />
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useLanguage();
  const items = t("stats.items");
  return (
    <section data-testid="stats-section" className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHead eyebrow={t("stats.eyebrow")} title={t("stats.title")} />
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-navy/10 rounded-2xl overflow-hidden border border-navy/10">
          {items.map((item, i) => (
            <StaggerItem key={i} className="bg-white">
              <div data-testid={`stat-item-${i}`} className="p-6 sm:p-8 text-center hover:bg-gold-light/40 transition-colors h-full">
                <p className="text-3xl sm:text-4xl text-navy">
                  <CountUp value={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-xs sm:text-sm text-navy/55 font-medium leading-snug">{item.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function AboutPreview() {
  const { t } = useLanguage();
  const pillars = t("about.pillars");
  return (
    <section data-testid="about-section" className="py-20 sm:py-28 bg-bone relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <SectionHead center={false} eyebrow={t("about.eyebrow")} title={t("about.title")} />
          <Reveal delay={0.1}>
            <p className="text-navy/70 leading-relaxed">{t("about.p1")}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 text-navy/70 leading-relaxed">{t("about.p2")}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <Link to="/a-propos" data-testid="about-discover-link" className="mt-8 inline-flex items-center gap-2 font-display font-bold text-navy border-b-2 border-gold pb-1 hover:text-gold-dark transition-colors">
              {t("about.cta")} <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
        <Stagger className="lg:col-span-7 grid sm:grid-cols-1 gap-5">
          {pillars.map((p, i) => (
            <StaggerItem key={i}>
              <div data-testid={`pillar-card-${i}`} className="group bg-white rounded-2xl border border-navy/10 p-8 flex gap-6 items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/8">
                <span className="font-serif-accent italic text-5xl text-gold/70 leading-none group-hover:text-gold transition-colors">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display font-bold text-navy text-xl">{p.title}</h3>
                  <p className="mt-2 text-navy/60 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
          <StaggerItem>
            <div className="rounded-2xl overflow-hidden border border-navy/10">
              <SmartImg
                src="/assets/seim/g-notes.jpg"
                alt="SEIM audience"
                className="w-full aspect-[16/7] object-cover"
              />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function Formats() {
  const { t } = useLanguage();
  const items = t("formats.items");
  return (
    <section data-testid="formats-section" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHead eyebrow={t("formats.eyebrow")} title={t("formats.title")} subtitle={t("formats.subtitle")} />
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((f, i) => {
            const Icon = FORMAT_ICONS[i % FORMAT_ICONS.length];
            return (
              <StaggerItem key={f.key}>
                <div
                  data-testid={`format-card-${f.key}`}
                  className="group h-full bg-bone border border-navy/10 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:bg-white hover:shadow-xl hover:shadow-navy/8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-light border border-gold/30 flex items-center justify-center text-gold-dark mb-5 group-hover:bg-gold group-hover:text-navy transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg">{f.title}</h3>
                  <p className="mt-2 text-navy/55 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function ProgramPreview({ sessions, speakers }) {
  const { t, lang } = useLanguage();
  const highlights = sessions.filter((s) => ["keynote", "panel", "masterclass"].includes(s.type)).slice(0, 4);
  return (
    <section data-testid="program-preview-section" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHead center={false} eyebrow={t("program.eyebrow")} title={t("program.previewTitle")} />
          <Reveal>
            <Link to="/programme" data-testid="program-view-all-link" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-navy text-navy font-display font-bold text-sm hover:bg-navy hover:text-white transition-colors">
              {t("program.viewFull")} <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
        <Stagger key={sessions.length} className="divide-y divide-navy/10 border-y border-navy/10">
          {highlights.map((s) => (
            <StaggerItem key={s.id}>
              <div data-testid={`highlight-session-${s.id}`} className="group py-6 flex flex-wrap items-center gap-x-8 gap-y-3 hover:bg-bone/80 px-4 -mx-4 rounded-xl transition-colors">
                <div className="font-mono-num text-gold-dark font-semibold text-sm w-32">
                  {lang === "fr" ? "J" : "D"}{s.day} · {s.time}
                </div>
                <div className="flex-1 min-w-[220px]">
                  <p className="font-display font-bold text-navy text-lg group-hover:text-gold-dark transition-colors">
                    {lang === "fr" ? s.title_fr : s.title_en}
                  </p>
                  <p className="text-navy/50 text-sm mt-1">{lang === "fr" ? s.room_fr : s.room_en}</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-navy/5 text-navy/70 text-xs font-bold uppercase tracking-wider">
                  {t(`program.types.${s.type}`)}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function SpeakersPreview({ speakers }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  return (
    <section data-testid="speakers-preview-section" className="py-20 sm:py-28 bg-bone">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHead center={false} eyebrow={t("speakers.eyebrow")} title={t("speakers.previewTitle")} />
          <Reveal>
            <Link to="/intervenants" data-testid="speakers-view-all-link" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-navy text-navy font-display font-bold text-sm hover:bg-navy hover:text-white transition-colors">
              {t("common.viewAll")} <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
        <Stagger key={speakers.length} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {speakers.slice(0, 4).map((sp) => (
            <StaggerItem key={sp.id}>
              <SpeakerCard speaker={sp} onOpen={setSelected} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function PartnersStrip({ partners }) {
  const names = partners.map((p) => p.name);
  return (
    <section data-testid="partners-strip" className="py-16 bg-white border-y border-navy/10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-navy/40 mb-8 px-5">
        {names.length > 0 ? "Partenaires & Sponsors" : ""}
      </p>
      <Marquee items={names} />
    </section>
  );
}

function CtaBand() {
  const { t } = useLanguage();
  return (
    <section data-testid="cta-band" className="relative bg-gold py-20 sm:py-28 overflow-hidden">
      <div
        className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 65%)" }}
      />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold tracking-tight text-navy text-3xl sm:text-4xl lg:text-5xl">
            {t("cta.title")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-navy/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">{t("cta.subtitle")}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            to="/inscription"
            data-testid="cta-register-button"
            className="mt-10 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-navy text-white font-display font-bold text-lg hover:bg-navy-soft transition-colors"
          >
            {t("cta.button")} <ArrowRight size={20} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.program().then(setSessions).catch(() => {});
    api.speakers().then(setSpeakers).catch(() => {});
    api.partners().then(setPartners).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Hero />
      <Stats />
      <AboutPreview />
      <Formats />
      <ProgramPreview sessions={sessions} speakers={speakers} />
      <SpeakersPreview speakers={speakers} />
      <PartnersStrip partners={partners} />
      <CtaBand />
    </div>
  );
}
