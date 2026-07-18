import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { WorkProjectImage, WorkProjectItem } from "../../hooks/useWorkProjects";
import { DirectionalShaderImage } from "./DirectionalShaderImage";
import { DirectionalShaderStage, type DirectionalMotion } from "./DirectionalShaderStage";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface ProjectFieldProps {
  projects: WorkProjectItem[];
}

interface FieldPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FieldEntry {
  id: string;
  project: WorkProjectItem;
  image: WorkProjectImage;
  atlasIndex: number;
}

const FIELD_TILE_ASPECT = 1.4;
const FIELD_IMAGES_PER_PROJECT = 5;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function placementsIntersect(candidate: FieldPlacement, placed: FieldPlacement[], gapX: number, gapY: number) {
  return placed.some((item) => [-100, 0, 100].some((offsetX) => (
    [-100, 0, 100].some((offsetY) => {
      const shiftedX = item.x + offsetX;
      const shiftedY = item.y + offsetY;
      return candidate.x < shiftedX + item.width + gapX
        && candidate.x + candidate.width + gapX > shiftedX
        && candidate.y < shiftedY + item.height + gapY
        && candidate.y + candidate.height + gapY > shiftedY;
    })
  )));
}

function createFieldEntries(projects: WorkProjectItem[]) {
  const entries: FieldEntry[] = [];
  const random = createRandom(hashSeed(projects.map((project) => project.id).join("|gallery")) || 2417);
  const projectOrder = projects
    .map((project) => ({ project, order: random() }))
    .sort((first, second) => first.order - second.order)
    .map(({ project }) => project);
  for (let atlasDepth = 0; atlasDepth < FIELD_IMAGES_PER_PROJECT; atlasDepth += 1) {
    for (const project of projectOrder) {
      const image = project.atlasImages[atlasDepth];
      if (!image) continue;

      entries.push({
        id: `${project.id}:atlas:${atlasDepth}`,
        project,
        image,
        atlasIndex: atlasDepth,
      });
    }

  }

  return entries;
}

function createFieldPlacements(entries: FieldEntry[]) {
  const random = createRandom(hashSeed(entries.map((entry) => entry.id).join("|")) || 1809);
  const placements = new Array<FieldPlacement>(entries.length);
  const placed: FieldPlacement[] = [];
  const densityScale = gsap.utils.clamp(0.34, 1, Math.sqrt(8 / Math.max(8, entries.length)));
  const sizedEntries = entries.map((entry, index) => {
    const aspectRatio = Math.max(0.62, entry.image.aspectRatio);
    const portrait = aspectRatio < 0.98;
    const panoramic = aspectRatio > 1.55;
    const sizeRole = random();
    let baseWidth: number;

    if (sizeRole < 0.22) {
      baseWidth = portrait ? 9.5 + random() * 3.2 : 11 + random() * 4.2;
    } else if (sizeRole > 0.84) {
      baseWidth = portrait
        ? 22 + random() * 6
        : panoramic
          ? 31 + random() * 8
          : 27 + random() * 8;
    } else {
      baseWidth = portrait
        ? 15 + random() * 5
        : panoramic
          ? 21 + random() * 7
          : 18 + random() * 7;
    }

    if (entry.atlasIndex === 0 && random() > 0.58) baseWidth *= 1.18;
    const width = baseWidth * densityScale;
    const height = width * FIELD_TILE_ASPECT / aspectRatio + 2.15;

    return {
      entry,
      index,
      aspectRatio,
      width,
      height,
      order: random(),
    };
  }).sort((first, second) => (
    second.width * second.height - first.width * first.height || first.order - second.order
  ));

  sizedEntries.forEach(({ index, aspectRatio, width: initialWidth }) => {
    let width = initialWidth;
    let placement: FieldPlacement | undefined;

    for (let attempt = 0; attempt < 7200 && !placement; attempt += 1) {
      if (attempt > 0 && attempt % 450 === 0) width *= 0.95;

      const height = width * FIELD_TILE_ASPECT / aspectRatio + 2.15;
      const candidate: FieldPlacement = {
        x: random() * 100,
        y: random() * 100,
        width,
        height,
      };
      const gapFade = Math.max(0.45, 1 - attempt / 7200);
      const gapX = (0.35 + random() * 1.25) * gapFade;
      const gapY = (0.42 + random() * 1.55) * gapFade;

      if (!placementsIntersect(candidate, placed, gapX, gapY)) placement = candidate;
    }

    if (!placement) {
      const height = width * FIELD_TILE_ASPECT / aspectRatio + 2.15;
      placement = {
        x: random() * 100,
        y: random() * 100,
        width,
        height,
      };
    }

    placements[index] = placement;
    placed.push(placement);
  });

  return placements;
}

