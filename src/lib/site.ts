/**
 * Editor-managed site facts (contact details, prices, season dates, page
 * photos, gallery) read from Vocata CMS at request time.
 *
 * Fallbacks: the seed files in /content hold exactly the values the site
 * shipped with, and they are imported here as the defaults. Every field is
 * merged one by one — a missing, empty or malformed CMS value (or an
 * unreachable CMS) shows the built-in value instead, so the page never goes
 * blank. Images can't be seeded; an empty image field keeps the current photo.
 */
import kontaktSeed from "../../content/kontakt.json";
import priserSeed from "../../content/priser.json";
import type { Locale } from "../i18n/utils";
import { fetchDocs, fetchSingleton, imageUrl, memo } from "./vocata";
import type { VocataImage } from "./vocata";

export type Kontakt = typeof kontaktSeed.data;
export type Priser = typeof priserSeed.data;
type ImageGroups = Record<string, Record<string, VocataImage | undefined>>;

export interface Site {
  kontakt: Kontakt;
  priser: Priser;
  billeder: ImageGroups;
}

export const DEFAULT_KONTAKT: Kontakt = kontaktSeed.data;
export const DEFAULT_PRISER: Priser = priserSeed.data;

/* ---- field-by-field merge ------------------------------------------- */

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Keep the default's shape; take each CMS value only if it's usable. */
function mergeLike<T>(defaults: T, cms: unknown): T {
  if (!isObj(defaults) || !isObj(cms)) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [k, def] of Object.entries(defaults)) {
    const v = cms[k];
    if (typeof def === "number") {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) out[k] = v;
    } else if (typeof def === "string") {
      if (typeof v !== "string" || v.trim() === "") continue;
      if (DATE_ONLY.test(def) && !DATE_ONLY.test(v)) continue;
      out[k] = v.trim();
    } else if (isObj(def)) {
      out[k] = mergeLike(def, v);
    }
  }
  return out as T;
}

function isImage(v: unknown): v is VocataImage {
  return isObj(v) && typeof v.assetId === "string" && v.assetId !== "";
}

function pickImages(cms: unknown): ImageGroups {
  const out: ImageGroups = {};
  if (!isObj(cms)) return out;
  for (const [group, fields] of Object.entries(cms)) {
    if (!isObj(fields)) continue;
    out[group] = {};
    for (const [name, img] of Object.entries(fields)) {
      if (isImage(img)) out[group][name] = img;
    }
  }
  return out;
}

/** All site facts for this request — fetched once, shared by layout + page. */
export function getSite(locals: App.Locals): Promise<Site> {
  return memo(locals, "site", async () => {
    const [kontakt, priser, billeder] = await Promise.all([
      fetchSingleton<Kontakt>("kontakt", locals.preview),
      fetchSingleton<Priser>("priser", locals.preview),
      fetchSingleton<ImageGroups>("sidebilleder", locals.preview),
    ]);
    return {
      kontakt: mergeLike(DEFAULT_KONTAKT, kontakt),
      priser: mergeLike(DEFAULT_PRISER, priser),
      billeder: pickImages(billeder),
    };
  });
}

/* ---- contact helpers ------------------------------------------------ */

export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;

/** "Kærvang 7, Sejerslev, 7900 Nykøbing M" */
export const addressLine = (k: Kontakt) =>
  `${k.gade}, ${k.lokalitet}, ${k.postnr} ${k.postby}`;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Replace `from` with `to` only where it isn't glued to a following letter/digit. */
function replaceWhole(text: string, from: string, to: string): string {
  if (from === to) return text;
  return text.replace(new RegExp(`${escapeRe(from)}(?![\\p{L}\\p{N}])`, "gu"), () => to);
}

/**
 * Swap the built-in contact facts inside a translated string for the CMS
 * values. Unchanged CMS values leave the string byte-for-byte identical, and
 * every language stays correct without retranslating.
 */
