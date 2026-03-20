import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../lib/email";

interface LinkOrderBody {
  customer_id: string;
  order_id: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as LinkOrderBody;

    if (!body.customer_id || !body.order_id) {
      return res.status(400).json({ error: "customer_id und order_id sind erforderlich" });
    }

    const orderModule = req.scope.resolve("order");
    const customerModule = req.scope.resolve("customer");

    // Order dem Kunden zuordnen
    try {
      await orderModule.updateOrders(body.order_id, {
        customer_id: body.customer_id,
      });
    } catch (err) {
      console.error("Order-Zuordnung fehlgeschlagen:", err);
      // Nicht abbrechen — Verifizierung kann trotzdem gesendet werden
    }

    // Kunden-Daten laden
    const customer = await customerModule.retrieveCustomer(body.customer_id);

    // Verification-Token generieren
    const tokenRandom = crypto.randomBytes(32).toString("hex");
    const token = `${body.customer_id}__${tokenRandom}`;
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    // Token in Customer-Metadata speichern
    await customerModule.updateCustomers(body.customer_id, {
      metadata: {
        ...(customer.metadata || {}),
        verification_token: token,
        verification_token_expires: expiresAt,
      },
    });

    // Verifizierungs-URL bauen
    const frontendUrl = process.env.STORE_CORS?.split(",")[0] || "http://localhost:3000";
    const verificationUrl = `${frontendUrl}/konto/verifizieren?token=${encodeURIComponent(token)}`;

    // E-Mail senden
    await sendVerificationEmail({
      email: customer.email,
      firstName: customer.first_name || "Kunde",
      verificationUrl,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Link-Order-Verify Fehler:", error);
    return res.status(500).json({
      error: "Verknüpfung fehlgeschlagen",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
