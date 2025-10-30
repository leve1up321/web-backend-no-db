const ZiinaPaymentGateway = require('../../../src/lib/ziina');

/**
 * API Route لإنشاء دفعة جديدة عبر زينة
 * Create new payment via Ziina
 * 
 * Method: POST
 * Body: {
 *   amount: number,
 *   currency?: string,
 *   description: string,
 *   order_id: string,
 *   customer_email?: string,
 *   customer_name?: string,
 *   items?: array
 * }
 */
export default async function handler(req, res) {
  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // إنشاء instance من مكتبة زينة
    const ziina = new ZiinaPaymentGateway();

    // استخراج البيانات من الطلب
    const {
      amount,
      currency = 'AED',
      description,
      order_id,
      customer_email,
      customer_name,
      items = []
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!amount || !description || !order_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, description, order_id'
      });
    }

    // إنشاء URLs للنجاح والإلغاء
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const success_url = `${baseUrl}/payment/success?order_id=${order_id}`;
    const cancel_url = `${baseUrl}/payment/cancel?order_id=${order_id}`;
    const webhook_url = `${baseUrl}/api/payment/webhook`;

    // إعداد بيانات الدفعة
    const paymentData = {
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      description,
      order_id,
      customer_email: customer_email || 'customer@levelup.com',
      customer_name: customer_name || 'عميل Level Up',
      success_url,
      cancel_url,
      webhook_url
    };

    console.log('Creating payment with data:', {
      ...paymentData,
      amount: `${amount} ${currency}`
    });

    // إنشاء الدفعة عبر زينة
    const paymentResult = await ziina.createPayment(paymentData);

    // إرجاع النتيجة
    res.status(200).json({
      success: true,
      message: 'Payment created successfully',
      data: paymentResult
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    
    // إرجاع خطأ مفصل
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// تكوين Next.js لمعالجة body parsing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
