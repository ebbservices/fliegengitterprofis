import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

interface RegionSettingInput {
  region_id: string;
  shipping_cost_cents: number;
  free_shipping_threshold_cents: number | null;
  delivery_days_min: number;
  delivery_days_max: number;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "metadata", "countries.*"],
    });

    return res.json({ regions });
  } catch (error) {
    console.error("Failed to load shipping settings:", error);
    return res.status(500).json({ error: "Versandeinstellungen konnten nicht geladen werden" });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { region_settings } = req.body as {
      region_settings: RegionSettingInput[];
    };

    if (!region_settings || !Array.isArray(region_settings)) {
      return res.status(400).json({ error: "region_settings ist erforderlich" });
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const regionModule = req.scope.resolve("region");

    for (const setting of region_settings) {
      const { data: existing } = await query.graph({
        entity: "region",
        fields: ["id", "metadata"],
        filters: { id: setting.region_id },
      });

      if (!existing.length) continue;

      const existingMetadata = (existing[0].metadata || {}) as Record<string, unknown>;

      await regionModule.updateRegions(setting.region_id, {
        metadata: {
          ...existingMetadata,
          shipping_cost_cents: setting.shipping_cost_cents,
          free_shipping_threshold_cents: setting.free_shipping_threshold_cents,
          delivery_days_min: setting.delivery_days_min,
          delivery_days_max: setting.delivery_days_max,
        },
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to save shipping settings:", error);
    return res.status(500).json({ error: "Versandeinstellungen konnten nicht gespeichert werden" });
  }
}
