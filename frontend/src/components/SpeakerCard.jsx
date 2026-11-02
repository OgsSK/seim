import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/* Palette éditoriale premium */
const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.12)";
const FALLBACK_BG = "#ebe5d8"; // Beige texturé

export function SpeakerCard({ speaker, onOpen }) {
  const { lang, t } = useLanguage();

  // On extrait les initiales (ex: "Modibo Mao Makalou" -> "MM")
  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = (lang === "fr" ? speaker.role_fr : speaker.role_en) || speaker.role;

  return (
    <button
      type="button"
      data-testid={`speaker-card-${speaker.id}`}
      onClick={() => onOpen(speaker)}
      aria-label={`${speaker.name} — ${t("speakers.viewProfile")}`}
      className="group text-left w-full flex flex-col"
    >
      {/* ============ Bloc Typographique (Remplace la photo) ============ */}
      <div 
        className="relative aspect-[4/5] overflow-hidden border flex flex-col items-center justify-center" 
        style={{ backgroundColor: FALLBACK_BG, borderColor: RULE }}
      >
        {/* Repères d'imprimerie aux 4 coins */}
        <div className="absolute top-4 left-4 right-4 flex justify-between opacity-40">
          <span className="w-3 h-px" style={{ backgroundColor: BRONZE }} />
          <span className="w-3 h-px" style={{ backgroundColor: BRONZE }} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-40">
          <span className="w-3 h-px" style={{ backgroundColor: BRONZE }} />
          <span className="w-3 h-px" style={{ backgroundColor: BRONZE }} />
        </div>

        {/* Initiales Géantes */}
        <span 
          className="font-serif text-6xl sm:text-7xl lg:text-8xl tracking-[-0.03em] transition-transform duration-500 group-hover:scale-105"
          style={{ color: BRONZE }}
        >
          {initials}
        </span>
        
        {/* Petite mention SEIM */}
        <span 
          className="font-mono-num text-[8px] sm:text-[9px] uppercase tracking-[0.3em] mt-4 opacity-50"
          style={{ color: INK }}
        >
          SEIM · 2026
        </span>
      </div>

      {/* ============ Infos ============ */}
      <div 
        className="pt-4 pb-4 border-b flex flex-col flex-1"
        style={{ borderColor: RULE }}
      >
        {role && (
          <p 
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-2 line-clamp-2"
            style={{ color: BRONZE }}
          >
            {role}
          </p>
        )}
        
        <h3 
          className="font-serif text-lg sm:text-xl leading-tight tracking-tight mb-1.5"
          style={{ color: INK }}
        >
          {speaker.name}
        </h3>
        
        {speaker.company && (
          <p 
            className="text-[12px] italic font-serif line-clamp-1"
            style={{ color: "rgba(18,17,15,0.5)" }}
          >
            {speaker.company}
          </p>
        )}

        {/* Lien "Voir profil" discret au hover (desktop) */}
        <div className="mt-auto pt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span 
            className="text-[10px] uppercase tracking-[0.2em] font-medium"
            style={{ color: BRONZE }}
          >
            {t("speakers.viewProfile")}
          </span>
          <ArrowUpRight 
            size={14} 
            style={{ color: BRONZE }} 
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </button>
  );
}