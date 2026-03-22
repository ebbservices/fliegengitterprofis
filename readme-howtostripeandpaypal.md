# Stripe & PayPal Zahlungen aktivieren

## Konzept

Der Shop nutzt **Stripe** als Payment Provider. PayPal ist **kein separater Provider**, sondern wird als Zahlungsmethode **innerhalb von Stripe** aktiviert. Stripe bietet über das "Payment Element" verschiedene Zahlungsmethoden an:

- Kreditkarte (Visa, Mastercard, Amex)
- PayPal
- SEPA-Lastschrift
- Klarna, giropay, etc.

Welche Methoden angezeigt werden, steuert der Kunde im **Stripe Dashboard** selbst.

## Voraussetzungen

- Stripe-Account (https://stripe.com)
- Zugang zum Kubernetes-Cluster (kubectl)
- Zugang zur Medusa Admin UI

---

## Schritt 1: Stripe-Account erstellen

1. Auf https://dashboard.stripe.com registrieren
2. Business-Verifizierung durchführen
3. **API Keys** holen:
   - Stripe Dashboard → Developers → API Keys
   - **Secret Key** kopieren (beginnt mit `sk_live_` oder `sk_test_`)
4. **Webhook Secret** erstellen:
   - Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://admin.diefliegengitterprofis.mobatix.de/hooks/payment/stripe_stripe`
   - Events auswählen: Alle `payment_intent` Events
   - **Signing Secret** kopieren (beginnt mit `whsec_`)

## Schritt 2: Keys auf dem Cluster setzen

### Option A: Aktivierungsscript (empfohlen)

```bash
./scripts/activate-stripe.sh sk_live_DEIN_KEY whsec_DEIN_WEBHOOK_SECRET
```

Das Script:
1. Aktualisiert das K8s Secret `medusa-secrets` mit den Stripe Keys
2. Startet das Medusa Backend neu
3. Zeigt die nächsten Schritte an

### Option B: Manuell

```bash
# Secret patchen
kubectl get secret medusa-secrets -n default -o json | \
  jq --arg key "$(echo -n 'sk_live_DEIN_KEY' | base64)" \
     --arg webhook "$(echo -n 'whsec_DEIN_SECRET' | base64)" \
     '.data["STRIPE_API_KEY"]=$key | .data["STRIPE_WEBHOOK_SECRET"]=$webhook' | \
  kubectl apply -f -

# Backend neustarten
kubectl rollout restart deployment/medusa-backend -n default
```

## Schritt 3: In Admin UI aktivieren

1. Medusa Admin UI öffnen: https://admin.diefliegengitterprofis.mobatix.de
2. Einloggen
3. **Settings** → **Regions** → Region "Deutschland" (oder entsprechende Region) bearbeiten
4. Unter **Payment Providers**: `stripe` aktivieren
5. Speichern

Ab jetzt ist Stripe als Zahlungsmethode im Checkout verfügbar.

## Schritt 4: PayPal über Stripe aktivieren (optional)

1. Stripe Dashboard → Settings → Payment methods
2. **PayPal** aktivieren
3. PayPal-Business-Account verknüpfen (Stripe leitet durch den Prozess)
4. Fertig — PayPal erscheint automatisch im Checkout als Zahlungsoption

## Schritt 5: Weitere Zahlungsmethoden (optional)

Im Stripe Dashboard unter Settings → Payment methods können weitere Methoden aktiviert werden:

| Methode | Beschreibung |
|---------|-------------|
| SEPA-Lastschrift | Bankeinzug für DE/AT/CH |
| Klarna | Rechnung / Ratenzahlung |
| giropay | Online-Banking DE |
| Sofort | Online-Banking DE/AT |
| Apple Pay / Google Pay | Automatisch aktiv mit Stripe |

---

## Test-Modus

Zum Testen vor dem Go-Live:

1. Im Stripe Dashboard auf **Test Mode** wechseln
2. **Test API Key** verwenden (beginnt mit `sk_test_`)
3. Test-Kreditkarte: `4242 4242 4242 4242`, beliebiges Ablaufdatum, beliebige CVC
4. Wenn alles funktioniert: Live Keys setzen via `./scripts/activate-stripe.sh`

---

## Fehlerbehebung

### Stripe Provider erscheint nicht in der Admin UI
- Prüfen ob `STRIPE_API_KEY` gesetzt ist:
  ```bash
  kubectl get secret medusa-secrets -n default -o jsonpath='{.data.STRIPE_API_KEY}' | base64 -d
  ```
- Prüfen ob Backend läuft:
  ```bash
  kubectl get pods -n default | grep medusa
  ```
- Backend-Logs prüfen:
  ```bash
  kubectl logs deployment/medusa-backend -n default --tail=50
  ```

### Webhook-Fehler
- Webhook-URL korrekt? `https://admin.diefliegengitterprofis.mobatix.de/hooks/payment/stripe_stripe`
- Webhook Secret gesetzt?
- Stripe Dashboard → Developers → Webhooks → Events prüfen

### Keys aktualisieren
Einfach das Script nochmal ausführen mit den neuen Keys:
```bash
./scripts/activate-stripe.sh sk_live_NEUER_KEY whsec_NEUES_SECRET
```

---

## Technische Details

### Wie es funktioniert
- `medusa-config.ts` lädt Stripe nur wenn `STRIPE_API_KEY` gesetzt ist (conditional loading)
- Ohne Key startet das Backend normal, nur ohne Stripe-Provider
- Die Keys liegen im K8s Secret `medusa-secrets` und werden als Env-Vars injiziert
- Kein Code-Deployment nötig um Keys zu ändern — nur Secret updaten + Pod restart

### Relevante Dateien
| Datei | Zweck |
|-------|-------|
| `backend/medusa-config.ts` | Stripe Provider Konfiguration |
| `backend/.env.template` | Env-Var Referenz |
| `k8s/secrets.yaml` | K8s Secret Template |
| `scripts/activate-stripe.sh` | Aktivierungsscript |

### Frontend-Integration (Zukunft)
Sobald Stripe aktiv ist, muss der Checkout (`app/shop/checkout/page.tsx`) um das **Stripe Payment Element** erweitert werden. Aktuell ist nur "Vorkasse/Banküberweisung" implementiert. Die Frontend-Integration ist ein separater Schritt.
