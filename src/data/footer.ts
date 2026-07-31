import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../lib/constants";

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterContent {
  enquiry: {
    eyebrow: string;
    title: string;
    link: FooterLinkItem;
  };
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
}

export const footerContent: FooterContent = {
  enquiry: {
    eyebrow: "Project enquiries",
    title: "Let’s make room for what matters.",
    link: {
      label: "Begin a project",
      href: "/contact",
    },
  },
  studio: {
    name: "Lagom Arkitektur",
    description:
      "Interior architecture, visualisation and spatial consultancy shaped with clarity, warmth and restraint.",
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
  social: [
    {
      label: "Instagram",
      href: INSTAGRAM_URL,
      external: true,
    },
    {
      label: "LinkedIn",
      href: LINKEDIN_URL,
      external: true,
    },
  ],
  legal: [
    {
      label: "Privacy policy",
      href: "https://lagomarkitektur.se/en/legal/",
      external: true,
    },
  ],
};
