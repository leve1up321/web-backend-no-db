import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createZiinaPayment, ZiinaPaymentItem } from '@/lib/ziina';
import { CreditCard } from 'lucide-react';

const ZiinaPayment: React.FC = () => {
  const { cart, getTotalPrice } = useCart();
  const { currency } = useCurrency();
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleZiinaPayment = async () => {
    console.log('Ziina payment button clicked');
    console.log('Current currency:', currency);
    console.log('Cart items:', cart);
    
    if (cart.length === 0) {
      setError(language === 'ar' ? 'السلة فارغة' : 'Cart is empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert cart items to Ziina format
      const items: ZiinaPaymentItem[] = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100), // Convert to cents
      }));

      console.log('Payment items:', items);

      const totalAmount = Math.round(getTotalPrice() * 100); // Convert to cents
      console.log('Total amount:', totalAmount);

      // Determine payment currency - Ziina supports SAR and AED primarily
      let paymentCurrency = currency;
      let convertedAmount = totalAmount;

      // Handle currency conversion for unsupported currencies
      if (!['SAR', 'AED'].includes(currency)) {
        paymentCurrency = 'AED';
        // Simple conversion rate (you should use real exchange rates)
        const conversionRate = currency === 'USD' ? 3.67 : 3.67; // USD to AED approximate
        convertedAmount = Math.round(totalAmount * conversionRate);
        
        console.log(`Converting from ${currency} to ${paymentCurrency}, amount: ${totalAmount} -> ${convertedAmount}`);
      }

      console.log('Payment currency:', paymentCurrency);

      const currentUrl = window.location.origin;
      
      const paymentData = {
        amount: convertedAmount,
        currency: paymentCurrency,
        items: items,
        success_url: `${currentUrl}/payment/success`,
        cancel_url: `${currentUrl}/payment/cancel`,
        metadata: {
          original_currency: currency,
          original_amount: totalAmount,
        }
      };

      console.log('Creating payment with data:', paymentData);

      const paymentResponse = await createZiinaPayment(paymentData);
      console.log('Payment response:', paymentResponse);

      if (paymentResponse.checkout_url) {
        // Redirect to Ziina checkout
        window.location.href = paymentResponse.checkout_url;
      } else {
        throw new Error('No checkout URL received from Ziina');
      }

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(language === 'ar' ? `خطأ في الدفع: ${errorMessage}` : `Payment error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        {isLoading 
          ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
          : (language === 'ar' ? 'إتمام الشراء' : 'Complete Purchase')
        }
      </Button>
      
      {!['SAR', 'AED'].includes(currency) && (
        <p className="text-xs text-muted-foreground text-center">
          {language === 'ar' 
            ? `سيتم تحويل المبلغ إلى درهم إماراتي (AED) للدفع`
            : `Amount will be converted to AED for payment`
          }
        </p>
      )}
    </div>
  );
};

export default ZiinaPayment;

