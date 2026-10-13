import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/vite";

// Real per-post modification dates for the sitemap's <lastmod>, read from the
// blog frontmatter (updatedDate, falling back to pubDate). Only pages with a
// trustworthy date get one; Google ignores lastmod on sites where it's noisy.
const BLOG_DIR = "./src/content/blog";
const blogLastmod = new Map(
  readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const fm = readFileSync(`${BLOG_DIR}/${f}`, "utf8");
      const date =
        fm.match(/^updatedDate:\s*(\S+)/m)?.[1] ?? fm.match(/^pubDate:\s*(\S+)/m)?.[1];
      return [f.replace(/\.md$/, ""), new Date(date).toISOString()];
    }),
);
const latestBlogLastmod = [...blogLastmod.values()].sort().at(-1);

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
      serialize(item) {
        const slug = item.url.match(/\/da\/blog\/([^/]+)\/?$/)?.[1];
        if (slug && blogLastmod.has(slug)) item.lastmod = blogLastmod.get(slug);
        else if (/\/da\/blog\/?$/.test(item.url)) item.lastmod = latestBlogLastmod;
        return item;
      },
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