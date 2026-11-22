# BOUHAJ TECH — privacy-friendly counters

This folder contains a small Cloudflare Worker that counts aggregate page-load events and browser-reported PWA installations.

## Privacy model
- Does not create visitor IDs, cookies, fingerprints, or profiles.
- Does not store IP addresses, user agents, referrers, or page URLs.
- Stores only event type (`visit` or `install`) and a UTC timestamp.
- A visit is a page-load event, **not** a unique person.
- Install counts include browsers that fire `appinstalled`; iOS/Safari manual Add to Home Screen installations may not be detectable.

Cloudflare may process limited request metadata to operate and secure its network under its own terms and privacy policy. Do not describe this as zero data processing.

## Deploy

1. In Cloudflare Dashboard, open **Workers & Pages** and create a Worker named `bouhaj-privacy-counters`.
2. Paste the contents of `worker.js` into its editor and deploy.
3. Create a D1 database, e.g. `bouhaj-analytics`.
4. Open the D1 console and run the SQL in `schema.sql`.
5. In the Worker **Settings → Bindings**, add a D1 database binding:
   - Variable name: `DB`
   - Select the database `bouhaj-analytics`.
6. In **Settings → Variables and Secrets**, add a secret named `ADMIN_TOKEN`. Generate a long random value and keep it private. Never commit it to GitHub or put it in site JavaScript.
7. Copy the deployed Worker URL (usually `https://bouhaj-privacy-counters.<your-subdomain>.workers.dev`).

## Next step: connect the website
The website is intentionally not sending events until the Worker is deployed and its URL is known. Give the deployed URL to the site maintainer so the frontend can be connected. The admin stats endpoint is:

`GET https://YOUR-WORKER-URL/stats`

with header:

`Authorization: Bearer YOUR_ADMIN_TOKEN`

Keep the token private. Use it only from a trusted admin environment, never from the public website.
