import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text, Button, Input, Badge, Prompt } from "@medusajs/ui"
import { useState, useCallback } from "react"

interface OptionSurcharge {
  surcharge_cents: number
  [key: string]: unknown
}

interface ConfiguratorMetadata {
  configurator_type: string
  pricing: {
    base_price_per_sqm_cents: number
    min_price_cents: number
  }
  dimensions: {
    width_min: number
    width_max: number
    height_min: number
    height_max: number
  }
  options_config: Record<string, Record<string, OptionSurcharge>>
}

const ConfiguratorMetadataWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const metadata = data.metadata as unknown as ConfiguratorMetadata | null

  if (!metadata?.configurator_type) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Konfigurator-Einstellungen</Heading>
          <Badge color="green">{metadata.configurator_type}</Badge>
        </div>
      </div>

      <PricingSection
        productId={data.id}
        pricing={metadata.pricing}
        dimensions={metadata.dimensions}
        metadata={metadata}
      />

      <OptionsSection
        productId={data.id}
        optionsConfig={metadata.options_config}
        metadata={metadata}
      />
    </Container>
  )
}

// --- Pricing & Dimensions Section ---

function PricingSection({
  productId,
  pricing,
  dimensions,
  metadata,
}: {
  productId: string
  pricing: ConfiguratorMetadata["pricing"]
  dimensions: ConfiguratorMetadata["dimensions"]
  metadata: ConfiguratorMetadata
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [basePriceEur, setBasePriceEur] = useState(
    (pricing.base_price_per_sqm_cents / 100).toFixed(2)
  )
  const [minPriceEur, setMinPriceEur] = useState(
    (pricing.min_price_cents / 100).toFixed(2)
  )
  const [widthMin, setWidthMin] = useState(String(dimensions.width_min))
  const [widthMax, setWidthMax] = useState(String(dimensions.width_max))
  const [heightMin, setHeightMin] = useState(String(dimensions.height_min))
  const [heightMax, setHeightMax] = useState(String(dimensions.height_max))
  const [isSaving, setIsSaving] = useState(false)

  const save = useCallback(async () => {
    setIsSaving(true)
    try {
      const updatedMetadata = {
        ...metadata,
        pricing: {
          base_price_per_sqm_cents: Math.round(parseFloat(basePriceEur) * 100),
          min_price_cents: Math.round(parseFloat(minPriceEur) * 100),
        },
        dimensions: {
          width_min: parseInt(widthMin),
          width_max: parseInt(widthMax),
          height_min: parseInt(heightMin),
          height_max: parseInt(heightMax),
        },
      }

      const res = await fetch(`/admin/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ metadata: updatedMetadata }),
      })

      if (res.ok) {
        setIsEditing(false)
        window.location.reload()
      }
    } finally {
      setIsSaving(false)
    }
  }, [productId, basePriceEur, minPriceEur, widthMin, widthMax, heightMin, heightMax, metadata])

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <Text size="large" weight="plus">Preise & Maße</Text>
        {!isEditing ? (
          <Button variant="secondary" size="small" onClick={() => setIsEditing(true)}>
            Bearbeiten
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" size="small" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
            <Button size="small" onClick={save} isLoading={isSaving}>
              Speichern
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Basispreis pro m² (EUR)
            </label>
            <Input
              type="number"
              step="0.01"
              value={basePriceEur}
              onChange={(e) => setBasePriceEur(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Mindestpreis (EUR)
            </label>
            <Input
              type="number"
              step="0.01"
              value={minPriceEur}
              onChange={(e) => setMinPriceEur(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Breite min (mm)
            </label>
            <Input
              type="number"
              value={widthMin}
              onChange={(e) => setWidthMin(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Breite max (mm)
            </label>
            <Input
              type="number"
              value={widthMax}
              onChange={(e) => setWidthMax(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Höhe min (mm)
            </label>
            <Input
              type="number"
              value={heightMin}
              onChange={(e) => setHeightMin(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Höhe max (mm)
            </label>
            <Input
              type="number"
              value={heightMax}
              onChange={(e) => setHeightMax(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <Text className="text-gray-500">Basispreis pro m²</Text>
          <Text weight="plus">{(pricing.base_price_per_sqm_cents / 100).toFixed(2)} €</Text>
          <Text className="text-gray-500">Mindestpreis</Text>
          <Text weight="plus">{(pricing.min_price_cents / 100).toFixed(2)} €</Text>
          <Text className="text-gray-500">Breite</Text>
          <Text>{dimensions.width_min} – {dimensions.width_max} mm</Text>
          <Text className="text-gray-500">Höhe</Text>
          <Text>{dimensions.height_min} – {dimensions.height_max} mm</Text>
        </div>
      )}
    </div>
  )
}

// --- Options Section ---

function OptionsSection({
  productId,
  optionsConfig,
  metadata,
}: {
  productId: string
  optionsConfig: Record<string, Record<string, OptionSurcharge>>
  metadata: ConfiguratorMetadata
}) {
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [newOptionName, setNewOptionName] = useState("")
  const [newOptionSurcharge, setNewOptionSurcharge] = useState("0")
  const [isSaving, setIsSaving] = useState(false)

  const saveMetadata = useCallback(
    async (updatedOptionsConfig: typeof optionsConfig) => {
      setIsSaving(true)
      try {
        const updatedMetadata = { ...metadata, options_config: updatedOptionsConfig }
        const res = await fetch(`/admin/products/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ metadata: updatedMetadata }),
        })
        if (res.ok) {
          window.location.reload()
        }
      } finally {
        setIsSaving(false)
      }
    },
    [productId, metadata]
  )

  const addOption = useCallback(
    async (groupName: string) => {
      if (!newOptionName.trim()) return
      const updated = { ...optionsConfig }
      updated[groupName] = {
        ...updated[groupName],
        [newOptionName.trim()]: {
          surcharge_cents: Math.round(parseFloat(newOptionSurcharge) * 100),
        },
      }
      await saveMetadata(updated)
    },
    [optionsConfig, newOptionName, newOptionSurcharge, saveMetadata]
  )

  const removeOption = useCallback(
    async (groupName: string, optionName: string) => {
      const updated = { ...optionsConfig }
      const group = { ...updated[groupName] }
      delete group[optionName]
      updated[groupName] = group
      await saveMetadata(updated)
    },
    [optionsConfig, saveMetadata]
  )

  const addGroup = useCallback(
    async () => {
      if (!newOptionName.trim()) return
      const updated = { ...optionsConfig }
      updated[newOptionName.trim()] = {}
      await saveMetadata(updated)
    },
    [optionsConfig, newOptionName, saveMetadata]
  )

  const removeGroup = useCallback(
    async (groupName: string) => {
      const updated = { ...optionsConfig }
      delete updated[groupName]
      await saveMetadata(updated)
    },
    [optionsConfig, saveMetadata]
  )

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <Text size="large" weight="plus">Konfigurator-Optionen</Text>
      </div>

      {Object.entries(optionsConfig).map(([groupName, options]) => (
        <div key={groupName} className="mb-6 border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <Text weight="plus" size="base">{groupName}</Text>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() =>
                  setEditingGroup(editingGroup === groupName ? null : groupName)
                }
              >
                {editingGroup === groupName ? "Fertig" : "Bearbeiten"}
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => removeGroup(groupName)}
                isLoading={isSaving}
              >
                Gruppe löschen
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(options).map(([optName, config]) => (
              <div
                key={optName}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
              >
                <Text size="small">{optName}</Text>
                <div className="flex items-center gap-3">
                  <Badge color={config.surcharge_cents === 0 ? "grey" : config.surcharge_cents > 0 ? "orange" : "green"}>
                    {config.surcharge_cents === 0
                      ? "kein Aufpreis"
                      : `${config.surcharge_cents > 0 ? "+" : ""}${(config.surcharge_cents / 100).toFixed(2)} €`}
                  </Badge>
                  {editingGroup === groupName && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => removeOption(groupName, optName)}
                      isLoading={isSaving}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editingGroup === groupName && (
            <div className="mt-3 flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Name</label>
                <Input
                  placeholder="Optionsname"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="text-xs text-gray-500 mb-1 block">Aufpreis (EUR)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newOptionSurcharge}
                  onChange={(e) => setNewOptionSurcharge(e.target.value)}
                />
              </div>
              <Button
                size="small"
                onClick={() => addOption(groupName)}
                isLoading={isSaving}
              >
                Hinzufügen
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="mt-4 flex gap-2 items-end border-t pt-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Neue Optionsgruppe</label>
          <Input
            placeholder="z.B. Montagetyp"
            value={editingGroup === "__new__" ? newOptionName : ""}
            onChange={(e) => setNewOptionName(e.target.value)}
            onFocus={() => setEditingGroup("__new__")}
          />
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={addGroup}
          isLoading={isSaving}
        >
          Gruppe erstellen
        </Button>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ConfiguratorMetadataWidget
