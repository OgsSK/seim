import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  MessageCircle,
  Send,
  Clock,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { buildRequestMessage, openWhatsApp } from "../lib/whatsapp";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F";
const GOLD = "#F7B731";
const RULE = "rgba(12,45,82,0.15)";

/* Style commun pour les champs de saisie */
const inputCls =
  "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] placeholder-[#0C2D52]/30 focus:outline-none focus:ring-0 transition-colors appearance-none";

/* ---------- Carte d'info éditoriale ---------- */
function InfoCard({ icon: Icon, label, value, href, external, testid }) {
  const inner = (
    <>
      <span className="shrink-0 pt-1">
        <Icon size={18} strokeWidth={1.5} style={{ color: BRONZE }} />
      </span>

      <div className="flex-1 min-w-0">
        <p
          className="text-[9px] uppercase tracking-[0.24em] mb-1 font-bold"
          style={{ color: "rgba(12,45,82,0.5)" }}
        >
          {label}
        </p>
        <p
          className="font-serif font-semibold text-[15px] sm:text-base [overflow-wrap:anywhere]"
          style={{ color: INK }}
        >
          {value}
        </p>
      </div>

      {href && (
        <ArrowUpRight
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
          style={{ color: BRONZE }}
        />
      )}
    </>
  );

  const baseCls =
    "group flex items-start gap-4 py-4 border-b transition-colors";

  if (href) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        data-testid={testid}
        className={`${baseCls} hover:border-[#D49B0F]`}
        style={{ borderColor: RULE }}
      >
        {inner}
      </a>
    );
  }
  return (
    <div data-testid={testid} className={baseCls} style={{ borderColor: RULE }}>
      {inner}
    </div>
  );
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    request_type: params.get("type") || "general",
    message: "",
  });

  const types = [
    "general",
    "partenariat",
    "sponsoring",
    "exposition",
    "presse",
    "intervention",
  ];

  const submit = (e) => {
    e.preventDefault();
    openWhatsApp(
      buildRequestMessage({
        lang,
        type: form.request_type,
        typeLabel: t(`contact.types.${form.request_type}`),
        name: form.name,
        email: form.email,
        organization: form.organization,
        message: form.message,
      })
    );
    toast.success(t("contact.sent"));
  };

  return (
    <div data-testid="contact-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* ============ COLONNE GAUCHE — Coordonnées ============ */}
            <Reveal className="lg:col-span-5 min-w-0">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.28em] font-bold"
                    style={{ color: BRONZE }}
                  >
                    {lang === "fr" ? "Nous joindre" : "Reach us"}
                  </span>
                </div>

                <h2
                  className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-3xl mb-8"
                  style={{ color: INK }}
                >
                  {t("contact.info")}
                </h2>

                <div className="mb-10 border-t" style={{ borderColor: RULE }}>
                  <InfoCard
                    icon={Phone}
                    label={lang === "fr" ? "Téléphone" : "Phone"}
                    value={EVENT.phone}
                    href={`tel:${EVENT.phone.replace(/\s/g, "")}`}
                    testid="contact-phone"
                  />
                  <InfoCard
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={EVENT.whatsapp}
                    href={`https://wa.me/${EVENT.whatsapp.replace(/[\s+]/g, "")}`}
                    external
                    testid="contact-whatsapp"
                  />
                  {EVENT.emails.map((mail, i) => (
                    <InfoCard
                      key={mail}
                      icon={Mail}
                      label="Email"
                      value={mail}
                      href={`mailto:${mail}`}
                      testid={i === 0 ? "contact-email" : `contact-email-${i + 1}`}
                    />
                  ))}
                  <InfoCard
                    icon={MapPin}
                    label={lang === "fr" ? "Adresse" : "Address"}
                    value={lang === "fr" ? EVENT.address_fr : EVENT.address_en}
                    testid="contact-address"
                  />
                  <InfoCard
                    icon={Facebook}
                    label={t("contact.follow")}
                    value="SEIM — Mali"
                    href={EVENT.facebook}
                    external
                    testid="contact-facebook"
                  />
                </div>

                {/* CARTE GÉO */}
                <div className="mt-8">
                  <div className="flex items-end justify-between mb-3 border-b pb-2" style={{ borderColor: RULE }}>
                    <p className="text-[9px] uppercase tracking-[0.24em] font-bold" style={{ color: BRONZE }}>
                      {lang === "fr" ? "Localisation" : "Location"}
                    </p>
                    <a
                      href="https://maps.google.com/maps?q=Centre%20International%20de%20Conf%C3%A9rences%20de%20Bamako"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors hover:text-[#D49B0F]"
                      style={{ color: INK }}
                    >
                      {lang === "fr" ? "Ouvrir dans Maps" : "Open in Maps"}
                      <ArrowUpRight size={12} style={{ color: BRONZE }} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                  <div className="relative overflow-hidden border" style={{ borderColor: RULE }}>
                    <iframe
                      title="SEIM Bamako map"
                      src="https://maps.google.com/maps?q=Centre%20International%20de%20Conf%C3%A9rences%20de%20Bamako&z=14&output=embed"
                      className="w-full h-56 sm:h-64 border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ============ COLONNE DROITE — Formulaire ============ */}
            <Reveal delay={0.12} className="lg:col-span-7 min-w-0">
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.28em] font-bold"
                    style={{ color: BRONZE }}
                  >
                    {lang === "fr" ? "Formulaire" : "Form"}
                  </span>
                </div>

                <div className="mb-10">
                  <h3
                    className="font-serif font-extrabold tracking-[-0.02em] text-2xl sm:text-3xl mb-3"
                    style={{ color: INK }}
                  >
                    {lang === "fr" ? "Envoyez-nous un message" : "Send us a message"}
                  </h3>
                  <p
                    className="text-[13px] sm:text-[14px] font-serif italic flex items-center gap-2 font-medium"
                    style={{ color: "rgba(12,45,82,0.6)" }}
                  >
                    <Clock size={13} style={{ color: BRONZE }} />
                    {lang === "fr"
                      ? "Réponse sous 24h ouvrées"
                      : "Response within 24 business hours"}
                  </p>
                </div>

                <form
                  data-testid="contact-form"
                  onSubmit={submit}
                  className="space-y-10"
                >
                  {/* Bloc 1 */}
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.24em] mb-4 font-bold"
                      style={{ color: "rgba(12,45,82,0.5)" }}
                    >
                      {lang === "fr" ? "Vos coordonnées" : "Your details"}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <input
                        required
                        data-testid="contact-name-input"
                        placeholder={t("contact.name")}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className={`${inputCls} focus:border-[#D49B0F]`}
                        style={{ borderColor: RULE, color: INK }}
                      />
                      <input
                        type="email"
                        data-testid="contact-email-input"
                        placeholder={t("contact.email")}
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={`${inputCls} focus:border-[#D49B0F]`}
                        style={{ borderColor: RULE, color: INK }}
                      />
                    </div>
                    <input
                      data-testid="contact-org-input"
                      placeholder={t("contact.org")}
                      value={form.organization}
                      onChange={(e) =>
                        setForm({ ...form, organization: e.target.value })
                      }
                      className={`${inputCls} focus:border-[#D49B0F] mt-4 sm:mt-6`}
                      style={{ borderColor: RULE, color: INK }}
                    />
                  </div>

                  {/* Bloc 2 — Select avec Chevron personnalisé */}
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.24em] mb-4 font-bold"
                      style={{ color: "rgba(12,45,82,0.5)" }}
                    >
                      {lang === "fr" ? "Votre demande" : "Your request"}
                    </p>
                    
                    <div className="relative">
                      <select
                        data-testid="contact-type-select"
                        value={form.request_type}
                        onChange={(e) =>
                          setForm({ ...form, request_type: e.target.value })
                        }
                        className={`${inputCls} focus:border-[#D49B0F] cursor-pointer pr-10`}
                        style={{ borderColor: RULE, color: INK }}
                      >
                        {types.map((ty) => (
                          <option 
                            key={ty} 
                            value={ty}
                            style={{ backgroundColor: PAPER, color: INK }}
                          >
                            {t(`contact.types.${ty}`)}
                          </option>
                        ))}
                      </select>
                      
                      <ChevronDown
                        size={16}
                        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: BRONZE }}
                      />
                    </div>
                  </div>

                  {/* Bloc 3 */}
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.24em] mb-4 font-bold"
                      style={{ color: "rgba(12,45,82,0.5)" }}
                    >
                      {lang === "fr" ? "Votre message" : "Your message"}
                    </p>
                    <textarea
                      required
                      rows={4}
                      data-testid="contact-message-input"
                      placeholder={t("contact.message")}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className={`${inputCls} focus:border-[#D49B0F] resize-none`}
                      style={{ borderColor: RULE, color: INK }}
                    />
                  </div>

                  {/* Bouton Envoyer */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      data-testid="contact-submit-button"
                      className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: INK, color: PAPER }}
                    >
                      {t("contact.send")}
                      <Send
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                        style={{ color: GOLD }}
                      />
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}