# Quick Start Guide - Medusa Backend Setup

**Für morgen vorbereitet** ✅

## Heute erledigt

- [x] PostgreSQL Setup-Scripte erstellt
- [x] Redis Kubernetes Deployment vorbereitet
- [x] Dokumentation erstellt
- [x] Environment-Template erstellt

## Morgen: Schritt-für-Schritt

### 1️⃣ PostgreSQL Datenbanken erstellen (5 Min)

```powershell
# Im Projekt-Root
cd backend
.\setup-postgres.ps1
```

**Was passiert:**
- Erstellt User `medusa_user`
- Erstellt DB `diefliegengitterprofis_dev`
- Erstellt DB `diefliegengitterprofis_prod`
- Setzt alle Berechtigungen

**Wichtig:** Notiere das Passwort für `medusa_user`!

### 2️⃣ Redis in Kubernetes deployen (2 Min)

```bash
# Redis deployen
kubectl apply -f k8s/redis-deployment.yaml

# Status prüfen
kubectl get pods -l app=redis
kubectl get svc redis

# Verbindung testen
kubectl exec -it deployment/redis -- redis-cli ping
# Sollte "PONG" ausgeben
```

### 3️⃣ Medusa Backend installieren (10 Min)

```bash
# Im backend-Verzeichnis
cd backend

# Medusa installieren
npx create-medusa-app@latest

# Oder manuell:
npm init -y
npm install @medusajs/medusa
npm install @medusajs/medusa-cli -g
medusa new . --skip-db
```

### 4️⃣ Medusa konfigurieren (5 Min)

**Datei erstellen:** `backend/.env`

```env
# Von env.template kopieren und anpassen
DATABASE_URL=postgresql://medusa_user:DEIN_PASSWORD@10.0.0.6:5432/diefliegengitterprofis_dev
REDIS_URL=redis://redis.default.svc.cluster.local:6379/0
JWT_SECRET=dein-super-geheimer-jwt-token
COOKIE_SECRET=dein-super-geheimer-cookie-token
NODE_ENV=development
PORT=9000
```

**Secrets generieren:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Cookie Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5️⃣ Datenbank migrieren (2 Min)

```bash
cd backend
npx medusa migrations run
```

### 6️⃣ Admin-User erstellen (1 Min)

```bash
npx medusa user -e admin@diefliegengitterprofis.de -p supersecret123
```

### 7️⃣ Medusa starten (1 Min)

```bash
# Backend starten
npm run start

# In separatem Terminal: Admin-Panel starten
npm run dev:admin
```

**URLs:**
- Backend: http://localhost:9000
- Admin: http://localhost:7001

## Verbindung von lokal testen

### PostgreSQL
```bash
psql -h 10.0.0.6 -U medusa_user -d diefliegengitterprofis_dev
```

### Redis (über Port-Forward)
```bash
# Terminal 1: Port-Forward
kubectl port-forward service/redis 6379:6379

# Terminal 2: Redis-CLI
redis-cli -h localhost -p 6379
```

## Troubleshooting

### PostgreSQL-Verbindung schlägt fehl
```bash
# Prüfe Erreichbarkeit
telnet 10.0.0.6 5432

# Prüfe User und DB
psql -h 10.0.0.6 -U postgres -c "\du"
psql -h 10.0.0.6 -U postgres -c "\l"
```

### Redis nicht erreichbar
```bash
# Prüfe Pod-Status
kubectl get pods -l app=redis
kubectl logs deployment/redis

# Prüfe Service
kubectl describe svc redis
```

### Medusa startet nicht
```bash
# Prüfe Logs
npm run start -- --verbose

# Prüfe DB-Verbindung
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'postgresql://medusa_user:PASSWORD@10.0.0.6:5432/diefliegengitterprofis_dev' }); pool.query('SELECT NOW()', (err, res) => { console.log(err ? err : res.rows); pool.end(); });"
```

## Nächste Schritte nach Setup

1. **Produktkategorien anlegen**
   - Fliegengitter
   - Plissee
   - Lichtschachtabdeckungen

2. **Produkte mit Varianten erstellen**
   - Höhe/Breite als Custom Options
   - Farben als Varianten
   - Rahmentypen als Varianten

3. **Preislogik implementieren**
   - Flächenbasierte Berechnung
   - Aufpreise für Optionen

4. **Frontend mit Medusa verbinden**
   - Medusa Client installieren
   - API-Calls implementieren
   - Warenkorb synchronisieren

## Hilfreiche Befehle

```bash
# Medusa Status
npx medusa --version

# Neue Migration erstellen
npx medusa migrations create AddCustomFields

# Seed-Daten laden
npx medusa seed -f ./data/seed.json

# Admin-User auflisten
npx medusa user -l

# Cache leeren
redis-cli -h localhost -p 6379 FLUSHDB
```

## Dokumentation

- **Medusa Docs:** https://docs.medusajs.com
- **API Reference:** https://docs.medusajs.com/api/store
- **Admin API:** https://docs.medusajs.com/api/admin
- **Backend README:** `backend/README.md`

## Zeitplan für morgen

- **09:00-09:15** - PostgreSQL & Redis Setup (15 Min)
- **09:15-09:30** - Medusa Installation (15 Min)
- **09:30-09:45** - Konfiguration & Migration (15 Min)
- **09:45-10:00** - Admin-User & Test (15 Min)
- **10:00-11:00** - Produktkategorien anlegen (60 Min)
- **11:00-12:00** - Erste Produkte erstellen (60 Min)

**Geschätzte Gesamtzeit:** ~3 Stunden bis zum funktionierenden Backend

---

**Status:** Alles vorbereitet für morgen! 🚀
