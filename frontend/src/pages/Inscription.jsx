import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle, Users, Store, Handshake, Mic, Newspaper,
  CheckCircle2, CalendarDays, MapPin, ArrowUpRight, RotateCcw, CalendarPlus, UserPlus, ChevronDown,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { Countdown } from "../components/Countdown";
import { useLanguage } from "../i18n/LanguageContext";
import { EVENT } from "../config/event";
import { BLANK, buildMessage, openWhatsApp } from "../lib/whatsapp";
import { downloadIcs, googleCalendarUrl } from "../lib/calendar";

/* Palette charte SEIM — jaune du logo */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F";
const GOLD = "#F7B731";
const RULE = "rgba(12,45,82,0.15)";

/* Style des champs de saisie */
const inputCls =
  "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] placeholder-[#0C2D52]/30 focus:outline-none focus:ring-0 transition-colors appearance-none";

const TYPES = {
  visiteur: {
    icon: Users,
    fr: {
      label: "Participant",
      desc: "Assister aux conférences, panels et masterclasses.",
      intro: "Je souhaite m'inscrire comme participant au SEIM",
      ask: "Merci de me confirmer mon inscription.",
    },
    en: {
      label: "Participant",
      desc: "Attend the conferences, panels and masterclasses.",
      intro: "I would like to register as a participant for SEIM",
      ask: "Please confirm my registration.",
    },
  },
  exposant: {
    icon: Store,
    fr: {
      label: "Exposant",
      desc: "Présenter votre structure sur un stand.",
      intro: "Je souhaite m'inscrire comme exposant au SEIM",
      ask: "Merci de me communiquer les informations pour réserver un stand.",
    },
    en: {
      label: "Exhibitor",
      desc: "Showcase your organization on a booth.",
      intro: "I would like to register as an exhibitor for SEIM",
      ask: "Please send me the information to book a booth.",
    },
  },
  partenaire: {
    icon: Handshake,
    fr: {
      label: "Partenaire / Sponsor",
      desc: "Associer votre marque au salon.",
      intro: "Je souhaite devenir partenaire / sponsor du SEIM",
      ask: "Merci de me transmettre les possibilités de partenariat.",
    },
    en: {
      label: "Partner / Sponsor",
      desc: "Associate your brand with the fair.",
      intro: "I would like to become a partner / sponsor of SEIM",
      ask: "Please send me the partnership opportunities.",
    },
  },
  intervenant: {
    icon: Mic,
    fr: {
      label: "Intervenant",
      desc: "Prendre la parole lors d'un panel ou d'une masterclass.",
      intro: "Je souhaite intervenir au SEIM",
      ask: "Merci de me recontacter pour échanger sur mon intervention.",
    },
    en: {
      label: "Speaker",
      desc: "Speak at a panel or a masterclass.",
      intro: "I would like to take part as a speaker at SEIM",
      ask: "Please get back to me to discuss my talk.",
    },
  },
  presse: {
    icon: Newspaper,
    fr: {
      label: "Presse / Média",
      desc: "Couvrir l'événement en tant que journaliste.",
      intro: "Je souhaite une accréditation presse pour le SEIM",
      ask: "Merci de me confirmer mon accréditation.",
    },
    en: {
      label: "Press / Media",
      desc: "Cover the event as a journalist.",
      intro: "I would like a press accreditation for SEIM",
      ask: "Please confirm my accreditation.",
    },
  },
};
const TYPE_KEYS = Object.keys(TYPES);

/* Options de liste (fr/en) */
const opt = (fr, en) => ({ fr, en: en || fr });

