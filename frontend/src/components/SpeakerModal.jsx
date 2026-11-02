import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.12)";
const FALLBACK_BG = "#ebe5d8";

export function SpeakerModal({ speaker, onClose }) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!speaker) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [speaker]);

  const initials = speaker?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {speaker && (
        <motion.div
          data-testid="speaker-modal"
          role="dialog"
          aria-modal="true"
          aria-label={speaker.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(18,17,15,0.8)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-none shadow-2xl"
            style={{ backgroundColor: PAPER, paddingBottom: "env(safe-area-inset-bottom)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <span className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(18,17,15,0.15)" }} />
            </div>

            {/* En-tête Typographique */}
            <div className="relative h-56 sm:h-72 shrink-0 flex flex-col items-center justify-center" style={{ backgroundColor: FALLBACK_BG }}>
              <div className="absolute top-6 left-6 right-6 flex justify-between opacity-30">
                <span className="w-5 h-px" style={{ backgroundColor: BRONZE }} />
                <span className="w-5 h-px" style={{ backgroundColor: BRONZE }} />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between opacity-30">
                <span className="w-5 h-px" style={{ backgroundColor: BRONZE }} />
                <span className="w-5 h-px" style={{ backgroundColor: BRONZE }} />
              </div>

              <span className="font-serif text-7xl sm:text-8xl tracking-[-0.03em]" style={{ color: BRONZE }}>
                {initials}
              </span>
              
              <span className="font-mono-num text-[10px] uppercase tracking-[0.3em] mt-4 opacity-50" style={{ color: INK }}>
                SEIM · ÉDITION 02
              </span>

              {/* Bouton fermer */}
              <button
                type="button"
                data-testid="speaker-modal-close"
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 sm:w-9 sm:h-9 border flex items-center justify-center transition-colors hover:bg-black/5"
                style={{ borderColor: RULE, color: INK }}
                aria-label={t("common.close")}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nom & Rôle */}
            <div className="px-6 sm:px-10 pt-6 pb-4 border-b" style={{ borderColor: RULE }}>
              <h3 className="font-serif text-2xl sm:text-4xl leading-tight tracking-[-0.02em]" style={{ color: INK }}>
                {speaker.name}
              </h3>
              <p className="font-mono-num text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-3" style={{ color: BRONZE }}>
                {lang === "fr" ? speaker.role_fr : speaker.role_en}
                {speaker.company ? ` · ${speaker.company}` : ""}
              </p>
            </div>

            {/* Contenu scrollable */}
            <div className="p-6 sm:p-10 overflow-y-auto overscroll-contain">
              {(lang === "fr" ? speaker.expertise_fr : speaker.expertise_en) && (
                <div className="mb-8">
                  <p className="font-mono-num text-[10px] uppercase tracking-[0.24em] mb-2.5" style={{ color: BRONZE }}>
                    {t("speakers.expertise")}
                  </p>
                  <p className="font-serif text-lg sm:text-xl leading-snug" style={{ color: INK }}>
                    {lang === "fr" ? speaker.expertise_fr : speaker.expertise_en}
                  </p>
                </div>
              )}

              {(lang === "fr" ? speaker.bio_fr : speaker.bio_en) && (
                <div>
                  <p className="font-mono-num text-[10px] uppercase tracking-[0.24em] mb-3" style={{ color: BRONZE }}>
                    {t("speakers.bio")}
                  </p>
                  <p className="font-serif text-[15px] sm:text-[16px] leading-[1.75]" style={{ color: "rgba(18,17,15,0.75)" }}>
                    {lang === "fr" ? speaker.bio_fr : speaker.bio_en}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}