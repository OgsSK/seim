import { EVENT } from "../config/event";

/*
 * Ajout du salon à l'agenda (fichier .ics universel : iPhone, Android, Outlook)
 * + lien Google Agenda. Événement « journée entière » à partir de startDateISO,
 * sur EVENT.durationDays jours (1 par défaut).
 */

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

const eventRange = () => {
  const start = new Date(EVENT.startDateISO);
  const end = new Date(start);
  end.setDate(end.getDate() + (EVENT.durationDays || 1)); // DTEND exclusif
  return { start: ymd(start), end: ymd(end) };
};

const texts = (lang) => {
  const fr = lang === "fr";
  const site = typeof window !== "undefined" ? window.location.origin : "";
  return {
    title: `${EVENT.shortName} — ${fr ? EVENT.name_fr : EVENT.name_en}`,
    location: `${fr ? EVENT.venue_fr : EVENT.venue_en}, ${fr ? EVENT.city_fr : EVENT.city_en}`,
    description: fr
      ? `${EVENT.edition_fr.split(" — ")[0]} · ${EVENT.theme_fr}\nProgramme : ${site}/programme\nContact WhatsApp : ${EVENT.whatsapp}`
      : `${EVENT.edition_en.split(" — ")[0]} · ${EVENT.theme_en}\nProgramme: ${site}/programme\nWhatsApp: ${EVENT.whatsapp}`,
  };
};

const icsEscape = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Télécharge / ouvre le fichier .ics (le téléphone propose de l'ajouter à l'agenda) */
export const downloadIcs = (lang) => {
  const { start, end } = eventRange();
  const t = texts(lang);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SEIM//Inscription//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:seim-${start}@seim`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(t.title)}`,
    `LOCATION:${icsEscape(t.location)}`,
    `DESCRIPTION:${icsEscape(t.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(t.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "SEIM-2027.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

/** Lien Google Agenda pré-rempli */
export const googleCalendarUrl = (lang) => {
  const { start, end } = eventRange();
  const t = texts(lang);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: t.title,
    dates: `${start}/${end}`,
    location: t.location,
    details: t.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
