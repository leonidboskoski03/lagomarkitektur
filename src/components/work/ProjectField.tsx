import { useMemo, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { WorkProjectItem } from "../../hooks/useWorkProjects";
import { DirectionalShaderImage, type DirectionalMotion } from "./DirectionalShaderImage";

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

const FIELD_TILE_ASPECT = 1.4;

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

function createFieldPlacements(projects: WorkProjectItem[]) {
  const random = createRandom(hashSeed(projects.map((project) => project.id).join("|")) || 1809);
  const placements = new Array<FieldPlacement>(projects.length);
  const placed: FieldPlacement[] = [];
  const orderedProjects = projects
    .map((project, index) => ({ project, index, order: random() }))
    .sort((a, b) => a.project.image.aspectRatio - b.project.image.aspectRatio || a.order - b.order);

  orderedProjects.forEach(({ project, index }) => {
    const aspectRatio = Math.max(0.62, project.image.aspectRatio);
    const portrait = aspectRatio < 0.98;
    const panoramic = aspectRatio > 1.55;
    let width = portrait
      ? 14.4 + random() * 3.9
      : panoramic
        ? 21.2 + random() * 4.8
        : 17.8 + random() * 4.7;
    let placement: FieldPlacement | undefined;

    for (let attempt = 0; attempt < 9600 && !placement; attempt += 1) {
      if (attempt > 0 && attempt % 600 === 0) width *= 0.96;

      const height = width * FIELD_TILE_ASPECT / aspectRatio + 3.1;
      const candidate: FieldPlacement = {
        x: random() * 100,
        y: random() * 100,
        width,
        height,
      };
      const gapX = 0.55 + random() * 1.15;
      const gapY = 0.55 + random() * 1.45;

      if (!placementsIntersect(candidate, placed, gapX, gapY)) placement = candidate;
    }

    if (!placement) {
      const height = width * FIELD_TILE_ASPECT / aspectRatio + 3.1;
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
  projects: WorkProjectItem[];
  interactive: boolean;
  tileIndex: number;
  motionSignal: RefObject<DirectionalMotion>;
}

function FieldTile({ placements, projects, interactive, tileIndex, motionSignal }: FieldTileProps) {
  return (
    <div
      data-field-tile
      data-field-tile-index={tileIndex}
      className="absolute left-0 top-0 overflow-visible"
      aria-hidden={!interactive}
    >
      {projects.map((project, index) => {
        const placement = placements[index];

        return (
          <Link
            key={`${tileIndex}-${project.id}`}
            to={`/work/${project.slug}`}
            data-cursor="open"
            aria-label={interactive ? `View ${project.title}` : undefined}
            tabIndex={interactive ? 0 : -1}
            className="group absolute block select-none transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.012]"
            data-field-card
            draggable={false}
            style={{
              left: `${placement.x}%`,
              top: `${placement.y}%`,
              width: `${placement.width}%`,
            }}
          >
            <DirectionalShaderImage
              src={project.image.url}
              alt={interactive ? project.image.alt : ""}
              width={project.image.width}
              height={project.image.height}
              aspectRatio={project.image.aspectRatio}
              motionSignal={motionSignal}
            />

            <span className="mt-2.5 flex items-start justify-between gap-3 text-[0.56rem] uppercase leading-[1.15] tracking-[0.12em]">
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
  const motionSignalRef = useRef<DirectionalMotion>({ x: 0, y: 0, strength: 0 });
  const placements = useMemo(() => createFieldPlacements(projects), [projects]);

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
    const setPlaneX = gsap.quickSetter(plane, "x", "px");
    const setPlaneY = gsap.quickSetter(plane, "y", "px");

    const syncTarget = () => {
      target.x = Number(gsap.getProperty(proxy, "x")) || 0;
      target.y = Number(gsap.getProperty(proxy, "y")) || 0;
    };

    const sizeField = () => {
      const compactViewport = viewport.clientWidth < 768;
      metrics.width = Math.max(compactViewport ? 1040 : 1540, viewport.clientWidth * (compactViewport ? 2.65 : 1.16));
      metrics.height = Math.max(compactViewport ? 980 : 1080, viewport.clientHeight * (compactViewport ? 1.2 : 1.2));

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
        metrics.initialized = true;
      }

      setPlaneX(gsap.utils.wrap(-metrics.width, 0, visual.x));
      setPlaneY(gsap.utils.wrap(-metrics.height, 0, visual.y));
    };

    sizeField();

    const renderPlane = () => {
      const frameRatio = Math.max(0.25, gsap.ticker.deltaRatio(60));
      const previousX = visual.x;
      const previousY = visual.y;
      const smoothing = 1 - Math.pow(0.82, frameRatio);
      visual.x += (target.x - visual.x) * smoothing;
      visual.y += (target.y - visual.y) * smoothing;

      setPlaneX(gsap.utils.wrap(-metrics.width, 0, visual.x));
      setPlaneY(gsap.utils.wrap(-metrics.height, 0, visual.y));

      if (reduceMotion) {
        motionSignalRef.current.x = 0;
        motionSignalRef.current.y = 0;
        motionSignalRef.current.strength = 0;
        return;
      }

      const seconds = frameRatio / 60;
      const velocityX = (visual.x - previousX) / seconds;
      const velocityY = (visual.y - previousY) / seconds;
      const normalizedX = gsap.utils.clamp(-1, 1, velocityX / 360);
      const normalizedY = gsap.utils.clamp(-1, 1, velocityY / 360);
      motionSignalRef.current.x = normalizedX;
      motionSignalRef.current.y = normalizedY;
      motionSignalRef.current.strength = gsap.utils.clamp(
        0,
        0.9,
        Math.hypot(normalizedX, normalizedY) * 0.9,
      );
    };
    gsap.ticker.add(renderPlane);

    const draggable = Draggable.create(proxy, {
      trigger: viewport,
      type: "x,y",
      inertia: reduceMotion ? false : {
        resistance: 3200,
        duration: { min: 0.75, max: 2.2 },
      },
      dragClickables: true,
      allowContextMenu: true,
      minimumMovement: 4,
      onPress: () => viewport.setAttribute("data-field-dragging", "true"),
      dragResistance: 0.035,
      onDrag: syncTarget,
      onThrowUpdate: syncTarget,
      onRelease: () => viewport.removeAttribute("data-field-dragging"),
      onThrowComplete: () => viewport.removeAttribute("data-field-dragging"),
    })[0];

    const resizeObserver = new ResizeObserver(sizeField);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(renderPlane);
      draggable.kill();
      motionSignalRef.current = { x: 0, y: 0, strength: 0 };
    };
  }, { scope: fieldRef, dependencies: [projects] });

  return (
    <section
      ref={fieldRef}
      aria-label="Spatial project field"
      data-cursor="Drag"
      className="relative h-[100svh] min-h-[42rem] touch-none overflow-hidden bg-bg select-none data-[field-dragging=true]:cursor-grabbing"
    >
      <div ref={proxyRef} className="pointer-events-none absolute left-0 top-0 h-px w-px" aria-hidden="true" />
      <div ref={planeRef} data-field-plane className="absolute left-0 top-0 will-change-transform">
        {Array.from({ length: 4 }, (_, index) => (
          <FieldTile
            key={index}
            placements={placements}
            projects={projects}
            interactive={index === 0}
            tileIndex={index}
            motionSignal={motionSignalRef}
          />
        ))}
      </div>

    </section>
  );
}
