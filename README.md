# Die Fliegengitter Profis - E-Commerce Shop

**Maßgefertigte Insektenschutzgitter mit intelligentem Konfigurator**

## 🎯 Projekt-Übersicht

E-Commerce-Shop für maßgefertigte Fliegengitter mit:
- **Next.js 15** + TypeScript + Tailwind CSS (Frontend)
- **Medusa** E-Commerce Backend (geplant)
- **Kubernetes** Deployment
- **Intelligenter Konfigurator** mit Echtzeit-Preisberechnung

## 🚀 Quick Start

### Entwicklung lokal

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build erstellen
npm run build

# Production Server starten
npm start
```

## 🐳 Docker

```bash
# Image bauen
docker build -t fliegengitter-shop .

# Container starten
docker run -p 3000:3000 fliegengitter-shop
```

## ☸️ Kubernetes Deployment

```powershell
# Deploy zu dev.diefliegengitterprofis.mobatix.de
.\deploy-to-k8s.ps1 -Tag v1.0.0

# Oder latest
.\deploy-to-k8s.ps1
```

## 🎨 Design

**Farben:**
- Primary Orange: `#FF8C42`
- Primary Dark: `#2C2C2C`
- Primary Light: `#F5F5F5`
- Secondary Gray: `#6B6B6B`

**Typografie:**
- Font: Open Sans, Helvetica Neue, Arial
- Mobile-First Responsive Design

## 📁 Projekt-Struktur

```
die-fliegengitter-profis/
├── app/                    # Next.js App Router
├── components/             # React Komponenten
├── lib/                    # Utilities & Helpers
├── public/                 # Statische Assets
├── k8s/                    # Kubernetes Manifests
├── deploy-to-k8s.ps1      # Deployment Script
└── Dockerfile             # Docker Configuration
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Medusa (E-Commerce)
- **Deployment:** Kubernetes, Docker
- **Registry:** registry.mobatix.de

## 📊 Features (Geplant)

- ✅ Responsive Design
- ✅ TypeScript
- ✅ Tailwind CSS
- 📋 Produkt-Konfigurator
- 📋 Dynamische Preisberechnung
- 📋 Warenkorb & Checkout
- 📋 Medusa Backend Integration
- 📋 Payment Integration (Stripe, PayPal)
- 📋 Admin Dashboard

## 🔗 URLs

- **Development:** http://localhost:3000
- **Staging:** https://dev.diefliegengitterprofis.mobatix.de
- **Production:** TBD

## 📝 Dokumentation

Detaillierte Pläne und Spezifikationen: `\plans\`

## 🤝 Support

Entwickelt von **Mobatix GmbH**
