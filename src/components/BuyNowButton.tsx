import { useState } from 'react';
import { ShoppingBag, ExternalLink, Shield, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import CustomerInfoModal from '@/components/CustomerInfoModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BuyNowButtonProps {
  product: Product;
  size?: 'sm' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
  showAddToCart?: boolean;
}

const BuyNowButton = ({ 
  product, 
  size = 'sm', 
  variant = 'default',
  className = '',
  showAddToCart = true
}: BuyNowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const handlePurchase = () => {
    setShowCustomerInfo(true);
  };

  const handleCustomerInfoSubmit = async (customerInfo: any) => {
    setIsLoading(true);
    
    try {
      console.log('Starting payment process for:', product.title);
      
      // إرسال طلب لإنشاء Payment Intent
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'AED',
          description: product.title,
          order_id: `order_${product.id}_${Date.now()}`,
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          items: [{
            name: product.title,
            price: product.price,
            quantity: 1
          }]
        })
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'خطأ في الاتصال بالخادم' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'خطأ في إنشاء رابط الدفع');
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.success && data.data && data.data.payment_url) {
        // فتح رابط الدفع في نافذة جديدة
        console.log('Opening payment URL:', data.data.payment_url);
        window.location.href = data.data.payment_url;
      } else {
        throw new Error('لم يتم الحصول على رابط الدفع');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      
      // في حالة فشل الـ API، استخدم الروابط الثابتة كـ fallback
      if (product.paymentLink) {
        console.log('Falling back to static payment link');
        window.open(product.paymentLink, '_blank');
      } else {
        alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء رابط الدفع');
      }
    } finally {
      setIsLoading(false);
      setShowCustomerInfo(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري التحميل...
            </div>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              شراء الآن
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            تأكيد عملية الشراء
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right space-y-4">
            <div className="bg-card/50 p-4 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">{product.title}</h4>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-4 w-4" />
                <span>دفع آمن عبر Ziina</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <ExternalLink className="h-4 w-4" />
                <span>سيتم فتح صفحة الدفع في نافذة جديدة</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-xs">
              بالضغط على "متابعة للدفع" ستتم إعادة توجيهك إلى صفحة الدفع الآمنة.
              بعد إتمام الدفع بنجاح، ستحصل على رابط التحميل عبر البريد الإلكتروني.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePurchase}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            متابعة للدفع
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {showAddToCart && (
      <Button
        size={size}
        variant="outline"
        onClick={handleAddToCart}
        className="border-primary text-primary hover:bg-primary hover:text-white whitespace-nowrap"
      >
        <Plus className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">إضافة للسلة</span>
        <span className="sm:hidden">إضافة</span>
      </Button>
    )}
    
    {/* نموذج بيانات العميل */}
    <CustomerInfoModal
      isOpen={showCustomerInfo}
      onClose={() => setShowCustomerInfo(false)}
      onSubmit={handleCustomerInfoSubmit}
      isLoading={isLoading}
    />
    </div>
  );
};

export default BuyNowButton;
