export function Logo({ dark = false, compact = false }) {
  const navy = dark ? "#FFFFFF" : "#0B132B";
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width="40" height="32" viewBox="0 0 48 38" fill="none" aria-hidden="true">
        <path d="M2 30 L14 16 L21 23 L36 4" stroke={navy} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10 34 L22 20 L29 27 L46 6" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M46 6 L38 6 L46 14 Z" fill="#F59E0B" />
      </svg>
      <div className="leading-none">
        <span className={`font-display font-extrabold text-2xl tracking-tight ${dark ? "text-white" : "text-navy"}`}>
          seim<span className="text-gold">.</span>
        </span>
        {!compact && (
          <p className={`text-[9px] font-semibold uppercase tracking-[0.14em] mt-0.5 ${dark ? "text-white/60" : "text-navy/60"}`}>
            Épargne · Investissement · Mali
          </p>
        )}
      </div>
    </div>
  );
}
