#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build, push and deploy the fliegengitter-shop application to Kubernetes
.DESCRIPTION
    This script builds the Docker image, pushes it to a registry, and deploys it to Kubernetes
.PARAMETER Registry
    Docker registry URL (default: registry.mobatix.de)
.PARAMETER ImageName
    Docker image name (default: mobatix-website)
.PARAMETER Tag
    Docker image tag (default: latest)
.PARAMETER Namespace
    Kubernetes namespace (default: default)
.PARAMETER RegistryUsername
    Docker registry username (default: admin)
.PARAMETER RegistryPassword
    Docker registry password (read from $env:REGISTRY_PASSWORD if not specified)
.PARAMETER SkipBuild
    Skip Docker build step
.PARAMETER SkipPush
    Skip Docker push step
.PARAMETER SkipDeploy
    Skip Kubernetes deployment step
.EXAMPLE
    .\deploy-to-k8s.ps1
.EXAMPLE
    .\deploy-to-k8s.ps1 -Tag v1.0.0
.EXAMPLE
    .\deploy-to-k8s.ps1 -SkipBuild -SkipPush
#>

param(
    [string]$Registry = "registry.mobatix.de",
    [string]$ImageName = "fliegengitter-shop",
    [string]$Tag = "latest",
    [string]$Namespace = "default",
    [string]$RegistryUsername = "admin",
    [string]$RegistryPassword = $env:REGISTRY_PASSWORD,
    [switch]$SkipBuild,
    [switch]$SkipPush,
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Step {
    param([string]$Message)
    Write-Host "`n===> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ManifestsDir = Join-Path $ScriptDir "k8s"

# Full image name
$FullImageName = "${Registry}/${ImageName}:${Tag}"

Write-Host @"

*****************************************************************
*         Fliegengitter Shop Kubernetes Deployment         *
*****************************************************************

Registry:   $Registry
Image:      $ImageName
Tag:        $Tag
Full Image: $FullImageName
Namespace:  $Namespace

"@ -ForegroundColor Yellow

# Step 1: Build Docker Image
if (-not $SkipBuild) {
    Write-Step "Building Docker image..."
    
    Push-Location $ScriptDir
    try {
        docker build -t $FullImageName -f Dockerfile .
        if ($LASTEXITCODE -ne 0) {
            throw "Docker build failed"
        }
        Write-Success "Docker image built successfully"
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "⊘ Skipping Docker build" -ForegroundColor Yellow
}

# Step 2: Login to Docker Registry
if (-not $SkipPush) {
    Write-Step "Logging in to Docker registry..."
    
    # Login to registry (suppress warnings)
    $tempErrorPref = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    docker login $Registry -u $RegistryUsername -p $RegistryPassword 2>&1 | Out-Null
    $loginResult = $LASTEXITCODE
    $ErrorActionPreference = $tempErrorPref
    
    if ($loginResult -ne 0) {
        throw "Docker login failed. Please check registry credentials."
    }
    Write-Success "Logged in to registry successfully"
}

# Step 3: Push Docker Image
if (-not $SkipPush) {
    Write-Step "Pushing Docker image to registry..."
    
    docker push $FullImageName
    if ($LASTEXITCODE -ne 0) {
        throw "Docker push failed"
    }
    Write-Success "Docker image pushed successfully"
}
else {
    Write-Host "⊘ Skipping Docker push" -ForegroundColor Yellow
}

# Step 4: Deploy to Kubernetes
if (-not $SkipDeploy) {
    Write-Step "Deploying to Kubernetes..."
    
    # Check if kubectl is available
    $kubectlCheck = Get-Command kubectl -ErrorAction SilentlyContinue
    if (-not $kubectlCheck) {
        throw "kubectl not found. Please install kubectl first."
    }
    
    # Check if namespace exists, create if not
    $namespaceExists = kubectl get namespace $Namespace 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating namespace $Namespace..." -ForegroundColor Yellow
        kubectl create namespace $Namespace
    }
    
    # Apply Kubernetes manifests
    Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan

    # Update image tag in deployment
    $deploymentFile = Join-Path $ManifestsDir "deployment.yaml"
    if (Test-Path $deploymentFile) {
        # Read deployment file and replace image
        $deploymentContent = Get-Content $deploymentFile -Raw
        $deploymentContent = $deploymentContent -replace 'image: .*fliegengitter-shop:.*', "image: $FullImageName"
        $deploymentContent | Set-Content $deploymentFile
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
        Write-Host "⊘ Redis already running, skipping redis-deployment.yaml" -ForegroundColor Yellow
    }

    # Apply app manifests (excluding redis which is handled above)
    kubectl apply -f (Join-Path $ManifestsDir "deployment.yaml") -n $Namespace
    kubectl apply -f (Join-Path $ManifestsDir "backend-deployment.yaml") -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        throw "Kubernetes deployment failed"
    }
    
    Write-Success "Kubernetes manifests applied successfully"
    
    # Wait for deployment to be ready
    Write-Step "Waiting for deployment to be ready..."
    kubectl rollout status deployment/fliegengitter-shop -n $Namespace --timeout=300s
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Deployment is ready!"
    }
    else {
        Write-Error "Deployment rollout failed or timed out"
        Write-Host "`nChecking pod status..." -ForegroundColor Yellow
        kubectl get pods -n $Namespace -l app=fliegengitter-shop
        Write-Host "`nChecking pod logs..." -ForegroundColor Yellow
        kubectl logs -n $Namespace -l app=fliegengitter-shop --tail=50
        exit 1
    }
    
    # Show deployment info
    Write-Step "Deployment Information"
    Write-Host "`nPods:" -ForegroundColor Cyan
    kubectl get pods -n $Namespace -l app=mobatix-website
    
    Write-Host "`nServices:" -ForegroundColor Cyan
    kubectl get svc -n $Namespace -l app=fliegengitter-shop
    
    Write-Host "`nIngress:" -ForegroundColor Cyan
    kubectl get ingress -n $Namespace fliegengitter-shop-ingress
    
    Write-Host @"

*****************************************************************
*                    Deployment Complete!                       *
*****************************************************************

Your application should be available at:
  • https://dev.diefliegengitterprofis.mobatix.de

To view logs:
  kubectl logs -n $Namespace -l app=fliegengitter-shop -f

To check status:
  kubectl get all -n $Namespace -l app=fliegengitter-shop

"@ -ForegroundColor Green
}
else {
    Write-Host "⊘ Skipping Kubernetes deployment" -ForegroundColor Yellow
}

Write-Success "All done!"

