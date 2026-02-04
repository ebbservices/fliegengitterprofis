# Technische Dokumentation - Die Fliegengitter Profis

**Projekt:** E-Commerce Shop für maßgefertigte Fliegengitter  
**Stack:** Next.js + Medusa + Kubernetes  
**Erstellt:** 4. Februar 2026

---

## 🏗️ Architektur-Übersicht

### System-Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  - React Components                                          │
│  - TypeScript                                                │
│  - Tailwind CSS                                              │
│  - Konfigurator UI                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ REST/GraphQL API
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Medusa)                            │
│  - E-Commerce Engine                                         │
│  - Produkt-Verwaltung                                        │
│  - Warenkorb & Checkout                                      │
│  - Preisberechnung                                           │
│  - Payment Integration                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                  Datenbank (PostgreSQL)                      │
│  - Produkte & Konfigurationen                                │
│  - Bestellungen                                              │
│  - Kunden                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Deployment-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
│                                                              │
│  ┌────────────────────┐      ┌────────────────────┐        │
│  │  Next.js Frontend  │      │  Medusa Backend    │        │
│  │  (2 Replicas)      │      │  (2 Replicas)      │        │
│  │  Port: 3000        │      │  Port: 9000        │        │
│  └────────────────────┘      └────────────────────┘        │
│           │                           │                      │
│           └───────────┬───────────────┘                      │
│                       ↓                                      │
│              ┌─────────────────┐                            │
│              │  Ingress (Nginx)│                            │
│              │  + Let's Encrypt│                            │
│              └─────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                       │
                       ↓
        dev.diefliegengitterprofis.mobatix.de
