# Niche Directory — Setup Guide

A programmatic SEO site that generates geo-targeted service pages for any niche across all US cities. Built with Next.js 15, zero database required.

---

## What you get out of the box

- Geo-targeted pages at `/{state}/{city}/{service}` for every city in the US
- Tier-based service depth (larger cities get more services)
- Per-page SEO: unique `<title>`, `<meta description>`, canonical URL, JSON-LD schema
- Breadcrumb + FAQ + star rating structured data on every service page
- Internal linking (sibling services + nearby cities) on every service page
- State-segmented XML sitemap index (compliant with Google's 50k URL limit)
- Mobile sticky call bar + responsive nav
- `robots.txt` auto-configured
- Google Analytics slot (just add your GA ID)
- Google AdSense slot (plain `<script>` tag — visible to crawlers)
- `ads.txt` in `/public`

---

## Step 1 — Configure your niche (5 minutes)

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | What to set |
|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | Your site name (e.g. `Dallas HVAC Pros`) |
| `NEXT_PUBLIC_PHONE_NUMBER` | Display phone (e.g. `(800) 555-0100`) |
| `NEXT_PUBLIC_PHONE_TEL` | Digits only (e.g. `8005550100`) |
| `NEXT_PUBLIC_SITE_URL` | Your domain (e.g. `https://www.yoursite.com`) |
| `NEXT_PUBLIC_NICHE` | Industry noun (e.g. `HVAC`, `Roofing`, `Landscaping`) |
| `NEXT_PUBLIC_NICHE_PLURAL` | Plural (e.g. `HVAC Technicians`, `Roofers`) |
| `NEXT_PUBLIC_NICHE_SINGULAR` | Singular (e.g. `HVAC Technician`, `Roofer`) |
| `NEXT_PUBLIC_SCHEMA_TYPE` | Schema.org type (e.g. `HVACBusiness`, `RoofingContractor`) |

---

## Step 2 — Add your services (10–30 minutes)

Edit `lib/data/services.json`. Each entry is one service page type across all cities.

```json
[
  {
    "id": 1,
    "service_name": "AC Repair",
    "service_slug": "ac-repair",
    "service_tier": 1,
    "base_keywords": ["ac repair", "air conditioner repair", "AC repair near me"]
  }
]
```

**Rules:**
- `id` — unique integer, start from 1
- `service_slug` — URL-safe, hyphenated (this becomes the URL segment)
- `service_tier` — always set to `1` unless you know what you're doing
- `base_keywords` — 3–5 keyword variants used in generated page copy (spintax)
- Services are ordered: first services appear on more pages (tier 1 cities get all, tier 2 gets 50%, tier 3 gets 17%)

**Tip:** 50–200 services is the sweet spot. More services = more pages = more SEO surface area.

---

## Step 3 — (Optional) Update ads.txt

Replace the placeholder publisher ID in `public/ads.txt`:

```
google.com, pub-YOUR_PUBLISHER_ID_HERE, DIRECT, f08c47fec0942fa0
```

Your publisher ID is in your AdSense dashboard (format: `pub-XXXXXXXXXXXXXXXX`).

---

## Step 4 — Build & run

```bash
npm install
npm run build
npm start
```

Or in development:

```bash
npm run dev
```

---

## Step 5 — Deploy to DigitalOcean (recommended)

1. Create a $6/month Droplet (Ubuntu 22.04, 1GB RAM + 2GB swap)
2. Install Node.js 20+, PM2, Nginx
3. Build on the server: `npm run build`
4. Start with PM2: `PORT=3000 pm2 start npm --name mysite -- start`
5. Configure Nginx to proxy port 80/443 → localhost:3000
6. Install SSL: `certbot --nginx -d yoursite.com -d www.yoursite.com`

---

## Tier system

Cities are automatically tiered by population:

| Tier | Population | Services shown |
|---|---|---|
| 1 | > 50,000 | All services |
| 2 | 10,000–50,000 | 50% of services |
| 3 | < 10,000 | 17% of services |

This prevents thin content on small cities while maximizing coverage on large markets.

---

## Customization checklist

- [ ] `lib/data/services.json` — your niche's services
- [ ] `.env.local` — brand name, phone, niche labels, domain
- [ ] `app/globals.css` → `--color-accent` — change from orange to your brand color
- [ ] `public/ads.txt` — your AdSense publisher ID
- [ ] `public/favicon.svg` — your favicon
- [ ] `public/opengraph.jpg` — OG image (1200×630px)
- [ ] `NEXT_PUBLIC_GA_ID` — your Google Analytics ID
- [ ] `NEXT_PUBLIC_ADSENSE_ID` — your AdSense publisher ID
- [ ] `NEXT_PUBLIC_GSC_TOKEN` — Google Search Console verification token

---

## File map

```
lib/
  config.ts          ← all brand/niche config (edit this)
  data.ts            ← data layer (do not edit)
  spintax.ts         ← content variation engine (do not edit)
  data/
    services.json    ← YOUR SERVICES (edit this)
    locations.json   ← all US cities (do not edit)

app/
  layout.tsx                       ← Analytics + AdSense scripts
  page.tsx                         ← homepage
  [state]/page.tsx                 ← state page
  [state]/[place]/page.tsx         ← city page
  [state]/[place]/[service]/page.tsx ← service page (the money page)
  sitemap.xml/route.ts             ← sitemap index
  sitemap/[state]/route.ts         ← per-state sitemap files
  robots.ts                        ← robots.txt

components/
  StickyNav.tsx       ← top nav
  MobileStickyBar.tsx ← mobile call bar
  Footer.tsx          ← footer with dynamic service links

public/
  ads.txt             ← AdSense ads.txt (required for full ad serving)
  favicon.svg
  opengraph.jpg
```
