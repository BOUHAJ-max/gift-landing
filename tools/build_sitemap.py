#!/usr/bin/env python3
"""Regenerate sitemap.xml from the site's HTML files.

lastmod comes from the date of the last git commit that touched each page,
so search engines see exactly which pages changed. Run from the repo root.
"""
import glob, re, subprocess, sys
from datetime import date

BASE = "https://go.bouhaj.com"
SKIP = {"offline.html", "maintenance.html", "404.html"}

def rules(url):
    if url == "/": return "weekly", "1.0"
    if url in ("/articles/", "/academy/", "/iridium/"): return "weekly", "0.9"
    if url in ("/experiences/", "/wadi-al-aql/", "/rebellious-novel/"): return "weekly", "0.8"
    if url.startswith(("/articles/", "/academy/")): return "monthly", "0.8"
    if url.startswith(("/rebellious-novel/", "/wadi-al-aql/", "/experiences/")): return "yearly", "0.7"
    if url == "/privacy.html": return "yearly", "0.4"
    return "monthly", "0.6"

def lastmod(path):
    out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", path],
                         capture_output=True, text=True).stdout.strip()
    return out or date.today().isoformat()

def main():
    urls = []
    for f in sorted(glob.glob("**/*.html", recursive=True)):
        if f in SKIP or f.startswith((".", "tools/", "analytics/")): continue
        html = open(f, encoding="utf-8").read()
        if re.search(r'name="robots"\s+content="[^"]*noindex', html): continue
        url = "/" + f
        if url.endswith("index.html"): url = url[: -len("index.html")]
        freq, prio = rules(url)
        urls.append((url, lastmod(f), freq, prio))
    urls.sort(key=lambda u: (-float(u[3]), u[0]))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, mod, freq, prio in urls:
        lines.append(f"  <url><loc>{BASE}{url}</loc><lastmod>{mod}</lastmod>"
                     f"<changefreq>{freq}</changefreq><priority>{prio}</priority></url>")
    lines.append("</urlset>")
    new = "\n".join(lines) + "\n"
    old = open("sitemap.xml", encoding="utf-8").read() if glob.glob("sitemap.xml") else ""
    if new != old:
        open("sitemap.xml", "w", encoding="utf-8").write(new)
        print(f"sitemap.xml updated ({len(urls)} URLs)")
    else:
        print("sitemap.xml unchanged")

if __name__ == "__main__":
    sys.exit(main())
