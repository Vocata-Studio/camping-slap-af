import { defineMiddleware } from "astro:middleware";
import { verifyPreviewToken } from "./lib/preview-token";

/**
 * Enter live-preview mode when a valid `?vocata-preview=<token>` is present.
 * The token is validated locally against VOCATA_PREVIEW_SECRET; on success
 * `locals.preview` is set so pages fetch CMS drafts instead of published
 * content. Invalid/expired tokens are ignored (falls back to published).
 */
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.preview = false;

  const token = context.url.searchParams.get("vocata-preview");
  if (token) {
    const secret = import.meta.env.VOCATA_PREVIEW_SECRET;
    const slug = import.meta.env.VOCATA_PROJECT;
    if (
      secret &&
      slug &&
      (await verifyPreviewToken(token, slug, secret, Date.now()))
    ) {
      context.locals.preview = true;
    }
  }

  const response = await next();

  // Pages are server-rendered so CMS edits show without a rebuild. Let the CDN
  // keep a page for a minute and serve the cached copy while it refreshes, so
  // visitors never wait on the CMS; drafts in preview mode are never cached.
  if (!context.isPrerendered && !context.url.pathname.startsWith("/api/")) {
    try {
      if (context.locals.preview) {
        response.headers.set("Cache-Control", "private, no-store");
      } else if (
        response.status === 200 &&
        context.request.method === "GET" &&
        !response.headers.has("Cache-Control")
      ) {
        response.headers.set(
          "Cache-Control",
          "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
        );
      }
    } catch {
      // Some responses (e.g. redirects) have immutable headers — leave them.
    }
  }

  return response;
});
