import { NextRequest, NextResponse } from 'next/server'
import ziinaGateway from '@/lib/ziina'
import { updateOrder, findOrder } from '@/lib/database'
import { sendOrderConfirmationEmail } from '@/lib/email'
import crypto from 'crypto'

// Ziina webhook IP whitelist
const ZIINA_IPS = ['3.29.184.186', '3.29.190.95', '20.233.47.127']

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-vercel-forwarded-for')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (remoteAddr) {
    return remoteAddr.split(',')[0].trim()
  }
  return 'unknown'
}

function verifyHMAC(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')
    
    const providedSignature = signature.replace('sha256=', '')
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )
  } catch (error) {
    console.error('HMAC verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID().slice(0, 8)
  
  console.log(`[${requestId}] Webhook received at ${new Date().toISOString()}`)
  
  try {
    // IP whitelist check
    const clientIP = getClientIP(request)
    console.log(`[${requestId}] Client IP: ${clientIP}`)
    
    if (process.env.NODE_ENV === 'production' && !ZIINA_IPS.includes(clientIP)) {
      console.error(`[${requestId}] Unauthorized IP: ${clientIP}`)
      return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 })
    }

    // Get raw body for HMAC verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-ziina-signature')
    
    if (!signature) {
      console.error(`[${requestId}] Missing signature header`)
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Verify HMAC signature
    const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error(`[${requestId}] Missing webhook secret`)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const isValidSignature = verifyHMAC(rawBody, signature, webhookSecret)
    if (!isValidSignature) {
      console.error(`[${requestId}] Invalid HMAC signature`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    console.log(`[${requestId}] Signature verified successfully`)

    // Parse the JSON body
    let body
    try {
      body = JSON.parse(rawBody)
    } catch (error) {
      console.error(`[${requestId}] Invalid JSON payload:`, error)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { event_type, data } = body
    console.log(`[${requestId}] Event: ${event_type}, Payment ID: ${data?.id}`)

    // Idempotency check - prevent duplicate processing
    const idempotencyKey = `${event_type}_${data?.id}_${data?.updated_at || Date.now()}`
    
    if (event_type === 'payment_intent.succeeded') {
      const paymentIntent = data
      
      try {
        // Find the order
        const orderResult = await findOrder({ id: paymentIntent.id })
        if (!orderResult.success) {
          console.error(`[${requestId}] Order not found: ${paymentIntent.id}`)
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        const order = orderResult.order

        // Check if already processed (idempotency)
        if (order.status === 'completed') {
          console.log(`[${requestId}] Order already processed: ${order.orderNumber}`)
          return NextResponse.json({ success: true, message: 'Already processed' })
        }

        // Update order status
        const updateResult = await updateOrder(paymentIntent.id, {
          status: 'completed',
          paidAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          idempotencyKey
        })

        if (!updateResult.success) {
          console.error(`[${requestId}] Failed to update order:`, updateResult.error)
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
        }

        // Parse items if it's a cart order
        let items = null
        if (paymentIntent.metadata?.items) {
          try {
            items = JSON.parse(paymentIntent.metadata.items)
          } catch (e) {
            console.error(`[${requestId}] Failed to parse items:`, e)
          }
        }

        // Send confirmation email (non-blocking)
        try {
          const emailResult = await sendOrderConfirmationEmail({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderId: order.id,
            orderNumber: order.orderNumber,
            productName: order.productName,
            items: items,
            amount: order.amount,
            currency: order.currency,
            downloadLink: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?orderId=${order.id}`
          })

          if (!emailResult.success) {
            console.error(`[${requestId}] Failed to send confirmation email:`, emailResult.error)
            // Don't fail the webhook for email issues
          } else {
            console.log(`[${requestId}] Confirmation email sent successfully`)
          }
        } catch (emailError) {
          console.error(`[${requestId}] Email error (non-blocking):`, emailError)
        }

        const processingTime = Date.now() - startTime
        console.log(`[${requestId}] ✅ Payment processed successfully: ${order.orderNumber} (${processingTime}ms)`)
        
        return NextResponse.json({ 
          success: true, 
          orderId: order.id,
          orderNumber: order.orderNumber,
          processingTime 
        })

      } catch (error) {
        console.error(`[${requestId}] Error processing payment success:`, error)
        return NextResponse.json({ error: 'Processing error' }, { status: 500 })
      }
    }

    if (event_type === 'payment_intent.payment_failed') {
      const paymentIntent = data
      
      try {
        // Update order status to failed
        const updateResult = await updateOrder(paymentIntent.id, {
          status: 'failed',
          failedAt: new Date().toISOString(),
          idempotencyKey
        })

        if (!updateResult.success) {
          console.error(`[${requestId}] Failed to update failed order:`, updateResult.error)
        }

        const processingTime = Date.now() - startTime
        console.log(`[${requestId}] ❌ Payment failed: ${paymentIntent.id} (${processingTime}ms)`)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Payment failure recorded',
          processingTime 
        })

      } catch (error) {
        console.error(`[${requestId}] Error processing payment failure:`, error)
        return NextResponse.json({ error: 'Processing error' }, { status: 500 })
      }
    }

    // Handle other event types
    const processingTime = Date.now() - startTime
    console.log(`[${requestId}] Unhandled webhook event: ${event_type} (${processingTime}ms)`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event received but not processed',
      eventType: event_type,
      processingTime 
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`[${requestId}] Webhook error (${processingTime}ms):`, error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      requestId,
      processingTime 
    }, { status: 500 })
  }
}
