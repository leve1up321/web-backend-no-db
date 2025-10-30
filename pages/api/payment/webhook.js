const ZiinaPaymentGateway = require('../../../src/lib/ziina');

/**
 * API Route لاستقبال webhooks من زينة
 * Receive webhooks from Ziina
 * 
 * Method: POST
 * Headers: {
 *   'x-ziina-signature': 'sha256=...'
 * }
 * Body: {
 *   event: string,
 *   data: {
 *     id: string,
 *     status: string,
 *     amount: number,
 *     ...
 *   }
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

    // الحصول على التوقيع من headers
    const signature = req.headers['x-ziina-signature'] || req.headers['x-signature'];
    
    if (!signature) {
      console.warn('Webhook received without signature');
      return res.status(400).json({
        success: false,
        error: 'Missing webhook signature'
      });
    }

    // تحويل body إلى string للتحقق من التوقيع
    const payload = JSON.stringify(req.body);

    console.log('Webhook received:', {
      signature: signature.substring(0, 20) + '...',
      event: req.body?.event,
      payment_id: req.body?.data?.id,
      status: req.body?.data?.status
    });

    // معالجة الـ webhook
    const result = await ziina.processWebhook(payload, signature);

    // يمكن إضافة منطق إضافي هنا حسب نوع الحدث
    const { event, payment_data } = result;
    
    switch (event) {
      case 'payment.completed':
        console.log('✅ Payment completed:', payment_data?.id);
        // يمكن إضافة منطق تحديث قاعدة البيانات هنا
        // مثل: await updateOrderStatus(payment_data.order_id, 'paid');
        break;
        
      case 'payment.failed':
        console.log('❌ Payment failed:', payment_data?.id);
        // يمكن إضافة منطق معالجة الفشل هنا
        // مثل: await updateOrderStatus(payment_data.order_id, 'failed');
        break;
        
      case 'payment.cancelled':
        console.log('🚫 Payment cancelled:', payment_data?.id);
        // يمكن إضافة منطق معالجة الإلغاء هنا
        // مثل: await updateOrderStatus(payment_data.order_id, 'cancelled');
        break;
        
      default:
        console.log('ℹ️ Unhandled webhook event:', event);
    }

    // إرجاع تأكيد الاستلام
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      event: event,
      payment_id: payment_data?.id
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // إرجاع خطأ مفصل
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process webhook',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// تكوين Next.js لمعالجة raw body (مطلوب للتحقق من التوقيع)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
