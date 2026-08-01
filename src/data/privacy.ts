import type {Language} from "../i18n/language";
import {CONTACT_EMAIL} from "../lib/constants";

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyContent {
  eyebrow: string;
  title: string;
  updated: string;
  introduction: string;
  sections: PrivacySection[];
  contactLabel: string;
  contactEmail: string;
}

export const privacyContent: Record<Language, PrivacyContent> = {
  sv: {
    eyebrow: "Lagom Arkitektur / Juridiskt",
    title: "Integritetspolicy",
    updated: "Senast uppdaterad 1 augusti 2026",
    introduction: "Den här policyn beskriver hur Lagom Arkitektur behandlar personuppgifter när ni kontaktar oss eller skickar en projektförfrågan.",
    sections: [
      {
        title: "Personuppgiftsansvarig",
        paragraphs: [
          "Lagom Arkitektur är personuppgiftsansvarig för uppgifter som lämnas genom webbplatsens kontaktformulär och i efterföljande kommunikation.",
        ],
      },
      {
        title: "Uppgifter vi behandlar",
        paragraphs: [
          "Vi behandlar namn, e-postadress och projektbeskrivning. Om ni väljer att lämna dem behandlar vi även telefonnummer, projektplats, ungefärlig storlek, tidsram, prioriteringar och andra projektuppgifter.",
          "För att skydda formuläret mot missbruk behandlar Cloudflare även begränsade tekniska uppgifter som behövs för säkerhetskontrollen och leveransen av formuläret.",
        ],
      },
      {
        title: "Ändamål och rättslig grund",
        paragraphs: [
          "Vi använder uppgifterna för att bedöma och besvara er förfrågan, planera möjliga nästa steg och skydda webbplatsen mot spam och missbruk. Behandlingen sker för att vidta åtgärder på er begäran inför ett eventuellt avtal och, när det är tillämpligt, med stöd av vårt berättigade intresse av att hantera professionella förfrågningar och upprätthålla tjänstens säkerhet.",
        ],
      },
      {
        title: "Tjänsteleverantörer",
        paragraphs: [
          "Cloudflare behandlar formulärtrafik, serverfunktionen och säkerhetskontrollen Turnstile. Resend levererar förfrågan som transaktionsmeddelande och behandlar uppgifter i USA med tillämpliga skyddsåtgärder för internationella överföringar. STRATO tillhandahåller våra e-postlådor. Dessa leverantörer behandlar uppgifter för vår räkning eller som del av sina tjänster under tillämpliga avtal och skyddsåtgärder.",
          "Vi säljer inte personuppgifter och använder inte projektförfrågningar för marknadsföringsutskick.",
        ],
      },
      {
        title: "Lagring",
        paragraphs: [
          "Projektförfrågningar som inte leder till ett uppdrag raderas normalt senast 24 månader efter den senaste kontakten. Om förfrågan leder till ett uppdrag kan uppgifter sparas längre när det krävs för avtalet, bokföring eller rättsliga anspråk.",
          "Resend lagrar normalt e-postdata i 30 dagar. Tekniska säkerhetsloggar kan sparas enligt respektive leverantörs villkor och våra inställningar.",
        ],
      },
      {
        title: "Era rättigheter",
        paragraphs: [
          "Ni kan begära tillgång till, rättelse eller radering av era personuppgifter och i vissa fall begränsa eller invända mot behandlingen. Ni har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).",
        ],
      },
    ],
    contactLabel: "Frågor eller begäranden om personuppgifter",
    contactEmail: CONTACT_EMAIL,
  },
  en: {
    eyebrow: "Lagom Arkitektur / Legal",
    title: "Privacy notice",
    updated: "Last updated 1 August 2026",
    introduction: "This notice explains how Lagom Arkitektur processes personal data when you contact us or submit a project enquiry.",
    sections: [
      {
        title: "Data controller",
        paragraphs: [
          "Lagom Arkitektur is the data controller for information submitted through the website contact form and in subsequent correspondence.",
        ],
      },
      {
        title: "Information we process",
        paragraphs: [
          "We process your name, email address and project description. If you choose to provide them, we also process your phone number, project location, approximate size, timeframe, priorities and other project details.",
          "To protect the form from abuse, Cloudflare also processes limited technical information needed for the security check and form delivery.",
        ],
      },
      {
        title: "Purpose and lawful basis",
        paragraphs: [
          "We use the information to assess and answer your enquiry, plan possible next steps and protect the website from spam and abuse. Processing is necessary to take steps at your request before a possible contract and, where applicable, is based on our legitimate interest in handling professional enquiries and maintaining service security.",
        ],
      },
      {
        title: "Service providers",
        paragraphs: [
          "Cloudflare processes form traffic, the server function and the Turnstile security check. Resend delivers the enquiry as a transactional message and processes information in the United States using applicable safeguards for international transfers. STRATO provides our email mailboxes. These providers process information on our behalf or as part of their services under applicable agreements and safeguards.",
          "We do not sell personal data or use project enquiries for marketing mailings.",
        ],
      },
      {
        title: "Retention",
        paragraphs: [
          "Project enquiries that do not lead to an engagement are normally deleted no later than 24 months after the last contact. If an enquiry becomes an engagement, information may be retained longer when required for the contract, accounting or legal claims.",
          "Resend normally retains email data for 30 days. Technical security logs may be retained under each provider’s terms and our configuration.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You may request access to, correction or deletion of your personal data and may in some cases restrict or object to processing. You also have the right to complain to the Swedish Authority for Privacy Protection (IMY).",
        ],
      },
    ],
    contactLabel: "Questions or personal-data requests",
    contactEmail: CONTACT_EMAIL,
  },
};
