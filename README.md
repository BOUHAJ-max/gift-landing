# gift-landing

A production-ready, premium promotional landing page system built with pure HTML, CSS, and vanilla JavaScript.

## Features

- Responsive, mobile-first landing experience
- Sticky header and premium visual design
- Accessible semantics and skip links
- Policy pages for privacy and terms
- Safe redirect flow with configurable destination
- Cookie banner and tracking placeholders
- SEO basics including canonical tags, OpenGraph, Twitter cards, and JSON-LD

## Structure

- index.html — Landing page
- privacy.html — Privacy policy page
- terms.html — Terms of service page
- redirect.html — Safe redirect destination handler
- 404.html — Not-found fallback
- robots.txt — Search engine crawling instructions
- sitemap.xml — Sitemap
- assets/css/style.css — Shared styling
- assets/js/app.js — Shared behavior and configuration

## Configuration

The core configuration object is defined in assets/js/app.js:

```js
const CONFIG = {
  offerUrl: "",
  pageTitle: "Reward Center",
  buttonText: "Continue",
  trackingEnabled: false
};
```

Update these values to change the landing page behavior.

## Notes

- Tracking placeholders are present for TikTok Pixel, Meta Pixel, Google Analytics, and Google Tag Manager but are intentionally not populated.
- The redirect flow is designed to be safe and explicit, with no open redirect behavior.
