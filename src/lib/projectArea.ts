export function formatProjectArea(value?: string): string | undefined {
  if (!value) return undefined;

  const measurement = value.match(/\d+(?:[.,]\d+)?/);
  return measurement ? `${measurement[0]} m²` : value.trim();
}
