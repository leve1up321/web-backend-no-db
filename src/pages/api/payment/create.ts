import { NextApiRequest, NextApiResponse } from 'next';
import { ziinaGateway, ZiinaPaymentRequest } from '@/lib/ziina';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
      currency = 'AED',
      description,
      customer_email,
      customer_name,
      order_id,
      items
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!amount || !description || !order_id) {
      return res.status(400).json({
        error: 'Missing required fields: amount, description, order_id'
      });
    }

    // إنشاء روابط إعادة التوجيه
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const success_url = `${baseUrl}/payment/success?order_id=${order_id}`;
    const cancel_url = `${baseUrl}/payment/cancel?order_id=${order_id}`;
    const webhook_url = `${baseUrl}/api/payment/webhook`;

    // إعداد بيانات الدفع
    const paymentData: ZiinaPaymentRequest = {
      amount: parseFloat(amount),
      currency,
      description,
      customer_email,
      customer_name,
      order_id,
      success_url,
      cancel_url,
      webhook_url,
    };

    // إنشاء الدفعة عبر Ziina
    const payment = await ziinaGateway.createPayment(paymentData);

    // حفظ بيانات الطلب في localStorage أو قاعدة البيانات
    // يمكن إضافة هذا لاحقاً حسب الحاجة

    res.status(200).json({
      success: true,
      payment_id: payment.id,
      payment_url: payment.payment_url,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
