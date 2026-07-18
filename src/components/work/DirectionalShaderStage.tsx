import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import type {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
import {
  DirectionalShaderContext,
  type DirectionalShaderSurfaceRegistration,
  type RegisterDirectionalShaderSurface,
} from "./directionalShaderContext";

export interface DirectionalMotion {
  x: number;
  y: number;
  strength: number;
  active: boolean;
}

interface DirectionalShaderStageProps {
  children: ReactNode;
  motionSignal: RefObject<DirectionalMotion>;
  viewportRef: RefObject<HTMLElement | null>;
}

interface TextureResource {
  src: string;
  texture: Texture;
  width: number;
  height: number;
  references: number;
  disposeTimer: number;
}

interface ActiveSurface {
  scene: Scene;
  camera: OrthographicCamera;
  material: ShaderMaterial;
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  velocity: Vector2;
  strength: number;
  textureResource: TextureResource;
  revealed: boolean;
}

interface SurfaceRecord extends DirectionalShaderSurfaceRegistration {
  visible: boolean;
  registered: boolean;
  activating: boolean;
  activationVersion: number;
  releaseTimer: number;
  activeSurface?: ActiveSurface;
}

interface StageController {
  add: (record: SurfaceRecord) => void;
  remove: (record: SurfaceRecord) => void;
}

type ThreeModule = typeof import("three");

const MAX_ACTIVE_SHADER_SURFACES = 15;
const SHADER_ACTIVE_MARGIN = "14%";
const SHADER_PREFETCH_MARGIN = "48%";
const SHADER_RELEASE_DELAY_MS = 120;
const TEXTURE_RELEASE_DELAY_MS = 3200;

const vertexShader = `
  uniform vec2 uVelocity;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;

    float centeredX = uv.x - 0.5;
    float centeredY = uv.y - 0.5;
    float response = 0.34 + uStrength * 0.36;
    float horizontalPull = uVelocity.x * response;
    float verticalPull = uVelocity.y * response;

    transformed.x += centeredY * horizontalPull * 0.24;
    transformed.y -= centeredX * verticalPull * 0.2;
    transformed.x += centeredX * abs(horizontalPull) * 0.045;
    transformed.y += centeredY * abs(verticalPull) * 0.036;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 textureSize, vec2 resolution) {
    float textureAspect = textureSize.x / textureSize.y;
    float planeAspect = resolution.x / resolution.y;
    vec2 ratio = vec2(
      min(planeAspect / textureAspect, 1.0),
      min(textureAspect / planeAspect, 1.0)
    );
    return (uv - 0.5) * ratio + 0.5;
  }

  void main() {
    vec2 imageUv = coverUv(vUv, uTextureSize, uResolution);
    imageUv = clamp(imageUv, vec2(0.002), vec2(0.998));
    gl_FragColor = texture2D(uTexture, imageUv);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function scheduleIdleTask(callback: () => void) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (task: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    const idleId = idleWindow.requestIdleCallback(callback, { timeout: 700 });
    return () => idleWindow.cancelIdleCallback?.(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 32);
  return () => globalThis.clearTimeout(timeoutId);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.fetchPriority = "low";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load shader texture: ${src}`));
    image.src = src;
  });
}

