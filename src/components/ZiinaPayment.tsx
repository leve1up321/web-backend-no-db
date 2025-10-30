import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ziinaGateway, ZiinaPaymentRequest } from '@/lib/ziina';
import { CreditCard } from 'lucide-react';

const ZiinaPayment: React.FC = () => {
  const { cart, getCartTotal } = useCart();
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
      // إنشاء رقم طلب فريد
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // إنشاء وصف الطلب
      const orderDescription = cart.map(item => 
        `${item.title} x${item.quantity}`
      ).join(', ');
      
      const totalAmount = getCartTotal();
      
      // حفظ تفاصيل الطلب في localStorage
      const orderDetails = {
        id: orderId,
        items: cart,
        total: totalAmount,
        currency: 'AED',
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderDetails));

      // مؤقتاً: استخدام واتساب مباشرة حتى يتم إعداد الخادم
      // في المستقبل، ستحتاج لخادم Node.js أو Next.js لاستخدام مفاتيح Ziina بأمان
      
      const orderSummary = cart.map(item => 
        `${item.title} x${item.quantity} - ${item.price * item.quantity} AED`
      ).join('\n');
      
      const message = language === 'ar' 
        ? `مرحباً! أريد شراء المنتجات التالية:\n\n${orderSummary}\n\nالمجموع الكلي: ${totalAmount} AED\n\nرقم الطلب: ${orderId}\n\nأريد الدفع عبر زينة (Ziina)`
        : `Hello! I want to purchase the following products:\n\n${orderSummary}\n\nTotal: ${totalAmount} AED\n\nOrder ID: ${orderId}\n\nI want to pay via Ziina`;
      
      const whatsappNumber = '971503492848';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // فتح واتساب مباشرة
      window.open(whatsappUrl, '_blank');
      
      // إظهار رسالة للمستخدم
      alert(language === 'ar' 
        ? 'تم فتح واتساب لإتمام عملية الشراء. سيتم التواصل معك لترتيب الدفع عبر زينة.'
        : 'WhatsApp has been opened to complete your purchase. We will contact you to arrange payment via Ziina.');
      
      return; // إنهاء الدالة هنا

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(language === 'ar' ? `خطأ في الدفع: ${errorMessage}` : `Payment error: ${errorMessage}`);
      
      // كخيار احتياطي، فتح واتساب
      const orderSummary = cart.map(item => 
        `${item.title} x${item.quantity} - ${item.price * item.quantity} AED`
      ).join('\n');
      
      const totalAmount = getCartTotal();
      const message = language === 'ar' 
        ? `مرحباً! أريد شراء المنتجات التالية:\n\n${orderSummary}\n\nالمجموع الكلي: ${totalAmount} AED\n\nملاحظة: واجهت مشكلة في نظام الدفع الإلكتروني`
        : `Hello! I want to purchase the following products:\n\n${orderSummary}\n\nTotal: ${totalAmount} AED\n\nNote: I encountered an issue with the online payment system`;
      
      const whatsappNumber = '971503492848';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);
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
          ? (language === 'ar' ? 'جاري التوجيه لبوابة الدفع...' : 'Redirecting to payment gateway...') 
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
