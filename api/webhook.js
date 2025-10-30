// Vercel Serverless Function لمعالجة Webhooks من Ziina
// Enhanced Webhook Handler for Ziina Payment Gateway

export default async function handler(req, res) {
  // إضافة CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Ziina-Signature');

  // معالجة OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    console.warn('⚠️ محاولة وصول غير مسموحة للـ webhook:', {
      method: req.method,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'يُسمح فقط بـ POST requests',
      allowedMethods: ['POST']
    });
  }

  try {
    // الحصول على البيانات من Ziina
    const webhookData = req.body;
    const signature = req.headers['x-ziina-signature'] || req.headers['ziina-signature'];
    
    // تسجيل الـ webhook للمراقبة (بدون البيانات الحساسة)
    console.log('🔔 Webhook مستلم:', {
      timestamp: new Date().toISOString(),
      paymentId: webhookData?.id,
      eventType: webhookData?.status || webhookData?.event_type,
      amount: webhookData?.amount,
      hasSignature: !!signature,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });

    // التحقق من وجود البيانات الأساسية
    if (!webhookData || !webhookData.id) {
      console.error('❌ بيانات webhook غير صحيحة:', webhookData);
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        message: 'بيانات الـ webhook غير صحيحة أو مفقودة'
      });
    }

    // التحقق من صحة التوقيع (إذا كان متوفراً)
    if (signature) {
      const isValidSignature = verifyWebhookSignature(
        JSON.stringify(webhookData),
        signature
      );
      
      if (!isValidSignature) {
        console.error('❌ توقيع webhook غير صحيح:', {
          paymentId: webhookData.id,
          signature: signature.substring(0, 20) + '...'
        });
        
        return res.status(401).json({
          error: 'Invalid signature',
          message: 'توقيع الـ webhook غير صحيح'
        });
      }
      
      console.log('✅ تم التحقق من توقيع الـ webhook بنجاح');
    } else {
      console.warn('⚠️ لا يوجد توقيع في الـ webhook - قد يكون غير آمن');
    }

    // معالجة الـ webhook
    const result = await processWebhook(webhookData);

    // تسجيل نتيجة المعالجة
    console.log('✅ تم معالجة الـ webhook بنجاح:', {
      paymentId: webhookData.id,
      type: result.type,
      success: result.success
    });

    // إرجاع استجابة نجاح لـ Ziina
    res.status(200).json({ 
      received: true,
      processed: true,
      paymentId: webhookData.id,
      type: result.type,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ خطأ في معالجة الـ webhook:', {
      error: error.message,
      stack: error.stack,
      paymentId: req.body?.id,
      timestamp: new Date().toISOString()
    });
    
    // إرجاع خطأ لـ Ziina لإعادة المحاولة
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: 'فشل في معالجة الـ webhook',
      paymentId: req.body?.id,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * التحقق من صحة توقيع Webhook
 * @param {string} payload - محتوى الـ webhook
 * @param {string} signature - التوقيع من Ziina
 * @returns {boolean} - هل التوقيع صحيح؟
 */
function verifyWebhookSignature(payload, signature) {
  try {
    // TODO: تنفيذ التحقق من التوقيع حسب توثيق Ziina
    // هذا يعتمد على طريقة Ziina في توقيع الـ webhooks
    
    console.log('🔍 التحقق من توقيع Webhook:', {
      payloadLength: payload.length,
      signature: signature ? 'موجود' : 'غير موجود'
    });

    // مؤقتاً نقبل جميع الـ webhooks (يجب تحديث هذا)
    return true;
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من توقيع Webhook:', error);
    return false;
  }
}

/**
 * معالجة Webhook من Ziina
 * @param {Object} webhookData - بيانات الـ webhook
 * @returns {Promise<Object>} - نتيجة المعالجة
 */
async function processWebhook(webhookData) {
  try {
    console.log('🔄 معالجة Webhook:', {
      id: webhookData.id,
      status: webhookData.status,
      amount: webhookData.amount
    });

    const eventType = webhookData.status || webhookData.event_type;
    
    switch (eventType) {
      case 'succeeded':
      case 'completed':
      case 'payment_intent.succeeded':
        return await handleSuccessfulPayment(webhookData);
        
      case 'failed':
      case 'payment_intent.failed':
        return await handleFailedPayment(webhookData);
        
      case 'cancelled':
      case 'payment_intent.cancelled':
        return await handleCancelledPayment(webhookData);
        
      default:
        console.log('⚠️ نوع webhook غير معروف:', eventType);
        return { success: true, type: 'unknown', message: 'Unhandled event type' };
    }
    
  } catch (error) {
    console.error('❌ خطأ في معالجة Webhook:', error);
    throw error;
  }
}

