# Premium static product landing page

This project contains a reusable static landing page system designed for product-agnostic ecommerce, affiliate, and WhatsApp-driven offers.

## Quick start

Open index.html directly in a browser, or serve the folder locally:

`powershell
cd C:\Users\user\gift-landing.worktrees\pasted-text-processing
python -m http.server 8000
`

Then open:

- http://localhost:8000/
- http://localhost:8000/privacy.html
- http://localhost:8000/terms.html

## Configuration

Edit js/config.js to change the product, pricing, gallery, trust items, FAQs, CTA mode, language defaults, and branding without touching the page design.

## Notes

- Static HTML/CSS/JS only
- Works with GitHub Pages
- Includes Arabic and English language switching with localStorage persistence
- Includes WhatsApp CTA, optional review/FAQ/spec sections, and responsive mobile behavior
