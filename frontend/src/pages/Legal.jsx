import { PageHero } from "../components/PageHero";
import { EVENT } from "../config/event";

export default function Legal({ type }) {
  const isLegal = type === "legal";
  return (
    <div data-testid={`${type}-page`}>
      <PageHero
        eyebrow="SEIM"
        title={isLegal ? "Mentions légales" : "Politique de confidentialité"}
        subtitle={isLegal ? "Legal notice" : "Privacy policy"}
      />
      <section className="py-16 bg-bone">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8 text-navy/70 leading-relaxed">
          {isLegal ? (
            <>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Éditeur</h2>
                <p>{EVENT.name_fr} (SEIM) — {EVENT.address_fr}. Contact : {EVENT.email} · {EVENT.phone}.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Propriété intellectuelle</h2>
                <p>L'ensemble des contenus du site (textes, visuels, logo SEIM) est protégé. Toute reproduction sans autorisation est interdite.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Crédits</h2>
                <p>Site officiel du Salon de l'Épargne et de l'Investissement du Mali — Édition 2026, Bamako.</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Données collectées</h2>
                <p>Les informations transmises via les formulaires d'inscription et de contact (nom, email, téléphone) sont utilisées uniquement pour l'organisation de l'événement et la communication associée.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Vos droits</h2>
                <p>Vous pouvez demander la modification ou la suppression de vos données à tout moment en écrivant à {EVENT.email}.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-navy text-lg mb-2">Conservation</h2>
                <p>Les données sont conservées pour la durée nécessaire à l'organisation des éditions du salon.</p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
