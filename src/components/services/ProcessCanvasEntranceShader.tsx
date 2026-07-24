import {useEffect, useRef, type MutableRefObject} from "react";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

export const PROCESS_GRID_LINE_COLOR = "#cececa";

const PROCESS_GRID_LINE_RGB = [206 / 255, 206 / 255, 202 / 255] as const;
const PROCESS_GRID_LINE_WIDTH = 1;

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
    uniform float uProgress;
    uniform float uGridReveal;
    uniform vec2 uResolution;
    uniform vec2 uGridBounds;
    uniform float uGridDivisions;
    uniform float uPixelRatio;
    uniform vec3 uGridColor;
    uniform sampler2D uPromptLineOneTexture;
    uniform sampler2D uPromptLineTwoTexture;
    uniform sampler2D uPromptCueTexture;
    uniform float uPromptReveal;
    uniform vec4 uPromptLayout;

    float hash21(vec2 point) {
        point = fract(point * vec2(123.34, 456.21));
        point += dot(point, point + 45.32);
        return fract(point.x * point.y);
    }

    float noise(vec2 point) {
        vec2 index = floor(point);
        vec2 fraction = fract(point);
        fraction = fraction * fraction * (3.0 - 2.0 * fraction);

        float a = hash21(index);
        float b = hash21(index + vec2(1.0, 0.0));
        float c = hash21(index + vec2(0.0, 1.0));
        float d = hash21(index + vec2(1.0, 1.0));

        return mix(mix(a, b, fraction.x), mix(c, d, fraction.x), fraction.y);
    }

    float fbm(vec2 point) {
        float value = 0.0;
        float amplitude = 0.5;
        mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);

        for (int octave = 0; octave < 5; octave++) {
            value += amplitude * noise(point);
            point = rotation * point * 2.03 + vec2(13.7, 7.9);
            amplitude *= 0.5;
        }

        return value;
    }

    float draftingLine(float distanceInPixels, float lineWidth) {
        float halfWidth = max(lineWidth * 0.5, 0.5);
        return 1.0 - smoothstep(
            max(0.0, halfWidth - 0.5),
            halfWidth + 0.5,
            distanceInPixels
        );
    }

    float draftingGrid(vec2 uv, float verticalDrift) {
        float contentWidth = max(uGridBounds.y - uGridBounds.x, 0.001);
        float verticalCellWidth = contentWidth / max(uGridDivisions, 1.0);
        float verticalPosition = (uv.x - uGridBounds.x) / verticalCellWidth;
        float verticalDistance = abs(fract(verticalPosition + 0.5) - 0.5)
            * verticalCellWidth
            * uResolution.x;
        float insideBounds = step(uGridBounds.x, uv.x) * step(uv.x, uGridBounds.y);
        float verticalLines = draftingLine(
            verticalDistance,
            uPixelRatio
        ) * insideBounds;

        float horizontalCellHeight = 1.0 / 6.0;
        float horizontalPosition = (uv.y + verticalDrift) / horizontalCellHeight;
        float horizontalDistance = abs(fract(horizontalPosition + 0.5) - 0.5)
            * horizontalCellHeight
            * uResolution.y;
        float horizontalLines = draftingLine(horizontalDistance, uPixelRatio);

        return max(verticalLines, horizontalLines);
    }

    float verticalBand(float value, float center, float halfExtent) {
        return step(center - halfExtent, value)
            * step(value, center + halfExtent);
    }

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 field = vec2(uv.x * aspect, uv.y);
        float progress = smoothstep(0.0, 1.0, clamp(uProgress, 0.0, 1.0));
        vec2 contourDrift = vec2(
            sin(uTime * 0.045 + 1.3),
            cos(uTime * 0.037 + 3.8)
        ) * 0.075;
        float gridDriftY = -uTime * 0.019
            + sin(uTime * 0.09 + 2.1) * 0.004;

        float coarseNoise = fbm(field * 2.15 + contourDrift);
        float detailNoise = fbm(field * 6.4 - contourDrift * 0.34);
        float randomShift = (
            noise(vec2(field.x * 0.56 + 19.2, uTime * 0.022 + 4.6)) - 0.5
        ) * 0.022;
        float ripple = sin(
            field.x * 3.2
            + uTime * 0.07
            + sin(uTime * 0.021) * 0.38
        ) * 0.014;
        float displacement = (coarseNoise - 0.5) * 0.21
            + (detailNoise - 0.5) * 0.035
            + randomShift
            + ripple
            + (uv.x - 0.5) * 0.055;

        float boundary = mix(-0.24, 1.24, progress);
        float displacedY = uv.y + displacement;
        float signedDistance = displacedY - boundary;
        float paperMask = smoothstep(-0.035, 0.052, signedDistance);
        float edge = 1.0 - smoothstep(0.0, 0.115, abs(signedDistance));
        float core = 1.0 - smoothstep(0.0, 0.032, abs(signedDistance));

        float contourPhase = fract((coarseNoise * 1.45 + displacedY) * 10.0);
        float contours = 1.0 - smoothstep(0.0, 0.06, abs(contourPhase - 0.5));
        float grid = draftingGrid(uv, gridDriftY);
        float gridReveal = smoothstep(
            0.02,
            0.14,
            clamp(uGridReveal, 0.0, 1.0) - (1.0 - uv.y) * 0.72
        );
        grid *= gridReveal;
        float fibers = smoothstep(0.58, 0.93, detailNoise);

        float promptProgress = clamp(uPromptReveal, 0.0, 1.0);
        float firstLineProgress = smoothstep(0.0, 0.64, promptProgress);
        float secondLineProgress = smoothstep(0.12, 0.82, promptProgress);
        float cueProgress = smoothstep(0.5, 1.0, promptProgress);
        float promptShift = uPromptLayout.z * 2.35;
        float firstLineBand = verticalBand(
            uv.y,
            uPromptLayout.x,
            uPromptLayout.z
        );
        float secondLineBand = verticalBand(
            uv.y,
            uPromptLayout.y,
            uPromptLayout.z
        );
        float cueBand = verticalBand(
            uv.y,
            uPromptLayout.w,
            0.034
        );
        vec4 firstLineSample = texture2D(
            uPromptLineOneTexture,
            vec2(uv.x, uv.y + (1.0 - firstLineProgress) * promptShift)
        );
        vec4 secondLineSample = texture2D(
            uPromptLineTwoTexture,
            vec2(uv.x, uv.y + (1.0 - secondLineProgress) * promptShift)
        );
        vec4 cueSample = texture2D(uPromptCueTexture, uv);
        float titlePromptAlpha = max(
            firstLineSample.a * firstLineBand,
            secondLineSample.a * secondLineBand
        );
        titlePromptAlpha = smoothstep(0.015, 0.12, titlePromptAlpha);
        float promptAlpha = max(
            titlePromptAlpha,
            cueSample.a * cueBand * cueProgress
        );

        vec3 paper = vec3(1.0);
        vec3 graphite = vec3(0.055, 0.052, 0.047);
        vec3 contourInk = vec3(0.30, 0.275, 0.245);
        vec3 color = paper;
        color = mix(color, graphite, edge * (0.58 + fibers * 0.24));
        color = mix(color, contourInk, core * 0.48 + contours * edge * 0.055);
        color = mix(color, uGridColor, grid * paperMask);
        color = mix(color, vec3(0.075), promptAlpha * paperMask);

        float completionFade = 1.0 - smoothstep(0.965, 1.0, progress);
        float alpha = max(paperMask * 0.995, edge * 0.82);
        alpha += contours * edge * 0.035 + grid * edge * 0.045;
        alpha *= completionFade;

        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
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

    if (import.meta.env.DEV) {
        console.warn("Process canvas entrance shader compilation failed", context.getShaderInfoLog(shader));
    }
    context.deleteShader(shader);
    return null;
};

