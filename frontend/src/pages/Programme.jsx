import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

const TYPE_STYLES = {
  keynote: "bg-gold text-navy",
  panel: "bg-navy text-white",
  masterclass: "bg-emerald-600 text-white",
  "ceo-talk": "bg-amber-100 text-amber-800 border border-amber-300",
  "young-ceo-talk": "bg-amber-100 text-amber-800 border border-amber-300",
  atelier: "bg-sky-100 text-sky-800 border border-sky-300",
  webtv: "bg-rose-100 text-rose-800 border border-rose-300",
  networking: "bg-navy-soft text-white",
  ceremonie: "bg-navy text-gold",
  accueil: "bg-navy/5 text-navy/70",
  pause: "bg-navy/5 text-navy/70",
};

const FILTERS = ["all", "keynote", "panel", "masterclass", "ceo-talk", "young-ceo-talk", "atelier", "webtv", "networking", "ceremonie"];

export default function Programme() {
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [day, setDay] = useState(1);
  const [type, setType] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.program().then(setSessions).catch(() => {});
    api.speakers().then(setSpeakers).catch(() => {});
  }, []);

  const spMap = useMemo(() => Object.fromEntries(speakers.map((s) => [s.id, s])), [speakers]);
  const filtered = sessions.filter((s) => s.day === day && (type === "all" || s.type === type));

  return (
    <div data-testid="program-page">
      <PageHero eyebrow={t("program.eyebrow")} title={t("program.title")} subtitle={t("program.subtitle")} />

      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-3 mb-4" data-testid="program-day-tabs">
            {[1, 2].map((d) => (
              <button
                key={d}
                data-testid={`program-day-${d}-tab`}
                onClick={() => setDay(d)}
                className={`px-6 py-3 rounded-full font-display font-bold text-sm transition-all ${
                  day === d ? "bg-navy text-gold shadow-lg shadow-navy/20" : "bg-white text-navy/60 border border-navy/15 hover:border-gold"
                }`}
              >
                {d === 1 ? t("program.day1") : t("program.day2")}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-10" data-testid="program-type-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                data-testid={`program-filter-${f}`}
                onClick={() => setType(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  type === f ? "bg-gold text-navy" : "bg-white text-navy/50 border border-navy/10 hover:border-gold/60"
                }`}
              >
                {t(`program.types.${f}`)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${day}-${type}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {filtered.map((s) => {
                const isOpen = openId === s.id;
                const sSpeakers = (s.speakers || []).map((id) => spMap[id]).filter(Boolean);
                return (
                  <div
                    key={s.id}
                    data-testid={`session-card-${s.id}`}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen ? "border-gold shadow-xl shadow-navy/10" : "border-navy/10 hover:border-gold/50 hover:shadow-lg"
                    }`}
                  >
                    <button
                      data-testid={`session-toggle-${s.id}`}
                      onClick={() => setOpenId(isOpen ? null : s.id)}
                      className="w-full text-left p-5 sm:p-7 flex flex-wrap items-center gap-x-6 gap-y-3"
                    >
                      <div className="font-mono-num text-sm font-semibold text-gold-dark w-24 shrink-0">
                        <span className="flex items-center gap-1.5"><Clock size={13} /> {s.time}</span>
                        <span className="text-navy/35 text-xs ml-[18px]">{s.end}</span>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="font-display font-bold text-navy text-base sm:text-lg leading-snug">
                          {lang === "fr" ? s.title_fr : s.title_en}
                        </h3>
                        <p className="text-navy/45 text-xs mt-1.5 flex items-center gap-1.5">
                          <MapPin size={12} /> {lang === "fr" ? s.room_fr : s.room_en}
                        </p>
                      </div>
                      <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${TYPE_STYLES[s.type] || TYPE_STYLES.panel}`}>
                        {t(`program.types.${s.type}`)}
                      </span>
                      <ChevronDown size={18} className={`text-navy/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-7 pb-6 pt-1 border-t border-navy/8">
                            <p className="text-navy/65 text-sm leading-relaxed mt-4">
                              {lang === "fr" ? s.desc_fr : s.desc_en}
                            </p>
                            {sSpeakers.length > 0 && (
                              <div className="mt-5 flex flex-wrap gap-3">
                                {sSpeakers.map((sp) => (
                                  <div key={sp.id} className="flex items-center gap-2.5 bg-bone rounded-full pl-1.5 pr-4 py-1.5 border border-navy/10">
                                    {sp.photo ? (
                                      <img src={sp.photo} alt={sp.name} className="w-8 h-8 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                                    ) : (
                                      <span className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[10px] font-bold text-gold">
                                        {sp.name.split(" ").map((n) => n[0]).join("")}
                                      </span>
                                    )}
                                    <div className="leading-tight">
                                      <p className="text-xs font-bold text-navy">{sp.name}</p>
                                      <p className="text-[10px] text-navy/50">{sp.company}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
