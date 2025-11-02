# Test webhook script for Ziina payment system (PowerShell)
# This script tests the webhook endpoint with proper HMAC signature

param(
    [string]$WebhookUrl = "http://localhost:3000/api/webhook",
    [string]$WebhookSecret = $env:ZIINA_WEBHOOK_SECRET
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

Write-Host "🧪 Testing Ziina Webhook Endpoint" -ForegroundColor $Yellow
Write-Host "URL: $WebhookUrl"
Write-Host "Secret: $($WebhookSecret.Substring(0, [Math]::Min(10, $WebhookSecret.Length)))..."
Write-Host ""

if (-not $WebhookSecret) {
    Write-Host "❌ ZIINA_WEBHOOK_SECRET environment variable not set!" -ForegroundColor $Red
    Write-Host "Please set it with: `$env:ZIINA_WEBHOOK_SECRET = 'your-secret-here'" -ForegroundColor $Yellow
    exit 1
}

# Function to generate HMAC-SHA256 signature
function Get-HmacSha256 {
    param(
        [string]$Message,
        [string]$Secret
    )
    
    $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha.Key = [Text.Encoding]::UTF8.GetBytes($Secret)
    $signature = $hmacsha.ComputeHash([Text.Encoding]::UTF8.GetBytes($Message))
    $signatureHex = [System.BitConverter]::ToString($signature) -replace '-', ''
    return $signatureHex.ToLower()
}

# Test payload
$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$payload = @{
    event_type = "payment_intent.succeeded"
    data = @{
        id = "pi_test_123456789"
        amount = 100
        currency = "AED"
        status = "succeeded"
        customer_email = "test@example.com"
        customer_name = "Test Customer"
        metadata = @{
            productId = "test-product"
            source = "levelup-store"
            timestamp = $timestamp
        }
        created_at = $timestamp
        updated_at = $timestamp
    }
    created_at = $timestamp
} | ConvertTo-Json -Depth 10

Write-Host "📦 Test Payload:" -ForegroundColor $Yellow
Write-Host $payload
Write-Host ""

# Generate HMAC signature
$signature = Get-HmacSha256 -Message $payload -Secret $WebhookSecret
$fullSignature = "sha256=$signature"

Write-Host "🔐 Generated Signature:" -ForegroundColor $Yellow
Write-Host $fullSignature
Write-Host ""

# Test 1: Valid webhook
Write-Host "🧪 Test 1: Valid webhook with correct signature" -ForegroundColor $Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-ziina-signature" = $fullSignature
    }
    
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $payload -Headers $headers -ErrorAction Stop
    Write-Host "✅ Test 1 PASSED" -ForegroundColor $Green
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.Exception.Response | ConvertFrom-Json -ErrorAction SilentlyContinue
    
    if ($statusCode -eq 200) {
        Write-Host "✅ Test 1 PASSED" -ForegroundColor $Green
    } else {
        Write-Host "❌ Test 1 FAILED" -ForegroundColor $Red
        Write-Host "HTTP Code: $statusCode"
        Write-Host "Error: $($_.Exception.Message)"
        if ($errorBody) {
            Write-Host "Response: $($errorBody | ConvertTo-Json)"
        }
    }
}
Write-Host ""

# Test 2: Invalid signature
Write-Host "🧪 Test 2: Invalid signature" -ForegroundColor $Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-ziina-signature" = "sha256=invalid_signature_here"
    }
    
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $payload -Headers $headers -ErrorAction Stop
    Write-Host "❌ Test 2 FAILED (should reject invalid signature)" -ForegroundColor $Red
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "✅ Test 2 PASSED (correctly rejected invalid signature)" -ForegroundColor $Green
    } else {
        Write-Host "❌ Test 2 FAILED (wrong status code: $statusCode)" -ForegroundColor $Red
        Write-Host "Error: $($_.Exception.Message)"
    }
}
Write-Host ""

# Test 3: Missing signature
Write-Host "🧪 Test 3: Missing signature header" -ForegroundColor $Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $payload -Headers $headers -ErrorAction Stop
    Write-Host "❌ Test 3 FAILED (should reject missing signature)" -ForegroundColor $Red
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "✅ Test 3 PASSED (correctly rejected missing signature)" -ForegroundColor $Green
    } else {
        Write-Host "❌ Test 3 FAILED (wrong status code: $statusCode)" -ForegroundColor $Red
        Write-Host "Error: $($_.Exception.Message)"
    }
}
Write-Host ""

# Test 4: Payment failed event
Write-Host "🧪 Test 4: Payment failed event" -ForegroundColor $Yellow
$failedPayload = @{
    event_type = "payment_intent.payment_failed"
    data = @{
        id = "pi_test_failed_123"
        amount = 50
        currency = "AED"
        status = "failed"
        customer_email = "failed@example.com"
        customer_name = "Failed Customer"
        failure_reason = "insufficient_funds"
        created_at = $timestamp
        updated_at = $timestamp
    }
    created_at = $timestamp
} | ConvertTo-Json -Depth 10

$failedSignature = Get-HmacSha256 -Message $failedPayload -Secret $WebhookSecret
$failedFullSignature = "sha256=$failedSignature"

try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-ziina-signature" = $failedFullSignature
    }
    
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $failedPayload -Headers $headers -ErrorAction Stop
    Write-Host "✅ Test 4 PASSED" -ForegroundColor $Green
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 200) {
        Write-Host "✅ Test 4 PASSED" -ForegroundColor $Green
    } else {
        Write-Host "❌ Test 4 FAILED" -ForegroundColor $Red
        Write-Host "HTTP Code: $statusCode"
        Write-Host "Error: $($_.Exception.Message)"
    }
}
Write-Host ""

Write-Host "🏁 Webhook testing completed!" -ForegroundColor $Yellow
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor $Yellow
Write-Host "- Make sure your webhook secret is set correctly"
Write-Host "- Check server logs for detailed error messages"
Write-Host "- Verify your database connection if tests fail"
Write-Host "- Test with production Ziina IPs in production environment"
Write-Host ""
Write-Host "To run this script:" -ForegroundColor $Yellow
Write-Host ".\scripts\test-webhook-windows.ps1 -WebhookUrl 'https://your-domain.vercel.app/api/webhook'"

