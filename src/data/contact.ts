import contactHouseLandscape from "../assets/images/about/stoneframe-front.webp";
import contactHousePortrait from "../assets/images/contact-house-portrait.avif";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../lib/constants";
import type { Language } from "../i18n/language";

export interface ContactFormField {
  id: "name" | "email" | "phone" | "location" | "message";
  label: string;
  placeholder: string;
  autoComplete: string;
  type: "text" | "email" | "tel";
  required: boolean;
  multiline?: boolean;
  wide?: boolean;
}

export interface ContactPageContent {
  transition: {
    eyebrow: string; title: string; meta: string; note: string;
    openingLabel: string; imageUnavailable: string; pageReady: string;
    preparing: string; loadingImage: string;
  };
  hero: {
    eyebrow: string;
    image: { src: string; alt: string; caption: string };
    scrollLabel: string;
    directoryLabel: string;
  };
  enquiry: { eyebrow: string; titleLines: [string, string]; introduction: string };
  direct: {
    label: string; email: string; locationLabel: string; location: string;
    responseLabel: string; responseTime: string;
  };
  form: {
    eyebrow: string; title: string; introduction: string;
    image: { src: string; alt: string; caption: string };
    requiredLabel: string; detailsLabel: string; formLabel: string;
    fields: ContactFormField[]; submitLabel: string; submitNote: string;
    mailSubject: string; openingStatus: string;
    bodyLabels: { name: string; email: string; location: string; notSpecified: string };
  };
  social: { label: string; links: Array<{ label: string; href: string }> };
}

export const contactContent: Record<Language, ContactPageContent> = {
  sv: {
    transition: {
      eyebrow: "Projektförfrågningar", title: "KONTAKT", meta: "04 / Malmö, Sverige",
      note: "En omsorgsfull plats att börja på.", openingLabel: "Öppnar Kontakt",
      imageUnavailable: "Kontaktbilden är inte tillgänglig", pageReady: "Kontaktsidan är klar",
      preparing: "Förbereder Kontakt", loadingImage: "Laddar kontaktbilden",
    },
    hero: {
      eyebrow: "Lagom Arkitektur / Kontakt",
      image: { src: contactHouseLandscape, alt: "L-28 Stoneframe Villa i en lugn naturmiljö", caption: "L-28 Stoneframe Villa / Bostadsarkitektur" },
      scrollLabel: "Starta en förfrågan", directoryLabel: "Lagom Arkitektur kontaktuppgifter",
    },
    enquiry: {
      eyebrow: "Projektförfrågningar / Malmö", titleLines: ["Berätta om", "ditt projekt."],
      introduction: "Vi arbetar med ett omsorgsfullt urval av projekt så att varje uppdrag får den tid, tydlighet och närvaro det förtjänar.",
    },
    direct: {
      label: "Direkt", email: CONTACT_EMAIL, locationLabel: "Studio", location: "Malmö, Sverige",
      responseLabel: "Svar", responseTime: "Vanligtvis inom 2–3 arbetsdagar.",
    },
    form: {
      eyebrow: "Projektinformation", title: "Starta ett projekt.",
      introduction: "Några första uppgifter räcker. Berätta var projektet finns, vad ni överväger och vilken tidsram ni har i åtanke.",
      image: { src: contactHousePortrait, alt: "Lagom bostadsarkitektur inramad av uppvuxna träd", caption: "En lugn plats att börja på" },
      requiredLabel: "Obligatoriskt *", detailsLabel: "Era uppgifter", formLabel: "Formulär för projektförfrågan",
      fields: [
        { id: "name", label: "Namn", placeholder: "Ert namn", autoComplete: "name", type: "text", required: true },
        { id: "email", label: "E-post", placeholder: "ni@epost.se", autoComplete: "email", type: "email", required: true },
        { id: "location", label: "Projektets plats", placeholder: "Stad / land", autoComplete: "off", type: "text", required: false, wide: true },
        { id: "message", label: "Projektöversikt", placeholder: "Berätta om rummet, omfattningen och den ungefärliga tidsramen.", autoComplete: "off", type: "text", required: true, multiline: true, wide: true },
      ],
      submitLabel: "Skicka förfrågan", submitNote: "Era uppgifter skickas säkert till Lagom Arkitektur.",
      mailSubject: "Ny projektförfrågan", openingStatus: "Skickar projektförfrågan…",
      bodyLabels: { name: "Namn", email: "E-post", location: "Projektets plats", notSpecified: "Ej angivet" },
    },
    social: { label: "Följ oss", links: [
      { label: "Instagram", href: INSTAGRAM_URL },
      { label: "LinkedIn", href: LINKEDIN_URL },
    ] },
  },
  en: {
    transition: {
      eyebrow: "Project enquiries", title: "CONTACT", meta: "04 / Malmö, Sweden",
      note: "A considered place to begin.", openingLabel: "Opening Contact",
      imageUnavailable: "Contact image unavailable", pageReady: "Contact page ready",
      preparing: "Preparing Contact", loadingImage: "Loading the Contact hero image",
    },
    hero: {
      eyebrow: "Lagom Arkitektur / Contact",
      image: { src: contactHouseLandscape, alt: "L-28 Stoneframe Villa in a quiet natural setting", caption: "L-28 Stoneframe Villa / Residential architecture" },
      scrollLabel: "Start an enquiry", directoryLabel: "Lagom Arkitektur contact directory",
    },
    enquiry: {
      eyebrow: "Project enquiries / Malmö", titleLines: ["Tell us about", "your project."],
      introduction: "We work with a considered number of projects so every commission receives the time, clarity, and presence it deserves.",
    },
    direct: {
      label: "Direct", email: CONTACT_EMAIL, locationLabel: "Studio", location: CONTACT_LOCATION,
      responseLabel: "Reply", responseTime: "Usually within 2–3 business days.",
    },
    form: {
      eyebrow: "Project details", title: "Start a project.",
      introduction: "A few first details are enough. Tell us where the project is, what you are considering, and the timeframe you have in mind.",
      image: { src: contactHousePortrait, alt: "Lagom residential architecture framed by mature trees", caption: "A quiet place to begin" },
      requiredLabel: "Required *", detailsLabel: "Your details", formLabel: "Project enquiry form",
      fields: [
        { id: "name", label: "Name", placeholder: "Your name", autoComplete: "name", type: "text", required: true },
        { id: "email", label: "Email", placeholder: "you@email.com", autoComplete: "email", type: "email", required: true },
        { id: "location", label: "Project location", placeholder: "City / country", autoComplete: "off", type: "text", required: false, wide: true },
        { id: "message", label: "Project overview", placeholder: "Tell us about the space, scope, and approximate timeframe.", autoComplete: "off", type: "text", required: true, multiline: true, wide: true },
      ],
      submitLabel: "Send enquiry", submitNote: "Your details are sent securely to Lagom Arkitektur.",
      mailSubject: "New project enquiry", openingStatus: "Sending project enquiry…",
      bodyLabels: { name: "Name", email: "Email", location: "Project location", notSpecified: "Not specified" },
    },
    social: { label: "Elsewhere", links: [
      { label: "Instagram", href: INSTAGRAM_URL },
      { label: "LinkedIn", href: LINKEDIN_URL },
    ] },
  },
};

