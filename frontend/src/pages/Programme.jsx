import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown, CalendarDays, Users } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F"; // Jaune assombri pour lisibilité
const GOLD = "#F7B731";   // Jaune exact du logo
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";
const EASE = [0.22, 1, 0.36, 1];

/* Ordre stable des filtres */
const FILTER_ORDER = [
  "all",
  "keynote",
  "panel",
  "masterclass",
  "ceo-talk",
  "young-ceo-talk",
  "atelier",
  "networking",
  "ceremonie",
  "accueil",
  "pause",
];

/* ---------- Skeleton (avec liseré doré pour correspondre au design) ---------- */
function Skeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse border border-r-4 border-r-[#D49B0F] rounded-sm"
          style={{ backgroundColor: RULE_LIGHT, borderColor: RULE }}
        />
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ lang, hasFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="py-20 text-center border-y"
      style={{ borderColor: RULE }}
    >
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <CalendarDays size={32} strokeWidth={1} />
      </div>
      <h3 className="font-sans font-extrabold text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {hasFilter
          ? lang === "fr"
            ? "Aucune session pour cette sélection"
            : "No session for this selection"
          : lang === "fr"
          ? "Programme en cours de finalisation"
          : "Program being finalized"}
      </h3>
      <p
        className="font-sans italic text-[15px] max-w-md mx-auto leading-relaxed font-medium"
        style={{ color: "rgba(12,45,82,0.7)" }}
      >
        {hasFilter
          ? lang === "fr"
            ? "Essayez un autre type de session ou changez de journée."
            : "Try another session type or switch days."
          : lang === "fr"
          ? "Le programme détaillé de cette journée sera publié prochainement. Revenez bientôt."
          : "The detailed schedule for this day will be published soon. Come back shortly."}
      </p>
    </motion.div>
  );
}

