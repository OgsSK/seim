export function Marquee({ items, slow = false, className = "", dark = false, inkClass, iconClass }) {
  const doubled = [...items, ...items];
  
  // Couleurs par défaut selon le thème (clair/sombre)
  const ink = inkClass || (dark ? "rgba(244,239,228,0.4)" : "rgba(18,17,15,0.35)");
  const icon = iconClass || "#8a6a3e"; // Bronze

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex items-center ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span 
              className="font-mono-num uppercase tracking-[0.18em] text-[11px] sm:text-[13px] px-6"
              style={{ color: ink }}
            >
              {item}
            </span>
            <svg 
              width="12" 
              height="10" 
              viewBox="0 0 14 12" 
              className="shrink-0 opacity-80" 
              style={{ color: icon }}
              fill="none"
            >
              <path 
                d="M1 10 L5 5 L7.5 8 L13 1" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}