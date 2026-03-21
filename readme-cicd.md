# CI/CD Setup mit GitHub Actions + ARC

Automatische Builds und Deployments via **Actions Runner Controller (ARC)** auf unserem Kubernetes-Cluster. Der Runner läuft direkt im Cluster — alle Secrets bleiben auf K8s, nichts wird bei GitHub gespeichert.

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
                                      ↓
                            Runner Pod wird automatisch abgebaut (0 im Idle)
```

## Was auf dem Cluster läuft

| Namespace | Komponente | Zweck |
|-----------|-----------|-------|
| `arc-system` | `arc-gha-rs-controller` | ARC Controller (Helm Chart) |
| `arc-system` | `arc-runner-set-*-listener` | Listener (wartet auf GitHub Webhook Events) |
| `arc-runners` | Runner Pods (ephemeral) | Werden bei Push erstellt, nach Job zerstört |
| `arc-runners` | PVC `dind-cache` (20Gi, Longhorn) | Docker Layer Cache zwischen Builds |

## K8s Secrets (arc-runners Namespace)

| Secret | Typ | Inhalt |
|--------|-----|--------|
| `github-app-secret` | Opaque | `github_app_id`, `github_app_installation_id`, `github_app_private_key` |
| `registry-api-credentials` | Opaque | `username`, `password` (Klartext für Registry API Calls) |
| `runner-registry-dockerconfig` | dockerconfigjson | Docker Auth für `docker login` (wird aktuell nicht gemountet, Login per Workflow-Step) |

## GitHub App

- **Name:** Mobatix ARC Runner
- **App ID:** 3149259
- **Installation ID:** 117991920
- **Permissions:** Repository Actions (Read), Administration (Read+Write), Metadata (Read)
- **Installiert auf:** ebbservices (All repositories)
- **Private Key:** Als K8s Secret `github-app-secret` gespeichert
- **Einstellung:** `ebbservices` ist ein persönlicher Account, kein Org → ARC Runner Scale Sets müssen pro Repository konfiguriert werden (nicht account-weit)

## Versioning

- Format: `vMAJOR.MINOR.PATCH` (z.B. v2.2.5)
- Patch wird bei jedem Deploy automatisch +1 erhöht
- Patch max 50 → Minor +1, Patch reset (z.B. v2.2.50 → v2.3.0)
- Letzter Tag wird aus der Registry API gelesen
- Nur die neuesten 10 Tags pro Image werden behalten, ältere werden gelöscht

## Dateien in diesem Projekt

| Datei | Zweck |
|-------|-------|
| `.github/workflows/deploy.yaml` | Build & Deploy Workflow |
| `k8s/arc/rbac.yaml` | ServiceAccount, Role, RoleBinding für Runner |
| `k8s/arc/runner-values.yaml` | Helm Values (DinD, Secrets, Scaling, PVC Cache) |

---

# Neues Projekt aufsetzen (Schritt für Schritt)

## Voraussetzung

ARC Controller muss bereits im Cluster laufen (einmalig installiert):
```bash
helm install arc --namespace arc-system \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
```

## Schritt 1: Runner Scale Set für das Repo installieren

Die `runner-values.yaml` aus diesem Projekt als Basis nehmen und `githubConfigUrl` überschreiben:

```bash
helm install arc-runner-PROJEKTNAME \
  --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml \
  --set githubConfigUrl="https://github.com/ebbservices/REPO-NAME"
```

Die bestehenden Secrets (`github-app-secret`, `registry-api-credentials`) und der PVC (`dind-cache`) werden automatisch mitgenutzt.

## Schritt 2: GitHub App Zugriff prüfen

Die App "Mobatix ARC Runner" ist auf "All repositories" installiert — neue Repos haben automatisch Zugriff. Falls nicht:
- GitHub → Settings → Applications → Mobatix ARC Runner → Configure
- Repo hinzufügen

## Schritt 3: RBAC erweitern (falls anderer Namespace)

Falls das neue Projekt in einem anderen K8s-Namespace als `default` deployed, muss eine zusätzliche Role + RoleBinding erstellt werden:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: arc-runner-deployer
  namespace: NEUER-NAMESPACE
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "create", "patch", "update"]
  - apiGroups: [""]
    resources: ["services", "pods", "persistentvolumeclaims"]
    verbs: ["get", "list", "create", "patch", "update"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses"]
    verbs: ["get", "list", "create", "patch", "update"]
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

## Schritt 4: Workflow-Datei ins neue Projekt kopieren

`.github/workflows/deploy.yaml` kopieren und anpassen:

```yaml
env:
  FRONTEND_IMAGE: registry.mobatix.de/NEUER-IMAGE-NAME
  BACKEND_IMAGE: registry.mobatix.de/NEUER-BACKEND-NAME   # oder entfernen wenn kein Backend
  K8S_NAMESPACE: default                                    # oder anderer Namespace
