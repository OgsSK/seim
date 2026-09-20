export function Marquee({ items, slow = false, className = "", dark = false, inkClass, iconClass }) {
  const doubled = [...items, ...items];
  const ink = inkClass || (dark ? "text-white/25" : "text-navy/15");
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex items-center ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className={`font-display font-bold text-lg sm:text-2xl uppercase tracking-wide px-6 ${ink}`}>
              {item}
            </span>
            <svg width="14" height="12" viewBox="0 0 14 12" className={`${iconClass || "text-gold"} shrink-0`} fill="none">
              <path d="M1 10 L5 5 L7.5 8 L13 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
