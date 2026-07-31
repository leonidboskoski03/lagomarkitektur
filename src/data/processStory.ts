export interface ProcessStoryChapter {
    id: string;
    discipline: string;
    title: string;
    description: string;
    start: number;
    end: number;
    stillFrame: number;
    stillAlt: string;
}

export interface ProcessStoryLedgerItem {
    title: string;
    description: string;
}

export const processStory = {
    intro: {
        eyebrow: "How we work",
        headingLead: "A conversation",
        headingTail: "becomes a place.",
        description: "Move through one continuous architectural process—from the first quiet brief to a home resolved in structure, material, and light.",
        scrollPrompt: "Scroll to enter the process",
    },
    ledger: [
        {
            title: "Consultation",
            description: "Needs, context, and ambition become a clear brief.",
        },
        {
            title: "Architecture",
            description: "Proportion, circulation, and light are resolved as one plan.",
        },
        {
            title: "Interior Design",
            description: "Material and detail make the plan calm and inhabitable.",
        },
        {
            title: "3D Visualization",
            description: "Atmosphere is tested before anything is built.",
        },
    ] satisfies ProcessStoryLedgerItem[],
    gridPrompt: {
        titleLines: ["Something is", "taking shape."],
        cue: "Continue to reveal the process",
    },
    sequence: {
        title: "The making of L-28",
        poster: publicAsset("process-story/poster.webp"),
        mobileBasePath: publicAsset("process-story-v2/mobile"),
        desktopVideo: publicAsset("process-story-v2/process-desktop.mp4"),
        mobileVideo: publicAsset("process-story-v2/process-mobile.mp4"),
        frameCount: 979,
        durationSeconds: 54.375,
        fps: 24,
        width: 1920,
        height: 1080,
    },
    chapters: [
        {
            id: "consultation",
            discipline: "Consultation",
            title: "Every home begins with understanding.",
            description: "How you live, what you value, and what the site offers become the foundation for everything we create together.",
            start: 0,
            end: 0.18,
            stillFrame: 1,
            stillAlt: "A closed architectural drawing rests on a calm material table.",
        },
        {
            id: "architecture",
            discipline: "Architecture",
            title: "Life gives the plan its shape.",
            description: "Light, movement, and proportion are composed around everyday needs, bringing clarity to the first architectural idea.",
            start: 0.18,
            end: 0.53,
            stillFrame: 320,
            stillAlt: "The architectural plan unfolds across the studio table.",
        },
        {
            id: "spatial-planning",
            discipline: "Spatial planning",
            title: "The drawing becomes a place to inhabit.",
            description: "Rooms gain scale, depth, and connection, revealing how the home will flow and how living within it might feel.",
            start: 0.53,
            end: 0.73,
            stillFrame: 691,
            stillAlt: "The flat plan tilts into a precise three-dimensional architectural model.",
        },
        {
            id: "interior-design",
            discipline: "Interior Design",
            title: "The architecture finds its character.",
            description: "Material, colour, and detail are considered as one, bringing warmth and identity to the spaces taking shape.",
            start: 0.73,
            end: 0.91,
            stillFrame: 860,
            stillAlt: "Warm materials and interior details resolve across the architectural model.",
        },
        {
            id: "visualization",
            discipline: "3D Visualization",
            title: "The whole comes into view.",
            description: "Architecture, interior, and light meet in one coherent vision—a home considered in every detail and ready for the life ahead.",
            start: 0.91,
            end: 1,
            stillFrame: 979,
            stillAlt: "The completed courtyard house is seen as a resolved architectural model.",
        },
    ] satisfies ProcessStoryChapter[],
    outro: {
        eyebrow: "Your project",
        title: "Bring us the beginning.",
        description: "A site, an ambition, a question, or a sketch is enough to start the conversation.",
        actionLabel: "Start a project",
        actionHref: "/contact",
    },
} as const;
import { publicAsset } from "../lib/publicAsset";