interface FieldTileProps {
  placements: FieldPlacement[];
  entries: FieldEntry[];
  interactive: boolean;
  tileIndex: number;
}

function FieldTile({
  placements,
  entries,
  interactive,
  tileIndex,
}: FieldTileProps) {
  return (
    <div
      data-field-tile
      data-field-tile-index={tileIndex}
      className="absolute left-0 top-0 overflow-visible"
      aria-hidden={!interactive}
    >
      {entries.map((entry, index) => {
        const placement = placements[index];
        const { project, image, atlasIndex } = entry;
        const instanceId = `${tileIndex}-${entry.id}`;

        return (
          <Link
            key={instanceId}
            to={`/work/${project.slug}`}
            data-cursor="open"
            aria-label={interactive ? `View ${project.title}` : undefined}
            tabIndex={interactive ? 0 : -1}
            className="group absolute block select-none [contain:layout_paint_style]"
            data-field-card
            data-field-instance-id={instanceId}
            data-field-project-id={project.id}
            draggable={false}
            style={{
              left: `${placement.x}%`,
              top: `${placement.y}%`,
              width: `${placement.width}%`,
            }}
          >
            <span
              data-mode-project={atlasIndex === 0 ? project.id : undefined}
              data-mode-project-image={atlasIndex === 0 ? "" : undefined}
              data-transition-image={atlasIndex === 0
                ? `${project.id}:cover`
                : `${project.id}:atlas:${atlasIndex}`}
              className="block"
            >
              <DirectionalShaderImage
                src={image.atlasUrl || image.previewUrl || image.url}
                alt={interactive ? image.alt : ""}
                width={image.width}
                height={image.height}
                aspectRatio={image.aspectRatio}
              />
            </span>

            <span
              data-field-caption
              className="mt-2.5 flex items-start justify-between gap-3 text-[0.56rem] uppercase leading-[1.15] tracking-[0.12em]"
            >
              <span className="max-w-[75%]">{project.title}</span>
              <span className="text-text-muted">{project.year}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ProjectField({ projects }: ProjectFieldProps) {
  const fieldRef = useRef<HTMLElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const motionSignalRef = useRef<DirectionalMotion>({ x: 0, y: 0, strength: 0, active: false });
  const draggingRef = useRef(false);
  const entries = useMemo(() => createFieldEntries(projects), [projects]);
  const placements = useMemo(() => createFieldPlacements(entries), [entries]);

  useGSAP(() => {
    const viewport = fieldRef.current;
    const plane = planeRef.current;
    const proxy = proxyRef.current;
    if (!viewport || !plane || !proxy) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = gsap.utils.toArray<HTMLElement>("[data-field-tile]", plane);
    const metrics = { width: 1540, height: 1080, initialized: false };
    const target = { x: 0, y: 0 };
    const visual = { x: 0, y: 0 };
    const shaderProbe = { x: 0, y: 0 };
    const setPlaneX = gsap.quickSetter(plane, "x", "px");
    const setPlaneY = gsap.quickSetter(plane, "y", "px");

    const syncTarget = () => {
      target.x = Number(gsap.getProperty(proxy, "x")) || 0;
      target.y = Number(gsap.getProperty(proxy, "y")) || 0;
    };

    const sizeField = () => {
      const compactViewport = viewport.clientWidth < 768;
      const densityFactor = Math.sqrt(Math.max(1, entries.length / 10));
      metrics.width = Math.max(
        (compactViewport ? 1040 : 1540) * densityFactor,
        viewport.clientWidth * (compactViewport ? 3.25 : 1.55),
      );
      metrics.height = Math.max(
        (compactViewport ? 980 : 1080) * densityFactor,
        viewport.clientHeight * (compactViewport ? 1.65 : 1.5),
      );

      gsap.set(plane, {
        width: metrics.width * 2,
        height: metrics.height * 2,
      });

      tiles.forEach((tile, index) => {
        gsap.set(tile, {
          width: metrics.width,
          height: metrics.height,
          x: index % 2 === 0 ? 0 : metrics.width,
          y: index < 2 ? 0 : metrics.height,
        });
      });

      if (!metrics.initialized) {
        gsap.set(proxy, { x: -metrics.width * 0.24, y: -metrics.height * 0.28 });
        syncTarget();
        visual.x = target.x;
        visual.y = target.y;
        shaderProbe.x = target.x;
        shaderProbe.y = target.y;
        metrics.initialized = true;
      }

      setPlaneX(gsap.utils.wrap(-metrics.width, 0, visual.x));
      setPlaneY(gsap.utils.wrap(-metrics.height, 0, visual.y));
    };

    sizeField();

    const renderPlane = () => {
      const frameRatio = Math.max(0.25, gsap.ticker.deltaRatio(60));
      const smoothing = 1 - Math.pow(draggingRef.current ? 0.9 : 0.93, frameRatio);
      visual.x += (target.x - visual.x) * smoothing;
      visual.y += (target.y - visual.y) * smoothing;

      setPlaneX(gsap.utils.wrap(-metrics.width, 0, visual.x));
      setPlaneY(gsap.utils.wrap(-metrics.height, 0, visual.y));

      if (reduceMotion) {
        motionSignalRef.current.x = 0;
        motionSignalRef.current.y = 0;
        motionSignalRef.current.strength = 0;
        motionSignalRef.current.active = false;
        return;
      }

      const previousShaderX = shaderProbe.x;
      const previousShaderY = shaderProbe.y;
      const originalShaderSmoothing = 1 - Math.pow(0.82, frameRatio);
      shaderProbe.x += (target.x - shaderProbe.x) * originalShaderSmoothing;
      shaderProbe.y += (target.y - shaderProbe.y) * originalShaderSmoothing;

      const seconds = frameRatio / 60;
      const velocityX = (shaderProbe.x - previousShaderX) / seconds;
      const velocityY = (shaderProbe.y - previousShaderY) / seconds;
      const normalizedX = gsap.utils.clamp(-1, 1, velocityX / 360);
      const normalizedY = gsap.utils.clamp(-1, 1, velocityY / 360);
      motionSignalRef.current.x = normalizedX;
      motionSignalRef.current.y = normalizedY;
      motionSignalRef.current.strength = gsap.utils.clamp(
        0,
        0.9,
        Math.hypot(normalizedX, normalizedY) * 0.9,
      );
      motionSignalRef.current.active = draggingRef.current
        || Math.abs(target.x - visual.x) > 0.04
        || Math.abs(target.y - visual.y) > 0.04
        || motionSignalRef.current.strength > 0.0005;
    };
    gsap.ticker.add(renderPlane);

    const draggable = Draggable.create(proxy, {
      trigger: viewport,
      type: "x,y",
      inertia: reduceMotion ? false : {
        resistance: 1450,
        duration: { min: 1.15, max: 3.6 },
      },
      dragClickables: true,
      allowContextMenu: true,
      minimumMovement: 2,
      onPress: () => {
        draggingRef.current = true;
        viewport.setAttribute("data-field-dragging", "true");
      },
      dragResistance: 0.012,
      onDrag: syncTarget,
      onThrowUpdate: syncTarget,
      onRelease: () => {
        draggingRef.current = false;
        viewport.removeAttribute("data-field-dragging");
      },
      onThrowComplete: () => {
        draggingRef.current = false;
        viewport.removeAttribute("data-field-dragging");
      },
    })[0];

    const resizeObserver = new ResizeObserver(sizeField);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(renderPlane);
      draggable.kill();
      motionSignalRef.current = { x: 0, y: 0, strength: 0, active: false };
    };
  }, { scope: fieldRef, dependencies: [entries] });

  return (
    <section
      ref={fieldRef}
      aria-label="Spatial project field"
      data-cursor="Drag"
      className="relative h-[100svh] min-h-[42rem] touch-none overflow-hidden bg-bg select-none data-[field-dragging=true]:cursor-grabbing"
    >
      <DirectionalShaderStage motionSignal={motionSignalRef} viewportRef={fieldRef}>
        <div ref={proxyRef} className="pointer-events-none absolute left-0 top-0 h-px w-px" aria-hidden="true" />
        <div ref={planeRef} data-field-plane className="absolute left-0 top-0 z-[2] will-change-transform">
          {Array.from({ length: 4 }, (_, index) => (
            <FieldTile
              key={index}
              placements={placements}
              entries={entries}
              interactive={index === 0}
              tileIndex={index}
            />
          ))}
        </div>
      </DirectionalShaderStage>

    </section>
  );
}
