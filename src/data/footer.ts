import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../lib/constants";
import type { Language } from "../i18n/language";

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterContent {
  enquiry: { eyebrow: string; title: string; link: FooterLinkItem };
  studio: {
    name: string;
    description: string;
    disciplines: string;
    location: string;
    email: string;
  };
  navigation: FooterLinkItem[];
  social: FooterLinkItem[];
  legal: FooterLinkItem[];
  labels: {
    footer: string;
    enquiries: string;
    studioInformation: string;
    studio: string;
    navigate: string;
    follow: string;
    findUs: string;
    direct: string;
    footerNavigation: string;
    legalUtilities: string;
  };
}

const social: FooterLinkItem[] = [
  { label: "Instagram", href: INSTAGRAM_URL, external: true },
  { label: "LinkedIn", href: LINKEDIN_URL, external: true },
];

export const footerContent: Record<Language, FooterContent> = {
  sv: {
    enquiry: {
      eyebrow: "Projektförfrågningar",
      title: "Låt oss skapa rum för det som betyder något.",
      link: { label: "Starta ett projekt", href: "/contact" },
    },
    studio: {
      name: "Lagom Arkitektur",
      description: "Interiörarkitektur, visualisering och rumslig rådgivning formade med tydlighet, värme och återhållsamhet.",
      disciplines: "Arkitektur · Interiörer · Visualisering · Rådgivning",
      location: "Malmö, Sverige",
      email: CONTACT_EMAIL,
    },
    navigation: [
      { label: "Hem", href: "/" },
      { label: "Projekt", href: "/work" },
      { label: "Om oss", href: "/about" },
      { label: "Kontakt", href: "/contact" },
    ],
    social,
    legal: [{ label: "Integritetspolicy", href: "/integritet" }],
    labels: {
      footer: "Lagom Arkitektur sidfot", enquiries: "Projektförfrågningar",
      studioInformation: "Studioinformation", studio: "Studio", navigate: "Navigera",
      follow: "Följ oss", findUs: "Hitta oss", direct: "Direkt",
      footerNavigation: "Navigering i sidfoten", legalUtilities: "Juridisk information och verktyg",
    },
  },
  en: {
    enquiry: {
      eyebrow: "Project enquiries",
      title: "Let’s make room for what matters.",
      link: { label: "Begin a project", href: "/contact" },
    },
    studio: {
      name: "Lagom Arkitektur",
      description: "Interior architecture, visualisation and spatial consultancy shaped with clarity, warmth and restraint.",
      disciplines: "Architecture · Interiors · Visualisation · Consultancy",
      location: CONTACT_LOCATION,
      email: CONTACT_EMAIL,
    },
    navigation: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    social,
    legal: [{ label: "Privacy notice", href: "/privacy" }],
    labels: {
      footer: "Lagom Arkitektur footer", enquiries: "Project enquiries",
      studioInformation: "Studio information", studio: "Studio", navigate: "Navigate",
      follow: "Follow", findUs: "Find us", direct: "Direct",
      footerNavigation: "Footer navigation", legalUtilities: "Legal and utilities",
    },
  },
};
