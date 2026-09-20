import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { EVENT } from "../config/event";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

const inputCls =
  "w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm transition-all";

export default function Contact() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", organization: "",
    request_type: params.get("type") || "general", message: "",
  });

  const types = ["general", "partenariat", "sponsoring", "exposition", "presse", "intervention"];

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.contact(form);
      toast.success(t("contact.sent"));
      setForm({ ...form, name: "", email: "", organization: "", message: "" });
    } catch {
      toast.error("Erreur — veuillez réessayer");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <PageHero eyebrow={t("contact.eyebrow")} title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-5 gap-12">
          <Reveal className="lg:col-span-2">
            <h2 className="font-display font-bold text-navy text-xl mb-6">{t("contact.info")}</h2>
            <div className="space-y-4">
              <a href={`tel:${EVENT.phone.replace(/\s/g, "")}`} data-testid="contact-phone" className="flex items-center gap-4 bg-white rounded-2xl border border-navy/10 p-5 hover:border-gold/50 transition-colors">
                <span className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0"><Phone size={18} /></span>
                <div><p className="text-xs text-navy/45 font-semibold uppercase tracking-wider">Tél.</p><p className="font-semibold text-navy">{EVENT.phone}</p></div>
              </a>
              <a href={`https://wa.me/${EVENT.whatsapp.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp" className="flex items-center gap-4 bg-white rounded-2xl border border-navy/10 p-5 hover:border-gold/50 transition-colors">
                <span className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0"><MessageCircle size={18} /></span>
                <div><p className="text-xs text-navy/45 font-semibold uppercase tracking-wider">WhatsApp</p><p className="font-semibold text-navy">{EVENT.whatsapp}</p></div>
              </a>
              <a href={`mailto:${EVENT.email}`} data-testid="contact-email" className="flex items-center gap-4 bg-white rounded-2xl border border-navy/10 p-5 hover:border-gold/50 transition-colors">
                <span className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0"><Mail size={18} /></span>
                <div><p className="text-xs text-navy/45 font-semibold uppercase tracking-wider">Email</p><p className="font-semibold text-navy">{EVENT.email}</p></div>
              </a>
              <div className="flex items-center gap-4 bg-white rounded-2xl border border-navy/10 p-5">
                <span className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0"><MapPin size={18} /></span>
                <div><p className="text-xs text-navy/45 font-semibold uppercase tracking-wider">Adresse</p><p className="font-semibold text-navy text-sm">{EVENT.address_fr}</p></div>
              </div>
              <a href={EVENT.facebook} target="_blank" rel="noopener noreferrer" data-testid="contact-facebook" className="flex items-center gap-4 bg-navy rounded-2xl p-5 hover:bg-navy-soft transition-colors">
                <span className="w-11 h-11 rounded-xl bg-gold text-navy flex items-center justify-center shrink-0"><Facebook size={18} /></span>
                <div><p className="text-xs text-white/50 font-semibold uppercase tracking-wider">{t("contact.follow")}</p><p className="font-semibold text-white">Facebook — SEIM</p></div>
              </a>
            </div>
            <div className="mt-6 rounded-2xl overflow-hidden border border-navy/10">
              <iframe
                title="SEIM Bamako map"
                src="https://maps.google.com/maps?q=Centre%20International%20de%20Conf%C3%A9rences%20de%20Bamako&z=14&output=embed"
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-3">
            <form data-testid="contact-form" onSubmit={submit} className="bg-white rounded-3xl border border-navy/10 p-8 sm:p-10 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required data-testid="contact-name-input" placeholder={t("contact.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                <input required type="email" data-testid="contact-email-input" placeholder={t("contact.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>
              <input data-testid="contact-org-input" placeholder={t("contact.org")} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className={inputCls} />
              <select data-testid="contact-type-select" value={form.request_type} onChange={(e) => setForm({ ...form, request_type: e.target.value })} className={inputCls}>
                {types.map((ty) => (
                  <option key={ty} value={ty}>{t(`contact.types.${ty}`)}</option>
                ))}
              </select>
              <textarea required rows={5} data-testid="contact-message-input" placeholder={t("contact.message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} />
              <button type="submit" disabled={sending} data-testid="contact-submit-button"
                className="px-10 py-4 rounded-full bg-gold text-navy font-display font-bold hover:bg-gold-dark transition-colors disabled:opacity-60">
                {sending ? t("contact.sending") : t("contact.send")}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
