import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

// =============================================================================
// Produkt-Konfigurationsdaten für den Fliegengitter-Shop
// =============================================================================

const PRODUCTS = {
  fliegengitter: {
    title: "Fliegengitter nach Maß",
    handle: "fliegengitter-nach-mass",
    description:
      "Maßgefertigtes Fliegengitter mit Aluminium- oder Kunststoffrahmen. Individuelle Größe, Farbe und Gewebeart wählbar. Professioneller Insektenschutz für Ihr Zuhause.",
    sku: "FG-STANDARD",
    categoryName: "Fliegengitter",
    metadata: {
      configurator_type: "fliegengitter",
      pricing: {
        base_price_per_sqm_cents: 4500,
        min_price_cents: 8900,
      },
      dimensions: {
        width_min: 100,
        width_max: 3000,
        height_min: 100,
        height_max: 3000,
      },
      options_config: {
        Farbe: {
          "Weiß (RAL 9016)": { surcharge_cents: 0, ral_code: "9016" },
          "Anthrazit (RAL 7016)": { surcharge_cents: 1500, ral_code: "7016" },
          "Braun (RAL 8014)": { surcharge_cents: 1500, ral_code: "8014" },
          "RAL Wunschfarbe": { surcharge_cents: 3500, custom_ral: true },
        },
        Rahmentyp: {
          "Aluminium-Rahmen": { surcharge_cents: 0 },
          "Kunststoff-Rahmen": { surcharge_cents: -1000 },
          "Premium Aluminium": { surcharge_cents: 2500 },
        },
        Gittertyp: {
          "Standard-Polenfilter": { surcharge_cents: 0 },
          "Pollenschutzgewebe": { surcharge_cents: 2000 },
          Katzennetz: { surcharge_cents: 1500 },
        },
      },
    },
    options: [
      {
        title: "Farbe",
        values: [
          "Weiß (RAL 9016)",
          "Anthrazit (RAL 7016)",
          "Braun (RAL 8014)",
          "RAL Wunschfarbe",
        ],
      },
      {
        title: "Rahmentyp",
        values: ["Aluminium-Rahmen", "Kunststoff-Rahmen", "Premium Aluminium"],
      },
      {
        title: "Gittertyp",
        values: ["Standard-Polenfilter", "Pollenschutzgewebe", "Katzennetz"],
      },
    ],
    defaultVariant: {
      title: "Fliegengitter - Standardkonfiguration",
      options: {
        Farbe: "Weiß (RAL 9016)",
        Rahmentyp: "Aluminium-Rahmen",
        Gittertyp: "Standard-Polenfilter",
      },
      price: 8900,
    },
  },

  plissee: {
    title: "Plissee nach Maß",
    handle: "plissee-nach-mass",
    description:
      "Maßgefertigtes Plissee für Fenster und Türen. Wählen Sie zwischen Sonnenschutz, Verdunkelung und Wabenplissee. Perfekter Sicht- und Sonnenschutz nach Maß.",
    sku: "PL-STANDARD",
    categoryName: "Plissee",
    metadata: {
      configurator_type: "plissee",
      pricing: {
        base_price_per_sqm_cents: 6500,
        min_price_cents: 12900,
      },
      dimensions: {
        width_min: 100,
        width_max: 3000,
        height_min: 100,
        height_max: 3000,
      },
      options_config: {
        "Plissee-Typ": {
          Sonnenschutz: { surcharge_cents: 0 },
          Verdunkelung: { surcharge_cents: 3500 },
          Wabenplissee: { surcharge_cents: 5000 },
        },
      },
    },
    options: [
      {
        title: "Plissee-Typ",
        values: ["Sonnenschutz", "Verdunkelung", "Wabenplissee"],
      },
    ],
    defaultVariant: {
      title: "Plissee - Standardkonfiguration",
      options: {
        "Plissee-Typ": "Sonnenschutz",
      },
      price: 12900,
    },
  },

  lichtschacht: {
    title: "Lichtschachtabdeckung nach Maß",
    handle: "lichtschachtabdeckung-nach-mass",
    description:
      "Maßgefertigte Lichtschachtabdeckung aus robustem Material. Schützt vor Laub, Schmutz und Ungeziefer. Individuelle Größe und Farbe wählbar.",
    sku: "LS-STANDARD",
    categoryName: "Lichtschachtabdeckungen",
    metadata: {
      configurator_type: "lichtschacht",
      pricing: {
        base_price_per_sqm_cents: 8500,
        min_price_cents: 14900,
      },
      dimensions: {
        width_min: 100,
        width_max: 2500,
        height_min: 100,
        height_max: 2500,
      },
      options_config: {
        Farbe: {
          Verzinkt: { surcharge_cents: 0 },
          "Anthrazit (RAL 7016)": { surcharge_cents: 2500, ral_code: "7016" },
          "Weiß (RAL 9016)": { surcharge_cents: 2500, ral_code: "9016" },
        },
      },
    },
    options: [
      {
        title: "Farbe",
        values: ["Verzinkt", "Anthrazit (RAL 7016)", "Weiß (RAL 9016)"],
      },
    ],
    defaultVariant: {
      title: "Lichtschachtabdeckung - Standardkonfiguration",
      options: {
        Farbe: "Verzinkt",
      },
      price: 14900,
    },
  },
} as const;

