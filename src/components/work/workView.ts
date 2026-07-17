export type WorkViewMode = "composition" | "index" | "field";

export const workViewModes: ReadonlyArray<{
  id: WorkViewMode;
  label: string;
  shortLabel: string;
}> = [
  { id: "composition", label: "Mosaic project view", shortLabel: "Mosaic" },
  { id: "index", label: "Ledger project view", shortLabel: "Ledger" },
  { id: "field", label: "Atlas project view", shortLabel: "Atlas" },
];
