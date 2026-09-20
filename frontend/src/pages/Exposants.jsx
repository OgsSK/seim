import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Stagger, StaggerItem, Reveal } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

const SECTORS = ["all", "banque", "assurance", "fintech", "gestion", "marches", "immobilier", "institution", "media"];

const SECTOR_COLORS = {
  banque: "text-sky-700 bg-sky-50 border-sky-200",
  assurance: "text-emerald-700 bg-emerald-50 border-emerald-200",
  fintech: "text-amber-700 bg-amber-50 border-amber-200",
  gestion: "text-violet-700 bg-violet-50 border-violet-200",
  marches: "text-indigo-700 bg-indigo-50 border-indigo-200",
  immobilier: "text-orange-700 bg-orange-50 border-orange-200",
  institution: "text-slate-700 bg-slate-100 border-slate-200",
  media: "text-rose-700 bg-rose-50 border-rose-200",
};

export default function Exposants() {
  const { t, lang } = useLanguage();
  const [exhibitors, setExhibitors] = useState([]);
  const [sector, setSector] = useState("all");

  useEffect(() => {
    api.exhibitors().then(setExhibitors).catch(() => {});
  }, []);

  const filtered = exhibitors.filter((e) => sector === "all" || e.sector === sector);

  return (
    <div data-testid="exhibitors-page">
      <PageHero eyebrow={t("exhibitors.eyebrow")} title={t("exhibitors.title")} subtitle={t("exhibitors.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 mb-12" data-testid="exhibitor-sector-filters">
            {SECTORS.map((s) => (
              <button
                key={s}
                data-testid={`exhibitor-filter-${s}`}
                onClick={() => setSector(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  sector === s ? "bg-navy text-gold" : "bg-white text-navy/50 border border-navy/10 hover:border-gold/60"
                }`}
              >
                {t(`exhibitors.sectors.${s}`)}
              </button>
            ))}
          </div>

          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e) => (
              <StaggerItem key={e.id}>
                <div
                  data-testid={`exhibitor-card-${e.id}`}
                  className="group h-full bg-white rounded-2xl border border-navy/10 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/10 hover:border-gold/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                      <span className="font-display font-extrabold text-gold text-lg">{e.name[0]}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${SECTOR_COLORS[e.sector] || SECTOR_COLORS.institution}`}>
                      {t(`exhibitors.sectors.${e.sector}`)}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display font-bold text-navy text-lg">{e.name}</h3>
                  <p className="mt-2 text-navy/60 text-sm leading-relaxed">{lang === "fr" ? e.desc_fr : e.desc_en}</p>
                  <div className="mt-5 pt-4 border-t border-navy/8 flex items-center justify-between text-sm">
                    <span className="text-navy/45 font-semibold">
                      {t("exhibitors.stand")} <span className="text-gold-dark font-mono-num font-bold">{e.stand}</span>
                    </span>
                    {e.website && e.website !== "#" && (
                      <a href={e.website} target="_blank" rel="noopener noreferrer" data-testid={`exhibitor-site-${e.id}`}
                        className="inline-flex items-center gap-1 text-navy font-semibold hover:text-gold-dark transition-colors text-xs uppercase tracking-wider">
                        {t("exhibitors.visitSite")} <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15}>
            <div className="mt-16 bg-gold rounded-3xl relative overflow-hidden p-10 sm:p-14 text-center">
              <h3 className="font-display font-extrabold text-navy text-2xl sm:text-3xl">{t("exhibitors.become")}</h3>
              <p className="mt-3 text-navy/70 max-w-xl mx-auto">{t("partners.form.desc")}</p>
              <Link to="/contact?type=exposition" data-testid="become-exhibitor-button"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-navy text-white font-display font-bold hover:bg-navy-soft transition-colors">
                {t("exhibitors.become")} <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
