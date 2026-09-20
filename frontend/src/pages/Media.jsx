import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Play, Download, FileText, Image as ImageIcon, BadgeCheck } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Stagger, StaggerItem } from "../components/Reveal";
import { SmartImg } from "../components/SectionHead";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

export default function Media() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "news";
  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    api.articles().then(setArticles).catch(() => {});
    api.gallery().then((g) => setGallery(g.images)).catch(() => {});
  }, []);

  const tabs = ["news", "gallery", "videos", "press"];

  const pressItems = [
    { icon: FileText, title: t("media.press.kit"), desc: t("media.press.kitDesc") },
    { icon: Download, title: t("media.press.releases"), desc: t("media.press.releasesDesc") },
    { icon: ImageIcon, title: t("media.press.logos"), desc: t("media.press.logosDesc") },
    { icon: BadgeCheck, title: t("media.press.accreditation"), desc: t("media.press.accreditationDesc"), link: "/contact?type=presse" },
  ];

  return (
    <div data-testid="media-page">
      <PageHero eyebrow={t("media.eyebrow")} title={t("media.title")} subtitle={t("media.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 mb-12" data-testid="media-tabs">
            {tabs.map((tb) => (
              <button
                key={tb}
                data-testid={`media-tab-${tb}`}
                onClick={() => setParams({ tab: tb })}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  tab === tb ? "bg-navy text-gold" : "bg-white text-navy/50 border border-navy/10 hover:border-gold/60"
                }`}
              >
                {t(`media.tabs.${tb}`)}
              </button>
            ))}
          </div>

          {tab === "news" && (
            <Stagger key={articles.length} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="media-news-grid">
              {articles.map((a) => (
                <StaggerItem key={a.id}>
                  <article data-testid={`article-card-${a.id}`} className="group bg-white rounded-2xl border border-navy/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/10 h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <SmartImg src={a.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-gold-dark">{lang === "fr" ? a.category_fr : a.category_en}</span>
                        <span className="text-navy/35">{new Date(a.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short" })}</span>
                      </div>
                      <h3 className="mt-3 font-display font-bold text-navy leading-snug">{lang === "fr" ? a.title_fr : a.title_en}</h3>
                      <p className="mt-2 text-navy/55 text-sm leading-relaxed flex-1">{lang === "fr" ? a.excerpt_fr : a.excerpt_en}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {tab === "gallery" && (
            <Stagger key={gallery.length} className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="media-gallery-grid">
              {gallery.map((img, i) => (
                <StaggerItem key={i} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
                  <div data-testid={`gallery-item-${i}`} className="rounded-2xl overflow-hidden border border-navy/10 h-full">
                    <SmartImg src={img} alt={`SEIM ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 aspect-square" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {tab === "videos" && (
            <div data-testid="media-videos-grid">
              <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <StaggerItem key={i}>
                    <div data-testid={`video-card-${i}`} className="group relative rounded-2xl overflow-hidden border border-navy/10 aspect-video bg-navy">
                      <SmartImg src={gallery[i] || ""} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <span className="w-14 h-14 rounded-full bg-gold text-navy flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={22} fill="currentColor" />
                        </span>
                        <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">WebTV · {t("common.soon")}</span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {tab === "press" && (
            <Stagger className="grid sm:grid-cols-2 gap-6" data-testid="media-press-grid">
              {pressItems.map((p, i) => (
                <StaggerItem key={i}>
                  <div data-testid={`press-card-${i}`} className="bg-white rounded-2xl border border-navy/10 p-8 flex gap-5 items-start hover:border-gold/50 transition-colors h-full">
                    <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-gold shrink-0">
                      <p.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-navy text-lg">{p.title}</h3>
                      <p className="mt-1.5 text-navy/55 text-sm leading-relaxed">{p.desc}</p>
                      {p.link ? (
                        <Link to={p.link} data-testid={`press-action-${i}`} className="mt-4 inline-block px-5 py-2.5 rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors">
                          {t("media.press.request")}
                        </Link>
                      ) : (
                        <button onClick={() => toast(t("common.soon"))} data-testid={`press-action-${i}`}
                          className="mt-4 px-5 py-2.5 rounded-full border-2 border-navy text-navy text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-white transition-colors">
                          {t("media.press.download")}
                        </button>
                      )}
                    </div>
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
