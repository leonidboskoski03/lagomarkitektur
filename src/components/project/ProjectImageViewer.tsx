import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { motionEases } from "../../lib/motion";
import type { ProjectGalleryMedia } from "../../types/project";
import styles from "./ProjectDetail.module.css";

gsap.registerPlugin(Flip, useGSAP);

interface ProjectImageViewerProps {
  media: ProjectGalleryMedia[];
  initialIndex: number;
  originElement: HTMLElement | null;
  onClose: () => void;
}

export function ProjectImageViewer({
  media,
  initialIndex,
  originElement,
  onClose,
}: ProjectImageViewerProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const pendingOriginRef = useRef<HTMLElement | null>(originElement);
  const hasAnimatedRef = useRef(false);
  const isClosingRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selected = media[selectedIndex];
  const viewerWidth = selected.aspectRatio < 0.95
    ? "min(58vw, 40rem)"
    : selected.aspectRatio < 1.25
      ? "min(65vw, 58rem)"
      : "min(79vw, 91rem)";

  useGSAP(() => {
    const viewer = viewerRef.current;
    const frame = frameRef.current;
    if (!viewer || !frame || !selected) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const source = pendingOriginRef.current;
    const thumbnails = gsap.utils.toArray<HTMLElement>(
      "[data-project-viewer-thumbnail]",
      viewer,
    );

    gsap.killTweensOf(frame);
    gsap.set(viewer, { autoAlpha: 1 });

    if (reduceMotion || !source) {
      gsap.set(frame, { clearProps: "transform" });
    } else {
      Flip.fit(frame, source, { scale: true });
      gsap.to(frame, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: hasAnimatedRef.current ? 0.62 : 0.78,
        ease: motionEases.cinematic,
        clearProps: "transform",
        overwrite: true,
      });
    }

    if (!hasAnimatedRef.current && !reduceMotion) {
      gsap.fromTo(
        thumbnails,
        { x: -12, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.58,
          stagger: 0.035,
          ease: motionEases.enter,
          delay: 0.18,
        },
      );
    }

    hasAnimatedRef.current = true;
    pendingOriginRef.current = null;
  }, {
    scope: viewerRef,
    dependencies: [selectedIndex, selected],
  });

  const closeViewer = useCallback(() => {
    if (isClosingRef.current) return;

    const viewer = viewerRef.current;
    const frame = frameRef.current;
    if (!viewer || !frame) {
      onClose();
      return;
    }

    isClosingRef.current = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const source = document.querySelector<HTMLElement>(
      `[data-project-media-id="${selected.id}"]`,
    );
    const rect = source?.getBoundingClientRect();
    const sourceIsVisible = Boolean(
      source
      && rect
      && rect.bottom > 0
      && rect.top < window.innerHeight
      && rect.right > 0
      && rect.left < window.innerWidth,
    );

    if (reduceMotion) {
      onClose();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: onClose,
      defaults: { overwrite: true },
    });

    timeline.to(
      viewer.querySelectorAll("[data-project-viewer-thumbnail]"),
      {
        x: -10,
        autoAlpha: 0,
        duration: 0.32,
        stagger: 0.018,
        ease: motionEases.depart,
      },
      0,
    );

    if (sourceIsVisible && source) {
      const fitTween = Flip.fit(frame, source, {
        scale: true,
        duration: 0.66,
        ease: motionEases.cinematic,
      });
      if (fitTween && "play" in fitTween) timeline.add(fitTween, 0);
    } else {
      timeline.to(
        frame,
        {
          scale: 0.985,
          autoAlpha: 0,
          duration: 0.46,
          ease: motionEases.depart,
        },
        0,
      );
    }

    timeline.to(viewer, {
      autoAlpha: 0,
      duration: 0.34,
      ease: motionEases.depart,
    }, 0.32);
  }, [onClose, selected.id]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const closeButton = viewer.querySelector<HTMLButtonElement>("[data-viewer-close]");
    closeButton?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((index) => (index + 1) % media.length);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((index) => (index - 1 + media.length) % media.length);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        viewer.querySelectorAll<HTMLElement>("button:not([disabled])"),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus({ preventScroll: true });
    };
  }, [closeViewer, media.length]);

  const selectMedia = (
    index: number,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    if (index === selectedIndex) return;
    pendingOriginRef.current = event.currentTarget;
    setSelectedIndex(index);
  };

  if (!selected) return null;

  return (
    <div
      ref={viewerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${selected.alt}. Image ${selectedIndex + 1} of ${media.length}.`}
      className={styles.viewer}
    >
      <button
        type="button"
        data-viewer-close
        onClick={closeViewer}
        className={styles.viewerClose}
      >
        Close
      </button>

      <div className={styles.viewerThumbnails} aria-label="Project image thumbnails">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-project-viewer-thumbnail
            aria-label={`Show image ${index + 1}: ${item.alt}`}
            aria-pressed={index === selectedIndex}
            onClick={(event) => selectMedia(index, event)}
            className={[
              styles.thumbnailButton,
              index === selectedIndex ? styles.thumbnailButtonActive : "",
            ].filter(Boolean).join(" ")}
            style={{ aspectRatio: item.aspectRatio }}
          >
            <img
              src={item.previewSrc}
              alt=""
              width={Math.min(item.width, 480)}
              height={Math.round(Math.min(item.width, 480) / item.aspectRatio)}
              loading="lazy"
              decoding="async"
              className={styles.thumbnailImage}
            />
          </button>
        ))}
      </div>

      <div className={styles.viewerStage}>
        <div
          ref={frameRef}
          className={styles.viewerFrame}
          style={{
            "--viewer-aspect": selected.aspectRatio,
            "--viewer-width": viewerWidth,
          } as CSSProperties}
        >
          <img
            key={selected.id}
            src={selected.src}
            alt={selected.alt}
            width={selected.width}
            height={selected.height}
            decoding="async"
            className={styles.viewerImage}
          />
        </div>
      </div>
    </div>
  );
}
