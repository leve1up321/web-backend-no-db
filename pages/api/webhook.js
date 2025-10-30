import crypto from 'crypto';

// تعطيل body parser لـ webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// التحقق من صحة Webhook من Ziina
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// معالج Webhook الرئيسي
export default async function handler(req, res) {
  // قبول POST requests فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-ziina-signature'];
    const payload = JSON.stringify(req.body);

    // التحقق من التوقيع (إذا كان متوفراً)
    if (signature && process.env.ZIINA_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(
        payload, 
        signature, 
        process.env.ZIINA_WEBHOOK_SECRET
      );
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;
    console.log('Webhook received:', event.type, event.data?.id);

    // معالجة أنواع الأحداث المختلفة
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment.completed':
        await handlePaymentSuccess(event.data);
        break;
        
      case 'payment_intent.payment_failed':
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
        
      case 'payment_intent.canceled':
      case 'payment.canceled':
        await handlePaymentCanceled(event.data);
        break;
        
      default:
        console.log('Unhandled webhook event:', event.type);
    }

    // إرجاع استجابة ناجحة لـ Ziina
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// معالجة الدفع الناجح
async function handlePaymentSuccess(paymentData) {
  try {
    console.log('🎉 Payment successful:', paymentData.id);
    
    const orderId = paymentData.id;
    const productId = paymentData.metadata?.productId;
    const customerEmail = paymentData.customer?.email;
    
    // استيراد الوحدات المطلوبة
    const { updateOrder, findOrder, upsertCustomer } = await import('@/lib/database');
    const { sendOrderConfirmationEmail, sendAdminNotificationEmail } = await import('@/lib/email');
    const { generateSecureDownloadLink } = await import('@/lib/storage');
    
    // البحث عن الطلب
    const orderResult = await findOrder({ id: orderId });
    if (!orderResult.success) {
      console.error('Order not found:', orderId);
      return;
    }
    
    const order = orderResult.order;
    
    // إنشاء رابط تحميل آمن (محاكاة - سيتم ربطه بالملف الفعلي لاحقاً)
    const downloadLinkResult = generateSecureDownloadLink(
      'https://example-blob-url.com/product-file.zip', // سيتم استبداله بالملف الفعلي
      orderId,
      customerEmail,
      168 // 7 أيام
    );
    
    // تحديث حالة الطلب
    const orderUpdate = {
      status: 'completed',
      paidAt: new Date().toISOString(),
      downloadLink: downloadLinkResult.success ? downloadLinkResult.downloadUrl : null,
      expiresAt: downloadLinkResult.success ? downloadLinkResult.expiresAt : null
    };
    
    const updateResult = await updateOrder(orderId, orderUpdate);
    if (!updateResult.success) {
      console.error('Failed to update order:', updateResult.error);
      return;
    }
    
    // تحديث بيانات العميل
    await upsertCustomer({
      email: customerEmail,
      name: paymentData.customer?.name,
      amount: paymentData.amount / 100
    });
    
    // إرسال بريد التأكيد
    if (customerEmail && downloadLinkResult.success) {
      await sendOrderConfirmationEmail({
        customerEmail,
        customerName: paymentData.customer?.name || order.customerName,
        orderId,
        orderNumber: order.orderNumber,
        productName: order.productName || 'منتج رقمي',
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        downloadLink: downloadLinkResult.downloadUrl
      });
    }
    
    // إشعار الإدارة
    await sendAdminNotificationEmail({
      type: 'payment_success',
      orderId,
      orderNumber: order.orderNumber,
      customerEmail,
      customerName: paymentData.customer?.name || order.customerName,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      productName: order.productName
    });
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

// معالجة فشل الدفع
async function handlePaymentFailed(paymentData) {
  try {
    console.log('❌ Payment failed:', paymentData.id);
    
    const orderId = paymentData.id;
    
    // استيراد الوحدات المطلوبة
    const { updateOrder, findOrder } = await import('@/lib/database');
    const { sendAdminNotificationEmail } = await import('@/lib/email');
    
    // البحث عن الطلب
    const orderResult = await findOrder({ id: orderId });
    if (!orderResult.success) {
      console.error('Order not found:', orderId);
      return;
    }
    
    const order = orderResult.order;
    
    // تحديث حالة الطلب
    const orderUpdate = {
      status: 'failed',
      failedAt: new Date().toISOString(),
      failureReason: paymentData.failure_reason || 'Unknown'
    };
    
    const updateResult = await updateOrder(orderId, orderUpdate);
    if (!updateResult.success) {
      console.error('Failed to update order:', updateResult.error);
      return;
    }
    
    // إشعار الإدارة بالفشل
    await sendAdminNotificationEmail({
      type: 'payment_failed',
      orderId,
      orderNumber: order.orderNumber,
      customerEmail: paymentData.customer?.email || order.customerEmail,
      customerName: paymentData.customer?.name || order.customerName,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      productName: order.productName,
      reason: paymentData.failure_reason
    });
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// معالجة إلغاء الدفع
async function handlePaymentCanceled(paymentData) {
  try {
    console.log('🚫 Payment canceled:', paymentData.id);
    
    const orderId = paymentData.id;
    
    // استيراد الوحدات المطلوبة
    const { updateOrder, findOrder } = await import('@/lib/database');
    const { sendAdminNotificationEmail } = await import('@/lib/email');
    
    // البحث عن الطلب
    const orderResult = await findOrder({ id: orderId });
    if (!orderResult.success) {
      console.error('Order not found:', orderId);
      return;
    }
    
    const order = orderResult.order;
    
    // تحديث حالة الطلب
    const orderUpdate = {
      status: 'canceled',
      canceledAt: new Date().toISOString()
    };
    
    const updateResult = await updateOrder(orderId, orderUpdate);
    if (!updateResult.success) {
      console.error('Failed to update order:', updateResult.error);
      return;
    }
    
    // إشعار الإدارة بالإلغاء
    await sendAdminNotificationEmail({
      type: 'payment_canceled',
      orderId,
      orderNumber: order.orderNumber,
      customerEmail: paymentData.customer?.email || order.customerEmail,
      customerName: paymentData.customer?.name || order.customerName,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      productName: order.productName
    });
    
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}


