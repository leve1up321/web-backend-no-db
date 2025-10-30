// Hook لإدارة عمليات الدفع مع Ziina
// Payment Management Hook for Ziina Integration

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PaymentData {
  productName: string;
  productId?: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  redirectUrl?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  testMode?: boolean;
  error?: string;
}

interface UsePaymentReturn {
  isLoading: boolean;
  error: string | null;
  createPaymentIntent: (paymentData: PaymentData) => Promise<PaymentResult | null>;
  redirectToPayment: (redirectUrl: string) => void;
}

/**
 * Hook لإدارة عمليات الدفع مع Ziina
 */
export function usePayment(): UsePaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * إنشاء Payment Intent جديد
   */
  const createPaymentIntent = useCallback(async (paymentData: PaymentData): Promise<PaymentResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // التحقق من البيانات المطلوبة
      if (!paymentData.productName || !paymentData.amount) {
        throw new Error('اسم المنتج والمبلغ مطلوبان');
      }

      if (paymentData.amount <= 0) {
        throw new Error('المبلغ يجب أن يكون أكبر من صفر');
      }

      // التحقق من صحة البريد الإلكتروني (إذا تم توفيره)
      if (paymentData.customerEmail && !isValidEmail(paymentData.customerEmail)) {
        throw new Error('البريد الإلكتروني غير صحيح');
      }

      console.log('🔄 إنشاء Payment Intent:', {
        productName: paymentData.productName,
        amount: paymentData.amount,
        customerEmail: paymentData.customerEmail || 'غير محدد'
      });

      // إرسال الطلب إلى API
      const response = await fetch('/api/payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'فشل في إنشاء رابط الدفع');
      }

      if (!result.success || !result.data?.redirectUrl) {
        throw new Error(result.message || 'استجابة غير صحيحة من الخادم');
      }

      console.log('✅ تم إنشاء Payment Intent بنجاح:', {
        paymentId: result.data.paymentId,
        amount: result.data.amount,
        currency: result.data.currency
      });

      // إظهار رسالة نجاح
      toast.success('تم إنشاء رابط الدفع بنجاح! 🎉', {
        description: 'سيتم توجيهك إلى صفحة الدفع...',
        duration: 3000,
      });

      return {
        success: true,
        redirectUrl: result.data.redirectUrl,
        paymentId: result.data.paymentId,
        amount: result.data.amount,
        currency: result.data.currency,
        testMode: result.data.testMode
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      
      console.error('❌ خطأ في إنشاء Payment Intent:', err);
      setError(errorMessage);

      // إظهار رسالة خطأ
      toast.error('فشل في إنشاء رابط الدفع', {
        description: errorMessage,
        duration: 5000,
      });

      return null;

    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * إعادة التوجيه إلى صفحة الدفع
   */
  const redirectToPayment = useCallback((redirectUrl: string) => {
    if (!redirectUrl) {
      toast.error('رابط الدفع غير صحيح');
      return;
    }

    try {
      // فتح رابط الدفع في نفس النافذة
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('❌ خطأ في إعادة التوجيه:', err);
      toast.error('فشل في فتح صفحة الدفع');
    }
  }, []);

  return {
    isLoading,
    error,
    createPaymentIntent,
    redirectToPayment,
  };
}

/**
 * Hook مبسط للدفع السريع
 */
export function useQuickPayment() {
  const { isLoading, error, createPaymentIntent, redirectToPayment } = usePayment();

  /**
   * دفع سريع - ينشئ Payment Intent ويعيد التوجيه مباشرة
   */
  const quickPay = useCallback(async (paymentData: PaymentData): Promise<boolean> => {
    const result = await createPaymentIntent(paymentData);
    
    if (result?.success && result.redirectUrl) {
      // انتظار قصير قبل إعادة التوجيه لإظهار رسالة النجاح
      setTimeout(() => {
        redirectToPayment(result.redirectUrl!);
      }, 1500);
      
      return true;
    }
    
    return false;
  }, [createPaymentIntent, redirectToPayment]);

  return {
    isLoading,
    error,
    quickPay,
  };
}

/**
 * Hook لإدارة حالة الدفع من URL parameters
 */
export function usePaymentStatus() {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'cancelled' | 'failed'>('idle');

  // فحص URL parameters لتحديد حالة الدفع
  const checkPaymentStatus = useCallback(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');

    if (status && paymentId) {
      switch (status) {
        case 'success':
          setPaymentStatus('success');
          toast.success('تم الدفع بنجاح! 🎉', {
            description: `معرف الدفع: ${paymentId}`,
            duration: 5000,
          });
          break;
        case 'cancelled':
          setPaymentStatus('cancelled');
          toast.info('تم إلغاء عملية الدفع', {
            description: 'يمكنك المحاولة مرة أخرى',
            duration: 4000,
          });
          break;
        case 'failed':
          setPaymentStatus('failed');
          toast.error('فشل في عملية الدفع', {
            description: 'يرجى المحاولة مرة أخرى أو التواصل مع الدعم',
            duration: 5000,
          });
          break;
      }

      // إزالة parameters من URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return {
    paymentStatus,
    checkPaymentStatus,
  };
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * تنسيق المبلغ للعرض
 */
export function formatAmount(amount: number, currency: string = 'AED'): string {
  return new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * تحويل المبلغ من فلس إلى درهم
 */
export function convertFromCents(amountInCents: number): number {
  return amountInCents / 100;
}

/**
 * تحويل المبلغ من درهم إلى فلس
 */
export function convertToCents(amount: number): number {
  return Math.round(amount * 100);
}
