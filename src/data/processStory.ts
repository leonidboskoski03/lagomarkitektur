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
        poster: "/process-story/poster.webp",
        desktopBasePath: "/process-story-v2/desktop",
        mobileBasePath: "/process-story-v2/mobile",
        frameCount: 979,
        durationSeconds: 54.375,
        fps: 18,
        width: 1920,
        height: 1080,
    },
    chapters: [
        {
            id: "consultation",
            discipline: "Consultation",
            title: "Every project begins with listening.",
            description: "How you live, what the site offers, and what the project must make possible are understood before the first line is fixed.",
            start: 0,
            end: 0.18,
            stillFrame: 1,
            stillAlt: "A closed architectural drawing rests on a calm material table.",
        },
        {
            id: "architecture",
            discipline: "Architecture",
            title: "Proportion becomes plan.",
            description: "The brief is translated into circulation, thresholds, daylight, and relationships between rooms—precise enough to guide every decision that follows.",
            start: 0.18,
            end: 0.53,
            stillFrame: 320,
            stillAlt: "The architectural plan unfolds across the studio table.",
        },
        {
            id: "spatial-planning",
            discipline: "Spatial planning",
            title: "The plan gains depth.",
            description: "Walls rise from the drawing while openings, furniture, and movement remain connected to the original geometry.",
            start: 0.53,
            end: 0.73,
            stillFrame: 691,
            stillAlt: "The flat plan tilts into a precise three-dimensional architectural model.",
        },
        {
            id: "interior-design",
            discipline: "Interior Design",
            title: "Material makes space inhabitable.",
            description: "Oak, pale stone, quiet textiles, and measured contrast are introduced as one atmosphere—not as decoration added at the end.",
            start: 0.73,
            end: 0.91,
            stillFrame: 860,
            stillAlt: "Warm materials and interior details resolve across the architectural model.",
        },
        {
            id: "visualization",
            discipline: "3D Visualization",
            title: "Light reveals the whole.",
            description: "The complete home can be tested, understood, and refined before construction begins. One coherent idea, carried from brief to place.",
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
