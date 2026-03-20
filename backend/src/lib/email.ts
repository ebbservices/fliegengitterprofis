import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const fromEmail = process.env.SMTP_FROM_EMAIL || "info@mobatix.de";
const fromName = process.env.SMTP_FROM_NAME || "Mobatix GmbH";

interface OrderEmailData {
  orderId: string;
  displayId: number | string;
  email: string;
  firstName: string;
  lastName: string;
  address: {
    address_1: string;
    address_2?: string;
    postal_code: string;
    city: string;
    country_code: string;
  };
  items: {
    title: string;
    bezeichnung?: string;
    height: number;
    width: number;
    price: string;
    selections: Record<string, string>;
  }[];
  subtotal: string;
  shippingCost: string;
  total: string;
}

function formatPrice(price: string): string {
  return parseFloat(price).toFixed(2).replace(".", ",") + " €";
}

function buildItemRows(items: OrderEmailData["items"]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.title}</strong>
          ${item.bezeichnung ? `<br><span style="color: #FF8C42;">${item.bezeichnung}</span>` : ""}
          <br><span style="color: #666; font-size: 13px;">${item.height} × ${item.width} mm</span>
          ${Object.entries(item.selections)
            .map(([k, v]) => `<br><span style="color: #666; font-size: 13px;">${k}: ${v}</span>`)
            .join("")}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
          ${formatPrice(item.price)}
        </td>
      </tr>`
    )
    .join("");
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
  <div style="background: linear-gradient(135deg, #FF8C42, #e07a35); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Bestellbestätigung</h1>
  </div>

  <div style="padding: 30px;">
    <p>Hallo ${data.firstName} ${data.lastName},</p>
    <p>vielen Dank für Ihre Bestellung <strong>#${data.displayId}</strong>. Wir haben Ihren Auftrag erhalten und beginnen mit der Bearbeitung, sobald die Zahlung eingegangen ist.</p>

    <div style="background: #FFF7ED; border: 1px solid #FF8C42; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <strong>Zahlungsart: Vorkasse / Banküberweisung</strong>
      <p style="margin: 8px 0 0;">Sie erhalten die Bankdaten in einer separaten E-Mail. Bitte überweisen Sie den Gesamtbetrag unter Angabe der Bestellnummer <strong>#${data.displayId}</strong>.</p>
    </div>

    <h2 style="font-size: 18px; border-bottom: 2px solid #FF8C42; padding-bottom: 8px;">Ihre Artikel</h2>
    <table style="width: 100%; border-collapse: collapse;">
      ${buildItemRows(data.items)}
      <tr>
        <td style="padding: 8px 12px; color: #666;">Zwischensumme</td>
        <td style="padding: 8px 12px; text-align: right;">${formatPrice(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; color: #666;">Versand</td>
        <td style="padding: 8px 12px; text-align: right;">${data.shippingCost === "0.00" ? '<span style="color: #16a34a;">Kostenlos</span>' : formatPrice(data.shippingCost)}</td>
      </tr>
      <tr style="font-size: 18px; font-weight: bold;">
        <td style="padding: 12px; border-top: 2px solid #2C2C2C;">Gesamt</td>
        <td style="padding: 12px; border-top: 2px solid #2C2C2C; text-align: right;">${formatPrice(data.total)}</td>
      </tr>
    </table>

    <h2 style="font-size: 18px; border-bottom: 2px solid #FF8C42; padding-bottom: 8px; margin-top: 30px;">Lieferadresse</h2>
    <p>
      ${data.firstName} ${data.lastName}<br>
      ${data.address.address_1}<br>
      ${data.address.address_2 ? data.address.address_2 + "<br>" : ""}
      ${data.address.postal_code} ${data.address.city}<br>
      ${data.address.country_code.toUpperCase()}
    </p>

    <p style="margin-top: 30px; color: #666; font-size: 13px;">
      Ihre Produkte werden nach Zahlungseingang individuell für Sie hergestellt. Wir informieren Sie per E-Mail über den Versand.
    </p>
  </div>

  <div style="background: #2C2C2C; color: white; padding: 20px; text-align: center; font-size: 13px;">
    <p style="margin: 0;">${fromName}</p>
  </div>
</body>
</html>`;
}

