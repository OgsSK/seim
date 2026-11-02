import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "../i18n/LanguageContext";

const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.12)";

const NAV_ITEMS = [
  { to: "/", key: "nav.home" },
  { to: "/a-propos", key: "nav.about" },
  { to: "/programme", key: "nav.program" },
  { to: "/intervenants", key: "nav.speakers" },
  { to: "/exposants", key: "nav.exhibitors" },
  { to: "/partenaires", key: "nav.partners" },
  { to: "/media", key: "nav.media" },
  { to: "/editions", key: "nav.editions" },
  { to: "/contact", key: "nav.contact" },
];

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  /* Ferme le menu mobile à chaque changement de route */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Lock le scroll du body quand le menu mobile est ouvert */
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  /* Ferme le menu sur Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      data-testid="main-header"
      className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-sm"
      style={{ backgroundColor: `${PAPER}f2`, borderColor: RULE }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        <Link
          to="/"
          data-testid="header-logo-link"
          onClick={() => setOpen(false)}
          className="shrink-0"
        >
          {/* Note: Le composant Logo devra idéalement être ajusté pour passer en noir/encre si ce n'est pas déjà le cas */}
          <Logo compact />
        </Link>

        {/* Navigation desktop */}
        <nav
          className="hidden lg:flex items-center gap-2 xl:gap-4"
          data-testid="desktop-nav"
        >
          {NAV_ITEMS.slice(1).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.key.split(".")[1]}`}
              className={({ isActive }) =>
                `relative py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? ""
                    : "hover:text-[#12110f]"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? BRONZE : "rgba(18,17,15,0.6)",
              })}
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  {/* Soulignement éditorial simple (pas d'animation layoutId) */}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-0.5 h-[1px]"
                      style={{ backgroundColor: BRONZE }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          
          {/* Switch langue — style texte minimaliste */}
          <button
            data-testid="language-switcher"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            aria-label={`Switch to ${lang === "fr" ? "English" : "French"}`}
            className="flex items-center gap-1.5 py-1 text-[11px] font-mono-num tracking-[0.1em] uppercase transition-colors hover:text-[#12110f]"
            style={{ color: "rgba(18,17,15,0.5)" }}
          >
            <Globe size={12} />
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {/* Bouton inscription desktop — bloc encre, typographie sobre */}
          <Link
            to="/inscription"
            data-testid="header-register-button"
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-85"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            {t("nav.register")}
          </Link>

          {/* Bouton menu mobile */}
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 -mr-2 flex items-center justify-center transition-colors"
            style={{ color: INK }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t"
            style={{ backgroundColor: PAPER, borderColor: RULE }}
          >
            <div className="px-5 py-6 flex flex-col">
              <p 
                className="text-[10px] uppercase tracking-[0.25em] mb-4"
                style={{ color: BRONZE }}
              >
                {lang === "fr" ? "Sommaire" : "Contents"}
              </p>
              
              <div className="flex flex-col gap-0 mb-6">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    data-testid={`mobile-nav-link-${item.key.split(".")[1]}`}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `relative py-3.5 text-sm font-medium uppercase tracking-[0.15em] transition-colors border-b last:border-0 flex items-center justify-between ${
                        isActive ? "" : "hover:text-[#12110f]"
                      }`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? BRONZE : "rgba(18,17,15,0.7)",
                      borderColor: RULE,
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        {t(item.key)}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRONZE }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* CTA Mobile */}
              <Link
                to="/inscription"
                data-testid="mobile-register-button"
                onClick={() => setOpen(false)}
                className="w-full flex justify-center items-center px-6 py-4 text-[12px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-85"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                {t("nav.register")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}