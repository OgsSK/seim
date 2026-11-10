// Logo officiel SEIM (charte graphique) — ne pas déformer ni recolorer.
// dark = version blanche pour fonds bleu foncé.
export function Logo({ dark = false, compact = false, className = "" }) {
  const src = dark ? "/assets/brand/seim-logo-white.png" : "/assets/brand/seim-logo.png";
  const size = compact ? "h-10 sm:h-12" : "h-14 sm:h-16";
  return (
    <img
      src={src}
      alt="SEIM — Salon de l'Épargne & de l'Investissement du Mali"
      className={`${size} w-auto select-none ${className}`}
      draggable="false"
      data-testid="seim-logo"
    />
  );
}
