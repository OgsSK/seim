import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F"; // Jaune assombri pour lisibilité
const GOLD = "#F7B731";   // Jaune exact du logo
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";

const TIER_ORDER = [
  "principal",
  "or",
  "argent",
  "institutionnel",
  "media",
  "technique",
];

/* ---------- Empty state ---------- */
function EmptyState({ lang }) {
  return (
    <div
      className="py-20 text-center border-y"
      style={{ borderColor: RULE }}
      data-testid="partners-empty"
    >
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <Handshake size={32} strokeWidth={1} />
      </div>
      <h3 className="font-serif font-extrabold text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les partenaires seront annoncés prochainement"
          : "Partners will be announced soon"}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(12,45,82,0.6)" }}
      >
        {lang === "fr"
          ? "La liste des partenaires et sponsors de la 2ᵉ édition est en cours de finalisation."
          : "The list of partners and sponsors of the 2nd edition is being finalized."}
      </p>
    </div>
  );
}

/* ---------- Carte partenaire — logo si dispo, sinon texte ---------- */
function PartnerCard({ partner, tier, lang }) {
  const hasLogo = Boolean(partner.logo);

  // ============================================================
  // TIER PRINCIPAL — carte premium horizontale
  // ============================================================
  if (tier === "principal") {
    const role = lang === "fr" ? partner.role_fr : partner.role_en;

    return (
      <div
        data-testid={`partner-logo-${partner.id}`}
        className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center"
      >
        {/* Logo XL dans une carte blanche élégante */}
        {hasLogo && (
          <div
            className="bg-white border shadow-sm flex items-center justify-center mx-auto sm:mx-0 shrink-0"
            style={{
              borderColor: RULE,
              width: "180px",
              height: "140px",
              padding: "20px",
            }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* Nom + description */}
        <div className="text-center sm:text-left">
          {/* Nom en très grande taille */}
          <p
            className="font-serif font-extrabold tracking-[-0.03em] text-4xl sm:text-5xl lg:text-6xl leading-[0.95]"
            style={{ color: INK }}
          >
            {partner.name}
          </p>

          {/* Description du rôle - MIS EN GRAS (font-semibold) */}
          {role && (
            <p
              className="mt-3 sm:mt-4 font-serif italic text-[15px] sm:text-base lg:text-lg leading-[1.5] max-w-xl mx-auto sm:mx-0 font-semibold"
              style={{ color: "rgba(12,45,82,0.75)" }}
            >
              {role}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTRES TIERS
  // ============================================================
  const tierSizes = {
    or: { logo: "h-14 sm:h-16", name: "text-xl sm:text-2xl lg:text-3xl" },
    argent: { logo: "h-12 sm:h-14", name: "text-lg sm:text-xl lg:text-2xl" },
    institutionnel: { logo: "h-10 sm:h-12", name: "text-base sm:text-lg lg:text-xl" },
    media: { logo: "h-10 sm:h-12", name: "text-base sm:text-lg" },
    technique: { logo: "h-9 sm:h-10", name: "text-sm sm:text-base" },
  };
  const sizing = tierSizes[tier] || tierSizes.technique;

  return (
    <div
      data-testid={`partner-logo-${partner.id}`}
      className="flex flex-col items-center text-center gap-2"
    >
      {hasLogo ? (
        <>
          <div
            className="bg-white rounded p-2 border shrink-0 flex items-center justify-center"
            style={{ borderColor: RULE, width: "120px", height: "80px" }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className={`${sizing.logo} w-auto max-w-full object-contain`}
              loading="lazy"
            />
          </div>
          <p
            className="font-serif font-bold text-[13px] sm:text-sm leading-tight tracking-tight max-w-[140px]"
            style={{ color: INK }}
          >
            {partner.name}
          </p>
        </>
      ) : (
        <p
          className={`font-serif font-extrabold ${sizing.name} tracking-[-0.01em] leading-tight flex items-baseline gap-2`}
          style={{ color: INK }}
        >
          <span
            className="font-serif italic shrink-0 leading-none"
            style={{ color: BRONZE }}
          >
            ·
          </span>
          {partner.name}
        </p>
      )}
    </div>
  );
}

export default function Partenaires() {
  const { t, lang } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .partners()
      .then(setPartners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="partners-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("partners.eyebrow")}
        title={t("partners.title")}
        subtitle={t("partners.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16 sm:space-y-24">

          {/* ============ Liste des partenaires par tiers ============ */}
          {loading ? (
            <div className="space-y-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 w-32 animate-pulse" style={{ backgroundColor: RULE_LIGHT }} />
                  <div className="h-10 w-3/4 animate-pulse" style={{ backgroundColor: RULE_LIGHT }} />
                </div>
              ))}
            </div>
          ) : partners.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            TIER_ORDER.map((tier) => {
              const list = partners.filter((p) => p.tier === tier);
              if (!list.length) return null;

              // Le tier "principal" a un layout dédié
              if (tier === "principal") {
                return (
                  <div key={tier} data-testid={`partner-tier-${tier}`}>
                    <Reveal>
                      <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <span
                          className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.24em] whitespace-nowrap font-bold"
                          style={{ color: BRONZE }}
                        >
                          {t(`partners.tiers.${tier}`)}
                        </span>
                        <span className="h-px flex-1" style={{ backgroundColor: RULE }} />
                      </div>
                    </Reveal>

                    <Stagger
                      key={list.length + tier}
                      className="flex flex-col gap-8"
                    >
                      {list.map((p) => (
                        <StaggerItem key={p.id}>
                          <PartnerCard partner={p} tier={tier} lang={lang} />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                );
              }

              // Les autres tiers : grille flexible
              return (
                <div key={tier} data-testid={`partner-tier-${tier}`}>
                  <Reveal>
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <span
                        className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.24em] whitespace-nowrap font-bold"
                        style={{ color: BRONZE }}
                      >
                        {t(`partners.tiers.${tier}`)}
                      </span>
                      <span className="h-px flex-1" style={{ backgroundColor: RULE }} />
                    </div>
                  </Reveal>

                  <Stagger
                    key={list.length + tier}
                    className="flex flex-wrap items-start gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8"
                  >
                    {list.map((p) => (
                      <StaggerItem key={p.id}>
                        <PartnerCard partner={p} tier={tier} lang={lang} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              );
            })
          )}

          {/* ============ Bloc devenir partenaire ============ */}
          <Reveal>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 pt-12 border-t" style={{ borderColor: RULE }}>
              
              {/* Colonne texte (Gauche) */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>
                    {lang === "fr" ? "Partenariat" : "Partnership"}
                  </span>
                </div>

                <h2 className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-3xl lg:text-[2.4rem] leading-[1.1] mb-5" style={{ color: INK }}>
                  {t("partners.form.title")}
                </h2>

                {/* Description - MIS EN GRAS (font-semibold) */}
                <p className="font-serif italic text-[14px] sm:text-[15px] leading-[1.75] mb-8 font-semibold" style={{ color: "rgba(12,45,82,0.75)" }}>
                  {t("partners.form.desc")}
                </p>

                <div className="space-y-3">
                  {[
                    "Visibilité premium sur tous les supports",
                    "Stand dans l'espace expo",
                    "Prise de parole sur scène",
                  ].map((f, i) => (
                    <p key={i} className="flex items-start gap-3 text-[13px] sm:text-[14px] leading-[1.6] font-semibold" style={{ color: "rgba(12,45,82,0.85)" }}>
                      <span className="w-1.5 h-1.5 rotate-45 shrink-0 mt-1.5" style={{ backgroundColor: BRONZE }} />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Colonne action (Droite) */}
              <div className="lg:col-span-6 flex">
                <div
                  data-testid="sponsorship-cta"
                  className="relative overflow-hidden w-full p-8 sm:p-10 flex flex-col justify-between gap-10"
                  style={{ backgroundColor: INK, color: PAPER }}
                >
                  <div className="seim-pattern" aria-hidden="true" />
                  <div className="relative">
                    <Handshake size={28} strokeWidth={1.25} style={{ color: GOLD }} />
                    <p className="mt-6 font-serif font-extrabold text-xl sm:text-2xl leading-[1.3]">
                      {lang === "fr"
                        ? "Inscrivez-vous comme partenaire ou sponsor : votre demande arrive directement à l'équipe SEIM sur WhatsApp."
                        : "Register as a partner or sponsor: your request goes straight to the SEIM team on WhatsApp."}
                    </p>
                  </div>
                  <Link
                    to="/inscription?type=partenaire"
                    data-testid="sponsor-submit-button"
                    className="relative group inline-flex justify-center items-center gap-2 sm:gap-3 w-full sm:w-auto self-start px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: GOLD, color: INK }}
                  >
                    {t("partners.become")}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}