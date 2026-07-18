import {useEffect, useRef} from "react";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

const vertexShaderSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;

    void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;

    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uVariant;

    float draftingLine(vec2 coordinates) {
        vec2 grid = abs(fract(coordinates - 0.5) - 0.5);
        float distanceToLine = min(grid.x, grid.y);
        return 1.0 - smoothstep(0.0, 0.016, distanceToLine);
    }

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 field = vec2(uv.x * aspect, uv.y);
        float fineGrid = draftingLine(field * vec2(16.0, 10.0));
        float majorGrid = draftingLine(field * vec2(4.0, 2.5));
        float sweep = exp(-pow((uv.x + uv.y * 0.28) - (0.24 + mod(uTime * 0.018, 1.3)), 2.0) * 34.0);
        float vignette = smoothstep(0.92, 0.18, distance(uv, vec2(0.62, 0.48)));
        float preludeAlpha = fineGrid * 0.026 + majorGrid * 0.052 + sweep * vignette * 0.038;
        float mediaAlpha = fineGrid * 0.038 + majorGrid * 0.092 + sweep * vignette * 0.105;
        float alpha = mix(preludeAlpha, mediaAlpha, uVariant);
        vec3 preludeGraphite = mix(vec3(0.30, 0.29, 0.27), vec3(0.61, 0.56, 0.48), sweep);
        vec3 mediaGraphite = mix(vec3(0.075, 0.072, 0.064), vec3(0.48, 0.38, 0.24), sweep);
        vec3 graphite = mix(preludeGraphite, mediaGraphite, uVariant);

        gl_FragColor = vec4(graphite, alpha);
    }
`;

const compileShader = (
    context: WebGLRenderingContext,
    type: number,
    source: string,
) => {
    const shader = context.createShader(type);
    if (!shader) return null;

    context.shaderSource(shader, source);
    context.compileShader(shader);
    if (context.getShaderParameter(shader, context.COMPILE_STATUS)) return shader;

    context.deleteShader(shader);
    return null;
};

interface ProcessAmbientFieldProps {
    variant?: "prelude" | "media";
    className?: string;
}

export function ProcessAmbientField({
    variant = "prelude",
    className = "absolute inset-0 h-full w-full",
}: ProcessAmbientFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
            premultipliedAlpha: false,
        });
        if (!context) return;

        const vertexShader = compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(context, context.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = context.createProgram();
        if (!program) return;
        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            context.deleteProgram(program);
            return;
        }

        const quadBuffer = context.createBuffer();
        const positionLocation = context.getAttribLocation(program, "aPosition");
        const timeLocation = context.getUniformLocation(program, "uTime");
        const resolutionLocation = context.getUniformLocation(program, "uResolution");
        const variantLocation = context.getUniformLocation(program, "uVariant");
        if (!quadBuffer || positionLocation < 0) return;

        context.bindBuffer(context.ARRAY_BUFFER, quadBuffer);
        context.bufferData(
            context.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            context.STATIC_DRAW,
        );
        context.useProgram(program);
        context.enableVertexAttribArray(positionLocation);
        context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

        let frameId = 0;
        let visible = false;
        let startTime = performance.now();

        const resize = () => {
            const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
            const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
            const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            context.viewport(0, 0, width, height);
        };

        const draw = (time: number) => {
            resize();
            context.clearColor(0, 0, 0, 0);
            context.clear(context.COLOR_BUFFER_BIT);
            context.uniform1f(timeLocation, (time - startTime) / 1000);
            context.uniform2f(resolutionLocation, canvas.width, canvas.height);
            context.uniform1f(variantLocation, variant === "media" ? 1 : 0);
            context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
        };

        const render = (time: number) => {
            if (!visible || prefersReducedMotion) return;
            draw(time);
            frameId = requestAnimationFrame(render);
        };

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            const nextVisible = entry.isIntersecting;
            if (nextVisible === visible) return;
            visible = nextVisible;
            cancelAnimationFrame(frameId);
            if (visible && !prefersReducedMotion) {
                startTime = performance.now();
                frameId = requestAnimationFrame(render);
            } else {
                draw(startTime);
            }
        }, {rootMargin: "20% 0px"});

        const resizeObserver = new ResizeObserver(() => draw(performance.now()));
        visibilityObserver.observe(canvas);
        resizeObserver.observe(canvas);
        draw(startTime);

        return () => {
            cancelAnimationFrame(frameId);
            visibilityObserver.disconnect();
            resizeObserver.disconnect();
            context.deleteBuffer(quadBuffer);
            context.deleteProgram(program);
            context.deleteShader(vertexShader);
            context.deleteShader(fragmentShader);
        };
    }, [prefersReducedMotion, variant]);

    return <canvas ref={canvasRef} aria-hidden="true" className={className}/>;
}
