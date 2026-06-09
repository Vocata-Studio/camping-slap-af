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

  return next();
});