export function DirectionalShaderStage({
  children,
  motionSignal,
  viewportRef,
}: DirectionalShaderStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordsRef = useRef(new Map<HTMLElement, SurfaceRecord>());
  const controllerRef = useRef<StageController | null>(null);

  const registerSurface = useCallback<RegisterDirectionalShaderSurface>((registration) => {
    const existing = recordsRef.current.get(registration.host);
    if (existing) controllerRef.current?.remove(existing);

    const record: SurfaceRecord = {
      ...registration,
      visible: false,
      registered: true,
      activating: false,
      activationVersion: 0,
      releaseTimer: 0,
    };

    recordsRef.current.set(record.host, record);
    controllerRef.current?.add(record);

    return () => {
      record.registered = false;
      record.activationVersion += 1;
      controllerRef.current?.remove(record);
      recordsRef.current.delete(record.host);
      record.host.removeAttribute("data-shader-ready");
      record.fallback.style.opacity = "1";
    };
  }, []);

  const contextValue = useMemo(() => registerSurface, [registerSurface]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    const records = recordsRef.current;
    if (!canvas || !viewport || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let sharedGeometry: PlaneGeometry | undefined;
    let warmMaterial: ShaderMaterial | undefined;
    let warmTexture: Texture | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let prefetchObserver: IntersectionObserver | undefined;
    let activeObserver: IntersectionObserver | undefined;
    let activationFrame = 0;
    let activeSurfaceCount = 0;
    let needsRender = true;
    let cleanupRenderLoop: (() => void) | undefined;
    const pendingActivations = new Set<SurfaceRecord>();
    const texturePromises = new Map<string, Promise<TextureResource>>();
    const cancelIdleTasks = new Set<() => void>();

    const markDirty = () => {
      needsRender = true;
    };

    const releaseTexture = (resource: TextureResource) => {
      resource.references = Math.max(0, resource.references - 1);
      if (resource.references > 0 || disposed) return;

      window.clearTimeout(resource.disposeTimer);
      resource.disposeTimer = window.setTimeout(() => {
        if (resource.references > 0 || disposed) return;
        resource.texture.dispose();
        texturePromises.delete(resource.src);
      }, TEXTURE_RELEASE_DELAY_MS);
    };

    const acquireTexture = (resource: TextureResource) => {
      window.clearTimeout(resource.disposeTimer);
      resource.references += 1;
      return resource;
    };

    async function ensureTexture(THREE: ThreeModule, record: SurfaceRecord) {
      const cachedTexture = texturePromises.get(record.src);
      if (cachedTexture) return cachedTexture;

      const texturePromise = loadImage(record.src).then((image) => {
        if (disposed) throw new Error("Shader stage was disposed before the texture loaded.");

        const texture = new THREE.Texture(image);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        const resource: TextureResource = {
          src: record.src,
          texture,
          width: image.naturalWidth || 1,
          height: image.naturalHeight || 1,
          references: 0,
          disposeTimer: 0,
        };
        releaseTexture(resource);

        const cancelIdleTask = scheduleIdleTask(() => {
          cancelIdleTasks.delete(cancelIdleTask);
          if (!disposed && renderer) renderer.initTexture(texture);
        });
        cancelIdleTasks.add(cancelIdleTask);

        return resource;
      }).catch((error) => {
        texturePromises.delete(record.src);
        throw error;
      });

      texturePromises.set(record.src, texturePromise);
      return texturePromise;
    }

    const deactivateSurface = (record: SurfaceRecord) => {
      const activeSurface = record.activeSurface;
      if (!activeSurface) return;

      record.activeSurface = undefined;
      record.host.removeAttribute("data-shader-ready");
      record.fallback.style.opacity = "1";
      activeSurface.material.dispose();
      activeSurface.scene.clear();
      releaseTexture(activeSurface.textureResource);
      activeSurfaceCount = Math.max(0, activeSurfaceCount - 1);
      markDirty();
    };

    const chooseNextSurface = () => {
      const viewportRect = viewport.getBoundingClientRect();
      const centerX = viewportRect.left + viewportRect.width * 0.5;
      const centerY = viewportRect.top + viewportRect.height * 0.5;
      let nextRecord: SurfaceRecord | undefined;
      let nextDistance = Number.POSITIVE_INFINITY;

      pendingActivations.forEach((record) => {
        if (!record.registered || !record.visible || record.activating || record.activeSurface) {
          pendingActivations.delete(record);
          return;
        }

        const rect = record.host.getBoundingClientRect();
        const distance = Math.hypot(
          rect.left + rect.width * 0.5 - centerX,
          rect.top + rect.height * 0.5 - centerY,
        );
        if (distance < nextDistance) {
          nextRecord = record;
          nextDistance = distance;
        }
      });

      return nextRecord;
    };

    const scheduleActivation = () => {
      if (activationFrame || disposed || activeSurfaceCount >= MAX_ACTIVE_SHADER_SURFACES) return;

      activationFrame = window.requestAnimationFrame(() => {
        activationFrame = 0;
        const record = chooseNextSurface();
        if (!record || !renderer || !sharedGeometry) return;

        pendingActivations.delete(record);
        record.activating = true;
        activeSurfaceCount += 1;
        const activationVersion = ++record.activationVersion;

        void (async () => {
          try {
            const THREE = await import("three");
            const textureResource = await ensureTexture(THREE, record);
            if (
              disposed
              || !record.registered
              || !record.visible
              || activationVersion !== record.activationVersion
            ) {
              record.activating = false;
              activeSurfaceCount = Math.max(0, activeSurfaceCount - 1);
              return;
            }

            acquireTexture(textureResource);
            const signal = motionSignal.current;
            const uniforms = {
              uTexture: { value: textureResource.texture },
              uTextureSize: { value: new THREE.Vector2(textureResource.width, textureResource.height) },
              uResolution: { value: new THREE.Vector2(1, 1) },
              uVelocity: { value: new THREE.Vector2(signal.x, signal.y) },
              uStrength: { value: signal.strength },
            };
            const material = new THREE.ShaderMaterial({
              uniforms,
              vertexShader,
              fragmentShader,
              depthTest: false,
              depthWrite: false,
              transparent: true,
            });
            const mesh = new THREE.Mesh(sharedGeometry, material);
            const scene = new THREE.Scene();
            scene.add(mesh);
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
            camera.position.z = 2;

            record.activeSurface = {
              scene,
              camera,
              material,
              mesh,
              velocity: new THREE.Vector2(signal.x, signal.y),
              strength: signal.strength,
              textureResource,
              revealed: false,
            };
            record.activating = false;
            markDirty();
          } catch {
            record.activating = false;
            activeSurfaceCount = Math.max(0, activeSurfaceCount - 1);
          } finally {
            scheduleActivation();
          }
        })();

        scheduleActivation();
      });
    };

    const queueActivation = (record: SurfaceRecord) => {
      if (!record.registered || record.activeSurface || record.activating) return;
      pendingActivations.add(record);
      scheduleActivation();
    };

    function addRecord(record: SurfaceRecord) {
      prefetchObserver?.observe(record.host);
      activeObserver?.observe(record.host);
    }

    function removeRecord(record: SurfaceRecord) {
      window.clearTimeout(record.releaseTimer);
      pendingActivations.delete(record);
      prefetchObserver?.unobserve(record.host);
      activeObserver?.unobserve(record.host);
      record.visible = false;
      record.activationVersion += 1;
      deactivateSurface(record);
      scheduleActivation();
    }

    controllerRef.current = { add: addRecord, remove: removeRecord };

    void (async () => {
      const THREE = await import("three");
      if (disposed) return;

      THREE.Cache.enabled = true;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.1));
      renderer.autoClear = false;

      sharedGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
      warmTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
      warmTexture.needsUpdate = true;
      warmMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: warmTexture },
          uTextureSize: { value: new THREE.Vector2(1, 1) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
          uStrength: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
      });
      const warmScene = new THREE.Scene();
      const warmCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      warmCamera.position.z = 2;
      warmScene.add(new THREE.Mesh(sharedGeometry, warmMaterial));
      renderer.compile(warmScene, warmCamera);

      const resizeRenderer = () => {
        if (!renderer) return;
        renderer.setSize(Math.max(1, viewport.clientWidth), Math.max(1, viewport.clientHeight), false);
        markDirty();
      };
      resizeRenderer();
      resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(viewport);

      prefetchObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const record = recordsRef.current.get(entry.target as HTMLElement);
          if (record) void ensureTexture(THREE, record).catch(() => undefined);
        });
      }, { root: viewport, rootMargin: SHADER_PREFETCH_MARGIN });

      activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const record = recordsRef.current.get(entry.target as HTMLElement);
          if (!record) return;

          record.visible = entry.isIntersecting;
          window.clearTimeout(record.releaseTimer);
          if (record.visible) {
            queueActivation(record);
          } else {
            pendingActivations.delete(record);
            record.activationVersion += 1;
            record.releaseTimer = window.setTimeout(() => {
              deactivateSurface(record);
              scheduleActivation();
            }, SHADER_RELEASE_DELAY_MS);
          }
        });
      }, { root: viewport, rootMargin: SHADER_ACTIVE_MARGIN });

      recordsRef.current.forEach(addRecord);

      const renderStage = () => {
        const activeRenderer = renderer;
        if (!activeRenderer || !sharedGeometry) return;
        const signal = motionSignal.current;
        const frameRatio = Math.max(0.25, gsap.ticker.deltaRatio(60));
        const velocityEase = 1 - Math.pow(0.88, frameRatio);
        const strengthEase = 1 - Math.pow(0.9, frameRatio);
        let surfacesSettling = false;

        recordsRef.current.forEach((record) => {
          const surface = record.activeSurface;
          if (!surface) return;

          surface.velocity.x += (signal.x - surface.velocity.x) * velocityEase;
          surface.velocity.y += (signal.y - surface.velocity.y) * velocityEase;
          surface.strength += (signal.strength - surface.strength) * strengthEase;
          if (Math.abs(signal.x) < 0.0005 && Math.abs(surface.velocity.x) < 0.0008) surface.velocity.x = 0;
          if (Math.abs(signal.y) < 0.0005 && Math.abs(surface.velocity.y) < 0.0008) surface.velocity.y = 0;
          if (signal.strength < 0.0005 && surface.strength < 0.0008) surface.strength = 0;
          surface.material.uniforms.uVelocity.value.copy(surface.velocity);
          surface.material.uniforms.uStrength.value = surface.strength;
          surfacesSettling ||= Math.abs(surface.velocity.x) > 0.0005
            || Math.abs(surface.velocity.y) > 0.0005
            || surface.strength > 0.0005;
        });

        if (!needsRender && !signal.active && !surfacesSettling) return;
        needsRender = false;

        const viewportRect = viewport.getBoundingClientRect();
        const measurements = Array.from(recordsRef.current.values()).flatMap((record) => {
          if (!record.activeSurface) return [];
          const rect = record.host.getBoundingClientRect();
          return [{ record, rect }];
        });

        activeRenderer.setScissorTest(false);
        activeRenderer.setViewport(0, 0, viewportRect.width, viewportRect.height);
        activeRenderer.clear(true, true, true);
        activeRenderer.setScissorTest(true);

        measurements.forEach(({ record, rect }) => {
          const surface = record.activeSurface;
          if (!surface || rect.width < 1 || rect.height < 1) return;

          const bleed = Math.min(42, Math.max(16, rect.width * 0.065));
          const left = rect.left - viewportRect.left - bleed;
          const top = rect.top - viewportRect.top - bleed;
          const width = rect.width + bleed * 2;
          const height = rect.height + bleed * 2;
          if (left + width < 0 || top + height < 0 || left > viewportRect.width || top > viewportRect.height) return;

          const bottom = viewportRect.height - top - height;
          activeRenderer.setViewport(left, bottom, width, height);
          activeRenderer.setScissor(
            Math.max(0, left),
            Math.max(0, bottom),
            Math.min(width, viewportRect.width - Math.max(0, left)),
            Math.min(height, viewportRect.height - Math.max(0, bottom)),
          );

          const canvasAspect = width / height;
          surface.camera.left = -canvasAspect;
          surface.camera.right = canvasAspect;
          surface.camera.top = 1;
          surface.camera.bottom = -1;
          surface.camera.updateProjectionMatrix();
          surface.mesh.scale.x = rect.width / height;
          surface.mesh.scale.y = rect.height / height;
          surface.material.uniforms.uResolution.value.set(rect.width, rect.height);
          activeRenderer.render(surface.scene, surface.camera);

          if (!surface.revealed) {
            surface.revealed = true;
            record.host.setAttribute("data-shader-ready", "true");
            record.fallback.style.opacity = "0";
          }
        });

        activeRenderer.setScissorTest(false);
        needsRender = signal.active || surfacesSettling;
      };

      gsap.ticker.add(renderStage);
      const markStageDirty = () => markDirty();
      window.addEventListener("scroll", markStageDirty, { passive: true });
      cleanupRenderLoop = () => {
        gsap.ticker.remove(renderStage);
        window.removeEventListener("scroll", markStageDirty);
      };

      controllerRef.current = {
        add: addRecord,
        remove: removeRecord,
      };
    })();

    return () => {
      disposed = true;
      controllerRef.current = null;
      cleanupRenderLoop?.();
      window.cancelAnimationFrame(activationFrame);
      cancelIdleTasks.forEach((cancel) => cancel());
      cancelIdleTasks.clear();
      resizeObserver?.disconnect();
      prefetchObserver?.disconnect();
      activeObserver?.disconnect();
      records.forEach((record) => {
        window.clearTimeout(record.releaseTimer);
        record.host.removeAttribute("data-shader-ready");
        record.fallback.style.opacity = "1";
        record.activeSurface?.material.dispose();
        record.activeSurface = undefined;
      });
      texturePromises.forEach((resourcePromise) => {
        void resourcePromise.then((resource) => {
          window.clearTimeout(resource.disposeTimer);
          resource.texture.dispose();
        }).catch(() => undefined);
      });
      sharedGeometry?.dispose();
      warmMaterial?.dispose();
      warmTexture?.dispose();
      renderer?.dispose();
    };
  }, [motionSignal, viewportRef]);

  return (
    <DirectionalShaderContext.Provider value={contextValue}>
      {children}
      <canvas
        ref={canvasRef}
        data-field-shader-stage
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] !h-full !w-full contain-strict"
      />
    </DirectionalShaderContext.Provider>
  );
}
