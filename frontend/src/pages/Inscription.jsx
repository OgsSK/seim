import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { MessageCircle, Users, Store, Handshake, Mic, Newspaper } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { EVENT } from "../config/event";
import { BLANK, buildMessage, openWhatsApp } from "../lib/whatsapp";

/* Palette charte SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.15)";

/* Style des champs de saisie (ligne éditoriale) */
const inputCls =
  "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] placeholder-[#0C2D52]/30 focus:outline-none focus:ring-0 transition-colors appearance-none";

/*
 * Base d'inscription : chaque type adapte le formulaire et le message WhatsApp.
 * intro = phrase d'ouverture du message, ask = demande de clôture.
 */
const TYPES = {
  visiteur: {
    icon: Users,
    fr: {
      label: "Participant",
      desc: "Assister aux conférences, panels et masterclasses.",
      intro: "Je souhaite m'inscrire comme participant au SEIM",
      ask: "Merci de me confirmer mon inscription.",
      org: "Entreprise / Établissement (facultatif)",
    },
    en: {
      label: "Participant",
      desc: "Attend the conferences, panels and masterclasses.",
      intro: "I would like to register as a participant for SEIM",
      ask: "Please confirm my registration.",
      org: "Company / Institution (optional)",
    },
  },
  exposant: {
    icon: Store,
    fr: {
      label: "Exposant",
      desc: "Présenter votre structure sur un stand.",
      intro: "Je souhaite m'inscrire comme exposant au SEIM",
      ask: "Merci de me communiquer les informations pour réserver un stand.",
      org: "Nom de la structure",
    },
    en: {
      label: "Exhibitor",
      desc: "Showcase your organization on a booth.",
      intro: "I would like to register as an exhibitor for SEIM",
      ask: "Please send me the information to book a booth.",
      org: "Organization name",
    },
  },
  partenaire: {
    icon: Handshake,
    fr: {
      label: "Partenaire / Sponsor",
      desc: "Associer votre marque au salon.",
      intro: "Je souhaite devenir partenaire / sponsor du SEIM",
      ask: "Merci de me transmettre les possibilités de partenariat.",
      org: "Nom de la structure",
    },
    en: {
      label: "Partner / Sponsor",
      desc: "Associate your brand with the fair.",
      intro: "I would like to become a partner / sponsor of SEIM",
      ask: "Please send me the partnership opportunities.",
      org: "Organization name",
    },
  },
  intervenant: {
    icon: Mic,
    fr: {
      label: "Intervenant",
      desc: "Prendre la parole lors d'un panel ou d'une masterclass.",
      intro: "Je souhaite intervenir au SEIM",
      ask: "Merci de me recontacter pour échanger sur mon intervention.",
      org: "Structure / Organisation",
    },
    en: {
      label: "Speaker",
      desc: "Speak at a panel or a masterclass.",
      intro: "I would like to take part as a speaker at SEIM",
      ask: "Please get back to me to discuss my talk.",
      org: "Organization",
    },
  },
  presse: {
    icon: Newspaper,
    fr: {
      label: "Presse / Média",
      desc: "Couvrir l'événement en tant que journaliste.",
      intro: "Je souhaite une accréditation presse pour le SEIM",
      ask: "Merci de me confirmer mon accréditation.",
      org: "Nom du média",
    },
    en: {
      label: "Press / Media",
      desc: "Cover the event as a journalist.",
      intro: "I would like a press accreditation for SEIM",
      ask: "Please confirm my accreditation.",
      org: "Media name",
    },
  },
};
const TYPE_KEYS = Object.keys(TYPES);

