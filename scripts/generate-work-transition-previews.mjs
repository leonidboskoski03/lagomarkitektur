import { spawn } from "node:child_process";
import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const projectsPath = path.join(projectRoot, "src", "data", "projects.ts");
const assetsRoot = path.join(projectRoot, "src", "assets", "LAGOM Arkitektur");
const outputRoot = path.join(projectRoot, "public", "work-previews");
const source = await readFile(projectsPath, "utf8");

const folderBlock = source.match(/const folder = \{([\s\S]*?)\} as const;/)?.[1];
if (!folderBlock) throw new Error("Could not read the project folder map.");

const folders = new Map(
  Array.from(folderBlock.matchAll(/(\w+):\s*"([^"]+)"/g), (match) => [match[1], match[2]]),
);
const projectStarts = Array.from(source.matchAll(/\n  \{\n    id:\s*"([^"]+)"/g));

function parseImage(segment, property) {
  const match = segment.match(new RegExp(`${property}:\\s*image\\(folder\\.(\\w+),\\s*"([^"]+)"\\)`));
  if (!match) return null;
  return { folderKey: match[1], relativePath: match[2] };
}

function parseGallery(segment) {
  const match = segment.match(/gallery:\s*gallery\(folder\.(\w+),\s*\[([\s\S]*?)\]\)/);
  if (!match) return [];
  return Array.from(match[2].matchAll(/"([^"]+)"/g), (item) => ({
    folderKey: match[1],
    relativePath: item[1],
  }));
}

const jobs = projectStarts.flatMap((projectStart, projectIndex) => {
  const id = projectStart[1];
  const nextStart = projectStarts[projectIndex + 1]?.index ?? source.length;
  const segment = source.slice(projectStart.index, nextStart);
  const featured = parseImage(segment, "featuredImage");
  const cover = parseImage(segment, "thumbnailImage") ?? featured;
  const gallery = parseGallery(segment);

  if (!cover || gallery.length === 0) {
    throw new Error(`Could not resolve cover and gallery images for project ${id}.`);
  }

  return [
    { id, name: "cover", ...cover },
    ...gallery.map((item, imageIndex) => ({ id, name: String(imageIndex), ...item })),
  ];
});

async function runFfmpeg(input, output) {
  await new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", [
      "-y",
      "-loglevel", "error",
      "-i", input,
      "-vf", "scale=min(420\\,iw):-2:flags=lanczos",
      "-frames:v", "1",
      "-c:v", "libwebp",
      "-quality", "72",
      "-compression_level", "5",
      "-map_metadata", "-1",
      output,
    ], { stdio: ["ignore", "ignore", "pipe"] });

    let errorOutput = "";
    child.stderr.on("data", (chunk) => { errorOutput += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(errorOutput || `ffmpeg exited with code ${code}`));
    });
  });
}

async function generate(job) {
  const folder = folders.get(job.folderKey);
  if (!folder) throw new Error(`Unknown folder key: ${job.folderKey}`);

  const input = path.join(assetsRoot, folder, job.relativePath);
  const outputDirectory = path.join(outputRoot, job.id);
  const output = path.join(outputDirectory, `${job.name}.webp`);
  await access(input);
  await mkdir(outputDirectory, { recursive: true });
  await runFfmpeg(input, output);
  return path.relative(projectRoot, output);
}

const concurrency = 4;
let nextJob = 0;
const generated = [];

async function worker() {
  while (nextJob < jobs.length) {
    const job = jobs[nextJob];
    nextJob += 1;
    generated.push(await generate(job));
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`Generated ${generated.length} work transition previews in ${path.relative(projectRoot, outputRoot)}.`);
