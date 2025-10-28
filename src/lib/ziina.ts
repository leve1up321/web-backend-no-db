// Ziina Payment Integration
export interface ZiinaPaymentItem {
  name: string;
  quantity: number;
  unit_amount: number;
}

export interface ZiinaPaymentRequest {
  amount: number;
  currency: 'AED' | 'SAR';
  items: ZiinaPaymentItem[];
  success_url?: string;
  cancel_url?: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface ZiinaPaymentResponse {
  id: string;
  url: string;
  status: string;
}

const ZIINA_API_KEY = 'eMVOswjII5H2xNHNwg7JJ9mWNZ504ExkePe6+SOT5G+PC3d2uzrxEM8ZSiRvQMEe';
const ZIINA_BASE_URL = 'https://api.ziina.com/v1';

export class ZiinaPayment {
  private apiKey: string;

  constructor(apiKey: string = ZIINA_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Create a payment link with Ziina
   */
  async createPaymentLink(paymentData: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${ZIINA_BASE_URL}/payment-links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentData.amount * 100), // Convert to cents
          currency: paymentData.currency,
          line_items: paymentData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit_amount: Math.round(item.unit_amount * 100), // Convert to cents
          })),
          success_url: paymentData.success_url || `${window.location.origin}/payment/success`,
          cancel_url: paymentData.cancel_url || `${window.location.origin}/payment/cancel`,
          metadata: {
            source: 'levelup-store',
            timestamp: new Date().toISOString(),
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Ziina API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        url: data.url,
        status: data.status,
      };
    } catch (error) {
      console.error('Ziina payment creation failed:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{ status: string; amount: number; currency: string }> {
    try {
      const response = await fetch(`${ZIINA_BASE_URL}/payment-links/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        amount: data.amount / 100, // Convert from cents
        currency: data.currency,
      };
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }
}

export const ziinaPayment = new ZiinaPayment();

