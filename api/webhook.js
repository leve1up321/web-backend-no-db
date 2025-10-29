// Webhook endpoint لاستقبال إشعارات الدفع من Ziina
export default async function handler(req, res) {
  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed' 
    });
  }

  try {
    // الحصول على البيانات من Ziina
    const webhookData = req.body;
    
    // تسجيل الـ webhook للمراقبة
    console.log('Webhook received:', {
      timestamp: new Date().toISOString(),
      data: webhookData
    });

    // التحقق من وجود البيانات الأساسية
    if (!webhookData || !webhookData.id) {
      console.error('Invalid webhook data received');
      return res.status(400).json({ 
        error: 'Invalid webhook data' 
      });
    }

    // معالجة أنواع مختلفة من الـ webhooks
    const eventType = webhookData.status || webhookData.event_type;
    
    switch (eventType) {
      case 'succeeded':
      case 'completed':
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(webhookData);
        break;
        
      case 'failed':
      case 'payment_intent.failed':
        await handleFailedPayment(webhookData);
        break;
        
      case 'cancelled':
      case 'payment_intent.cancelled':
        await handleCancelledPayment(webhookData);
        break;
        
      default:
        console.log('Unhandled webhook event type:', eventType);
    }

    // إرجاع استجابة نجاح لـ Ziina
    res.status(200).json({ 
      received: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // إرجاع خطأ لـ Ziina لإعادة المحاولة
    res.status(500).json({ 
      error: 'Webhook processing failed' 
    });
  }
}

// معالجة الدفع الناجح
async function handleSuccessfulPayment(data) {
  try {
    console.log('Processing successful payment:', {
      paymentId: data.id,
      amount: data.amount,
      currency: data.currency_code,
      message: data.message
    });

    // هنا يمكن إضافة:
    // 1. حفظ البيانات في قاعدة البيانات
    // 2. إرسال بريد إلكتروني للعميل
    // 3. إرسال إشعار للإدارة
    // 4. تحديث المخزون
    
    // مثال على تسجيل بسيط في ملف JSON (للاختبار)
    await logPaymentToFile({
      type: 'success',
      paymentId: data.id,
      amount: data.amount,
      currency: data.currency_code || 'AED',
      message: data.message,
      timestamp: new Date().toISOString(),
      customerEmail: data.customer_email || 'غير محدد'
    });

    // إرسال إشعار بسيط (يمكن تطويره لاحقاً)
    await sendNotification({
      type: 'payment_success',
      paymentId: data.id,
      amount: data.amount,
      message: data.message
    });

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

// معالجة الدفع الفاشل
async function handleFailedPayment(data) {
  try {
    console.log('Processing failed payment:', {
      paymentId: data.id,
      amount: data.amount,
      error: data.latest_error
    });

    await logPaymentToFile({
      type: 'failed',
      paymentId: data.id,
      amount: data.amount,
      currency: data.currency_code || 'AED',
      message: data.message,
      error: data.latest_error,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

// معالجة الدفع المُلغى
async function handleCancelledPayment(data) {
  try {
    console.log('Processing cancelled payment:', {
      paymentId: data.id,
      amount: data.amount
    });

    await logPaymentToFile({
      type: 'cancelled',
      paymentId: data.id,
      amount: data.amount,
      currency: data.currency_code || 'AED',
      message: data.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error handling cancelled payment:', error);
    throw error;
  }
}

// تسجيل الدفع في ملف (يمكن استبداله بقاعدة بيانات لاحقاً)
async function logPaymentToFile(paymentData) {
  try {
    // في بيئة الإنتاج، يُفضل استخدام قاعدة بيانات
    // هذا مثال بسيط للتسجيل
    console.log('Payment logged:', paymentData);
    
    // يمكن إضافة كود لحفظ البيانات في:
    // - Supabase
    // - MongoDB Atlas
    // - Firebase
    // - أو أي قاعدة بيانات أخرى
    
  } catch (error) {
    console.error('Error logging payment:', error);
  }
}

// إرسال إشعار (يمكن تطويره لاحقاً)
async function sendNotification(notificationData) {
  try {
    // يمكن إضافة:
    // - إرسال بريد إلكتروني
    // - إرسال رسالة SMS
    // - إشعار Slack
    // - إشعار Discord
    
    console.log('Notification sent:', notificationData);
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
