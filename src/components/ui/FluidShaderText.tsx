import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export interface FluidShaderTextHandle {
    setDeformation: (value: number) => void;
    setText: (value: string) => void;
    syncTypography: (element: HTMLElement) => void;
}

interface FluidShaderTextProps {
    initialText: string;
    align?: "left" | "right";
    direction?: 1 | -1;
    ariaLabel: string;
    className?: string;
}

const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uDirection;
    varying vec2 vUv;

    void main() {
        vUv = uv;

        vec3 transformed = position;
        float directionalUv = 1.0 - uv.y;
        float delayedPush = smoothstep(0.0, 1.0, uProgress * 1.35 - directionalUv * 0.35);
        float centeredY = uv.y * 2.0 - 1.0;
        float cubicS = centeredY * centeredY * centeredY - centeredY;
        float envelope = sin(uv.x * 3.14159265);

        transformed.y += cubicS * 0.14 * delayedPush * envelope;
        transformed.z += cubicS * 0.09 * delayedPush * envelope;

        float travelingWave = sin(
            directionalUv * 10.0 - uTime * 2.2 + uv.x * 2.0
        );
        float fineRipple = sin(
            directionalUv * 17.0 - uTime * 2.8
        );
        float liquid = (travelingWave * 0.008 + fineRipple * 0.0025)
            * delayedPush
            * envelope;

        transformed.y += liquid;
        transformed.z += liquid * 1.25;
        transformed.x += sin(uv.x * 5.0 + uTime * 1.6)
            * 0.002
            * delayedPush;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uProgress;
    uniform float uDirection;
    varying vec2 vUv;

    void main() {
        float fromTop = 1.0 - vUv.y;
        float passingFront = smoothstep(
            0.0,
            1.0,
            uProgress * 1.35 - fromTop * 0.35
        );
        float centeredY = vUv.y * 2.0 - 1.0;
        float cubicS = centeredY * centeredY * centeredY - centeredY;

        vec2 warpedUv = vUv;
        warpedUv.x += cubicS * 0.045 * passingFront * uDirection;
        warpedUv.y += sin(vUv.x * 3.14159265)
            * 0.012
            * passingFront;
        warpedUv.y += sin(
            fromTop * 11.0 - uTime * 2.0
        ) * 0.0035 * passingFront;

        vec4 textColor = texture2D(uTexture, warpedUv);
        if (textColor.a < 0.01) discard;
        gl_FragColor = textColor;
    }
`;

export const FluidShaderText = forwardRef<
    FluidShaderTextHandle,
    FluidShaderTextProps
>(function FluidShaderText(
    {
        initialText,
        align = "left",
        direction = 1,
        ariaLabel,
        className = "",
    },
    forwardedRef
) {
    const hostRef = useRef<HTMLDivElement>(null!);
    const textRef = useRef(initialText);
    const drawTextRef = useRef<(value: string) => void>(() => undefined);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const typographyRef = useRef<{
        family: string;
        size: number;
        weight: string;
    } | null>(null);

    useImperativeHandle(forwardedRef, () => ({
        setDeformation: (value: number) => {
            if (materialRef.current) {
                materialRef.current.uniforms.uProgress.value = value;
            }
        },
        setText: (value: string) => {
            if (value === textRef.current) return;
            textRef.current = value;
            drawTextRef.current(value);
        },
        syncTypography: (element: HTMLElement) => {
            const styles = window.getComputedStyle(element);
            typographyRef.current = {
                family: styles.fontFamily,
                size: Number.parseFloat(styles.fontSize),
                weight: styles.fontWeight,
            };
            drawTextRef.current(textRef.current);
        },
    }), []);

    useLayoutEffect(() => {
        const host = hostRef.current;
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 2;

        const textCanvas = document.createElement("canvas");
        const context = textCanvas.getContext("2d");
        if (!context) return;

        const texture = new THREE.CanvasTexture(textCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const geometry = new THREE.PlaneGeometry(2, 2, 80, 28);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uDirection: { value: direction },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthTest: false,
            side: THREE.DoubleSide,
        });
        materialRef.current = material;
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const resize = () => {
            const width = Math.max(1, host.clientWidth);
            const height = Math.max(1, host.clientHeight);
            renderer.setSize(width, height, false);
            camera.left = -width / height;
            camera.right = width / height;
            camera.top = 1;
            camera.bottom = -1;
            camera.updateProjectionMatrix();
            mesh.scale.x = width / height;

            const dpr = Math.min(window.devicePixelRatio, 2);
            textCanvas.width = Math.round(width * dpr);
            textCanvas.height = Math.round(height * dpr);
            drawTextRef.current(textRef.current);
        };

        drawTextRef.current = (value: string) => {
            const width = textCanvas.width;
            const height = textCanvas.height;
            const dpr = Math.min(window.devicePixelRatio, 2);
            const typography = typographyRef.current;
            const fontSize = typography ? typography.size * dpr : height;
            const fontFamily = typography?.family
                ?? '"Satoshi", "Helvetica Neue", Arial, sans-serif';
            const fontWeight = typography?.weight ?? "700";
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#ffffff";
            context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            context.textBaseline = "alphabetic";
            context.textAlign = align;
            const metrics = context.measureText(value);
            const ascent = metrics.actualBoundingBoxAscent;
            const descent = metrics.actualBoundingBoxDescent;
            const baseline = (height - ascent - descent) / 2 + ascent;
            context.fillText(
                value,
                align === "left" ? 0 : width,
                baseline
            );
            texture.needsUpdate = true;
        };

        resize();
        void document.fonts.ready.then(() => drawTextRef.current(textRef.current));
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const clock = new THREE.Clock();
        let animationFrame = 0;
        const render = () => {
            material.uniforms.uTime.value = reducedMotion ? 0 : clock.getElapsedTime();
            renderer.render(scene, camera);
            animationFrame = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            geometry.dispose();
            material.dispose();
            texture.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            materialRef.current = null;
        };
    }, [align, direction]);

    return (
        <div
            ref={hostRef}
            className={`relative overflow-visible ${className}`}
            role="img"
            aria-label={ariaLabel}
        />
    );
});
