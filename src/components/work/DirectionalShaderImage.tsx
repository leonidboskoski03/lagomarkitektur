import { useEffect, useRef, type RefObject } from "react";
import type { PlaneGeometry, ShaderMaterial, Texture, WebGLRenderer } from "three";

export interface DirectionalMotion {
  x: number;
  y: number;
  strength: number;
}

interface DirectionalShaderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio: number;
  motionSignal: RefObject<DirectionalMotion>;
}

const MAX_ACTIVE_SHADER_SURFACES = 12;
let activeShaderSurfaces = 0;
const pendingShaderStarts = new Set<() => void>();

function requestShaderSlot(start: () => void) {
  if (activeShaderSurfaces < MAX_ACTIVE_SHADER_SURFACES) {
    activeShaderSurfaces += 1;
    return true;
  }

  pendingShaderStarts.add(start);
  return false;
}

function releaseShaderSlot() {
  activeShaderSurfaces = Math.max(0, activeShaderSurfaces - 1);
  const nextStart = pendingShaderStarts.values().next().value as (() => void) | undefined;
  if (!nextStart) return;
  pendingShaderStarts.delete(nextStart);
  window.queueMicrotask(nextStart);
}

const vertexShader = `
  uniform vec2 uVelocity;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;

    float centeredX = uv.x - 0.5;
    float centeredY = uv.y - 0.5;
    float tension = 0.42 + uStrength * 0.78;
    float surfaceEnvelope = sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265);

    transformed.x += centeredY * uVelocity.x * 0.31 * tension;
    transformed.y -= centeredX * uVelocity.y * 0.265 * tension;
    transformed.x += centeredY * abs(centeredY) * uVelocity.x * 0.12 * tension;
    transformed.y -= centeredX * abs(centeredX) * uVelocity.y * 0.1 * tension;
    transformed.x += centeredX * centeredY * uVelocity.y * 0.09 * tension;
    transformed.y += centeredX * centeredY * uVelocity.x * 0.075 * tension;
    transformed.z += length(uVelocity) * surfaceEnvelope * 0.055 * tension;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uResolution;
  uniform float uBrightness;
  uniform float uShadowLift;
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

    vec4 color = texture2D(uTexture, imageUv);
    color.rgb = min(vec3(1.0), color.rgb * uBrightness + vec3(uShadowLift) * (1.0 - color.rgb));
    gl_FragColor = color;
  }
`;

