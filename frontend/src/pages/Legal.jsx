import { PageHero } from "../components/PageHero";
import { EVENT } from "../config/event";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.15)";

/* ---------- Composant Section ---------- */
function LegalSection({ num, title, children }) {
  return (
    <section className="grid grid-cols-[auto_1fr] gap-4 sm:gap-8 items-start py-8 border-b last:border-0" style={{ borderColor: RULE }}>
      {/* Numérotation éditoriale */}
      <span 
        className="font-mono-num text-[11px] tracking-[0.15em] pt-1"
        style={{ color: BRONZE }}
      >
        {num}
      </span>
      
      {/* Contenu */}
      <div>
        <h2 
          className="font-serif text-lg sm:text-xl tracking-[-0.01em] mb-3"
          style={{ color: INK }}
        >
          {title}
        </h2>
        <div 
          className="font-serif text-[15px] sm:text-[16px] leading-[1.75]"
          style={{ color: "rgba(12,45,82,0.65)" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Legal({ type }) {
  const isLegal = type === "legal";

  return (
    <div data-testid={`${type}-page`} style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow="SEIM"
        title={isLegal ? "Mentions légales" : "Politique de confidentialité"}
        subtitle={isLegal ? "Legal notice" : "Privacy policy"}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          
          {/* En-tête de document */}
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span 
              className="font-mono-num text-[10px] uppercase tracking-[0.28em]"
              style={{ color: BRONZE }}
            >
              {isLegal ? "Document officiel" : "Données personnelles"}
            </span>
          </div>

          {isLegal ? (
            <div className="border-t" style={{ borderColor: RULE }}>
              <LegalSection num="01" title="Éditeur">
                <p>
                  {EVENT.name_fr} (SEIM) — {EVENT.address_fr}. Contact :{" "}
                  {EVENT.emails.map((mail, i) => (
                    <span key={mail}>
                      {i > 0 && " ou "}
                      <a
                        href={`mailto:${mail}`}
                        className="border-b transition-colors hover:text-[#B57A0A] hover:border-[#B57A0A] break-all"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        {mail}
                      </a>
                    </span>
                  ))}{" "}
                  ·{" "}
                  <a
                    href={`tel:${EVENT.phone.replace(/\s/g, "")}`}
                    className="border-b transition-colors hover:text-[#B57A0A] hover:border-[#B57A0A]"
                    style={{ color: INK, borderColor: BRONZE }}
                  >
                    {EVENT.phone}
                  </a>
                  .
                </p>
              </LegalSection>

              <LegalSection num="02" title="Propriété intellectuelle">
                <p>
                  L'ensemble des contenus du site (textes, visuels, logo SEIM)
                  est protégé. Toute reproduction sans autorisation est
                  interdite.
                </p>
              </LegalSection>

              <LegalSection num="03" title="Crédits">
                <p>
                  Site officiel du Salon de l'Épargne et de l'Investissement
                  du Mali — Édition 2026, Bamako.
                </p>
              </LegalSection>
            </div>
          ) : (
            <div className="border-t" style={{ borderColor: RULE }}>
              <LegalSection num="01" title="Données collectées">
                <p>
                  Les informations saisies dans les formulaires
                  d'inscription et de contact (nom, téléphone, email, structure)
                  ne sont pas enregistrées sur ce site : elles sont transmises
                  directement à l'équipe SEIM par WhatsApp, uniquement lorsque
                  vous envoyez le message. Elles servent exclusivement à
                  l'organisation de l'événement et à la communication associée.
                </p>
              </LegalSection>

              <LegalSection num="02" title="Vos droits">
                <p>
                  Vous pouvez demander la modification ou la suppression de vos
                  données à tout moment en écrivant à{" "}
                  {EVENT.emails.map((mail, i) => (
                    <span key={mail}>
                      {i > 0 && " ou "}
                      <a
                        href={`mailto:${mail}`}
                        className="border-b transition-colors hover:text-[#B57A0A] hover:border-[#B57A0A] break-all"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        {mail}
                      </a>
                    </span>
                  ))}
                  .
                </p>
              </LegalSection>

              <LegalSection num="03" title="Conservation">
                <p>
                  Les données sont conservées pour la durée nécessaire à
                  l'organisation des éditions du salon.
                </p>
              </LegalSection>
            </div>
          )}

          {/* Pied de page documentaire */}
          <div className="mt-16 pt-6 border-t flex items-center justify-between text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: RULE, color: "rgba(12,45,82,0.4)" }}>
            <span>SEIM · {isLegal ? "Légal" : "Confidentialité"}</span>
            <span className="font-mono-num">Édition 02 — MMXXVI</span>
          </div>
        </div>
      </section>
    </div>
  );
}