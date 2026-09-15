// Luma Glow -> COD Solutions secure order relay
// Deploy this repository (or the /api folder) on Vercel.
// Set COD_API_KEY as a Vercel Environment Variable.
// Never place the API key in config.js or frontend JavaScript.

const COD_BASE_URL = "https://apis.codsolutions.ma/api/v1";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const apiKey = process.env.COD_API_KEY;
  if (!apiKey) return json(res, 500, { error: "Server is not configured." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: "Invalid JSON." }); }
  }

  if (!body || typeof body !== "object") {
    return json(res, 400, { error: "Invalid request body." });
  }

  const recipient_name = String(body.recipient_name || "").trim();
  const recipient_phone = String(body.recipient_phone || "").trim();
  const recipient_address = String(body.recipient_address || "").trim();
  const city_name = String(body.city_name || "").trim();
  const quantity = Number(body.quantity || 1);

  if (!recipient_name || !recipient_phone || !city_name) {
    return json(res, 422, { error: "Name, phone and city are required." });
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return json(res, 422, { error: "Invalid quantity." });
  }

  // Product is fixed server-side to prevent SKU/price tampering from the browser.
  const order = {
    recipient_name,
    recipient_phone,
    recipient_address,
    city_name,
    seller_note: String(body.seller_note || "").trim().slice(0, 1000),
    items: [{
      product_sku: "694177B571535",
      quantity,
      total_price: 69 * quantity
    }]
  };

  try {
    const response = await fetch(`${COD_BASE_URL}/seller-api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify(order)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return json(res, response.status, {
        error: "COD Solutions rejected the order.",
        details: data
      });
    }

    return json(res, 200, {
      success: true,
      data
    });
  } catch (error) {
    return json(res, 502, {
      error: "Could not reach COD Solutions.",
      details: error?.message || "Unknown error"
    });
  }
};
