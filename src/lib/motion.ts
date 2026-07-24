import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export const motionEases = {
    reveal: CustomEase.create("lagom-reveal", ".65,0,.35,1"),
    cinematic: CustomEase.create("lagom-cinematic", ".58,0,.22,1"),
    enter: CustomEase.create("lagom-enter", ".22,1,.36,1"),
    depart: CustomEase.create("lagom-depart", ".64,0,.78,0"),
    settle: CustomEase.create("lagom-settle", ".33,1,.68,1"),
} as const;

export const motionEaseCurves = {
    settle: [0.33, 1, 0.68, 1] as [number, number, number, number],
} as const;
