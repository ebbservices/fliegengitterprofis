# CI/CD Setup mit GitHub Actions + ARC + Helm

Automatische Builds und Deployments via **Actions Runner Controller (ARC)** auf unserem Kubernetes-Cluster. Deployments werden per **Helm Charts** verwaltet. Der Runner laeuft direkt im Cluster — alle Secrets bleiben auf K8s, nichts wird bei GitHub gespeichert.

## Architektur

```
Push auf dev/main → GitHub Webhook → ARC Controller (arc-system)
                                          ↓
                                Runner Pod (arc-runners)
                                ├── actions-runner (Build + Deploy)
                                └── docker:dind (Docker Daemon)
                                          ↓
                                docker build + push → registry.mobatix.de
                                helm upgrade --install → Helm Release Update
                                          ↓
                                Runner Pod wird automatisch abgebaut (0 im Idle)
```

## Branch-basiertes Deployment

| Branch | Environment | Namespace | Frontend URL | Admin URL |
|--------|-------------|-----------|-------------|-----------|
| `dev` | dev | `<projekt>` | dev.xxx.mobatix.de | admin.xxx.mobatix.de/app |
| `main` | prod | `<projekt>` | www.domain.de | admin.domain.de/app |

## Was auf dem Cluster laeuft (Shared)

| Namespace | Komponente | Zweck |
|-----------|-----------|-------|
| `arc-system` | `arc-gha-rs-controller` | ARC Controller (Helm Chart) |
| `arc-system` | `arc-runner-set-*-listener` | Listener (wartet auf GitHub Webhook Events) |
| `arc-runners` | Runner Pods (ephemeral) | Werden bei Push erstellt, nach Job zerstoert |
| `arc-runners` | PVC `dind-cache` (20Gi, Longhorn) | Docker Layer Cache zwischen Builds |
| `default` | Redis (redis:7-alpine) | Shared fuer alle Projekte |

## K8s Secrets (arc-runners Namespace)

| Secret | Typ | Inhalt |
|--------|-----|--------|
| `github-app-secret` | Opaque | `github_app_id`, `github_app_installation_id`, `github_app_private_key` |
| `registry-api-credentials` | Opaque | `username`, `password` (Klartext fuer Registry API Calls) |
| `medusa-publishable-key-<env>` | Opaque | `key` (Medusa Publishable API Key pro Environment) |

## GitHub App

- **Name:** Mobatix ARC Runner
- **App ID:** 3149259
- **Installation ID:** 117991920
- **Permissions:** Repository Actions (Read), Administration (Read+Write), Metadata (Read)
- **Installiert auf:** ebbservices (All repositories)
- **Private Key:** Als K8s Secret `github-app-secret` gespeichert
- **Einstellung:** `ebbservices` ist ein persoenlicher Account, kein Org → ARC Runner Scale Sets muessen pro Repository konfiguriert werden (nicht account-weit)

## Versioning

- Format: `vMAJOR.MINOR.PATCH` (z.B. v2.2.5)
- Patch wird bei jedem Deploy automatisch +1 erhoeht
- Patch max 50 → Minor +1, Patch reset (z.B. v2.2.50 → v2.3.0)
- Letzter Tag wird aus der Registry API gelesen
- Nur die neuesten 10 Tags pro Image werden behalten, aeltere werden geloescht
- Frontend-Images bekommen ein Environment-Suffix: `v2.3.0-dev`, `v2.3.0-prod`

## Projekt-Dateien

| Datei | Zweck |
|-------|-------|
| `.github/workflows/deploy.yaml` | Build & Deploy Workflow (branch-basiert) |
| `helm/<chart>/Chart.yaml` | Helm Chart Definition |
| `helm/<chart>/values.yaml` | Shared Defaults |
| `helm/<chart>/values-dev.yaml` | Dev Environment Overrides |
| `helm/<chart>/values-prod.yaml` | Prod Environment Overrides |
| `helm/<chart>/templates/` | K8s Resource Templates |
| `k8s/arc/rbac.yaml` | ServiceAccount, Role, RoleBinding fuer Runner |
| `k8s/arc/runner-values.yaml` | Helm Values (DinD, Secrets, Scaling, PVC Cache) |
| `scripts/setup-env.py` | Einmaliges DB + K8s Secrets Setup |

---

# Neues Projekt aufsetzen (Schritt fuer Schritt)

## Voraussetzungen

