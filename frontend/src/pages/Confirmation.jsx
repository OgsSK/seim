import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { Logo } from "../components/Logo";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.18)";

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
      <div
        data-testid="confirmation-error"
        className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: PAPER, color: INK }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
            {lang === "fr" ? "Erreur" : "Error"}
          </span>
          <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
        </div>
        <p className="font-serif text-xl sm:text-2xl" style={{ color: INK }}>
          {t("confirmation.notFound")}
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2.5 text-[13px] font-medium"
          style={{ color: INK }}
        >
          <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
            {t("confirmation.back")}
          </span>
        </Link>
      </div>
    );
  }

  if (!reg) {
    return (
      <div
        data-testid="confirmation-loading"
        className="min-h-[60vh] flex flex-col items-center justify-center px-5"
        style={{ backgroundColor: PAPER }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
            {lang === "fr" ? "Chargement" : "Loading"}
          </span>
          <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
        </div>
        <p className="font-serif italic text-[15px]" style={{ color: "rgba(12,45,82,0.55)" }}>
          {t("common.loading")}
        </p>
      </div>
    );
  }

  const pass = t(`register.passes.${reg.pass_type}`);

  return (
    <div
      data-testid="confirmation-page"
      className="min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-5"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <div className="max-w-lg mx-auto">

        {/* ============ En-tête éditorial ============ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-10 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
              {lang === "fr" ? "Confirmation" : "Confirmed"}
            </span>
            <span className="w-10 h-px" style={{ backgroundColor: RULE }} />
          </div>

          <h1
            className="font-serif tracking-[-0.02em] text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.1]"
            style={{ color: INK }}
          >
            {t("confirmation.title")}
          </h1>

          <p
            className="mt-5 text-[14px] sm:text-[15px] leading-[1.7] max-w-md mx-auto font-serif italic"
            style={{ color: "rgba(12,45,82,0.55)" }}
          >
            {t("confirmation.subtitle")}
          </p>
        </motion.div>

        {/* ============ Badge / Billet ============ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          data-testid="digital-badge"
          className="mt-12 sm:mt-14 relative"
          style={{ backgroundColor: INK, color: PAPER }}
        >
          {/* Filet supérieur bronze — signature visuelle */}
          <div className="h-[3px]" style={{ backgroundColor: BRONZE }} />

          {/* Header du billet */}
          <div
            className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-3 border-b border-dashed"
            style={{ borderColor: RULE_INK }}
          >
            <Logo dark />
            <span
              className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 border"
              style={{ color: BRONZE, borderColor: BRONZE }}
            >
              {pass.name}
            </span>
          </div>

          {/* Corps du billet */}
          <div className="px-6 sm:px-8 py-7 sm:py-8 flex flex-col sm:flex-row gap-6 sm:gap-7 items-center sm:items-start">
            {/* QR */}
            <div
              className="shrink-0 p-3 border"
              style={{ backgroundColor: PAPER, borderColor: RULE_INK }}
            >
              <QRCodeSVG value={reg.code} size={104} fgColor={INK} bgColor={PAPER} />
            </div>

            {/* Infos participant */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] mb-2"
                style={{ color: BRONZE }}
              >
                {t("confirmation.badge")}
              </p>

              <h2
                className="font-serif text-xl sm:text-2xl leading-tight tracking-[-0.01em] break-words"
                style={{ color: PAPER }}
              >
                {reg.first_name} {reg.last_name}
              </h2>

              <p
                data-testid="badge-code"
                className="font-mono-num text-[12px] mt-2 tracking-[0.1em]"
                style={{ color: BRONZE }}
              >
                {reg.code}
              </p>

              <div
                className="mt-5 pt-4 border-t space-y-2 text-[11px] sm:text-[12px]"
                style={{ borderColor: RULE_INK, color: "rgba(242,244,246,0.55)" }}
              >
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <CalendarDays size={12} style={{ color: BRONZE }} className="shrink-0" />
                  {lang === "fr" ? EVENT.dates_fr : EVENT.dates_en}
                </p>
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin size={12} style={{ color: BRONZE }} className="shrink-0" />
                  CICB — Bamako
                </p>
              </div>
            </div>
          </div>

          {/* Pied du billet — mention + numéro d'édition */}
          <div
            className="px-6 sm:px-8 py-3 border-t border-dashed flex items-center justify-between"
            style={{ borderColor: RULE_INK }}
          >
            <span
              className="font-mono-num text-[9px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(242,244,246,0.35)" }}
            >
              SEIM · {lang === "fr" ? "Édition 02" : "Edition 02"}
            </span>
            <span
              className="font-mono-num text-[9px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(242,244,246,0.35)" }}
            >
              {lang === "fr" ? "Bamako, Mali" : "Bamako, Mali"}
            </span>
          </div>
        </motion.div>

        {/* Note */}
        <p
          className="mt-6 text-center text-[12px] sm:text-[13px] font-serif italic px-4"
          style={{ color: "rgba(12,45,82,0.45)" }}
        >
          {t("confirmation.note")}
        </p>

        {/* ============ Actions ============ */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:justify-center items-center gap-4 sm:gap-8">
          <button
            onClick={() => window.print()}
            data-testid="print-badge-button"
            className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 text-[12px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            <Printer size={14} style={{ color: BRONZE }} />
            {t("confirmation.print")}
          </button>

          <Link
            to="/"
            data-testid="confirmation-back-button"
            className="group inline-flex items-center gap-2 text-[13px] font-medium"
            style={{ color: INK }}
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" style={{ color: BRONZE }} />
            <span className="border-b pb-0.5" style={{ borderColor: BRONZE }}>
              {t("confirmation.back")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}