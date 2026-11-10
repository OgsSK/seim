import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
const RULE = "rgba(12,45,82,0.12)";

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ backgroundColor: PAPER, borderColor: RULE }}
    >
      {/* Padding éditorial : plus d'espace au-dessus pour la respiration */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24">
        
        {/* Eyebrow typographique (avec filet bronze) */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span
              className="w-8 h-px"
              style={{ backgroundColor: BRONZE }}
            />
            <p
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium"
              style={{ color: BRONZE }}
            >
              {eyebrow}
            </p>
          </div>
        </Reveal>

        {/* Titre principal en Serif */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-serif tracking-[-0.025em] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] max-w-4xl leading-[1.05]"
          style={{ color: INK }}
        >
          {title}
        </motion.h1>

        {/* Sous-titre éditorial */}
        {subtitle && (
          <Reveal delay={0.2}>
            <p
              className="mt-6 sm:mt-8 text-[15px] sm:text-[17px] max-w-2xl leading-[1.75]"
              style={{ color: "rgba(12,45,82,0.65)" }}
            >
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}