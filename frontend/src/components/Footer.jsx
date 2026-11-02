import { Link } from "react-router-dom";
import { Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";

/* Palette éditoriale premium */
const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.12)";

export function Footer() {
  const { t, lang } = useLanguage();
  const L = t("footer.links");

  const cols = [
    {
      title: t("footer.event"),
      links: [
        { label: L.about, to: "/a-propos" },
        { label: L.program, to: "/programme" },
        { label: L.speakers, to: "/intervenants" },
        { label: L.exhibitors, to: "/exposants" },
        { label: L.editions, to: "/editions" },
      ],
    },
    {
      title: t("footer.participate"),
      links: [
        { label: L.register, to: "/inscription" },
        { label: L.becomeExhibitor, to: "/contact?type=exposition" },
        { label: L.becomeSponsor, to: "/partenaires" },
      ],
    },
    {
      title: t("footer.mediaCol"),
      links: [
        { label: L.news, to: "/media" },
        { label: L.gallery, to: "/media?tab=gallery" },
        { label: L.videos, to: "/media?tab=videos" },
        { label: L.press, to: "/media?tab=press" },
      ],
    },
  ];

  return (
    <footer
      data-testid="main-footer"
      className="border-t"
      style={{ backgroundColor: PAPER, borderColor: RULE, color: INK }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12 sm:gap-10">
          
          {/* Bloc identité + réseaux */}
          <div className="col-span-2 lg:col-span-1">
            {/* Note: Assurez-vous que <Logo /> est bien en couleur Encre ou Noir */}
            <Logo />
            
            <p className="mt-5 text-[14px] leading-[1.7] font-serif italic text-[#12110f]/55 max-w-xs">
              {t("footer.tagline")}
            </p>

            {/* Réseaux sociaux — minimalistes, sans pastille */}
            <div className="flex gap-4 mt-6">
              <a
                href={EVENT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-facebook-link"
                aria-label="Facebook"
                className="text-[#12110f]/50 hover:text-[#8a6a3e] transition-colors"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://youtube.com/@seim-ml?si=qzRv6Wdm_RDGlzq-"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-youtube-link"
                aria-label="YouTube"
                className="text-[#12110f]/50 hover:text-[#8a6a3e] transition-colors"
              >
                <Youtube size={18} strokeWidth={1.5} />
              </a>
            </div>

            <p className="mt-5 font-mono-num text-[10px] tracking-[0.15em] uppercase text-[#12110f]/40">
              {EVENT.handle}
            </p>
          </div>

          {/* 3 colonnes de liens */}
          {cols.map((col, i) => (
            <div key={i}>
              <h4 
                className="font-mono-num text-[10px] uppercase tracking-[0.24em] mb-5"
                style={{ color: BRONZE }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link
                      to={l.to}
                      className="text-[13px] text-[#12110f]/65 hover:text-[#8a6a3e] transition-colors"
                      data-testid={`footer-link-${i}-${j}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bloc contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 
              className="font-mono-num text-[10px] uppercase tracking-[0.24em] mb-5"
              style={{ color: BRONZE }}
            >
              {t("footer.contactCol")}
            </h4>
            <ul className="space-y-3.5 text-[13px] text-[#12110f]/65">
              <li className="flex gap-3 items-start">
                <Phone size={14} className="shrink-0 mt-0.5" style={{ color: BRONZE }} />
                <a
                  href={`tel:${EVENT.phone.replace(/\s/g, "")}`}
                  className="hover:text-[#8a6a3e] transition-colors"
                >
                  {EVENT.phone}
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <Mail size={14} className="shrink-0 mt-0.5" style={{ color: BRONZE }} />
                <a
                  href={`mailto:${EVENT.email}`}
                  className="hover:text-[#8a6a3e] transition-colors break-all"
                >
                  {EVENT.email}
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin
                  size={14}
                  className="shrink-0 mt-0.5"
                  style={{ color: BRONZE }}
                />
                <span className="leading-relaxed">
                  {lang === "fr" ? EVENT.address_fr : EVENT.address_en || EVENT.address_fr}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure — copyright + liens légaux */}
        <div 
          className="mt-16 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#12110f]/40 text-center sm:text-left"
          style={{ borderColor: RULE }}
        >
          <p className="leading-relaxed">
            © 2026 SEIM — {lang === "fr" ? "Salon de l'Épargne et de l'Investissement du Mali." : "Mali Savings and Investment Forum."}{" "}
            {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            <Link
              to="/mentions-legales"
              data-testid="footer-legal-link"
              className="hover:text-[#8a6a3e] transition-colors whitespace-nowrap"
            >
              {t("footer.legal")}
            </Link>
            <Link
              to="/confidentialite"
              data-testid="footer-privacy-link"
              className="hover:text-[#8a6a3e] transition-colors whitespace-nowrap"
            >
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}