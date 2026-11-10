import { useEffect, useState } from "react";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.15)";

export function Countdown({ dark = false }) {
  const { t } = useLanguage();
  const target = new Date(EVENT.startDateISO).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const units = [
    { v: d, l: t("hero.countdown.days") },
    { v: h, l: t("hero.countdown.hours") },
    { v: m, l: t("hero.countdown.minutes") },
    { v: s, l: t("hero.countdown.seconds") },
  ];

  // Couleurs conditionnelles selon le fond
  const numberColor = dark ? PAPER : INK;
  const labelColor = dark ? "rgba(242,244,246,0.5)" : "rgba(12,45,82,0.5)";
  const separatorColor = dark ? RULE_INK : RULE;

  return (
    <div
      data-testid="hero-countdown"
      className="flex items-end gap-3 sm:gap-5"
    >
      {units.map((u, i) => (
        <div key={i} className="flex items-end gap-3 sm:gap-5">
          {/* Unité (chiffre + label) */}
          <div className="text-center min-w-[48px] sm:min-w-[60px]">
            <div
              className="font-mono-num font-light text-2xl xs:text-3xl sm:text-4xl tabular-nums leading-none tracking-tight"
              style={{ color: numberColor }}
            >
              {String(u.v).padStart(2, "0")}
            </div>
            <div
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2 font-medium"
              style={{ color: labelColor }}
            >
              {u.l}
            </div>
          </div>

          {/* Séparateur vertical entre les unités (sauf après la dernière) */}
          {i < units.length - 1 && (
            <span
              className="hidden sm:block w-px h-10 sm:h-12"
              style={{ backgroundColor: separatorColor }}
            />
          )}
        </div>
      ))}
    </div>
  );
}