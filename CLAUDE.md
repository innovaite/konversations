# CLAUDE.md

Guidance for Claude Code in the KonversAItions website repo (github.com/innovaite/konversations). This file is the master copy of how the site is built, changed and published. Personal preferences live in CLAUDE.local.md (not committed).

## Who this is for

The site owner, Elisa, manages konversaitions.com and is not a developer. Explain in plain language. Show what will change before changing it. All website copy is US English.

## The site

- `konversaitions_v16.html`: home page, served at `/` and `/home-preview/`
- `konversaitions_exitV16.html`: exit page, served at `/exit/` and `/exit-preview/`
- `build_worker.py`: builds the Cloudflare Worker that serves both pages
- `konversaitions-content-preview.zip`: archive only. The old WordPress plugin. WordPress is retired. Do not use or rebuild it.

Hosting is Cloudflare. A Worker named `konversaitions-site` serves the four page paths. Any other path passes through to the origin.

Each HTML file is self-contained: inline `<style>`, CSS variables in `:root` (`--navy`, `--teal`, `--lteal`, `--gold`, `--surface`, `--on-navy`, `--on-navy-muted`, `--on-navy-faint`), Google Fonts Newsreader and Inter, responsive via `clamp()`, `vw` and `vmin`. Animation classes: `.fade`, `.fade.in`, `.d1` to `.d3`. Buttons: `.btn-*`.

The home hero carries an inline SVG illustration (`.hero-art`): mountain ridges at sunrise, contour lines, a dashed route to a summit flag. Faded at 1100px and below, hidden at 900px and below.

Do not add frameworks or external CSS or JavaScript libraries. Keep the existing colors, fonts and layout unless a design change is requested.

### Links differ between source and live

The source files link to each other by filename so they work when opened locally. `build_worker.py` swaps them for `/exit/` and `/` and refuses to build if any local link remains. Never edit the links in the source files by hand.

## When asked for a change

1. `git pull`.
2. Find the text or section meant. If more than one match, quote the matches and ask which one.
3. Describe the change in plain words before making it.
4. Edit the source HTML file.
5. `open <file>` and say what to check, including phone width. Headless Chrome screenshots at 1440, 1000 and 390 px widths are a useful self-check (Chrome crops below about 500 px, so compare against a before shot).
6. Commit with a clear message and `git push`. Every change is committed and pushed. Pushing to GitHub does not change the live site; only a publish does.

## When asked to "publish"

Two tokens live in the macOS keychain. Read them inside the command, pass them to curl through `-K -` on stdin (never on the command line), and never print, echo or save them.
- `cloudflare-konv-deploy`: Workers upload and routes
- `cloudflare-konv-purge`: cache purge and zone lookup

Steps:
1. `python3 -I build_worker.py <scratchpad>/worker.js`
2. Upload: `PUT /accounts/<account_id>/workers/scripts/konversaitions-site`, multipart with `metadata` = `{"main_module":"worker.js","compatibility_date":"2026-10-01"}` and `worker.js` as `application/javascript+module`. Get the account ID from `GET /zones?name=konversaitions.com`.
3. Routes (first publish only, and only after the owner approves the preview): `konversaitions.com/`, `konversaitions.com/exit*`, `konversaitions.com/home-preview*`, `konversaitions.com/exit-preview*`, all to `konversaitions-site`.
4. Purge the cache: `POST /zones/<zone_id>/purge_cache` with `{"purge_everything":true}`. If the API fails, walk through Cloudflare dashboard > konversaitions.com > Caching > Configuration > Purge Everything.
5. Check from the terminal that `/` and `/exit/` serve the new text, then have the owner check `/`, `/exit/` and the links between them.

## Rules

- Never put passwords, tokens or logins in any file, commit or chat.
- Do not delete sections or pages without asking.
- On Cloudflare, only upload the `konversaitions-site` Worker, manage its routes on konversaitions.com, and purge the cache. Never change DNS or any other setting.
- If something breaks, show `git log` and offer to roll back. On Cloudflare, removing the Worker routes returns the four paths to the origin.

## Status and open items (2026-11-17)

- The Worker has never been uploaded. The deploy token sees the konversaitions.com zone but no account, and Cloudflare refuses the upload with "No access to the specified resource". It needs an account-level policy for the account that owns the zone, with Workers Scripts: Edit. Owner: Elisa, or the Cloudflare account owner if Elisa's login has zone-only access.
- As of 2026-11-17 the live site still answers from a PHP origin (`x-httpd-modphp: 1`, WordPress-style no-cache header) with older content. Once the Worker routes are live, `/` and `/exit/` stop depending on it. Who runs that origin, and whether anything else on it is still needed, is unconfirmed.
