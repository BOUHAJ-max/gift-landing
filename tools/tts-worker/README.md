# Bouhaj Reader — high-quality voices (optional)

Without this, Bouhaj Reader reads aloud with the voices installed on the reader's device.
With it, every reader gets the same natural neural voices (female and male) from Azure AI Speech.

Azure's free tier includes 0.5 million characters of neural text-to-speech per month.
When the quota runs out the service pauses until next month (no charges on the free tier),
and the app automatically falls back to device voices.

## Setup (about 15 minutes)

1. **Azure:** create a free account at portal.azure.com → "Create a resource" → **Speech** →
   pricing tier **Free F0**. Copy **Key 1** and the **Region** (e.g. `westeurope`).
2. **Cloudflare:** dash.cloudflare.com → Workers & Pages → Create → Worker, name it `bouhaj-tts`,
   paste `worker.js`, Deploy.
3. In the Worker → Settings → Variables and Secrets:
   - Secret `AZURE_KEY` = your Azure key (never put it in the website or GitHub)
   - Text variable `AZURE_REGION` = your region
4. Copy the Worker URL (e.g. `https://bouhaj-tts.<name>.workers.dev`) and put it in
   `reader/config.json`:

   ```json
   { "ttsEndpoint": "https://bouhaj-tts.<name>.workers.dev" }
   ```

Default voices: Arabic Zariyah / Hamed, English Jenny / Guy, French Denise / Henri.
To use Moroccan Arabic voices instead, add variables `AR_FEMALE = ar-MA-MounaNeural`
and `AR_MALE = ar-MA-JamalNeural`.