export const contactOverlayContent = {
  sv: {
    closeForm: "Stäng förfrågningsformuläret", eyebrow: "Projektförfrågan", close: "Stäng",
    title: "Berätta om rummet ni vill skapa.", introduction: "Dela de första uppgifterna om ert projekt. Vi går igenom förfrågan och återkommer med ett lämpligt nästa steg.",
    imageAlt: "Lagom bostadsarkitektur", formLabel: "Formulär för projektförfrågan",
    details: "Era uppgifter", required: "Obligatoriskt *", overview: "Projektöversikt *",
    overviewPlaceholder: "Plats, omfattning, tidsram och annat vi bör känna till", send: "Skicka förfrågan", footer: "Studioförfrågningar",
    submitNote: "Era uppgifter skickas säkert till Lagom Arkitektur.",
    mailSubject: "Ny projektförfrågan", openingStatus: "Skickar projektförfrågan…",
    fields: [
      { id: "name", label: "Namn", type: "text", autoComplete: "name", required: true, placeholder: "Ert namn" },
      { id: "email", label: "E-postadress", type: "email", autoComplete: "email", required: true, placeholder: "ni@studio.se" },
      { id: "phone", label: "Telefonnummer", type: "tel", autoComplete: "tel", required: false, placeholder: "+46 00 000 00 00" },
      { id: "message", label: "Projektöversikt", type: "text", autoComplete: "off", required: true, placeholder: "Plats, omfattning, tidsram och annat vi bör känna till", multiline: true, wide: true },
    ],
  },
  en: {
    closeForm: "Close enquiry form", eyebrow: "Project enquiry", close: "Close",
    title: "Tell us about the space you want to create.", introduction: "Share the first details of your project. We’ll review your enquiry and reply with the right next step.",
    imageAlt: "Lagom residential architecture", formLabel: "Project enquiry form",
    details: "Your details", required: "Required *", overview: "Project overview *",
    overviewPlaceholder: "Location, scope, timeline and anything else we should know", send: "Send enquiry", footer: "Studio enquiries",
    submitNote: "Your details are sent securely to Lagom Arkitektur.",
    mailSubject: "New project enquiry", openingStatus: "Sending project enquiry…",
    fields: [
      { id: "name", label: "Name", type: "text", autoComplete: "name", required: true, placeholder: "Your name" },
      { id: "email", label: "Email address", type: "email", autoComplete: "email", required: true, placeholder: "you@studio.com" },
      { id: "phone", label: "Phone number", type: "tel", autoComplete: "tel", required: false, placeholder: "+46 00 000 00 00" },
      { id: "message", label: "Project overview", type: "text", autoComplete: "off", required: true, placeholder: "Location, scope, timeline and anything else we should know", multiline: true, wide: true },
    ],
  },
} as const satisfies Record<Language, object>;
