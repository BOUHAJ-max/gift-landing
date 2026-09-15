# Luma Glow — Universal Product Landing Page

Premium static HTML/CSS/JavaScript product page for Luma Glow affiliate sales, with a secure optional COD Solutions backend relay.

## Edit one file

Change only `js/config.js`. The page reads the product, images, pricing, sales links,
sections, benefits, specifications, reviews, FAQ, branding, and SEO from this file.

### Product details

Edit `PRODUCT_CONFIG.product`:

```js
name: 'Product name',
description: 'Arabic description',
descriptionEn: 'English description',
price: 299,
oldPrice: 399,
currency: 'MAD',
discount: '25%',
badge: 'Best seller',
```

### Product images

1. Copy images into `assets/images/`.
2. Replace the `images` array in `js/config.js`:

```js
images: [
  { src: 'assets/images/product-main.jpg', alt: 'Product front', altAr: 'صورة المنتج' },
  { src: 'assets/images/product-detail-1.jpg', alt: 'Product detail', altAr: 'تفاصيل المنتج' }
]
```

Use local JPG, PNG, or WebP files and keep each image reasonably compressed.

### Sales links

WhatsApp is configured in `PRODUCT_CONFIG.sale.whatsapp`:

```js
whatsapp: {
  enabled: true,
  number: '212618439834',
  message: 'مرحبا، أريد طلب {product}'
}
```

Use the international number without `+`, spaces, or leading zero.

Affiliate links are configured separately in `PRODUCT_CONFIG.sale.affiliate`:

```js
affiliate: {
  enabled: true,
  url: 'https://your-affiliate-network.com/your-tracking-link'
}
```

When both are enabled, the page shows two independent buttons:
one for the affiliate purchase link and one for WhatsApp. Replace the example URL
with your real tracking URL before publishing. To use WhatsApp only, set
`affiliate.enabled` to `false`. To use affiliate only, set `whatsapp.enabled` to
`false`.

### Optional sections

Set values in `PRODUCT_CONFIG.sections` to `true` or `false`:

`benefits`, `showcase`, `howItWorks`, `specifications`, `offer`, `reviews`,
`faq`, and `finalCTA`.

## Run locally

Open `index.html` directly, or run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploy

The project is static and GitHub Pages compatible. Push the repository to GitHub
and enable Pages using GitHub Actions. The included workflow copies the root
`css`, `js`, and product assets into the Pages artifact.

## Included features

- Arabic RTL and English LTR language switch
- Responsive mobile-first layout
- Product gallery, benefits, showcase, steps, specifications, offer, reviews, FAQ
- Independent affiliate and WhatsApp CTAs
- SEO metadata, favicon, privacy and terms pages
- No backend, database, build step, or paid dependency


## Current product

- Product: Disaar Rosemary & Centella Facial Mask
- SKU: `694177B571535`
- Selling price: `69 MAD`
- Compare-at price: `99 MAD`
- Main sales path: Affiliate
- WhatsApp: Floating support/contact only

## Backend

`api/create-order.js` is a secure optional COD Solutions order relay for Vercel. Set `COD_API_KEY` as an environment variable; never put the key in frontend files.
