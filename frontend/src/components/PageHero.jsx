import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative bg-white overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24 border-b border-navy/10">
      <div className="absolute inset-0 zigzag-bg" />
      <div
        className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 65%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-dark mb-4">{eyebrow}</p>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display font-extrabold tracking-tight text-navy text-4xl sm:text-5xl lg:text-6xl max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <Reveal delay={0.2}>
            <p className="mt-6 text-navy/60 text-base sm:text-lg max-w-2xl leading-relaxed">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
