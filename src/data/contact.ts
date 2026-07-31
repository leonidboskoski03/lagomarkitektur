import contactHouseLandscape from "../assets/images/about/stoneframe-front.webp";
import contactHousePortrait from "../assets/images/contact-house-portrait.avif";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../lib/constants";

export interface ContactFormField {
  id: "name" | "email" | "location" | "message";
  label: string;
  placeholder: string;
  autoComplete: string;
  type: "text" | "email";
  required: boolean;
  multiline?: boolean;
  wide?: boolean;
}

export interface ContactPageContent {
  transition: {
    eyebrow: string;
    title: string;
    meta: string;
    note: string;
  };
  hero: {
    eyebrow: string;
    image: {
      src: string;
      alt: string;
      caption: string;
    };
    scrollLabel: string;
  };
  enquiry: {
    eyebrow: string;
    titleLines: [string, string];
    introduction: string;
  };
  direct: {
    label: string;
    email: string;
    locationLabel: string;
    location: string;
    responseLabel: string;
    responseTime: string;
  };
  form: {
    eyebrow: string;
    title: string;
    introduction: string;
    image: {
      src: string;
      alt: string;
      caption: string;
    };
    requiredLabel: string;
    fields: ContactFormField[];
    submitLabel: string;
    submitNote: string;
    mailSubject: string;
  };
  social: {
    label: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

export const contactContent: ContactPageContent = {
  transition: {
    eyebrow: "Project enquiries",
    title: "CONTACT",
    meta: "04 / Malmö, Sweden",
    note: "A considered place to begin.",
  },
  hero: {
    eyebrow: "Lagom Arkitektur / Contact",
    image: {
      src: contactHouseLandscape,
      alt: "L-28 Stoneframe Villa in a quiet natural setting",
      caption: "L-28 Stoneframe Villa / Residential architecture",
    },
    scrollLabel: "Start an enquiry",
  },
  enquiry: {
    eyebrow: "Project enquiries / Malmö",
    titleLines: ["Tell us about", "your project."],
    introduction:
      "We work with a considered number of projects so every commission receives the time, clarity, and presence it deserves.",
  },
  direct: {
    label: "Direct",
    email: CONTACT_EMAIL,
    locationLabel: "Studio",
    location: CONTACT_LOCATION,
    responseLabel: "Reply",
    responseTime: "Usually within 2–3 business days.",
  },
  form: {
    eyebrow: "Project details",
    title: "Start a project.",
    introduction:
      "A few first details are enough. Tell us where the project is, what you are considering, and the timeframe you have in mind.",
    image: {
      src: contactHousePortrait,
      alt: "Lagom residential architecture framed by mature trees",
      caption: "A quiet place to begin",
    },
    requiredLabel: "Required *",
    fields: [
      {
        id: "name",
        label: "Name",
        placeholder: "Your name",
        autoComplete: "name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        label: "Email",
        placeholder: "you@email.com",
        autoComplete: "email",
        type: "email",
        required: true,
      },
      {
        id: "location",
        label: "Project location",
        placeholder: "City / country",
        autoComplete: "off",
        type: "text",
        required: false,
        wide: true,
      },
      {
        id: "message",
        label: "Project overview",
        placeholder: "Tell us about the space, scope, and approximate timeframe.",
        autoComplete: "off",
        type: "text",
        required: true,
        multiline: true,
        wide: true,
      },
    ],
    submitLabel: "Continue in email",
    submitNote: "Opens a prepared message in your default email app.",
    mailSubject: "New project enquiry",
  },
  social: {
    label: "Elsewhere",
    links: [
      {
        label: "Instagram",
        href: INSTAGRAM_URL,
      },
      {
        label: "LinkedIn",
        href: LINKEDIN_URL,
      },
    ],
  },
};