/* Champs spécifiques */
const FIELDS = {
  visiteur: {
    section: opt("Votre profil", "Your profile"),
    fields: [
      { key: "profile", kind: "select", required: true, label: opt("Vous êtes", "You are"),
        options: [opt("Particulier / Épargnant", "Individual / Saver"), opt("Étudiant / Jeune diplômé", "Student / Graduate"),
          opt("Professionnel de la finance", "Finance professional"), opt("Entrepreneur / Dirigeant", "Entrepreneur / Executive"),
          opt("Agent public / Institution", "Civil servant / Institution"), opt("Autre", "Other")] },
      { key: "organization", label: opt("Entreprise / Établissement", "Company / School") },
      { key: "role", label: opt("Fonction", "Position") },
    ],
  },
  exposant: {
    section: opt("Votre stand", "Your booth"),
    fields: [
      { key: "organization", required: true, label: opt("Nom de la structure", "Organization name") },
      { key: "role", required: true, label: opt("Votre fonction", "Your position") },
      { key: "sector", kind: "select", required: true, label: opt("Secteur d'activité", "Industry"),
        options: [opt("Banque", "Banking"), opt("Assurance", "Insurance"), opt("Microfinance"), opt("Fintech / Mobile money"),
          opt("SGI / Bourse / Gestion d'actifs", "Brokerage / Asset management"), opt("Immobilier", "Real estate"),
          opt("Institution publique", "Public institution"), opt("Autre", "Other")] },
      { key: "booth", kind: "select", required: true, label: opt("Stand souhaité", "Preferred booth"),
        options: [opt("Stand standard (9 m²)", "Standard booth (9 m²)"), opt("Grand stand (18 m²)", "Large booth (18 m²)"),
          opt("Sur mesure", "Custom"), opt("À définir avec l'équipe", "To be discussed")] },
      { key: "website", kind: "url", label: opt("Site web", "Website") },
    ],
  },
  partenaire: {
    section: opt("Votre partenariat", "Your partnership"),
    fields: [
      { key: "organization", required: true, label: opt("Nom de la structure", "Organization name") },
      { key: "role", required: true, label: opt("Votre fonction", "Your position") },
      { key: "partnership", kind: "select", required: true, label: opt("Type de partenariat envisagé", "Partnership type"),
        options: [opt("Sponsor principal", "Main sponsor"), opt("Sponsor Or", "Gold sponsor"), opt("Sponsor Argent", "Silver sponsor"),
          opt("Partenaire institutionnel", "Institutional partner"), opt("Partenaire média", "Media partner"),
          opt("Partenaire technique", "Technical partner"), opt("À discuter", "To be discussed")] },
      { key: "website", kind: "url", label: opt("Site web", "Website") },
    ],
  },
  intervenant: {
    section: opt("Votre intervention", "Your talk"),
    fields: [
      { key: "organization", required: true, label: opt("Structure / Organisation", "Organization") },
      { key: "role", required: true, label: opt("Votre fonction", "Your position") },
      { key: "expertise", required: true, label: opt("Domaine d'expertise", "Area of expertise") },
      { key: "format", kind: "select", required: true, label: opt("Format souhaité", "Preferred format"),
        options: [opt("Panel"), opt("Masterclass"), opt("CEO Talk"), opt("Keynote"), opt("À définir", "To be defined")] },
      { key: "topic", full: true, label: opt("Sujet proposé", "Proposed topic") },
      { key: "linkedin", kind: "url", full: true, label: opt("Profil LinkedIn", "LinkedIn profile") },
    ],
  },
  presse: {
    section: opt("Votre média", "Your media"),
    fields: [
      { key: "organization", required: true, label: opt("Nom du média", "Media name") },
      { key: "media_type", kind: "select", required: true, label: opt("Type de média", "Media type"),
        options: [opt("Presse écrite", "Print"), opt("Site web / En ligne", "Online"), opt("Radio"), opt("Télévision", "Television"),
          opt("Agence de presse", "News agency"), opt("Photographe / Vidéaste indépendant", "Freelance photo / video")] },
      { key: "role", required: true, label: opt("Votre fonction (journaliste, photographe…)", "Your role (journalist, photographer…)") },
      { key: "team_size", kind: "select", required: true, label: opt("Personnes à accréditer", "People to accredit"),
        options: [opt("1"), opt("2"), opt("3"), opt("4 ou plus", "4 or more")] },
    ],
  },
};

