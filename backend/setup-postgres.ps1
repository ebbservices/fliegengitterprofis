# PostgreSQL Setup Script für Windows
# Führt das SQL-Script auf dem PostgreSQL Server aus

param(
    [string]$PostgresHost = "10.0.0.6",
    [string]$PostgresPort = "5432",
    [string]$AdminUser = "postgres",
    [string]$Password = ""
)

Write-Host "==> PostgreSQL Setup für Die Fliegengitter Profis" -ForegroundColor Green
Write-Host ""

# Prüfen ob psql verfügbar ist
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ psql nicht gefunden. Bitte PostgreSQL Client installieren." -ForegroundColor Red
    Write-Host "Download: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Passwort abfragen wenn nicht angegeben
if ([string]::IsNullOrEmpty($Password)) {
    $SecurePassword = Read-Host "Passwort für PostgreSQL Admin-User '$AdminUser'" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

Write-Host "Verbinde zu PostgreSQL Server $PostgresHost..." -ForegroundColor Cyan

# Umgebungsvariable für Passwort setzen
$env:PGPASSWORD = $Password

# SQL-Script ausführen
$scriptPath = Join-Path $PSScriptRoot "setup-postgres.sql"

try {
    psql -h $PostgresHost -p $PostgresPort -U $AdminUser -d postgres -f $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ PostgreSQL Setup erfolgreich abgeschlossen!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Erstellt:" -ForegroundColor Yellow
        Write-Host "  • User: medusa_user" -ForegroundColor White
        Write-Host "  • Dev-DB: diefliegengitterprofis_dev" -ForegroundColor White
        Write-Host "  • Prod-DB: diefliegengitterprofis_prod" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  WICHTIG: Ändere das Passwort für 'medusa_user' in Produktion!" -ForegroundColor Red
        Write-Host ""
    } else {
        Write-Host "❌ Fehler beim Ausführen des SQL-Scripts" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Fehler: $_" -ForegroundColor Red
    exit 1
} finally {
    # Passwort aus Umgebungsvariable entfernen
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "Connection Strings:" -ForegroundColor Yellow
Write-Host "  Dev:  postgresql://medusa_user:PASSWORD@10.0.0.6:5432/diefliegengitterprofis_dev" -ForegroundColor Cyan
Write-Host "  Prod: postgresql://medusa_user:PASSWORD@10.0.0.6:5432/diefliegengitterprofis_prod" -ForegroundColor Cyan
