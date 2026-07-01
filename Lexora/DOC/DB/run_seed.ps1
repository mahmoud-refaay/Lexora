# ===================================================
# Lexora Database Reset & Seed Script
# Deletes all data, recreates schema, seeds fresh Arabic data.
# Run from an elevated PowerShell prompt if needed.
# ===================================================

param(
    [string]$Server = ".",
    [string]$Database = "Lexora"
)

$ErrorActionPreference = "Stop"

# Resolve paths relative to this script
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Lexora Database Reset & Seed" -ForegroundColor Cyan
Write-Host "Server: $Server, Database: $Database" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Verify sqlcmd is available
$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) {
    Write-Error "sqlcmd not found in PATH. Please install SQL Server Command Line Tools."
    exit 1
}
Write-Host "sqlcmd found: $($sqlcmd.Source)" -ForegroundColor Green

function Invoke-SqlFile {
    param(
        [string]$FilePath,
        [string]$Description
    )
    if (-not (Test-Path $FilePath)) {
        Write-Error "File not found: $FilePath"
        exit 1
    }

    Write-Host "Running: $Description ($FilePath)" -ForegroundColor Yellow
    & sqlcmd -S $Server -d $Database -E -b -f 65001 -i "$FilePath"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to execute $FilePath. Exit code: $LASTEXITCODE"
        exit $LASTEXITCODE
    }
    Write-Host "Completed: $Description" -ForegroundColor Green
    Write-Host ""
}

# Build ordered list of scripts
$scripts = @(
    @{ File = "$root\scripts\00_cleanup_data.sql"; Desc = "Cleanup existing data" },
    @{ File = "$root\scripts\01_identity_schema.sql"; Desc = "Create identity schema" },
    @{ File = "$root\scripts\03_identity_triggers_indexes.sql"; Desc = "Create identity triggers & indexes" },
    @{ File = "$root\scripts\04_clients_schema.sql"; Desc = "Create clients schema" },
    @{ File = "$root\scripts\05_cases_schema.sql"; Desc = "Create cases schema" },
    @{ File = "$root\seeds\02_identity_seed.sql"; Desc = "Seed identity data (Arabic)" },
    @{ File = "$root\seeds\03_cases_seed.sql"; Desc = "Seed cases data (Arabic)" }
)

# Add procedures in module order
$procedureFiles = @(
    "$root\procedures\identity\sp_users.sql",
    "$root\procedures\identity\sp_roles_settings.sql",
    "$root\procedures\identity\sp_refresh_tokens.sql",
    "$root\procedures\identity\sp_auth.sql",
    "$root\procedures\clients\sp_clients.sql",
    "$root\procedures\clients\sp_client_notes.sql",
    "$root\procedures\cases\sp_cases.sql",
    "$root\procedures\cases\sp_case_notes.sql"
)

foreach ($proc in $procedureFiles) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($proc)
    $scripts += @{ File = $proc; Desc = "Create procedure: $name" }
}

# Execute scripts in order
foreach ($script in $scripts) {
    Invoke-SqlFile -FilePath $script.File -Description $script.Desc
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Database reset and seed completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
