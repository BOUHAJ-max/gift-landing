# Luma Glow — COD Solutions API

The landing page now uses COD Solutions direct order creation instead of an affiliate checkout.

## Customer flow

Customer enters:
- Full name
- Phone number
- City
- Address
- Quantity

The frontend sends the form to `/api/create-order`. The server adds the fixed product SKU `694177B571535` and fixed price `69 MAD`, then sends the order to COD Solutions.

## Security

**Do not put the COD API key in `js/config.js`, HTML, or frontend JavaScript.**
Set it as a server environment variable:

`COD_API_KEY=YOUR_COD_SOLUTIONS_API_KEY`

The project intentionally does not contain the API key.

## Deploy

For the simplest setup, deploy the entire `gift-landing-main` folder to Vercel. Vercel can serve the static landing page and the `/api/create-order.js` serverless endpoint from the same domain.

Add this environment variable in Vercel:

- `COD_API_KEY` = your COD Solutions API key (grant only the `orders` ability)

No `FRONTEND_ORIGIN` variable is required when frontend and API use the same Vercel domain. If you later host the frontend elsewhere, set:

- `FRONTEND_ORIGIN` = your exact frontend origin, for example `https://go.bouhaj.com`

After deployment, the frontend endpoint remains `/api/create-order`.
