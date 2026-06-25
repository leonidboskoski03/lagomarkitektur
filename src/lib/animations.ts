import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (element: string | Element, delay = 0) => {
  return gsap.from(element, {
    y: 40,
    opacity: 0,
    duration: 1,
    delay,
    ease: "power2.out",
  });
};

export const fadeIn = (element: string | Element, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    duration: 1,
    delay,
    ease: "power2.out",
  });
};

export const scaleIn = (element: string | Element, delay = 0) => {
  return gsap.from(element, {
    scale: 1.05,
    opacity: 0,
    duration: 1.2,
    delay,
    ease: "power2.out",
  });
};

export const revealImage = (element: string | Element, delay = 0) => {
  const tl = gsap.timeline({ delay });
  tl.set(element, { clipPath: "inset(0 100% 0 0)" });
  tl.to(element, {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.4,
    ease: "power3.inOut",
  });
  return tl;
};