```

---

## 🛠️ Tech Stack Details

### Frontend

**Framework:** Next.js 15
- App Router (React Server Components)
- TypeScript für Type Safety
- React 19 mit Compiler
- Standalone Output für Docker

**Styling:** Tailwind CSS
- Utility-First CSS
- Responsive Design (Mobile-First)
- Custom Theme (Orange/Anthrazit)
- JIT Compiler

**State Management:**
- React Context für globalen State
- Server Components wo möglich
- Client Components nur bei Bedarf

**Formulare & Validierung:**
- React Hook Form (geplant)
- Zod für Schema-Validierung (geplant)

### Backend

**E-Commerce:** Medusa.js
- Node.js basiert
- PostgreSQL Datenbank
- REST & GraphQL APIs
- Plugin-System
- Admin Dashboard

**Features:**
- Produkt-Katalog
- Warenkorb-Management
- Checkout-Flow
- Payment Integration
- Bestellverwaltung
- Kunden-Accounts

### Datenbank

**PostgreSQL 15+**
- Relational Database
- ACID-Compliance
- JSON Support für flexible Daten
- Full-Text Search

### Deployment

**Container:** Docker
- Multi-Stage Builds
- Alpine Linux (klein & sicher)
- Non-Root User
- Optimierte Layer

**Orchestrierung:** Kubernetes
- Deployment mit 2+ Replicas
- Service Discovery
- Load Balancing
- Auto-Scaling (HPA)
- Rolling Updates
- Health Checks

**Ingress:** Nginx Ingress Controller
- SSL/TLS Termination
- Let's Encrypt Integration
- Rate Limiting
- CORS Handling

**Registry:** registry.mobatix.de
- Private Docker Registry
- Image Versioning
- Automated Builds

---

## 📁 Projekt-Struktur

```
die-fliegengitter-profis/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root Layout
│   ├── page.tsx                 # Homepage
│   ├── konfigurator/            # Konfigurator-Seiten
│   ├── produkte/                # Produkt-Seiten
│   ├── warenkorb/               # Warenkorb
│   ├── checkout/                # Checkout-Flow
│   └── api/                     # API Routes
│       └── medusa/              # Medusa Proxy
│
├── components/                   # React Komponenten
│   ├── ui/                      # UI Komponenten (Buttons, Cards, etc.)
│   ├── layout/                  # Layout Komponenten (Header, Footer)
│   ├── konfigurator/            # Konfigurator Komponenten
│   └── produkte/                # Produkt Komponenten
│
├── lib/                         # Utilities & Helpers
│   ├── medusa/                  # Medusa Client
│   ├── utils/                   # Helper Functions
│   └── hooks/                   # Custom React Hooks
│
├── public/                      # Statische Assets
│   ├── images/                  # Bilder
│   ├── icons/                   # Icons
│   └── fonts/                   # Custom Fonts
│
├── k8s/                         # Kubernetes Manifests
│   ├── deployment.yaml          # Deployment Config
│   ├── service.yaml             # Service Config (in deployment.yaml)
│   └── ingress.yaml             # Ingress Config (in deployment.yaml)
│
├── medusa-backend/              # Medusa Backend (separates Repo geplant)
│   ├── src/
│   ├── medusa-config.js
│   └── package.json
│
├── plans/                       # Dokumentation
│   ├── MASTER-PLAN.md          # Fachlicher Master-Plan
│   ├── QUICK-REFERENCE.md      # Quick Reference
│   └── TECH-STACK.md           # Diese Datei
│
├── Dockerfile                   # Docker Build Config
├── .dockerignore               # Docker Ignore
├── deploy-to-k8s.ps1           # Deployment Script
├── next.config.ts              # Next.js Config
├── tailwind.config.ts          # Tailwind Config
├── tsconfig.json               # TypeScript Config
└── package.json                # Dependencies
```

---

## 🔌 API-Integration

### Medusa API Endpunkte

**Produkte:**
```typescript
GET  /store/products              // Alle Produkte
GET  /store/products/:id          // Einzelnes Produkt
POST /store/products/search       // Produkt-Suche
```

**Warenkorb:**
```typescript
POST   /store/carts               // Warenkorb erstellen
GET    /store/carts/:id           // Warenkorb abrufen
POST   /store/carts/:id/line-items // Item hinzufügen
DELETE /store/carts/:id/line-items/:item_id // Item entfernen
```

**Checkout:**
```typescript
POST /store/carts/:id/payment-sessions  // Payment initiieren
POST /store/carts/:id/complete           // Bestellung abschließen
```

### Custom API Routes (Next.js)

**Konfigurator:**
```typescript
POST /api/konfigurator/calculate-price
// Body: { width, height, color, meshType, mountingType }
// Response: { price, breakdown }

