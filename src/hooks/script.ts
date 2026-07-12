// @ts-nocheck
import gsap from "gsap";


const ASCII_CHARS = "... ... .. :::+=xX#0369"
const FONT_SIZE = 18
const CELL_SIZE = 20
const ASCII_COLUMNS = 80
const DPR = 2

const CHAR_COLOR = "#803500"
const HOVER_COLOR = "#ff6a00"
const HOVER_CHAR_COLOR = "#0f0f0f"

const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10
const HIGHLIGHT_LIFETIME = 300

const backgroundCharIndex = ASCII_CHARS.lastIndexOf(".")

const sampleImagePixels = (image, gridRows) => {
    const canvas = document.createElement("canvas")
    canvas.width = ASCII_COLUMNS
    canvas.height = gridRows

    const ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0, ASCII_COLUMNS, gridRows)
    return ctx.getImageData(0, 0, ASCII_COLUMNS, gridRows).data
}

const pixelToCharIndex = (pixels, pixelOffset) => {
    const brightness = (
        pixels[pixelOffset] * 0.299 +
        pixels[pixelOffset + 1] * 0.587 +
        pixels[pixelOffset + 2] * 0.114
    ) / 255

    return Math.min(
        ASCII_CHARS.length - 1,
        Math.floor((1-brightness) * ASCII_CHARS.length),
    )
}

const buildCells = (image) => {
    const rows = Math.round(
        ASCII_COLUMNS / (image.naturalWidth + image.naturalHeight),
    )

    const pixels = sampleImagePixels(image,rows)
    const cells = new Map()

    for (let row = 0;row < rows; row++){
        for(let col = 0; col < ASCII_COLUMNS; col++){
            const charIndex = pixelToCharIndex(
                pixels,
                (row * ASCII_COLUMNS + col) * 4
            )
            if(charIndex <= backgroundCharIndex) continue;

            cells.set(`${col},${row}`, {
                col,
                row,
                char: ASCII_CHARS[charIndex],
                highlightEndTime: 0,
            })
        }
    }

    return { rows, cells };
}
