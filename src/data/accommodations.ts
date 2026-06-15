import { t } from "../i18n/utils";
import type { Locale } from "../i18n/utils";

/** Canonical site origin — single source for absolute URLs in JSON-LD. */
export const SITE_URL = "https://campingslapaf.dk";

export type StayType = {
  /** i18n key under the "Accommodation" namespace — name + `${key}Description`. */
  key: string;
  /** Anchor of this type's section on the /prices page. */
  anchor: string;
  /** Representative photo, site-relative. */
  image: string;
  /** Lowest price — the "from" teaser. Per night, except seasonal (per season). */
  fromDkk: number;
  fromEur: number;
  /** Seasonal pitches are priced per season; everything else per night. */
  season: boolean;
};

/**
 * The five bookable stay types, with their lowest ("from") price. This is the
 * single source the accommodation page renders from and the JSON-LD offers are
 * generated from, so prices never drift between the page and the structured data.
 */
export const stayTypes: StayType[] = [
  { key: "campsite", anchor: "#campingplads", image: "/images/location-images/campsite-field-caravan.webp", fromDkk: 200, fromEur: 26.75, season: false },
  { key: "camper", anchor: "#autocamper", image: "/images/location-images/campsite-field-trees.webp", fromDkk: 256, fromEur: 34.25, season: false },
  { key: "cottage", anchor: "#hytter", image: "/billeder-fra-anders/cabins-lawn.webp", fromDkk: 300, fromEur: 40, season: false },
  { key: "field", anchor: "#campingfelt", image: "/images/location-images/campsite-open-field.webp", fromDkk: 100, fromEur: 13.4, season: false },
  { key: "seasonal", anchor: "#saesonplads", image: "/images/location-images/campsite-pitch-numbered.webp", fromDkk: 8000, fromEur: 1070.4, season: true },
];

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
export function stayProducts(locale: Locale) {
  const cur = currencyFor(locale);
  return stayTypes.map((s) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/#product-${s.key}`,
    "name": t(locale, "Accommodation", s.key),
    "description": t(locale, "Accommodation", `${s.key}Description`),
    "image": `${SITE_URL}${s.image}`,
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
export function stayMakesOffers(locale: Locale) {
  const cur = currencyFor(locale);
  return stayTypes.map((s) => ({
    "@type": "Offer",
    "name": t(locale, "Accommodation", s.key),
    "price": cur.price(s),
    "priceCurrency": cur.code,
    "availability": "https://schema.org/InStock",
    "url": priceLink(locale, s.anchor),
    "itemOffered": { "@type": "Accommodation", "name": t(locale, "Accommodation", s.key) },
  }));
}