export default function Programme() {
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(1);
  const [type, setType] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    Promise.all([
      api.program().then(setSessions).catch(() => {}),
      api.speakers().then(setSpeakers).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const spMap = useMemo(
    () => Object.fromEntries(speakers.map((s) => [s.id, s])),
    [speakers]
  );

  const availableDays = useMemo(() => {
    const days = new Set(sessions.map((s) => s.day).filter(Boolean));
    return days.size > 0 ? Array.from(days).sort((a, b) => a - b) : [1, 2];
  }, [sessions]);

  const availableFilters = useMemo(() => {
    const typesInDay = new Set(
      sessions.filter((s) => s.day === day).map((s) => s.type)
    );
    return FILTER_ORDER.filter((f) => f === "all" || typesInDay.has(f));
  }, [sessions, day]);

  const filtered = sessions.filter(
    (s) => s.day === day && (type === "all" || s.type === type)
  );

  const dayHasSessions = sessions.some((s) => s.day === day);
  const countByDay = (d) => sessions.filter((s) => s.day === d).length;

  const uniqueSpeakersInDay = useMemo(() => {
    const ids = new Set();
    sessions
      .filter((s) => s.day === day)
      .forEach((s) => (s.speakers || []).forEach((id) => ids.add(id)));
    return ids.size;
  }, [sessions, day]);

  useEffect(() => {
    if (type !== "all" && !availableFilters.includes(type)) {
      setType("all");
    }
  }, [availableFilters, type]);

  return (
    <div data-testid="program-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("program.eyebrow")}
        title={t("program.title")}
        subtitle={t("program.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          
          {/* En-tête */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>
              {lang === "fr" ? "Planning" : "Schedule"}
            </span>
            {sessions.length > 0 && (
              <>
                <span className="flex-1 h-px" style={{ backgroundColor: RULE }} />
                <span className="font-mono-num text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: "rgba(12,45,82,0.55)" }}>
                  {sessions.length} {lang === "fr" ? "Sessions" : "Sessions"}
                </span>
              </>
            )}
          </div>

          <h2 className="font-sans font-extrabold tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.1] mb-10" style={{ color: INK }}>
            {lang === "fr" ? "Déroulé des deux journées" : "Two-day schedule"}
          </h2>

          {/* Bandeau indicateurs — ledger */}
          {sessions.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-10 sm:gap-x-16 gap-y-6 pb-8 border-b mb-10" style={{ borderColor: RULE }}>
              <div>
                <p className="font-sans font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {countByDay(day)}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(12,45,82,0.55)" }}>
                  {lang === "fr" ? "Sessions" : "Sessions"}
                </p>
              </div>

              <span className="hidden sm:block w-px h-10" style={{ backgroundColor: RULE }} />

              <div>
                <p className="font-sans font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {uniqueSpeakersInDay}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(12,45,82,0.55)" }}>
                  {lang === "fr" ? "Intervenants" : "Speakers"}
                </p>
              </div>

              <span className="hidden sm:block w-px h-10" style={{ backgroundColor: RULE }} />

              <div>
                <p className="font-sans font-extrabold text-3xl sm:text-4xl leading-none tracking-[-0.04em]" style={{ color: INK }}>
                  {availableDays.length}
                </p>
                <p className="mt-2 font-mono-num text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(12,45,82,0.55)" }}>
                  {lang === "fr"
                    ? availableDays.length > 1
                      ? "Journées"
                      : "Journée"
                    : availableDays.length > 1
                    ? "Days"
                    : "Day"}
                </p>
              </div>
            </div>
          )}

          {/* Tabs jour */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6" data-testid="program-day-tabs">
            {availableDays.map((d) => {
              const active = day === d;
              const count = countByDay(d);
              return (
                <button
                  key={d}
                  data-testid={`program-day-${d}-tab`}
                  onClick={() => {
                    setDay(d);
                    setOpenId(null);
                  }}
                  className={`text-[11px] uppercase tracking-[0.18em] font-bold pb-1 border-b-2 transition-colors ${
                    active
                      ? "border-[#D49B0F]"
                      : "border-transparent hover:text-[#0C2D52]"
                  }`}
                  style={{ color: active ? INK : "rgba(12,45,82,0.45)" }}
                >
                  {d === 1 ? t("program.day1") : t("program.day2")}
                  {count > 0 && (
                    <span className="ml-2 font-mono-num text-[10px]" style={{ color: BRONZE }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filtres type */}
          {availableFilters.length > 1 && (
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10" data-testid="program-type-filters">
              {availableFilters.map((f) => {
                const active = type === f;
                return (
                  <button
                    key={f}
                    data-testid={`program-filter-${f}`}
                    onClick={() => setType(f)}
                    className={`text-[10px] uppercase tracking-[0.18em] font-bold pb-1 border-b-2 transition-colors ${
                      active
                        ? "border-[#D49B0F]"
                        : "border-transparent hover:text-[#0C2D52]"
                    }`}
                    style={{ color: active ? INK : "rgba(12,45,82,0.45)" }}
                  >
                    {t(`program.types.${f}`)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Contenu */}
          {loading ? (
            <Skeleton />
          ) : !dayHasSessions ? (
            <EmptyState lang={lang} hasFilter={false} />
          ) : filtered.length === 0 ? (
            <EmptyState lang={lang} hasFilter={true} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${day}-${type}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-col gap-4" // Liste verticale (accordéon)
              >
                {filtered.map((s, i) => {
                  const isOpen = openId === s.id;
                  const sSpeakers = (s.speakers || [])
                    .map((id) => spMap[id])
                    .filter(Boolean);

                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                      data-testid={`session-card-${s.id}`}
                      className="bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md rounded-sm overflow-hidden"
                      style={{ 
                        border: `1px solid ${RULE}`,
                        borderLeft: `4px solid ${BRONZE}` // Liseré doré SEIM
                      }}
                    >
                      <button
                        data-testid={`session-toggle-${s.id}`}
                        onClick={() => setOpenId(isOpen ? null : s.id)}
                        className="relative w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6"
                      >
                        {/* Heure */}
                        <div className="font-mono-num text-xs sm:text-sm font-bold sm:w-24 shrink-0 flex sm:block items-center gap-2" style={{ color: BRONZE }}>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} /> {s.time}
                          </span>
                          {s.end && (
                            <span className="text-[11px] sm:text-xs sm:ml-[18px] font-medium" style={{ color: "rgba(12,45,82,0.5)" }}>
                              → {s.end}
                            </span>
                          )}
                        </div>

                        {/* Titre + salle */}
                        <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                          <h3
                            className={`font-sans font-extrabold text-base sm:text-lg leading-snug transition-colors tracking-tight break-words`}
                            style={{ color: isOpen ? BRONZE : INK }}
                          >
                            {lang === "fr" ? s.title_fr : s.title_en}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            <p className="text-[12px] flex items-center gap-1.5 font-medium" style={{ color: "rgba(12,45,82,0.65)" }}>
                              <MapPin size={12} className="shrink-0" />
                              <span className="break-words">
                                {lang === "fr" ? s.room_fr : s.room_en}
                              </span>
                            </p>
                            <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: BRONZE }}>
                              {t(`program.types.${s.type}`)}
                            </span>
                          </div>
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform duration-300 ml-auto sm:ml-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          style={{ color: isOpen ? BRONZE : "rgba(12,45,82,0.4)" }}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-6">
                              <div className="pt-4 border-t" style={{ borderColor: RULE }}>
                                {(lang === "fr" ? s.desc_fr : s.desc_en) && (
                                  <p className="font-sans text-[14px] leading-[1.75] font-medium" style={{ color: "rgba(12,45,82,0.75)" }}>
                                    {lang === "fr" ? s.desc_fr : s.desc_en}
                                  </p>
                                )}
                                {sSpeakers.length > 0 && (
                                  <div className="mt-5">
                                    <p className="text-[9px] uppercase tracking-[0.24em] mb-3 flex items-center gap-2 font-bold" style={{ color: BRONZE }}>
                                      <Users size={12} />
                                      {lang === "fr"
                                        ? sSpeakers.length > 1
                                          ? "Intervenants"
                                          : "Intervenant"
                                        : sSpeakers.length > 1
                                        ? "Speakers"
                                        : "Speaker"}
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                                      {sSpeakers.map((sp) => (
                                        <div key={sp.id} className="flex items-center py-1">
                                          <p className="text-[13px] font-bold font-sans" style={{ color: INK }}>
                                            {sp.name}
                                          </p>
                                          {sp.company && (
                                            <p className="text-[11px] ml-1.5 font-sans font-medium" style={{ color: "rgba(12,45,82,0.6)" }}>
                                              — {sp.company}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}