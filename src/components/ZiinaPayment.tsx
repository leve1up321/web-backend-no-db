import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { ziinaPayment, type ZiinaPaymentItem } from '@/lib/ziina';

interface ZiinaPaymentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { cart, getCartTotal, clearCart } = useCart();
  const { currency } = useCurrency();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: t('emptyCart'),
        variant: "destructive"
      });
      return;
    }

    // Check if currency is supported by Ziina
    if (!['AED', 'SAR'].includes(currency.code)) {
      toast({
        title: language === 'ar' ? 'عملة غير مدعومة' : 'Unsupported Currency',
        description: language === 'ar' 
          ? 'Ziina يدعم فقط الدرهم الإماراتي والريال السعودي' 
          : 'Ziina only supports AED and SAR currencies',
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payment items
      const items: ZiinaPaymentItem[] = cart.map(item => ({
        name: item.title,
        quantity: item.quantity,
        unit_amount: item.price * currency.rate, // Convert to selected currency
      }));

      const totalAmount = getCartTotal();

      // Create payment link
      const paymentResponse = await ziinaPayment.createPaymentLink({
        amount: totalAmount,
        currency: currency.code as 'AED' | 'SAR',
        items,
        success_url: `${window.location.origin}?payment=success`,
        cancel_url: `${window.location.origin}?payment=cancelled`,
      });

      // Show success message
      toast({
        title: language === 'ar' ? 'جاري تحويلك لصفحة الدفع...' : 'Redirecting to payment page...',
        description: language === 'ar' ? 'سيتم فتح صفحة Ziina للدفع' : 'Ziina payment page will open',
      });

      // Store payment info for later verification
      localStorage.setItem('ziina_payment_id', paymentResponse.id);
      localStorage.setItem('ziina_cart_backup', JSON.stringify(cart));

      // Redirect to Ziina payment page
      window.open(paymentResponse.url, '_blank');

      // Call success callback
      onSuccess?.();

    } catch (error) {
      console.error('Ziina payment failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: language === 'ar' ? 'فشل في إنشاء الدفع' : 'Payment Creation Failed',
        description: language === 'ar' 
          ? 'حدث خطأ أثناء إنشاء رابط الدفع. يرجى المحاولة مرة أخرى.' 
          : 'An error occurred while creating the payment link. Please try again.',
        variant: "destructive"
      });

      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
      size="lg"
      onClick={handleZiinaPayment}
      disabled={isLoading || cart.length === 0}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'الدفع عبر Ziina' : 'Pay with Ziina'}
        </>
      )}
    </Button>
  );
};

export default ZiinaPayment;

