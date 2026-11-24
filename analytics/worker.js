/**
 * BOUHAJ TECH privacy-friendly aggregate counters.
 * Cloudflare Worker + D1. No cookies, IP storage, fingerprints, or visitor IDs.
 * Bind D1 database as DB; set ADMIN_TOKEN as a Worker secret.
 */
const SITE_ORIGIN = "https://go.bouhaj.com";
const corsHeaders = {
  "Access-Control-Allow-Origin": SITE_ORIGIN,
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin && origin !== SITE_ORIGIN) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/event") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
      if (!body || !["visit", "install"].includes(body.type)) return json({ error: "Unsupported event" }, 400);

      // Soft rate limit so the counters can't be flooded (uses Cloudflare's own edge, no IP storage).
      const ip = request.headers.get("CF-Connecting-IP") || "0";
      const bucket = Math.floor(Date.now() / 60000);
      const rlKey = new Request("https://rl/" + bucket + "/" + ip);
      const cache = caches.default;
      const seen = await cache.match(rlKey);
      const n = seen ? Number(await seen.text()) : 0;
      if (n >= 40) return json({ ok: true, throttled: true });
      await cache.put(rlKey, new Response(String(n + 1), { headers: { "Cache-Control": "max-age=60" } }));

      // Store only an aggregate event type and timestamp; never read or persist request IP/headers.
      await env.DB.prepare("INSERT INTO analytics_events (event_type, created_at) VALUES (?, unixepoch())")
        .bind(body.type).run();
      return json({ ok: true });
    }

    if (request.method === "GET" && url.pathname === "/stats") {
      const auth = request.headers.get("Authorization") || "";
      if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: "Unauthorized" }, 401);

      const totals = await env.DB.prepare(
        "SELECT event_type, COUNT(*) AS total FROM analytics_events GROUP BY event_type"
      ).all();
      const today = await env.DB.prepare(
        "SELECT event_type, COUNT(*) AS total FROM analytics_events WHERE date(created_at, 'unixepoch') = date('now') GROUP BY event_type"
      ).all();
      const daily = await env.DB.prepare(
        "SELECT date(created_at, 'unixepoch') AS day, event_type, COUNT(*) AS total FROM analytics_events WHERE created_at >= unixepoch('now', '-30 days') GROUP BY day, event_type ORDER BY day DESC"
      ).all();

      const count = (rows, type) => (rows.results || []).find(row => row.event_type === type)?.total || 0;
      return json({
        totals: { visits: count(totals, "visit"), installs: count(totals, "install") },
        today: { visits: count(today, "visit"), installs: count(today, "install") },
        daily: daily.results || [],
        timezone: "UTC",
        note: "Visits are page-load events, not unique people. Installs count browser-reported appinstalled events only."
      });
    }

    return json({ error: "Not found" }, 404);
  }
};
