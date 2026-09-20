import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

const inputCls =
  "w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm transition-all";

export default function Inscription() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", country: "Mali",
    profession: "", company: "", category: "particulier", interests: [], pass_type: "visiteur",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleInterest = (i) =>
    setForm({ ...form, interests: form.interests.includes(i) ? form.interests.filter((x) => x !== i) : [...form.interests, i] });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const reg = await api.register(form);
      toast.success(t("register.success"));
      navigate(`/confirmation/${reg.code}`);
    } catch {
      toast.error("Erreur — veuillez réessayer");
    } finally {
      setSending(false);
    }
  };

  const passes = ["visiteur", "pro", "vip"];
  const categories = ["particulier", "etudiant", "pro", "entrepreneur", "presse"];

  return (
    <div data-testid="register-page">
      <PageHero eyebrow={t("register.eyebrow")} title={t("register.title")} subtitle={t("register.subtitle")} />

      <section className="py-16 sm:py-24 bg-bone">
        <form data-testid="registration-form" onSubmit={submit} className="max-w-4xl mx-auto px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mb-5">{t("register.pass")}</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {passes.map((p) => {
                const pass = t(`register.passes.${p}`);
                const active = form.pass_type === p;
                return (
                  <button
                    type="button"
                    key={p}
                    data-testid={`pass-${p}-option`}
                    onClick={() => setForm({ ...form, pass_type: p })}
                    className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
                      active ? "border-gold bg-white shadow-xl shadow-gold/10 -translate-y-1" : "border-navy/10 bg-white hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-gold bg-gold" : "border-navy/25"}`}>
                        {active && <Check size={12} className="text-navy" strokeWidth={3} />}
                      </span>
                      <span className="font-display font-extrabold text-gold-dark">{pass.price}</span>
                    </div>
                    <h3 className="mt-4 font-display font-bold text-navy text-lg">{pass.name}</h3>
                    <p className="mt-1.5 text-navy/55 text-sm leading-relaxed">{pass.desc}</p>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required data-testid="reg-firstname" placeholder={t("register.firstName")} value={form.first_name} onChange={set("first_name")} className={inputCls} />
              <input required data-testid="reg-lastname" placeholder={t("register.lastName")} value={form.last_name} onChange={set("last_name")} className={inputCls} />
              <input required type="email" data-testid="reg-email" placeholder={t("register.email")} value={form.email} onChange={set("email")} className={inputCls} />
              <input required data-testid="reg-phone" placeholder={t("register.phone")} value={form.phone} onChange={set("phone")} className={inputCls} />
              <select data-testid="reg-country" value={form.country} onChange={set("country")} className={inputCls}>
                {t("register.countries").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select data-testid="reg-category" value={form.category} onChange={set("category")} className={inputCls}>
                {categories.map((c) => (
                  <option key={c} value={c}>{t(`register.categories.${c}`)}</option>
                ))}
              </select>
              <input data-testid="reg-profession" placeholder={t("register.profession")} value={form.profession} onChange={set("profession")} className={inputCls} />
              <input data-testid="reg-company" placeholder={t("register.company")} value={form.company} onChange={set("company")} className={inputCls} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark mt-10 mb-4">{t("register.interests")}</p>
            <div className="flex flex-wrap gap-2.5" data-testid="reg-interests">
              {t("register.interestsList").map((int_, i) => {
                const active = form.interests.includes(String(i));
                return (
                  <button
                    type="button"
                    key={i}
                    data-testid={`interest-chip-${i}`}
                    onClick={() => toggleInterest(String(i))}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      active ? "bg-navy text-gold" : "bg-white text-navy/55 border border-navy/15 hover:border-gold/60"
                    }`}
                  >
                    {int_}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <button
              type="submit"
              disabled={sending}
              data-testid="reg-submit-button"
              className="mt-12 w-full sm:w-auto px-12 py-4.5 py-4 rounded-full bg-gold text-navy font-display font-bold text-lg hover:bg-gold-dark transition-colors disabled:opacity-60 animate-pulse-glow"
            >
              {sending ? t("register.submitting") : t("register.submit")}
            </button>
          </Reveal>
        </form>
      </section>
    </div>
  );
}
