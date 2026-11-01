import { t } from "../i18n/utils";
import type { Locale } from "../i18n/utils";
import { absoluteUrl, pair, photo } from "../lib/site";
import type { Site } from "../lib/site";

/** Canonical site origin — single source for absolute URLs in JSON-LD. */
export const SITE_URL = "https://www.campingslapaf.dk";

export type StayType = {
  /** i18n key under the "Accommodation" namespace — name + `${key}Description`. */
  key: string;
  /** Anchor of this type's section on the /prices page. */
  anchor: string;
  /** Representative photo: site-relative, or an absolute CMS image URL. */
  image: string;
  /** Lowest price — the "from" teaser. Per night, except seasonal (per season). */
  fromDkk: number;
  fromEur: number;
  /** Seasonal pitches are priced per season; everything else per night. */
  season: boolean;
};

/** Cheapest `{name}Kr`/`{name}Eur` pair among the given names of a price group. */
function cheapest(group: Record<string, number>, names: string[]): [number, number] {
  return names
    .map((n) => pair(group, n))
    .reduce((min, p) => (p[0] < min[0] ? p : min));
}

/**
 * The five bookable stay types, with their lowest ("from") price derived from
 * the editor-managed price list. This is the single source the accommodation
 * page renders from and the JSON-LD offers are generated from, so prices never
 * drift between the prices page, the accommodation page and the structured data.
 */
export function stayTypes(site: Site): StayType[] {
  const p = site.priser;
  const img = (name: string, fallback: string) => photo(site, "overnatning", name, fallback);
  const [campDkk, campEur] = pair(p.campingplads, "voksne2");
  const [camperDkk, camperEur] = pair(p.autocamper, "voksne2");
  const [cabinDkk, cabinEur] = cheapest(p.hytter, ["hytte2", "hytte3", "hytte6", "hytte7", "hytte8", "hytte9"]);
  const [fieldDkk, fieldEur] = pair(p.teltfelt, "voksen1");
  const [seasonDkk, seasonEur] = cheapest(p.saesonplads, ["familieHel", "voksne2Hel", "voksen1Hel"]);
  return [
    { key: "campsite", anchor: "#campingplads", image: img("campingplads", "/images/location-images/campsite-field-caravan.webp"), fromDkk: campDkk, fromEur: campEur, season: false },
    { key: "camper", anchor: "#autocamper", image: img("autocamper", "/images/location-images/campsite-field-trees.webp"), fromDkk: camperDkk, fromEur: camperEur, season: false },
    { key: "cottage", anchor: "#hytter", image: img("hytter", "/billeder-fra-anders/cabins-lawn.webp"), fromDkk: cabinDkk, fromEur: cabinEur, season: false },
    { key: "field", anchor: "#campingfelt", image: img("teltfelt", "/images/location-images/campsite-open-field.webp"), fromDkk: fieldDkk, fromEur: fieldEur, season: false },
    { key: "seasonal", anchor: "#saesonplads", image: img("saesonplads", "/images/location-images/campsite-pitch-numbered.webp"), fromDkk: seasonDkk, fromEur: seasonEur, season: true },
  ];
}

/** Currency shown to a given locale — DKK to Danes, EUR to everyone else. */
function currencyFor(locale: Locale) {
  return locale === "da"
    ? { code: "DKK", price: (s: StayType) => s.fromDkk }
    : { code: "EUR", price: (s: StayType) => s.fromEur };
}

function priceLink(locale: Locale, anchor: string): string {
  return `${SITE_URL}/${locale}/prices${anchor}`;
}

/**
 * Per-accommodation `Product` nodes for the prices/accommodation pages. Each
 * carries an `AggregateOffer` whose `lowPrice` expresses the "from" teaser —
 * the shape Google reads to show a "from kr. X" price in search results.
 */
export function stayProducts(locale: Locale, site: Site, descriptions: Record<string, string> = {}) {
  const cur = currencyFor(locale);
  return stayTypes(site).map((s) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/#product-${s.key}`,
    "name": t(locale, "Accommodation", s.key),
    "description": descriptions[s.key] || t(locale, "Accommodation", `${s.key}Description`),
    "image": absoluteUrl(SITE_URL, s.image),
    "url": priceLink(locale, s.anchor),
    "category": "Camping accommodation",
    "brand": { "@type": "Brand", "name": "Camping Slap Af" },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": cur.price(s),
      "priceCurrency": cur.code,
      "availability": "https://schema.org/InStock",
      "url": priceLink(locale, s.anchor),
    },
  }));
}

/**
 * Flat `Offer` list for the business node's `makesOffer`. Self-contained (no
 * cross-graph references) so it stays valid on every page the Layout renders.
 */
export function stayMakesOffers(locale: Locale, site: Site) {
  const cur = currencyFor(locale);
  return stayTypes(site).map((s) => ({
    "@type": "Offer",
    "name": t(locale, "Accommodation", s.key),
    "price": cur.price(s),
    "priceCurrency": cur.code,
    "availability": "https://schema.org/InStock",
    "url": priceLink(locale, s.anchor),
    "itemOffered": { "@type": "Accommodation", "name": t(locale, "Accommodation", s.key) },
  }));
}
