import { createClient } from "@vocata-studio/cms-client";

const project = import.meta.env.VOCATA_PROJECT;
const apiKey = import.meta.env.VOCATA_API_KEY;
const url = import.meta.env.VOCATA_URL ?? "https://admin.vocata.studio";

if (!project || !apiKey) {
  throw new Error(
    "Missing VOCATA_PROJECT or VOCATA_API_KEY — check .env at the project root.",
  );
}

export const vocata = createClient({
  project,
  apiKey,
  baseUrl: `${url.replace(/\/$/, "")}/api/v1`,
});

export const CMS_URL = url;

export function imageUrl(
  assetId: string,
  opts: { w?: number; h?: number; q?: number; f?: "webp" | "jpeg" | "png" | "avif" } = {},
): string {
  const params = new URLSearchParams();
  if (opts.w) params.set("w", String(opts.w));
  if (opts.h) params.set("h", String(opts.h));
  if (opts.q) params.set("q", String(opts.q));
  if (opts.f) params.set("f", opts.f);
  const qs = params.toString();
  return `${CMS_URL.replace(/\/$/, "")}/api/images/${assetId}${qs ? `?${qs}` : ""}`;
}
