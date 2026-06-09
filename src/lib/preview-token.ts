/**
 * Validate a Vocata live-preview token locally — no callback to the CMS.
 *
 * The CMS mints `<exp>.<base64url(HMAC-SHA256(`<slug>.<exp>`, secret))>` where
 * `exp` is epoch ms and the secret is the project's preview secret (shared with
 * this site as VOCATA_PREVIEW_SECRET). Implemented with Web Crypto so it runs
 * in both edge and node Astro runtimes.
 */

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64url(new Uint8Array(sig));
}

export async function verifyPreviewToken(
  token: string,
  slug: string,
  secret: string,
  now: number
): Promise<boolean> {
  if (!token || !secret) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const exp = Number(token.slice(0, dot));
  const providedSig = token.slice(dot + 1);
  if (!Number.isFinite(exp) || exp <= now) return false;

  const expectedSig = await sign(`${slug}.${exp}`, secret);
  return providedSig === expectedSig;
}
