# Fliegengitter-Shop - Quick Reference Guide

**Projekt:** Die Fliegengitter Profis E-Commerce Shop  
**Basis:** Next.js 15 + Medusa.js + Kubernetes  
**Status:** � In Entwicklung  
**Erstellt:** 25. Januar 2026  
**Aktualisiert:** 4. Februar 2026 (Stack-Wechsel)

---

## 📋 Projekt-Übersicht

### Ziel
Entwicklung eines vollständigen E-Commerce-Shops für maßgefertigte Fliegengitter mit:
- Next.js Frontend (responsive, TypeScript, Tailwind CSS)
- Landing Page (conversion-optimiert)
- Konfigurator-Komponente (dynamische Preisberechnung)
- Medusa Backend (vollständige E-Commerce-API)
- Kubernetes Deployment (skalierbar)

### Referenz
**Bestehende Website:** https://www.diefliegengitterprofis.de/

---

## 🎯 Hauptkomponenten

### 1. Next.js Frontend
**Verzeichnis:** `/app/` (App Router)

**Features:**
- React Server Components + Client Components
- TypeScript für Type Safety
- Tailwind CSS (Orange #FF8C42, Anthrazit #2C2C2C)
- Komponenten: Header, Footer, Navigation, Produktkarten
- Pages: Homepage, Produktliste, Produktdetails, Checkout

### 2. Konfigurator-Komponente
**Verzeichnis:** `/components/konfigurator/`

**Features:**
- React Component mit State Management
- Maßeingabe (Breite × Höhe)
- Farb-Auswahl (RAL-Farben)
- Gewebeart-Auswahl (Standard, Katzennetz, Pollenschutz, Edelstahl)
- Montage-Auswahl (Klick-System, Schraubmontage, Einhängesystem)
- Live-Preisberechnung (TypeScript)
- Medusa Cart API Integration

### 3. Landing Page
**Features:**
- Hero-Section mit Hauptbild
- Produkt-Übersicht
- Leistungen-Section
- Trust-Elemente (Bewertungen)
- Call-to-Action Buttons

---

## 💰 Preisberechnung

### Formel
```
Grundpreis = (Breite × Höhe in m²) × Basis-Preis-pro-m²
+ Farb-Aufschlag
+ Gewebeart-Aufschlag
+ Montage-Aufschlag
= Endpreis (min. Mindestpreis)
```

### Beispiel
```
Maße: 1200mm × 1500mm = 1.8 m²
Grundpreis: 1.8 m² × 45 €/m² = 81.00 €
Farbe (Anthrazit): +15.00 €
Gewebeart (Standard): +0.00 €
Montage (Klick): +10.00 €
────────────────────────────────
Gesamt: 106.00 €
```

---

## 🗂️ Produktkonfiguration

### Maße
- **Breite:** 100 - 3000 mm
- **Höhe:** 100 - 3000 mm
- **Eingabe:** Numerisches Feld mit Validierung

### Farben
| Farbe | RAL | Aufschlag |
|-------|-----|-----------|
| Weiß | RAL 9016 | 0.00 € |
| Anthrazit | RAL 7016 | 15.00 € |
| Braun | RAL 8014 | 15.00 € |
| Silber | - | 10.00 € |

### Gewebearten
| Typ | Beschreibung | Aufschlag |
|-----|--------------|-----------|
| Standard-Polenfilter | 1.2×1.2mm Maschenweite | 0.00 € |
| Katzennetz | Verstärkt, kratzfest | 15.00 € |
| Pollenschutzgewebe | Feinmaschig, für Allergiker | 20.00 € |
| Edelstahlgewebe | Rostfrei, Premium | 35.00 € |

### Montage-Arten
| Typ | Beschreibung | Aufschlag |
|-----|--------------|-----------|
| Schraubmontage | Klassisch, sehr stabil | 0.00 € |
| Klick-System | Werkzeuglos, einfach | 10.00 € |
| Einhängesystem | Für Rollläden | 15.00 € |

---

## 🗄️ Datenbank-Schema

### Tabelle: FliegengitterConfiguration
```sql
Id, ProductId, Width, Height, ColorId, 
MeshTypeId, MountingTypeId, CalculatedPrice, CreatedOnUtc
```

### Tabelle: PriceRule
```sql
Id, Name, RuleType, Value, IsActive, Priority
```

### Tabelle: MaterialOption
```sql
Id, Name, Type, Surcharge, DisplayOrder, IsActive
```

---

## 🔌 API-Endpunkte

### Preisberechnung
```
GET /api/configurator/calculate-price
Parameters: width, height, colorId, meshTypeId, mountingTypeId
Response: { price, formattedPrice }
```

### Optionen abrufen
```
GET /api/configurator/options
Response: { colors[], meshTypes[], mountingTypes[] }
```

### In Warenkorb
```
POST /api/configurator/add-to-cart
Body: ConfigurationModel
Response: { success, cartItemId }
```

---

## 📁 Projektstruktur

```
die-fliegengitter-profis/
├── app/                       # Next.js App Router
│   ├── page.tsx              # Homepage
│   ├── konfigurator/         # Konfigurator-Seiten
│   ├── produkte/             # Produkt-Seiten
│   └── api/                  # API Routes
├── components/                # React Komponenten
│   ├── ui/                   # UI Components
│   ├── layout/               # Layout Components
│   └── konfigurator/         # Konfigurator Components
├── lib/                       # Utilities & Helpers
├── public/                    # Static Assets
├── k8s/                       # Kubernetes Manifests
├── plans/                     # Dokumentation
├── Dockerfile                 # Docker Config
└── deploy-to-k8s.ps1          # Deployment Script
```

---

## 🚀 Entwicklungs-Workflow

### 1. Entwicklung starten
```bash
# Dependencies installieren
npm install

# Development Server
npm run dev
```

### 2. Zugriff
- **Frontend:** http://localhost:3000
- **Medusa Admin:** http://localhost:9000/app (geplant)
- **Medusa API:** http://localhost:9000 (geplant)

### 3. Komponenten entwickeln
```bash
# React Components in components/
# Hot Reload automatisch
```

### 4. Deployment
```powershell
# Zu Kubernetes deployen
.\deploy-to-k8s.ps1 -Tag v1.0.0
```

---

## 📊 Projektphasen

| Phase | Status | Dauer |
|-------|--------|-------|
| 1. Analyse & Planung | ✅ Abgeschlossen | 1 Woche |
| 2. Entwicklungsumgebung | ✅ Abgeschlossen | - |
| 3. Frontend (Next.js) | 📋 Geplant | 2-3 Wochen |
| 4. Landing Page | 📋 Geplant | 1 Woche |
| 5. Konfigurator-Komponente | 📋 Geplant | 3-4 Wochen |
| 6. Medusa Backend Setup | 📋 Geplant | 1 Woche |
| 7. E-Commerce Integration | 📋 Geplant | 2 Wochen |
| 8. Testing & QA | 📋 Geplant | 1-2 Wochen |
| 9. Deployment | ✅ Vorbereitet | - |
| 10. Wartung | 📋 Geplant | Laufend |

**Gesamtdauer:** ca. 10-12 Wochen

---

## 🎨 Design-Richtlinien

### Farben
```css
--primary-orange: #FF8C42
--primary-dark: #2C2C2C
--primary-light: #F5F5F5
--secondary-gray: #6B6B6B
```

### Typografie
- **Font:** Open Sans, Helvetica Neue, Arial
- **H1:** 2.5rem, Bold
- **H2:** 2rem, Semi-Bold
- **Body:** 16px, Regular

### Breakpoints
- **Mobile:** < 576px
- **Tablet:** 576px - 991px
- **Desktop:** 992px - 1199px
- **Large:** ≥ 1200px

---

## 🧪 Testing-Checkliste

### Funktional
- [ ] Preisberechnung korrekt
- [ ] Alle Konfigurationsoptionen funktionieren
- [ ] Warenkorb-Integration
- [ ] Checkout-Prozess
- [ ] Zahlungsabwicklung

### UI/UX
- [ ] Responsive auf allen Geräten
- [ ] Browser-Kompatibilität
- [ ] Accessibility (WCAG)
- [ ] Performance (< 2s Ladezeit)

### Sicherheit
- [ ] HTTPS/SSL
- [ ] Input-Validierung
- [ ] CSRF-Protection
- [ ] XSS-Prevention

---

## 📞 Wichtige Links

- **Master Plan:** [`plans/MASTER-PLAN.md`](MASTER-PLAN.md)
- **Tech Stack:** [`plans/TECH-STACK.md`](TECH-STACK.md)
- **Next.js Docs:** https://nextjs.org/docs
- **Medusa Docs:** https://docs.medusajs.com/
- **Referenz-Website:** https://www.diefliegengitterprofis.de/
- **Dev-URL:** https://dev.diefliegengitterprofis.mobatix.de

---

## ❓ Offene Fragen

1. Welche Zahlungsanbieter sollen integriert werden?
2. Welche Versanddienstleister?
3. Wo soll der Shop gehostet werden?
4. Welche Domain wird verwendet?
5. E-Mail-Provider für Transaktions-E-Mails?
6. Analytics-Tool (Google Analytics, Matomo)?
7. Newsletter-Integration gewünscht?
8. ERP-System-Anbindung erforderlich?

---

## 🎯 Nächste Schritte

### Diese Woche
1. [ ] Theme-Grundstruktur aufsetzen
2. [ ] Plugin-Projekt erstellen
3. [ ] Datenbank-Migrations vorbereiten
4. [ ] Erste UI-Prototypen

### Nächste Woche
1. [ ] Landing Page implementieren
2. [ ] Basis-Konfigurator entwickeln
3. [ ] Preisberechnungs-Engine
4. [ ] Erste Tests

---

**Letzte Aktualisierung:** 4. Februar 2026  
**Version:** 2.0 (Next.js + Medusa)  
**Status:** � In Entwicklung
