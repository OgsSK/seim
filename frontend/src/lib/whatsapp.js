import { EVENT } from "../config/event";

/** Numéro WhatsApp du SEIM au format international sans "+" ni espaces */
export const WHATSAPP_NUMBER = EVENT.whatsapp.replace(/[^\d]/g, "");

/** Construit un lien wa.me avec un message pré-rempli */
export const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Lien de partage WhatsApp sans destinataire : l'utilisateur choisit le contact */
export const whatsappShareLink = (message) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;

/**
 * Ouvre WhatsApp (application sur mobile, WhatsApp Web sur ordinateur)
 * avec le message pré-rempli. Doit être appelé directement dans un clic/submit.
 */
export const openWhatsApp = (message, { share = false } = {}) => {
  const url = share ? whatsappShareLink(message) : whatsappLink(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
    return;
  }
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url;
};

/** Ligne vide de séparation dans un message */
export const BLANK = " ";

/** Assemble les lignes d'un message (lignes vides/absentes ignorées, BLANK = séparation) */
export const buildMessage = (lines) =>
  lines
    .filter((l) => l !== null && l !== undefined && l !== false && l !== "")
    .map((l) => (l === BLANK ? "" : l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/** Phrase d'introduction selon le type de besoin sélectionné */
const NEED_INTRO = {
  fr: {
    general: "Je souhaite obtenir des informations sur le SEIM.",
    partenariat: "Je souhaite devenir partenaire du SEIM.",
    sponsoring: "Je souhaite devenir sponsor du SEIM.",
    exposition: "Je souhaite réserver un stand d'exposition au SEIM.",
    presse: "Je souhaite une accréditation presse pour le SEIM.",
    intervention: "Je souhaite intervenir en tant qu'intervenant au SEIM.",
  },
  en: {
    general: "I would like some information about SEIM.",
    partenariat: "I would like to become a SEIM partner.",
    sponsoring: "I would like to become a SEIM sponsor.",
    exposition: "I would like to book an exhibition booth at SEIM.",
    presse: "I would like a press accreditation for SEIM.",
    intervention: "I would like to take part in SEIM as a speaker.",
  },
};

/** Message WhatsApp pour une demande (contact, sponsoring, exposition…) */
export const buildRequestMessage = ({ lang, type, typeLabel, name, email, organization, message }) => {
  const fr = lang === "fr";
  const intro = (NEED_INTRO[fr ? "fr" : "en"] || {})[type] || NEED_INTRO[fr ? "fr" : "en"].general;
  return buildMessage([
    fr ? "Bonjour l'équipe SEIM," : "Hello SEIM team,",
    intro,
    BLANK,
    `*${fr ? "Demande" : "Request"} :* ${typeLabel}`,
    `*${fr ? "Nom" : "Name"} :* ${name}`,
    email && `*Email :* ${email}`,
    organization && `*${fr ? "Organisation" : "Organization"} :* ${organization}`,
    BLANK,
    message && `*Message :*\n${message}`,
  ]);
};
