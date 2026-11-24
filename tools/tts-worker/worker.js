// Bouhaj Reader — neural text-to-speech proxy (Cloudflare Worker -> Azure AI Speech).
// The Azure key stays on the server as a secret; the browser only sends text.
// Secrets/variables:  AZURE_KEY (secret), AZURE_REGION (e.g. "westeurope")
// Optional overrides: AR_FEMALE, AR_MALE, EN_FEMALE, EN_MALE, FR_FEMALE, FR_MALE
const ALLOWED_ORIGINS = ['https://go.bouhaj.com', 'https://bouhaj.com'];
const VOICES = {
  ar: { female: 'ar-SA-ZariyahNeural', male: 'ar-SA-HamedNeural' },
  en: { female: 'en-US-JennyNeural', male: 'en-US-GuyNeural' },
  fr: { female: 'fr-FR-DeniseNeural', male: 'fr-FR-HenriNeural' },
};
const LOCALE = { ar: 'ar-SA', en: 'en-US', fr: 'fr-FR' };
const MAX_CHARS = 600;

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
const xml = s => s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors(origin) });
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403 });

    let body;
    try { body = await request.json(); } catch { return new Response('Bad request', { status: 400, headers: cors(origin) }); }
    const text = String(body.text || '').trim().slice(0, MAX_CHARS);
    const lang = ['ar', 'en', 'fr'].includes(body.lang) ? body.lang : 'ar';
    const gender = body.gender === 'male' ? 'male' : 'female';
    const rate = Math.min(2, Math.max(0.5, Number(body.rate) || 1));
    if (!text) return new Response('Empty text', { status: 400, headers: cors(origin) });

    // Per-IP rate limit (protects Azure's free monthly quota from abuse).
    const ip = request.headers.get('CF-Connecting-IP') || '0';
    const bucket = Math.floor(Date.now() / 60000);
    const rlKey = new Request('https://rl/' + bucket + '/' + ip);
    const rlCache = caches.default;
    const seen = await rlCache.match(rlKey);
    const n = seen ? Number(await seen.text()) : 0;
    if (n >= 60) return new Response('Too many requests', { status: 429, headers: cors(origin) });
    ctx.waitUntil(rlCache.put(rlKey, new Response(String(n + 1), { headers: { 'Cache-Control': 'max-age=60' } })));

    const voice = env[`${lang.toUpperCase()}_${gender.toUpperCase()}`] || VOICES[lang][gender];
    const pct = Math.round((rate - 1) * 100);
    const ssml = `<speak version="1.0" xml:lang="${LOCALE[lang]}"><voice name="${voice}"><prosody rate="${pct >= 0 ? '+' : ''}${pct}%">${xml(text)}</prosody></voice></speak>`;

    // Same paragraph + voice + speed is served from cache, so it doesn't use the monthly quota again.
    const key = new Request('https://tts-cache/' + await sha256(voice + '|' + pct + '|' + text));
    const cache = caches.default;
    let hit = await cache.match(key);
    if (hit) return new Response(hit.body, { headers: { ...cors(origin), 'Content-Type': 'audio/mpeg', 'X-Cache': 'HIT' } });

    const r = await fetch(`https://${env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': env.AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'bouhaj-reader',
      },
      body: ssml,
    });
    if (!r.ok) return new Response('TTS error ' + r.status, { status: 502, headers: cors(origin) });
    const audio = await r.arrayBuffer();
    ctx.waitUntil(cache.put(key, new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=2592000' } })));
    return new Response(audio, { headers: { ...cors(origin), 'Content-Type': 'audio/mpeg', 'X-Cache': 'MISS' } });
  },
};

async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