- ARC Controller im Cluster (einmalig installiert)
- Helm 3.x, kubectl, Python 3.x + psycopg2-binary
- DNS: *.mobatix.de zeigt auf Ingress Controller

## Schritt 1: Runner Scale Set fuer das Repo installieren

```bash
helm install arc-runner-PROJEKTNAME \
  --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml \
  --set githubConfigUrl="https://github.com/ebbservices/REPO-NAME"
```

Die bestehenden Secrets (`github-app-secret`, `registry-api-credentials`) und der PVC (`dind-cache`) werden automatisch mitgenutzt.

## Schritt 2: GitHub App Zugriff pruefen

Die App "Mobatix ARC Runner" ist auf "All repositories" installiert — neue Repos haben automatisch Zugriff. Falls nicht:
- GitHub → Settings → Applications → Mobatix ARC Runner → Configure
- Repo hinzufuegen

## Schritt 3: Helm Chart erstellen

Verzeichnisstruktur:
```
helm/<chartname>/
  Chart.yaml
  values.yaml              # Shared defaults (resources, probes, images)
  values-dev.yaml          # Dev: hosts, CORS, secretName
  values-prod.yaml         # Prod: hosts, CORS, secretName, replicas
  templates/
    _helpers.tpl           # Naming mit Environment-Suffix
    frontend-deployment.yaml
    frontend-service.yaml
    frontend-ingress.yaml
    backend-deployment.yaml
    backend-service.yaml
    backend-ingress.yaml
    backend-pvc.yaml
    NOTES.txt
```

Wichtige Patterns:
- Ressourcen-Namen mit Environment-Suffix: `app-name-dev`, `app-name-prod`
- Backend laedt Secrets per `envFrom: secretRef` (Secret wird vom Setup-Script erstellt, nicht von Helm)
- CORS und Hosts kommen aus values-dev/prod.yaml
- `imagePullSecrets` referenziert `registry-secret` im Projekt-Namespace

## Schritt 4: RBAC fuer den Projekt-Namespace

```yaml
# k8s/arc/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: arc-runner-deployer
  namespace: PROJEKT-NAMESPACE
rules:
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "create", "patch", "update", "delete"]
  - apiGroups: [""]
    resources: ["services", "pods", "persistentvolumeclaims", "secrets", "configmaps"]
    verbs: ["get", "list", "create", "patch", "update", "delete"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses"]
    verbs: ["get", "list", "create", "patch", "update", "delete"]
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["get", "list", "create", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: arc-runner-deployer-binding
  namespace: PROJEKT-NAMESPACE
subjects:
  - kind: ServiceAccount
    name: arc-runner-sa
    namespace: arc-runners
roleRef:
  kind: Role
  name: arc-runner-deployer
  apiGroup: rbac.authorization.k8s.io
---
# ClusterRole fuer Namespace-Erstellung (--create-namespace bei helm install)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: arc-runner-namespace-creator
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["get", "list", "create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: arc-runner-namespace-creator-binding
subjects:
  - kind: ServiceAccount
    name: arc-runner-sa
    namespace: arc-runners
roleRef:
  kind: ClusterRole
  name: arc-runner-namespace-creator
  apiGroup: rbac.authorization.k8s.io
```

Applyen: `kubectl apply -f k8s/arc/rbac.yaml`

## Schritt 5: GitHub Actions Workflow

`.github/workflows/deploy.yaml` — Kern-Struktur:

```yaml
name: Build and Deploy
on:
  push:
    branches: [main, dev]

env:
  REGISTRY: registry.mobatix.de
  FRONTEND_IMAGE: registry.mobatix.de/<frontend-name>
  BACKEND_IMAGE: registry.mobatix.de/<backend-name>
  K8S_NAMESPACE: <projekt-namespace>

jobs:
  build-and-deploy:
    runs-on: arc-runner-set
    steps:
      - uses: actions/checkout@v4

      - name: Set environment variables
        # Branch-Detection: main → prod, dev → dev
        # Setzt: ENV, VALUES_FILE, MEDUSA_BACKEND_URL, RELEASE_NAME

      - name: Calculate next version tag
        # Auto-increment aus Registry API

      - name: Install kubectl and helm
        # WICHTIG: In $HOME/.local/bin installieren, NICHT ins Workdir
        # (sonst Konflikt mit helm/ Ordner)

      - name: Build + Push images
        # Frontend mit env-spezifischen Build-Args (URLs)
        # Frontend-Tag mit Suffix: v2.3.0-dev / v2.3.0-prod
        # Backend-Tag ohne Suffix: v2.3.0

      - name: Deploy with Helm
        run: |
          helm upgrade --install "${RELEASE_NAME}" ./helm/<chart> \
            -n $K8S_NAMESPACE --create-namespace \
            -f helm/<chart>/values-${ENV}.yaml \
            --set frontend.image.tag="${TAG}-${ENV}" \
            --set backend.image.tag="${TAG}" \
            --wait --timeout 5m
```

