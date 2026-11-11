import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Download,
  FileText,
  Image as ImageIcon,
  BadgeCheck,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "../components/PageHero";
import { Stagger, StaggerItem } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium — jaune du logo SEIM */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#D49B0F";
const GOLD = "#F7B731";
const CREAM = "#F2F4F6";
const RULE = "rgba(12,45,82,0.12)";
const RULE_LIGHT = "rgba(12,45,82,0.08)";

/* ---------- Skeleton ---------- */
function Skeleton({ cols = "sm:grid-cols-2 lg:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 animate-pulse border"
          style={{ backgroundColor: RULE_LIGHT, borderColor: RULE }}
        />
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ lang, icon: Icon = Newspaper, title, subtitle }) {
  return (
    <div className="py-20 text-center border-y" style={{ borderColor: RULE }}>
      <div className="mx-auto mb-6 flex justify-center" style={{ color: BRONZE }}>
        <Icon size={32} strokeWidth={1} />
      </div>
      <h3 className="font-serif font-extrabold text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {title}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(12,45,82,0.6)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

/* ============================================================
   Lightbox — vue détaillée des photos
   ============================================================ */
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const { lang } = useLanguage();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [index]);

  if (index === null || !images[index]) return null;

  const total = images.length;
  const current = index + 1;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[80] flex items-center justify-center"
        style={{ backgroundColor: "rgba(12,45,82,0.96)" }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Galerie photo"
      >
        {/* En-tête */}
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 sm:px-8 py-5">
          <span
            className="font-mono-num text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-bold"
            style={{ color: GOLD }}
          >
            {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">
              {lang === "fr" ? "Échap pour fermer" : "Esc to close"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(242,244,246,0.2)", color: CREAM }}
              aria-label={lang === "fr" ? "Fermer" : "Close"}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Bouton précédent */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border transition-colors hover:bg-white/10 z-10"
            style={{ borderColor: "rgba(242,244,246,0.2)", color: CREAM }}
            aria-label={lang === "fr" ? "Précédent" : "Previous"}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        )}

        {/* Bouton suivant */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border transition-colors hover:bg-white/10 z-10"
            style={{ borderColor: "rgba(242,244,246,0.2)", color: CREAM }}
            aria-label={lang === "fr" ? "Suivant" : "Next"}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        )}

        {/* Image principale */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[index]}
            alt={`SEIM ${current}`}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-2xl"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}
          />
        </motion.div>

        {/* Pied */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-4 sm:px-8 py-5 text-center">
          <p
            className="font-serif italic text-[11px] sm:text-[12px] font-medium"
            style={{ color: "rgba(242,244,246,0.6)" }}
          >
            {lang === "fr"
              ? "SEIM — CICB, Bamako · Édition 2026"
              : "SEIM — CICB, Bamako · 2026 Edition"}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Media() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();

  const validTabs = ["news", "gallery", "press"];
  const tabParam = params.get("tab");
  const tab = validTabs.includes(tabParam) ? tabParam : "news";

  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    Promise.all([
      api.articles().then(setArticles).catch(() => {}),
      api
        .gallery()
        .then((g) => setGallery(g.images || []))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + gallery.length) % gallery.length
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % gallery.length
    );

  const tabs = ["news", "gallery", "press"];

  const pressItems = [
    {
      icon: FileText,
      title: t("media.press.kit"),
      desc: t("media.press.kitDesc"),
      href: "/assets/seim/rapport-seim-2026.pdf",
      downloadName: "Rapport_SEIM_2026.pdf",
    },
    {
      icon: ImageIcon,
      title: t("media.press.logos"),
      desc: t("media.press.logosDesc"),
      href: "/assets/seim/charte-graphique-seim.pdf",
      downloadName: "Charte_Graphique_SEIM.pdf",
    },
    {
      icon: BadgeCheck,
      title: t("media.press.accreditation"),
      desc: t("media.press.accreditationDesc"),
      link: "/contact?type=presse",
    },
  ];

  return (
    <div data-testid="media-page" style={{ backgroundColor: PAPER, color: INK }}>
      <PageHero
        eyebrow={t("media.eyebrow")}
        title={t("media.title")}
        subtitle={t("media.subtitle")}
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* EN-TÊTE FILTRES */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold" style={{ color: BRONZE }}>
              {lang === "fr" ? "Rubriques" : "Sections"}
            </span>
          </div>

          {/* Onglets */}
          <div
            className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-4 mb-12 border-b"
            style={{ borderColor: RULE }}
            data-testid="media-tabs"
          >
            {tabs.map((tb) => {
              const active = tab === tb;
              return (
                <button
                  key={tb}
                  data-testid={`media-tab-${tb}`}
                  onClick={() => setParams({ tab: tb })}
                  className={`text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold pb-3 sm:pb-4 border-b-2 -mb-[1px] transition-colors ${
                    active
                      ? "border-[#D49B0F]"
                      : "border-transparent hover:text-[#0C2D52]"
                  }`}
                  style={{ color: active ? INK : "rgba(12,45,82,0.45)" }}
                >
                  {t(`media.tabs.${tb}`)}
                </button>
              );
            })}
          </div>

          {/* NEWS */}
          {tab === "news" &&
            (loading ? (
              <Skeleton cols="sm:grid-cols-2 lg:grid-cols-4" />
            ) : articles.length === 0 ? (
              <EmptyState
                lang={lang}
                icon={Newspaper}
                title={lang === "fr" ? "Les actualités arrivent bientôt" : "News coming soon"}
                subtitle={
                  lang === "fr"
                    ? "Les articles et communiqués de presse du SEIM seront publiés prochainement."
                    : "SEIM articles and press releases will be published soon."
                }
              />
            ) : (
              <Stagger
                key={articles.length}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8"
                data-testid="media-news-grid"
              >
                {articles.map((a) => (
                  <StaggerItem key={a.id}>
                    <article
                      data-testid={`article-card-${a.id}`}
                      className="group flex flex-col border-b pb-6 h-full"
                      style={{ borderColor: RULE }}
                    >
                      <div className="overflow-hidden mb-4 shadow-sm">
                        <SmartImg
                          src={a.image}
                          alt=""
                          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] mb-3 font-semibold">
                        <span style={{ color: BRONZE }}>
                          {lang === "fr" ? a.category_fr : a.category_en}
                        </span>
                        <span style={{ color: "rgba(12,45,82,0.4)" }}>
                          {new Date(a.date).toLocaleDateString(
                            lang === "fr" ? "fr-FR" : "en-GB",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      </div>
                      <h3
                        className="font-serif font-extrabold text-lg leading-tight tracking-tight mb-2"
                        style={{ color: INK }}
                      >
                        {lang === "fr" ? a.title_fr : a.title_en}
                      </h3>
                      <p
                        className="font-serif italic text-[13px] leading-[1.6] line-clamp-3"
                        style={{ color: "rgba(12,45,82,0.6)" }}
                      >
                        {lang === "fr" ? a.excerpt_fr : a.excerpt_en}
                      </p>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            ))}

          {/* GALLERY */}
          {tab === "gallery" &&
            (loading ? (
              <Skeleton cols="sm:grid-cols-2 md:grid-cols-4" />
            ) : gallery.length === 0 ? (
              <EmptyState
                lang={lang}
                icon={ImageIcon}
                title={lang === "fr" ? "La galerie arrive bientôt" : "Gallery coming soon"}
                subtitle={
                  lang === "fr"
                    ? "Les photos des éditions du SEIM seront publiées prochainement."
                    : "SEIM editions photos will be published soon."
                }
              />
            ) : (
              <Stagger
                key={gallery.length}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                data-testid="media-gallery-grid"
              >
                {gallery.map((img, i) => {
                  const featured = i % 5 === 0;
                  return (
                    <StaggerItem
                      key={i}
                      className={featured ? "md:col-span-2 md:row-span-2" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => openLightbox(i)}
                        data-testid={`gallery-item-${i}`}
                        className="group relative overflow-hidden shadow-sm h-full w-full block cursor-zoom-in"
                        aria-label={`Voir la photo ${i + 1}`}
                      >
                        <div className="w-full h-full aspect-square md:aspect-auto">
                          <SmartImg
                            src={img}
                            alt={`SEIM ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                          style={{ backgroundColor: "rgba(12,45,82,0.55)" }}
                        >
                          <span
                            className="w-11 h-11 flex items-center justify-center border rounded-full"
                            style={{ borderColor: GOLD, color: GOLD }}
                          >
                            <Plus size={20} strokeWidth={1.5} />
                          </span>
                        </div>
                      </button>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ))}

          {/* PRESS */}
          {tab === "press" && (
            <Stagger
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12"
              data-testid="media-press-grid"
            >
              {pressItems.map((p, i) => (
                <StaggerItem key={i}>
                  <div
                    data-testid={`press-card-${i}`}
                    className="flex flex-col gap-4 border-t pt-6 h-full"
                    style={{ borderColor: RULE }}
                  >
                    <div className="flex items-center gap-3 mb-2" style={{ color: BRONZE }}>
                      <p.icon size={18} strokeWidth={1.5} />
                      <span className="text-[9px] uppercase tracking-[0.24em] font-bold">
                        {lang === "fr" ? "Ressource" : "Resource"}
                      </span>
                    </div>
                    <h3 className="font-serif font-extrabold text-xl tracking-tight" style={{ color: INK }}>
                      {p.title}
                    </h3>
                    <p
                      className="font-serif italic text-[14px] leading-[1.7] flex-1"
                      style={{ color: "rgba(12,45,82,0.6)" }}
                    >
                      {p.desc}
                    </p>

                    {p.href ? (
                      <a
                        href={p.href}
                        download={p.downloadName}
                        data-testid={`press-action-${i}`}
                        className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold border-b pb-0.5 self-start transition-colors hover:text-[#D49B0F]"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        <Download size={14} />
                        {t("media.press.download")}
                      </a>
                    ) : p.link ? (
                      <Link
                        to={p.link}
                        data-testid={`press-action-${i}`}
                        className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold border-b pb-0.5 self-start transition-colors hover:text-[#D49B0F]"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        {t("media.press.request")}
                      </Link>
                    ) : null}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <Lightbox
        images={gallery}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  );
}