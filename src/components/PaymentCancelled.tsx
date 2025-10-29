import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentCancelled: React.FC = () => {
  const { language, t } = useLanguage();

  const handleReturnToCart = () => {
    window.location.href = '/';
  };

  const handleTryAgain = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى أو العودة للتسوق.'
              : 'Your payment was not completed. You can try again or continue shopping.'
            }
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {language === 'ar' 
                ? 'لم يتم خصم أي مبلغ من حسابك.'
                : 'No charges were made to your account.'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleTryAgain}
              className="w-full"
            >
              {language === 'ar' ? 'المحاولة مرة أخرى' : 'Try Again'}
            </Button>
            
            <Button 
              onClick={handleReturnToCart}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'العودة للتسوق' : 'Return to Shopping'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;

