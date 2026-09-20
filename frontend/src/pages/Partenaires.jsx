import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

const TIER_ORDER = ["principal", "or", "argent", "institutionnel", "media", "technique"];
const TIER_STYLE = {
  principal: "text-2xl sm:text-3xl font-extrabold text-navy",
  or: "text-xl sm:text-2xl font-bold text-gold-dark",
  argent: "text-lg sm:text-xl font-bold text-navy/70",
  institutionnel: "text-base sm:text-lg font-semibold text-navy/70",
  media: "text-base sm:text-lg font-semibold text-navy/60",
  technique: "text-base font-semibold text-navy/50",
};

export default function Partenaires() {
  const { t } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.partners().then(setPartners).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.contact({ ...form, request_type: "sponsoring" });
      toast.success(t("contact.sent"));
      setForm({ name: "", email: "", organization: "", message: "" });
    } catch {
      toast.error("Erreur");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="partners-page">
      <PageHero eyebrow={t("partners.eyebrow")} title={t("partners.title")} subtitle={t("partners.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16">
          {TIER_ORDER.map((tier) => {
            const list = partners.filter((p) => p.tier === tier);
            if (!list.length) return null;
            return (
              <div key={tier} data-testid={`partner-tier-${tier}`}>
                <Reveal>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-gold-dark mb-8 flex items-center gap-4">
                    {t(`partners.tiers.${tier}`)}
                    <span className="h-px flex-1 bg-navy/10" />
                  </h2>
                </Reveal>
                <Stagger className="flex flex-wrap items-center gap-x-12 gap-y-6">
                  {list.map((p) => (
                    <StaggerItem key={p.id}>
                      <div data-testid={`partner-logo-${p.id}`} className={`font-display ${TIER_STYLE[tier]} hover:text-gold transition-colors cursor-default flex items-center gap-3`}>
                        <svg width="18" height="14" viewBox="0 0 14 12" fill="none" className="shrink-0 opacity-60">
                          <path d="M1 10 L5 5 L7.5 8 L13 1" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {p.name}
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            );
          })}

          <Reveal>
            <div className="bg-white border border-navy/10 shadow-xl shadow-navy/5 rounded-3xl overflow-hidden grid lg:grid-cols-2">
              <div className="p-10 sm:p-14">
                <h2 className="font-display font-extrabold text-navy text-2xl sm:text-3xl">{t("partners.form.title")}</h2>
                <p className="mt-4 text-navy/60 leading-relaxed">{t("partners.form.desc")}</p>
                <div className="mt-8 space-y-3">
                  {["Visibilité premium sur tous les supports", "Stand dans l'espace expo", "Prise de parole & WebTV"].map((f, i) => (
                    <p key={i} className="flex items-center gap-3 text-navy/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> {f}
                    </p>
                  ))}
                </div>
              </div>
              <form data-testid="sponsorship-form" onSubmit={submit} className="bg-bone p-10 sm:p-14 space-y-4 border-t lg:border-t-0 lg:border-l border-navy/10">
                <input required data-testid="sponsor-name-input" placeholder={t("contact.name")} value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm transition-all" />
                <input required type="email" data-testid="sponsor-email-input" placeholder={t("contact.email")} value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm transition-all" />
                <input data-testid="sponsor-org-input" placeholder={t("contact.org")} value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm transition-all" />
                <textarea required rows={3} data-testid="sponsor-message-input" placeholder={t("contact.message")} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-white border border-navy/15 text-navy placeholder-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm resize-none transition-all" />
                <button type="submit" disabled={sending} data-testid="sponsor-submit-button"
                  className="w-full px-8 py-4 rounded-full bg-gold text-navy font-display font-bold hover:bg-gold-dark transition-colors disabled:opacity-60">
                  {sending ? t("contact.sending") : t("partners.become")}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
