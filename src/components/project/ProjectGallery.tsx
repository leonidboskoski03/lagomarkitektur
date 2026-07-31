import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { flushSync } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEases } from "../../lib/motion";
import type { ProjectGalleryMedia } from "../../types/project";
import styles from "./ProjectDetail.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { siteCopy } from "../../i18n/siteCopy";
import {
  ProjectGalleryModeRail,
  type ProjectGalleryMode,
} from "./ProjectGalleryModeRail";

gsap.registerPlugin(Draggable, Flip, InertiaPlugin, ScrollTrigger, useGSAP);

interface ProjectGalleryProps {
  projectTitle: string;
  media: ProjectGalleryMedia[];
}

export function ProjectGallery({ projectTitle, media }: ProjectGalleryProps) {
  const { language } = useLanguage();
  const copy = siteCopy[language].project;
  const shellRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const [mode, setMode] = useState<ProjectGalleryMode>("story");
  const [railVisible, setRailVisible] = useState(false);
  const mosaicRows = Array.from(
    { length: Math.ceil(media.length / 2) },
    (_, rowIndex) => media
      .slice(rowIndex * 2, rowIndex * 2 + 2)
      .map((item, itemIndex) => ({
        item,
        index: rowIndex * 2 + itemIndex,
      })),
  );

  useGSAP(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const figures = gsap.utils.toArray<HTMLElement>(
      "[data-project-media]",
      shell,
    );
    const images = gsap.utils.toArray<HTMLImageElement>(
      "[data-project-media-image]",
      shell,
    );
    const reveals = gsap.utils.toArray<HTMLElement>(
      "[data-project-media-reveal]",
      shell,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(images, { clearProps: "transform" });
      gsap.set(reveals, { autoAlpha: 0 });
      reveals.forEach((reveal) => {
        reveal.dataset.revealed = "true";
      });
      return;
    }

    if (mode !== "story") {
      gsap.set(images, { clearProps: "transform" });
      gsap.set(reveals, { autoAlpha: 0 });
      return;
    }

    const pendingReveals = reveals.filter(
      (reveal) => reveal.dataset.revealed !== "true",
    );
    const completedReveals = reveals.filter(
      (reveal) => reveal.dataset.revealed === "true",
    );

    if (completedReveals.length > 0) {
      gsap.set(completedReveals, { autoAlpha: 0 });
    }
    if (pendingReveals.length > 0) {
      gsap.set(pendingReveals, { autoAlpha: 1 });
    }

    const loadCleanups: Array<() => void> = [];

    if (pendingReveals.length > 0) {
      ScrollTrigger.batch(pendingReveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((revealElement, index) => {
            const reveal = revealElement as HTMLElement;
            const frame = reveal.parentElement;
            const image = frame?.querySelector<HTMLImageElement>(
              "[data-project-media-image]",
            );
            const revealTween = gsap.to(reveal, {
              autoAlpha: 0,
              duration: 0.72,
              delay: index * 0.055,
              ease: motionEases.reveal,
              overwrite: "auto",
              paused: true,
              onComplete: () => {
                reveal.dataset.revealed = "true";
              },
            });
            const revealImage = () => revealTween.play();

            if (image?.complete && image.naturalWidth > 0) {
              revealImage();
              return;
            }

            if (image) {
              image.addEventListener("load", revealImage, { once: true });
              loadCleanups.push(() => image.removeEventListener("load", revealImage));
            }
          });
        },
      });
    }

    figures.forEach((figure) => {
      const image = figure.querySelector<HTMLImageElement>(
        "[data-project-media-image]",
      );
      if (!image) return;

      gsap.fromTo(
        image,
        {
          y: 40,
        },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "clamp(top bottom)",
            end: "clamp(bottom top)",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      loadCleanups.forEach((cleanup) => cleanup());
    };
  }, {
    scope: shellRef,
    dependencies: [media, mode],
    revertOnUpdate: true,
  });

  useGSAP(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const trigger = ScrollTrigger.create({
      trigger: shell,
      start: "top 72%",
      end: "bottom 50%",
      onEnter: () => setRailVisible(true),
      onEnterBack: () => setRailVisible(true),
      onLeave: () => setRailVisible(false),
      onLeaveBack: () => setRailVisible(false),
    });

    return () => trigger.kill();
  }, { scope: shellRef, dependencies: [mode], revertOnUpdate: true });

  useGSAP(() => {
    const list = listRef.current;
    if (!list || mode !== "rail") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dragProxy = document.createElement("div");
    dragProxy.setAttribute("aria-hidden", "true");

    const syncScroll = function (this: Draggable) {
      list.scrollLeft = -this.x;
    };
    const [draggable] = Draggable.create(dragProxy, {
      trigger: list,
      type: "x",
      inertia: !reduceMotion,
      cursor: "none",
      activeCursor: "none",
      edgeResistance: 0.88,
      dragResistance: 0.04,
      minimumMovement: 4,
      minDuration: 0.24,
      maxDuration: 0.82,
      allowNativeTouchScrolling: false,
      dragClickables: true,
      onPress: function () {
        const maximum = Math.max(0, list.scrollWidth - list.clientWidth);

        gsap.killTweensOf(dragProxy);
        gsap.set(dragProxy, { x: -list.scrollLeft });
        this.applyBounds({ minX: -maximum, maxX: 0 });
        this.update(true);
      },
      onDrag: syncScroll,
      onThrowUpdate: syncScroll,
    });

    return () => {
      draggable?.kill();
      gsap.killTweensOf(dragProxy);
    };
  }, {
    scope: shellRef,
    dependencies: [mode, media.length],
    revertOnUpdate: true,
  });

  const changeMode = useCallback((nextMode: ProjectGalleryMode) => {
    if (nextMode === mode) return;

    const stage = stageRef.current;
    const shell = shellRef.current;
    const list = listRef.current;
    if (!stage) {
      setMode(nextMode);
      return;
    }

    transitionRef.current?.progress(1).kill();
    transitionRef.current = null;

    const figures = gsap.utils.toArray<HTMLElement>(
      "[data-project-media]",
      shell,
    );
    const images = gsap.utils.toArray<HTMLImageElement>(
      "[data-project-media-image]",
      shell,
    );
    const reveals = gsap.utils.toArray<HTMLElement>(
      "[data-project-media-reveal]",
      shell,
    );
    const captions = gsap.utils.toArray<HTMLElement>(
      "[data-project-media-caption]",
      shell,
    );
    const veil = stage.querySelector<HTMLElement>(
      "[data-gallery-transition-veil]",
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const flipState = reduceMotion || figures.length === 0
      ? null
      : Flip.getState(figures, { props: "opacity" });

    reveals.forEach((reveal) => {
      reveal.dataset.revealed = "true";
    });

    flushSync(() => {
      setMode(nextMode);
    });

    setRailVisible(true);

    if (nextMode === "rail" && list) {
      list.scrollLeft = 0;
    }

    if (!flipState || reduceMotion) {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    stage.style.pointerEvents = "none";
    gsap.set(figures, { willChange: "transform, opacity" });
    gsap.set(images, { willChange: "transform, opacity" });

    const transition = Flip.from(flipState, {
      duration: 1.16,
      ease: motionEases.cinematic,
      nested: true,
      scale: true,
      stagger: {
        amount: 0.18,
        from: nextMode === "mosaic"
          ? "center"
          : nextMode === "rail"
            ? "start"
            : "edges",
      },
    });

    const finishTransition = () => {
      stage.style.pointerEvents = "";
      gsap.set(figures, { clearProps: "willChange" });
      gsap.set(images, {
        clearProps: "scale,opacity,visibility,willChange",
      });
      if (veil) gsap.set(veil, { autoAlpha: 0 });
      if (transitionRef.current === transition) {
        transitionRef.current = null;
      }
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    transition
      .fromTo(
        images,
        {
          autoAlpha: 0.76,
          scale: 1.045,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.04,
          stagger: {
            amount: 0.14,
            from: nextMode === "rail" ? "start" : "center",
          },
          ease: motionEases.enter,
        },
        0.04,
      );

    if (veil) {
      transition
        .fromTo(
          veil,
          { autoAlpha: 0 },
          {
            autoAlpha: 0.12,
            duration: 0.2,
            ease: motionEases.depart,
          },
          0,
        )
        .to(
          veil,
          {
            autoAlpha: 0,
            duration: 0.7,
            ease: motionEases.enter,
          },
          0.2,
        );
    }

    if (nextMode === "story") {
      transition.fromTo(
        captions,
        {
          autoAlpha: 0,
          y: 8,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.04,
          ease: motionEases.enter,
        },
        0.42,
      );
    }

    transition.eventCallback("onComplete", finishTransition);
    transition.eventCallback("onInterrupt", finishTransition);
    transitionRef.current = transition;
  }, [mode]);

  useEffect(() => () => {
    transitionRef.current?.kill();
  }, []);

  useEffect(() => {
    if (mode === "story") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      changeMode("story");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeMode, mode]);

  if (media.length === 0) return null;

  return (
    <section
      ref={shellRef}
      aria-labelledby="project-gallery-heading"
      className={styles.galleryShell}
    >
      <h2 id="project-gallery-heading" className="sr-only">
        {projectTitle} {copy.gallery}
      </h2>

      <div
        ref={stageRef}
        data-mode={mode}
        className={styles.galleryStage}
      >
        <div
          ref={listRef}
          data-cursor={mode === "rail" ? "drag" : undefined}
          aria-label={mode === "rail" ? `${projectTitle} ${copy.draggableRail}` : undefined}
          role={mode === "rail" ? "region" : undefined}
          className={styles.mediaList}
        >
          {mosaicRows.map((row) => (
            <div
              key={`mosaic-row-${row[0].item.id}`}
              data-mosaic-count={row.length}
              className={styles.mosaicRow}
              style={{
                "--mosaic-columns": row
                  .map(({ item }) => `${item.aspectRatio}fr`)
                  .join(" "),
              } as CSSProperties}
            >
              {row.map(({ item, index }) => (
                <div
                  key={item.id}
                  data-project-media
                  data-project-media-id={item.id}
                  data-mosaic-sequence={index % 3}
                  className={[
                    styles.mediaFigure,
                    styles[item.storyPlacement],
                  ].join(" ")}
                  style={{
                    "--media-aspect": item.aspectRatio,
                  } as CSSProperties}
                >
                  <figure>
                    <div className={styles.mediaFrame}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        data-project-media-image
                        sizes={
                          mode === "rail"
                            ? "70vh"
                            : mode === "mosaic"
                              ? "(max-width: 640px) 92vw, 48vw"
                              : "(max-width: 640px) 88vw, 66vw"
                        }
                        className={styles.mediaImage}
                      />
                      <span
                        aria-hidden="true"
                        data-project-media-reveal
                        className={styles.mediaReveal}
                      />
                    </div>
                    <figcaption
                      data-project-media-caption
                      className={styles.caption}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.caption ?? projectTitle}</span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          ))}
        </div>
        <span
          aria-hidden="true"
          data-gallery-transition-veil
          className={styles.galleryTransitionVeil}
        />
      </div>

      <ProjectGalleryModeRail
        mode={mode}
        visible={railVisible}
        onChange={changeMode}
      />
    </section>
  );
}