/* Libellé de section */
function SectionLabel({ children, mb = "mb-8" }) {
  return (
    <div className={`flex items-center gap-3 ${mb}`}>
      <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
      <span className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>
        {children}
      </span>
    </div>
  );
}

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
    extra: {},
    country: "Mali",
    interests: [],
    message: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (TYPE_KEYS.includes(urlType)) {
      setForm((f) => ({ ...f, type: urlType }));
      setSent(null);
    }
  }, [urlType]);
  const toggleInterest = (i) =>
    setForm({
      ...form,
      interests: form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i],
    });

  const current = TYPES[form.type][fr ? "fr" : "en"];
  const spec = FIELDS[form.type];
  const lk = fr ? "fr" : "en";
  const setExtra = (k) => (e) => setForm({ ...form, extra: { ...form.extra, [k]: e.target.value } });
  const extraValue = (f) => {
    const v = form.extra[f.key];
    if (!v) return "";
    return f.kind === "select" ? (f.options[Number(v)] || {})[lk] || "" : v.trim();
  };

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
      `*${L("Pays", "Country")} :* ${form.country}`,
      ...spec.fields.map((f) => {
        const v = extraValue(f);
        return v ? `*${f.label[lk]} :* ${v}` : null;
      }),
      interests && `*${L("Thèmes d'intérêt", "Topics of interest")} :* ${interests}`,
      form.message && BLANK,
      form.message && `*${L("Précisions", "Details")} :*\n${form.message}`,
      BLANK,
      current.ask,
    ]);

    openWhatsApp(message);
    setSent({ message, firstName: form.first_name, label: current.label, type: form.type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setSent(null);
    setForm((f) => ({ ...f, first_name: "", last_name: "", phone: "", email: "", extra: {}, interests: [], message: "" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const field = (key, placeholder, opts = {}) => (
    <input
      required={!!opts.required}
      type={opts.type || "text"}
      data-testid={`reg-${key}`}
      placeholder={placeholder}
      value={form[key]}
      onChange={set(key)}
      className={`${inputCls} focus:border-[#D49B0F]`}
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
        {sent ? (
          <div data-testid="thank-you-screen" className="max-w-4xl mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={22} style={{ color: "#3AA57C" }} />
                <span className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: "#3AA57C" }}>
                  {L("Demande préparée", "Request ready")}
                </span>
              </div>
              <h2
                data-testid="thank-you-title"
                className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em]"
                style={{ color: INK }}
              >
                {L(`Merci ${sent.firstName} !`, `Thank you ${sent.firstName}!`)}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] sm:text-[16px] leading-[1.75]" style={{ color: "rgba(12,45,82,0.7)" }}>
                {L(
                  `Votre inscription en tant que « ${sent.label} » a été préparée dans WhatsApp. Si ce n'est pas déjà fait, appuyez sur Envoyer : l'équipe SEIM vous répondra directement sur WhatsApp.`,
                  `Your registration as "${sent.label}" has been prepared in WhatsApp. If you haven't yet, tap Send: the SEIM team will reply to you directly on WhatsApp.`
                )}
              </p>
            </Reveal>

            {/* Rappel des dates */}
            <Reveal delay={0.1}>
              <div
                className="relative overflow-hidden mt-12 p-8 sm:p-10"
                style={{ backgroundColor: INK, color: PAPER }}
                data-testid="thank-you-reminder"
              >
                <div className="seim-pattern" aria-hidden="true" />
                <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div className="space-y-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: GOLD }}>
                      {L("À noter dans votre agenda", "Save the date")}
                    </p>
                    <p className="flex items-start gap-3 font-serif font-extrabold text-2xl sm:text-3xl leading-tight">
                      <CalendarDays size={22} className="mt-1.5 shrink-0" style={{ color: GOLD }} />
                      {fr ? EVENT.dates_fr : EVENT.dates_en}
                    </p>
                    <p className="flex items-start gap-3 text-[14px] sm:text-[15px] leading-[1.6] font-medium" style={{ color: "rgba(242,244,246,0.8)" }}>
                      <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                      <span>
                        {fr ? EVENT.venue_fr : EVENT.venue_en}
                        <br />
                        {fr ? EVENT.city_fr : EVENT.city_en}
                      </span>
                    </p>
                  </div>
                  <Countdown dark />
                </div>

                {/* Agenda + invitation */}
                <div className="relative mt-8 pt-8 border-t flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center" style={{ borderColor: "rgba(242,244,246,0.15)" }}>
                  <button
                    type="button"
                    data-testid="thank-you-add-calendar"
                    onClick={() => downloadIcs(lang)}
                    className="inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: PAPER, color: INK }}
                  >
                    <CalendarPlus size={16} style={{ color: BRONZE }} />
                    {L("Ajouter à mon agenda", "Add to my calendar")}
                  </button>
                  <button
                    type="button"
                    data-testid="thank-you-invite-friend"
                    onClick={() =>
                      openWhatsApp(
                        L(
                          `Je viens de m'inscrire au SEIM — Salon de l'Épargne et de l'Investissement du Mali, ${EVENT.dates_fr} au CICB de Bamako. Conférences, masterclasses et networking autour de l'épargne et de l'investissement. Inscris-toi toi aussi : ${window.location.origin}/inscription`,
                          `I just registered for SEIM — Mali Savings & Investment Forum, ${EVENT.dates_en} at the CICB in Bamako. Conferences, masterclasses and networking on savings and investment. Join me: ${window.location.origin}/inscription`
                        ),
                        { share: true }
                      )
                    }
                    className="inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] uppercase tracking-[0.18em] font-bold border transition-colors hover:bg-white/5"
                    style={{ borderColor: "rgba(242,244,246,0.3)", color: PAPER }}
                  >
                    <UserPlus size={16} style={{ color: GOLD }} />
                    {L("Inviter un ami sur WhatsApp", "Invite a friend on WhatsApp")}
                  </button>
                  <a
                    href={googleCalendarUrl(lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="thank-you-google-calendar"
                    className="text-[12px] underline underline-offset-4 sm:ml-2 text-center font-medium transition-colors hover:text-[#F7B731]"
                    style={{ color: "rgba(242,244,246,0.75)" }}
                  >
                    {L("ou Google Agenda", "or Google Calendar")}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Actions */}
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
                <Link
                  to="/programme"
                  data-testid="thank-you-program-link"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: GOLD, color: INK }}
                >
                  {L("Voir le programme", "See the programme")}
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <button
                  type="button"
                  data-testid="thank-you-reopen-whatsapp"
                  onClick={() => openWhatsApp(sent.message)}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-bold border transition-colors hover:border-[#0C2D52]"
                  style={{ borderColor: RULE, color: INK }}
                >
                  <MessageCircle size={16} style={{ color: BRONZE }} />
                  {L("Rouvrir WhatsApp", "Reopen WhatsApp")}
                </button>
                <button
                  type="button"
                  data-testid="thank-you-new-registration"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-3 px-6 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-colors hover:text-[#D49B0F]"
                  style={{ color: "rgba(12,45,82,0.65)" }}
                >
                  <RotateCcw size={14} />
                  {L("Nouvelle inscription", "New registration")}
                </button>
              </div>
            </Reveal>
          </div>
        ) : (
        <form
          data-testid="registration-form"
          onSubmit={submit}
          className="max-w-4xl mx-auto px-5 sm:px-8"
        >
          {/* Base d'inscription */}
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
                        : "border-[rgba(12,45,82,0.15)] bg-transparent hover:border-[#D49B0F]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Icon size={20} style={{ color: active ? GOLD : BRONZE }} />
                      <span
                        className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                        style={{ borderColor: active ? INK : RULE }}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: INK }} />}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif font-extrabold text-lg leading-tight" style={{ color: INK }}>
                        {item.label}
                      </h3>
                      <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: "rgba(12,45,82,0.6)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Coordonnées */}
          <Reveal delay={0.1}>
            <SectionLabel>{L("Vos coordonnées", "Your details")}</SectionLabel>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-16">
              {field("first_name", t("register.firstName"), { required: true })}
              {field("last_name", t("register.lastName"), { required: true })}
              {field("phone", L("Téléphone / WhatsApp", "Phone / WhatsApp"), { required: true, type: "tel" })}
              {field("email", L("Email (facultatif)", "Email (optional)"), { type: "email" })}
              <div className="relative">
                <select
                  data-testid="reg-country"
                  aria-label={L("Pays", "Country")}
                  value={form.country}
                  onChange={set("country")}
                  className={`${inputCls} pr-8 focus:border-[#D49B0F] cursor-pointer`}
                  style={{ borderColor: RULE, color: INK }}
                >
                  {t("register.countries").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" style={{ color: BRONZE }} />
              </div>
            </div>
          </Reveal>

          {/* Champs adaptés au type */}
          <Reveal delay={0.12} key={`fields-${form.type}`}>
            <SectionLabel>{spec.section[lk]}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-16" data-testid={`reg-fields-${form.type}`}>
              {spec.fields.map((f) => {
                const placeholder = f.required ? f.label[lk] : `${f.label[lk]} ${L("(facultatif)", "(optional)")}`;
                const common = {
                  required: !!f.required,
                  "data-testid": `reg-${f.key}`,
                  "aria-label": f.label[lk],
                  value: form.extra[f.key] || "",
                  onChange: setExtra(f.key),
                  style: { borderColor: RULE, color: form.extra[f.key] || f.kind !== "select" ? INK : "rgba(12,45,82,0.35)" },
                };
                const span = f.full ? "sm:col-span-2" : "";
                if (f.kind === "select") {
                  return (
                    <div key={f.key} className={`relative ${span}`}>
                      <select {...common} className={`${inputCls} pr-8 focus:border-[#D49B0F] cursor-pointer`}>
                        <option value="" disabled>
                          {placeholder}
                        </option>
                        {f.options.map((o, i) => (
                          <option key={i} value={String(i)} style={{ color: INK }}>
                            {o[lk]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" style={{ color: BRONZE }} />
                    </div>
                  );
                }
                return (
                  <input
                    key={f.key}
                    {...common}
                    type="text"
                    inputMode={f.kind === "url" ? "url" : undefined}
                    placeholder={placeholder}
                    className={`${inputCls} ${span} focus:border-[#D49B0F]`}
                  />
                );
              })}
            </div>
          </Reveal>

          {/* Thèmes d'intérêt */}
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
                      className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-bold border transition-colors ${
                        active
                          ? "bg-[#0C2D52] text-[#F2F4F6] border-[#0C2D52]"
                          : "bg-transparent text-[#0C2D52]/70 border-[rgba(12,45,82,0.2)] hover:border-[#D49B0F] hover:text-[#0C2D52]"
                      }`}
                    >
                      {int_}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          {/* Précisions */}
          <Reveal delay={0.2}>
            <SectionLabel>{L("Précisions (facultatif)", "Details (optional)")}</SectionLabel>
            <textarea
              rows={3}
              data-testid="reg-message"
              placeholder={L("Un mot à ajouter pour l'équipe SEIM ?", "Anything to add for the SEIM team?")}
              value={form.message}
              onChange={set("message")}
              className={`${inputCls} resize-none mb-16 focus:border-[#D49B0F]`}
              style={{ borderColor: RULE, color: INK }}
            />
          </Reveal>

          {/* Envoi WhatsApp */}
          <Reveal delay={0.25}>
            <div className="pt-4 border-t" style={{ borderColor: RULE }}>
              <button
                type="submit"
                data-testid="reg-submit-button"
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                <MessageCircle size={16} style={{ color: GOLD }} />
                {t("register.submit")}
              </button>
              <p className="mt-4 text-[13px] leading-[1.6] font-medium" style={{ color: "rgba(12,45,82,0.6)" }}>
                {t("register.whatsappNote")}
              </p>
            </div>
          </Reveal>
        </form>
        )}
      </section>
    </div>
  );
}