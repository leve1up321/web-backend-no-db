import { createPaymentIntent } from '../lib/ziina.js';
import { createOrder } from '../lib/database.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and email are required'
      });
    }

    // Use totalAmount for cart or amount for single product
    const finalAmount = totalAmount || amount;
    const finalProductId = items ? `cart_${Date.now()}` : productId;

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    // Create description based on items or single product
    let description = 'منتج من متجر لفل اب';
    if (items && items.length > 0) {
      description = items
        .map(item => `${item.title} x${item.quantity}`)
        .join(', ');
    } else if (productName) {
      description = productName;
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
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: paymentResult.error || 'Failed to create payment intent'
      });
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
    };

    const orderResult = await createOrder(orderData);
    
    if (!orderResult.success) {
      console.error('Failed to create order:', orderResult.error);
      // Continue anyway, as payment intent was created successfully
    }

    return res.status(200).json({
      success: true,
      paymentUrl: paymentResult.paymentIntent.payment_url,
      paymentIntentId: paymentResult.paymentIntent.id,
      orderId: paymentResult.paymentIntent.id
    });

  } catch (error) {
    console.error('Error in payment_intent:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
