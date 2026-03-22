# Deployment Guide - Die Fliegengitter Profis

## Deployment-Architektur

- **Helm Charts** steuern alle Kubernetes-Ressourcen
- **GitHub Actions** CI/CD: Push auf `dev` oder `main` triggert automatisches Build + Deploy
- **Namespace:** `diefliegengitterprofis` (Frontend + Backend), Redis shared im `default` Namespace
- **Registry:** registry.mobatix.de

## Umgebungen

| | Dev | Prod |
|---|---|---|
| **Branch** | `dev` | `main` |
| **Frontend** | https://dev.diefliegengitterprofis.mobatix.de | https://www.diefliegengitterprofis.de |
| **Admin** | https://admin.diefliegengitterprofis.mobatix.de/app | https://admin.diefliegengitterprofis.de/app |
| **Datenbank** | `dfp_dev` | `dfp_prod` |
| **Redis DB** | 0 | 1 |
| **Replicas Frontend** | 1 | 2 |

## Voraussetzungen

- kubectl konfiguriert mit Cluster-Zugriff
- Helm 3.x installiert
- Docker (nur fuer lokales Testen)
- Python 3.x + psycopg2-binary (fuer Setup-Script)

## Ersteinrichtung (einmalig)

### 1. Datenbank + Secrets einrichten

```bash
pip install psycopg2-binary

# Dev Environment
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <ROOT_PW> --env dev

# Prod Environment
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <ROOT_PW> --env prod
```

Das Script erstellt automatisch:
- K8s Namespace `diefliegengitterprofis`
- Registry Secret (kopiert aus default)
- PostgreSQL Datenbank + User mit generiertem Passwort
- K8s Secret `medusa-secrets-dev` / `medusa-secrets-prod` mit allen Credentials

### 2. RBAC fuer ARC Runner

```bash
kubectl apply -f k8s/arc/rbac.yaml
```

### 3. ARC Runner aktualisieren

```bash
helm upgrade arc-runner-set oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -n arc-runners -f k8s/arc/runner-values.yaml
```

### 4. Publishable Keys (nach erstem Seed)

Nach dem ersten erfolgreichen Deploy + Seed den Medusa Publishable Key extrahieren und als Secret speichern:

```bash
kubectl create secret generic medusa-publishable-key-dev \
  -n arc-runners \
  --from-literal=key="pk_xxxxx"

kubectl create secret generic medusa-publishable-key-prod \
  -n arc-runners \
  --from-literal=key="pk_xxxxx"
```

## CI/CD Workflow

Push auf `dev` oder `main` Branch triggert automatisch:

1. Version Tag berechnen (auto-increment)
2. Frontend Docker Image bauen (mit env-spezifischer Medusa URL)
3. Backend Docker Image bauen
4. Images in Registry pushen
5. `helm upgrade --install` ausfuehren
6. Alte Registry Tags aufraeumen (behaelt letzte 10)

## Helm Befehle

```bash
NS=diefliegengitterprofis

# Status pruefen
helm list -n $NS

# Dev manuell deployen
helm upgrade --install fliegengitter-dev ./helm/fliegengitter \
  -n $NS -f helm/fliegengitter/values-dev.yaml \
  --set frontend.image.tag=v2.3.0-dev \
  --set backend.image.tag=v2.3.0

# Prod manuell deployen
helm upgrade --install fliegengitter-prod ./helm/fliegengitter \
  -n $NS -f helm/fliegengitter/values-prod.yaml \
  --set frontend.image.tag=v2.3.0-prod \
  --set backend.image.tag=v2.3.0

# Release loeschen
helm uninstall fliegengitter-dev -n $NS
```

## Monitoring & Debugging

```bash
NS=diefliegengitterprofis

# Pods anzeigen
kubectl get pods -n $NS

# Logs
kubectl logs -l app=fliegengitter-shop-dev -n $NS -f
kubectl logs -l app=medusa-backend-dev -n $NS -f

# Pod beschreiben
kubectl describe pod <pod-name> -n $NS

# In Pod einsteigen
kubectl exec -it <pod-name> -n $NS -- sh
```

## Rollback

```bash
# Helm Rollback auf vorherige Revision
helm rollback fliegengitter-dev -n diefliegengitterprofis

# Spezifische Revision
helm history fliegengitter-dev -n diefliegengitterprofis
helm rollback fliegengitter-dev 3 -n diefliegengitterprofis
```

## From-Scratch Rebuild

Falls alles neu aufgesetzt werden muss:

```bash
# 1. Namespace loeschen (loescht alle Ressourcen)
kubectl delete namespace diefliegengitterprofis

# 2. DBs droppen (auf PostgreSQL Host)
psql -U postgres -c "DROP DATABASE dfp_dev;"
psql -U postgres -c "DROP DATABASE dfp_prod;"
psql -U postgres -c "DROP USER dfp_dev_user;"
psql -U postgres -c "DROP USER dfp_prod_user;"

# 3. Setup-Script ausfuehren
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <PW> --env dev
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <PW> --env prod

# 4. RBAC + ARC Runner
kubectl apply -f k8s/arc/rbac.yaml

# 5. Push auf dev/main Branch triggert Deployment
```

## Dateistruktur

```
helm/fliegengitter/          # Helm Chart
  Chart.yaml
  values.yaml                # Shared defaults
  values-dev.yaml            # Dev overrides
  values-prod.yaml           # Prod overrides
  templates/                 # K8s resource templates

scripts/
  setup-env.py               # Einmaliges DB + Secrets Setup

k8s/
  arc/rbac.yaml              # ARC Runner RBAC
  arc/runner-values.yaml     # ARC Runner Konfiguration
  redis-deployment.yaml      # Shared Redis (default Namespace)

.github/workflows/
  deploy.yaml                # CI/CD Pipeline
```
