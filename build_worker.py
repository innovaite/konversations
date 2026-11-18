"""Build the Cloudflare Worker that serves konversaitions.com.

Usage: python3 -I build_worker.py <output.js>

Reads konversaitions_v16.html (home) and konversaitions_exitV16.html (exit),
swaps the local file links for site paths, and writes one Worker script.
Paths other than the four pages pass through to the origin unchanged.
"""
import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
home = open(os.path.join(here, "konversaitions_v16.html"), encoding="utf-8").read()
exitp = open(os.path.join(here, "konversaitions_exitV16.html"), encoding="utf-8").read()
home = home.replace('href="konversaitions_exitV16.html"', 'href="/exit/"')
exitp = exitp.replace('href="konversaitions_v16.html"', 'href="/"')
for name, page in (("home", home), ("exit", exitp)):
    for local in ("konversaitions_v16.html", "konversaitions_exitV16.html"):
        if local in page:
            sys.exit(f"{name} page still links to {local}")

js = f"""const HOME = {json.dumps(home)};
const EXIT = {json.dumps(exitp)};
const PAGES = {{"/": HOME, "/home-preview/": HOME, "/exit/": EXIT, "/exit-preview/": EXIT}};
export default {{
  async fetch(request) {{
    const url = new URL(request.url);
    let path = url.pathname;
    if (path !== "/" && !path.endsWith("/")) path += "/";
    const body = PAGES[path];
    if (body === undefined) return fetch(request);
    return new Response(body, {{ headers: {{ "content-type": "text/html; charset=UTF-8", "cache-control": "public, max-age=300" }} }});
  }}
}};
"""
open(sys.argv[1], "w", encoding="utf-8").write(js)
print(f"wrote {sys.argv[1]} ({len(js)} bytes)")
