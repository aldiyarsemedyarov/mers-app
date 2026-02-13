# Mers App

Autonomous e-commerce COO powered by AI. Real-time analytics, inventory management, and advertising insights for Shopify stores.

## Live Demo

- **Production**: https://mers-app.vercel.app
- **YC Prototype**: https://aldiyarsemedyarov.github.io/mers/

## Features

✅ **Database-backed analytics** - Postgres + Prisma ORM
✅ **Shopify integration** - Orders, products, customers
✅ **Meta Ads integration** - Campaign insights, spend tracking
✅ **Real-time webhooks** - Auto-sync on Shopify events
✅ **Multi-store ready** - Support for Slim&Fit + DermaLuxe
✅ **Clean UI** - Next.js 16 App Router + Tailwind CSS

## Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Postgres (Prisma ORM)
- **Auth**: Simple session-based (Supabase Auth ready)
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **Integrations**: Shopify Admin API, Meta Graph API

## Quick Start

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/aldiyarsemedyarov/mers-app.git
cd mers-app
pnpm install
\`\`\`

### 2. Set Up Database

\`\`\`bash
# Create free Prisma Postgres database
npx create-db create --region eu-central-1 --env .env.local

# Run migrations
pnpm prisma migrate dev
\`\`\`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

\`\`\`env
# Database (auto-filled by create-db)
DATABASE_URL=postgresql://...

# Shopify
SHOPIFY_SHOP_DOMAIN=yourstore.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpca_...
SHOPIFY_API_VERSION=2025-01

# Meta Ads
META_ACCESS_TOKEN=EAAM...
META_AD_ACCOUNT_ID=act_123...
META_API_VERSION=v24.0

# Optional: Webhooks
SHOPIFY_WEBHOOK_SECRET=your-secret
\`\`\`

### 4. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open http://localhost:3000

### 5. Initialize Store

1. Visit home page
2. Click "Initialize Store" - creates store + integrations in DB
3. Click "Sync Shopify Data" - backfills orders + products
4. Open Dashboard → view real analytics

## API Endpoints

### Setup
- `POST /api/init` - Initialize store + integrations
- `POST /api/sync/shopify` - Backfill Shopify data
- `GET /api/status` - Check initialization status

### Analytics
- `GET /api/analytics/revenue?days=7` - Revenue metrics from DB
- `GET /api/shopify/shop` - Store info (legacy, direct API)
- `GET /api/shopify/orders?limit=250` - Orders (legacy, direct API)
- `GET /api/shopify/products?limit=250` - Products (legacy, direct API)

### Integrations
- `GET /api/integrations` - List connected integrations
- `GET /api/meta/account` - Meta ad account info
- `GET /api/meta/insights?since=YYYY-MM-DD&until=YYYY-MM-DD` - Ad insights

### Webhooks
- `POST /api/webhooks/shopify` - Shopify webhook receiver
  - Handles: `orders/create`, `orders/updated`, `orders/paid`, `products/create`, `products/update`, `products/delete`

## Database Schema

**Core tables:**
- `User` - App users
- `Store` - Shopify stores
- `Integration` - Connected services (Shopify, Meta, TikTok)
- `Order` - Shopify orders (synced)
- `Product` - Shopify products (synced)
- `SyncRun` - Sync job history
- `AdAccount` - Meta/TikTok ad accounts
- `Campaign` - Ad campaigns
- `DailyMetric` - Aggregated daily metrics

Run `npx prisma studio` to explore the database.

## Deployment (Vercel)

### Environment Variables

Add to Vercel project settings:

\`\`\`
DATABASE_URL=postgresql://...
SHOPIFY_SHOP_DOMAIN=...
SHOPIFY_ADMIN_TOKEN=...
META_ACCESS_TOKEN=...
META_AD_ACCOUNT_ID=...
\`\`\`

### Automatic Deployment

Push to `main` branch triggers auto-deploy.

### Manual Deploy

\`\`\`bash
vercel --prod
\`\`\`

## Shopify Webhooks Setup

1. Go to Shopify Admin → Settings → Notifications → Webhooks
2. Add webhook: `https://mers-app.vercel.app/api/webhooks/shopify`
3. Subscribe to topics:
   - `orders/create`
   - `orders/updated`
   - `orders/paid`
   - `products/create`
   - `products/update`
   - `products/delete`
4. Set webhook secret in `.env.local` → `SHOPIFY_WEBHOOK_SECRET`

## Multi-Store Support (Coming Soon)

Currently configured for single store (Slim&Fit). DermaLuxe support will be added with per-store env var prefixes:

\`\`\`env
SLIMNFIT_SHOPIFY_DOMAIN=...
SLIMNFIT_SHOPIFY_TOKEN=...
DERMALUXE_SHOPIFY_DOMAIN=...
DERMALUXE_SHOPIFY_TOKEN=...
\`\`\`

## Development

### Prisma Commands

\`\`\`bash
# Generate client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name description

# Open Prisma Studio
pnpm prisma studio

# Reset database
pnpm prisma migrate reset
\`\`\`

### Code Structure

\`\`\`
src/
├── app/
│   ├── api/              # API routes
│   ├── app/(dash)/       # Dashboard pages
│   └── page.tsx          # Home page
├── components/           # Reusable components
└── lib/
    ├── prisma.ts         # Prisma client
    ├── auth.ts           # Auth utilities
    ├── shopify.ts        # Shopify API
    ├── meta.ts           # Meta API
    ├── stores.ts         # Multi-store config
    └── sync/
        └── shopify.ts    # Sync logic
\`\`\`

## Troubleshooting

### "Store not initialized"
Run `POST /api/init` first or use the home page UI.

### "Database connection failed"
Check `DATABASE_URL` is set correctly. Run `pnpm prisma generate`.

### "Shopify 401 error"
Token expired or invalid. Regenerate in Shopify Admin → Apps → Custom app.

### "Sync runs but no data"
Check Shopify Admin API scopes include:
- `read_orders`
- `read_products`
- `read_customers`

## License

Private - Aldiyar Semedyarov

## Support

Questions? Email: abspartnerskz@gmail.com
