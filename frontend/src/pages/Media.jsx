import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Play,
  Download,
  FileText,
  Image as ImageIcon,
  BadgeCheck,
  Newspaper,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Stagger, StaggerItem } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

/* Palette éditoriale premium */
const PAPER = "#F2F4F6";
const INK = "#0C2D52";
const BRONZE = "#B57A0A";
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
      <h3 className="font-serif text-xl sm:text-2xl mb-3" style={{ color: INK }}>
        {title}
      </h3>
      <p
        className="font-serif italic text-[15px] max-w-lg mx-auto leading-relaxed"
        style={{ color: "rgba(12,45,82,0.55)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function Media() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "news";
  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.articles().then(setArticles).catch(() => {}),
      api
        .gallery()
        .then((g) => setGallery(g.images || []))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const tabs = ["news", "gallery", "videos", "press"];

  const pressItems = [
    {
      icon: FileText,
      title: t("media.press.kit"),
      desc: t("media.press.kitDesc"),
    },
    {
      icon: Download,
      title: t("media.press.releases"),
      desc: t("media.press.releasesDesc"),
    },
    {
      icon: ImageIcon,
      title: t("media.press.logos"),
      desc: t("media.press.logosDesc"),
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
          
          {/* ============ EN-TÊTE FILTRES ============ */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-8 h-px" style={{ backgroundColor: RULE }} />
            <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: BRONZE }}>
              {lang === "fr" ? "Rubriques" : "Sections"}
            </span>
          </div>

          {/* Onglets alignés sur la bordure */}
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
                  className={`text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-medium pb-3 sm:pb-4 border-b-2 -mb-[1px] transition-colors ${
                    active
                      ? "border-[#B57A0A]"
                      : "border-transparent hover:text-[#0C2D52]"
                  }`}
                  style={{ color: active ? INK : "rgba(12,45,82,0.4)" }}
                >
                  {t(`media.tabs.${tb}`)}
                </button>
              );
            })}
          </div>

          {/* ============ NEWS (Sans cadre) ============ */}
          {tab === "news" &&
            (loading ? (
              <Skeleton cols="sm:grid-cols-2 lg:grid-cols-4" />
            ) : articles.length === 0 ? (
              <EmptyState
                lang={lang}
                icon={Newspaper}
                title={
                  lang === "fr"
                    ? "Les actualités arrivent bientôt"
                    : "News coming soon"
                }
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
                      {/* Image sans cadre */}
                      <div className="overflow-hidden mb-4 shadow-sm">
                        <SmartImg
                          src={a.image}
                          alt=""
                          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] mb-3">
                        <span style={{ color: BRONZE }}>
                          {lang === "fr" ? a.category_fr : a.category_en}
                        </span>
                        <span style={{ color: "rgba(12,45,82,0.35)" }}>
                          {new Date(a.date).toLocaleDateString(
                            lang === "fr" ? "fr-FR" : "en-GB",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      </div>
                      <h3
                        className="font-serif text-lg leading-tight tracking-tight mb-2"
                        style={{ color: INK }}
                      >
                        {lang === "fr" ? a.title_fr : a.title_en}
                      </h3>
                      <p
                        className="font-serif italic text-[13px] leading-[1.6] line-clamp-3"
                        style={{ color: "rgba(12,45,82,0.55)" }}
                      >
                        {lang === "fr" ? a.excerpt_fr : a.excerpt_en}
                      </p>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            ))}

          {/* ============ GALLERY (Sans cadre) ============ */}
          {tab === "gallery" &&
            (loading ? (
              <Skeleton cols="sm:grid-cols-2 md:grid-cols-4" />
            ) : gallery.length === 0 ? (
              <EmptyState
                lang={lang}
                icon={ImageIcon}
                title={
                  lang === "fr"
                    ? "La galerie arrive bientôt"
                    : "Gallery coming soon"
                }
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
                      {/* Image nue avec ombre douce */}
                      <div
                        data-testid={`gallery-item-${i}`}
                        className="overflow-hidden shadow-sm h-full"
                      >
                        <div className="w-full h-full aspect-square md:aspect-auto">
                          <SmartImg
                            src={img}
                            alt={`SEIM ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ))}

          {/* ============ VIDEOS (Fond sombre conservé pour la lisibilité) ============ */}
          {tab === "videos" && (
            <div data-testid="media-videos-grid">
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    img: "/assets/seim/tv-studio.jpg",
                    label: "Avis d'expert — plateau TV",
                  },
                  {
                    img: "/assets/seim/tv-camera.jpg",
                    label: "Coulisses de tournage",
                  },
                  {
                    img: "/assets/seim/tv-cisse.jpg",
                    label: "Interview expert",
                  },
                ].map((v, i) => (
                  <StaggerItem key={i}>
                    <div
                      data-testid={`video-card-${i}`}
                      className="group relative overflow-hidden aspect-video shadow-md"
                      style={{ backgroundColor: INK }}
                    >
                      <SmartImg
                        src={v.img}
                        alt={v.label}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
                        <span 
                          className="w-12 h-12 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110" 
                          style={{ borderColor: BRONZE, color: BRONZE }}
                        >
                          <Play size={18} strokeWidth={1.5} />
                        </span>
                        <span 
                          className="text-[10px] uppercase tracking-[0.2em] font-medium"
                          style={{ color: PAPER }}
                        >
                          {v.label}
                        </span>
                        <span 
                          className="text-[9px] uppercase tracking-[0.2em]"
                          style={{ color: "rgba(242,244,246,0.5)" }}
                        >
                          WebTV · {t("common.soon")}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {/* ============ PRESS ============ */}
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
                      <span className="text-[9px] uppercase tracking-[0.24em]">
                        {lang === "fr" ? "Ressource" : "Resource"}
                      </span>
                    </div>
                    <h3
                      className="font-serif text-xl tracking-tight"
                      style={{ color: INK }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="font-serif italic text-[14px] leading-[1.7] flex-1"
                      style={{ color: "rgba(12,45,82,0.55)" }}
                    >
                      {p.desc}
                    </p>
                    {p.link ? (
                      <Link
                        to={p.link}
                        data-testid={`press-action-${i}`}
                        className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium border-b pb-0.5 self-start transition-colors hover:text-[#B57A0A]"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        {t("media.press.request")}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toast(t("common.soon"))}
                        data-testid={`press-action-${i}`}
                        className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium border-b pb-0.5 self-start transition-colors hover:text-[#B57A0A]"
                        style={{ color: INK, borderColor: BRONZE }}
                      >
                        {t("media.press.download")}
                      </button>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </div>
  );
}