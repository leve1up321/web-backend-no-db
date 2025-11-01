#!/usr/bin/env node

/**
 * Test webhook script for Ziina payment system (Node.js)
 * This script tests the webhook endpoint with proper HMAC signature
 */

import crypto from 'crypto'
import fetch from 'node-fetch'

// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook'
const WEBHOOK_SECRET = process.env.ZIINA_WEBHOOK_SECRET || 'your-webhook-secret-here'

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function generateHmacSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')
}

async function testWebhook() {
  log('🧪 Testing Ziina Webhook Endpoint', 'yellow')
  console.log(`URL: ${WEBHOOK_URL}`)
  console.log(`Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`)
  console.log('')

  // Test payload
  const timestamp = new Date().toISOString()
  const payload = JSON.stringify({
    event_type: 'payment_intent.succeeded',
    data: {
      id: 'pi_test_123456789',
      amount: 100,
      currency: 'AED',
      status: 'succeeded',
      customer_email: 'test@example.com',
      customer_name: 'Test Customer',
      metadata: {
        productId: 'test-product',
        source: 'levelup-store',
        timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    },
    created_at: timestamp
  })

  log('📦 Test Payload:', 'yellow')
  console.log(JSON.stringify(JSON.parse(payload), null, 2))
  console.log('')

  // Generate HMAC signature
  const signature = generateHmacSignature(payload, WEBHOOK_SECRET)
  const fullSignature = `sha256=${signature}`

  log('🔐 Generated Signature:', 'yellow')
  console.log(fullSignature)
  console.log('')

  const tests = [
    {
      name: 'Valid webhook with correct signature',
      headers: {
        'Content-Type': 'application/json',
        'x-ziina-signature': fullSignature
      },
      body: payload,
      expectedStatus: 200
    },
    {
      name: 'Invalid signature',
      headers: {
        'Content-Type': 'application/json',
        'x-ziina-signature': 'sha256=invalid_signature_here'
      },
      body: payload,
      expectedStatus: 401
    },
    {
      name: 'Missing signature header',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload,
      expectedStatus: 401
    },
    {
      name: 'Payment failed event',
      headers: {
        'Content-Type': 'application/json',
        'x-ziina-signature': (() => {
          const failedPayload = JSON.stringify({
            event_type: 'payment_intent.payment_failed',
            data: {
              id: 'pi_test_failed_123',
              amount: 50,
              currency: 'AED',
              status: 'failed',
              customer_email: 'failed@example.com',
              customer_name: 'Failed Customer',
              failure_reason: 'insufficient_funds',
              created_at: timestamp,
              updated_at: timestamp
            },
            created_at: timestamp
          })
          return `sha256=${generateHmacSignature(failedPayload, WEBHOOK_SECRET)}`
        })()
      },
      body: JSON.stringify({
        event_type: 'payment_intent.payment_failed',
        data: {
          id: 'pi_test_failed_123',
          amount: 50,
          currency: 'AED',
          status: 'failed',
          customer_email: 'failed@example.com',
          customer_name: 'Failed Customer',
          failure_reason: 'insufficient_funds',
          created_at: timestamp,
          updated_at: timestamp
        },
        created_at: timestamp
      }),
      expectedStatus: 200
    }
  ]

  let passedTests = 0
  let totalTests = tests.length

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    log(`🧪 Test ${i + 1}: ${test.name}`, 'yellow')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: test.headers,
        body: test.body
      })

      const responseText = await response.text()
      let responseJson
      try {
        responseJson = JSON.parse(responseText)
      } catch {
        responseJson = { raw: responseText }
      }

      if (response.status === test.expectedStatus) {
        log(`✅ Test ${i + 1} PASSED`, 'green')
        passedTests++
      } else {
        log(`❌ Test ${i + 1} FAILED`, 'red')
        console.log(`Expected status: ${test.expectedStatus}, Got: ${response.status}`)
      }

      console.log(`Response: ${JSON.stringify(responseJson, null, 2)}`)

    } catch (error) {
      log(`❌ Test ${i + 1} FAILED (Network Error)`, 'red')
      console.log(`Error: ${error.message}`)
    }

    console.log('')
  }

  log('🏁 Webhook testing completed!', 'yellow')
  log(`Results: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'red')
  console.log('')
  
  log('💡 Tips:', 'yellow')
  console.log('- Make sure your webhook secret is set correctly')
  console.log('- Check server logs for detailed error messages')
  console.log('- Verify your database connection if tests fail')
  console.log('- Test with production Ziina IPs in production environment')
  console.log('')
  
  log('Usage:', 'yellow')
  console.log('WEBHOOK_URL=https://your-domain.vercel.app/api/webhook npm run test')
  console.log('ZIINA_WEBHOOK_SECRET=your-secret node scripts/test-webhook.js')

  process.exit(passedTests === totalTests ? 0 : 1)
}

// Run tests
testWebhook().catch(error => {
  log(`Fatal error: ${error.message}`, 'red')
  process.exit(1)
})

