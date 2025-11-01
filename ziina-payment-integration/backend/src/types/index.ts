export interface PaymentRequest {
  name: string;
  email: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  payment_id?: string;
  message?: string;
  error?: string;
}

export interface ZiinaPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer: {
    name: string;
    email: string;
  };
  success_url: string;
  cancel_url: string;
  webhook_url: string;
}

export interface ZiinaPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  payment_url: string;
  created_at: string;
}

export interface ZiinaWebhookPayload {
  id: string;
  type: string;
  data: {
    payment: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      customer: {
        name: string;
        email: string;
      };
      created_at: string;
      updated_at: string;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}
