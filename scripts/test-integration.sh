#!/bin/bash
# scripts/test-integration.sh
# Restoku Integration Test Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${API_URL:-http://localhost:8000/api/v1}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@restoku.id}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-password}"

echo ""
echo "=========================================="
echo "   Restoku Integration Tests"
echo "=========================================="
echo ""
echo "API URL: $BASE_URL"
echo ""

# Track results
PASSED=0
FAILED=0

pass() {
    echo -e "  ${GREEN}✓ $1${NC}"
    PASSED=$((PASSED + 1))
}

fail() {
    echo -e "  ${RED}✗ $1${NC}"
    FAILED=$((FAILED + 1))
}

# ============================================
# Test 1: Health Check
# ============================================
echo "1. Health Check"
echo "-------------------------------------------"

HEALTH=$(curl -s -w "\n%{http_code}" "$BASE_URL/health" 2>/dev/null)
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
BODY=$(echo "$HEALTH" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    pass "Backend is running (HTTP 200)"
else
    fail "Backend is not running (HTTP $HTTP_CODE)"
    echo ""
    echo -e "${YELLOW}Please start the backend server:${NC}"
    echo "  cd backend && php artisan serve"
    echo ""
    exit 1
fi

# ============================================
# Test 2: Authentication
# ============================================
echo ""
echo "2. Authentication"
echo "-------------------------------------------"

# Login
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    2>/dev/null)

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    RESTAURANT_ID=$(echo "$BODY" | grep -o '"restaurant_id":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        pass "Login successful"
    else
        fail "Login returned 200 but no token"
    fi
else
    fail "Login failed (HTTP $HTTP_CODE)"
    echo "  Response: $BODY"
fi

# Get Current User
if [ -n "$TOKEN" ]; then
    ME_RESPONSE=$(curl -s -w "\n%{http_code}" \
        "$BASE_URL/auth/me" \
        -H "Authorization: Bearer $TOKEN" \
        2>/dev/null)
    
    HTTP_CODE=$(echo "$ME_RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        pass "Get current user successful"
    else
        fail "Get current user failed (HTTP $HTTP_CODE)"
    fi
fi

# ============================================
# Test 3: Menu CRUD
# ============================================
echo ""
echo "3. Menu CRUD"
echo "-------------------------------------------"

if [ -n "$TOKEN" ]; then
    # Create Menu
    CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" \
        -X POST "$BASE_URL/menus" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Menu Integration","price":15000,"description":"Menu untuk testing"}' \
        2>/dev/null)
    
    HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
    BODY=$(echo "$CREATE_RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "201" ]; then
        MENU_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        pass "Create menu successful (ID: $MENU_ID)"
    else
        fail "Create menu failed (HTTP $HTTP_CODE)"
    fi
    
    # Get Menu
    if [ -n "$MENU_ID" ]; then
        GET_RESPONSE=$(curl -s -w "\n%{http_code}" \
            "$BASE_URL/menus/$MENU_ID" \
            -H "Authorization: Bearer $TOKEN" \
            2>/dev/null)
        
        HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            pass "Get menu successful"
        else
            fail "Get menu failed (HTTP $HTTP_CODE)"
        fi
        
        # Update Menu
        UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" \
            -X PUT "$BASE_URL/menus/$MENU_ID" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"name":"Test Menu Updated","price":20000}' \
            2>/dev/null)
        
        HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            pass "Update menu successful"
        else
            fail "Update menu failed (HTTP $HTTP_CODE)"
        fi
        
        # Delete Menu
        DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" \
            -X DELETE "$BASE_URL/menus/$MENU_ID" \
            -H "Authorization: Bearer $TOKEN" \
            2>/dev/null)
        
        HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
        
        if [ "$HTTP_CODE" = "204" ]; then
            pass "Delete menu successful"
        else
            fail "Delete menu failed (HTTP $HTTP_CODE)"
        fi
    fi
else
    fail "Skipping Menu CRUD - no token"
fi

# ============================================
# Test 4: Public API
# ============================================
echo ""
echo "4. Public API (QR Menu)"
echo "-------------------------------------------"

if [ -n "$RESTAURANT_ID" ]; then
    # Get Public Menu
    PUBLIC_MENU_RESPONSE=$(curl -s -w "\n%{http_code}" \
        "$BASE_URL/public/menu/$RESTAURANT_ID" \
        2>/dev/null)
    
    HTTP_CODE=$(echo "$PUBLIC_MENU_RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        pass "Public menu accessible"
    else
        fail "Public menu failed (HTTP $HTTP_CODE)"
    fi
    
    # Create Public Order
    PUBLIC_ORDER_RESPONSE=$(curl -s -w "\n%{http_code}" \
        -X POST "$BASE_URL/public/orders" \
        -H "Content-Type: application/json" \
        -d "{\"restaurant_id\":\"$RESTAURANT_ID\",\"table_number\":1,\"items\":[{\"menu_id\":\"test-menu-id\",\"quantity\":1}]}" \
        2>/dev/null)
    
    HTTP_CODE=$(echo "$PUBLIC_ORDER_RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "422" ]; then
        pass "Public order endpoint accessible"
    else
        fail "Public order failed (HTTP $HTTP_CODE)"
    fi
else
    fail "Skipping Public API - no restaurant_id"
fi

# ============================================
# Test 5: Frontend Build
# ============================================
echo ""
echo "5. Frontend Build"
echo "-------------------------------------------"

if [ -f "package.json" ]; then
    echo "  Checking Node.js..."
    NODE_VERSION=$(node --version 2>/dev/null || echo "not found")
    
    if [ "$NODE_VERSION" != "not found" ]; then
        pass "Node.js installed ($NODE_VERSION)"
        
        echo "  Installing dependencies..."
        npm install --silent 2>/dev/null
        
        echo "  Building frontend..."
        if npm run build --silent 2>/dev/null; then
            pass "Frontend build successful"
        else
            fail "Frontend build failed"
        fi
    else
        fail "Node.js not installed"
    fi
else
    fail "package.json not found"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "=========================================="
echo "   Test Results"
echo "=========================================="
echo ""
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the errors above.${NC}"
    exit 1
fi
