import React from 'react';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const PaymentCancelled: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            {language === 'ar' 
              ? 'لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.' 
              : 'Your payment was not completed. You can try again or choose a different payment method.'
            }
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              {language === 'ar' ? 'ماذا يمكنك فعله الآن؟' : 'What can you do now?'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {language === 'ar' ? 'العودة إلى سلة التسوق والمحاولة مرة أخرى' : 'Return to cart and try again'}</li>
              <li>• {language === 'ar' ? 'استخدام طريقة دفع أخرى (واتساب)' : 'Use another payment method (WhatsApp)'}</li>
              <li>• {language === 'ar' ? 'متابعة التسوق لإضافة المزيد من المنتجات' : 'Continue shopping for more products'}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link to="/" className="block">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Restore cart from backup if available
                const cartBackup = localStorage.getItem('ziina_cart_backup');
                if (cartBackup) {
                  // This would need to be implemented in CartContext
                  console.log('Restoring cart:', cartBackup);
                }
                // Open cart modal or navigate to cart
                window.location.href = '/#cart';
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'العودة لسلة التسوق' : 'Back to Cart'}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            {language === 'ar' 
              ? 'إذا واجهت مشكلة، يرجى التواصل معنا عبر واتساب' 
              : 'If you encountered an issue, please contact us via WhatsApp'
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;

