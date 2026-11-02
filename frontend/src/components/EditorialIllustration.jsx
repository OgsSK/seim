import React from "react";

export function EditorialIllustration({ variant = "growth", className = "" }) {
  const BRONZE = "#8a6a3e";
  const INK = "#12110f";

  if (variant === "growth") {
    return (
      <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid-growth" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BRONZE} strokeWidth="0.5" opacity="0.2" />
        </pattern>
        <rect width="400" height="300" fill="url(#grid-growth)" />
        <path d="M 50 250 L 150 150 L 220 200 L 350 50" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 50 270 L 130 190 L 210 230 L 350 110" stroke={BRONZE} strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="350" cy="50" r="30" stroke={BRONZE} strokeWidth="1.5" />
        <circle cx="350" cy="50" r="50" stroke={BRONZE} strokeWidth="0.5" opacity="0.3" />
        <circle cx="350" cy="50" r="80" stroke={BRONZE} strokeWidth="0.5" opacity="0.1" />
        <circle cx="50" cy="250" r="4" fill={INK} />
        <circle cx="150" cy="150" r="4" fill={INK} />
        <circle cx="220" cy="200" r="4" fill={INK} />
        <circle cx="350" cy="50" r="6" fill={BRONZE} />
      </svg>
    );
  }

  if (variant === "keynote") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 15 L 50 65" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M 30 45 L 50 65 L 70 45" stroke={BRONZE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="30" y1="85" x2="70" y2="85" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "panel") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="40" r="10" stroke={INK} strokeWidth="1.5" />
        <circle cx="70" cy="40" r="10" stroke={INK} strokeWidth="1.5" />
        <path d="M 15 80 Q 30 60 45 80" stroke={BRONZE} strokeWidth="1.5" fill="none" />
        <path d="M 55 80 Q 70 60 85 80" stroke={BRONZE} strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  if (variant === "masterclass") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="60" height="40" stroke={INK} strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="30" stroke={BRONZE} strokeWidth="1.5" />
        <line x1="35" y1="75" x2="65" y2="75" stroke={BRONZE} strokeWidth="1.5" />
        <path d="M 20 30 L 80 70" stroke={BRONZE} strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (variant === "seal") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke={BRONZE} strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="40" stroke={BRONZE} strokeWidth="1" />
        <circle cx="50" cy="50" r="35" stroke={BRONZE} strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke={INK} strokeWidth="1" opacity="0.3" />
        <rect x="35" y="35" width="30" height="30" stroke={BRONZE} strokeWidth="1.5" transform="rotate(45 50 50)" />
      </svg>
    );
  }

  // ... gardez les autres variantes (target, sprout, arch, globe, network) telles quelles ...
  if (variant === "network") {
    return (
      <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" stroke={INK} strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="100" r="50" stroke={INK} strokeWidth="0.5" opacity="0.3" />
        <line x1="40" y1="60" x2="100" y2="100" stroke={BRONZE} strokeWidth="1" />
        <line x1="160" y1="60" x2="100" y2="100" stroke={BRONZE} strokeWidth="1" />
        <line x1="40" y1="140" x2="100" y2="100" stroke={BRONZE} strokeWidth="1" />
        <line x1="160" y1="140" x2="100" y2="100" stroke={BRONZE} strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill={INK} />
        <circle cx="40" cy="60" r="4" fill={BRONZE} />
        <circle cx="160" cy="60" r="4" fill={BRONZE} />
        <circle cx="40" cy="140" r="4" fill={BRONZE} />
        <circle cx="160" cy="140" r="4" fill={BRONZE} />
      </svg>
    );
  }

  if (variant === "target") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke={INK} strokeWidth="0.5" opacity="0.2" />
        <circle cx="50" cy="50" r="30" stroke={INK} strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="50" r="15" stroke={BRONZE} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill={BRONZE} />
        <path d="M 50 5 L 50 20 M 50 80 L 50 95 M 5 50 L 20 50 M 80 50 L 95 50" stroke={BRONZE} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "sprout") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 90 L 50 40" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 50 55 Q 30 55 25 35 Q 45 30 50 50" stroke={BRONZE} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M 50 40 Q 70 40 75 20 Q 55 15 50 35" stroke={INK} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="35" y1="90" x2="65" y2="90" stroke={INK} strokeWidth="1" opacity="0.3" />
      </svg>
    );
  }

  if (variant === "arch") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="40" width="20" height="50" stroke={INK} strokeWidth="1.5" />
        <rect x="45" y="20" width="20" height="70" stroke={INK} strokeWidth="1.5" />
        <rect x="70" y="55" width="15" height="35" stroke={BRONZE} strokeWidth="1.5" />
        <path d="M 20 40 L 45 20 L 65 20" stroke={BRONZE} strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (variant === "globe") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke={INK} strokeWidth="1" opacity="0.3" />
        <ellipse cx="50" cy="50" rx="20" ry="40" stroke={INK} strokeWidth="0.75" opacity="0.5" />
        <ellipse cx="50" cy="50" rx="40" ry="15" stroke={INK} strokeWidth="0.75" opacity="0.5" />
        <path d="M 10 50 Q 30 30 50 50 T 90 50" stroke={BRONZE} strokeWidth="1.5" />
        <circle cx="70" cy="35" r="3" fill={BRONZE} />
      </svg>
    );
  }

  return null;
}