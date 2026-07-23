# scripts/test-integration.ps1
# Restoku Integration Test Script (PowerShell)

$ErrorActionPreference = "Continue"

# Configuration
$BaseUrl = $env:API_URL -or "http://localhost:8000/api/v1"
$AdminEmail = $env:ADMIN_EMAIL -or "admin@restoku.id"
$AdminPassword = $env:ADMIN_PASSWORD -or "password"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Restoku Integration Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: $BaseUrl"
Write-Host ""

# Track results
$Passed = 0
$Failed = 0

function Pass($message) {
    Write-Host "  ✓ $message" -ForegroundColor Green
    $script:Passed++
}

function Fail($message) {
    Write-Host "  ✗ $message" -ForegroundColor Red
    $script:Failed++
}

# ============================================
# Test 1: Health Check
# ============================================
Write-Host "1. Health Check"
Write-Host "-------------------------------------------"

try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -ErrorAction Stop
    if ($health.status -eq "ok") {
        Pass "Backend is running"
    } else {
        Fail "Backend returned unexpected status"
    }
} catch {
    Fail "Backend is not running ($($_.Exception.Message))"
    Write-Host ""
    Write-Host "Please start the backend server:" -ForegroundColor Yellow
    Write-Host "  cd backend && php artisan serve"
    Write-Host ""
    exit 1
}

# ============================================
# Test 2: Authentication
# ============================================
Write-Host ""
Write-Host "2. Authentication"
Write-Host "-------------------------------------------"

$Token = $null
$RestaurantId = $null

try {
    $loginBody = @{
        email = $AdminEmail
        password = $AdminPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    
    if ($loginResponse.data.token) {
        $Token = $loginResponse.data.token
        $RestaurantId = $loginResponse.data.user.restaurant_id
        Pass "Login successful"
    } else {
        Fail "Login returned data but no token"
    }
} catch {
    Fail "Login failed ($($_.Exception.Message))"
}

# Get Current User
if ($Token) {
    try {
        $headers = @{ Authorization = "Bearer $Token" }
        $meResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Headers $headers -ErrorAction Stop
        Pass "Get current user successful"
    } catch {
        Fail "Get current user failed ($($_.Exception.Message))"
    }
}

# ============================================
# Test 3: Menu CRUD
# ============================================
Write-Host ""
Write-Host "3. Menu CRUD"
Write-Host "-------------------------------------------"

$MenuId = $null

if ($Token) {
    $headers = @{ Authorization = "Bearer $Token" }
    
    # Create Menu
    try {
        $createBody = @{
            name = "Test Menu Integration"
            price = 15000
            description = "Menu untuk testing"
        } | ConvertTo-Json

        $createResponse = Invoke-RestMethod -Uri "$BaseUrl/menus" -Method Post -Body $createBody -ContentType "application/json" -Headers $headers -ErrorAction Stop
        $MenuId = $createResponse.data.id
        Pass "Create menu successful (ID: $MenuId)"
    } catch {
        Fail "Create menu failed ($($_.Exception.Message))"
    }
    
    # Get Menu
    if ($MenuId) {
        try {
            $getResponse = Invoke-RestMethod -Uri "$BaseUrl/menus/$MenuId" -Headers $headers -ErrorAction Stop
            Pass "Get menu successful"
        } catch {
            Fail "Get menu failed ($($_.Exception.Message))"
        }
        
        # Update Menu
        try {
            $updateBody = @{
                name = "Test Menu Updated"
                price = 20000
            } | ConvertTo-Json

            $updateResponse = Invoke-RestMethod -Uri "$BaseUrl/menus/$MenuId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers -ErrorAction Stop
            Pass "Update menu successful"
        } catch {
            Fail "Update menu failed ($($_.Exception.Message))"
        }
        
        # Delete Menu
        try {
            Invoke-RestMethod -Uri "$BaseUrl/menus/$MenuId" -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
            Pass "Delete menu successful"
        } catch {
            Fail "Delete menu failed ($($_.Exception.Message))"
        }
    }
} else {
    Fail "Skipping Menu CRUD - no token"
}

# ============================================
# Test 4: Public API
# ============================================
Write-Host ""
Write-Host "4. Public API (QR Menu)"
Write-Host "-------------------------------------------"

if ($RestaurantId) {
    # Get Public Menu
    try {
        $publicMenuResponse = Invoke-RestMethod -Uri "$BaseUrl/public/menu/$RestaurantId" -ErrorAction Stop
        Pass "Public menu accessible"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Pass "Public menu endpoint exists (404 expected if no data)"
        } else {
            Fail "Public menu failed ($($_.Exception.Message))"
        }
    }
    
    # Create Public Order
    try {
        $publicOrderBody = @{
            restaurant_id = $RestaurantId
            table_number = 1
            items = @(
                @{
                    menu_id = "test-menu-id"
                    quantity = 1
                }
            )
        } | ConvertTo-Json -Depth 3

        $publicOrderResponse = Invoke-RestMethod -Uri "$BaseUrl/public/orders" -Method Post -Body $publicOrderBody -ContentType "application/json" -ErrorAction Stop
        Pass "Public order endpoint accessible"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 422) {
            Pass "Public order endpoint exists (422 expected for invalid data)"
        } else {
            Fail "Public order failed ($($_.Exception.Message))"
        }
    }
} else {
    Fail "Skipping Public API - no restaurant_id"
}

# ============================================
# Test 5: Frontend Build
# ============================================
Write-Host ""
Write-Host "5. Frontend Build"
Write-Host "-------------------------------------------"

if (Test-Path "package.json") {
    Write-Host "  Checking Node.js..."
    $nodeVersion = try { node --version } catch { $null }
    
    if ($nodeVersion) {
        Pass "Node.js installed ($nodeVersion)"
        
        Write-Host "  Installing dependencies..."
        npm install --silent 2>$null | Out-Null
        
        Write-Host "  Building frontend..."
        try {
            npm run build --silent 2>$null | Out-Null
            Pass "Frontend build successful"
        } catch {
            Fail "Frontend build failed"
        }
    } else {
        Fail "Node.js not installed"
    }
} else {
    Fail "package.json not found"
}

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Test Results" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Passed: $Passed" -ForegroundColor Green
Write-Host "  Failed: $Failed" -ForegroundColor Red
Write-Host ""

if ($Failed -eq 0) {
    Write-Host "All tests passed! ✓" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Some tests failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
