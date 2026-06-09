import { createClient } from "@vocata-studio/cms-client";

const project = import.meta.env.VOCATA_PROJECT;
const apiKey = import.meta.env.VOCATA_API_KEY;
const url = import.meta.env.VOCATA_URL ?? "https://admin.vocata.studio";
const baseUrl = url.replace(/\/$/, "");

if (!project || !apiKey) {
  throw new Error(
    "Missing VOCATA_PROJECT or VOCATA_API_KEY — check .env at the project root.",
  );
}

export const vocata = createClient({
  project,
  apiKey,
  baseUrl: `${baseUrl}/api/v1`,
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

export async function getEvents(preview = false): Promise<VocataEvent[]> {
  if (preview) {
    const res = await fetch(
      `${baseUrl}/api/v1/preview/${project}/event?sort=date:asc&limit=100`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const { data } = (await res.json()) as { data: VocataEvent[] };
    return data;
  }

  const { data } = await vocata.getAll("event", {
    sort: "date:asc",
    limit: 100,
  });
  return data as unknown as VocataEvent[];
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

export async function getReviews(preview = false): Promise<VocataReview[]> {
  try {
    if (preview) {
      const res = await fetch(
        `${baseUrl}/api/v1/preview/${project}/review?sort=date:desc&limit=100`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        },
      );
      if (!res.ok) return [];
      const { data } = (await res.json()) as { data: VocataReview[] };
      return data;
    }

    const { data } = await vocata.getAll("review", {
      sort: "date:desc",
      limit: 100,
    });
    return data as unknown as VocataReview[];
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
  return `${baseUrl}/api/images/${assetId}${qs ? `?${qs}` : ""}`;
}
