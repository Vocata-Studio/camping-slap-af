// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, …),
// so they recrawl right after a production deploy. Google doesn't support
// IndexNow; it picks changes up from the sitemap's <lastmod> instead.
//
// Run by .github/workflows/indexnow.yml once Vercel reports a successful
// production deployment. The key must match public/<key>.txt.

const KEY = "802bdc767e189f83934a11fce64a52ae";

// www is the primary domain (the apex redirects to it), and IndexNow wants the
// key file and URLs on the host that actually serves them. Must match `site`
// in astro.config.mjs.
const SITE = "https://www.campingslapaf.dk";

async function locs(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const sitemaps = await locs(`${SITE}/sitemap-index.xml`);
const urlList = (await Promise.all(sitemaps.map(locs)))
  .flat()
  .map((u) => SITE + new URL(u).pathname);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs -> ${res.status}`);
// 200 = accepted, 202 = accepted while the key is still being verified.
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
