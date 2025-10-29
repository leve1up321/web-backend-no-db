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
    
    // تحديث حالة الطلب
    const orderUpdate = {
      id: orderId,
      status: 'completed',
      paidAt: new Date().toISOString(),
      paymentData: paymentData
    };
    
    // TODO: تحديث في قاعدة البيانات
    console.log('Order completed:', orderUpdate);
    
    // إرسال بريد التأكيد
    if (customerEmail && productId) {
      await sendConfirmationEmail(customerEmail, orderId, productId);
    }
    
    // إشعار الإدارة
    await notifyAdmin('payment_success', {
      orderId,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      customerEmail
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
    
    // تحديث حالة الطلب
    const orderUpdate = {
      id: orderId,
      status: 'failed',
      failedAt: new Date().toISOString(),
      failureReason: paymentData.failure_reason || 'Unknown'
    };
    
    // TODO: تحديث في قاعدة البيانات
    console.log('Order failed:', orderUpdate);
    
    // إشعار الإدارة بالفشل
    await notifyAdmin('payment_failed', {
      orderId,
      reason: paymentData.failure_reason,
      customerEmail: paymentData.customer?.email
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
    
    // تحديث حالة الطلب
    const orderUpdate = {
      id: orderId,
      status: 'canceled',
      canceledAt: new Date().toISOString()
    };
    
    // TODO: تحديث في قاعدة البيانات
    console.log('Order canceled:', orderUpdate);
    
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

// إرسال بريد التأكيد (سنطوره لاحقاً)
async function sendConfirmationEmail(email, orderId, productId) {
  try {
    console.log(`📧 Sending confirmation email to ${email} for order ${orderId}`);
    
    // TODO: تنفيذ إرسال البريد مع Resend
    // سيتضمن: تفاصيل الطلب، رابط التحميل، رقم الطلب
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

// إشعار الإدارة (سنطوره لاحقاً)
async function notifyAdmin(type, data) {
  try {
    console.log(`🔔 Admin notification: ${type}`, data);
    
    // TODO: إرسال إشعار للإدارة (بريد/Slack/Telegram)
    
  } catch (error) {
    console.error('Error notifying admin:', error);
  }
}