```

Anpassen:
- Build-Steps (Dockerfile-Pfade, Build Args)
- Deploy-Steps (Deployment-Namen, Container-Namen für `kubectl set image`)
- Version-Tag Fallback im "Calculate next version tag" Step

## Schritt 5: Initiales Deployment

Das **erste Deployment** muss manuell gemacht werden (Secrets, Services, Ingress, PVC):
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/secrets.yaml
```

Danach übernimmt die CI/CD Pipeline das Image-Update per `kubectl set image`.

---

# Bekannte Fallstricke und Lösungen

Dokumentation der Probleme die beim initialen Setup aufgetreten sind, damit sie beim nächsten Projekt nicht wiederholt werden.

## 1. Persönlicher Account vs. Organisation

**Problem:** `githubConfigUrl` auf `https://github.com/ebbservices` gesetzt → ARC versucht `/orgs/ebbservices/actions/runners/registration-token` → 404

**Ursache:** `ebbservices` ist ein persönlicher Account. ARC unterstützt account-weite Runner nur für Organisationen.

**Lösung:** `githubConfigUrl` muss auf ein spezifisches Repository zeigen:
```yaml
githubConfigUrl: "https://github.com/ebbservices/REPO-NAME"
```

## 2. Docker Login: read-only file system

**Problem:** Registry-Auth als Volume Mount auf `/home/runner/.docker` → `mkdir /home/runner/.docker/buildx: read-only file system`

**Ursache:** K8s Secrets werden als read-only gemountet. Docker BuildKit versucht in `.docker/buildx` zu schreiben.

**Lösung:** Kein Volume Mount für Docker Auth. Stattdessen `docker login` als Workflow-Step:
```yaml
- name: Docker login
  run: echo "${REGISTRY_PASSWORD}" | docker login registry.mobatix.de -u admin --password-stdin
```

Das `REGISTRY_PASSWORD` kommt als Env-Var aus dem K8s Secret `registry-api-credentials` (konfiguriert in runner-values.yaml).

## 3. kubectl nicht verfügbar im Runner

**Problem:** `kubectl: command not found`

**Ursache:** Das Standard ARC Runner-Image (`ghcr.io/actions/actions-runner`) enthält kein kubectl.

**Lösung:** kubectl als Workflow-Step installieren. Wichtig: Nicht nach `/usr/local/bin` (Permission denied), sondern ins aktuelle Verzeichnis + `GITHUB_PATH`:
```yaml
- name: Install kubectl
  run: |
    curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    echo "${PWD}" >> $GITHUB_PATH
    ./kubectl version --client
```

## 4. kubectl apply vs. kubectl set image

**Problem:** `kubectl apply -f k8s/deployment.yaml` schlägt fehl mit `Forbidden` oder Ingress `configuration-snippet` Restriction.

**Ursache:**
- Runner-Pod läuft in `arc-runners` Namespace, kubectl default ist daher `arc-runners` statt `default`
- `kubectl apply` versucht auch Ingress/Service zu aktualisieren, was zusätzliche RBAC-Rechte und Ingress-Kompatibilität braucht

**Lösung:** `kubectl set image` verwenden — ändert nur den Image-Tag, berührt keine andere Konfiguration:
```yaml
kubectl set image deployment/DEPLOYMENT-NAME \
  CONTAINER-NAME=REGISTRY/IMAGE:TAG -n NAMESPACE
```

Manifest-Änderungen (Replicas, Env-Vars, Ingress etc.) weiterhin manuell deployen.

## 5. .dockerignore: Backend im Frontend-Build

**Problem:** `Type error: Cannot find module '@medusajs/framework/utils'` beim Frontend-Build

**Ursache:** `backend/` Ordner war im Docker Build-Context. TypeScript (`**/*.ts` in tsconfig) erfasst auch `backend/medusa-config.ts`.

**Lösung:**
- `backend` in `.dockerignore` hinzufügen
- `backend` in `tsconfig.json` excludieren:
```json
"exclude": ["node_modules", "backend"]
```

## 6. Medusa Build braucht Dummy-Env-Vars

