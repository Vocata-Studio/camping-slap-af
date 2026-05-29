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
  { href: "/priser", key: "prices" },
  { href: "/activities", key: "activities" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

const BOOKING_APP_BASE = "https://camping-slap-af-booking.vercel.app";

/**
 * Locale-aware URL to the booking app — keeps the user's chosen language.
 * TEMP: until the booking app is live, every "Book now" CTA routes to the
 * contact page instead. To restore, return `${BOOKING_APP_BASE}/${locale}`.
 */
export function bookingHref(locale: Locale): string {
  return `/${locale}/contact`;
}

export const bookingLink = {
  href: BOOKING_APP_BASE,
  key: "booking",
} as const;

/** Google "write a review" link for Camping Slap Af (opens the review dialog). */
export const googleReviewUrl =
  "https://search.google.com/local/writereview?placeid=ChIJ849Q4CR1SUYRBfNssNr_jZ8";

const contactUiMessages = {
  da: {
    copy: "kopier",
    copied: "Kopieret",
    emailCopied: "E-mail kopieret",
    phoneCopied: "Telefonnummer kopieret",
    cvrCopied: "CVR-nummer kopieret",
    copyFailed: "Kunne ikke kopiere",
  },
  en: {
    copy: "copy",
    copied: "Copied",
    emailCopied: "Email copied",
    phoneCopied: "Phone number copied",
    cvrCopied: "CVR number copied",
    copyFailed: "Couldn't copy",
  },
  de: {
    copy: "kopieren",
    copied: "Kopiert",
    emailCopied: "E-Mail kopiert",
    phoneCopied: "Telefonnummer kopiert",
    cvrCopied: "CVR-Nummer kopiert",
    copyFailed: "Kopieren fehlgeschlagen",
  },
  nl: {
    copy: "kopieer",
    copied: "Gekopieerd",
    emailCopied: "E-mailadres gekopieerd",
    phoneCopied: "Telefoonnummer gekopieerd",
    cvrCopied: "CVR-nummer gekopieerd",
    copyFailed: "Kopieren mislukt",
  },
  fr: {
    copy: "copier",
    copied: "Copie effectuee",
    emailCopied: "E-mail copie",
    phoneCopied: "Numero de telephone copie",
    cvrCopied: "Numero CVR copie",
    copyFailed: "Copie impossible",
  },
  es: {
    copy: "copiar",
    copied: "Copiado",
    emailCopied: "Correo copiado",
    phoneCopied: "Numero de telefono copiado",
    cvrCopied: "Numero CVR copiado",
    copyFailed: "No se pudo copiar",
  },
  it: {
    copy: "copia",
    copied: "Copiato",
    emailCopied: "Email copiata",
    phoneCopied: "Numero di telefono copiato",
    cvrCopied: "Numero CVR copiato",
    copyFailed: "Impossibile copiare",
  },
  sv: {
    copy: "kopiera",
    copied: "Kopierat",
    emailCopied: "E-post kopierad",
    phoneCopied: "Telefonnummer kopierat",
    cvrCopied: "CVR-nummer kopierat",
    copyFailed: "Kunde inte kopiera",
  },
  nb: {
    copy: "kopier",
    copied: "Kopiert",
    emailCopied: "E-post kopiert",
    phoneCopied: "Telefonnummer kopiert",
    cvrCopied: "CVR-nummer kopiert",
    copyFailed: "Kunne ikke kopiere",
  },
  pl: {
    copy: "kopiuj",
    copied: "Skopiowano",
    emailCopied: "Email skopiowany",
    phoneCopied: "Numer telefonu skopiowany",
    cvrCopied: "Numer CVR skopiowany",
    copyFailed: "Nie udalo sie skopiowac",
  },
} as const satisfies Record<Locale, {
  copy: string;
  copied: string;
  emailCopied: string;
  phoneCopied: string;
  cvrCopied: string;
  copyFailed: string;
}>;

/** Build an absolute path for a given locale + route (`/` or `/about`, etc.).
 *  Absolute URLs (http(s)://…) are returned as-is so they can flow through the
 *  same helper as internal routes. */
export function localePath(locale: Locale, href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  if (href === "/") return `/${locale}/`;
  return `/${locale}${href}`;
}

export function contactUi(locale: Locale) {
  return contactUiMessages[locale] ?? contactUiMessages[fallbackLocale];
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
