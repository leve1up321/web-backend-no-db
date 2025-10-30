import { NextApiRequest, NextApiResponse } from 'next';
import { ziinaGateway } from '@/lib/ziina';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // الحصول على البيانات والتوقيع
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-ziina-signature'] as string;

    if (!signature) {
      console.error('Missing Ziina signature header');
      return res.status(400).json({ error: 'Missing signature' });
    }

    // التحقق من صحة الـ webhook
    const isValid = ziinaGateway.verifyWebhook(payload, signature);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // معالجة بيانات الـ webhook
    const {
      id: payment_id,
      status,
      amount,
      currency,
      metadata,
      customer
    } = req.body;

    console.log('Ziina Webhook received:', {
      payment_id,
      status,
      amount,
      order_id: metadata?.order_id,
      customer_email: customer?.email
    });

    // معالجة حالات الدفع المختلفة
    switch (status) {
      case 'completed':
        // الدفعة تمت بنجاح
        console.log(`Payment ${payment_id} completed successfully`);
        
        // هنا يمكن إضافة منطق معالجة الطلب:
        // - تحديث حالة الطلب في قاعدة البيانات
        // - إرسال بريد إلكتروني للعميل
        // - إرسال المنتج الرقمي
        // - تحديث المخزون
        
        await handleSuccessfulPayment({
          payment_id,
          order_id: metadata?.order_id,
          amount: amount / 100, // تحويل من فلس إلى درهم
          currency,
          customer_email: customer?.email,
          customer_name: customer?.name
        });
        
        break;

      case 'failed':
        // الدفعة فشلت
        console.log(`Payment ${payment_id} failed`);
        
        await handleFailedPayment({
          payment_id,
          order_id: metadata?.order_id,
          customer_email: customer?.email
        });
        
        break;

      case 'cancelled':
        // الدفعة ألغيت
        console.log(`Payment ${payment_id} was cancelled`);
        
        await handleCancelledPayment({
          payment_id,
          order_id: metadata?.order_id,
          customer_email: customer?.email
        });
        
        break;

      default:
        console.log(`Payment ${payment_id} status: ${status}`);
    }

    // إرجاع استجابة نجاح لـ Ziina
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * معالجة الدفعة الناجحة
 */
async function handleSuccessfulPayment(data: {
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
}) {
  try {
    // إرسال بريد إلكتروني للعميل (إذا كان متوفراً)
    if (data.customer_email) {
      await sendSuccessEmail(data);
    }

    // إرسال إشعار للإدارة
    await sendAdminNotification(data);

    console.log('Successful payment processed:', data.order_id);
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

/**
 * معالجة الدفعة الفاشلة
 */
async function handleFailedPayment(data: {
  payment_id: string;
  order_id: string;
  customer_email?: string;
}) {
  try {
    console.log('Failed payment processed:', data.order_id);
    
    // يمكن إضافة منطق إضافي هنا مثل:
    // - إرسال بريد إلكتروني للعميل
    // - تسجيل المحاولة الفاشلة
    // - إعادة المخزون إذا كان محجوزاً
    
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}

/**
 * معالجة الدفعة الملغاة
 */
async function handleCancelledPayment(data: {
  payment_id: string;
  order_id: string;
  customer_email?: string;
}) {
  try {
    console.log('Cancelled payment processed:', data.order_id);
    
    // يمكن إضافة منطق إضافي هنا
    
  } catch (error) {
    console.error('Error processing cancelled payment:', error);
  }
}

/**
 * إرسال بريد إلكتروني للعميل عند نجاح الدفع
 */
async function sendSuccessEmail(data: {
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  customer_email: string;
  customer_name?: string;
}) {
  try {
    // يمكن استخدام Resend أو أي خدمة بريد إلكتروني أخرى
    console.log('Sending success email to:', data.customer_email);
    
    // مثال على استخدام Resend (يحتاج إلى تثبيت المكتبة)
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: process.env.ADMIN_EMAIL,
      to: data.customer_email,
      subject: 'تأكيد الدفع - Level Up Store',
      html: `
        <h2>شكراً لك على الشراء!</h2>
        <p>تم استلام دفعتك بنجاح.</p>
        <p><strong>رقم الطلب:</strong> ${data.order_id}</p>
        <p><strong>المبلغ:</strong> ${data.amount} ${data.currency}</p>
        <p><strong>رقم الدفعة:</strong> ${data.payment_id}</p>
      `
    });
    */
    
  } catch (error) {
    console.error('Error sending success email:', error);
  }
}

/**
 * إرسال إشعار للإدارة
 */
async function sendAdminNotification(data: {
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  customer_email?: string;
}) {
  try {
    console.log('Sending admin notification for order:', data.order_id);
    
    // يمكن إرسال إشعار عبر البريد الإلكتروني أو Slack أو Telegram
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}
