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

export interface VocataImage {
  assetId: string;
  url?: string;
  alt?: string;
}

export interface VocataEvent {
  id: string;
  data: {
    titleDa: string;
    titleEn: string | null;
    date: string;
    descriptionDa: string | null;
    descriptionEn: string | null;
    image: VocataImage | null;
  };
}

export async function getEvents(): Promise<VocataEvent[]> {
  const { data } = await vocata.getAll("event", {
    sort: "date:asc",
    limit: 100,
  });
  return data as VocataEvent[];
}

export interface VocataReview {
  id: string;
  data: {
    name: string;
    location: string | null;
    rating: number | null;
    quoteDa: string;
    quoteEn: string | null;
    date: string | null;
  };
}

// Reviews are optional content — if the schema hasn't been deployed yet, or the
// content type returns nothing, fall back to an empty list so the site still
// builds. Network/auth errors are swallowed for the same reason.
export async function getReviews(): Promise<VocataReview[]> {
  try {
    const { data } = await vocata.getAll("review", {
      sort: "date:desc",
      limit: 100,
    });
    return data as VocataReview[];
  } catch {
    return [];
  }
}

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