// =============================================================================
// Workflow für Store-Währungen
// =============================================================================

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => ({
              currency_code: currency.currency_code,
              is_default: currency.is_default ?? false,
            })
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

// =============================================================================
// Seed-Funktion
// =============================================================================

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Starte Seed für Fliegengitter-Shop...");

  // =========================================================================
  // Store & Währung
  // =========================================================================
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "eur", is_default: true },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // =========================================================================
  // Region: Deutschland
  // =========================================================================
  logger.info("Erstelle Region Deutschland...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Deutschland",
          currency_code: "eur",
          countries: ["de"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];

  // =========================================================================
  // Steuer: Deutschland
  // =========================================================================
  logger.info("Erstelle Steuerregion...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "de",
        provider_id: "tp_system",
      },
    ],
  });

  // =========================================================================
  // Lager & Fulfillment
  // =========================================================================
  logger.info("Erstelle Lager...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Lager Deutschland",
          address: {
            city: "Berlin",
            country_code: "DE",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // =========================================================================
  // Versandprofil & Versandoptionen
  // =========================================================================
  logger.info("Erstelle Versandoptionen...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Standard Versandprofil",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Deutschland Lieferung",
    type: "shipping",
    service_zones: [
      {
        name: "Deutschland",
        geo_zones: [
          {
            country_code: "de",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standardversand",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Lieferung in 5-7 Werktagen.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 590,
          },
          {
            region_id: region.id,
            amount: 590,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Expressversand",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Lieferung in 2-3 Werktagen.",
          code: "express",
        },
        prices: [
          {
            currency_code: "eur",
            amount: 1490,
          },
          {
            region_id: region.id,
            amount: 1490,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // =========================================================================
  // Publishable API Key
  // =========================================================================
  logger.info("Erstelle API Key...");
  let publishableApiKey: ApiKey | null = null;
  const { data: apiKeyData } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = apiKeyData?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // =========================================================================
  // Produkt-Kategorien
  // =========================================================================
  logger.info("Erstelle Produkt-Kategorien...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Fliegengitter",
          handle: "fliegengitter",
          is_active: true,
        },
        {
          name: "Plissee",
          handle: "plissee",
          is_active: true,
        },
        {
          name: "Lichtschachtabdeckungen",
          handle: "lichtschachtabdeckungen",
          is_active: true,
        },
      ],
    },
  });

  // =========================================================================
  // Produkte
  // =========================================================================
  logger.info("Erstelle 3 konfigurierbare Produkte...");

  const productConfigs = [
    PRODUCTS.fliegengitter,
    PRODUCTS.plissee,
    PRODUCTS.lichtschacht,
  ];

  await createProductsWorkflow(container).run({
    input: {
      products: productConfigs.map((config) => ({
        title: config.title,
        handle: config.handle,
        description: config.description,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        category_ids: [
          categoryResult.find((cat) => cat.name === config.categoryName)!.id,
        ],
        options: config.options.map((opt) => ({
          title: opt.title,
          values: [...opt.values],
        })),
        variants: [
          {
            title: config.defaultVariant.title,
            sku: config.sku,
            manage_inventory: true,
            options: { ...config.defaultVariant.options },
            prices: [
              {
                amount: config.defaultVariant.price,
                currency_code: "eur",
              },
            ],
          },
        ],
        metadata: config.metadata as Record<string, unknown>,
        sales_channels: [{ id: defaultSalesChannel[0].id }],
      })),
    },
  });

  logger.info("Produkte erstellt: Fliegengitter, Plissee, Lichtschachtabdeckung");

  // =========================================================================
  // Inventar (Made-to-order → hoher Bestand)
  // =========================================================================
  logger.info("Erstelle Inventar...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map(
    (item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 999999,
      inventory_item_id: item.id,
    })
  );

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  });

  // =========================================================================
  logger.info("Seed abgeschlossen! 3 Produkte mit Konfigurator-Metadata angelegt.");
  logger.info(`Publishable API Key ID: ${publishableApiKey.id}`);
}
