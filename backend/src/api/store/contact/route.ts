import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { sendContactEmail, sendContactConfirmation } from "../../../lib/email";

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as ContactBody;

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return res.status(400).json({
      error: "Name, E-Mail und Nachricht sind Pflichtfelder",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({ error: "Ungültige E-Mail-Adresse" });
  }

  try {
    await sendContactEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      message: body.message.trim(),
    });

    // Bestätigung an Kunden (fire-and-forget)
    sendContactConfirmation({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    }).catch((err) => console.error("Kontaktbestätigung fehlgeschlagen:", err));

    return res.json({ success: true });
  } catch (error) {
    console.error("Kontaktformular Fehler:", error);
    return res
      .status(500)
      .json({ error: "E-Mail konnte nicht gesendet werden" });
  }
}
