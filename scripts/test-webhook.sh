#!/bin/bash

# Test webhook script for Ziina payment system
# This script tests the webhook endpoint with proper HMAC signature

set -e

# Configuration
WEBHOOK_URL="${WEBHOOK_URL:-http://localhost:3000/api/webhook}"
WEBHOOK_SECRET="${ZIINA_WEBHOOK_SECRET:-your-webhook-secret-here}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Testing Ziina Webhook Endpoint${NC}"
echo "URL: $WEBHOOK_URL"
echo "Secret: ${WEBHOOK_SECRET:0:10}..."
echo ""

# Test payload
PAYLOAD='{
  "event_type": "payment_intent.succeeded",
  "data": {
    "id": "pi_test_123456789",
    "amount": 100,
    "currency": "AED",
    "status": "succeeded",
    "customer_email": "test@example.com",
    "customer_name": "Test Customer",
    "metadata": {
      "productId": "test-product",
      "source": "levelup-store",
      "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
    },
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "updated_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  },
  "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
}'

echo -e "${YELLOW}📦 Test Payload:${NC}"
echo "$PAYLOAD" | jq .
echo ""

# Generate HMAC signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)
FULL_SIGNATURE="sha256=$SIGNATURE"

echo -e "${YELLOW}🔐 Generated Signature:${NC}"
echo "$FULL_SIGNATURE"
echo ""

# Test 1: Valid webhook
echo -e "${YELLOW}🧪 Test 1: Valid webhook with correct signature${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "x-ziina-signature: $FULL_SIGNATURE" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Test 1 PASSED${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}❌ Test 1 FAILED${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 2: Invalid signature
echo -e "${YELLOW}🧪 Test 2: Invalid signature${NC}"
INVALID_SIGNATURE="sha256=invalid_signature_here"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "x-ziina-signature: $INVALID_SIGNATURE" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✅ Test 2 PASSED (correctly rejected invalid signature)${NC}"
else
  echo -e "${RED}❌ Test 2 FAILED (should reject invalid signature)${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 3: Missing signature
echo -e "${YELLOW}🧪 Test 3: Missing signature header${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✅ Test 3 PASSED (correctly rejected missing signature)${NC}"
else
  echo -e "${RED}❌ Test 3 FAILED (should reject missing signature)${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 4: Payment failed event
echo -e "${YELLOW}🧪 Test 4: Payment failed event${NC}"
FAILED_PAYLOAD='{
  "event_type": "payment_intent.payment_failed",
  "data": {
    "id": "pi_test_failed_123",
    "amount": 50,
    "currency": "AED",
    "status": "failed",
    "customer_email": "failed@example.com",
    "customer_name": "Failed Customer",
    "failure_reason": "insufficient_funds",
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "updated_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  },
  "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
}'

FAILED_SIGNATURE=$(echo -n "$FAILED_PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)
FAILED_FULL_SIGNATURE="sha256=$FAILED_SIGNATURE"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "x-ziina-signature: $FAILED_FULL_SIGNATURE" \
  -d "$FAILED_PAYLOAD" \
  "$WEBHOOK_URL")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Test 4 PASSED${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}❌ Test 4 FAILED${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

echo -e "${YELLOW}🏁 Webhook testing completed!${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "- Make sure your webhook secret is set correctly"
echo "- Check server logs for detailed error messages"
echo "- Verify your database connection if tests fail"
echo "- Test with production Ziina IPs in production environment"

