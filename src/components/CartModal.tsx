import { useState } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import ZiinaPayment from '@/components/ZiinaPayment';
import CustomerInfoModal from '@/components/CustomerInfoModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: t('emptyCart'),
        variant: "destructive"
      });
      return;
    }
    
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
      
      // الدفع المباشر عبر زينة باستخدام الخادم المنفصل
      toast({
        title: language === 'ar' ? 'جاري إنشاء رابط الدفع...' : 'Creating payment link...',
        description: language === 'ar' ? 'يرجى الانتظار...' : 'Please wait...',
      });

      // استخدام API routes الداخلية في Next.js
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'AED',
          description: `Level Up Store - ${orderDescription}`,
          order_id: orderId,
          items: cart,
          customer_email: '', // يمكن إضافة نموذج لجمع البريد الإلكتروني
          customer_name: '', // يمكن إضافة نموذج لجمع الاسم
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.payment_url) {
        toast({
          title: language === 'ar' ? 'جاري تحويلك لصفحة الدفع...' : 'Redirecting to payment page...',
          description: language === 'ar' ? 'سيتم فتح زينة في نافذة جديدة' : 'Ziina will open in a new window',
        });
        
        // فتح صفحة الدفع في نافذة جديدة
        window.open(data.payment_url, '_blank');
        
        // إغلاق النافذة بعد تأخير قصير
        setTimeout(() => {
          onClose();
        }, 1000);
        
      } else {
        throw new Error(data.message || 'Failed to create payment');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      toast({
        title: language === 'ar' ? 'خطأ في إنشاء الدفعة' : 'Payment creation error',
        description: language === 'ar' 
          ? 'حدث خطأ أثناء إنشاء رابط الدفع. يرجى المحاولة مرة أخرى أو التواصل معنا.'
          : 'An error occurred while creating the payment link. Please try again or contact us.',
        variant: "destructive"
      });
      
      // كخيار احتياطي، فتح واتساب
      const orderSummary = cart.map(item => 
        `${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
      ).join('\n');
      
      const totalAmount = getCartTotal();
      const message = language === 'ar' 
        ? `مرحباً! أريد شراء المنتجات التالية:\n\n${orderSummary}\n\nالمجموع الكلي: ${formatPrice(totalAmount)}\n\nملاحظة: واجهت مشكلة في نظام الدفع الإلكتروني`
        : `Hello! I want to purchase the following products:\n\n${orderSummary}\n\nTotal: ${formatPrice(totalAmount)}\n\nNote: I encountered an issue with the online payment system`;
      
      const whatsappNumber = '971503492848';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);
    }
  };

  const handleCustomerInfoSubmit = async (customerInfo: any) => {
    setIsProcessing(true);
    
    try {
      // إنشاء Payment Intent مع بيانات السلة
      const response = await fetch('/api/payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          totalAmount: getCartTotal(),
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // توجيه المستخدم لصفحة الدفع
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: language === 'ar' ? 'خطأ في الدفع' : 'Payment Error',
        description: language === 'ar' ? 'حدث خطأ أثناء إنشاء الدفع' : 'An error occurred while creating payment',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setShowCustomerInfo(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('cart')}</DialogTitle>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('emptyCart')}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                    
                    {/* أزرار تحديث الكمية */}
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[2rem] text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-primary font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{t('total')}:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Ziina Payment Button */}
                <ZiinaPayment />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {language === 'ar' ? 'أو' : 'or'}
                    </span>
                  </div>
                </div>
                
                {/* WhatsApp Payment Button */}
                <Button 
                  variant="outline"
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  {t('checkout')} (WhatsApp)
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
      
      {/* نموذج بيانات العميل */}
      <CustomerInfoModal
        isOpen={showCustomerInfo}
        onClose={() => setShowCustomerInfo(false)}
        onSubmit={handleCustomerInfoSubmit}
        isLoading={isProcessing}
      />
    </Dialog>
  );
};

export default CartModal;
