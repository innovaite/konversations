# CLAUDE.md

Guidance for Claude Code in the KonversAItions website repo. This file is the master copy of how the site is built, changed and published. Personal preferences live in CLAUDE.local.md (not committed).

## Who this is for

The site owner, Elisa, manages konversaitions.com and is not a developer. Explain in plain language. Show what will change before changing it. All website copy is US English.

## The site

- `konversaitions_v16.html`: home page, served at `/` and `/home-preview/`
- `konversaitions_exitV16.html`: exit page, served at `/exit/` and `/exit-preview/`
- `konversaitions-content-preview.zip`: the WordPress plugin. Contains `konversaitions-content-preview/` with `konversaitions-content-preview.php` (v1.1 routing), `home.html` and `exit.html`.

WordPress hosts the site but does not render it. The plugin intercepts `/`, `/exit/`, `/home-preview/` and `/exit-preview/` and serves `home.html` or `exit.html` raw. A legacy plugin, "KonversAItions Raw HTML Pages" v1.0, is also installed. Cloudflare sits in front and caches pages.

Each HTML file is self-contained: inline `<style>`, CSS variables in `:root` (`--navy`, `--teal`, `--lteal`, `--gold`, `--surface`, `--on-navy`, `--on-navy-muted`, `--on-navy-faint`), Google Fonts Newsreader and Inter, responsive via `clamp()`, `vw` and `vmin`. Animation classes: `.fade`, `.fade.in`, `.d1` to `.d3`. Buttons: `.btn-*`.

Do not add frameworks or external CSS or JavaScript libraries. Keep the existing colors, fonts and layout unless a design change is requested.

### Links differ between source and ZIP

The source files link to each other by filename so they work when opened locally:
- home links to `konversaitions_exitV16.html`
- exit links to `konversaitions_v16.html`

The copies inside the ZIP must use site paths instead: `/exit/` and `/`. A straight copy breaks navigation on the live site. The publish steps below handle this.

## When asked for a change

1. `git pull`.
2. Find the text or section meant. If more than one match, quote the matches and ask which one.
3. Describe the change in plain words before making it.
4. Edit the source HTML file.
5. `open <file>` and say what to check, including how it looks at phone width (narrow the browser window, or Safari: Develop > Enter Responsive Design Mode).
6. Commit with a clear message and `git push`. Every change is committed and pushed. Pushing to GitHub does not change the live site; only a publish does.

## When asked to "publish"

1. Rebuild the ZIP in a temp folder:
   - unzip the existing ZIP
   - copy `konversaitions_v16.html` to `home.html` and `konversaitions_exitV16.html` to `exit.html`
   - in `home.html` replace `href="konversaitions_exitV16.html"` with `href="/exit/"`
   - in `exit.html` replace `href="konversaitions_v16.html"` with `href="/"`
   - leave the PHP file untouched
   - re-zip with `konversaitions-content-preview/` as the top folder
2. Check before handing over: `grep` shows no `konversaitions_v16.html` or `konversaitions_exitV16.html` left in the ZIP copies, and the PHP file is byte-identical to the previous ZIP.
3. Replace the repo ZIP, copy it to `~/Desktop`, commit and push.
4. Walk through the upload one step at a time:
   `konversaitions.com/wp-admin/plugin-install.php?tab=upload` > Choose File > the ZIP on the Desktop > Install Now > "Replace current with uploaded" > confirm the plugin is active. The upload page has a CAPTCHA, so it is always done by hand in the browser.
5. When told it is uploaded, purge the Cloudflare cache. The token is in the macOS keychain. Read it inside the command and never print, echo or save it:
   ```
   TOKEN=$(security find-generic-password -s cloudflare-konv-purge -w)
   ZONE=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.cloudflare.com/client/v4/zones?name=konversaitions.com" | python3 -c 'import sys,json;print(json.load(sys.stdin)["result"][0]["id"])')
   curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" --data '{"purge_everything":true}' | python3 -c 'import sys,json;d=json.load(sys.stdin);print("Purge succeeded" if d.get("success") else d.get("errors"))'
   ```
   Run all three lines in one shell call. Report whether it succeeded. If the API fails, walk through Cloudflare dashboard > konversaitions.com > Caching > Configuration > Purge Everything.
6. Have the owner check `/home-preview/` and `/exit-preview/`, then `/` and `/exit/`, including the links between the two pages.

## Rules

- Never put passwords, tokens or logins in any file, commit or chat.
- Do not delete sections, pages or the PHP plugin file without asking.
- Never change Cloudflare DNS or any Cloudflare setting other than the cache.
- If something breaks, show `git log` and offer to roll back to the last good version.

## Troubleshooting

- Changes not showing: purge Cloudflare, confirm the plugin is active, confirm the ZIP held the new `home.html` and `exit.html`.
- Links between pages 404 on the live site: the ZIP copies still contain local filenames. Rebuild with the link replacement.
- Plugin will not upload: try a private window. The CAPTCHA blocks scripted uploads.
