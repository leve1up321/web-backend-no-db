import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    
    // Transform error for better handling
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    throw new Error(errorMessage);
  }
);

// Types
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

export interface PaymentDetails {
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
}

// API Functions

/**
 * Create a payment link with Ziina
 */
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response: AxiosResponse<PaymentResponse> = await apiClient.post('/api/pay', paymentData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create payment:', error.message);
    throw error;
  }
};

/**
 * Get payment details by ID
 */
export const getPayment = async (paymentId: string): Promise<PaymentDetails> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: PaymentDetails }> = 
      await apiClient.get(`/api/payment/${paymentId}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to retrieve payment details');
    }
  } catch (error: any) {
    console.error('Failed to get payment:', error.message);
    throw error;
  }
};

/**
 * Cancel a payment
 */
export const cancelPayment = async (paymentId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: any; message: string }> = 
      await apiClient.post(`/api/payment/${paymentId}/cancel`);
    
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Failed to cancel payment:', error.message);
    throw error;
  }
};

/**
 * Refund a payment
 */
export const refundPayment = async (
  paymentId: string, 
  amount?: number, 
  reason?: string
): Promise<{ success: boolean; message: string; refund_id: string }> => {
  try {
    const refundData: any = {};
    if (amount) refundData.amount = amount;
    if (reason) refundData.reason = reason;

    const response: AxiosResponse<{ success: boolean; data: any; message: string }> = 
      await apiClient.post(`/api/payment/${paymentId}/refund`, refundData);
    
    return {
      success: response.data.success,
      message: response.data.message,
      refund_id: response.data.data.refund_id,
    };
  } catch (error: any) {
    console.error('Failed to refund payment:', error.message);
    throw error;
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response: AxiosResponse<{ status: string; timestamp: string }> = 
      await apiClient.get('/health');
    
    return response.data;
  } catch (error: any) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

/**
 * Test webhook endpoint
 */
export const testWebhook = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response: AxiosResponse<{ success: boolean; message: string }> = 
      await apiClient.get('/webhook/test');
    
    return response.data;
  } catch (error: any) {
    console.error('Webhook test failed:', error.message);
    throw error;
  }
};

export default apiClient;