## Schritt 6: Datenbank + Secrets einrichten (einmalig)

Python Setup-Script erstellen (`scripts/setup-env.py`) das:
1. K8s Namespace anlegt
2. Registry Secret vom `default` Namespace kopiert
3. PostgreSQL DB + User mit generiertem Passwort erstellt
4. K8s Secret mit allen Credentials anlegt (DB URL, Redis URL, JWT, Cookie, SMTP etc.)

```bash
pip install psycopg2-binary
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <PW> --env dev
py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <PW> --env prod
```

## Schritt 7: Erster Push (triggert CI/CD)

```bash
git push origin dev
```

## Schritt 8: DB Migrationen (einmalig nach erstem Deploy)

Medusa fuehrt KEINE automatischen Migrationen bei `medusa start` aus:

```bash
NS=<projekt-namespace>
ENV=dev
IMAGE=registry.mobatix.de/<backend-image>:<tag>
SECRET=<secret-name>-$ENV

kubectl run medusa-migrate --rm -i --restart=Never \
  -n $NS --image=$IMAGE \
  --overrides='{"spec":{"containers":[{"name":"medusa-migrate","image":"'"$IMAGE"'","command":["npx","medusa","db:migrate"],"envFrom":[{"secretRef":{"name":"'"$SECRET"'"}}],"env":[{"name":"NODE_ENV","value":"production"}]}],"imagePullSecrets":[{"name":"registry-secret"}]}}'
```

## Schritt 9: Seed ausfuehren (einmalig)

```bash
kubectl run medusa-seed --rm -i --restart=Never \
  -n $NS --image=$IMAGE \
  --overrides='{"spec":{"containers":[{"name":"medusa-seed","image":"'"$IMAGE"'","command":["npx","medusa","exec","./src/scripts/seed.ts"],"envFrom":[{"secretRef":{"name":"'"$SECRET"'"}}],"env":[{"name":"NODE_ENV","value":"production"}]}],"imagePullSecrets":[{"name":"registry-secret"}]}}'
```

## Schritt 10: Backend neustarten

```bash
kubectl rollout restart deployment/medusa-backend-$ENV -n $NS
kubectl rollout status deployment/medusa-backend-$ENV -n $NS --timeout=120s
```

## Schritt 11: Admin User anlegen

```bash
kubectl exec -n $NS deployment/medusa-backend-$ENV -- \
  npx medusa user --email <EMAIL> --password '<PASSWORT>'
```

## Schritt 12: Publishable Key extrahieren und speichern

```bash
# Key aus DB lesen
kubectl run pg-query --rm -i --restart=Never \
  -n $NS --image=postgres:16-alpine \
  --overrides='{"spec":{"containers":[{"name":"pg-query","image":"postgres:16-alpine","command":["sh","-c","psql \"$DATABASE_URL\" -c \"SELECT token FROM api_key WHERE type = '"'"'publishable'"'"';\""],"envFrom":[{"secretRef":{"name":"'"$SECRET"'"}}]}]}}'

# Key als Secret fuer CI/CD speichern (im arc-runners Namespace)
kubectl create secret generic medusa-publishable-key-$ENV \
  -n arc-runners \
  --from-literal=key="pk_xxxxx"
```

## Schritt 13: Prod einrichten

Schritte 6-12 fuer `--env prod` wiederholen, dann `dev` in `main` mergen.

---

# Bekannte Fallstricke und Loesungen

## 1. Persoenlicher Account vs. Organisation

**Problem:** `githubConfigUrl` auf `https://github.com/ebbservices` gesetzt → 404

**Loesung:** URL muss auf ein spezifisches Repository zeigen:
```yaml
githubConfigUrl: "https://github.com/ebbservices/REPO-NAME"
```

## 2. Docker Login: read-only file system

**Problem:** Registry-Auth als Volume Mount → `read-only file system`

**Loesung:** `docker login` als Workflow-Step, kein Volume Mount:
```yaml
run: echo "${REGISTRY_PASSWORD}" | docker login registry.mobatix.de -u admin --password-stdin
```

## 3. Helm Binary vs. helm/ Ordner