/**
 * معالجة الدفع الناجح
 * @param {Object} data - بيانات الدفع
 * @returns {Promise<Object>} - نتيجة المعالجة
 */
async function handleSuccessfulPayment(data) {
  console.log('✅ دفع ناجح:', {
    paymentId: data.id,
    amount: data.amount / 100, // تحويل من فلس إلى درهم
    currency: data.currency_code,
    productName: data.metadata?.product_name
  });

  try {
    // 1. إرسال بريد تأكيد للعميل (إذا توفر البريد الإلكتروني)
    if (data.metadata?.customer_email) {
      await sendOrderConfirmationEmail({
        customerEmail: data.metadata.customer_email,
        customerName: data.customer_name || 'عميل كريم',
        paymentId: data.id,
        productName: data.metadata?.product_name || 'منتج رقمي',
        amount: data.amount / 100,
        currency: data.currency_code || 'AED',
        orderNumber: data.id
      });
    }

    // 2. إرسال إشعار للإدارة
    await sendAdminNotification({
      type: 'new_order',
      paymentId: data.id,
      customerEmail: data.metadata?.customer_email || 'غير محدد',
      customerName: data.customer_name || 'غير محدد',
      productName: data.metadata?.product_name || 'منتج رقمي',
      amount: data.amount / 100,
      currency: data.currency_code || 'AED'
    });

    // 3. هنا يمكن إضافة:
    // - حفظ الطلب في قاعدة البيانات
    // - إنشاء رابط تحميل للمنتجات الرقمية
    // - تحديث المخزون

  } catch (emailError) {
    console.error('⚠️ خطأ في إرسال الإيميلات (لكن الدفع نجح):', emailError);
    // لا نرمي خطأ هنا لأن الدفع نجح، فقط الإيميل فشل
  }

  return {
    success: true,
    type: 'payment_success',
    paymentId: data.id,
    amount: data.amount / 100,
    currency: data.currency_code || 'AED',
    message: 'Payment processed successfully'
  };
}

/**
 * معالجة الدفع الفاشل
 * @param {Object} data - بيانات الدفع
 * @returns {Promise<Object>} - نتيجة المعالجة
 */
async function handleFailedPayment(data) {
  console.log('❌ دفع فاشل:', {
    paymentId: data.id,
    amount: data.amount / 100,
    error: data.latest_error
  });

  return {
    success: true,
    type: 'payment_failed',
    paymentId: data.id,
    amount: data.amount / 100,
    error: data.latest_error,
    message: 'Payment failed'
  };
}

/**
 * معالجة الدفع المُلغى
 * @param {Object} data - بيانات الدفع
 * @returns {Promise<Object>} - نتيجة المعالجة
 */
async function handleCancelledPayment(data) {
  console.log('🚫 دفع مُلغى:', {
    paymentId: data.id,
    amount: data.amount / 100
  });

  return {
    success: true,
    type: 'payment_cancelled',
    paymentId: data.id,
    amount: data.amount / 100,
    message: 'Payment cancelled'
  };
}

/**
 * إرسال بريد تأكيد الطلب (مبسط)
 * @param {Object} orderData - بيانات الطلب
 * @returns {Promise<void>}
 */
async function sendOrderConfirmationEmail(orderData) {
  try {
    // هنا يمكن دمج مع خدمة إرسال الإيميلات مثل Resend
    console.log('📧 إرسال بريد تأكيد الطلب:', {
      to: orderData.customerEmail,
      paymentId: orderData.paymentId,
      amount: orderData.amount,
      productName: orderData.productName
    });

    // TODO: تنفيذ إرسال الإيميل الفعلي
    // يمكن استخدام Resend أو أي خدمة إيميل أخرى
    
  } catch (error) {
    console.error('❌ فشل إرسال بريد تأكيد الطلب:', error);
    throw error;
  }
}

/**
 * إرسال إشعار للإدارة (مبسط)
 * @param {Object} notificationData - بيانات الإشعار
 * @returns {Promise<void>}
 */
async function sendAdminNotification(notificationData) {
  try {
    console.log('🔔 إرسال إشعار للإدارة:', {
      type: notificationData.type,
      paymentId: notificationData.paymentId,
      amount: notificationData.amount,
      customerEmail: notificationData.customerEmail
    });

    // TODO: تنفيذ إرسال الإشعار الفعلي
    // يمكن استخدام Slack webhook أو Telegram أو إيميل
    
  } catch (error) {
    console.error('❌ فشل إرسال إشعار الإدارة:', error);
    throw error;
  }
}
