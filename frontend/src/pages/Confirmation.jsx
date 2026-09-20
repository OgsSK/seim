import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { Logo } from "../components/Logo";

export default function Confirmation() {
  const { code } = useParams();
  const { t, lang } = useLanguage();
  const [reg, setReg] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.registration(code).then(setReg).catch(() => setError(true));
  }, [code]);

  if (error) {
    return (
      <div className="pt-40 pb-24 text-center" data-testid="confirmation-error">
        <p className="text-navy/60">{t("confirmation.notFound")}</p>
        <Link to="/" className="mt-4 inline-block text-gold-dark font-bold">{t("confirmation.back")}</Link>
      </div>
    );
  }
  if (!reg) {
    return <div className="pt-40 pb-24 text-center text-navy/50" data-testid="confirmation-loading">{t("common.loading")}</div>;
  }

  const pass = t(`register.passes.${reg.pass_type}`);

  return (
    <div className="bg-bone min-h-screen pt-32 pb-24 px-5" data-testid="confirmation-page">
      <div className="max-w-lg mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>
        <h1 className="font-display font-extrabold text-navy text-3xl sm:text-4xl">{t("confirmation.title")}</h1>
        <p className="mt-3 text-navy/60">{t("confirmation.subtitle")}</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          data-testid="digital-badge"
          className="mt-10 bg-navy rounded-3xl overflow-hidden text-left shadow-2xl shadow-navy/25 grain relative"
        >
          <div className="p-6 sm:p-8 border-b border-dashed border-white/20 flex items-center justify-between">
            <Logo dark />
            <span className="px-3 py-1.5 rounded-full bg-gold text-navy text-[11px] font-bold uppercase tracking-wider">
              {pass.name}
            </span>
          </div>
          <div className="p-6 sm:p-8 flex gap-6 items-center">
            <div className="bg-white rounded-2xl p-3 shrink-0">
              <QRCodeSVG value={reg.code} size={110} fgColor="#0B132B" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{t("confirmation.badge")}</p>
              <h2 className="font-display font-extrabold text-white text-xl mt-1 truncate">
                {reg.first_name} {reg.last_name}
              </h2>
              <p className="font-mono-num text-gold text-sm mt-1" data-testid="badge-code">{reg.code}</p>
              <div className="mt-4 space-y-1.5 text-xs text-white/60">
                <p className="flex items-center gap-2"><CalendarDays size={12} className="text-gold" /> {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}</p>
                <p className="flex items-center gap-2"><MapPin size={12} className="text-gold" /> CICB — Bamako</p>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-navy/45 text-sm">{t("confirmation.note")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={() => window.print()} data-testid="print-badge-button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-navy text-navy font-display font-bold text-sm hover:bg-navy hover:text-white transition-colors">
            <Printer size={16} /> {t("confirmation.print")}
          </button>
          <Link to="/" data-testid="confirmation-back-button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-navy font-display font-bold text-sm hover:bg-gold-dark transition-colors">
            <ArrowLeft size={16} /> {t("confirmation.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
