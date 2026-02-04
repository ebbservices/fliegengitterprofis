# Projekt-Dokumentation - Die Fliegengitter Profis

Willkommen zur Dokumentation des E-Commerce-Shops für maßgefertigte Fliegengitter!

## 📚 Dokumentations-Übersicht

### Fachliche Dokumentation

**[MASTER-PLAN.md](./MASTER-PLAN.md)**
- Vollständiger Projekt-Plan
- Geschäftsziele & Anforderungen
- Produktkonfiguration & Preisberechnung
- Design-Spezifikationen
- Ursprünglich für nopCommerce geplant, jetzt Next.js + Medusa

**[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)**
- Schnellreferenz für Entwickler
- Produktkonfiguration im Überblick
- Preisberechnungs-Beispiele
- Wichtige Informationen auf einen Blick

### Technische Dokumentation

**[TECH-STACK.md](./TECH-STACK.md)**
- Architektur-Übersicht
- Tech Stack Details (Next.js + Medusa)
- Projekt-Struktur
- API-Integration
- Datenmodell
- Sicherheit & Performance
- Deployment-Strategie

## 🎯 Projekt-Ziele

### Hauptziele
- ✅ E-Commerce-Shop für maßgefertigte Fliegengitter
- ✅ Intelligenter Konfigurator mit Echtzeit-Preisberechnung
- ✅ Responsive Design (Mobile-First)
- ✅ Moderne Tech-Stack (Next.js + Medusa)
- ✅ Kubernetes Deployment

### Geschäftsziele
- Automatisierung der Angebotserstellung
- Reduzierung manueller Preiskalkulationen
- Verbesserung der Customer Experience
- Erhöhung der Conversion-Rate

## 🏗️ Architektur

```
Frontend (Next.js)
    ↓
Backend (Medusa)
    ↓
Database (PostgreSQL)
```

**Deployment:** Kubernetes auf Mobatix-Infrastruktur  
**URL:** https://dev.diefliegengitterprofis.mobatix.de

## 🎨 Design

**Farben:**
- Primary Orange: `#FF8C42`
- Primary Dark: `#2C2C2C`
- Primary Light: `#F5F5F5`
- Secondary Gray: `#6B6B6B`

**Referenz-Website:** https://www.diefliegengitterprofis.de/

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

## 🗂️ Produktkonfiguration

### Maße
- **Breite:** 100 - 3000 mm
- **Höhe:** 100 - 3000 mm

### Farben
- Weiß (RAL 9016) - 0.00 €
- Anthrazit (RAL 7016) - 15.00 €
- Braun (RAL 8014) - 15.00 €
- Silber - 10.00 €

### Gewebearten
- Standard-Polenfilter - 0.00 €
- Katzennetz - 15.00 €
- Pollenschutzgewebe - 20.00 €
- Edelstahlgewebe - 35.00 €

### Montage-Arten
- Schraubmontage - 0.00 €
- Klick-System - 10.00 €
- Einhängesystem - 15.00 €

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Medusa.js, Node.js
- **Database:** PostgreSQL
- **Deployment:** Kubernetes, Docker
- **Registry:** registry.mobatix.de

## 📊 Projekt-Status

| Komponente | Status |
|------------|--------|
| Next.js Setup | ✅ Abgeschlossen |
| Docker Config | ✅ Abgeschlossen |
| Kubernetes Config | ✅ Abgeschlossen |
| Deployment Script | ✅ Abgeschlossen |
| Medusa Backend | 📋 Geplant |
| Konfigurator | 📋 Geplant |
| Shop-Features | 📋 Geplant |

## 🚀 Quick Start

### Entwicklung
```bash
npm install
npm run dev
```

### Deployment
```powershell
.\deploy-to-k8s.ps1 -Tag v1.0.0
```

## 📞 Wichtige Links

- **Projekt:** `D:\Dev\Mobatix\die-fliegengitter-profis\`
- **Dokumentation:** `D:\Dev\Mobatix\die-fliegengitter-profis\plans\`
- **Referenz-Website:** https://www.diefliegengitterprofis.de/
- **Dev-URL:** https://dev.diefliegengitterprofis.mobatix.de

## 🤝 Team

**Entwickelt von:** Mobatix GmbH  
**Projekt-Start:** Februar 2026

---

**Hinweis:** Die ursprünglichen Pläne wurden für nopCommerce erstellt. Das Projekt wurde auf Next.js + Medusa migriert, um eine modernere und flexiblere Lösung zu bieten. Die fachlichen Anforderungen (Konfigurator, Preisberechnung, Produktkonfiguration) bleiben identisch.
