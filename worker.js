// Cloudflare Worker "konversaitions-site": serves the home and exit pages.
// Publishing = set SHA to the commit to publish, then upload this file.
// Pages come from jsDelivr's copy of the public GitHub repo at that exact commit,
// so a published version never changes underneath the site.
const SHA = "292cc8ae9c6fdcf58c11b343ae425aac63a13215";
const SRC = `https://cdn.jsdelivr.net/gh/innovaite/konversations@${SHA}/`;

const PAGES = {
  "/": "konversaitions_v16.html",
  "/home-preview/": "konversaitions_v16.html",
  "/exit/": "konversaitions_exitV16.html",
  "/exit-preview/": "konversaitions_exitV16.html",
};

// Images referenced by the pages, served from the same pinned commit.
const ASSETS = {
  "/hero-jungfrau.jpg": ["hero-jungfrau.jpg", "image/jpeg"],
};

// Source files link to each other by filename; the live site uses paths.
const fixLinks = (html) => html
  .replaceAll('href="konversaitions_exitV16.html"', 'href="/exit/"')
  .replaceAll('href="konversaitions_v16.html"', 'href="/"');

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    const asset = ASSETS[path];
    if (asset) {
      const img = await fetch(SRC + asset[0], { cf: { cacheTtl: 31536000, cacheEverything: true } });
      if (!img.ok) return new Response("Not found", { status: 404 });
      return new Response(img.body, { headers: { "content-type": asset[1], "cache-control": "public, max-age=86400" } });
    }
    if (path !== "/" && !path.endsWith("/")) path += "/";
    const file = PAGES[path];
    if (!file) return fetch(request);

    const cache = caches.default;
    const key = new Request(`https://konversaitions-site.cache/${SHA}/${file}`);
    let res = await cache.match(key);
    if (!res) {
      const src = await fetch(SRC + file, { cf: { cacheTtl: 31536000, cacheEverything: true } });
      if (!src.ok) return new Response("Page temporarily unavailable", { status: 503 });
      res = new Response(fixLinks(await src.text()), {
        headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "public, max-age=0, must-revalidate" },
      });
      ctx.waitUntil(cache.put(key, res.clone()));
    }
    if (request.method === "HEAD") return new Response(null, { headers: res.headers });
    return res;
  },
};
