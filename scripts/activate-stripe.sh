#!/bin/bash
set -e

NAMESPACE="${K8S_NAMESPACE:-default}"
SECRET_NAME="medusa-secrets"

usage() {
  echo "Stripe Payment Provider aktivieren/aktualisieren"
  echo ""
  echo "Usage:"
  echo "  $0 <STRIPE_API_KEY> [STRIPE_WEBHOOK_SECRET]"
  echo ""
  echo "Beispiel:"
  echo "  $0 sk_live_xxx whsec_xxx"
  echo "  $0 sk_test_xxx                    # Ohne Webhook Secret"
  echo ""
  echo "Was passiert:"
  echo "  1. K8s Secret 'medusa-secrets' wird mit den Stripe Keys aktualisiert"
  echo "  2. Medusa Backend wird neugestartet"
  echo "  3. Stripe Provider erscheint in der Admin UI unter Regions"
  echo ""
  echo "Danach in der Admin UI:"
  echo "  Settings > Regions > Region bearbeiten > Stripe als Payment Provider aktivieren"
  exit 1
}

if [ -z "$1" ]; then
  usage
fi

STRIPE_API_KEY="$1"
STRIPE_WEBHOOK_SECRET="${2:-}"

echo "=== Stripe Payment aktivieren ==="
echo "Namespace: ${NAMESPACE}"
echo "API Key:   ${STRIPE_API_KEY:0:12}..."
if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
  echo "Webhook:   ${STRIPE_WEBHOOK_SECRET:0:10}..."
fi
echo ""

# Secret patchen
echo "Aktualisiere K8s Secret..."
kubectl get secret ${SECRET_NAME} -n ${NAMESPACE} -o json | \
  jq --arg key "$(echo -n "${STRIPE_API_KEY}" | base64)" \
     --arg webhook "$(echo -n "${STRIPE_WEBHOOK_SECRET}" | base64)" \
     '.data["STRIPE_API_KEY"]=$key | .data["STRIPE_WEBHOOK_SECRET"]=$webhook' | \
  kubectl apply -f -

echo "Starte Medusa Backend neu..."
kubectl rollout restart deployment/medusa-backend -n ${NAMESPACE}
kubectl rollout status deployment/medusa-backend -n ${NAMESPACE} --timeout=120s

echo ""
echo "=== Stripe aktiviert ==="
echo ""
echo "Naechste Schritte:"
echo "  1. Medusa Admin UI oeffnen"
echo "  2. Settings > Regions > Region bearbeiten"
echo "  3. Stripe als Payment Provider aktivieren"
echo "  4. PayPal als Zahlungsmethode in Stripe Dashboard aktivieren (optional)"