**Problem:** `mv linux-amd64/helm .` schlaegt fehl wenn ein `helm/` Ordner im Repo existiert

**Loesung:** kubectl und helm in `$HOME/.local/bin` installieren:
```yaml
mkdir -p $HOME/.local/bin
mv linux-amd64/helm $HOME/.local/bin/
echo "$HOME/.local/bin" >> $GITHUB_PATH
```

## 4. Ingress configuration-snippet blockiert

**Problem:** `admission webhook denied the request: Snippet directives are disabled`

**Loesung:** `nginx.ingress.kubernetes.io/configuration-snippet` Annotation nicht verwenden. Security-Header muessen anders gesetzt werden (z.B. ueber nginx ConfigMap).

## 5. RBAC: replicasets fehlt

**Problem:** `helm upgrade --wait` schlaegt fehl mit `replicasets.apps is forbidden`

**Loesung:** `replicasets` in der RBAC Role hinzufuegen (Helm prueft ReplicaSets beim `--wait`).

## 6. Medusa startet nicht: "relation does not exist"

**Problem:** Backend-Pod crash-loopt nach erstem Deploy

**Ursache:** Medusa `start` fuehrt KEINE automatischen Migrationen aus. DB ist leer.

**Loesung:** `medusa db:migrate` einmalig als K8s Job ausfuehren (siehe Schritt 8).

## 7. .dockerignore: Backend im Frontend-Build

**Problem:** `Cannot find module '@medusajs/framework/utils'` beim Frontend-Build

**Loesung:** `backend` in `.dockerignore` und `tsconfig.json` exclude.

## 8. Medusa Build braucht Dummy-Env-Vars

**Problem:** Build schlaegt fehl wenn JWT_SECRET etc. nicht gesetzt

**Loesung:** Dummy-Werte im Builder-Stage:
```dockerfile
ENV DATABASE_URL=postgres://localhost/fake \
    JWT_SECRET=build-placeholder \
    COOKIE_SECRET=build-placeholder
```

## 9. Medusa braucht volle node_modules

**Problem:** `Cannot find module '/app/medusa-config'`

**Loesung:** `node_modules` komplett vom Builder kopieren (kein `--omit=dev`). Medusa laedt TypeScript zur Laufzeit.

## 10. Registry Secret mit Sonderzeichen

**Problem:** `docker login` bekommt 401 wegen escaped Sonderzeichen

**Loesung:** Secret als YAML mit base64-encodiertem Wert erstellen:
```bash
node -e "console.log(Buffer.from('PASSWORT').toString('base64'))"
```

## 11. Langsame Builds ohne Docker Layer Cache

**Problem:** Jeder Build dauert 15-20 Minuten

**Loesung:** Longhorn PVC `dind-cache` (20Gi) fuer DinD-Storage. Ergebnis: Folge-Builds ~5 Min.

## 12. subprocess auf Windows: Shell-Parsing Probleme

**Problem:** Python `subprocess.run(cmd, shell=True)` interpretiert Sonderzeichen in Secrets falsch

**Loesung:** Immer Listen statt Strings verwenden: `subprocess.run(["kubectl", "create", ...])` ohne `shell=True`.

---

# Troubleshooting

## Runner-Status pruefen

```bash
# ARC Controller
kubectl get pods -n arc-system

# Listener
kubectl get pods -n arc-system -l actions.github.com/scale-set-name=arc-runner-set

# Aktive Runner-Pods (nur waehrend ein Job laeuft)
kubectl get pods -n arc-runners

# Controller Logs
kubectl logs -n arc-system -l app.kubernetes.io/name=gha-rs-controller --tail=50

# Listener Logs
kubectl logs -n arc-system -l actions.github.com/scale-set-name=arc-runner-set --tail=50
```

## Helm Status pruefen

```bash
# Releases anzeigen
helm list -n <projekt-namespace>
helm list -n arc-system
helm list -n arc-runners

# Release History (fuer Rollback)
helm history <release-name> -n <projekt-namespace>

# Rollback auf vorherige Revision
helm rollback <release-name> -n <projekt-namespace>
```

## Runner Scale Set neu installieren

```bash
helm uninstall arc-runner-set --namespace arc-runners
helm install arc-runner-set --namespace arc-runners \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  -f k8s/arc/runner-values.yaml
```

## Registry Garbage Collection

```bash
kubectl exec -n registry deploy/docker-registry -- \
  registry garbage-collect /etc/docker/registry/config.yml
```
