import { useState } from "react";
import { Reveal } from "./Reveal";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const GOLD = "#F7B731"; // Pour le mode sombre
const RULE = "rgba(12,45,82,0.12)";
const RULE_INK = "rgba(242,244,246,0.15)";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  center = true,
  dark = false,
}) {
  return (
    <div
      className={`${
        center ? "text-center mx-auto flex flex-col items-center" : "text-left flex flex-col items-start"
      } max-w-3xl mb-12 sm:mb-16 lg:mb-20`}
    >
      <Reveal>
        <div className={`flex items-center gap-3 mb-4 sm:mb-5 ${center ? "justify-center" : "justify-start"}`}>
          {/* Filet éditorial */}
          {!center && (
            <span className="w-8 h-px" style={{ backgroundColor: dark ? RULE_INK : RULE }} />
          )}
          
          <p
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium"
            style={{ color: dark ? GOLD : BRONZE }}
          >
            {eyebrow}
          </p>

          {center && (
            <span className="w-8 h-px" style={{ backgroundColor: dark ? RULE_INK : RULE }} />
          )}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          className={`font-serif tracking-[-0.025em] text-3xl sm:text-4xl lg:text-5xl leading-[1.1] break-words ${
            center ? "text-center" : "text-left"
          }`}
          style={{ color: dark ? PAPER : INK }}
        >
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 sm:mt-6 text-[15px] sm:text-[16px] leading-[1.75] ${
              center ? "text-center mx-auto" : "text-left"
            }`}
            style={{ color: dark ? "rgba(242,244,246,0.55)" : "rgba(12,45,82,0.6)" }}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function SmartImg({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  aspectRatio,
  ...rest
}) {
  const [err, setErr] = useState(false);

  // Image de fallback (chevron SEIM) adaptée à la charte
  if (err) {
    return (
      <div
        className={`flex items-center justify-center ${className} ${fallbackClassName}`}
        style={{
          backgroundColor: "#E3E8ED", // Un beige/gris chaud pour le placeholder
          ...(aspectRatio ? { aspectRatio } : {}),
        }}
      >
        <svg
          width="40"
          height="32"
          viewBox="0 0 48 38"
          fill="none"
          aria-hidden="true"
          className="w-8 h-7 sm:w-10 sm:h-8 opacity-60"
        >
          <path
            d="M10 34 L22 20 L29 27 L46 6"
            stroke={BRONZE}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
      style={aspectRatio ? { aspectRatio } : undefined}
      onError={() => setErr(true)}
      {...rest}
    />
  );
}