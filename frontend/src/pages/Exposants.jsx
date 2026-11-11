import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Store } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F";
const GOLD = "#F7B731";
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";
const EASE = [0.22, 1, 0.36, 1];

/* ============================================================
   SYSTÈME DE BADGES
   ============================================================ */
const BADGE = {
  primary: "bg-[#0C2D52] text-[#F2F4F6]",
  accent: "border border-[#D49B0F] text-[#D49B0F]",
  neutral: "border border-[rgba(12,45,82,0.2)] text-[#0C2D52]/60",
};

const SECTOR_VARIANT = {
  institution: "primary",
  banque: "primary",
  fintech: "accent",
  assurance: "accent",
  gestion: "neutral",
  marches: "neutral",
  immobilier: "neutral",
  media: "neutral",
};

/* ---------- Carte exposant ---------- */
function ExhibitorCard({ exhibitor, lang, t }) {
  const { id, name, sector, stand, website, desc_fr, desc_en, logo } = exhibitor;
  const desc = lang === "fr" ? desc_fr : desc_en;
  const initial = name?.[0]?.toUpperCase() || "?";
  const hasSite = website && website !== "#";
  const variant = BADGE[SECTOR_VARIANT[sector] || "neutral"];
  const [imgErr, setImgErr] = useState(false);

  const showLogo = logo && !imgErr;

  return (
    <div
      data-testid={`exhibitor-card-${id}`}
      className="group relative h-full flex flex-col p-6 sm:p-7 transition-colors"
      style={{ backgroundColor: PAPER, border: `1px solid ${RULE}` }}
    >
      {/* En-tête : logo + badge secteur */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div
          className="shrink-0 flex items-center justify-center"
          style={{
            width: "88px",
            height: "88px",
            backgroundColor: showLogo ? "#FFFFFF" : INK,
            border: `1px solid ${RULE}`,
            padding: showLogo ? "12px" : "0",
          }}
        >
          {showLogo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="font-serif font-extrabold text-2xl" style={{ color: GOLD }}>
              {initial}
            </span>
          )}
        </div>

        <span
          className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-bold whitespace-nowrap ${variant}`}
        >
          {t(`exhibitors.sectors.${sector}`)}
        </span>
      </div>

      <h3
        className="font-serif font-extrabold text-lg sm:text-xl leading-snug tracking-tight mb-2 break-words"
        style={{ color: INK }}
      >
        {name}
      </h3>
      {desc && (
        <p
          className="text-[14px] leading-[1.65] line-clamp-3 font-serif italic mb-6"
          style={{ color: "rgba(12,45,82,0.6)" }}
        >
          {desc}
        </p>
      )}

      <div
        className="mt-auto pt-5 border-t flex items-center justify-between gap-3"
        style={{ borderColor: RULE }}
      >
        <span
          className="inline-flex items-center gap-1.5 font-mono-num text-[10px] uppercase tracking-[0.1em] font-semibold"
          style={{ color: "rgba(12,45,82,0.55)" }}
        >
          <Store size={13} strokeWidth={1.5} style={{ color: BRONZE }} className="shrink-0" />
          <span className="whitespace-nowrap">{t("exhibitors.stand")}</span>
          <span style={{ color: INK }}>{stand}</span>
        </span>

        {hasSite && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`exhibitor-site-${id}`}
            className="group/link inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors hover:text-[#D49B0F] shrink-0"
            style={{ color: INK }}
          >
            {t("exhibitors.visitSite")}
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              style={{ color: BRONZE }}
            />
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ lang }) {
  return (
    <div
      data-testid="exhibitors-empty"
      className="py-20 text-center border-y"
      style={{ borderColor: RULE }}
    >
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <Building2 size={32} strokeWidth={1} />
      </div>
      <h3 className="font-serif font-extrabold text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les exposants seront annoncés prochainement"
          : "Exhibitors will be announced soon"}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed mb-8"
        style={{ color: "rgba(12,45,82,0.6)" }}
      >
        {lang === "fr"
          ? "La liste des institutions, fintechs et entreprises présentes à la 2ᵉ édition est en cours de finalisation. Revenez bientôt pour la découvrir."
          : "The list of institutions, fintechs and companies attending the 2nd edition is being finalized. Come back soon to discover it."}
      </p>
      <Link
        to="/inscription?type=exposant"
        className="group inline-flex items-center gap-2.5 text-[13px] font-bold transition-colors hover:text-[#D49B0F]"
        style={{ color: INK }}
      >
        <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
          {lang === "fr" ? "Réserver un stand maintenant" : "Book a stand now"}
        </span>
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: BRONZE }}
        />
      </Link>
    </div>
  );
}

export default function Exposants() {
  const { t, lang } = useLanguage();
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("all");
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .exhibitors()
      .then(setExhibitors)
      .catch((err) => {
        console.error("API Error:", err);
        setApiError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      sector === "all"
        ? exhibitors
        : exhibitors.filter((e) => e.sector === sector),
    [exhibitors, sector]
  );

  const availableSectors = useMemo(
    () => ["all", ...new Set(exhibitors.map((e) => e.sector).filter(Boolean))],
    [exhibitors]
  );

  const totalSectors = availableSectors.length - 1;
  const totalStands = useMemo(
    () => new Set(exhibitors.map((e) => e.stand).filter(Boolean)).size,
    [exhibitors]
  );

  return (
    <div data-testid="exhibitors-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("exhibitors.eyebrow")}
        title={t("exhibitors.title")}
        subtitle={t("exhibitors.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* EN-TÊTE ÉDITORIAL */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span
              className="text-[10px] uppercase tracking-[0.28em] whitespace-nowrap font-bold"
              style={{ color: BRONZE }}
            >
              {lang === "fr" ? "Sur le salon" : "At the show"}
            </span>
            {exhibitors.length > 0 && (
              <>
                <span className="flex-1 h-px" style={{ backgroundColor: RULE }} />
                <span
                  className="font-mono-num text-[11px] uppercase tracking-[0.15em] whitespace-nowrap font-semibold"
                  style={{ color: "rgba(12,45,82,0.45)" }}
                >
                  {filtered.length} {lang === "fr" ? "Exposants" : "Exhibitors"}
                </span>
              </>
            )}
          </div>

          <h2
            className="font-serif font-extrabold tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.1] mb-5 break-words"
            style={{ color: INK }}
          >
            {lang === "fr" ? "Ils exposent au SEIM" : "They exhibit at SEIM"}
          </h2>

          <p
            className="font-serif italic text-[15px] sm:text-[16px] leading-[1.75] max-w-2xl mb-12"
            style={{ color: "rgba(12,45,82,0.65)" }}
          >
            {lang === "fr"
              ? "Institutions financières, fintechs, cabinets et médias spécialisés — découvrez les acteurs qui font vivre l'écosystème économique africain sur les deux jours du salon."
              : "Financial institutions, fintechs, firms and specialized media — discover the players driving Africa's economic ecosystem across the two days of the show."}
          </p>

          {/* INDICATEURS INLINE */}
          {exhibitors.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-x-10 sm:gap-x-16 gap-y-6 pb-8 border-b mb-10"
              style={{ borderColor: RULE }}
            >
              <div>
                <p className="font-serif font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {exhibitors.length}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(12,45,82,0.5)" }}>
                  {lang === "fr" ? "Exposants" : "Exhibitors"}
                </p>
              </div>

              <span className="hidden sm:block w-px h-10" style={{ backgroundColor: RULE }} />

              <div>
                <p className="font-serif font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {totalSectors}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(12,45,82,0.5)" }}>
                  {lang === "fr" ? "Secteurs" : "Sectors"}
                </p>
              </div>

              <span className="hidden sm:block w-px h-10" style={{ backgroundColor: RULE }} />

              <div>
                <p className="font-serif font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {totalStands || "—"}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(12,45,82,0.5)" }}>
                  {lang === "fr" ? "Stands" : "Stands"}
                </p>
              </div>
            </div>
          )}

          {/* Filtres secteur */}
          {exhibitors.length > 0 && availableSectors.length > 1 && (
            <div
              className="flex flex-wrap gap-x-6 gap-y-4 mb-10"
              data-testid="exhibitor-sector-filters"
            >
              {availableSectors.map((s) => {
                const active = sector === s;
                return (
                  <button
                    key={s}
                    data-testid={`exhibitor-filter-${s}`}
                    onClick={() => setSector(s)}
                    className={`text-[11px] uppercase tracking-[0.18em] font-bold pb-1 border-b-2 transition-colors ${
                      active
                        ? "border-[#D49B0F]"
                        : "border-transparent hover:text-[#0C2D52]"
                    }`}
                    style={{ color: active ? INK : "rgba(12,45,82,0.45)" }}
                  >
                    {t(`exhibitors.sectors.${s}`)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Grille / états */}
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif italic text-[15px]" style={{ color: "rgba(12,45,82,0.6)" }}>
                {lang === "fr" ? "Chargement des exposants..." : "Loading exhibitors..."}
              </p>
            </div>
          ) : apiError ? (
            <div className="py-16 text-center border-y" style={{ borderColor: RULE }}>
              <p className="font-serif italic text-[15px]" style={{ color: "rgba(12,45,82,0.6)" }}>
                {lang === "fr"
                  ? "Impossible de charger les exposants pour le moment."
                  : "Unable to load exhibitors at this time."}
              </p>
            </div>
          ) : exhibitors.length === 0 ? (
            <EmptyState lang={lang} />
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center border-y" style={{ borderColor: RULE }}>
              <p className="font-serif italic text-[15px]" style={{ color: "rgba(12,45,82,0.6)" }}>
                {lang === "fr"
                  ? "Aucun exposant dans ce secteur pour le moment."
                  : "No exhibitors in this sector yet."}
              </p>
              <button
                onClick={() => setSector("all")}
                className="mt-6 group inline-flex items-center gap-2 text-[13px] font-bold transition-colors hover:text-[#D49B0F]"
                style={{ color: INK }}
              >
                <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
                  {lang === "fr" ? "Voir tous les exposants" : "View all exhibitors"}
                </span>
                <ArrowUpRight size={14} style={{ color: BRONZE }} />
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filtered.map((e, index) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
                >
                  <ExhibitorCard exhibitor={e} lang={lang} t={t} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA FINAL */}
          {exhibitors.length > 0 && (
            <Reveal delay={0.1}>
              <div
                className="mt-20 p-8 sm:p-12 lg:p-16 relative overflow-hidden"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                <div className="seim-pattern" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: GOLD }} />
                <div className="relative max-w-2xl mt-4">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px" style={{ backgroundColor: GOLD }} />
                    <span className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: GOLD }}>
                      {lang === "fr" ? "Rejoignez le salon" : "Join the show"}
                    </span>
                  </div>

                  <h3
                    className="font-serif font-extrabold tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.1] mb-4 break-words"
                    style={{ color: PAPER }}
                  >
                    {t("exhibitors.become")}
                  </h3>

                  <p
                    className="font-serif italic text-[15px] leading-[1.7] mb-10"
                    style={{ color: "rgba(242,244,246,0.7)" }}
                  >
                    {t("partners.form.desc")}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/inscription?type=exposant"
                      data-testid="become-exhibitor-button"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: PAPER, color: INK }}
                    >
                      {lang === "fr" ? "Réserver un stand" : "Book a stand"}
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: GOLD }}
                      />
                    </Link>
                    <Link
                      to="/inscription?type=partenaire"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-bold border transition-colors hover:bg-white/5"
                      style={{ borderColor: "rgba(242,244,246,0.25)", color: PAPER }}
                    >
                      {lang === "fr" ? "Devenir partenaire" : "Become a partner"}
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: GOLD }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}