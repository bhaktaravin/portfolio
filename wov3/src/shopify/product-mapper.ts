import { PRODUCTS, type Product } from '../data/wov3.data';

export interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  productType: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }>;
  };
}

const WV_PATTERNS: Array<{ id: string; patterns: RegExp[] }> = [
  { id: 'wv-1', patterns: [/wv-?1\b/i, /recovery.?slide/i] },
  { id: 'wv-2', patterns: [/wv-?2\b/i, /running.?shoe/i] },
  { id: 'wv-3', patterns: [/wv-?3\b/i, /massage.?clog/i] },
  { id: 'wv-4', patterns: [/wv-?4\b/i, /custom.?insole/i, /\binsole/i] },
];

function inferProductId(handle: string, title: string, tags: string[]): string {
  const combined = `${handle} ${title} ${tags.join(' ')}`;
  for (const { id, patterns } of WV_PATTERNS) {
    if (patterns.some((p) => p.test(combined))) return id;
  }
  return handle || title.toLowerCase().replace(/\s+/g, '-');
}

function formatPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function pickVariant(node: ShopifyProductNode) {
  const variants = node.variants.edges.map((e) => e.node);
  return variants.find((v) => v.availableForSale) ?? variants[0];
}

function deriveFeatures(description: string, staticProduct?: Product): string[] {
  if (staticProduct?.features.length) return staticProduct.features;
  const sentences = description
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && s.length < 80);
  return sentences.slice(0, 3);
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const id = inferProductId(node.handle, node.title, node.tags);
  const staticMatch = PRODUCTS.find((p) => p.id === id);
  const variant = pickVariant(node);

  const priceAmount = variant?.price.amount ?? node.priceRange.minVariantPrice.amount;
  const currency = variant?.price.currencyCode ?? node.priceRange.minVariantPrice.currencyCode;
  const formatted = formatPrice(priceAmount, currency);

  const name = staticMatch?.name ?? node.title.split(/[—–-]/)[0]?.trim() ?? node.title;
  const tagline =
    staticMatch?.tagline ??
    (node.title.includes('—') ? node.title.split('—').slice(1).join('—').trim() : node.productType || node.title);

  return {
    id,
    name,
    tagline,
    description: node.description || staticMatch?.description || '',
    category: staticMatch?.category ?? node.productType ?? 'Shop',
    price: `From ${formatted}`,
    features: deriveFeatures(node.description, staticMatch),
    badge: staticMatch?.badge,
    variantId: variant?.id,
    imageUrl: node.featuredImage?.url,
    shopifyHandle: node.handle,
  };
}

export function mapShopifyProducts(nodes: ShopifyProductNode[]): Product[] {
  return nodes.map(mapShopifyProduct);
}