export function withKontakt(text: string, k: Kontakt): string {
  const d = DEFAULT_KONTAKT;
  let out = replaceWhole(text, addressLine(d), addressLine(k));
  out = replaceWhole(out, d.gade, k.gade);
  out = replaceWhole(out, d.telefon, k.telefon);
  out = replaceWhole(out, d.telefon.replace(/\s+/g, ""), k.telefon.replace(/\s+/g, ""));
  out = replaceWhole(out, d.email, k.email);
  out = replaceWhole(out, d.cvr, k.cvr);
  return out;
}

/* ---- price helpers -------------------------------------------------- */

/** Price shown to a locale: DKK to Danes, EUR to everyone else. */
export function formatPrice(locale: Locale, dkk: number, eur: number): string {
  if (locale === "da") {
    return `${Math.round(dkk).toLocaleString("da-DK")} kr.`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: eur % 1 === 0 ? 0 : 2,
  }).format(eur);
}

/** Read a `{name}Kr` / `{name}Eur` pair out of a price group. */
export function pair(group: Record<string, number>, name: string): [number, number] {
  return [group[`${name}Kr`], group[`${name}Eur`]];
}

/** Day + month of a YYYY-MM-DD date in the site's per-locale style. */
function dayMonth(iso: string, locale: Locale): string {
  const [, m, d] = iso.split("-").map(Number);
  return locale === "de" ? `${d}.${m}.` : `${d}/${m}`;
}

const range = (start: string, end: string, locale: Locale) =>
  `${dayMonth(start, locale)} – ${dayMonth(end, locale)}`;

/** Swap the built-in season range inside a translated label for the CMS dates. */
export function withSeason(
  text: string,
  locale: Locale,
  which: "hel" | "halv",
  priser: Priser,
): string {
  const d = DEFAULT_PRISER.saeson;
  const s = priser.saeson;
  const from = which === "hel" ? range(d.helStart, d.helSlut, locale) : range(d.halvStart, d.halvSlut, locale);
  const to = which === "hel" ? range(s.helStart, s.helSlut, locale) : range(s.halvStart, s.halvSlut, locale);
  return text.split(from).join(to);
}

/* ---- image helpers -------------------------------------------------- */

/** A page photo: the CMS image when set, otherwise the built-in file. */
export function photo(
  site: Site,
  group: string,
  name: string,
  fallback: string,
  width = 1600,
): string {
  const img = site.billeder[group]?.[name];
  return img ? imageUrl(img.assetId, { w: width, q: 80, f: "webp" }) : fallback;
}

/** `srcset` for a responsive photo, or the built-in one when no CMS image. */
export function photoSrcset(
  site: Site,
  group: string,
  name: string,
  fallback: string,
): string {
  const img = site.billeder[group]?.[name];
  if (!img) return fallback;
  return [800, 1600]
    .map((w) => `${imageUrl(img.assetId, { w, q: 80, f: "webp" })} ${w}w`)
    .join(", ");
}

/** Alt text: the editor's alt on a CMS image, otherwise the built-in alt. */
export function photoAlt(site: Site, group: string, name: string, fallback: string): string {
  const alt = site.billeder[group]?.[name]?.alt?.trim();
  return alt ? alt : fallback;
}

/** Absolute URL for JSON-LD / Open Graph: CMS URLs are already absolute. */
export const absoluteUrl = (siteUrl: string, src: string) =>
  /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`;

/* ---- gallery -------------------------------------------------------- */

export interface GalleryDoc {
  billede?: VocataImage;
  billedtekstDa?: string;
  billedtekstEn?: string;
  noegle?: string;
}

/** Gallery entries in studio order, or `null` to use the built-in gallery. */
export function getGallery(locals: App.Locals): Promise<GalleryDoc[] | null> {
  return memo(locals, "gallery", async () => {
    const docs = await fetchDocs<GalleryDoc>("galleribillede", { limit: "100" }, locals.preview);
    if (!docs || docs.length === 0) return null;
    return docs.map((d) => (isObj(d.data) ? d.data : {}));
  });
}

export function cmsImageUrl(img: VocataImage | undefined, width = 1600): string | null {
  return isImage(img) ? imageUrl(img.assetId, { w: width, q: 80, f: "webp" }) : null;
}
