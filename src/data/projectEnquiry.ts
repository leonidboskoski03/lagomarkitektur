import type { Language } from "../i18n/language";

export interface EnquiryOption {
  id: string;
  label: string;
}

export interface ChoiceQuestion {
  title: string;
  hint: string;
  options: EnquiryOption[];
}

export interface TextQuestion {
  title: string;
  placeholder: string;
}

export interface ProjectEnquiryContent {
  mode: {
    legend: string;
    quickLabel: string;
    quickDescription: string;
    structuredLabel: string;
    structuredDescription: string;
  };
  delivery: {
    sending: string;
    success: string;
    error: string;
    verificationRequired: string;
    verificationUnavailable: string;
    directFallback: string;
    privacyPrefix: string;
    privacyLabel: string;
  };
  structured: {
    questionOrder: "priorities-first" | "source-first";
    formLabel: string;
    personalDetails: string;
    projectParticulars: string;
    required: string;
    optional: string;
    selectOne: string;
    selectMultiple: string;
    back: string;
    next: string;
    submit: string;
    submitNote: string;
    mailSubject: string;
    openingStatus: string;
    contact: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
    };
    projectType: ChoiceQuestion;
    description: TextQuestion;
    location: TextQuestion;
    size: TextQuestion & { unknown: string };
    timeframe: ChoiceQuestion;
    priorities: ChoiceQuestion;
    source: ChoiceQuestion;
    additional: TextQuestion;
  };
}

