import da from "../../messages/da.json";
import en from "../../messages/en.json";
import de from "../../messages/de.json";
import nl from "../../messages/nl.json";
import fr from "../../messages/fr.json";
import es from "../../messages/es.json";
import it from "../../messages/it.json";
import sv from "../../messages/sv.json";
import nb from "../../messages/nb.json";
import pl from "../../messages/pl.json";

export const locales = ["da", "en", "de", "nl", "fr", "es", "it", "sv", "nb", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "da";
export const fallbackLocale: Locale = "en";

const messages: Record<Locale, Record<string, Record<string, string>>> = {
  da, en, de, nl, fr, es, it, sv, nb, pl,
};

export function t(locale: Locale, namespace: string, key: string): string {
  return (
    messages[locale]?.[namespace]?.[key] ??
    messages[fallbackLocale]?.[namespace]?.[key] ??
    key
  );
}

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

/** Human-readable native labels for the language switcher */
export const localeLabels: Record<Locale, { native: string; short: string; flagCode: string }> = {
  da: { native: "Dansk", short: "DA", flagCode: "dk" },
  en: { native: "English", short: "EN", flagCode: "gb" },
  de: { native: "Deutsch", short: "DE", flagCode: "de" },
  nl: { native: "Nederlands", short: "NL", flagCode: "nl" },
  fr: { native: "Français", short: "FR", flagCode: "fr" },
  es: { native: "Español", short: "ES", flagCode: "es" },
  it: { native: "Italiano", short: "IT", flagCode: "it" },
  sv: { native: "Svenska", short: "SV", flagCode: "se" },
  nb: { native: "Norsk", short: "NB", flagCode: "no" },
  pl: { native: "Polski", short: "PL", flagCode: "pl" },
};

export const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/accommodation", key: "accommodation" },
  { href: "/activities", key: "activities" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export const bookingLink = {
  href: "https://camping-slap-af-booking.vercel.app/",
  key: "booking",
} as const;

/** Build an absolute path for a given locale + route (`/` or `/about`, etc.).
 *  Absolute URLs (http(s)://…) are returned as-is so they can flow through the
 *  same helper as internal routes. */
export function localePath(locale: Locale, href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  if (href === "/") return `/${locale}/`;
  return `/${locale}${href}`;
}

/**
 * Given the current pathname like `/en/about` or `/da/`, return the
 * locale-free route (`/about` or `/`). Used by the language switcher so it
 * can keep the user on the same page when switching locales.
 */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const [maybeLocale, ...rest] = segments;
  if (isValidLocale(maybeLocale)) {
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname || "/";
}
