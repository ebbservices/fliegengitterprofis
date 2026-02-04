# Medusa Backend Setup

## Übersicht

Dieses Verzeichnis enthält die Backend-Konfiguration für den Medusa.js E-Commerce Server.

## Infrastruktur

### PostgreSQL
- **Server:** 10.0.0.6
- **Port:** 5432
- **User:** medusa_user
- **Dev-DB:** diefliegengitterprofis_dev
- **Prod-DB:** diefliegengitterprofis_prod

### Redis
- **Service:** redis.default.svc.cluster.local
- **Port:** 6379
- **Dev-DB:** 0
- **Prod-DB:** 1

### Kubernetes Nodes
- k8s-node-1: 10.0.0.3
- k8s-node-2: 10.0.0.4
- k8s-node-3: 10.0.0.5

## Setup-Schritte

### 1. PostgreSQL Datenbanken einrichten

**Option A: Mit PowerShell-Script (empfohlen)**
```powershell
cd backend
.\setup-postgres.ps1
```

**Option B: Manuell mit psql**
```bash
psql -h 10.0.0.6 -U postgres -d postgres -f setup-postgres.sql
```

Das Script erstellt:
- User `medusa_user` mit Passwort (bitte ändern!)
- Datenbank `diefliegengitterprofis_dev`
- Datenbank `diefliegengitterprofis_prod`
- Alle notwendigen Berechtigungen

### 2. Redis in Kubernetes deployen

```bash
kubectl apply -f ../k8s/redis-deployment.yaml
```

Dies erstellt:
- PersistentVolumeClaim für Redis-Daten (5GB)
- ConfigMap mit Redis-Konfiguration
- Deployment mit 1 Replica
- Service für Cluster-internen Zugriff

**Redis-Verbindung prüfen:**
```bash
kubectl exec -it deployment/redis -- redis-cli ping
# Sollte "PONG" zurückgeben
```

### 3. Medusa Backend installieren (nächster Schritt)

```bash
# Im backend-Verzeichnis
npx create-medusa-app@latest
```

## Connection Strings

### Development
```
DATABASE_URL=postgresql://medusa_user:PASSWORD@10.0.0.6:5432/diefliegengitterprofis_dev
REDIS_URL=redis://redis.default.svc.cluster.local:6379/0
```

### Production
```
DATABASE_URL=postgresql://medusa_user:PASSWORD@10.0.0.6:5432/diefliegengitterprofis_prod
REDIS_URL=redis://redis.default.svc.cluster.local:6379/1
```

## Zugriff von lokal (über VPN)

### PostgreSQL
```bash
psql -h 10.0.0.6 -U medusa_user -d diefliegengitterprofis_dev
```

### Redis (über Port-Forward)
```bash
kubectl port-forward service/redis 6379:6379
redis-cli -h localhost -p 6379
```

## Sicherheit

⚠️ **WICHTIG:**
1. Ändere das Passwort für `medusa_user` in `setup-postgres.sql`
2. Verwende Umgebungsvariablen für Passwörter (niemals im Code!)
3. Für Produktion: Aktiviere SSL für PostgreSQL
4. Für Produktion: Aktiviere Redis-Authentifizierung

## Nächste Schritte

- [ ] PostgreSQL Setup ausführen
- [ ] Redis deployen
- [ ] Medusa Backend installieren
- [ ] Medusa mit DBs verbinden
- [ ] Admin-Panel konfigurieren
- [ ] Erste Produkte anlegen

## Troubleshooting

### PostgreSQL-Verbindung schlägt fehl
```bash
# Prüfe ob PostgreSQL erreichbar ist
telnet 10.0.0.6 5432

# Prüfe PostgreSQL-Logs
# (auf dem PostgreSQL-Server)
tail -f /var/log/postgresql/postgresql-*.log
```

### Redis-Verbindung schlägt fehl
```bash
# Prüfe Redis-Status
kubectl get pods -l app=redis
kubectl logs deployment/redis

# Prüfe Service
kubectl get svc redis
```

### Redis-Datenbanken testen
```bash
# Dev-DB (0)
kubectl exec -it deployment/redis -- redis-cli -n 0 SET test "dev"
kubectl exec -it deployment/redis -- redis-cli -n 0 GET test

# Prod-DB (1)
kubectl exec -it deployment/redis -- redis-cli -n 1 SET test "prod"
kubectl exec -it deployment/redis -- redis-cli -n 1 GET test
```
