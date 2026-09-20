import { useEffect, useState } from "react";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";

export function Countdown({ dark = true }) {
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

  return (
    <div data-testid="hero-countdown" className="flex items-end gap-4 sm:gap-6">
      {units.map((u, i) => (
        <div key={i} className="text-center">
          <div
            className={`font-mono-num font-semibold text-3xl sm:text-5xl tabular-nums ${
              dark ? "text-white" : "text-navy"
            }`}
          >
            {String(u.v).padStart(2, "0")}
          </div>
          <div className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1.5 ${dark ? "text-white/50" : "text-navy/50"}`}>
            {u.l}
          </div>
        </div>
      ))}
    </div>
  );
}
