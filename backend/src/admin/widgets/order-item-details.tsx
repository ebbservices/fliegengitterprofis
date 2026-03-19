import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge } from "@medusajs/ui"

interface ItemMetadata {
  bezeichnung?: string | null
  height?: number
  width?: number
  selections?: Record<string, string>
}

const OrderItemDetailsWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const items = data.items || []

  const itemsWithMeta = items.filter(
    (item) => item.metadata && (item.metadata.height || item.metadata.selections)
  )

  if (itemsWithMeta.length === 0) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Konfigurationsdetails</Heading>
      </div>

      {itemsWithMeta.map((item) => {
        const meta = item.metadata as unknown as ItemMetadata
        const selections = meta?.selections || {}

        return (
          <div key={item.id} className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <Text className="font-medium">{item.title}</Text>
              {meta?.bezeichnung && (
                <Badge color="orange">{meta.bezeichnung}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {meta?.height && meta?.width && (
                <div className="flex justify-between">
                  <Text className="text-ui-fg-subtle">Maße</Text>
                  <Text>{meta.height} × {meta.width} mm</Text>
                </div>
              )}

              {meta?.height && meta?.width && (
                <div className="flex justify-between">
                  <Text className="text-ui-fg-subtle">Fläche</Text>
                  <Text>
                    {((meta.height / 1000) * (meta.width / 1000)).toFixed(2)} m²
                  </Text>
                </div>
              )}

              {Object.entries(selections).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <Text className="text-ui-fg-subtle">{key}</Text>
                  <Text>{value}</Text>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderItemDetailsWidget
