import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Badge } from "@medusajs/ui"
import { useState, useEffect } from "react"

interface Country {
  iso_2: string
  display_name: string
}

interface RegionData {
  id: string
  name: string
  currency_code: string
  countries: Country[]
  metadata: Record<string, unknown> | null
}

interface RegionFormState {
  shippingCost: string
  freeThreshold: string
  deliveryDaysMin: string
  deliveryDaysMax: string
}

const VersandPage = () => {
  const [regions, setRegions] = useState<RegionData[]>([])
  const [formState, setFormState] = useState<Record<string, RegionFormState>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch("/admin/shipping-settings", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()

      setRegions(data.regions || [])

      const state: Record<string, RegionFormState> = {}
      for (const region of data.regions || []) {
        const meta = (region.metadata || {}) as Record<string, any>
        state[region.id] = {
          shippingCost: meta.shipping_cost_cents
            ? (meta.shipping_cost_cents / 100).toFixed(2)
            : "5.90",
          freeThreshold: meta.free_shipping_threshold_cents
            ? (meta.free_shipping_threshold_cents / 100).toFixed(2)
            : "",
          deliveryDaysMin: String(meta.delivery_days_min ?? 10),
          deliveryDaysMax: String(meta.delivery_days_max ?? 14),
        }
      }
      setFormState(state)
    } catch (e) {
      console.error("Fehler beim Laden:", e)
      setMessage({ type: "error", text: "Einstellungen konnten nicht geladen werden." })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const regionSettings = Object.entries(formState).map(([regionId, state]) => ({
        region_id: regionId,
        shipping_cost_cents: state.shippingCost
          ? Math.round(parseFloat(state.shippingCost) * 100)
          : 590,
        free_shipping_threshold_cents: state.freeThreshold
          ? Math.round(parseFloat(state.freeThreshold) * 100)
          : null,
        delivery_days_min: parseInt(state.deliveryDaysMin) || 10,
        delivery_days_max: parseInt(state.deliveryDaysMax) || 14,
      }))

      const res = await fetch("/admin/shipping-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ region_settings: regionSettings }),
      })

      if (!res.ok) throw new Error("Save failed")
      setMessage({ type: "success", text: "Versandeinstellungen gespeichert." })
      setTimeout(() => setMessage(null), 4000)
    } catch (e) {
      console.error("Fehler beim Speichern:", e)
      setMessage({ type: "error", text: "Speichern fehlgeschlagen." })
    } finally {
      setSaving(false)
    }
  }

  const updateRegionField = (regionId: string, field: keyof RegionFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [regionId]: { ...prev[regionId], [field]: value },
    }))
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Text>Laden...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-0">
      <div className="p-8 max-w-3xl">
        <Heading level="h1" className="mb-2">
          Versandeinstellungen
        </Heading>
        <Text className="text-ui-fg-subtle mb-8">
          Versandkosten, Lieferzeiten und Schwellenwerte pro Region.
          Regionen und Länder werden unter Einstellungen &rarr; Regionen verwaltet.
        </Text>

        {regions.length === 0 && (
          <div className="rounded-lg border border-ui-border-base p-6 mb-6">
            <Text className="text-ui-fg-subtle">
              Keine Regionen vorhanden. Erstellen Sie zuerst Regionen unter Einstellungen &rarr; Regionen.
            </Text>
          </div>
        )}

        {regions.map((region) => {
          const state = formState[region.id]
          if (!state) return null

          return (
            <div key={region.id} className="rounded-lg border border-ui-border-base mb-6">
              <div className="px-6 py-4 border-b border-ui-border-base flex items-center justify-between">
                <div>
                  <Heading level="h2">{region.name}</Heading>
                  <Text className="text-ui-fg-subtle text-sm mt-1">
                    {region.countries?.length
                      ? region.countries.map((c) => c.display_name || c.iso_2.toUpperCase()).join(", ")
                      : "Keine Länder zugewiesen"}
                  </Text>
                </div>
                <Badge color="grey">{region.currency_code.toUpperCase()}</Badge>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Text className="font-medium mb-3">Lieferzeit</Text>
                  <Text className="text-ui-fg-subtle text-sm mb-3">
                    Produkte werden individuell hergestellt. Geben Sie die voraussichtliche Lieferzeit an.
                  </Text>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-ui-fg-subtle mb-1">Minimum (Werktage)</label>
                      <Input
                        type="number"
                        min={1}
                        value={state.deliveryDaysMin}
                        onChange={(e) => updateRegionField(region.id, "deliveryDaysMin", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ui-fg-subtle mb-1">Maximum (Werktage)</label>
                      <Input
                        type="number"
                        min={1}
                        value={state.deliveryDaysMax}
                        onChange={(e) => updateRegionField(region.id, "deliveryDaysMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <Text className="text-ui-fg-muted text-xs mt-2">
                    Anzeige im Shop: &bdquo;{state.deliveryDaysMin}&ndash;{state.deliveryDaysMax} Werktage&ldquo;
                  </Text>
                </div>

                <div>
                  <Text className="font-medium mb-3">Versandkosten</Text>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-ui-fg-subtle mb-1">
                        Versandkosten ({region.currency_code.toUpperCase()})
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={state.shippingCost}
                        onChange={(e) => updateRegionField(region.id, "shippingCost", e.target.value)}
                        placeholder="5.90"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ui-fg-subtle mb-1">
                        Versandkostenfrei ab ({region.currency_code.toUpperCase()})
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={state.freeThreshold}
                        onChange={(e) => updateRegionField(region.id, "freeThreshold", e.target.value)}
                        placeholder="Leer = nie kostenlos"
                      />
                      <Text className="text-ui-fg-muted text-xs mt-1">
                        Leer lassen = Versand immer kostenpflichtig
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {message && (
          <div
            className={`rounded-lg p-4 mb-4 ${
              message.type === "success"
                ? "bg-ui-bg-success text-ui-fg-on-color border border-green-200"
                : "bg-ui-bg-error text-ui-fg-on-color border border-red-200"
            }`}
          >
            <Text>{message.text}</Text>
          </div>
        )}

        {regions.length > 0 && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Wird gespeichert..." : "Speichern"}
          </Button>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Versand",
})

export default VersandPage
