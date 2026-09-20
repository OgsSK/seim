import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { SmartImg } from "./SectionHead";

export function SpeakerModal({ speaker, onClose }) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {speaker && (
        <motion.div
          data-testid="speaker-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-64 bg-navy-soft">
              <SmartImg src={speaker.photo} alt={speaker.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              <button
                data-testid="speaker-modal-close"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label={t("common.close")}
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="font-display font-extrabold text-white text-2xl sm:text-3xl">{speaker.name}</h3>
                <p className="text-gold font-semibold mt-1">
                  {lang === "fr" ? speaker.role_fr : speaker.role_en} · {speaker.company}
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mb-2">{t("speakers.expertise")}</p>
              <p className="font-display font-semibold text-navy text-lg">{lang === "fr" ? speaker.expertise_fr : speaker.expertise_en}</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mt-6 mb-2">{t("speakers.bio")}</p>
              <p className="text-navy/70 leading-relaxed">{lang === "fr" ? speaker.bio_fr : speaker.bio_en}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
