import { defineRouting } from "next-intl/routing";

export const locales = [
  "da",
  "en",
  "de",
  "nl",
  "fr",
  "es",
  "it",
  "sv",
  "nb",
  "pl",
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  da: "Dansk",
  en: "English",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  sv: "Svenska",
  nb: "Norsk",
  pl: "Polski",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "da",
  localePrefix: "always",
});
