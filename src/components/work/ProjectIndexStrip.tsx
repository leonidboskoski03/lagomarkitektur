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
    let targetX = 0;

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
      cursor: "default",
      activeCursor: "grabbing",
      onPress: () => {
        // Keep quickTo reusable. Killing every track tween here also kills the
        // wheel controller, so horizontal wheel input cannot resume after a drag.
        glideTo.tween?.pause();
        draggable.tween?.kill();
        targetX = Number(gsap.getProperty(track, "x")) || 0;
        viewport.setAttribute("data-strip-dragging", "true");
      },
      onDrag: () => {
        targetX = draggable.x;
      },
      onThrowUpdate: () => {
        targetX = draggable.x;
      },
      onRelease: () => viewport.removeAttribute("data-strip-dragging"),
      onThrowComplete: () => {
        targetX = draggable.x;
        viewport.removeAttribute("data-strip-dragging");
      },
    })[0];

    const glideTo = gsap.quickTo(track, "x", {
      duration: reduceMotion ? 0 : 0.88,
      ease: "power4.out",
      onUpdate: () => draggable.update(),
    });

    const measure = () => {
      overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const currentX = Number(gsap.getProperty(track, "x")) || 0;
      targetX = gsap.utils.clamp(-overflow, 0, currentX);
      gsap.set(track, { x: targetX });
      draggable.applyBounds({ minX: -overflow, maxX: 0 });
      draggable.update();
    };

    const handleWheel = (event: WheelEvent) => {
      if (overflow <= 0 || draggable.isDragging) return;

      const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
      if (!rawDelta) return;

      const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 18
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? viewport.clientWidth
          : 1;
      const delta = gsap.utils.clamp(-140, 140, rawDelta * deltaScale);
      const currentX = Number(gsap.getProperty(track, "x")) || 0;

      if (draggable.tween?.isActive()) {
        draggable.tween.kill();
        targetX = currentX;
      }

      const nextX = gsap.utils.clamp(-overflow, 0, targetX - delta);
      const isAtBoundary = Math.abs(nextX - targetX) < 0.1
        && Math.abs(currentX - nextX) < 0.5;
      if (isAtBoundary) return;

      event.preventDefault();
      targetX = nextX;
      glideTo(targetX);
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
      className="relative z-[1] block min-w-0 touch-none overflow-hidden data-[strip-dragging=true]:cursor-grabbing"
    >
      <span ref={trackRef} className="flex w-max items-end gap-3 will-change-transform">
        {images.map((image, imageIndex) => (
          <span
            key={`${projectId}-${image.url}-${imageIndex}`}
            data-mode-project={imageIndex === 0 ? projectId : undefined}
            data-mode-project-image={imageIndex === 0 ? "" : undefined}
            data-transition-image={`${projectId}:gallery:${imageIndex}`}
            className="block w-[clamp(10rem,15vw,15rem)] shrink-0 overflow-hidden bg-black"
            style={{ aspectRatio: image.aspectRatio }}
          >
            <img
              data-index-image
              src={image.previewUrl || image.url}
              srcSet={image.previewSrcSet || image.srcSet}
              sizes={image.previewSizes || image.sizes}
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
