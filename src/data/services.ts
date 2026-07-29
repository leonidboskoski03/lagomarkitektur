import architectureImage from "../assets/images/services/architecture.png";
import interiorDesignImage from "../assets/images/services/interior-design-v2.png";
import visualizationImage from "../assets/images/services/visualization-v2.png";
import consultantImage from "../assets/images/services/consultant-v2.png";

export interface ServiceItem {
    id: string;
    index: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
}

export const services: ServiceItem[] = [
    {
        id: "architecture",
        index: "01",
        title: "Architecture",
        description: "Complete architectural solutions from initial site analysis and first sketches to technical drawings, 3D visualizations, and building permit approval.",
        image: architectureImage,
        imageAlt: "Architectural model and drawings on a calm studio desk",
    },
    {
        id: "interior-design",
        index: "02",
        title: "Interior Design",
        description: "Personalized interiors shaped around each client’s character and needs through technical drawings, execution details, and 3D visualizations.",
        image: interiorDesignImage,
        imageAlt: "Interior design material samples arranged on a studio table",
    },
    {
        id: "visualization",
        index: "03",
        title: "3D Visualization",
        description: "Realistic 3D visualizations that give concepts clear form, improve project communication, and support confident decisions before realization.",
        image: visualizationImage,
        imageAlt: "Architecture visualization workstation with a neutral interior render",
    },
    {
        id: "consultant",
        index: "04",
        title: "Consultant",
        description: "External interior design support for studios and companies, using expertise in materials, color, and lighting to bring clarity and cohesion to every project.",
        image: consultantImage,
        imageAlt: "Architectural consultation table with plans, samples, and sketches",
    },
];
