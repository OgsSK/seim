import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium */
const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.15)";
const RULE_LIGHT = "rgba(18,17,15,0.08)";

/* Style des champs de saisie (ligne éditoriale) */
const inputCls =
  "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] placeholder-[#12110f]/30 focus:outline-none focus:ring-0 transition-colors appearance-none";

export default function Inscription() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Mali",
    profession: "",
    company: "",
    category: "particulier",
    interests: [],
    pass_type: "visiteur",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleInterest = (i) =>
    setForm({
      ...form,
      interests: form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i],
    });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const reg = await api.register(form);
      toast.success(t("register.success"));
      navigate(`/confirmation/${reg.code}`);
    } catch {
      toast.error(
        lang === "fr" ? "Erreur — veuillez réessayer" : "Error — please try again"
      );
    } finally {
      setSending(false);
    }
  };

  const passes = ["visiteur", "pro", "vip"];
  const categories = [
    "particulier",
    "etudiant",
    "pro",
    "entrepreneur",
    "presse",
  ];

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
          {/* ============ Choix du pass ============ */}
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
              <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                {t("register.pass")}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
              {passes.map((p) => {
                const pass = t(`register.passes.${p}`);
                const active = form.pass_type === p;
                return (
                  <button
                    type="button"
                    key={p}
                    data-testid={`pass-${p}-option`}
                    onClick={() => setForm({ ...form, pass_type: p })}
                    className={`text-left p-6 border transition-colors flex flex-col justify-between ${
                      active
                        ? "border-[#8a6a3e] bg-[#f4efe4]"
                        : "border-[rgba(18,17,15,0.15)] bg-transparent hover:border-[#8a6a3e]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="font-serif text-xl leading-tight" style={{ color: INK }}>
                        {pass.name}
                      </h3>
                      <span 
                        className="font-mono-num text-[11px] uppercase tracking-[0.1em] shrink-0" 
                        style={{ color: active ? BRONZE : "rgba(18,17,15,0.45)" }}
                      >
                        {pass.price}
                      </span>
                    </div>
                    <p 
                      className="font-serif italic text-[13px] leading-[1.6]"
                      style={{ color: "rgba(18,17,15,0.55)" }}
                    >
                      {pass.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ============ Coordonnées ============ */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
              <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                {lang === "fr" ? "Vos coordonnées" : "Your details"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-16">
              <input
                required
                data-testid="reg-firstname"
                placeholder={t("register.firstName")}
                value={form.first_name}
                onChange={set("first_name")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
              <input
                required
                data-testid="reg-lastname"
                placeholder={t("register.lastName")}
                value={form.last_name}
                onChange={set("last_name")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
              <input
                required
                type="email"
                data-testid="reg-email"
                placeholder={t("register.email")}
                value={form.email}
                onChange={set("email")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
              <input
                required
                data-testid="reg-phone"
                placeholder={t("register.phone")}
                value={form.phone}
                onChange={set("phone")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
              <input
                data-testid="reg-profession"
                placeholder={t("register.profession")}
                value={form.profession}
                onChange={set("profession")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
              <input
                data-testid="reg-company"
                placeholder={t("register.company")}
                value={form.company}
                onChange={set("company")}
                className={`${inputCls} focus:border-[#8a6a3e]`}
                style={{ borderColor: RULE, color: INK }}
              />
            </div>
          </Reveal>

          {/* ============ Profil ============ */}
          <Reveal delay={0.15}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
              <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                {lang === "fr" ? "Votre profil" : "Your profile"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-16">
              <div className="relative">
                <select
                  data-testid="reg-country"
                  value={form.country}
                  onChange={set("country")}
                  className={`${inputCls} focus:border-[#8a6a3e] cursor-pointer`}
                  style={{ borderColor: RULE, color: INK }}
                >
                  {t("register.countries").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  data-testid="reg-category"
                  value={form.category}
                  onChange={set("category")}
                  className={`${inputCls} focus:border-[#8a6a3e] cursor-pointer`}
                  style={{ borderColor: RULE, color: INK }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t(`register.categories.${c}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Reveal>

          {/* ============ Centres d'intérêt ============ */}
          <Reveal delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
              <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                {t("register.interests")}
              </span>
            </div>
            
            <div
              className="flex flex-wrap gap-2 sm:gap-3 mb-16"
              data-testid="reg-interests"
            >
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
                        ? "bg-[#12110f] text-[#f4efe4] border-[#12110f]"
                        : "bg-transparent text-[#12110f]/60 border-[rgba(18,17,15,0.2)] hover:border-[#8a6a3e] hover:text-[#12110f]"
                    }`}
                  >
                    {int_}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ============ Bouton submit ============ */}
          <Reveal delay={0.25}>
            <div className="pt-4 border-t" style={{ borderColor: RULE }}>
              <button
                type="submit"
                disabled={sending}
                data-testid="reg-submit-button"
                className="mt-8 w-full sm:w-auto px-10 py-4 text-[12px] uppercase tracking-[0.18em] font-medium transition-opacity disabled:opacity-50"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                {sending ? t("register.submitting") : t("register.submit")}
              </button>
            </div>
          </Reveal>
        </form>
      </section>
    </div>
  );
}