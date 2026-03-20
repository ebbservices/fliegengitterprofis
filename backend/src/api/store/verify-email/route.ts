import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

interface VerifyBody {
  token: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as VerifyBody;

    if (!body.token) {
      return res.status(400).json({ error: "Token ist erforderlich" });
    }

    // Customer-ID aus Token extrahieren
    const parts = body.token.split("__");
    if (parts.length !== 2) {
      return res.status(400).json({ error: "Ungültiger Token" });
    }

    const customerId = parts[0];
    const customerModule = req.scope.resolve("customer");

    let customer;
    try {
      customer = await customerModule.retrieveCustomer(customerId);
    } catch {
      return res.status(400).json({ error: "Ungültiger Token" });
    }

    const metadata = customer.metadata as Record<string, unknown> | null;

    // Token prüfen
    if (!metadata?.verification_token || metadata.verification_token !== body.token) {
      return res.status(400).json({ error: "Ungültiger oder bereits verwendeter Token" });
    }

    // Ablauf prüfen
    const expiresAt = metadata.verification_token_expires as string;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res.status(400).json({ error: "Der Bestätigungslink ist abgelaufen" });
    }

    // E-Mail als verifiziert markieren
    await customerModule.updateCustomers(customerId, {
      metadata: {
        ...(metadata || {}),
        email_verified: true,
        verification_token: null,
        verification_token_expires: null,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("E-Mail-Verifizierung Fehler:", error);
    return res.status(500).json({
      error: "Verifizierung fehlgeschlagen",
    });
  }
}
