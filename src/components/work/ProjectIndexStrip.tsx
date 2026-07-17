import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { WorkProjectImage } from "../../hooks/useWorkProjects";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface ProjectIndexStripProps {
  projectId: string;
  images: WorkProjectImage[];
}

export function ProjectIndexStrip({ projectId, images }: ProjectIndexStripProps) {
  const viewportRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let overflow = 0;
    let wheelX = 0;

    const draggable = Draggable.create(track, {
      trigger: viewport,
      type: "x",
      inertia: reduceMotion ? false : {
        resistance: 2600,
        duration: { min: 0.65, max: 1.8 },
      },
      dragResistance: 0.055,
      edgeResistance: 0.9,
      minimumMovement: 3,
      dragClickables: false,
      allowNativeTouchScrolling: false,
      allowContextMenu: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress: () => {
        gsap.killTweensOf(track);
        wheelX = Number(gsap.getProperty(track, "x")) || 0;
        viewport.setAttribute("data-strip-dragging", "true");
      },
      onDrag: () => {
        wheelX = draggable.x;
      },
      onThrowUpdate: () => {
        wheelX = draggable.x;
      },
      onRelease: () => viewport.removeAttribute("data-strip-dragging"),
      onThrowComplete: () => {
        wheelX = draggable.x;
        viewport.removeAttribute("data-strip-dragging");
      },
    })[0];

    const glideTo = gsap.quickTo(track, "x", {
      duration: reduceMotion ? 0 : 0.72,
      ease: "power3.out",
      onUpdate: () => draggable.update(),
    });

    const measure = () => {
      overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const currentX = Number(gsap.getProperty(track, "x")) || 0;
      wheelX = gsap.utils.clamp(-overflow, 0, currentX);
      gsap.set(track, { x: wheelX });
      draggable.applyBounds({ minX: -overflow, maxX: 0 });
      draggable.update();
    };

    const handleWheel = (event: WheelEvent) => {
      const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = isHorizontalGesture ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (!delta || overflow <= 0) return;

      event.preventDefault();
      wheelX = gsap.utils.clamp(-overflow, 0, wheelX - delta);
      glideTo(wheelX);
    };

    gsap.set(track, { x: 0 });
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
      glideTo.tween?.kill();
      draggable.kill();
    };
  }, { scope: viewportRef, dependencies: [images] });

  return (
    <span
      ref={viewportRef}
      data-index-strip={projectId}
      data-cursor="Drag"
      role="group"
      aria-label="Drag to explore project images"
      className="relative z-[1] block min-w-0 touch-none overflow-hidden cursor-grab data-[strip-dragging=true]:cursor-grabbing"
    >
      <span ref={trackRef} className="flex w-max items-end gap-3 will-change-transform">
        {images.map((image, imageIndex) => (
          <span
            key={`${projectId}-${image.url}-${imageIndex}`}
            className="block w-[clamp(10rem,15vw,15rem)] shrink-0 overflow-hidden bg-black"
            style={{ aspectRatio: image.aspectRatio }}
          >
            <img
              data-index-image
              src={image.url}
              alt=""
              width={image.width}
              height={image.height}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              draggable={false}
              className="pointer-events-none !h-full w-full object-cover opacity-86 will-change-[transform,opacity,filter]"
            />
          </span>
        ))}
      </span>
    </span>
  );
}
