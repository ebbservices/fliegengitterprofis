#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build, push and deploy frontend + backend to Kubernetes
.PARAMETER Tag
    Docker image tag (default: latest)
.PARAMETER SkipBuild
    Skip Docker build step
.PARAMETER SkipPush
    Skip Docker push step
.PARAMETER SkipDeploy
    Skip Kubernetes deployment step
.EXAMPLE
    .\deploy-to-k8s.ps1 -Tag v2.0.0
#>

param(
    [string]$Registry = "registry.mobatix.de",
    [string]$Tag = "latest",
    [string]$Namespace = "default",
    [string]$RegistryUsername = "admin",
    [string]$RegistryPassword = $(if ($env:REGISTRY_PASSWORD) { $env:REGISTRY_PASSWORD } else { "MobatixRegistry2026!" }),
    [switch]$SkipBuild,
    [switch]$SkipPush,
    [switch]$SkipDeploy,
    [switch]$FrontendOnly,
    [switch]$BackendOnly
)

$ErrorActionPreference = "Stop"

function Write-Step { param([string]$Message); Write-Host "`n===> $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message); Write-Host "[OK] $Message" -ForegroundColor Green }

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ManifestsDir = Join-Path $ScriptDir "k8s"

$FrontendImage = "${Registry}/fliegengitter-shop:${Tag}"
$BackendImage = "${Registry}/medusa-backend:${Tag}"

# Production URLs
$MedusaBackendUrl = "https://admin.diefliegengitterprofis.mobatix.de"
$MedusaPublishableKey = "pk_7d7c40a9447f172851cac9face12b4d8c1078dce64cb97470dc4b585a1bc7074"

$BuildFrontend = -not $BackendOnly
$BuildBackend = -not $FrontendOnly

Write-Host @"

*****************************************************************
*     Fliegengitter Shop — Kubernetes Deployment                *
*****************************************************************

Tag:        $Tag
Frontend:   $FrontendImage $(if (-not $BuildFrontend) { "(skipped)" })
Backend:    $BackendImage $(if (-not $BuildBackend) { "(skipped)" })
Namespace:  $Namespace

"@ -ForegroundColor Yellow

# ========== BUILD ==========
if (-not $SkipBuild) {

    if ($BuildFrontend) {
        Write-Step "Building Frontend Docker image..."
        Push-Location $ScriptDir
        try {
            docker build -t $FrontendImage `
                --build-arg NEXT_PUBLIC_MEDUSA_BACKEND_URL=$MedusaBackendUrl `
                --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$MedusaPublishableKey `
                -f Dockerfile .
            if ($LASTEXITCODE -ne 0) { throw "Frontend Docker build failed" }
            Write-Success "Frontend image built"
        } finally { Pop-Location }
    }

    if ($BuildBackend) {
        Write-Step "Building Backend Docker image..."
        Push-Location (Join-Path $ScriptDir "backend")
        try {
            docker build -t $BackendImage -f Dockerfile .
            if ($LASTEXITCODE -ne 0) { throw "Backend Docker build failed" }
            Write-Success "Backend image built"
        } finally { Pop-Location }
    }

} else {
    Write-Host "⊘ Skipping Docker build" -ForegroundColor Yellow
}

# ========== PUSH ==========
if (-not $SkipPush) {
    Write-Step "Logging in to Docker registry..."
    $tempErrorPref = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    docker login $Registry -u $RegistryUsername -p $RegistryPassword 2>&1 | Out-Null
    $loginResult = $LASTEXITCODE
    $ErrorActionPreference = $tempErrorPref
    if ($loginResult -ne 0) { throw "Docker login failed" }
    Write-Success "Logged in to registry"

    if ($BuildFrontend) {
        Write-Step "Pushing Frontend image..."
        docker push $FrontendImage
        if ($LASTEXITCODE -ne 0) { throw "Frontend push failed" }
        Write-Success "Frontend image pushed"
    }

    if ($BuildBackend) {
        Write-Step "Pushing Backend image..."
        docker push $BackendImage
        if ($LASTEXITCODE -ne 0) { throw "Backend push failed" }
        Write-Success "Backend image pushed"
    }

} else {
    Write-Host "⊘ Skipping Docker push" -ForegroundColor Yellow
}

# ========== DEPLOY ==========
if (-not $SkipDeploy) {
    Write-Step "Deploying to Kubernetes..."

    $kubectlCheck = Get-Command kubectl -ErrorAction SilentlyContinue
    if (-not $kubectlCheck) { throw "kubectl not found" }

    # Namespace
    $namespaceExists = kubectl get namespace $Namespace 2>$null
    if ($LASTEXITCODE -ne 0) {
        kubectl create namespace $Namespace
    }

    # Update image tags in manifests
    $deploymentFile = Join-Path $ManifestsDir "deployment.yaml"
    if (Test-Path $deploymentFile) {
        $content = Get-Content $deploymentFile -Raw
        $content = $content -replace 'image: .*fliegengitter-shop:.*', "image: $FrontendImage"
        $content | Set-Content $deploymentFile
    }

    $backendFile = Join-Path $ManifestsDir "backend-deployment.yaml"
    if (Test-Path $backendFile) {
        $content = Get-Content $backendFile -Raw
        $content = $content -replace 'image: .*medusa-backend:.*', "image: $BackendImage"
        $content | Set-Content $backendFile
    }

    # Redis: only deploy if not already running
    $tempErrorPref2 = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    kubectl get deployment redis -n $Namespace 2>&1 | Out-Null
    $redisCheck = $LASTEXITCODE
    $ErrorActionPreference = $tempErrorPref2

    if ($redisCheck -ne 0) {
        Write-Step "Redis not found, deploying..."
        kubectl apply -f (Join-Path $ManifestsDir "redis-deployment.yaml") -n $Namespace
    } else {
        Write-Host "⊘ Redis already running" -ForegroundColor Yellow
    }

    # Deploy
    if ($BuildFrontend) {
        kubectl apply -f $deploymentFile -n $Namespace
        Write-Success "Frontend manifest applied"
    }

    if ($BuildBackend) {
        kubectl apply -f $backendFile -n $Namespace
        Write-Success "Backend manifest applied"
    }

    # Wait for rollouts
    if ($BuildFrontend) {
        Write-Step "Waiting for Frontend rollout..."
        kubectl rollout status deployment/fliegengitter-shop -n $Namespace --timeout=300s
    }

    if ($BuildBackend) {
        Write-Step "Waiting for Backend rollout..."
        kubectl rollout status deployment/medusa-backend -n $Namespace --timeout=300s
    }

    # Status
    Write-Step "Deployment Status"
    Write-Host "`nPods:" -ForegroundColor Cyan
    kubectl get pods -n $Namespace
    Write-Host "`nServices:" -ForegroundColor Cyan
    kubectl get svc -n $Namespace
    Write-Host "`nIngress:" -ForegroundColor Cyan
    kubectl get ingress -n $Namespace

    Write-Host @"

*****************************************************************
*                    Deployment Complete!                        *
*****************************************************************

Frontend:  https://dev.diefliegengitterprofis.mobatix.de
Backend:   https://admin.diefliegengitterprofis.mobatix.de
Admin:     https://admin.diefliegengitterprofis.mobatix.de/app

"@ -ForegroundColor Green

} else {
    Write-Host "⊘ Skipping Kubernetes deployment" -ForegroundColor Yellow
}

Write-Success "All done!"
