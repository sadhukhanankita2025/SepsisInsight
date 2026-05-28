#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " NeuroAI - Full Stack Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if frontend build exists
if (-not (Test-Path "frontend/dist/index.html")) {
    Write-Host ""
    Write-Host "[ERROR] Frontend build not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Building frontend first..." -ForegroundColor Yellow
    
    Push-Location "frontend"
    & npm install
    & npm run build
    Pop-Location
    
    Write-Host "Frontend build complete." -ForegroundColor Green
}

Write-Host ""
Write-Host "[INFO] Starting Backend Server on port 5000..." -ForegroundColor Green
Write-Host "[INFO] App will be available at: http://localhost:5000" -ForegroundColor Green
Write-Host ""

Push-Location "backend"
& python app.py
Pop-Location
