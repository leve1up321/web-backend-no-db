// API endpoint لإنشاء Payment Intent مع Ziina
export default async function handler(req, res) {
  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'يُسمح فقط بـ POST requests' 
    });
  }

  try {
    const { productName, amount, customerEmail } = req.body;

    // التحقق من البيانات المطلوبة
    if (!productName || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'اسم المنتج والمبلغ مطلوبان'
      });
    }

    // التحقق من أن المبلغ رقم صحيح
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'المبلغ يجب أن يكون رقماً موجباً'
      });
    }

    // الحصول على مفتاح API من متغيرات البيئة
    const ziinaApiKey = process.env.ZIINA_SECRET_KEY;
    if (!ziinaApiKey) {
      console.error('ZIINA_SECRET_KEY not found in environment variables');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'خطأ في إعدادات الخادم'
      });
    }

    // إعداد URLs للنجاح والإلغاء
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://levelup-iota.vercel.app';
    
    const successUrl = `${baseUrl}/payment/success`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    // إنشاء Payment Intent مع Ziina
    const ziinaResponse = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ziinaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount), // التأكد من أن المبلغ عدد صحيح
        currency_code: 'AED',
        message: `شراء: ${productName}`,
        success_url: successUrl,
        cancel_url: cancelUrl,
        failure_url: cancelUrl,
        test: process.env.NODE_ENV !== 'production', // اختبار في التطوير فقط
        allow_tips: false,
        // إضافة metadata إذا كان متاحاً
        ...(customerEmail && { customer_email: customerEmail })
      })
    });

    if (!ziinaResponse.ok) {
      const errorData = await ziinaResponse.text();
      console.error('Ziina API Error:', errorData);
      
      return res.status(ziinaResponse.status).json({
        error: 'Payment service error',
        message: 'خطأ في خدمة الدفع، يرجى المحاولة مرة أخرى'
      });
    }

    const paymentIntent = await ziinaResponse.json();

    // التحقق من وجود redirect_url
    if (!paymentIntent.redirect_url) {
      console.error('No redirect_url in Ziina response:', paymentIntent);
      return res.status(500).json({
        error: 'Invalid payment response',
        message: 'خطأ في استجابة خدمة الدفع'
      });
    }

    // تسجيل العملية للمراقبة (اختياري)
    console.log('Payment Intent Created:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      product: productName,
      timestamp: new Date().toISOString()
    });

    // إرجاع رابط الدفع للعميل
    res.status(200).json({
      success: true,
      redirect_url: paymentIntent.redirect_url,
      payment_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency_code,
      message: 'تم إنشاء رابط الدفع بنجاح'
    });

  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'خطأ داخلي في الخادم، يرجى المحاولة مرة أخرى'
    });
  }
}