export function DirectionalShaderImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  motionSignal,
}: DirectionalShaderImageProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const fallbackRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const fallback = fallbackRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shaderHost = host;

    let disposeRenderer: (() => void) | undefined;
    let rendererStarting = false;
    let disposeTimer = 0;
    let isIntersecting = false;
    let ownsShaderSlot = false;

    async function startRenderer() {
      if (!isIntersecting || disposeRenderer || rendererStarting) return;
      if (!ownsShaderSlot) {
        if (!requestShaderSlot(queuedStart)) return;
        ownsShaderSlot = true;
      }
      rendererStarting = true;

      let disposed = false;
      let renderer: WebGLRenderer | undefined;
      let geometry: PlaneGeometry | undefined;
      let material: ShaderMaterial | undefined;
      let texture: Texture | undefined;
      let resizeObserver: ResizeObserver | undefined;
      let animationFrame = 0;

      disposeRenderer = () => {
        disposed = true;
        rendererStarting = false;
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        geometry?.dispose();
        material?.dispose();
        texture?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
        shaderHost.removeAttribute("data-shader-ready");
        if (fallback) fallback.style.opacity = "1";
        if (ownsShaderSlot) {
          ownsShaderSlot = false;
          releaseShaderSlot();
        }
        disposeRenderer = undefined;
      };

      const THREE = await import("three");
      if (disposed) return;
      rendererStarting = false;
      THREE.Cache.enabled = true;

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(src, (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        try {
          texture = loadedTexture;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          });
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.setClearColor(0x000000, 0);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.1));
          renderer.domElement.setAttribute("aria-hidden", "true");
          renderer.domElement.setAttribute("data-field-shader-surface", "true");
          renderer.domElement.className = "pointer-events-none absolute z-[1] max-w-none opacity-0 transition-opacity duration-500";
          shaderHost.appendChild(renderer.domElement);

          const scene = new THREE.Scene();
          const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
          camera.position.z = 2;

          const textureImage = texture.image as HTMLImageElement;
          const uniforms = {
            uTexture: { value: texture },
            uTextureSize: { value: new THREE.Vector2(textureImage.naturalWidth || 1, textureImage.naturalHeight || 1) },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uVelocity: { value: new THREE.Vector2(0, 0) },
            uStrength: { value: 0 },
            uBrightness: { value: 1.1 },
            uShadowLift: { value: 0.032 },
          };

          geometry = new THREE.PlaneGeometry(2, 2, 16, 10);
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            depthTest: false,
            depthWrite: false,
            transparent: true,
          });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const resize = () => {
            if (!renderer) return;
            const hostWidth = Math.max(1, shaderHost.clientWidth);
            const hostHeight = Math.max(1, shaderHost.clientHeight);
            const bleed = Math.min(48, Math.max(22, hostWidth * 0.075));
            const canvasWidth = Math.ceil(hostWidth + bleed * 2);
            const canvasHeight = Math.ceil(hostHeight + bleed * 2);
            const canvasAspect = canvasWidth / canvasHeight;

            renderer.setSize(canvasWidth, canvasHeight, false);
            renderer.domElement.style.width = `${canvasWidth}px`;
            renderer.domElement.style.height = `${canvasHeight}px`;
            renderer.domElement.style.left = `${-bleed}px`;
            renderer.domElement.style.top = `${-bleed}px`;
            camera.left = -canvasAspect;
            camera.right = canvasAspect;
            camera.top = 1;
            camera.bottom = -1;
            camera.updateProjectionMatrix();
            mesh.scale.x = hostWidth / canvasHeight;
            mesh.scale.y = hostHeight / canvasHeight;
            uniforms.uResolution.value.set(hostWidth, hostHeight);
            renderer.render(scene, camera);
          };

          resize();
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(shaderHost);

          const currentVelocity = new THREE.Vector2(0, 0);
          let currentStrength = 0;
          let hasRendered = false;
          let wasMoving = true;
          let lastRenderTime = 0;
          const render = (time = 0) => {
            const signal = motionSignal.current;
            if (signal) {
              currentVelocity.x += (signal.x - currentVelocity.x) * 0.12;
              currentVelocity.y += (signal.y - currentVelocity.y) * 0.12;
              currentStrength += (signal.strength - currentStrength) * 0.1;
              if (Math.abs(signal.x) < 0.0005 && Math.abs(currentVelocity.x) < 0.0008) currentVelocity.x = 0;
              if (Math.abs(signal.y) < 0.0005 && Math.abs(currentVelocity.y) < 0.0008) currentVelocity.y = 0;
              if (signal.strength < 0.0005 && currentStrength < 0.0008) currentStrength = 0;
              uniforms.uVelocity.value.copy(currentVelocity);
              uniforms.uStrength.value = currentStrength;
            }

            const isMoving = Math.abs(currentVelocity.x) > 0.0005
              || Math.abs(currentVelocity.y) > 0.0005
              || currentStrength > 0.0005;
            const renderInterval = 1000 / 45;
            if (!hasRendered || (isMoving && time - lastRenderTime >= renderInterval) || (wasMoving && !isMoving)) {
              renderer?.render(scene, camera);
              hasRendered = true;
              lastRenderTime = time;
            }
            wasMoving = isMoving;
            animationFrame = window.requestAnimationFrame(render);
          };
          render();

          window.requestAnimationFrame(() => {
            if (renderer && !disposed) {
              shaderHost.setAttribute("data-shader-ready", "true");
              renderer.domElement.style.opacity = "1";
              if (fallback) fallback.style.opacity = "0";
            }
          });
        } catch {
          renderer?.dispose();
          renderer?.domElement.remove();
        }
      }, undefined, () => undefined);
    }
    const queuedStart = () => { void startRenderer(); };

    const observer = new IntersectionObserver((entries) => {
      isIntersecting = Boolean(entries[0]?.isIntersecting);
      if (isIntersecting) {
        window.clearTimeout(disposeTimer);
        void startRenderer();
      } else {
        pendingShaderStarts.delete(queuedStart);
        window.clearTimeout(disposeTimer);
        disposeTimer = window.setTimeout(() => disposeRenderer?.(), 420);
      }
    }, { rootMargin: "18%" });
    observer.observe(shaderHost);

    return () => {
      observer.disconnect();
      window.clearTimeout(disposeTimer);
      isIntersecting = false;
      pendingShaderStarts.delete(queuedStart);
      disposeRenderer?.();
    };
  }, [motionSignal, src]);

  return (
    <span
      ref={hostRef}
      className="relative isolate block overflow-visible"
      style={{ aspectRatio }}
    >
      <img
        ref={fallbackRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        draggable={false}
        className="pointer-events-none !h-full w-full object-cover brightness-[1.12] contrast-[0.96] transition-opacity duration-500"
      />
    </span>
  );
}
