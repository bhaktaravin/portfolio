import { mapShopifyProducts, type ShopifyProductNode } from './product-mapper';
import type { Product } from '../data/wov3.data';

const API_VERSION = '2024-01';

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          productType
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface ProductsQueryResult {
  products: {
    edges: Array<{ node: ShopifyProductNode }>;
  };
}

interface CartCreateResult {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyError';
  }
}

function getStoreDomain(): string | undefined {
  return import.meta.env.VITE_SHOPIFY_STORE_DOMAIN?.trim();
}

function getAccessToken(): string | undefined {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
}

export function isShopifyConfigured(): boolean {
  return Boolean(getStoreDomain() && getAccessToken());
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const domain = getStoreDomain();
  const token = getAccessToken();

  if (!domain || !token) {
    throw new ShopifyError('Shopify is not configured');
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Shopify request failed (${res.status})`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join('; '));
  }

  if (!json.data) {
    throw new ShopifyError('Empty response from Shopify');
  }

  return json.data;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await shopifyFetch<ProductsQueryResult>(PRODUCTS_QUERY, { first: 20 });
  const nodes = data.products.edges.map((edge) => edge.node);
  return mapShopifyProducts(nodes);
}

export async function createCheckout(variantId: string, quantity = 1): Promise<string> {
  const data = await shopifyFetch<CartCreateResult>(CART_CREATE_MUTATION, {
    input: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length) {
    throw new ShopifyError(userErrors.map((e) => e.message).join('; '));
  }

  if (!cart?.checkoutUrl) {
    throw new ShopifyError('No checkout URL returned');
  }

  return cart.checkoutUrl;
}
