import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { CalculatePriceSchema } from "./validators";

interface OptionSurcharge {
  surcharge_cents: number;
  ral_code?: string;
  custom_ral?: boolean;
}

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
  options_config: Record<string, Record<string, OptionSurcharge>>;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Validierung
  const parsed = CalculatePriceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Ungültige Eingabe",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { product_id, width, height, selections } = parsed.data;

  // Produkt laden
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id: product_id },
  });

  if (!products.length) {
    return res.status(404).json({ error: "Produkt nicht gefunden" });
  }

  const product = products[0];
  const metadata = product.metadata as unknown as ConfiguratorMetadata;

  if (!metadata?.configurator_type || !metadata?.pricing || !metadata?.dimensions) {
    return res.status(400).json({
      error: "Produkt hat keine Konfigurator-Metadata",
    });
  }

  // Dimensionen validieren
  const { dimensions } = metadata;
  if (
    width < dimensions.width_min ||
    width > dimensions.width_max ||
    height < dimensions.height_min ||
    height > dimensions.height_max
  ) {
    return res.status(400).json({
      error: "Maße außerhalb des erlaubten Bereichs",
      allowed: {
        width: { min: dimensions.width_min, max: dimensions.width_max },
        height: { min: dimensions.height_min, max: dimensions.height_max },
      },
    });
  }

  // Optionen validieren und Aufschläge berechnen
  const surcharges: { name: string; amount_cents: number }[] = [];
  const { options_config } = metadata;

  for (const [optionGroup, selectedValue] of Object.entries(selections)) {
    const groupConfig = options_config[optionGroup];
    if (!groupConfig) {
      return res.status(400).json({
        error: `Unbekannte Option: ${optionGroup}`,
        allowed_options: Object.keys(options_config),
      });
    }

    const valueConfig = groupConfig[selectedValue];
    if (!valueConfig) {
      return res.status(400).json({
        error: `Ungültiger Wert "${selectedValue}" für Option "${optionGroup}"`,
        allowed_values: Object.keys(groupConfig),
      });
    }

    if (valueConfig.surcharge_cents !== 0) {
      surcharges.push({
        name: `${optionGroup}: ${selectedValue}`,
        amount_cents: valueConfig.surcharge_cents,
      });
    }
  }

  // Preis berechnen
  const area_sqm = (width / 1000) * (height / 1000);
  const base_price_cents = Math.round(
    area_sqm * metadata.pricing.base_price_per_sqm_cents
  );
  const surcharges_total = surcharges.reduce(
    (sum, s) => sum + s.amount_cents,
    0
  );
  const total_before_min = base_price_cents + surcharges_total;
  const min_price_applied = total_before_min < metadata.pricing.min_price_cents;
  const price_cents = Math.max(
    total_before_min,
    metadata.pricing.min_price_cents
  );

  return res.json({
    price_cents,
    price_formatted: `${(price_cents / 100).toFixed(2)} €`,
    breakdown: {
      area_sqm: Math.round(area_sqm * 10000) / 10000,
      base_price_cents,
      surcharges,
      total_before_min_cents: total_before_min,
      min_price_applied,
    },
  });
}
