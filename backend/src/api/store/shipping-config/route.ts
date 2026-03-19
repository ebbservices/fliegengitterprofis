import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const countryCode = ((req.query.country_code as string) || "de").toLowerCase();
    const regionModule = req.scope.resolve("region");

    const regions = await regionModule.listRegions(
      {},
      { relations: ["countries"], select: ["id", "name", "currency_code", "metadata"] }
    );

    // Alle verfügbaren Länder sammeln
    const availableCountries: { iso_2: string; display_name: string; region_id: string }[] = [];
    for (const region of regions) {
      for (const country of region.countries || []) {
        availableCountries.push({
          iso_2: country.iso_2,
          display_name: country.display_name || country.name || country.iso_2.toUpperCase(),
          region_id: region.id,
        });
      }
    }

    // Region für gewähltes Land finden
    const region = regions.find((r: any) =>
      r.countries?.some((c: any) => c.iso_2 === countryCode)
    );

    if (!region) {
      return res.json({
        shipping_cost_cents: 590,
        free_shipping_threshold_cents: null,
        delivery_days_min: 10,
        delivery_days_max: 14,
        currency_code: "eur",
        region_name: "Standard",
        available_countries: availableCountries,
      });
    }

    const metadata = (region.metadata || {}) as Record<string, any>;

    return res.json({
      shipping_cost_cents: metadata.shipping_cost_cents ?? 590,
      free_shipping_threshold_cents: metadata.free_shipping_threshold_cents ?? null,
      delivery_days_min: metadata.delivery_days_min ?? 10,
      delivery_days_max: metadata.delivery_days_max ?? 14,
      currency_code: region.currency_code,
      region_name: region.name,
      available_countries: availableCountries,
    });
  } catch (error) {
    console.error("Failed to load shipping config:", error);
    return res.json({
      shipping_cost_cents: 590,
      free_shipping_threshold_cents: null,
      delivery_days_min: 10,
      delivery_days_max: 14,
      currency_code: "eur",
      region_name: "Standard",
      available_countries: [{ iso_2: "de", display_name: "Germany", region_id: "" }],
    });
  }
}
