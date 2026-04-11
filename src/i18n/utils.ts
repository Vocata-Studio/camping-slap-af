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

const messages: Record<Locale, Record<string, Record<string, string>>> = {
  da, en, de, nl, fr, es, it, sv, nb, pl,
};

export function t(locale: Locale, namespace: string, key: string): string {
  return messages[locale]?.[namespace]?.[key] ?? messages[en]?.[namespace]?.[key] ?? key;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/accommodation", key: "accommodation" },
  { href: "/activities", key: "activities" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export const bookingLink = { href: "/booking", key: "booking" } as const;
