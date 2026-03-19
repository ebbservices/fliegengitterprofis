import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { sendOrderConfirmation, sendAdminNotification } from "../../../lib/email";

interface OrderItem {
  product: string;
  bezeichnung?: string;
  height: number;
  width: number;
  price: string;
  selections: Record<string, string>;
}

interface PlaceOrderBody {
  email: string;
  billing_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    postal_code: string;
    city: string;
    country_code: string;
    phone?: string;
  };
  items: OrderItem[];
  shipping_cost_cents: number;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as PlaceOrderBody;

    if (!body.email || !body.billing_address || !body.items?.length) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    const regionModule = req.scope.resolve("region");
    const orderModule = req.scope.resolve("order");

    // Region für das Land finden
    const regions = await regionModule.listRegions(
      {},
      { relations: ["countries"], select: ["id", "name", "currency_code"] }
    );

    const region = regions.find((r: any) =>
      r.countries?.some(
        (c: any) => c.iso_2 === body.billing_address.country_code
      )
    );

    if (!region) {
      return res.status(400).json({ error: "Kein Versand in dieses Land verfügbar" });
    }

    // Bestellpositionen erstellen
    const orderItems = body.items.map((item) => ({
      title: item.product,
      subtitle: item.bezeichnung || undefined,
      quantity: 1,
      unit_price: parseFloat(item.price),
      metadata: {
        bezeichnung: item.bezeichnung || null,
        height: item.height,
        width: item.width,
        selections: item.selections,
      },
    }));

    // Bestellung erstellen
    const order = await orderModule.createOrders({
      region_id: region.id,
      email: body.email,
      currency_code: region.currency_code,
      shipping_address: {
        first_name: body.billing_address.first_name,
        last_name: body.billing_address.last_name,
        address_1: body.billing_address.address_1,
        address_2: body.billing_address.address_2 || "",
        city: body.billing_address.city,
        postal_code: body.billing_address.postal_code,
        country_code: body.billing_address.country_code,
        phone: body.billing_address.phone || "",
      },
      billing_address: {
        first_name: body.billing_address.first_name,
        last_name: body.billing_address.last_name,
        address_1: body.billing_address.address_1,
        address_2: body.billing_address.address_2 || "",
        city: body.billing_address.city,
        postal_code: body.billing_address.postal_code,
        country_code: body.billing_address.country_code,
        phone: body.billing_address.phone || "",
      },
      items: orderItems,
      shipping_methods: [
        {
          name: "Standardversand",
          amount: body.shipping_cost_cents / 100,
        },
      ],
      metadata: {
        payment_method: "prepayment",
        source: "webshop",
      },
    });

    // Emails senden (async, blockiert nicht die Response)
    const subtotal = body.items.reduce((sum, i) => sum + parseFloat(i.price), 0);
    const shippingEur = body.shipping_cost_cents / 100;
    const total = subtotal + shippingEur;

    const emailData = {
      orderId: order.id,
      displayId: order.display_id ?? order.id,
      email: body.email,
      firstName: body.billing_address.first_name,
      lastName: body.billing_address.last_name,
      address: body.billing_address,
      items: body.items.map((i) => ({
        title: i.product,
        bezeichnung: i.bezeichnung,
        height: i.height,
        width: i.width,
        price: i.price,
        selections: i.selections,
      })),
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingEur.toFixed(2),
      total: total.toFixed(2),
    };

    sendOrderConfirmation(emailData).catch(() => {});
    sendAdminNotification(emailData).catch(() => {});

    return res.json({
      order_id: order.id,
      display_id: order.display_id,
    });
  } catch (error) {
    console.error("Bestellung fehlgeschlagen:", error);
    return res.status(500).json({
      error: "Bestellung konnte nicht erstellt werden",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
