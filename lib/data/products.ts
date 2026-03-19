import type { ConfiguratorMetadata } from '@/lib/types';
import { FALLBACK_PRODUCTS } from './fallbacks';

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
}

function getPublishableKey() {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || "";
}

export interface ProductData {
  id: string;
  title: string;
  handle: string;
  description: string;
  metadata: ConfiguratorMetadata;
  variants: { id: string }[];
}

export async function getProductByHandle(
  handle: string
): Promise<ProductData | null> {
  try {
    const backendUrl = getBackendUrl();
    const apiKey = getPublishableKey();
    console.log(`[products] Fetching from ${backendUrl}/store/products?handle=${handle} (key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'})`);
    const url = `${backendUrl}/store/products?handle=${handle}&fields=id,title,handle,description,metadata,variants.id`;
    const res = await fetch(url, {
      headers: {
        'x-publishable-api-key': apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log(`[products] Response ${res.status}: ${errorText.substring(0, 200)}`);
      return FALLBACK_PRODUCTS[handle] ?? null;
    }

    const data = await res.json();
    const product = data.products?.[0];
    console.log(`[products] Got ${data.products?.length ?? 0} products, metadata keys: ${product?.metadata ? Object.keys(product.metadata).join(', ') : 'NONE'}`);
    if (!product) return FALLBACK_PRODUCTS[handle] ?? null;

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description ?? '',
      metadata: product.metadata as ConfiguratorMetadata,
      variants: product.variants ?? [],
    };
  } catch {
    return FALLBACK_PRODUCTS[handle] ?? null;
  }
}

export async function getAllProducts(): Promise<ProductData[]> {
  try {
    const backendUrl = getBackendUrl();
    const apiKey = getPublishableKey();
    const url = `${backendUrl}/store/products?fields=id,title,handle,description,metadata,variants.id`;
    const res = await fetch(url, {
      headers: {
        'x-publishable-api-key': apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.products ?? [])
      .filter(
        (p: Record<string, unknown>) =>
          p.metadata &&
          (p.metadata as ConfiguratorMetadata).configurator_type
      )
      .map(
        (p: Record<string, unknown>): ProductData => ({
          id: p.id as string,
          title: p.title as string,
          handle: p.handle as string,
          description: (p.description as string) ?? '',
          metadata: p.metadata as ConfiguratorMetadata,
          variants: (p.variants as { id: string }[]) ?? [],
        })
      );
  } catch {
    return [];
  }
}
