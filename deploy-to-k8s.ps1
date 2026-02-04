#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy Fliegengitter Shop to Kubernetes
.DESCRIPTION
    Builds Docker image, pushes to registry, and deploys to Kubernetes cluster
.PARAMETER Tag
    Docker image tag (default: latest)
.EXAMPLE
    .\deploy-to-k8s.ps1 -Tag v1.0.0
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"

# Configuration
$IMAGE_NAME = "fliegengitter-shop"
$REGISTRY = "registry.mobatix.de"
$FULL_IMAGE_NAME = "$REGISTRY/${IMAGE_NAME}:$Tag"
$K8S_NAMESPACE = "default"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fliegengitter Shop Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Image: $FULL_IMAGE_NAME" -ForegroundColor Yellow
Write-Host "Namespace: $K8S_NAMESPACE" -ForegroundColor Yellow
Write-Host ""

# Step 1: Build Docker Image
Write-Host "===> Building Docker image..." -ForegroundColor Green
docker build --platform linux/amd64 -t $FULL_IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Login to Docker Registry
Write-Host "===> Logging in to Docker registry..." -ForegroundColor Green
docker login $REGISTRY

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Logged in to registry successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Push Docker Image
Write-Host "===> Pushing Docker image to registry..." -ForegroundColor Green
docker push $FULL_IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image pushed successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Update Kubernetes Deployment
Write-Host "===> Deploying to Kubernetes..." -ForegroundColor Green

# Update image tag in deployment
$deploymentContent = Get-Content "k8s/deployment.yaml" -Raw
$deploymentContent = $deploymentContent -replace "image: registry\.mobatix\.de/fliegengitter-shop:.*", "image: $FULL_IMAGE_NAME"
$deploymentContent | Set-Content "k8s/deployment.yaml.tmp"

Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan
kubectl apply -f k8s/deployment.yaml.tmp -n $K8S_NAMESPACE

Remove-Item "k8s/deployment.yaml.tmp"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Kubernetes deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Kubernetes manifests applied successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Wait for Deployment
Write-Host "===> Waiting for deployment to be ready..." -ForegroundColor Green
kubectl rollout status deployment/fliegengitter-shop -n $K8S_NAMESPACE

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Deployment rollout failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Deployment is ready!" -ForegroundColor Green
Write-Host ""

# Step 6: Display Deployment Info
Write-Host "===> Deployment Information" -ForegroundColor Green
Write-Host ""
Write-Host "Pods:" -ForegroundColor Cyan
kubectl get pods -n $K8S_NAMESPACE -l app=fliegengitter-shop
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
kubectl get svc -n $K8S_NAMESPACE -l app=fliegengitter-shop
Write-Host ""
Write-Host "Ingress:" -ForegroundColor Cyan
kubectl get ingress -n $K8S_NAMESPACE fliegengitter-shop-ingress
Write-Host ""

Write-Host "*****************************************************************" -ForegroundColor Green
Write-Host "*                    Deployment Complete!                       *" -ForegroundColor Green
Write-Host "*****************************************************************" -ForegroundColor Green
Write-Host ""
Write-Host "Your application should be available at:" -ForegroundColor Yellow
Write-Host "  • https://dev.diefliegengitterprofis.mobatix.de" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  kubectl logs -n $K8S_NAMESPACE -l app=fliegengitter-shop -f" -ForegroundColor Cyan
Write-Host ""
Write-Host "To check status:" -ForegroundColor Yellow
Write-Host "  kubectl get all -n $K8S_NAMESPACE -l app=fliegengitter-shop" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ All done!" -ForegroundColor Green
