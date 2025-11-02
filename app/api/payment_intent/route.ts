import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/ziina'
import { createOrder } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      totalAmount,
      items,
      productId,
      productName,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress
    } = body

    // Validate required fields
    if (!customerName || !customerEmail) {
      return NextResponse.json({
        success: false,
        error: 'Customer name and email are required'
      }, { status: 400 })
    }

    // Use totalAmount for cart or amount for single product
    const finalAmount = totalAmount || amount
    const finalProductId = items ? `cart_${Date.now()}` : productId

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid amount is required'
      }, { status: 400 })
    }

    // Create description based on items or single product
    let description = 'منتج من متجر لفل اب'
    if (items && items.length > 0) {
      description = items
        .map((item: any) => `${item.title} x${item.quantity}`)
        .join(', ')
    } else if (productName) {
      description = productName
    }

    // Create payment intent with Ziina
    const paymentResult = await createPaymentIntent({
      amount: finalAmount,
      currency: 'AED',
      description,
      customerEmail,
      customerName,
      metadata: {
        productId: finalProductId,
        items: items ? JSON.stringify(items) : null,
        customerPhone: customerPhone || null,
        customerAddress: customerAddress || null,
        source: 'levelup-store',
        timestamp: new Date().toISOString()
      }
    })

    if (!paymentResult.success) {
      return NextResponse.json({
        success: false,
        error: paymentResult.error || 'Failed to create payment intent'
      }, { status: 400 })
    }

    // Create order record in database
    const orderData = {
      id: paymentResult.paymentIntent.id,
      orderNumber: `LU-${Date.now().toString().slice(-6)}`,
      productId: finalProductId,
      productName: items ? 'Multiple Items' : (productName || 'Unknown Product'),
      amount: finalAmount,
      currency: 'AED',
      customerEmail,
      customerName,
      status: 'pending',
      paymentIntentId: paymentResult.paymentIntent.id,
      items: items || null,
      customerPhone: customerPhone || null,
      customerAddress: customerAddress || null
    }

    const orderResult = await createOrder(orderData)
    
    if (!orderResult.success) {
      console.error('Failed to create order:', orderResult.error)
      // Continue anyway, as payment intent was created successfully
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentIntent.payment_url,
      paymentIntentId: paymentResult.paymentIntent.id,
      orderId: paymentResult.paymentIntent.id
    })

  } catch (error) {
    console.error('Error in payment_intent:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}

