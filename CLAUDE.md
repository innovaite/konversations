# CLAUDE.md

Guidance for Claude Code in the KonversAItions website repo (github.com/innovaite/konversations). This file is the master copy of how the site is built, changed and published. Personal preferences live in CLAUDE.local.md (not committed).

## Who this is for

The site owner, Elisa, manages konversaitions.com and is not a developer. Explain in plain language. Show what will change before changing it. All website copy is US English.

## The site

- `konversaitions_v16.html`: home page, served at `/` and `/home-preview/`
- `konversaitions_exitV16.html`: exit page, served at `/exit/` and `/exit-preview/`
- `worker.js`: the Cloudflare Worker that serves both pages. It pins one commit (`SHA`) and fetches the pages for that commit from jsDelivr's copy of this public GitHub repo, then caches them.
- `konversaitions-content-preview.zip`: archive only. The old WordPress plugin. WordPress is retired. Do not use or rebuild it.

Hosting is Cloudflare. A Worker named `konversaitions-site` serves the four page paths. Any other path passes through to the origin.

Each HTML file is self-contained: inline `<style>`, CSS variables in `:root` (`--navy`, `--teal`, `--lteal`, `--gold`, `--surface`, `--on-navy`, `--on-navy-muted`, `--on-navy-faint`), Google Fonts Newsreader and Inter, responsive via `clamp()`, `vw` and `vmin`. Animation classes: `.fade`, `.fade.in`, `.d1` to `.d3`. Buttons: `.btn-*`.

The home hero carries an inline SVG illustration (`.hero-art`): mountain ridges at sunrise, contour lines, a dashed route to a summit flag. Faded at 1100px and below, hidden at 900px and below.

Do not add frameworks or external CSS or JavaScript libraries. Keep the existing colors, fonts and layout unless a design change is requested.

### Links differ between source and live

The source files link to each other by filename so they work when opened locally. `worker.js` swaps them for `/exit/` and `/` as it serves them. Never edit the links in the source files by hand.

## When asked for a change

1. `git pull`.
2. Find the text or section meant. If more than one match, quote the matches and ask which one.
3. Describe the change in plain words before making it.
4. Edit the source HTML file.
5. `open <file>` and say what to check, including phone width. Headless Chrome screenshots at 1440, 1000 and 390 px widths are a useful self-check (Chrome crops below about 500 px, so compare against a before shot).
6. Commit with a clear message and `git push`. Every change is committed and pushed. Pushing to GitHub does not change the live site; only a publish does.

## When asked to "publish"

Publishing goes through the Cloudflare connector in Claude Code (`mcp__cloudflare__execute`, signed in as Elisa). The keychain tokens are a fallback: `cloudflare-konv-purge` purges the cache; `cloudflare-konv-deploy` has zone-level rights only. Never print, echo or save a token; pass it to curl through `-K -`.

1. Make sure the changes are committed and pushed. Note the full commit hash (`git rev-parse HEAD`).
2. Check jsDelivr serves that commit byte for byte: compare `shasum -a 256` of `https://cdn.jsdelivr.net/gh/innovaite/konversations@<hash>/<file>` with the local file, for both pages.
3. Set `SHA` in `worker.js` to that hash, commit and push.
4. Upload `worker.js` with the connector: `PUT /accounts/<account>/workers/scripts/konversaitions-site`, multipart, metadata `{"main_module":"worker.js","compatibility_date":"2026-10-01"}`. Check the uploaded text's SHA-256 inside the call before sending.
5. Check the preview with curl: `https://konversaitions-site.konversaitions.workers.dev/` and `/exit/` show the new text and no local file links.
6. Purge the konversaitions.com cache: `POST /zones/47b56f954e8fce8ce86be68ea3756685/purge_cache` with `{"purge_everything":true}`.
7. Check `/` and `/exit/` on konversaitions.com, then have the owner look.

Routes (one-time, only with the owner's approval): `konversaitions.com/`, `konversaitions.com/exit*`, `konversaitions.com/home-preview*`, `konversaitions.com/exit-preview*`, all to `konversaitions-site`. A route can only point at a Worker in the same account as the zone.

## Rules

- Never put passwords, tokens or logins in any file, commit or chat.
- Do not delete sections or pages without asking.
- On Cloudflare, only upload the `konversaitions-site` Worker, manage its routes on konversaitions.com, and purge the cache. Never change DNS or any other setting.
- If something breaks, show `git log` and offer to roll back. On Cloudflare, removing the Worker routes returns the four paths to the origin.

## Status and open items (2026-11-17)

- The konversaitions.com zone lives in a Cloudflare account Elisa does not own (ID starts `5f0fce`). Her role there is Domain Administrator plus Workers Routes Write, with no right to create Workers. Upload there fails with "No access to the specified resource". Fix: the account owner gives Elisa's login a Workers role (for example Workers Admin). Owner: the account owner.
- Until then `konversaitions-site` runs in Elisa's own account (ID starts `1271ef`) as a preview only, at https://konversaitions-site.konversaitions.workers.dev. It cannot be routed to konversaitions.com from there.
- The live site still answers from a PHP origin (`x-httpd-modphp: 1`) with older content. Who runs it, and whether anything else on it is still needed, is unconfirmed.
