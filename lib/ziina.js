// مكتبة Ziina Payment Gateway المحسنة
// Enhanced Ziina Payment Gateway Library

import { getZiinaConfig, getPaymentUrls } from './env.js';

/**
 * فئة إدارة Ziina Payment Gateway
 */
class ZiinaPaymentGateway {
  constructor() {
    this.config = getZiinaConfig(process.env.NODE_ENV === 'production');
    this.paymentUrls = getPaymentUrls();
  }

  /**
   * إنشاء Payment Intent جديد
   * @param {Object} paymentData - بيانات الدفع
   * @returns {Promise<Object>} - استجابة Ziina API
   */
  async createPaymentIntent(paymentData) {
    try {
      const {
        amount,
        productName,
        productId,
        customerEmail,
        customerName,
        customerPhone,
        description,
        metadata = {}
      } = paymentData;

      // التحقق من البيانات المطلوبة
      this.validatePaymentData(paymentData);

      // إعداد بيانات الطلب
      const requestBody = {
        amount: Math.round(amount * 100), // تحويل إلى فلس (أصغر وحدة)
        currency_code: this.config.currency,
        message: description || `شراء: ${productName}`,
        success_url: this.paymentUrls.successUrl,
        cancel_url: this.paymentUrls.cancelUrl,
        failure_url: this.paymentUrls.failureUrl,
        test: this.config.testMode,
        allow_tips: this.config.allowTips,
        
        // بيانات العميل (إذا توفرت)
        ...(customerEmail && { customer_email: customerEmail }),
        ...(customerName && { customer_name: customerName }),
        ...(customerPhone && { customer_phone: customerPhone }),
        
        // Metadata للتتبع
        metadata: {
          product_id: productId,
          product_name: productName,
          customer_email: customerEmail,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      };

      console.log('🔄 إنشاء Payment Intent:', {
        productName,
        amount: amount,
        currency: this.config.currency,
        testMode: this.config.testMode
      });

      // إرسال الطلب إلى Ziina
      const response = await fetch(`${this.config.apiUrl}/payment_intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'LevelUp-Store/1.0'
        },
        body: JSON.stringify(requestBody)
      });

      // التحقق من نجاح الطلب
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ خطأ Ziina API:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        throw new ZiinaError(
          `Ziina API Error: ${response.status}`,
          response.status,
          errorText
        );
      }

      const paymentIntent = await response.json();

      // التحقق من وجود redirect_url
      if (!paymentIntent.redirect_url) {
        console.error('❌ لا يوجد redirect_url في استجابة Ziina:', paymentIntent);
        throw new ZiinaError('Invalid payment response: missing redirect_url');
      }

      console.log('✅ تم إنشاء Payment Intent بنجاح:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency_code
      });

      return {
        success: true,
        paymentIntent,
        redirectUrl: paymentIntent.redirect_url
      };

    } catch (error) {
      console.error('❌ خطأ في إنشاء Payment Intent:', error);
      
      if (error instanceof ZiinaError) {
        throw error;
      }
      
      throw new ZiinaError('Failed to create payment intent', 500, error.message);
    }
  }

  /**
   * التحقق من صحة بيانات الدفع
   * @param {Object} paymentData - بيانات الدفع
   * @throws {ZiinaError} - إذا كانت البيانات غير صحيحة
   */
  validatePaymentData(paymentData) {
    const { amount, productName } = paymentData;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new ZiinaError('Invalid amount: must be a positive number');
    }

    if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
      throw new ZiinaError('Invalid product name: must be a non-empty string');
    }

    if (amount < 1) {
      throw new ZiinaError('Amount must be at least 1 AED');
    }

    if (amount > 50000) {
      throw new ZiinaError('Amount cannot exceed 50,000 AED');
    }
  }

  /**
   * التحقق من صحة Webhook
   * @param {string} payload - محتوى الـ webhook
   * @param {string} signature - التوقيع من Ziina
   * @returns {boolean} - هل التوقيع صحيح؟
   */
  verifyWebhookSignature(payload, signature) {
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
  async processWebhook(webhookData) {
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
          return await this.handleSuccessfulPayment(webhookData);
          
        case 'failed':
        case 'payment_intent.failed':
          return await this.handleFailedPayment(webhookData);
          
        case 'cancelled':
        case 'payment_intent.cancelled':
          return await this.handleCancelledPayment(webhookData);
          
        default:
          console.log('⚠️ نوع webhook غير معروف:', eventType);
          return { success: true, message: 'Unhandled event type' };
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
  async handleSuccessfulPayment(data) {
    console.log('✅ دفع ناجح:', {
      paymentId: data.id,
      amount: data.amount / 100, // تحويل من فلس إلى درهم
      currency: data.currency_code,
      productName: data.metadata?.product_name
    });

    try {
      // 1. إرسال بريد تأكيد للعميل (إذا توفر البريد الإلكتروني)
      if (data.metadata?.customer_email) {
        await this.sendOrderConfirmationEmail({
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
      await this.sendAdminNotification({
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
   * إرسال بريد تأكيد الطلب
   * @param {Object} orderData - بيانات الطلب
   * @returns {Promise<void>}
   */
  async sendOrderConfirmationEmail(orderData) {
    try {
      // استيراد مكتبة الإيميل ديناميكياً لتجنب مشاكل الاستيراد
      const { sendOrderConfirmationEmail } = await import('./email.js');
      
      await sendOrderConfirmationEmail({
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        orderId: orderData.paymentId,
        orderNumber: orderData.orderNumber,
        productName: orderData.productName,
        amount: orderData.amount,
        currency: orderData.currency,
        downloadLink: orderData.downloadUrl // إذا كان متوفراً
      });

      console.log('✅ تم إرسال بريد تأكيد الطلب للعميل');
      
    } catch (error) {
      console.error('❌ فشل إرسال بريد تأكيد الطلب:', error);
      throw error;
    }
  }

  /**
   * إرسال إشعار للإدارة
   * @param {Object} notificationData - بيانات الإشعار
   * @returns {Promise<void>}
   */
  async sendAdminNotification(notificationData) {
    try {
      // استيراد مكتبة الإيميل ديناميكياً
      const { sendAdminNotificationEmail } = await import('./email.js');
      
      await sendAdminNotificationEmail({
        type: notificationData.type,
        orderId: notificationData.paymentId,
        orderNumber: notificationData.paymentId,
        customerEmail: notificationData.customerEmail,
        customerName: notificationData.customerName,
        amount: notificationData.amount,
        currency: notificationData.currency,
        productName: notificationData.productName
      });

      console.log('✅ تم إرسال إشعار للإدارة');
      
    } catch (error) {
      console.error('❌ فشل إرسال إشعار الإدارة:', error);
      throw error;
    }
  }

  /**
   * معالجة الدفع الفاشل
   * @param {Object} data - بيانات الدفع
   * @returns {Promise<Object>} - نتيجة المعالجة
   */
  async handleFailedPayment(data) {
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
  async handleCancelledPayment(data) {
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
}

/**
 * فئة أخطاء Ziina المخصصة
 */
class ZiinaError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'ZiinaError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// إنشاء instance واحد للاستخدام
const ziinaGateway = new ZiinaPaymentGateway();

// تصدير الفئات والدوال
export {
  ZiinaPaymentGateway,
  ZiinaError,
  ziinaGateway as default
};

// تصدير CommonJS للتوافق
module.exports = {
  ZiinaPaymentGateway,
  ZiinaError,
  default: ziinaGateway
};
