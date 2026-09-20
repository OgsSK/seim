import { Link } from "react-router-dom";
import { Facebook, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
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
    <footer data-testid="main-footer" className="bg-white text-navy/60 border-t border-navy/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            <div className="flex gap-3 mt-6">
              <a href={EVENT.facebook} target="_blank" rel="noopener noreferrer" data-testid="footer-facebook-link"
                className="w-9 h-9 rounded-full border border-navy/15 text-navy/60 flex items-center justify-center hover:border-gold hover:text-gold-dark transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" data-testid="footer-linkedin-link" onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full border border-navy/15 text-navy/60 flex items-center justify-center hover:border-gold hover:text-gold-dark transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" data-testid="footer-youtube-link" onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full border border-navy/15 text-navy/60 flex items-center justify-center hover:border-gold hover:text-gold-dark transition-colors">
                <Youtube size={16} />
              </a>
            </div>
            <p className="mt-4 text-xs text-navy/40 font-mono-num">{EVENT.handle}</p>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link to={l.to} className="text-sm hover:text-gold-dark transition-colors" data-testid={`footer-link-${i}-${j}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-4">{t("footer.contactCol")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5"><Phone size={15} className="text-gold-dark shrink-0 mt-0.5" />{EVENT.phone}</li>
              <li className="flex gap-2.5"><Mail size={15} className="text-gold-dark shrink-0 mt-0.5" />{EVENT.email}</li>
              <li className="flex gap-2.5"><MapPin size={15} className="text-gold-dark shrink-0 mt-0.5" />{EVENT.address_fr}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-navy/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy/40">
          <p>© 2026 SEIM — Salon de l'Épargne et de l'Investissement du Mali. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" data-testid="footer-legal-link" className="hover:text-gold-dark transition-colors">{t("footer.legal")}</Link>
            <Link to="/confidentialite" data-testid="footer-privacy-link" className="hover:text-gold-dark transition-colors">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
