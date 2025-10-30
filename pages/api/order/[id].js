import { findOrder } from '@/lib/database';

export default async function handler(req, res) {
  // قبول GET requests فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // التحقق من وجود معرف الطلب
    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // البحث عن الطلب
    const result = await findOrder({ id });
    
    if (!result.success) {
      return res.status(404).json({ 
        error: 'Order not found',
        details: result.error 
      });
    }

    // إرجاع تفاصيل الطلب (بدون معلومات حساسة)
    const order = {
      id: result.order.id,
      orderNumber: result.order.orderNumber,
      productName: result.order.productName,
      amount: result.order.amount,
      currency: result.order.currency,
      status: result.order.status,
      downloadLink: result.order.downloadLink,
      downloadCount: result.order.downloadCount,
      createdAt: result.order.createdAt,
      paidAt: result.order.paidAt,
      expiresAt: result.order.expiresAt
    };

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
