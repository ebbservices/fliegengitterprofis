# Plan: Medusa Backend Integration — Shop, Auth, Cart, Checkout

## Context

Der Shop "Die Fliegengitter Profis" hat ein funktionales Next.js 16 Frontend mit 3 Produkt-Konfiguratoren (Fliegengitter, Plissee, Lichtschachtabdeckungen), aber alles ist statisch/hardcoded. Preise werden client-seitig berechnet, der Warenkorb liegt in LocalStorage, es gibt keine Authentifizierung, keinen Checkout und keine Backend-Anbindung. Das Medusa 2.13.1 Backend ist installiert aber enthält nur Demo-Daten (T-Shirts).

**Ziel:** Vollständige Integration Frontend ↔ Medusa Backend mit Produkt-Seed, Cart, User-Login, Checkout (Vorkasse), Admin-Dashboard Deployment und Security-Härtung.

---

## Phase 0: Security — Credential Rotation & Härtung
> Vor allem anderen. Klartext-Passwörter im Repo sind ein aktives Risiko.

### 0.1 Passwörter rotieren
- Neues PostgreSQL-Passwort generieren, DB-User updaten
- Neues Docker-Registry-Passwort (`registry.mobatix.de`)
- Starke JWT + Cookie Secrets generieren: `openssl rand -base64 64`

### 0.2 Secrets aus tracked Files entfernen
- `backend/.env.template` — DB-Passwörter aus Kommentaren entfernen, Platzhalter verwenden
- `deploy-to-k8s.ps1` — `$RegistryPassword` Default-Wert entfernen, aus Env-Variable lesen
- `deploy-to-k8s.ps1.backup` — Datei löschen
- `backend/medusa-config.ts` — Fallback `"supersecret"` durch Error ersetzen:
  ```typescript
  jwtSecret: process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET not set") })(),
  cookieSecret: process.env.COOKIE_SECRET ?? (() => { throw new Error("COOKIE_SECRET not set") })(),
  ```

### 0.3 CORS aufräumen
- `https://docs.medusajs.com` aus allen CORS-Settings entfernen (STORE_CORS, ADMIN_CORS, AUTH_CORS)

### 0.4 Kubernetes Secrets einrichten
- K8s Secret Manifest erstellen für: DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET, REGISTRY_PASSWORD
- Deployment-Manifests updaten: `envFrom: secretRef`

### 0.5 Redis absichern
- `requirepass` in `k8s/redis-deployment.yaml` setzen
- `protected-mode no` entfernen
- REDIS_URL mit Passwort updaten

**Dateien:**
- `backend/.env.template`
- `backend/medusa-config.ts`
- `deploy-to-k8s.ps1`
- `k8s/deployment.yaml`
- `k8s/redis-deployment.yaml`
- NEU: `k8s/secrets.yaml` (Template mit Platzhaltern, nicht die echten Werte!)

---

## Phase 1: Seed-Script — 3 Produkte mit Attributen
> Ersetzt die Demo T-Shirt-Daten komplett.

### 1.1 Seed-Script komplett neu schreiben
**Datei:** `backend/src/scripts/seed.ts`

**Infrastruktur-Setup (angepasst für deutschen Shop):**
- Store: nur EUR (kein USD)
- Region: "Deutschland", nur `["de"]`
- Tax: Deutschland, System-Provider
- Stock Location: "Lager Deutschland" (Berlin, DE)
- Shipping: "Standardversand" (€5,90, 5-7 Tage) + "Expressversand" (€14,90, 2-3 Tage)
- Payment: `pp_system_default` (Vorkasse/Rechnung)
- Publishable API Key: "Webshop"

**3 Produkt-Kategorien:** Fliegengitter, Plissee, Lichtschachtabdeckungen

**3 Produkte mit Metadata-basierter Konfigurator-Logik:**

Jedes Produkt bekommt 1 Variant (Standardkonfiguration, Mindestpreis) + strukturierte Metadata für Pricing und Optionen:

```typescript
metadata: {
  configurator_type: "fliegengitter",
  pricing: {
    base_price_per_sqm_cents: 4500,  // €45/m²
    min_price_cents: 8900,            // €89 Minimum
  },
  dimensions: { width_min: 100, width_max: 3000, height_min: 100, height_max: 3000 },
  options_config: {
    "Farbe": {
      "Weiß (RAL 9016)": { surcharge_cents: 0 },
      "Anthrazit (RAL 7016)": { surcharge_cents: 1500 },
      // ...
    },
    // Rahmentyp, Gittertyp etc.
  }
}
```

| Produkt | Basis/m² | Minimum | Optionen |
|---------|----------|---------|----------|
| Fliegengitter | €45 | €89 | Farbe (4), Rahmentyp (3), Gittertyp (3) |
| Plissee | €65 | €129 | Plissee-Typ (3) |
| Lichtschacht | €85 | €149 | Farbe (3) |

