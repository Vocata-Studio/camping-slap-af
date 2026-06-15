import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://campingslapaf.dk",
  adapter: vercel(),

  // The prices page moved from the Danish slug /priser to the universal /prices.
  // Permanent-redirect the old localized paths so nothing 404s post-launch.
  redirects: {
    "/[locale]/priser": "/[locale]/prices",
  },

  integrations: [
    sitemap({
      // Drop the bare root and the noindexed legal pages (terms/privacy/accessibility)
      // so we never submit URLs we've told search engines not to index.
      filter: (page) =>
        page !== "https://campingslapaf.dk/" &&
        !/\/(terms|privacy|accessibility)\/?$/.test(page),
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

  vite: {
    plugins: [tailwindcss()],
  },
});