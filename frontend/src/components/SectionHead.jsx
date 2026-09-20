import { useState } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({ eyebrow, title, subtitle, center = true, dark = false }) {
  return (
    <div className={`${center ? "text-center mx-auto" : "text-left"} max-w-3xl mb-12 sm:mb-16`}>
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`font-display font-extrabold tracking-tight text-2xl sm:text-3xl lg:text-4xl ${dark ? "text-white" : "text-navy"}`}>
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className={`mt-4 text-base leading-relaxed ${dark ? "text-white/60" : "text-navy/60"}`}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

export function SmartImg({ src, alt, className = "", fallbackClassName = "" }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`bg-navy-soft flex items-center justify-center ${className} ${fallbackClassName}`}>
        <svg width="40" height="32" viewBox="0 0 48 38" fill="none" aria-hidden="true">
          <path d="M10 34 L22 20 L29 27 L46 6" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setErr(true)} />;
}
