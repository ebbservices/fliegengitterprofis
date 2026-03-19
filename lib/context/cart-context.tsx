'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { sdk } from '@/lib/medusa';
import { MEDUSA_BACKEND_URL } from '@/lib/config';
import type { CartItemMetadata } from '@/lib/types';

interface CartItem {
  id: string;
  product_title: string;
  unit_price: number;
  quantity: number;
  metadata: CartItemMetadata;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
}

export interface LocalCartItem {
  product: string;
  height: number;
  width: number;
  price: string;
  [key: string]: string | number | undefined;
}

export interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  useMedusa: boolean;
  addItem: (params: {
    variant_id: string;
    quantity: number;
    unit_price: number;
    metadata: CartItemMetadata;
  }) => Promise<void>;
  addItemLocal: (item: LocalCartItem) => void;
  removeItem: (lineItemId: string) => Promise<void>;
  removeItemLocal: (index: number) => void;
  clearCart: () => Promise<void>;
  localCart: LocalCartItem[];
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

function getCartIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )cart_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function setCartIdCookie(cartId: string) {
  document.cookie = `cart_id=${encodeURIComponent(cartId)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function clearCartIdCookie() {
  document.cookie = 'cart_id=; path=/; max-age=0';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMedusa, setUseMedusa] = useState(false);

  // LocalStorage-Fallback laden
  const loadLocalCart = useCallback(() => {
    try {
      const stored = localStorage.getItem('cart');
      setLocalCart(stored ? JSON.parse(stored) : []);
    } catch {
      setLocalCart([]);
    }
  }, []);

  // Medusa Cart initialisieren oder laden
  const initMedusaCart = useCallback(async () => {
    try {
      const cartId = getCartIdFromCookie();
      if (cartId) {
        const response = await sdk.store.cart.retrieve(cartId);
        if (response.cart) {
          setCart(mapMedusaCart(response.cart));
          setUseMedusa(true);
          return;
        }
      }

      // Neuen Cart erstellen
      const response = await sdk.store.cart.create({});
      if (response.cart) {
        setCartIdCookie(response.cart.id);
        setCart(mapMedusaCart(response.cart));
        setUseMedusa(true);
      }
    } catch {
      // Medusa nicht erreichbar → LocalStorage Fallback
      setUseMedusa(false);
      loadLocalCart();
    }
  }, [loadLocalCart]);

  // Backend-Verfügbarkeit prüfen und Cart initialisieren
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?limit=0`, {
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          await initMedusaCart();
        } else {
          throw new Error('Backend not healthy');
        }
      } catch {
        setUseMedusa(false);
        loadLocalCart();
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [initMedusaCart, loadLocalCart]);

  // LocalStorage Events abhören (Fallback-Modus)
  useEffect(() => {
    if (useMedusa) return;

    const handleStorageUpdate = () => loadLocalCart();
    window.addEventListener('cartUpdated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [useMedusa, loadLocalCart]);

  const refreshCart = useCallback(async () => {
    if (!useMedusa) {
      loadLocalCart();
      return;
    }
    const cartId = getCartIdFromCookie();
    if (!cartId) return;
    try {
      const response = await sdk.store.cart.retrieve(cartId);
      if (response.cart) {
        setCart(mapMedusaCart(response.cart));
      }
    } catch {
      // silent fail
    }
  }, [useMedusa, loadLocalCart]);

  // Medusa Cart: Item hinzufügen
  const addItem = useCallback(
    async (params: {
      variant_id: string;
      quantity: number;
      unit_price: number;
      metadata: CartItemMetadata;
    }) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const response = await sdk.store.cart.createLineItem(cart.id, {
          variant_id: params.variant_id,
          quantity: params.quantity,
          metadata: params.metadata as unknown as Record<string, unknown>,
        });
        if (response.cart) {
          setCart(mapMedusaCart(response.cart));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  // LocalStorage Fallback: Item hinzufügen
  const addItemLocal = useCallback((item: LocalCartItem) => {
    setLocalCart((prev) => {
      const updated = [...prev, item];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Medusa Cart: Item entfernen
  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const response = await sdk.store.cart.deleteLineItem(
          cart.id,
          lineItemId
        );
        if (response.parent) {
          setCart(mapMedusaCart(response.parent));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  // LocalStorage Fallback: Item entfernen
  const removeItemLocal = useCallback((index: number) => {
    setLocalCart((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Cart leeren
  const clearCart = useCallback(async () => {
    if (useMedusa) {
      clearCartIdCookie();
      setCart(null);
      // Neuen Cart erstellen
      try {
        const response = await sdk.store.cart.create({});
        if (response.cart) {
          setCartIdCookie(response.cart.id);
          setCart(mapMedusaCart(response.cart));
        }
      } catch {
        // silent
      }
    } else {
      localStorage.removeItem('cart');
      setLocalCart([]);
    }
  }, [useMedusa]);

  const cartCount = useMedusa
    ? cart?.items.length ?? 0
    : localCart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        useMedusa,
        addItem,
        addItemLocal,
        removeItem,
        removeItemLocal,
        clearCart,
        localCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMedusaCart(raw: any): Cart {
  return {
    id: raw.id,
    items: (raw.items ?? []).map((item: Record<string, unknown>) => ({
      id: item.id as string,
      product_title: (item.product_title as string) ?? (item.title as string) ?? '',
      unit_price: (item.unit_price as number) ?? 0,
      quantity: (item.quantity as number) ?? 1,
      metadata: (item.metadata ?? {}) as CartItemMetadata,
    })),
    total: (raw.total as number) ?? 0,
    subtotal: (raw.subtotal as number) ?? 0,
    tax_total: (raw.tax_total as number) ?? 0,
    shipping_total: (raw.shipping_total as number) ?? 0,
  };
}
