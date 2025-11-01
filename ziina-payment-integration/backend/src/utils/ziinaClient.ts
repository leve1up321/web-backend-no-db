import axios, { AxiosInstance, AxiosResponse } from 'axios';
import crypto from 'crypto';
import { ZiinaPaymentRequest, ZiinaPaymentResponse } from '../types';

class ZiinaClient {
  private client: AxiosInstance;
  private secretKey: string;
  private webhookSecret: string;

  constructor() {
    this.secretKey = process.env.ZIINA_SECRET_KEY!;
    this.webhookSecret = process.env.ZIINA_WEBHOOK_SECRET!;
    
    this.client = axios.create({
      baseURL: process.env.ZIINA_API_URL || 'https://api.ziina.com/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.secretKey}`,
        'User-Agent': 'Ziina-Integration/1.0.0',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔄 Ziina API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Ziina API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Ziina API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Ziina API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a payment link with Ziina
   */
  async createPayment(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      const response: AxiosResponse<ZiinaPaymentResponse> = await this.client.post(
        '/payments',
        paymentData
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create Ziina payment:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to create payment with Ziina'
      );
    }
  }

  /**
   * Retrieve payment details
   */
  async getPayment(paymentId: string): Promise<ZiinaPaymentResponse> {
    try {
      const response: AxiosResponse<ZiinaPaymentResponse> = await this.client.get(
        `/payments/${paymentId}`
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to retrieve Ziina payment:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to retrieve payment from Ziina'
      );
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload, 'utf8')
        .digest('hex');

      // Compare signatures using timing-safe comparison
      const providedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
      );
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.client.post(`/payments/${paymentId}/cancel`);
      
      return {
        success: true,
        message: 'Payment cancelled successfully'
      };
    } catch (error: any) {
      console.error('❌ Failed to cancel Ziina payment:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to cancel payment'
      );
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string, 
    amount?: number, 
    reason?: string
  ): Promise<{ success: boolean; message: string; refund_id: string }> {
    try {
      const refundData: any = {};
      if (amount) refundData.amount = amount;
      if (reason) refundData.reason = reason;

      const response = await this.client.post(`/payments/${paymentId}/refund`, refundData);
      
      return {
        success: true,
        message: 'Payment refunded successfully',
        refund_id: response.data.id
      };
    } catch (error: any) {
      console.error('❌ Failed to refund Ziina payment:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to refund payment'
      );
    }
  }
}

// Export singleton instance
export const ziinaClient = new ZiinaClient();
