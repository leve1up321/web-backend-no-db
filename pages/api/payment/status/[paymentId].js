const ZiinaPaymentGateway = require('../../../../src/lib/ziina');

/**
 * API Route للتحقق من حالة الدفعة
 * Check payment status
 * 
 * Method: GET
 * URL: /api/payment/status/[paymentId]
 * 
 * Response: {
 *   success: boolean,
 *   data: {
 *     id: string,
 *     status: string,
 *     amount: number,
 *     currency: string,
 *     ...
 *   }
 * }
 */
export default async function handler(req, res) {
  // السماح فقط بـ GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    // الحصول على payment ID من URL
    const { paymentId } = req.query;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }

    // إنشاء instance من مكتبة زينة
    const ziina = new ZiinaPaymentGateway();

    console.log('Checking payment status for ID:', paymentId);

    // التحقق من حالة الدفعة
    const paymentStatus = await ziina.getPaymentStatus(paymentId);

    // إرجاع النتيجة
    res.status(200).json({
      success: true,
      message: 'Payment status retrieved successfully',
      data: paymentStatus
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    
    // إرجاع خطأ مفصل
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get payment status',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
