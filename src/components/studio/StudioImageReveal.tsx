import { useRef, type ImgHTMLAttributes, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../lib/motion";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StudioImageRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  transitionImageId?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>["fetchPriority"];
  sizes?: string;
  surface?: "dark" | "light";
  children?: ReactNode;
}

export function StudioImageReveal({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  transitionImageId,
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
  surface = "dark",
  children,
}: StudioImageRevealProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const veilRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const veil = veilRef.current;
    if (!frame || !image || !veil) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(veil, { autoAlpha: 0 });
      gsap.set(image, {
        clearProps: "transform,filter,transitionProperty",
      });
      return;
    }

    gsap.set(veil, { autoAlpha: 1 });
    gsap.set(image, {
      scale: 1.045,
      filter: "brightness(0.66)",
      transformOrigin: "center center",
      transitionProperty: "none",
    });

    let entered = false;
    let loaded = image.complete && image.naturalWidth > 0;

    const reveal = () => {
      if (!entered || !loaded) return;
      gsap
        .timeline({ defaults: { overwrite: "auto" } })
        .to(
          veil,
          {
            autoAlpha: 0,
            duration: 0.78,
            ease: motionEases.reveal,
          },
          0,
        )
        .to(
          image,
          {
            scale: 1,
            filter: "brightness(1)",
            duration: 1.34,
            ease: motionEases.settle,
            clearProps: "transform,filter,transitionProperty",
          },
          0,
        );
    };

    const onLoad = () => {
      loaded = true;
      reveal();
    };

    const trigger = ScrollTrigger.create({
      trigger: frame,
      start: "top 90%",
      once: true,
      onEnter: () => {
        entered = true;
        reveal();
      },
    });

    if (!loaded) image.addEventListener("load", onLoad, { once: true });

    return () => {
      image.removeEventListener("load", onLoad);
      trigger.kill();
    };
  }, {
    scope: frameRef,
    dependencies: [src],
    revertOnUpdate: true,
  });

  return (
    <div
      ref={frameRef}
      data-studio-image-reveal=""
      data-transition-image={transitionImageId}
      className={cn(
        "relative overflow-hidden",
        surface === "light" ? "bg-white" : "bg-black",
        className,
      )}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={sizes}
        className={cn(
          "absolute inset-0 !h-full w-full object-cover transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(.22,1,.36,1)] will-change-[transform,filter] group-hover:scale-[1.018]",
          imageClassName,
        )}
      />
      <span
        ref={veilRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 will-change-opacity",
          surface === "light" ? "bg-white" : "bg-black",
        )}
      />
      {children}
    </div>
  );
}
