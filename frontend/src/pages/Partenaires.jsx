import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Handshake, ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium */
const PAPER = "#f4efe4";
const INK = "#12110f";
const BRONZE = "#8a6a3e";
const RULE = "rgba(18,17,15,0.12)";
const RULE_LIGHT = "rgba(18,17,15,0.08)";

const TIER_ORDER = [
  "principal",
  "or",
  "argent",
  "institutionnel",
  "media",
  "technique",
];

/* Hiérarchie visuelle des tiers par la typographie */
const TIER_STYLE = {
  principal: "font-serif text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em]",
  or: "font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em]",
  argent: "font-serif text-xl sm:text-2xl lg:text-3xl tracking-[-0.01em]",
  institutionnel: "font-serif text-lg sm:text-xl lg:text-2xl",
  media: "font-serif text-base sm:text-lg",
  technique: "font-serif text-sm sm:text-base",
};

/* Style des champs (ligne éditoriale) */
const inputCls =
  "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] placeholder-[#12110f]/30 focus:outline-none focus:ring-0 transition-colors appearance-none";

/* ---------- Empty state ---------- */
function EmptyState({ lang }) {
  return (
    <div
      className="py-20 text-center border-y"
      style={{ borderColor: RULE }}
      data-testid="partners-empty"
    >
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <Handshake size={32} strokeWidth={1} />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {lang === "fr"
          ? "Les partenaires seront annoncés prochainement"
          : "Partners will be announced soon"}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(18,17,15,0.55)" }}
      >
        {lang === "fr"
          ? "La liste des partenaires et sponsors de la 2ᵉ édition est en cours de finalisation."
          : "The list of partners and sponsors of the 2nd edition is being finalized."}
      </p>
    </div>
  );
}

export default function Partenaires() {
  const { t, lang } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api
      .partners()
      .then(setPartners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.contact({ ...form, request_type: "sponsoring" });
      toast.success(t("contact.sent"));
      setForm({ name: "", email: "", organization: "", message: "" });
    } catch {
      toast.error(
        lang === "fr" ? "Erreur — veuillez réessayer" : "Error — please try again"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="partners-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("partners.eyebrow")}
        title={t("partners.title")}
        subtitle={t("partners.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16 sm:space-y-24">

          {/* ============ Liste des partenaires par tiers ============ */}
          {loading ? (
            <div className="space-y-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 w-32 animate-pulse" style={{ backgroundColor: RULE_LIGHT }} />
                  <div className="h-10 w-3/4 animate-pulse" style={{ backgroundColor: RULE_LIGHT }} />
                </div>
              ))}
            </div>
          ) : partners.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            TIER_ORDER.map((tier) => {
              const list = partners.filter((p) => p.tier === tier);
              if (!list.length) return null;
              return (
                <div key={tier} data-testid={`partner-tier-${tier}`}>
                  <Reveal>
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <span
                        className="font-mono-num text-[9px] sm:text-[10px] uppercase tracking-[0.24em] whitespace-nowrap"
                        style={{ color: BRONZE }}
                      >
                        {t(`partners.tiers.${tier}`)}
                      </span>
                      <span className="h-px flex-1" style={{ backgroundColor: RULE }} />
                    </div>
                  </Reveal>

                  <Stagger
                    key={list.length + tier}
                    className="flex flex-wrap items-baseline gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6"
                  >
                    {list.map((p) => (
                      <StaggerItem key={p.id}>
                        <div
                          data-testid={`partner-logo-${p.id}`}
                          className={`${TIER_STYLE[tier]} cursor-default flex items-baseline gap-2`}
                          style={{ color: INK }}
                        >
                          <span className="font-serif italic shrink-0 leading-none" style={{ color: BRONZE }}>
                            ·
                          </span>
                          {p.name}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              );
            })
          )}

          {/* ============ Bloc devenir partenaire ============ */}
          <Reveal>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 pt-12 border-t" style={{ borderColor: RULE }}>
              
              {/* Colonne texte (Gauche) */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
                    {lang === "fr" ? "Partenariat" : "Partnership"}
                  </span>
                </div>

                <h2 className="font-serif tracking-[-0.02em] text-2xl sm:text-3xl lg:text-[2.4rem] leading-[1.1] mb-5" style={{ color: INK }}>
                  {t("partners.form.title")}
                </h2>

                <p className="font-serif italic text-[14px] sm:text-[15px] leading-[1.75] mb-8" style={{ color: "rgba(18,17,15,0.6)" }}>
                  {t("partners.form.desc")}
                </p>

                <div className="space-y-3">
                  {[
                    "Visibilité premium sur tous les supports",
                    "Stand dans l'espace expo",
                    "Prise de parole & WebTV",
                  ].map((f, i) => (
                    <p key={i} className="flex items-start gap-3 text-[13px] sm:text-[14px] leading-[1.6]" style={{ color: "rgba(18,17,15,0.7)" }}>
                      <span className="w-1 h-1 rotate-45 shrink-0 mt-2" style={{ backgroundColor: BRONZE }} />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Colonne formulaire (Droite) */}
              <div className="lg:col-span-6">
                <form data-testid="sponsorship-form" onSubmit={submit} className="space-y-8">
                  
                  {/* Bloc 1 */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(18,17,15,0.45)" }}>
                      {lang === "fr" ? "Vos coordonnées" : "Your details"}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <input
                        required
                        data-testid="sponsor-name-input"
                        placeholder={t("contact.name")}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`${inputCls} focus:border-[#8a6a3e]`}
                        style={{ borderColor: RULE, color: INK }}
                      />
                      <input
                        required
                        type="email"
                        data-testid="sponsor-email-input"
                        placeholder={t("contact.email")}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`${inputCls} focus:border-[#8a6a3e]`}
                        style={{ borderColor: RULE, color: INK }}
                      />
                    </div>

                    <input
                      data-testid="sponsor-org-input"
                      placeholder={t("contact.org")}
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      className={`${inputCls} focus:border-[#8a6a3e] mt-4 sm:mt-6`}
                      style={{ borderColor: RULE, color: INK }}
                    />
                  </div>

                  {/* Bloc 2 */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(18,17,15,0.45)" }}>
                      {lang === "fr" ? "Votre message" : "Your message"}
                    </p>
                    <textarea
                      required
                      rows={4}
                      data-testid="sponsor-message-input"
                      placeholder={t("contact.message")}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputCls} focus:border-[#8a6a3e] resize-none`}
                      style={{ borderColor: RULE, color: INK }}
                    />
                  </div>

                  {/* Bouton Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      data-testid="sponsor-submit-button"
                      className="group inline-flex justify-center items-center gap-2 sm:gap-3 w-full sm:w-auto px-8 py-4 text-[12px] uppercase tracking-[0.18em] font-medium transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: INK, color: PAPER }}
                    >
                      {sending ? t("contact.sending") : t("partners.become")}
                      <ArrowUpRight 
                        size={15} 
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                        style={{ color: BRONZE }} 
                      />
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}