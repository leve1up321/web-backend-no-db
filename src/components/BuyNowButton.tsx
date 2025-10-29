import { useState } from 'react';
import { ShoppingBag, ExternalLink, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

const BuyNowButton = ({ 
  product, 
  size = 'sm', 
  variant = 'default',
  className = '' 
}: BuyNowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice } = useCurrency();

  const handlePurchase = () => {
    setIsLoading(true);
    
    // إضافة تأخير بسيط لتحسين تجربة المستخدم
    setTimeout(() => {
      window.open(product.paymentLink, '_blank');
      setIsLoading(false);
    }, 500);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={`bg-gradient-to-r from-primary to-secondary hover:opacity-90 ${className}`}
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
  );
};

export default BuyNowButton;
