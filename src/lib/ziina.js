const crypto = require('crypto');

/**
 * مكتبة زينة للدفع - نسخة Next.js
 * Ziina Payment Gateway Library - Next.js Version
 */
class ZiinaPaymentGateway {
  constructor() {
    this.secretKey = process.env.ZIINA_SECRET_KEY;
    this.webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;
    this.baseUrl = 'https://api.ziina.com/v1';
    
    if (!this.secretKey) {
      throw new Error('ZIINA_SECRET_KEY is required in environment variables');
    }
    
    if (!this.webhookSecret) {
      console.warn('ZIINA_WEBHOOK_SECRET not found - webhook verification will be disabled');
    }
  }

  /**
   * إنشاء دفعة جديدة
   * Create a new payment
   */
  async createPayment(paymentData) {
    try {
      const {
        amount,
        currency = 'AED',
        description,
        order_id,
        customer_email,
        customer_name,
        success_url,
        cancel_url,
        webhook_url
      } = paymentData;

      // التحقق من البيانات المطلوبة
      if (!amount || !description || !order_id) {
        throw new Error('Missing required fields: amount, description, order_id');
      }

      // تحويل المبلغ إلى فلس (fils) - زينة تتطلب المبلغ بالفلس
      const amountInFils = Math.round(parseFloat(amount) * 100);

      const requestBody = {
        amount: amountInFils,
        currency: currency.toUpperCase(),
        description: description,
        order_id: order_id,
        customer_email: customer_email || 'customer@levelup.com',
        customer_name: customer_name || 'عميل Level Up',
        success_url: success_url,
        cancel_url: cancel_url,
        webhook_url: webhook_url,
        metadata: {
          source: 'levelup-store',
          created_at: new Date().toISOString()
        }
      };

      console.log('Creating Ziina payment:', {
        ...requestBody,
        amount: `${amount} ${currency} (${amountInFils} fils)`
      });

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'LevelUp-Store/1.0'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('Ziina API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        
        let errorMessage = `Ziina API error: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // إذا لم يكن الرد JSON، استخدم النص كما هو
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid JSON response from Ziina API');
      }

      console.log('Ziina payment created successfully:', {
        payment_id: responseData.id,
        payment_url: responseData.payment_url ? 'Generated' : 'Missing',
        status: responseData.status
      });

      return {
        success: true,
        payment_id: responseData.id,
        payment_url: responseData.payment_url,
        status: responseData.status,
        amount: responseData.amount,
        currency: responseData.currency,
        order_id: responseData.order_id,
        created_at: responseData.created_at
      };

    } catch (error) {
      console.error('Error creating Ziina payment:', error);
      throw error;
    }
  }

  /**
   * التحقق من حالة الدفعة
   * Check payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * التحقق من صحة webhook
   * Verify webhook signature
   */
  verifyWebhook(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('Webhook verification skipped - no webhook secret configured');
      return true;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      const providedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
      );
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  /**
   * معالجة webhook
   * Process webhook
   */
  async processWebhook(payload, signature) {
    try {
      // التحقق من صحة الـ webhook
      if (!this.verifyWebhook(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const data = JSON.parse(payload);
      
      console.log('Processing Ziina webhook:', {
        event: data.event,
        payment_id: data.data?.id,
        status: data.data?.status
      });

      // يمكن إضافة منطق معالجة مخصص هنا
      // مثل تحديث قاعدة البيانات، إرسال إيميلات، إلخ

      return {
        success: true,
        event: data.event,
        payment_data: data.data
      };

    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }
}

module.exports = ZiinaPaymentGateway;
