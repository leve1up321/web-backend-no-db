/**
 * Ziina Payment Gateway Integration
 * مكتبة تكامل بوابة الدفع زينة
 */

export interface ZiinaPaymentRequest {
  amount: number; // المبلغ بالدرهم الإماراتي
  currency: string; // العملة (AED)
  description: string; // وصف الدفعة
  customer_email?: string; // بريد العميل الإلكتروني
  customer_name?: string; // اسم العميل
  order_id: string; // رقم الطلب الفريد
  success_url: string; // رابط النجاح
  cancel_url: string; // رابط الإلغاء
  webhook_url?: string; // رابط الـ webhook
}

export interface ZiinaPaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  payment_url: string;
  created_at: string;
}

export class ZiinaPaymentGateway {
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.secretKey = process.env.ZIINA_SECRET_KEY || '';
    this.baseUrl = 'https://api.ziina.com/v1'; // Ziina API Base URL
    
    if (!this.secretKey) {
      throw new Error('ZIINA_SECRET_KEY is required');
    }
  }

  /**
   * إنشاء رابط دفع جديد
   * Create new payment link
   */
  async createPayment(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.secretKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentData.amount * 100), // تحويل إلى فلس
          currency: paymentData.currency,
          description: paymentData.description,
          customer: {
            email: paymentData.customer_email,
            name: paymentData.customer_name,
          },
          metadata: {
            order_id: paymentData.order_id,
          },
          success_url: paymentData.success_url,
          cancel_url: paymentData.cancel_url,
          webhook_url: paymentData.webhook_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ziina API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        amount: data.amount / 100, // تحويل من فلس إلى درهم
        currency: data.currency,
        payment_url: data.payment_url || data.checkout_url,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Ziina Payment Creation Error:', error);
      throw error;
    }
  }

  /**
   * التحقق من حالة الدفعة
   * Check payment status
   */
  async getPaymentStatus(paymentId: string): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ziina API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        amount: data.amount / 100,
        currency: data.currency,
        payment_url: data.payment_url || data.checkout_url,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Ziina Payment Status Error:', error);
      throw error;
    }
  }

  /**
   * التحقق من صحة webhook
   * Verify webhook signature
   */
  verifyWebhook(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET || '';
      
      if (!webhookSecret) {
        console.error('ZIINA_WEBHOOK_SECRET is not configured');
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  /**
   * تنسيق المبلغ للعرض
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = 'AED'): string {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const ziinaGateway = new ZiinaPaymentGateway();

