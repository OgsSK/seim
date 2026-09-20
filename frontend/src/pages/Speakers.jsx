import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero";
import { SpeakerCard } from "../components/SpeakerCard";
import { SpeakerModal } from "../components/SpeakerModal";
import { Stagger, StaggerItem } from "../components/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";

export default function Speakers() {
  const { t } = useLanguage();
  const [speakers, setSpeakers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.speakers().then(setSpeakers).catch(() => {});
  }, []);

  return (
    <div data-testid="speakers-page">
      <PageHero eyebrow={t("speakers.eyebrow")} title={t("speakers.title")} subtitle={t("speakers.subtitle")} />
      <section className="py-16 sm:py-24 bg-bone">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Stagger key={speakers.length} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {speakers.map((sp) => (
              <StaggerItem key={sp.id}>
                <SpeakerCard speaker={sp} onOpen={setSelected} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
