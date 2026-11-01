/**
 * Vocata CMS access for request-time (SSR) rendering.
 *
 * Every fetch is defensive: a slow, failing or unreachable CMS resolves to
 * `null`/`[]` instead of throwing, and callers fall back to the site's built-in
 * content — so a CMS outage never blanks a page.
 *
 * Published reads send the key as `X-Vocata-Key` (not `Authorization`): only
 * then does the CMS edge-cache the response, and it purges that cache itself
 * on publish. Preview reads hit the drafts endpoint uncached.
 */

const project = import.meta.env.VOCATA_PROJECT;
const apiKey = import.meta.env.VOCATA_API_KEY;
const url = import.meta.env.VOCATA_URL ?? "https://admin.vocata.studio";
const baseUrl = url.replace(/\/$/, "");

if (!project || !apiKey) {
  throw new Error(
    "Missing VOCATA_PROJECT or VOCATA_API_KEY — check .env at the project root.",
  );
}

export const CMS_URL = url;

/** Give up on the CMS after this long and render the built-in content. */
const TIMEOUT_MS = 2500;

export interface VocataImage {
  assetId: string;
  url?: string;
  alt?: string;
}

export interface VocataDoc<T> {
  id: string;
  data: T;
}

/**
 * Fetch one page of documents of a type. Returns `null` on any failure
 * (network, timeout, non-2xx, malformed body) so callers can fall back.
 */
export async function fetchDocs<T>(
  type: string,
  query: Record<string, string>,
  preview: boolean,
): Promise<VocataDoc<T>[] | null> {
  const qs = new URLSearchParams(query).toString();
  const endpoint = preview
    ? `${baseUrl}/api/v1/preview/${project}/${type}?${qs}`
    : `${baseUrl}/api/v1/${project}/${type}?${qs}`;
  try {
    const res = await fetch(endpoint, {
      headers: preview
        ? { Authorization: `Bearer ${apiKey}` }
        : { "X-Vocata-Key": apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(preview ? { cache: "no-store" as RequestCache } : {}),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: unknown };
    return Array.isArray(body.data) ? (body.data as VocataDoc<T>[]) : null;
  } catch {
    return null;
  }
}

/** A singleton's data (its oldest document, like the studio), or `null`. */
export async function fetchSingleton<T>(
  type: string,
  preview: boolean,
): Promise<Partial<T> | null> {
  const docs = await fetchDocs<Partial<T>>(
    type,
    { sort: "createdAt:asc", limit: "1" },
    preview,
  );
  const data = docs?.[0]?.data;
  return data && typeof data === "object" ? data : null;
}

/**
 * Per-request memo. Layout, page and components each ask for the same CMS
 * data; keying on `Astro.locals` (one object per request) makes that a single
 * fetch per type per request.
 */
const requestMemo = new WeakMap<object, Map<string, Promise<unknown>>>();

export function memo<T>(locals: object, key: string, load: () => Promise<T>): Promise<T> {
  let entries = requestMemo.get(locals);
  if (!entries) {
    entries = new Map();
    requestMemo.set(locals, entries);
  }
  if (!entries.has(key)) entries.set(key, load());
  return entries.get(key) as Promise<T>;
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

export function getEvents(locals: App.Locals): Promise<VocataEvent[]> {
  return memo(locals, "events", async () =>
    ((await fetchDocs<VocataEvent["data"]>(
      "event",
      { sort: "date:asc", limit: "100" },
      locals.preview,
    )) ?? []) as VocataEvent[],
  );
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

export function getReviews(locals: App.Locals): Promise<VocataReview[]> {
  return memo(locals, "reviews", async () =>
    ((await fetchDocs<VocataReview["data"]>(
      "review",
      { sort: "date:desc", limit: "100" },
      locals.preview,
    )) ?? []) as VocataReview[],
  );
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