POST /api/konfigurator/validate
// Body: ConfigurationModel
// Response: { valid, errors }
```

---

## 💾 Datenmodell

### Produkt-Konfiguration

```typescript
interface FliegengitterConfiguration {
  id: string;
  productId: string;
  width: number;          // in mm
  height: number;         // in mm
  colorId: string;        // RAL-Farbe
  meshTypeId: string;     // Gewebeart
  mountingTypeId: string; // Montage-Art
  calculatedPrice: number;
  createdAt: Date;
}
```

### Preisregel

```typescript
interface PriceRule {
  id: string;
  name: string;
  ruleType: 'basePricePerSqm' | 'colorSurcharge' | 'meshSurcharge' | 'mountingSurcharge';
  value: number;
  isActive: boolean;
  priority: number;
}
```

### Material-Option

```typescript
interface MaterialOption {
  id: string;
  name: string;
  type: 'color' | 'meshType' | 'mountingType';
  surcharge: number;
  displayOrder: number;
  isActive: boolean;
  metadata?: {
    ralCode?: string;
    description?: string;
  };
}
```

---

## 🎨 Design System

### Farben (Tailwind Config)

```typescript
colors: {
  primary: {
    orange: '#FF8C42',
    dark: '#2C2C2C',
    light: '#F5F5F5',
  },
  secondary: {
    gray: '#6B6B6B',
    lightGray: '#E0E0E0',
  },
  accent: {
    green: '#4CAF50',
    red: '#F44336',
  }
}
```

### Komponenten-Bibliothek

**Geplante UI-Komponenten:**
- Button (Primary, Secondary, Outline)
- Card (Product, Info, Feature)
- Input (Text, Number, Select)
- Modal/Dialog
- Toast Notifications
- Loading Spinner
- Progress Bar
- Breadcrumbs
- Tabs
- Accordion

---

## 🔐 Sicherheit

### Frontend
- XSS Prevention (React escaping)
- CSRF Protection (Next.js built-in)
- Input Validation (Zod schemas)
- Secure Headers (next.config.ts)

### Backend (Medusa)
- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- SQL Injection Prevention (ORM)

### Deployment
- HTTPS/TLS (Let's Encrypt)
- Network Policies (Kubernetes)
- Secret Management (Kubernetes Secrets)
- Non-Root Containers
- Security Scanning (geplant)

---

## 📊 Performance-Optimierung

### Frontend
- Server Components (wo möglich)
- Image Optimization (next/image)
- Code Splitting (automatisch)
- Lazy Loading
- WebP Images
- Font Optimization

### Backend
- Database Indexing
- Query Optimization
- Caching (Redis geplant)
- Connection Pooling

### Deployment
- CDN für Static Assets (geplant)
- Gzip/Brotli Compression
- HTTP/2
- Resource Limits (Kubernetes)

---

## 🧪 Testing-Strategie

### Unit Tests
- React Components (Jest + React Testing Library)
- Utility Functions
- Preisberechnungs-Logik

### Integration Tests
- API Routes
- Medusa Integration
- Checkout-Flow

### E2E Tests
- Playwright (geplant)
- Kompletter Bestellprozess
- Konfigurator-Workflow

---

## 🚀 CI/CD Pipeline (Geplant)

```
Git Push → Build → Test → Docker Build → Push → Deploy → Verify
```

1. **Code Push** (Git)
2. **Build** (npm run build)
3. **Tests** (npm test)
4. **Docker Build** (multi-stage)
5. **Push to Registry** (registry.mobatix.de)
6. **Deploy to K8s** (kubectl apply)
7. **Health Check** (readiness probe)
8. **Rollout Verification**

---

## 📈 Monitoring & Logging (Geplant)

### Metriken
- Request Rate
- Response Time
- Error Rate
- Resource Usage (CPU, Memory)

### Logging
- Application Logs (stdout)
- Access Logs (Nginx)
- Error Tracking (Sentry geplant)

### Alerting
- Uptime Monitoring
- Error Rate Alerts
- Resource Alerts

---

## 🔄 Entwicklungs-Workflow

### Lokale Entwicklung

```bash
# Frontend starten
npm run dev

# Medusa Backend starten (separates Terminal)
cd medusa-backend
npm run dev

# PostgreSQL (Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

### Feature-Entwicklung

1. Branch erstellen (`feature/konfigurator`)
2. Lokal entwickeln & testen
3. Commit & Push
4. Pull Request erstellen
5. Review & Merge
6. Automatisches Deployment (geplant)

---

## 📝 Nächste Schritte

### Phase 1: Basis-Setup ✅
- [x] Next.js Projekt erstellen
- [x] Docker-Konfiguration
- [x] Kubernetes-Setup
- [x] Deployment-Script

### Phase 2: Medusa Integration 📋
- [ ] Medusa Backend aufsetzen
- [ ] PostgreSQL Datenbank
- [ ] Medusa Client im Frontend
- [ ] API-Integration testen

### Phase 3: Konfigurator 📋
- [ ] UI-Komponenten
- [ ] Preisberechnungs-Logik
- [ ] Validierung
- [ ] Warenkorb-Integration

### Phase 4: Shop-Features 📋
- [ ] Produktkatalog
- [ ] Checkout-Flow
- [ ] Payment Integration
- [ ] E-Mail-Benachrichtigungen

---

**Letzte Aktualisierung:** 4. Februar 2026  
**Version:** 1.0  
**Status:** 🟢 In Entwicklung
