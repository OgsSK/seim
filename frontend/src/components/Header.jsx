import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "../i18n/LanguageContext";

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

  return (
    <header
      data-testid="main-header"
      className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" data-testid="header-logo-link" onClick={() => setOpen(false)}>
          <Logo compact />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" data-testid="desktop-nav">
          {NAV_ITEMS.slice(1).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.key.split(".")[1]}`}
              className={({ isActive }) =>
                `text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? "text-gold-dark" : "text-navy/60 hover:text-navy"
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            data-testid="language-switcher"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-navy/20 text-navy hover:border-gold transition-colors"
          >
            <Globe size={14} />
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <Link
            to="/inscription"
            data-testid="header-register-button"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-gold text-navy font-display font-bold text-sm hover:bg-gold-dark transition-colors"
          >
            {t("nav.register")}
          </Link>
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-navy"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-navy/10"
          >
            <div className="px-5 py-6 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-testid={`mobile-nav-link-${item.key.split(".")[1]}`}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-3 px-3 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                      isActive ? "text-gold-dark bg-gold-light/60" : "text-navy/80"
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
              <Link
                to="/inscription"
                data-testid="mobile-register-button"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex justify-center px-5 py-3.5 rounded-full bg-gold text-navy font-display font-bold text-sm"
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
