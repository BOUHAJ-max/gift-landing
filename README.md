# gift-landing

A private local-only landing platform with a secure local access gate.

## Features

- Responsive, mobile-first landing experience
- Sticky header and premium visual design
- Accessible semantics and skip links
- Policy pages for privacy and terms
- Safe redirect flow with configurable destination
- Cookie banner and tracking placeholders
- SEO basics including canonical tags, OpenGraph, Twitter cards, and JSON-LD
- Local-only private access gate with password and secret key

## Private access

The landing page and dashboard are locked behind a local-only authentication gate.
Use these credentials:

- Password: R3ward!LocalOnly#2026
- Secret key: M0narch-Alpha-7J2Q-N9V4

These values are intended for local use only.

## Run locally on Windows PowerShell

From PowerShell:

```powershell
Set-Location C:\Users\user\gift-landing
powershell -ExecutionPolicy Bypass -File .\launch-local.ps1
```

## Run locally on WSL / Ubuntu / Debian

From WSL or Ubuntu/Debian:

```bash
cd /mnt/c/Users/user/gift-landing
python3 -m http.server 8000
```

Then open:

- http://127.0.0.1:8000/gift-landing/
- http://127.0.0.1:8000/gift-landing/dashboard.html

## Notes

- The site is intentionally restricted to localhost-only access.
- The dashboard is hidden from public hosts and GitHub Pages.
- The private gate can be updated later with a stronger password or custom secret.
