import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://campingslapaf.dk",
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => page !== "https://campingslapaf.dk/",
      i18n: {
        defaultLocale: "da",
        locales: {
          da: "da-DK",
          en: "en-US",
          de: "de-DE",
          nl: "nl-NL",
          fr: "fr-FR",
          es: "es-ES",
          it: "it-IT",
          sv: "sv-SE",
          nb: "nb-NO",
          pl: "pl-PL",
        },
      },
    }),
  ],
  i18n: {
    locales: ["da", "en", "de", "nl", "fr", "es", "it", "sv", "nb", "pl"],
    defaultLocale: "da",
    routing: {
      prefixDefaultLocale: true,
      // We serve a custom /index.astro that does client-side browser-language
      // detection. Disable Astro's automatic / -> /da/ redirect so our page wins.
      redirectToDefaultLocale: false,
    },
  },
});
