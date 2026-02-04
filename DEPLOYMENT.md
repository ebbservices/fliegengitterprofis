# Deployment Guide - Die Fliegengitter Profis

## 🎯 Deployment-Übersicht

Der Shop wird auf Kubernetes deployed mit automatisiertem CI/CD-Workflow.

## 🔧 Voraussetzungen

- Docker Desktop installiert
- kubectl konfiguriert
- Zugriff auf registry.mobatix.de
- Kubernetes Cluster Zugriff

## 📦 Deployment-Prozess

### 1. Lokaler Build & Test

```bash
# Dependencies installieren
npm install

# Build testen
npm run build

# Lokal testen
npm start
```

### 2. Docker Image erstellen

```bash
# Image bauen
docker build --platform linux/amd64 -t registry.mobatix.de/fliegengitter-shop:v1.0.0 .

# Image testen
docker run -p 3000:3000 registry.mobatix.de/fliegengitter-shop:v1.0.0
```

### 3. Automatisches Deployment

```powershell
# Mit Version-Tag
.\deploy-to-k8s.ps1 -Tag v1.0.0

# Oder latest
.\deploy-to-k8s.ps1
```

Das Script führt automatisch aus:
1. ✅ Docker Image Build
2. ✅ Registry Login
3. ✅ Image Push
4. ✅ Kubernetes Deployment Update
5. ✅ Rollout Überwachung
6. ✅ Status-Check

## 🌐 Umgebungen

### Development
- **URL:** https://dev.diefliegengitterprofis.mobatix.de
- **Namespace:** default
- **Replicas:** 2
- **Resources:** 256Mi RAM, 250m CPU

### Staging (geplant)
- **URL:** https://staging.diefliegengitterprofis.mobatix.de
- **Namespace:** staging
- **Replicas:** 2

### Production (geplant)
- **URL:** https://www.diefliegengitterprofis.de
- **Namespace:** production
- **Replicas:** 3
- **Resources:** 512Mi RAM, 500m CPU

## 📊 Kubernetes Ressourcen

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fliegengitter-shop
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fliegengitter-shop
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: fliegengitter-shop
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000
```

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fliegengitter-shop-ingress
spec:
  rules:
  - host: dev.diefliegengitterprofis.mobatix.de
```

## 🔍 Monitoring & Debugging

### Logs anzeigen
```bash
# Alle Pods
kubectl logs -l app=fliegengitter-shop -f

# Spezifischer Pod
kubectl logs fliegengitter-shop-xxxxx-xxxxx -f
```

### Status prüfen
```bash
# Deployment Status
kubectl get deployment fliegengitter-shop

# Pods Status
kubectl get pods -l app=fliegengitter-shop

# Service Status
kubectl get svc fliegengitter-shop

# Ingress Status
kubectl get ingress fliegengitter-shop-ingress
```

### Pod beschreiben
```bash
kubectl describe pod fliegengitter-shop-xxxxx-xxxxx
```

### In Pod einsteigen
```bash
kubectl exec -it fliegengitter-shop-xxxxx-xxxxx -- sh
```

## 🔄 Rollback

### Zu vorheriger Version
```bash
kubectl rollout undo deployment/fliegengitter-shop
```

### Zu spezifischer Revision
```bash
# Revision-Historie anzeigen
kubectl rollout history deployment/fliegengitter-shop

# Zu Revision zurück
kubectl rollout undo deployment/fliegengitter-shop --to-revision=2
```

## 🚨 Troubleshooting

### Image Pull Fehler
```bash
# Registry Login prüfen
docker login registry.mobatix.de

# Image manuell pullen
docker pull registry.mobatix.de/fliegengitter-shop:latest
```

### Pod startet nicht
```bash
# Events prüfen
kubectl get events --sort-by='.lastTimestamp'

# Pod Logs
kubectl logs fliegengitter-shop-xxxxx-xxxxx

# Pod beschreiben
kubectl describe pod fliegengitter-shop-xxxxx-xxxxx
```

### Deployment hängt
```bash
# Rollout Status
kubectl rollout status deployment/fliegengitter-shop

# Deployment neu starten
kubectl rollout restart deployment/fliegengitter-shop
```

## 📈 Skalierung

### Manuelle Skalierung
```bash
# Auf 3 Replicas skalieren
kubectl scale deployment fliegengitter-shop --replicas=3
```

### Auto-Scaling (HPA)
```bash
# HPA erstellen
kubectl autoscale deployment fliegengitter-shop --cpu-percent=70 --min=2 --max=5
```

## 🔐 Secrets Management

### Secrets erstellen
```bash
# Generic Secret
kubectl create secret generic fliegengitter-secrets \
  --from-literal=database-url=postgresql://... \
  --from-literal=stripe-key=sk_...
```

### Secrets in Deployment verwenden
```yaml
env:
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: fliegengitter-secrets
      key: database-url
```

## 📝 Deployment Checklist

Vor jedem Deployment:

- [ ] Code getestet
- [ ] Build erfolgreich
- [ ] Docker Image funktioniert lokal
- [ ] Environment Variables konfiguriert
- [ ] Secrets erstellt (falls nötig)
- [ ] Backup erstellt (Production)
- [ ] Team informiert

Nach Deployment:

- [ ] Health Check erfolgreich
- [ ] Logs prüfen
- [ ] Funktionalität testen
- [ ] Performance prüfen
- [ ] Monitoring aktiv

## 🎯 Best Practices

1. **Versionierung:** Immer mit Version-Tags deployen
2. **Testing:** Erst auf dev, dann staging, dann production
3. **Monitoring:** Logs und Metriken überwachen
4. **Backups:** Vor Production-Deployments
5. **Rollback-Plan:** Immer bereit zum Rollback
6. **Documentation:** Änderungen dokumentieren

## 📞 Support

Bei Problemen:
- Logs prüfen
- Events prüfen
- Team kontaktieren
- Dokumentation konsultieren
