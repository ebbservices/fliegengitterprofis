# CI/CD Setup mit GitHub Actions + ARC

Dieses Projekt nutzt **Actions Runner Controller (ARC)** auf unserem Kubernetes-Cluster für automatische Builds und Deployments. Der Runner läuft direkt im Cluster — alle Secrets bleiben auf K8s, nichts wird bei GitHub gespeichert.

## Architektur

```
Push auf main → GitHub Webhook → ARC Controller (arc-system)
                                      ↓
                            Runner Pod (arc-runners)
                            ├── actions-runner (Build + Deploy)
                            └── docker:dind (Docker Daemon)
                                      ↓
                            docker build + push → registry.mobatix.de
                            kubectl set image → Deployment Update
```

## Voraussetzungen (bereits installiert)

- ARC Controller im `arc-system` Namespace
- GitHub App "Mobatix ARC Runner" (App ID: 3149259)
- K8s Secrets:
  - `github-app-secret` (arc-runners) — GitHub App Auth
  - `runner-registry-dockerconfig` (arc-runners) — Docker Push Auth
  - `registry-api-credentials` (arc-runners) — Registry API für Versioning/Cleanup
- RBAC: ServiceAccount `arc-runner-sa` mit Deploy-Rechten im `default` Namespace

## Versioning

- Format: `vMAJOR.MINOR.PATCH` (z.B. v2.2.3)
- Patch wird bei jedem Deploy automatisch +1 erhöht
- Patch max 50 → Minor +1, Patch reset (z.B. v2.2.50 → v2.3.0)
- Nur die neuesten 10 Tags werden in der Registry behalten

## Neues Projekt hinzufügen

### 1. Runner Scale Set für das Repo installieren

```bash
helm install arc-runner-PROJEKTNAME \
  --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml \
  --set githubConfigUrl="https://github.com/ebbservices/REPO-NAME"
```

> Die `runner-values.yaml` aus diesem Projekt kann wiederverwendet werden. Sie enthält die DinD-Sidecar-Config, Registry-Auth und RBAC-Referenzen.

### 2. GitHub App Zugriff sicherstellen

Die GitHub App "Mobatix ARC Runner" muss auf das neue Repo Zugriff haben:
- GitHub → Settings → Applications → Mobatix ARC Runner → Configure
- Entweder "All repositories" (bereits gesetzt) oder das Repo einzeln hinzufügen

### 3. Workflow-Datei ins neue Projekt kopieren

Kopiere `.github/workflows/deploy.yaml` in das neue Projekt und passe an:

```yaml
env:
  FRONTEND_IMAGE: registry.mobatix.de/NEUER-IMAGE-NAME
  BACKEND_IMAGE: registry.mobatix.de/NEUER-BACKEND-NAME  # falls vorhanden
  # Weitere projekt-spezifische Env-Vars anpassen
```

Passe die Build- und Deploy-Steps an die Projektstruktur an (Dockerfile-Pfade, Deployment-Namen, etc.).

### 4. RBAC erweitern (falls anderer Namespace)

Falls das neue Projekt in einem anderen K8s-Namespace deployed:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: arc-runner-deployer
  namespace: NEUER-NAMESPACE
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "patch", "update"]
  - apiGroups: [""]
    resources: ["services", "pods"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: arc-runner-deployer-binding
  namespace: NEUER-NAMESPACE
subjects:
  - kind: ServiceAccount
    name: arc-runner-sa
    namespace: arc-runners
roleRef:
  kind: Role
  name: arc-runner-deployer
  apiGroup: rbac.authorization.k8s.io
```

## Runner Scale Set entfernen

```bash
helm uninstall arc-runner-PROJEKTNAME --namespace arc-runners
```

## Troubleshooting

### Runner-Status prüfen

```bash
# ARC Controller
kubectl get pods -n arc-system

# Listener (wartet auf Jobs)
kubectl get pods -n arc-runners

# Runner Logs
kubectl logs -n arc-system -l app.kubernetes.io/name=gha-rs-controller --tail=50
```

### Runner registriert sich nicht

```bash
# Logs des Listeners prüfen
kubectl logs -n arc-system -l actions.github.com/scale-set-name=arc-runner-set --tail=50
```

Häufige Ursachen:
- GitHub App hat keinen Zugriff auf das Repo
- Private Key stimmt nicht mit der App ID überein
- `githubConfigUrl` zeigt auf falsches Repo

### Build schlägt fehl

```bash
# Aktive Runner-Pods anzeigen
kubectl get pods -n arc-runners

# Logs eines Runner-Pods
kubectl logs -n arc-runners POD-NAME -c runner
kubectl logs -n arc-runners POD-NAME -c dind
```

### Registry Garbage Collection

Nach dem Löschen alter Tags wird der Speicher erst nach einer GC freigegeben:

```bash
kubectl exec -n registry deploy/docker-registry -- \
  registry garbage-collect /etc/docker/registry/config.yml
```

## Dateien

| Datei | Zweck |
|-------|-------|
| `.github/workflows/deploy.yaml` | Build & Deploy Workflow |
| `k8s/arc/rbac.yaml` | ServiceAccount + RBAC für Runner |
| `k8s/arc/runner-values.yaml` | Helm Values (DinD, Auth, Scaling) |
| `readme-cicd.md` | Diese Dokumentation |
