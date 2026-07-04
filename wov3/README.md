# Wov3 Storefront

A Vite + TypeScript headless commerce demo for the Wov3 3D-printed footwear brand. The site works out of the box with static product data and optionally connects to Shopify Storefront API for live catalog and checkout.

## Quick start

```bash
cd wov3
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values you need:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SHOPIFY_STORE_DOMAIN` | For live shop | Your Shopify store domain, e.g. `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | For live shop | Storefront API public access token |
| `VITE_OPENAI_API_KEY` | Optional | Enables GPT-powered chat instead of rule-based responses |

Restart the dev server after changing env vars.

## Getting a Storefront API token

1. In **Shopify Admin**, go to **Settings → Apps and sales channels → Develop apps**.
2. Create a custom app (or use an existing one) and configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts` (or `unauthenticated_read_checkouts` + cart scopes for API 2024-01+)
3. Install the app on your store.
4. Under **API credentials**, copy the **Storefront API access token**.
5. Add to `.env.local`:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxx
```

> Never commit real tokens. `.env.local` is gitignored.

## Demo vs live shop mode

**Demo mode** (default — no Shopify env vars):

- Products load from `src/data/wov3.data.ts`
- "Buy Now" opens the AI chat with a product question
- A subtle banner reads *Demo mode — add Shopify credentials to enable checkout*

**Live shop mode** (both Shopify env vars set):

- Products are fetched from Shopify Storefront API GraphQL (`/api/2024-01/graphql.json`)
- Shopify products are mapped to the local `Product` model (WV-1 … WV-4 matching by handle/title/tags)
- "Buy Now" creates a cart via `cartCreate` and redirects to Shopify checkout
- Banner shows *Live shop — checkout powered by Shopify*

If the API call fails or returns no products, the site falls back to static data and shows a toast notification.

## Project structure

```
wov3/
├── src/
│   ├── main.ts              # App bootstrap, product grid, checkout wiring
│   ├── data/wov3.data.ts    # Static products & chat knowledge
│   ├── shopify/
│   │   ├── shopify.service.ts   # Storefront API client
│   │   └── product-mapper.ts    # Shopify → Product mapping
│   ├── chat/chat-agent.ts   # AI guide (OpenAI or rule-based)
│   └── styles/main.css
├── index.html
└── .env.example
```
