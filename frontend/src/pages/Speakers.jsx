import { useEffect, useState } from "react";
import { UserRound, ArrowRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SpeakerModal } from "../components/SpeakerModal";
import { Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F"; // Jaune assombri pour lisibilité
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";

const getRole = (sp, lang) =>
  (lang === "fr" ? sp?.role_fr : sp?.role_en) || sp?.role || "";

/* ---------- Carte Intervenant (Nouveau Design) ---------- */
function LocalSpeakerCard({ speaker, lang, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(speaker)}
      className="group relative flex flex-col justify-between p-4 sm:p-6 lg:p-7 h-full text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white rounded-sm"
      style={{ 
        border: `1px solid ${RULE}`,
        borderLeft: `4px solid ${BRONZE}` // Liseré doré SEIM
      }}
    >
      <div>
        {/* Rôle */}
        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] mb-2 sm:mb-3 font-bold line-clamp-2" style={{ color: BRONZE }}>
          {getRole(speaker, lang)}
        </p>
        
        {/* Nom */}
        <h3 className="font-sans font-extrabold text-lg sm:text-xl lg:text-2xl leading-tight mb-1 sm:mb-2" style={{ color: INK }}>
          {speaker.name}
        </h3>
        
        {/* Entreprise */}
        {speaker.company && (
          <p className="font-sans text-[11px] sm:text-[13px] text-[#0C2D52]/60 italic font-medium line-clamp-2">
            {speaker.company}
          </p>
        )}
      </div>
      
      {/* Indicateur visuel au survol */}
      <div className="mt-4 sm:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: INK }}>
          {lang === "fr" ? "Voir le profil" : "View profile"}
        </span>
        <ArrowRight size={12} style={{ color: BRONZE }} />
      </div>
    </button>
  );
}

/* ---------- Skeleton (adapté au nouveau design) ---------- */
function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="h-40 sm:h-48 animate-pulse border border-r-4 border-r-[#D49B0F] rounded-sm"
          style={{ backgroundColor: RULE_LIGHT, borderColor: RULE }}
        />
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ lang }) {
  return (
    <div
      className="py-20 text-center border-y"
      style={{ borderColor: RULE }}
    >
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <UserRound size={32} strokeWidth={1} />
      </div>
      <h3 className="font-sans font-extrabold text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les intervenants seront annoncés prochainement"
          : "Speakers will be announced soon"}
      </h3>
      <p
        className="font-sans italic text-[15px] max-w-lg mx-auto leading-relaxed font-medium"
        style={{ color: "rgba(12,45,82,0.7)" }}
      >
        {lang === "fr"
          ? "Le casting des experts et personnalités de la 2ᵉ édition est en cours de finalisation. Revenez bientôt pour les découvrir."
          : "The cast of experts and personalities of the 2nd edition is being finalized. Come back soon to discover them."}
      </p>
    </div>
  );
}

export default function Speakers() {
  const { t, lang } = useLanguage();
  const [speakers, setSpeakers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .speakers()
      .then(setSpeakers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="speakers-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("speakers.eyebrow")}
        title={t("speakers.title")}
        subtitle={t("speakers.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* En-tête de section */}
          {!loading && speakers.length > 0 && (
            <div className="mb-12 sm:mb-16">
              {/* Ligne eyebrow + compteur */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                <span
                  className="text-[10px] uppercase tracking-[0.28em] whitespace-nowrap font-bold"
                  style={{ color: BRONZE }}
                >
                  {lang === "fr" ? "Le casting" : "The line-up"}
                </span>
                <span className="flex-1 h-px" style={{ backgroundColor: RULE }} />
                <span
                  className="font-mono-num text-[11px] uppercase tracking-[0.15em] whitespace-nowrap font-bold"
                  style={{ color: "rgba(12,45,82,0.55)" }}
                >
                  {speakers.length}{" "}
                  {lang === "fr"
                    ? speakers.length > 1
                      ? "Intervenants"
                      : "Intervenant"
                    : speakers.length > 1
                    ? "Speakers"
                    : "Speaker"}
                </span>
              </div>

              {/* Titre principal */}
              <h2
                className="font-sans font-extrabold tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.1] break-words max-w-3xl"
                style={{ color: INK }}
              >
                {lang === "fr"
                  ? "Les intervenants du SEIM"
                  : "SEIM speakers"}
              </h2>

              {/* Description */}
              <p
                className="font-sans italic text-[15px] sm:text-[16px] leading-[1.75] max-w-2xl mt-5 font-medium"
                style={{ color: "rgba(12,45,82,0.75)" }}
              >
                {lang === "fr"
                  ? "Experts, décideurs, entrepreneurs et personnalités du monde économique — une sélection de voix qui structurent l'écosystème africain."
                  : "Experts, decision-makers, entrepreneurs and personalities from the economic world — a selection of voices that shape the African ecosystem."}
              </p>
            </div>
          )}

          {/* Contenu */}
          {loading ? (
            <Skeleton />
          ) : speakers.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <Stagger
              key={speakers.length}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {speakers.map((sp) => (
                <StaggerItem key={sp.id}>
                  <LocalSpeakerCard speaker={sp} lang={lang} onOpen={setSelected} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  );
}