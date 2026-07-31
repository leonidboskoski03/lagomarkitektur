import architectureImage from "../assets/images/services/architecture.png";
import interiorDesignImage from "../assets/images/services/interior-design-v2.png";
import visualizationImage from "../assets/images/services/visualization-v2.png";
import consultantImage from "../assets/images/services/consultant-v2.png";
import type { Language } from "../i18n/language";

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const serviceMedia = {
  architecture: architectureImage,
  interior: interiorDesignImage,
  visualization: visualizationImage,
  consultant: consultantImage,
};

export const services: Record<Language, ServiceItem[]> = {
  sv: [
    {
      id: "architecture", index: "01", title: "Arkitektur",
      description: "Kompletta arkitekturlösningar från inledande platsanalys och första skisser till tekniska ritningar, 3D-visualiseringar och bygglov.",
      image: serviceMedia.architecture,
      imageAlt: "Arkitekturmodell och ritningar på ett lugnt studiobord",
    },
    {
      id: "interior-design", index: "02", title: "Inredningsdesign",
      description: "Personligt utformade interiörer baserade på varje klients karaktär och behov, genom tekniska ritningar, bygghandlingar och 3D-visualiseringar.",
      image: serviceMedia.interior,
      imageAlt: "Materialprover för inredningsdesign arrangerade på ett studiobord",
    },
    {
      id: "visualization", index: "03", title: "3D-visualisering",
      description: "Realistiska 3D-visualiseringar som ger koncept tydlig form, förbättrar kommunikationen i projektet och stödjer trygga beslut före genomförandet.",
      image: serviceMedia.visualization,
      imageAlt: "Arbetsstation för arkitekturvisualisering med en neutral interiörbild",
    },
    {
      id: "consultant", index: "04", title: "Konsult",
      description: "Externt stöd inom inredningsdesign för arkitektkontor och företag, med expertis inom material, färg och belysning för att skapa tydlighet och sammanhang i varje projekt.",
      image: serviceMedia.consultant,
      imageAlt: "Rådgivningsbord med arkitektritningar, materialprover och skisser",
    },
  ],
  en: [
    {
      id: "architecture", index: "01", title: "Architecture",
      description: "Complete architectural solutions from initial site analysis and first sketches to technical drawings, 3D visualizations, and building permit approval.",
      image: serviceMedia.architecture,
      imageAlt: "Architectural model and drawings on a calm studio desk",
    },
    {
      id: "interior-design", index: "02", title: "Interior Design",
      description: "Personalized interiors shaped around each client’s character and needs through technical drawings, execution details, and 3D visualizations.",
      image: serviceMedia.interior,
      imageAlt: "Interior design material samples arranged on a studio table",
    },
    {
      id: "visualization", index: "03", title: "3D Visualization",
      description: "Realistic 3D visualizations that give concepts clear form, improve project communication, and support confident decisions before realization.",
      image: serviceMedia.visualization,
      imageAlt: "Architecture visualization workstation with a neutral interior render",
    },
    {
      id: "consultant", index: "04", title: "Consultant",
      description: "External interior design support for studios and companies, using expertise in materials, color, and lighting to bring clarity and cohesion to every project.",
      image: serviceMedia.consultant,
      imageAlt: "Architectural consultation table with plans, samples, and sketches",
    },
  ],
};
