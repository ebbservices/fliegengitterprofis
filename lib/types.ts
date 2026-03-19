// Typen für die Konfigurator-Produkte (Metadata aus Medusa)

export interface OptionSurcharge {
  surcharge_cents: number;
  ral_code?: string;
  custom_ral?: boolean;
}

export interface ProductPricing {
  base_price_per_sqm_cents: number;
  min_price_cents: number;
}

export interface ProductDimensions {
  width_min: number;
  width_max: number;
  height_min: number;
  height_max: number;
}

export interface ProductOptionsConfig {
  [optionGroup: string]: {
    [optionValue: string]: OptionSurcharge;
  };
}

export interface ConfiguratorMetadata {
  configurator_type: "fliegengitter" | "plissee" | "lichtschacht";
  pricing: ProductPricing;
  dimensions: ProductDimensions;
  options_config: ProductOptionsConfig;
}

export interface PriceCalculationRequest {
  product_id: string;
  width: number;
  height: number;
  selections: Record<string, string>;
}

export interface PriceBreakdown {
  area_sqm: number;
  base_price_cents: number;
  surcharges: { name: string; amount_cents: number }[];
  total_before_min_cents: number;
  min_price_applied: boolean;
}

export interface PriceCalculationResponse {
  price_cents: number;
  price_formatted: string;
  breakdown: PriceBreakdown;
}

export interface CartItemMetadata {
  configurator_type: string;
  product_title: string;
  width: number;
  height: number;
  selections: Record<string, string>;
}
