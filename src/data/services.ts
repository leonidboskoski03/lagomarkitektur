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
        description: "Residential and spatial architecture shaped around proportion, light, material presence, and calm long-term use.",
        image: architectureImage,
        imageAlt: "Architectural model and drawings on a calm studio desk",
    },
    {
        id: "interior-design",
        index: "02",
        title: "Interior Design",
        description: "Interior concepts, material palettes, furniture direction, and spatial detailing for balanced everyday living.",
        image: interiorDesignImage,
        imageAlt: "Interior design material samples arranged on a studio table",
    },
    {
        id: "visualization",
        index: "03",
        title: "3D Visualization",
        description: "Atmospheric visualizations and design previews that clarify mood, light, texture, and architectural intent.",
        image: visualizationImage,
        imageAlt: "Architecture visualization workstation with a neutral interior render",
    },
    {
        id: "consultant",
        index: "04",
        title: "Consultant",
        description: "Interior design support for studios and companies across materials, color, lighting, and spatial cohesion.",
        image: consultantImage,
        imageAlt: "Architectural consultation table with plans, samples, and sketches",
    },
];