### 1.2 Seed ausführen & verifizieren
```bash
cd backend && npm run seed
```
Verifizierung: `GET http://localhost:9000/store/products` muss 3 Produkte mit Metadata zurückgeben.

---

## Phase 2: SDK-Setup & Preisberechnung (Server-seitig)
> Fundament für alle Frontend-Backend-Kommunikation.

### 2.1 Medusa JS SDK im Frontend installieren
```bash
npm install @medusajs/js-sdk
```

**Neue Dateien:**
- `lib/medusa.ts` — SDK Singleton-Client
- `lib/config.ts` — Env-Variablen (NEXT_PUBLIC_MEDUSA_BACKEND_URL, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
- `lib/types.ts` — Shared TypeScript Interfaces (ConfiguratorProduct, PriceCalculation, CartItemMetadata)
- `.env.local` — Lokale Env-Variablen (nicht in Git)

### 2.2 Server-seitige Preisberechnung (Custom API Route)
**Neue Dateien im Backend:**
- `backend/src/api/store/calculate-price/route.ts` — POST Endpoint
- `backend/src/api/store/calculate-price/validators.ts` — Zod Input-Validierung

**Logik:**
1. Request empfangen: `{ product_id, width, height, selections: { color, frameType, meshType } }`
2. Produkt + Metadata aus DB laden
3. Dimensionen validieren (min/max Bounds)
4. Selections gegen erlaubte Optionen validieren
5. Preis berechnen: `area × base_price + surcharges`, `max(total, min_price)`
6. Response: `{ price_cents, breakdown: { base, surcharges... } }`

**Zod-Validierung:** Dimensionen (int, min/max), gültige Option-Keys, product_id existiert.

### 2.3 next.config.ts erweitern
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` und `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` exposen

**Dateien:**
- `package.json` (Dependency hinzufügen)
- `next.config.ts`
- NEU: `lib/medusa.ts`, `lib/config.ts`, `lib/types.ts`, `.env.local`
- NEU: `backend/src/api/store/calculate-price/route.ts`
- NEU: `backend/src/api/store/calculate-price/validators.ts`

---

## Phase 3: Cart-Integration (Medusa Cart API)
> LocalStorage-Cart ersetzen durch Medusa Cart mit Server-State.

### 3.1 Cart Context Provider
**Neue Dateien:**
- `lib/context/cart-context.tsx` — React Context: `{ cart, addItem, updateItem, removeItem, cartCount, isLoading }`
- `lib/hooks/use-cart.ts` — `useCart()` Hook

**Verhalten:**
- Mount: `cart_id` aus Cookie lesen → Cart retrieven oder neuen erstellen
- `addItem`: Erst `/store/calculate-price` aufrufen → dann `sdk.store.cart.createLineItem()` mit `unit_price` Override + Konfigurations-Metadata
- Nach jeder Mutation: Cart neu laden für Sync
- Cart-ID in Cookie (nicht localStorage) für SSR-Kompatibilität

### 3.2 Layout anpassen
- `app/layout.tsx` — `<CartProvider>` um Children wrappen

### 3.3 Konfigurator-Pages umbauen
Jede Page wird aufgeteilt in:
- **Server Component** (page.tsx): Produkt von Medusa laden
- **Client Component** (configurator.tsx): Interaktive UI mit Props

**Dateien modifizieren:**
- `app/shop/fliegengitter/page.tsx` → Server Component Wrapper
- NEU: `app/shop/fliegengitter/configurator.tsx` → Client Component (bestehende Logik)
- `app/shop/plissee/page.tsx` → gleich
- NEU: `app/shop/plissee/configurator.tsx`
- `app/shop/lichtschacht/page.tsx` → gleich
- NEU: `app/shop/lichtschacht/configurator.tsx`

**addToCart Flow neu:**
1. User konfiguriert Produkt, klickt "In den Warenkorb"
2. → `POST /store/calculate-price` (Server-validierter Preis)
3. → `cart.addItem({ variant_id, quantity: 1, unit_price: serverPrice, metadata: { height, width, color, ... } })`
4. → Cart Context updatet → Header Badge re-rendert

### 3.4 Header Cart Badge umbauen
- `components/Header.tsx` — localStorage-Events entfernen, `useCart()` Hook verwenden, `cart.items.length` für Badge

### 3.5 Warenkorb-Page umbauen
- `app/shop/warenkorb/page.tsx` — localStorage durch `useCart()` ersetzen, Line Items von Medusa Cart rendern, Konfigurations-Details aus `item.metadata`

### 3.6 Shop Overview von Medusa laden
- `app/shop/page.tsx` — Server Component, Produkte via `sdk.store.product.list()` laden statt hardcoded Array

---

## Phase 4: User-Authentifizierung
> Kundenkonten mit Login, Registrierung, Bestellhistorie.

### 4.1 Auth Context
**Neue Dateien:**
- `lib/context/auth-context.tsx` — `{ customer, isAuthenticated, login, logout, register }`
- `lib/hooks/use-auth.ts`

### 4.2 Auth-Seiten
**Neue Dateien:**
- `app/konto/login/page.tsx` — Login via `sdk.auth.login("customer", "emailpass", { email, password })`
- `app/konto/registrieren/page.tsx` — Registrierung
- `app/konto/page.tsx` — Account Dashboard
- `app/konto/bestellungen/page.tsx` — Bestellhistorie via `sdk.store.order.list()`
- `app/konto/layout.tsx` — Protected Layout (Redirect wenn nicht eingeloggt)

### 4.3 Next.js Middleware
- NEU: `middleware.ts` — `/konto/*` Routen schützen (außer login/registrieren), JWT aus Cookie prüfen

### 4.4 Header anpassen
- `components/Header.tsx` — Account-Icon neben Cart, "Anmelden" / Kundenname anzeigen

**Layout:** `app/layout.tsx` — `<AuthProvider>` wrappen (innerhalb CartProvider)

---

## Phase 5: Checkout-Flow (Vorkasse/Rechnung)
> Mehrstufiger Checkout: Adresse → Versand → Zahlung → Bestätigung.

### 5.1 Checkout-Seiten
**Neue Dateien:**
- `app/shop/checkout/page.tsx` — Multi-Step Checkout
- `app/shop/checkout/layout.tsx` — Minimales Layout (Logo + Schritt-Anzeige)
- `app/shop/checkout/danke/page.tsx` — Bestellbestätigung

### 5.2 Checkout-Schritte
1. **Adresse**: Rechnungs- + Lieferadresse → `sdk.store.cart.update(cartId, { shipping_address, billing_address, email })`
2. **Versand**: Optionen laden via `sdk.store.fulfillment.listCartOptions()`, auswählen → `sdk.store.cart.addShippingMethod()`
3. **Zahlung**: `sdk.store.payment.initiatePaymentSession(cart, { provider_id: "pp_system_default" })` (Vorkasse)
4. **Übersicht & Bestellen**: Zusammenfassung, "Bestellung aufgeben" → `sdk.store.cart.complete(cartId)` → Redirect zu `/shop/checkout/danke`

### 5.3 Server-seitige Preis-Validierung vor Completion
**Neue Datei:** `backend/src/api/store/validate-cart/route.ts`
- Vor `cart.complete()`: Alle Line-Item-Preise aus Metadata neu berechnen
- Bei Abweichung: Error zurückgeben

### 5.4 Warenkorb "Zur Kasse" Button
- `app/shop/warenkorb/page.tsx` — "Zur Kasse" Button zu `/shop/checkout` verlinken (ersetzt "Demo-Version" Hinweis)

---

## Phase 6: Admin Dashboard Deployment
> Medusa Admin auf K8s deployen für Produktverwaltung.

### 6.1 Backend Dockerfile erstellen
- NEU: `backend/Dockerfile` — Multi-Stage Build für Medusa Backend
- Admin Dashboard auf separater Subdomain: `admin.diefliegengitterprofis.mobatix.de`

### 6.2 K8s Manifests für Backend
- NEU: `k8s/backend-deployment.yaml` — Medusa Backend Deployment + Service + Ingress
- Secrets-Referenz aus Phase 0.4
- Health Checks: `/health` Endpoint

### 6.3 Deploy-Script erweitern
- `deploy-to-k8s.ps1` — Backend-Build + Deploy hinzufügen

---

## Phase 7: Security Headers & Härtung
> Defense-in-depth für Production.

### 7.1 Next.js Security Middleware
- `middleware.ts` erweitern (aus Phase 4.3): Security Headers setzen
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
  - Strict-Transport-Security: max-age=31536000
  - Content-Security-Policy

### 7.2 Nginx Ingress Hardening
- `k8s/deployment.yaml` — Annotations für Rate-Limiting, Body-Size-Limit, TLS-Hardening

### 7.3 JSON.parse Safety
- Alle 5 Stellen mit `JSON.parse(localStorage.getItem('cart'))` in try/catch wrappen (wird in Phase 3 durch Cart Context obsolet, aber als Fallback)

### 7.4 Cookie Consent Banner
- NEU: `components/CookieConsent.tsx` — DSGVO-konforme Cookie-Einwilligung
- `app/layout.tsx` — CookieConsent einbinden

---

## Verifizierung & Testing

### Nach jeder Phase:
1. `cd backend && npm run dev` — Medusa Backend starten
2. `npm run dev` — Frontend starten
3. Manuelle Tests:
   - Phase 1: `curl http://localhost:9000/store/products` → 3 Produkte mit Metadata
   - Phase 2: `curl -X POST http://localhost:9000/store/calculate-price` → korrekter Preis
   - Phase 3: Konfigurator öffnen → Produkt konfigurieren → In den Warenkorb → Cart-Badge updatet → Warenkorb-Seite zeigt Items
   - Phase 4: Registrieren → Login → Konto-Seite erreichbar
   - Phase 5: Warenkorb → Zur Kasse → Adresse → Versand → Zahlung → Bestellung abschließen → Bestätigungsseite
4. `npm run build` — Frontend Build muss erfolgreich sein
5. `cd backend && npm run build` — Backend Build muss erfolgreich sein

### Security-Checks:
- Keine Passwörter in git-tracked Files: `git grep -i "password\|secret" -- ':!node_modules'`
- Security Headers in Response: `curl -I https://dev.diefliegengitterprofis.mobatix.de`
- Preis-Manipulation testen: Browser DevTools, unit_price manuell ändern → Server muss ablehnen

---

## Dateiübersicht (Neue / Modifizierte Dateien)

### Neue Dateien:
| Datei | Phase | Zweck |
|-------|-------|-------|
| `lib/medusa.ts` | 2 | Medusa SDK Client |
| `lib/config.ts` | 2 | Environment Config |
| `lib/types.ts` | 2 | Shared TypeScript Interfaces |
| `lib/context/cart-context.tsx` | 3 | Cart React Context |
| `lib/context/auth-context.tsx` | 4 | Auth React Context |
| `lib/hooks/use-cart.ts` | 3 | Cart Hook |
| `lib/hooks/use-auth.ts` | 4 | Auth Hook |
| `backend/src/api/store/calculate-price/route.ts` | 2 | Server-seitige Preisberechnung |
| `backend/src/api/store/calculate-price/validators.ts` | 2 | Zod Input-Validierung |
| `backend/src/api/store/validate-cart/route.ts` | 5 | Cart-Validierung vor Checkout |
| `app/shop/fliegengitter/configurator.tsx` | 3 | Client Component Konfigurator |
| `app/shop/plissee/configurator.tsx` | 3 | Client Component Konfigurator |
| `app/shop/lichtschacht/configurator.tsx` | 3 | Client Component Konfigurator |
| `app/konto/login/page.tsx` | 4 | Login-Seite |
| `app/konto/registrieren/page.tsx` | 4 | Registrierung |
| `app/konto/page.tsx` | 4 | Account Dashboard |
| `app/konto/bestellungen/page.tsx` | 4 | Bestellhistorie |
| `app/konto/layout.tsx` | 4 | Protected Layout |
| `app/shop/checkout/page.tsx` | 5 | Checkout Flow |
| `app/shop/checkout/layout.tsx` | 5 | Checkout Layout |
| `app/shop/checkout/danke/page.tsx` | 5 | Bestellbestätigung |
| `middleware.ts` | 4+7 | Auth-Schutz + Security Headers |
| `k8s/secrets.yaml` | 0 | K8s Secrets Template |
| `k8s/backend-deployment.yaml` | 6 | Medusa Backend K8s Manifest |
| `backend/Dockerfile` | 6 | Medusa Backend Docker Image |
| `components/CookieConsent.tsx` | 7 | DSGVO Cookie Banner |

### Modifizierte Dateien:
| Datei | Phase | Änderung |
|-------|-------|----------|
| `backend/.env.template` | 0 | Passwörter entfernen |
| `backend/medusa-config.ts` | 0 | Supersecret-Fallback entfernen |
| `deploy-to-k8s.ps1` | 0 | Registry-Passwort externalisieren |
| `k8s/deployment.yaml` | 0+7 | Secrets-Ref, Security Headers |
| `k8s/redis-deployment.yaml` | 0 | Auth aktivieren |
| `backend/src/scripts/seed.ts` | 1 | Komplett neu schreiben |
| `package.json` | 2 | @medusajs/js-sdk Dependency |
| `next.config.ts` | 2 | Env-Variablen |
| `app/layout.tsx` | 3+4 | CartProvider + AuthProvider wrappen |
| `app/shop/page.tsx` | 3 | Produkte von Medusa laden |
| `app/shop/fliegengitter/page.tsx` | 3 | Server Component Wrapper |
| `app/shop/plissee/page.tsx` | 3 | Server Component Wrapper |
| `app/shop/lichtschacht/page.tsx` | 3 | Server Component Wrapper |
| `components/Header.tsx` | 3+4 | useCart + useAuth Hooks |
| `app/shop/warenkorb/page.tsx` | 3+5 | Medusa Cart + "Zur Kasse" |
| `components/AddToCartModal.tsx` | 3 | Loading-State während Preisberechnung |
