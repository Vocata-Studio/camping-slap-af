import { defineConfig } from "astro/config";

export default defineConfig({
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
