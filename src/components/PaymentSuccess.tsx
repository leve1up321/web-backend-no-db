import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentSuccess: React.FC = () => {
  const { clearCart } = useCart();
  const { language, t } = useLanguage();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  const handleContinueShopping = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.'
              : 'Thank you! Your order has been received and will be processed soon.'
            }
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              {language === 'ar' 
                ? 'سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني قريباً.'
                : 'Order details will be sent to your email shortly.'
              }
            </p>
          </div>

          <Button 
            onClick={handleContinueShopping}
            className="w-full"
          >
            {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

