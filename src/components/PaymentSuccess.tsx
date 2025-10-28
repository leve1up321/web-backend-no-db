import React, { useEffect, useState } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ziinaPayment } from '@/lib/ziina';
import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number;
    currency: string;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = localStorage.getItem('ziina_payment_id');
        if (paymentId) {
          const details = await ziinaPayment.getPaymentStatus(paymentId);
          setPaymentDetails(details);
          
          if (details.status === 'completed' || details.status === 'paid') {
            // Clear cart on successful payment
            clearCart();
            // Clear stored payment data
            localStorage.removeItem('ziina_payment_id');
            localStorage.removeItem('ziina_cart_backup');
          }
        }
      } catch (error) {
        console.error('Failed to verify payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            {language === 'ar' 
              ? 'شكراً لك! تم استلام دفعتك بنجاح.' 
              : 'Thank you! Your payment has been received successfully.'
            }
          </div>

          {paymentDetails && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                </span>
                <span>
                  {paymentDetails.amount} {paymentDetails.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === 'ar' ? 'الحالة:' : 'Status:'}
                </span>
                <span className="text-green-600 dark:text-green-400 capitalize">
                  {paymentDetails.status}
                </span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'ستتلقى رسالة تأكيد عبر البريد الإلكتروني قريباً.' 
              : 'You will receive a confirmation email shortly.'
            }
          </div>

          <div className="space-y-2">
            <Link to="/" className="block">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full" asChild>
              <Link to="/orders">
                {language === 'ar' ? 'عرض طلباتي' : 'View My Orders'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

