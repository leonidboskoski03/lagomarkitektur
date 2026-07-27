export interface ImageLoadProgress {
  progress: number;
  loadedBytes: number;
  totalBytes: number | null;
}

interface PreloadImageOptions {
  signal: AbortSignal;
  onProgress: (progress: ImageLoadProgress) => void;
}

function waitForImage(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => reject(new Error("Image could not be decoded.")), {
      once: true,
    });
  });
}

export async function preloadImage(
  src: string,
  { signal, onProgress }: PreloadImageOptions,
) {
  const response = await fetch(src, {
    cache: "force-cache",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}.`);
  }

  const totalHeader = response.headers.get("content-length");
  const parsedTotal = totalHeader ? Number.parseInt(totalHeader, 10) : Number.NaN;
  const totalBytes = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : null;
  const contentType = response.headers.get("content-type") || "image/*";
  const chunks: ArrayBuffer[] = [];
  let loadedBytes = 0;

  onProgress({
    progress: 0,
    loadedBytes,
    totalBytes,
  });

  if (response.body) {
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      chunks.push(new Uint8Array(value).buffer);
      loadedBytes += value.byteLength;
      onProgress({
        progress: totalBytes ? Math.min(loadedBytes / totalBytes, 0.99) : 0,
        loadedBytes,
        totalBytes,
      });
    }
  } else {
    const buffer = await response.arrayBuffer();
    chunks.push(buffer);
    loadedBytes = buffer.byteLength;
  }

  if (signal.aborted) throw new DOMException("Image preload was aborted.", "AbortError");

  const objectUrl = URL.createObjectURL(new Blob(chunks, { type: contentType }));

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await waitForImage(image);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  onProgress({
    progress: 1,
    loadedBytes: totalBytes ?? loadedBytes,
    totalBytes,
  });
}
