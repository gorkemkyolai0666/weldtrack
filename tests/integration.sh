#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4590/api}"
PASSED=0
FAILED=0
TOTAL=0

test_endpoint() {
  local method="$1"
  local url="$2"
  local expected_status="$3"
  local description="$4"
  local data="$5"
  local auth_header="$6"

  TOTAL=$((TOTAL + 1))

  local curl_args=(-s -o /tmp/response_body -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json")
  
  if [ -n "$auth_header" ]; then
    curl_args+=(-H "Authorization: Bearer $auth_header")
  fi
  
  if [ -n "$data" ]; then
    curl_args+=(-d "$data")
  fi

  local status_code
  status_code=$(curl "${curl_args[@]}")

  if [ "$status_code" = "$expected_status" ]; then
    echo "PASS [$status_code] $description"
    PASSED=$((PASSED + 1))
  else
    echo "FAIL [$status_code expected $expected_status] $description"
    FAILED=$((FAILED + 1))
  fi
}

echo "======================================"
echo "WeldTrack Integration Tests"
echo "API: $API_URL"
echo "======================================"

# Health check
test_endpoint "GET" "$API_URL/health" "200" "GET /api/health"

# Auth: Register
test_endpoint "POST" "$API_URL/auth/register" "201" "POST /api/auth/register (new user)" \
  '{"email":"test-integration@test.com","password":"testpass123","name":"Test User"}'

# Auth: Login
test_endpoint "POST" "$API_URL/auth/login" "200" "POST /api/auth/login (valid credentials)" \
  '{"email":"demo@kaynakatolyesi.com.tr","password":"demo123456"}'

# Get token for authenticated requests
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@kaynakatolyesi.com.tr","password":"demo123456"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "WARN: Could not obtain auth token, skipping authenticated tests"
else
  # Auth: Profile
  test_endpoint "GET" "$API_URL/auth/profile" "200" "GET /api/auth/profile" "" "$TOKEN"

  # Dashboard
  test_endpoint "GET" "$API_URL/dashboard" "200" "GET /api/dashboard" "" "$TOKEN"

  # Customers CRUD
  test_endpoint "GET" "$API_URL/customers" "200" "GET /api/customers" "" "$TOKEN"

  test_endpoint "POST" "$API_URL/customers" "201" "POST /api/customers (create)" \
    '{"companyName":"Test Firma","contactName":"Test Kişi","phone":"0555 123 4567"}' "$TOKEN"

  # Workers CRUD
  test_endpoint "GET" "$API_URL/workers" "200" "GET /api/workers" "" "$TOKEN"

  test_endpoint "POST" "$API_URL/workers" "201" "POST /api/workers (create)" \
    '{"name":"Test Usta","specialization":"MIG Kaynak","dailyRate":1500}' "$TOKEN"

  # Materials CRUD
  test_endpoint "GET" "$API_URL/materials" "200" "GET /api/materials" "" "$TOKEN"

  test_endpoint "POST" "$API_URL/materials" "201" "POST /api/materials (create)" \
    '{"name":"Test Malzeme","category":"STEEL","unit":"kg","unitPrice":25}' "$TOKEN"

  test_endpoint "GET" "$API_URL/materials/low-stock" "200" "GET /api/materials/low-stock" "" "$TOKEN"

  # Work Orders CRUD
  test_endpoint "GET" "$API_URL/work-orders" "200" "GET /api/work-orders" "" "$TOKEN"

  # Get a customer id for work order creation
  CUSTOMER_ID=$(curl -s -X GET "$API_URL/customers" -H "Authorization: Bearer $TOKEN" | \
    python3 -c "import sys,json; data=json.load(sys.stdin); print(data[0]['id'] if data else '')" 2>/dev/null || echo "")

  if [ -n "$CUSTOMER_ID" ]; then
    test_endpoint "POST" "$API_URL/work-orders" "201" "POST /api/work-orders (create)" \
      "{\"title\":\"Test İş Emri\",\"customerId\":\"$CUSTOMER_ID\",\"priority\":\"MEDIUM\"}" "$TOKEN"
  fi

  # Invoices CRUD
  test_endpoint "GET" "$API_URL/invoices" "200" "GET /api/invoices" "" "$TOKEN"

  # Users
  test_endpoint "GET" "$API_URL/users" "200" "GET /api/users" "" "$TOKEN"

  # Auth: Login with wrong credentials
  test_endpoint "POST" "$API_URL/auth/login" "401" "POST /api/auth/login (wrong password)" \
    '{"email":"demo@kaynakatolyesi.com.tr","password":"wrongpassword"}'
fi

echo "======================================"
echo "Results: $PASSED passed, $FAILED failed out of $TOTAL"
echo "======================================"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
