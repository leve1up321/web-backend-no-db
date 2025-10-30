// API Route لإنشاء Payment Intent مع Ziina
export default async function handler(req, res) {
  // التأكد من أن الطلب POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      amount, 
      totalAmount,
      currency = 'AED', 
      productId, 
      items,
      customerEmail, 
      customerName,
      customerPhone,
      customerAddress
    } = req.body;

    // التحقق من البيانات المطلوبة
    const finalAmount = totalAmount || amount;
    const finalProductId = items ? `cart_${Date.now()}` : productId;
    
    if (!finalAmount || !customerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount/totalAmount, customerEmail' 
      });
    }

    // إنشاء وصف المنتجات
    let description = 'منتج من متجر لفل اب';
    if (items && items.length > 0) {
      description = items.map(item => `${item.title} x${item.quantity}`).join(', ');
    }

    // إنشاء Payment Intent مع Ziina
    const paymentIntentData = {
      amount: Math.round(finalAmount * 100), // تحويل إلى فلوس (cents)
      currency,
      customer: {
        email: customerEmail,
        name: customerName || 'عميل متجر لفل اب'
      },
      metadata: {
        productId: finalProductId,
        items: items ? JSON.stringify(items) : null,
        customerPhone: customerPhone || null,
        customerAddress: customerAddress || null,
        source: 'levelup-store',
        timestamp: new Date().toISOString()
      },
      description,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      test: process.env.NODE_ENV !== 'production' // وضع التجربة في التطوير
    };

    // استدعاء Ziina API
    const response = await fetch('https://api.ziina.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ZIINA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentIntentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ziina API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create payment intent',
        details: errorData 
      });
    }

    const paymentIntent = await response.json();

    // حفظ معلومات الطلب في قاعدة البيانات
    const { createOrder, upsertCustomer } = await import('@/lib/database');
    
    const orderData = {
      id: paymentIntent.id,
      productId,
      amount,
      currency,
      customerEmail,
      customerName,
      status: 'pending',
      paymentIntentId: paymentIntent.id
    };

    // حفظ الطلب
    const orderResult = await createOrder(orderData);
    if (!orderResult.success) {
      console.error('Failed to save order:', orderResult.error);
    }

    // حفظ/تحديث بيانات العميل
    const customerResult = await upsertCustomer({
      email: customerEmail,
      name: customerName,
      amount: 0 // سيتم تحديثه عند اكتمال الدفع
    });
    
    console.log('Order created:', orderResult.success ? orderResult.order.orderNumber : 'Failed');

    // إرجاع رابط الدفع
    res.status(200).json({
      success: true,
      paymentUrl: paymentIntent.url,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
