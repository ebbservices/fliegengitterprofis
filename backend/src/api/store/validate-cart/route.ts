import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

interface ConfiguratorMetadata {
  configurator_type: string;
  pricing: {
    base_price_per_sqm_cents: number;
    min_price_cents: number;
  };
  dimensions: {
    width_min: number;
    width_max: number;
    height_min: number;
    height_max: number;
  };
  options_config: Record<string, Record<string, { surcharge_cents: number }>>;
}

interface LineItemMetadata {
  configurator_type: string;
  width: number;
  height: number;
  selections: Record<string, string>;
}

/**
 * POST /store/validate-cart
 * Validiert alle Line-Item-Preise im Cart vor dem Checkout.
 * Body: { cart_id: string }
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id } = req.body as { cart_id?: string };

  if (!cart_id) {
    return res.status(400).json({ error: "cart_id ist erforderlich" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Cart laden
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "items.id",
      "items.unit_price",
      "items.metadata",
      "items.variant.product.id",
      "items.variant.product.metadata",
    ],
    filters: { id: cart_id },
  });

  if (!carts.length) {
    return res.status(404).json({ error: "Cart nicht gefunden" });
  }

  const cart = carts[0];
  const errors: { line_item_id: string; expected: number; actual: number }[] = [];

  for (const item of cart.items ?? []) {
    if (!item) continue;
    const itemMeta = item.metadata as unknown as LineItemMetadata | null;
    const productMeta = (item as Record<string, unknown>).variant as
      | { product: { metadata: unknown } }
      | undefined;

    if (!itemMeta?.configurator_type || !productMeta?.product?.metadata) {
      continue; // Standard-Artikel ohne Konfigurator überspringen
    }

    const config = productMeta.product.metadata as unknown as ConfiguratorMetadata;

    // Preis neu berechnen
    const area = (itemMeta.width / 1000) * (itemMeta.height / 1000);
    let price = Math.round(area * config.pricing.base_price_per_sqm_cents);

    for (const [group, value] of Object.entries(itemMeta.selections ?? {})) {
      const surcharge = config.options_config?.[group]?.[value]?.surcharge_cents ?? 0;
      price += surcharge;
    }

    price = Math.max(price, config.pricing.min_price_cents);

    if (price !== item.unit_price) {
      errors.push({
        line_item_id: item.id,
        expected: price,
        actual: item.unit_price as number,
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      valid: false,
      error: "Preise stimmen nicht überein",
      mismatches: errors,
    });
  }

  return res.json({ valid: true });
}
