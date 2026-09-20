import { useState } from "react";
import { SmartImg } from "./SectionHead";
import { useLanguage } from "../i18n/LanguageContext";

export function SpeakerCard({ speaker, onOpen }) {
  const { lang, t } = useLanguage();
  const [imgErr, setImgErr] = useState(false);
  const initials = speaker.name.split(" ").map((n) => n[0]).join("");

  return (
    <button
      data-testid={`speaker-card-${speaker.id}`}
      onClick={() => onOpen(speaker)}
      className="group text-left bg-white rounded-2xl border border-navy/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/10 hover:border-gold/40 w-full"
    >
      <div className="relative aspect-[4/4.2] overflow-hidden bg-navy">
        {imgErr || !speaker.photo ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 zigzag-bg">
            <span className="font-display font-extrabold text-5xl text-gold">{initials}</span>
            <svg width="34" height="26" viewBox="0 0 48 38" fill="none"><path d="M10 34 L22 20 L29 27 L46 6" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
          </div>
        ) : (
          <SmartImg
            src={speaker.photo}
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          {t("speakers.viewProfile")}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h11M8 1l4 4-4 4" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-navy text-lg leading-tight">{speaker.name}</h3>
        <p className="text-gold-dark text-sm font-semibold mt-1">{lang === "fr" ? speaker.role_fr : speaker.role_en}</p>
        <p className="text-navy/50 text-sm mt-0.5">{speaker.company}</p>
      </div>
    </button>
  );
}