export default function Inscription() {
  const { t, lang } = useLanguage();
  const fr = lang === "fr";
  const L = (frTxt, enTxt) => (fr ? frTxt : enTxt);
  const [params] = useSearchParams();
  const urlType = params.get("type");
  const initialType = TYPE_KEYS.includes(urlType) ? urlType : "visiteur";

  const [form, setForm] = useState({
    type: initialType,
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    organization: "",
    role: "",
    country: "Mali",
    interests: [],
    message: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Suit le type passé dans l'URL (ex. lien « Devenir exposant » depuis le pied de page)
  useEffect(() => {
    if (TYPE_KEYS.includes(urlType)) setForm((f) => ({ ...f, type: urlType }));
  }, [urlType]);
  const toggleInterest = (i) =>
    setForm({
      ...form,
      interests: form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i],
    });

  const current = TYPES[form.type][fr ? "fr" : "en"];
  const orgRequired = form.type !== "visiteur";

  const submit = (e) => {
    e.preventDefault();
    const interests = form.interests
      .map((i) => t("register.interestsList")[Number(i)])
      .filter(Boolean)
      .join(", ");

    const message = buildMessage([
      L("Bonjour l'équipe SEIM,", "Hello SEIM team,"),
      `${current.intro} — ${fr ? EVENT.dates_fr : EVENT.dates_en}, CICB Bamako.`,
      BLANK,
      `*${L("Inscription", "Registration")} :* ${current.label}`,
      `*${L("Nom", "Name")} :* ${form.first_name} ${form.last_name}`,
      `*${L("Téléphone", "Phone")} :* ${form.phone}`,
      form.email && `*Email :* ${form.email}`,
      form.organization &&
        `*${form.type === "presse" ? L("Média", "Media") : L("Structure", "Organization")} :* ${form.organization}`,
      form.role && `*${L("Fonction", "Position")} :* ${form.role}`,
      `*${L("Pays", "Country")} :* ${form.country}`,
      interests && `*${L("Thèmes d'intérêt", "Topics of interest")} :* ${interests}`,
      form.message && BLANK,
      form.message && `*${L("Précisions", "Details")} :*\n${form.message}`,
      BLANK,
      current.ask,
    ]);

    openWhatsApp(message);
    toast.success(
      L(
        "WhatsApp s'ouvre : appuyez sur Envoyer pour finaliser votre inscription.",
        "WhatsApp is opening: tap Send to complete your registration."
      )
    );
  };

  const SectionLabel = ({ children, mb = "mb-8" }) => (
    <div className={`flex items-center gap-3 ${mb}`}>
      <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
      <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
        {children}
      </span>
    </div>
  );

  const field = (key, placeholder, opts = {}) => (
    <input
      required={!!opts.required}
      type={opts.type || "text"}
      data-testid={`reg-${key}`}
      placeholder={placeholder}
      value={form[key]}
      onChange={set(key)}
      className={`${inputCls} focus:border-[#B57A0A]`}
      style={{ borderColor: RULE, color: INK }}
    />
  );

  return (
    <div data-testid="register-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("register.eyebrow")}
        title={t("register.title")}
        subtitle={t("register.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <form
          data-testid="registration-form"
          onSubmit={submit}
          className="max-w-4xl mx-auto px-5 sm:px-8"
        >
          {/* ============ Base d'inscription ============ */}
          <Reveal>
            <SectionLabel>{L("Je m'inscris en tant que", "I am registering as")}</SectionLabel>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {TYPE_KEYS.map((k) => {
                const item = TYPES[k][fr ? "fr" : "en"];
                const Icon = TYPES[k].icon;
                const active = form.type === k;
                return (
                  <button
                    type="button"
                    key={k}
                    data-testid={`reg-type-${k}`}
                    aria-pressed={active}
                    onClick={() => setForm({ ...form, type: k })}
                    className={`text-left p-6 border transition-colors flex flex-col gap-4 ${
                      active
                        ? "border-[#0C2D52] bg-white"
                        : "border-[rgba(12,45,82,0.15)] bg-transparent hover:border-[#B57A0A]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Icon size={20} style={{ color: active ? "#F7B731" : BRONZE }} />
                      <span
                        className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                        style={{ borderColor: active ? INK : RULE }}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: INK }} />}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg leading-tight" style={{ color: INK }}>
                        {item.label}
                      </h3>
                      <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: "rgba(12,45,82,0.55)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ============ Coordonnées ============ */}
          <Reveal delay={0.1}>
            <SectionLabel>{L("Vos coordonnées", "Your details")}</SectionLabel>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-16">
              {field("first_name", t("register.firstName"), { required: true })}
              {field("last_name", t("register.lastName"), { required: true })}
              {field("phone", L("Téléphone / WhatsApp", "Phone / WhatsApp"), { required: true, type: "tel" })}
              {field("email", L("Email (facultatif)", "Email (optional)"), { type: "email" })}
              {field("organization", current.org, { required: orgRequired })}
              {field("role", L("Fonction (facultatif)", "Position (optional)"))}
              <select
                data-testid="reg-country"
                value={form.country}
                onChange={set("country")}
                className={`${inputCls} focus:border-[#B57A0A] cursor-pointer`}
                style={{ borderColor: RULE, color: INK }}
              >
                {t("register.countries").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          {/* ============ Thèmes d'intérêt (participants) ============ */}
          {form.type === "visiteur" && (
            <Reveal delay={0.15}>
              <SectionLabel mb="mb-6">{t("register.interests")}</SectionLabel>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-16" data-testid="reg-interests">
                {t("register.interestsList").map((int_, i) => {
                  const active = form.interests.includes(String(i));
                  return (
                    <button
                      type="button"
                      key={i}
                      data-testid={`interest-chip-${i}`}
                      onClick={() => toggleInterest(String(i))}
                      className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium border transition-colors ${
                        active
                          ? "bg-[#0C2D52] text-[#F2F4F6] border-[#0C2D52]"
                          : "bg-transparent text-[#0C2D52]/60 border-[rgba(12,45,82,0.2)] hover:border-[#B57A0A] hover:text-[#0C2D52]"
                      }`}
                    >
                      {int_}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          {/* ============ Précisions ============ */}
          <Reveal delay={0.2}>
            <SectionLabel>{L("Précisions (facultatif)", "Details (optional)")}</SectionLabel>
            <textarea
              rows={3}
              data-testid="reg-message"
              placeholder={L("Un mot à ajouter pour l'équipe SEIM ?", "Anything to add for the SEIM team?")}
              value={form.message}
              onChange={set("message")}
              className={`${inputCls} resize-none mb-16 focus:border-[#B57A0A]`}
              style={{ borderColor: RULE, color: INK }}
            />
          </Reveal>

          {/* ============ Envoi WhatsApp ============ */}
          <Reveal delay={0.25}>
            <div className="pt-4 border-t" style={{ borderColor: RULE }}>
              <button
                type="submit"
                data-testid="reg-submit-button"
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                <MessageCircle size={16} style={{ color: "#F7B731" }} />
                {t("register.submit")}
              </button>
              <p className="mt-4 text-[13px] leading-[1.6]" style={{ color: "rgba(12,45,82,0.55)" }}>
                {t("register.whatsappNote")}
              </p>
            </div>
          </Reveal>
        </form>
      </section>
    </div>
  );
}