interface ProcessCanvasEntranceShaderProps {
    progressRef: MutableRefObject<number>;
    gridRevealRef: MutableRefObject<number>;
    promptRevealRef: MutableRefObject<number>;
    prompt: {
        titleLines: readonly string[];
        cue: string;
    };
    className?: string;
}

export function ProcessCanvasEntranceShader({
    progressRef,
    gridRevealRef,
    promptRevealRef,
    prompt,
    className = "absolute inset-0 h-full w-full",
}: ProcessCanvasEntranceShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            depth: false,
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
            if (import.meta.env.DEV) {
                console.warn("Process canvas entrance shader linking failed", context.getProgramInfoLog(program));
            }
            context.deleteProgram(program);
            return;
        }

        const quadBuffer = context.createBuffer();
        const positionLocation = context.getAttribLocation(program, "aPosition");
        const timeLocation = context.getUniformLocation(program, "uTime");
        const progressLocation = context.getUniformLocation(program, "uProgress");
        const gridRevealLocation = context.getUniformLocation(program, "uGridReveal");
        const resolutionLocation = context.getUniformLocation(program, "uResolution");
        const gridBoundsLocation = context.getUniformLocation(program, "uGridBounds");
        const gridDivisionsLocation = context.getUniformLocation(program, "uGridDivisions");
        const pixelRatioLocation = context.getUniformLocation(program, "uPixelRatio");
        const gridColorLocation = context.getUniformLocation(program, "uGridColor");
        const promptLineOneTextureLocation = context.getUniformLocation(program, "uPromptLineOneTexture");
        const promptLineTwoTextureLocation = context.getUniformLocation(program, "uPromptLineTwoTexture");
        const promptCueTextureLocation = context.getUniformLocation(program, "uPromptCueTexture");
        const promptRevealLocation = context.getUniformLocation(program, "uPromptReveal");
        const promptLayoutLocation = context.getUniformLocation(program, "uPromptLayout");
        if (
            !quadBuffer
            || positionLocation < 0
            || !timeLocation
            || !progressLocation
            || !gridRevealLocation
            || !resolutionLocation
            || !gridBoundsLocation
            || !gridDivisionsLocation
            || !pixelRatioLocation
            || !gridColorLocation
            || !promptLineOneTextureLocation
            || !promptLineTwoTextureLocation
            || !promptCueTextureLocation
            || !promptRevealLocation
            || !promptLayoutLocation
        ) return;

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

        const promptTextures = [
            context.createTexture(),
            context.createTexture(),
            context.createTexture(),
        ];
        if (promptTextures.some((texture) => !texture)) {
            promptTextures.forEach((texture) => {
                if (texture) context.deleteTexture(texture);
            });
            return;
        }

        const resolvedPromptTextures = promptTextures as WebGLTexture[];
        const promptCanvases = [
            document.createElement("canvas"),
            document.createElement("canvas"),
            document.createElement("canvas"),
        ];
        const promptContexts = promptCanvases.map((promptCanvas) => promptCanvas.getContext("2d"));
        if (promptContexts.some((drawingContext) => !drawingContext)) {
            resolvedPromptTextures.forEach((texture) => context.deleteTexture(texture));
            return;
        }
        const [
            firstLineContext,
            secondLineContext,
            cueContext,
        ] = promptContexts as CanvasRenderingContext2D[];

        resolvedPromptTextures.forEach((texture, index) => {
            context.activeTexture(context.TEXTURE0 + index);
            context.bindTexture(context.TEXTURE_2D, texture);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
        });
        context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
        context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        context.uniform1i(promptLineOneTextureLocation, 0);
        context.uniform1i(promptLineTwoTextureLocation, 1);
        context.uniform1i(promptCueTextureLocation, 2);

        let frameId = 0;
        let visible = false;
        let startTime = performance.now();
        let lastProgress = -1;
        let pixelRatio = 1;
        let gridStart = 0;
        let gridEnd = 1;
        let gridDivisions = 8;
        let disposed = false;
        let promptLayout: [number, number, number, number] = [0.58, 0.46, 0.06, 0.34];

        const measureTrackedText = (
            drawingContext: CanvasRenderingContext2D,
            text: string,
            tracking: number,
        ) => (
            Array.from(text).reduce(
                (width, character) => width + drawingContext.measureText(character).width,
                0,
            ) + Math.max(0, text.length - 1) * tracking
        );

        const drawTrackedText = (
            drawingContext: CanvasRenderingContext2D,
            text: string,
            centerX: number,
            centerY: number,
            tracking: number,
        ) => {
            const characters = Array.from(text);
            let cursorX = centerX - measureTrackedText(drawingContext, text, tracking) * 0.5;

            characters.forEach((character) => {
                drawingContext.fillText(character, cursorX, centerY);
                cursorX += drawingContext.measureText(character).width + tracking;
            });
        };

        const renderPromptTexture = () => {
            if (canvas.width <= 0 || canvas.height <= 0) return;

            const promptTextureScale = Math.min(1, 2048 / canvas.width);
            const promptPixelRatio = pixelRatio * promptTextureScale;
            promptCanvases.forEach((promptCanvas) => {
                promptCanvas.width = Math.max(1, Math.round(canvas.width * promptTextureScale));
                promptCanvas.height = Math.max(1, Math.round(canvas.height * promptTextureScale));
            });

            const cssWidth = canvas.width / pixelRatio;
            const cssHeight = canvas.height / pixelRatio;
            const isDesktop = cssWidth >= 768;
            const titleSize = Math.min(
                isDesktop ? 140 : 72,
                Math.max(56, cssWidth * (isDesktop ? 0.076 : 0.13)),
            );
            const titleLineHeight = titleSize * 0.82;
            const cueSize = isDesktop ? 11 : 10;
            const cueGap = isDesktop ? 40 : 28;
            const titleLines = prompt.titleLines.slice(0, 2);
            const lineCount = Math.max(1, titleLines.length);
            const titleBlockHeight = titleLineHeight * lineCount;
            const totalHeight = titleBlockHeight + cueGap + cueSize;
            const blockTop = (cssHeight - totalHeight) * 0.5;
            const fontFamily = window.getComputedStyle(document.documentElement)
                .getPropertyValue("--font-display")
                .trim() || '"Helvetica Neue", Arial, sans-serif';

            promptContexts.forEach((drawingContext) => {
                if (!drawingContext) return;
                drawingContext.setTransform(promptPixelRatio, 0, 0, promptPixelRatio, 0, 0);
                drawingContext.clearRect(0, 0, cssWidth, cssHeight);
                drawingContext.textAlign = "left";
                drawingContext.textBaseline = "middle";
            });
            firstLineContext.font = `400 ${titleSize}px ${fontFamily}`;
            firstLineContext.fillStyle = "rgba(19, 19, 19, 1)";
            secondLineContext.font = `400 ${titleSize}px ${fontFamily}`;
            secondLineContext.fillStyle = "rgba(19, 19, 19, 1)";

            const titleTracking = titleSize * -0.068;
            const titleDrawingContexts = [firstLineContext, secondLineContext];
            const lineCenters = titleLines.map((line, index) => {
                const centerY = blockTop + titleLineHeight * (index + 0.5);
                drawTrackedText(
                    titleDrawingContexts[index] ?? firstLineContext,
                    line,
                    cssWidth * 0.5,
                    centerY,
                    titleTracking,
                );
                return 1 - centerY / cssHeight;
            });

            const cueCenterY = blockTop + titleBlockHeight + cueGap + cueSize * 0.5;
            const cueTracking = cueSize * 0.2;
            cueContext.font = `500 ${cueSize}px ${fontFamily}`;
            const cueWidth = measureTrackedText(cueContext, prompt.cue.toUpperCase(), cueTracking);
            const viewportGutter = Math.min(40, Math.max(24, cssWidth * 0.021));
            const ruleGroupWidth = Math.min(560, cssWidth - viewportGutter * 2);
            const ruleGap = isDesktop ? 24 : 16;
            const ruleStart = cssWidth * 0.5 - ruleGroupWidth * 0.5;
            const ruleEnd = cssWidth * 0.5 + ruleGroupWidth * 0.5;
            const cueStart = cssWidth * 0.5 - cueWidth * 0.5;
            const cueEnd = cssWidth * 0.5 + cueWidth * 0.5;

            cueContext.strokeStyle = "rgba(19, 19, 19, 0.3)";
            cueContext.lineWidth = 1;
            cueContext.beginPath();
            cueContext.moveTo(ruleStart, cueCenterY);
            cueContext.lineTo(Math.max(ruleStart, cueStart - ruleGap), cueCenterY);
            cueContext.moveTo(Math.min(ruleEnd, cueEnd + ruleGap), cueCenterY);
            cueContext.lineTo(ruleEnd, cueCenterY);
            cueContext.stroke();

            cueContext.fillStyle = "rgba(19, 19, 19, 0.54)";
            drawTrackedText(
                cueContext,
                prompt.cue.toUpperCase(),
                cssWidth * 0.5,
                cueCenterY,
                cueTracking,
            );

            const firstLineCenter = lineCenters[0] ?? 0.55;
            const secondLineCenter = lineCenters[1] ?? firstLineCenter;
            promptLayout = [
                firstLineCenter,
                secondLineCenter,
                titleSize * 0.58 / cssHeight,
                1 - cueCenterY / cssHeight,
            ];

            resolvedPromptTextures.forEach((texture, index) => {
                context.activeTexture(context.TEXTURE0 + index);
                context.bindTexture(context.TEXTURE_2D, texture);
                context.texImage2D(
                    context.TEXTURE_2D,
                    0,
                    context.RGBA,
                    context.RGBA,
                    context.UNSIGNED_BYTE,
                    promptCanvases[index],
                );
            });
        };

        const measureGrid = () => {
            const canvasRect = canvas.getBoundingClientRect();
            if (canvasRect.width <= 0) {
                gridStart = 0;
                gridEnd = 1;
                gridDivisions = window.matchMedia("(min-width: 768px)").matches ? 8 : 4;
                return;
            }

            const rootFontSize = Number.parseFloat(
                window.getComputedStyle(document.documentElement).fontSize,
            ) || 16;
            const viewportGutter = Math.min(
                rootFontSize * 2.5,
                Math.max(rootFontSize * 1.5, window.innerWidth * 0.021),
            );
            gridStart = Math.max(0, Math.min(
                1,
                (viewportGutter - canvasRect.left) / canvasRect.width,
            ));
            gridEnd = Math.max(gridStart, Math.min(
                1,
                (
                    window.innerWidth
                    - viewportGutter
                    - canvasRect.left
                ) / canvasRect.width,
            ));
            gridDivisions = window.matchMedia("(min-width: 768px)").matches ? 8 : 4;
        };

        const resize = () => {
            pixelRatio = Math.min(window.devicePixelRatio, 1.25);
            const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
            const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                measureGrid();
                renderPromptTexture();
            }

            context.viewport(0, 0, width, height);
        };

        const draw = (time: number, progress: number) => {
            resize();
            context.clearColor(0, 0, 0, 0);
            context.clear(context.COLOR_BUFFER_BIT);
            context.uniform1f(timeLocation, (time - startTime) / 1000);
            context.uniform1f(progressLocation, progress);
            context.uniform1f(gridRevealLocation, gridRevealRef.current);
            context.uniform2f(resolutionLocation, canvas.width, canvas.height);
            context.uniform2f(gridBoundsLocation, gridStart, gridEnd);
            context.uniform1f(gridDivisionsLocation, gridDivisions);
            context.uniform1f(pixelRatioLocation, pixelRatio * PROCESS_GRID_LINE_WIDTH);
            context.uniform3f(gridColorLocation, ...PROCESS_GRID_LINE_RGB);
            context.uniform1f(promptRevealLocation, promptRevealRef.current);
            context.uniform4f(promptLayoutLocation, ...promptLayout);
            resolvedPromptTextures.forEach((texture, index) => {
                context.activeTexture(context.TEXTURE0 + index);
                context.bindTexture(context.TEXTURE_2D, texture);
            });
            context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
        };

        const render = (time: number) => {
            if (!visible || prefersReducedMotion) return;

            const progress = progressRef.current;
            const shaderIsVisible = progress < 0.999;
            if (shaderIsVisible || Math.abs(progress - lastProgress) > 0.0005) {
                draw(time, progress);
                lastProgress = progress;
            }

            frameId = window.requestAnimationFrame(render);
        };

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            window.cancelAnimationFrame(frameId);

            if (visible && !prefersReducedMotion) {
                measureGrid();
                startTime = performance.now();
                frameId = window.requestAnimationFrame(render);
            } else {
                const progress = prefersReducedMotion ? 1 : progressRef.current;
                draw(startTime, progress);
                lastProgress = progress;
            }
        }, {rootMargin: "50% 0px"});

        const resizeObserver = new ResizeObserver(() => {
            measureGrid();
            const progress = prefersReducedMotion ? 1 : progressRef.current;
            draw(performance.now(), progress);
            lastProgress = progress;
        });

        visibilityObserver.observe(canvas);
        resizeObserver.observe(canvas);
        measureGrid();
        renderPromptTexture();
        draw(startTime, prefersReducedMotion ? 1 : progressRef.current);
        void document.fonts?.ready.then(() => {
            if (disposed) return;
            renderPromptTexture();
            draw(performance.now(), prefersReducedMotion ? 1 : progressRef.current);
        });

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frameId);
            visibilityObserver.disconnect();
            resizeObserver.disconnect();
            context.deleteBuffer(quadBuffer);
            resolvedPromptTextures.forEach((texture) => context.deleteTexture(texture));
            context.deleteProgram(program);
            context.deleteShader(vertexShader);
            context.deleteShader(fragmentShader);
        };
    }, [gridRevealRef, prefersReducedMotion, progressRef, prompt, promptRevealRef]);

    return <canvas ref={canvasRef} aria-hidden="true" className={className}/>;
}
