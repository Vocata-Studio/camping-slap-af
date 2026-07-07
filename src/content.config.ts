import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog / guide articles. Danish-only content aimed at organic search
 * (Kulturmødet Mors and the surrounding tourism week). Long-form copy lives
 * in Markdown here rather than the i18n JSON files, which only hold UI strings.
 */
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/[^_]*.md" }),
  schema: z.object({
    title: z.string(),
    /** Meta description + og:description for the article. */
    description: z.string(),
    /** Short teaser shown on the blog index card. */
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Site-relative hero image path (e.g. /images/...). */
    heroImage: z.string(),
    heroImageAlt: z.string(),
    /** CSS object-position for the hero image. Defaults to "center". */
    heroImagePosition: z.string().optional(),
    /** Optional social-share image override; falls back to the hero. */
    ogImage: z.string().optional(),
    /** Rough reading time label, e.g. "5 min". */
    readingTime: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
