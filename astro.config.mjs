import { defineConfig } from "astro/config";

export default defineConfig({
  i18n: {
    locales: ["da", "en", "de", "nl", "fr", "es", "it", "sv", "nb", "pl"],
    defaultLocale: "da",
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
