import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SpeakerCard } from "../components/SpeakerCard";
import { SpeakerModal } from "../components/SpeakerModal";
import { Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";

/* ---------- Skeleton ---------- */
function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-pulse border"
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
      <h3 className="font-serif text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les intervenants seront annoncés prochainement"
          : "Speakers will be announced soon"}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(12,45,82,0.55)" }}
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
          
          {/* En-tête de section — masqué si empty state pour ne pas faire doublon */}
          {!loading && speakers.length > 0 && (
            <div className="mb-12 sm:mb-16">
              {/* Ligne eyebrow + compteur */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                <span
                  className="text-[10px] uppercase tracking-[0.28em] whitespace-nowrap"
                  style={{ color: BRONZE }}
                >
                  {lang === "fr" ? "Le casting" : "The line-up"}
                </span>
                <span className="flex-1 h-px" style={{ backgroundColor: RULE }} />
                <span
                  className="font-mono-num text-[11px] uppercase tracking-[0.15em] whitespace-nowrap"
                  style={{ color: "rgba(12,45,82,0.4)" }}
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
                className="font-serif tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.1] break-words max-w-3xl"
                style={{ color: INK }}
              >
                {lang === "fr"
                  ? "Les intervenants du SEIM"
                  : "SEIM speakers"}
              </h2>

              {/* Description éditoriale */}
              <p
                className="font-serif italic text-[15px] sm:text-[16px] leading-[1.75] max-w-2xl mt-5"
                style={{ color: "rgba(12,45,82,0.6)" }}
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-14"
            >
              {speakers.map((sp) => (
                <StaggerItem key={sp.id}>
                  <SpeakerCard speaker={sp} onOpen={setSelected} />
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