export const projectEnquiryContent: Record<Language, ProjectEnquiryContent> = {
  sv: {
    mode: {
      legend: "Välj hur ni vill börja",
      quickLabel: "Snabb förfrågan",
      quickDescription: "Några rader räcker",
      structuredLabel: "Projektbrief",
      structuredDescription: "Guidad, cirka 4 minuter",
    },
    delivery: {
      sending: "Skickar förfrågan…",
      success: "Tack. Er förfrågan har skickats. Vi återkommer vanligtvis inom 2–3 arbetsdagar.",
      error: "Förfrågan kunde inte skickas just nu. Era uppgifter finns kvar så att ni kan försöka igen.",
      verificationRequired: "Vänta tills säkerhetskontrollen är klar och försök sedan igen.",
      verificationUnavailable: "Säkerhetskontrollen kunde inte laddas. Ni kan kontakta oss direkt via e-post.",
      directFallback: "Skicka e-post direkt",
      privacyPrefix: "När ni skickar formuläret behandlar vi era uppgifter enligt vår",
      privacyLabel: "integritetspolicy",
    },
    structured: {
      questionOrder: "source-first",
      formLabel: "Guidad projektförfrågan",
      personalDetails: "Era uppgifter",
      projectParticulars: "Projektinformation",
      required: "Obligatoriskt *",
      optional: "Valfritt",
      selectOne: "Välj ett alternativ",
      selectMultiple: "Välj ett eller flera alternativ",
      back: "Tillbaka",
      next: "Nästa",
      submit: "Starta samtalet",
      submitNote: "Öppnar ett strukturerat meddelande i ert vanliga e-postprogram.",
      mailSubject: "Ny strukturerad projektförfrågan",
      openingStatus: "Öppnar en strukturerad projektförfrågan…",
      contact: {
        name: "Namn",
        namePlaceholder: "Ert namn",
        email: "E-postadress",
        emailPlaceholder: "ni@epost.se",
        phone: "Telefonnummer",
        phonePlaceholder: "+46 00 000 00 00",
      },
      projectType: {
        title: "Vad gäller ditt projekt?",
        hint: "Välj ett eller flera alternativ",
        options: [
          { id: "new-home", label: "Nybyggnation" },
          { id: "extension", label: "Tillbyggnad" },
          { id: "renovation", label: "Ombyggnad/Renovering" },
          { id: "interior-design", label: "Inredningsdesign" },
          { id: "commercial", label: "Kommersiell lokal" },
          { id: "building-permit", label: "Bygglovshandlingar" },
          { id: "visualization", label: "3D-visualisering" },
          { id: "other-services", label: "Annat" },
        ],
      },
      description: {
        title: "Berätta kort om ditt projekt",
        placeholder: "En kort beskrivning av dina idéer, mål eller krav.",
      },
      location: {
        title: "Var ligger projektet?",
        placeholder: "Ort / Kommun",
      },
      size: {
        title: "Ungefärlig storlek (om du vet)",
        placeholder: "t.ex. 120 m²",
        unknown: "Vet ej",
      },
      timeframe: {
        title: "När planerar du att starta projektet?",
        hint: "Välj ett alternativ",
        options: [
          { id: "asap", label: "Så snart som möjligt" },
          { id: "three-months", label: "Inom 3 månader" },
          { id: "six-months", label: "Inom 6 månader" },
          { id: "twelve-months", label: "Inom ett år" },
          { id: "exploring", label: "Jag undersöker bara möjligheterna" },
        ],
      },
      priorities: {
        title: "Vad är viktigast för dig i projektet?",
        hint: "Välj ett eller flera alternativ",
        options: [
          { id: "design", label: "Design" },
          { id: "function", label: "Funktion" },
          { id: "sustainability", label: "Hållbarhet" },
          { id: "budget", label: "Budget" },
          { id: "timeline", label: "Tidsplan" },
          { id: "energy-efficiency", label: "Energieffektivitet" },
          { id: "other", label: "Annat" },
        ],
      },
      source: {
        title: "Hur hörde du talas om oss?",
        hint: "Välj ett alternativ",
        options: [
          { id: "google", label: "Google-sökning" },
          { id: "instagram", label: "Instagram" },
          { id: "linkedin", label: "LinkedIn" },
          { id: "recommendation", label: "Rekommendation" },
          { id: "returning", label: "Återkommande kund" },
          { id: "other", label: "Annat" },
        ],
      },
      additional: {
        title: "Finns det något annat du vill att vi ska veta?",
        placeholder: "Ytterligare information som du vill dela.",
      },
    },
  },
  en: {
    mode: {
      legend: "Choose how you would like to begin",
      quickLabel: "Quick enquiry",
      quickDescription: "A few lines are enough",
      structuredLabel: "Project brief",
      structuredDescription: "Guided, about 4 minutes",
    },
    delivery: {
      sending: "Sending enquiry…",
      success: "Thank you. Your enquiry has been sent. We usually reply within 2–3 business days.",
      error: "We could not send your enquiry just now. Your details are still here so you can try again.",
      verificationRequired: "Please wait for the security check to finish, then try again.",
      verificationUnavailable: "The security check could not load. You can contact us directly by email.",
      directFallback: "Email us directly",
      privacyPrefix: "When you send this form, we process your details according to our",
      privacyLabel: "privacy notice",
    },
    structured: {
      questionOrder: "priorities-first",
      formLabel: "Guided project enquiry",
      personalDetails: "Your personal details",
      projectParticulars: "Project particulars",
      required: "Required *",
      optional: "Optional",
      selectOne: "Select one option",
      selectMultiple: "Select one or more options",
      back: "Back",
      next: "Next",
      submit: "Start the conversation",
      submitNote: "Opens a structured message in your default email app.",
      mailSubject: "New structured project enquiry",
      openingStatus: "Opening a structured project enquiry…",
      contact: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email address",
        emailPlaceholder: "you@email.com",
        phone: "Phone number",
        phonePlaceholder: "+46 00 000 00 00",
      },
      projectType: {
        title: "What type of project are you planning?",
        hint: "Select one or more options",
        options: [
          { id: "new-home", label: "New Home" },
          { id: "extension", label: "Home Extension" },
          { id: "renovation", label: "Renovation" },
          { id: "interior-design", label: "Interior Design" },
          { id: "commercial", label: "Commercial Project" },
          { id: "building-permit", label: "Building Permit Documentation" },
          { id: "visualization", label: "3D Visualization" },
          { id: "other-services", label: "Other Architectural Services" },
        ],
      },
      description: {
        title: "Tell us a little about your project",
        placeholder: "A brief description of your ideas, goals, or requirements.",
      },
      location: {
        title: "Where will the project be located?",
        placeholder: "City / Municipality",
      },
      size: {
        title: "Approximate project size (if known)",
        placeholder: "Example: 120 m²",
        unknown: "I don't know yet",
      },
      timeframe: {
        title: "When are you planning to start your project?",
        hint: "Select one option",
        options: [
          { id: "asap", label: "As soon as possible" },
          { id: "three-months", label: "Within 3 months" },
          { id: "six-months", label: "Within 6 months" },
          { id: "twelve-months", label: "Within 12 months" },
          { id: "exploring", label: "I'm currently exploring my options" },
        ],
      },
      priorities: {
        title: "What is most important to you?",
        hint: "Select one or more options",
        options: [
          { id: "design", label: "Design & Aesthetics" },
          { id: "function", label: "Functionality" },
          { id: "sustainability", label: "Sustainability" },
          { id: "budget", label: "Budget" },
          { id: "timeline", label: "Timeline" },
          { id: "energy-efficiency", label: "Energy Efficiency" },
          { id: "other", label: "Other" },
        ],
      },
      source: {
        title: "How did you hear about us?",
        hint: "Select one option",
        options: [
          { id: "google", label: "Google Search" },
          { id: "instagram", label: "Instagram" },
          { id: "linkedin", label: "LinkedIn" },
          { id: "recommendation", label: "Recommendation" },
          { id: "returning", label: "Returning Client" },
          { id: "other", label: "Other" },
        ],
      },
      additional: {
        title: "Is there anything else you'd like us to know?",
        placeholder: "Additional information you'd like to share.",
      },
    },
  },
};
