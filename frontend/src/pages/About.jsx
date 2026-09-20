import { PageHero } from "../components/PageHero";
import { SectionHead, SmartImg } from "../components/SectionHead";
import { Reveal, Stagger, StaggerItem, CountUp } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const pillars = t("about.pillars");
  const stats = t("stats.items");

  return (
    <div data-testid="about-page">
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} subtitle={t("about.p1")} />

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal>
              <p className="font-serif-accent italic text-xl text-gold-dark leading-relaxed">
                « {t("hero.line1")} {t("hero.line2").toLowerCase()} {t("hero.line3").toLowerCase()} »
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-navy/70 leading-relaxed">{t("about.p2")}</p>
            </Reveal>
            <Stagger className="mt-10 space-y-5">
              {pillars.map((p, i) => (
                <StaggerItem key={i}>
                  <div data-testid={`about-pillar-${i}`} className="flex gap-5 items-start">
                    <span className="font-display font-extrabold text-gold text-lg mt-0.5">0{i + 1}</span>
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg">{p.title}</h3>
                      <p className="text-navy/60 mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="relative">
            <Reveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-navy/10 shadow-xl shadow-navy/10">
                <SmartImg
                  src="/assets/seim/g-famille.jpg"
                  alt="SEIM 2026"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="absolute -bottom-8 -left-6 sm:-left-10 bg-navy text-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-[260px]">
                <p className="text-4xl font-display font-extrabold text-gold">
                  <CountUp value={1000} suffix="+" />
                </p>
                <p className="text-sm text-white/60 mt-1">{stats[0]?.label}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHead eyebrow={t("stats.eyebrow")} title={t("stats.title")} />
          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {stats.map((s, i) => (
              <StaggerItem key={i}>
                <div data-testid={`about-stat-${i}`} className="bg-white rounded-2xl border border-navy/10 p-6 text-center h-full hover:border-gold/50 transition-colors">
                  <p className="text-3xl text-navy"><CountUp value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-2 text-xs text-navy/55 font-medium">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link to="/inscription" data-testid="about-register-button" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-display font-bold hover:bg-gold-dark transition-colors">
                {t("nav.register")} <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