function buildAdminNotificationHtml(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Neue Bestellung #${data.displayId}</h2>
  <p><strong>Kunde:</strong> ${data.firstName} ${data.lastName} (${data.email})</p>
  <p><strong>Adresse:</strong> ${data.address.address_1}, ${data.address.postal_code} ${data.address.city}, ${data.address.country_code.toUpperCase()}</p>
  <p><strong>Gesamt:</strong> ${formatPrice(data.total)}</p>
  <p><strong>Versand:</strong> ${data.shippingCost === "0.00" ? "Kostenlos" : formatPrice(data.shippingCost)}</p>
  <h3>Artikel:</h3>
  <ul>
    ${data.items
      .map(
        (item) =>
          `<li><strong>${item.title}</strong>${item.bezeichnung ? ` (${item.bezeichnung})` : ""} — ${item.height}×${item.width}mm — ${formatPrice(item.price)}
          <br>${Object.entries(item.selections).map(([k, v]) => `${k}: ${v}`).join(", ")}</li>`
      )
      .join("")}
  </ul>
  <p><strong>Zahlung:</strong> Vorkasse (ausstehend)</p>
</body>
</html>`;
}

export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP nicht konfiguriert — E-Mail wird übersprungen");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.email,
      subject: `Bestellbestätigung #${data.displayId} — ${fromName}`,
      html: buildOrderConfirmationHtml(data),
    });
    console.log(`Bestellbestätigung an ${data.email} gesendet`);
  } catch (error) {
    console.error("Fehler beim Senden der Bestellbestätigung:", error);
  }
}

// --- Kontaktformular ---

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function buildContactEmailHtml(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
  <div style="background: linear-gradient(135deg, #FF8C42, #e07a35); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Neue Projektanfrage</h1>
  </div>
  <div style="padding: 30px;">
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>E-Mail:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ""}
    <h3 style="border-bottom: 2px solid #FF8C42; padding-bottom: 8px;">Nachricht</h3>
    <p style="white-space: pre-wrap;">${data.message}</p>
  </div>
  <div style="background: #2C2C2C; color: white; padding: 20px; text-align: center; font-size: 13px;">
    <p style="margin: 0;">${fromName}</p>
  </div>
</body>
</html>`;
}

function buildContactConfirmationHtml(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
  <div style="background: linear-gradient(135deg, #FF8C42, #e07a35); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Ihre Anfrage</h1>
  </div>
  <div style="padding: 30px;">
    <p>Hallo ${data.name},</p>
    <p>vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.</p>
    <div style="background: #F5F5F5; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
    </div>
    <p style="color: #666; font-size: 13px;">Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
  </div>
  <div style="background: #2C2C2C; color: white; padding: 20px; text-align: center; font-size: 13px;">
    <p style="margin: 0;">${fromName}</p>
  </div>
</body>
</html>`;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP nicht konfiguriert — Kontakt-E-Mail wird übersprungen");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: fromEmail,
      replyTo: data.email,
      subject: `Neue Projektanfrage von ${data.name}`,
      html: buildContactEmailHtml(data),
    });
    console.log(`Kontaktanfrage von ${data.email} an Admin gesendet`);
  } catch (error) {
    console.error("Fehler beim Senden der Kontakt-E-Mail:", error);
    throw error;
  }
}

export async function sendContactConfirmation(data: ContactEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.email,
      subject: `Ihre Anfrage bei ${fromName}`,
      html: buildContactConfirmationHtml(data),
    });
    console.log(`Kontaktbestätigung an ${data.email} gesendet`);
  } catch (error) {
    console.error("Fehler beim Senden der Kontaktbestätigung:", error);
  }
}

// --- E-Mail-Verifizierung ---

interface VerificationEmailData {
  email: string;
  firstName: string;
  verificationUrl: string;
}

function buildVerificationEmailHtml(data: VerificationEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
  <div style="background: linear-gradient(135deg, #FF8C42, #e07a35); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">E-Mail bestätigen</h1>
  </div>
  <div style="padding: 30px;">
    <p>Hallo ${data.firstName},</p>
    <p>vielen Dank für Ihre Registrierung! Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Button klicken:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.verificationUrl}" style="background: #FF8C42; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
        E-Mail bestätigen
      </a>
    </div>
    <p style="color: #666; font-size: 13px;">Oder kopieren Sie diesen Link in Ihren Browser:</p>
    <p style="color: #666; font-size: 13px; word-break: break-all;">${data.verificationUrl}</p>
    <p style="color: #666; font-size: 13px; margin-top: 20px;">Dieser Link ist 48 Stunden gültig.</p>
  </div>
  <div style="background: #2C2C2C; color: white; padding: 20px; text-align: center; font-size: 13px;">
    <p style="margin: 0;">${fromName}</p>
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(data: VerificationEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP nicht konfiguriert — Verifizierungs-E-Mail wird übersprungen");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.email,
      subject: `E-Mail-Adresse bestätigen — ${fromName}`,
      html: buildVerificationEmailHtml(data),
    });
    console.log(`Verifizierungs-E-Mail an ${data.email} gesendet`);
  } catch (error) {
    console.error("Fehler beim Senden der Verifizierungs-E-Mail:", error);
    throw error;
  }
}

export async function sendAdminNotification(data: OrderEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: fromEmail,
      subject: `Neue Bestellung #${data.displayId} von ${data.firstName} ${data.lastName}`,
      html: buildAdminNotificationHtml(data),
    });
    console.log(`Admin-Benachrichtigung an ${fromEmail} gesendet`);
  } catch (error) {
    console.error("Fehler beim Senden der Admin-Benachrichtigung:", error);
  }
}