**Problem:** `TypeError: Cannot read properties of null (reading 'admin')` beim `npm run build` im Dockerfile

**Ursache:** `medusa-config.ts` wirft Errors wenn `JWT_SECRET`, `COOKIE_SECRET` etc. nicht gesetzt sind. Beim Docker Build gibt es keine Env-Vars.

**Lösung:** Dummy-Werte im Builder-Stage setzen (werden nicht ins Production-Image übernommen):
```dockerfile
ENV DATABASE_URL=postgres://localhost/fake \
    STORE_CORS=http://localhost \
    ADMIN_CORS=http://localhost \
    AUTH_CORS=http://localhost \
    JWT_SECRET=build-placeholder \
    COOKIE_SECRET=build-placeholder
RUN npm run build
```

## 7. Medusa braucht volle node_modules (kein --omit=dev)

**Problem:** `Cannot find module '/app/medusa-config'` beim Start des Backend-Containers

**Ursache:** `npm ci --omit=dev` entfernt TypeScript und andere devDependencies. Aber Medusa lädt `medusa-config.ts` zur **Laufzeit** und braucht TypeScript dafür.

**Lösung:** Volle `node_modules` vom Builder-Stage kopieren, nicht `npm ci --omit=dev` im Runner:
```dockerfile
COPY --from=builder /app/node_modules ./node_modules
```

## 8. Registry Secret mit Sonderzeichen (!)

**Problem:** `docker login` bekommt 401 Unauthorized

**Ursache:** Bash escaped `!` in Passwörtern trotz Single Quotes. `kubectl create secret --from-literal` gibt dann `MobatixRegistry2026\!` statt `MobatixRegistry2026!`.

**Lösung:** Secret als YAML mit base64-encodiertem Wert erstellen:
```bash
# Base64 korrekt erzeugen (nicht via bash echo)
node -e "console.log(Buffer.from('PASSWORT').toString('base64'))"

# Secret als YAML applyen
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: registry-api-credentials
  namespace: arc-runners
type: Opaque
data:
  password: BASE64_ENCODED_PASSWORD
  username: YWRtaW4=
EOF
```

## 9. Langsame Builds ohne Docker Layer Cache

**Problem:** Jeder Build dauert 15-20 Minuten weil `npm ci` jedes Mal from scratch läuft

**Ursache:** DinD-Storage als `emptyDir` → wird nach jedem Runner-Pod gelöscht → kein Docker Layer Cache

**Lösung:** Longhorn PVC für den DinD-Storage:
```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dind-cache
  namespace: arc-runners
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: longhorn
  resources:
    requests:
      storage: 20Gi
EOF
```

In `runner-values.yaml`:
```yaml
volumes:
  - name: dind-storage
    persistentVolumeClaim:
      claimName: dind-cache
```

Ergebnis: Erster Build ~20 Min, folgende Builds ~5 Min (gecachte Layers).

---

# Troubleshooting

## Runner-Status prüfen

```bash
# ARC Controller
kubectl get pods -n arc-system

# Listener (wartet auf GitHub Webhook Events)
kubectl get pods -n arc-system -l actions.github.com/scale-set-name=arc-runner-set

# Aktive Runner-Pods (nur während ein Job läuft)
kubectl get pods -n arc-runners

# Controller Logs (bei Registrierungsproblemen)
kubectl logs -n arc-system -l app.kubernetes.io/name=gha-rs-controller --tail=50

# Listener Logs (bei Job-Problemen)
kubectl logs -n arc-system -l actions.github.com/scale-set-name=arc-runner-set --tail=50
```

## Runner Scale Set neu installieren

```bash
helm uninstall arc-runner-set --namespace arc-runners
helm install arc-runner-set --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml
```

## Registry Garbage Collection

Nach dem Löschen alter Tags durch den Workflow wird der Speicherplatz erst nach einer GC freigegeben:

```bash
kubectl exec -n registry deploy/docker-registry -- \
  registry garbage-collect /etc/docker/registry/config.yml
```

## Backend Rollback

Falls ein Backend-Deployment fehlschlägt:
```bash
kubectl rollout undo deployment/medusa-backend -n default
```

---

# Helm Releases

```bash
# Installierte Releases anzeigen
helm list -n arc-system
helm list -n arc-runners

# Runner Scale Set upgraden (nach Änderung an runner-values.yaml)
helm upgrade arc-runner-set --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml
```

Helm Binary liegt unter `C:\Users\oe\bin\helm.exe` (manuell installiert, nicht via choco).
