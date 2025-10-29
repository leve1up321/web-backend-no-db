import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import ZiinaPayment from '@/components/ZiinaPayment';
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
  const { cart, removeFromCart, getCartTotal } = useCart();
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: t('emptyCart'),
        variant: "destructive"
      });
      return;
    }
    
    // Create order summary
    const orderSummary = cart.map(item => 
      `${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    const totalAmount = getCartTotal();
    const message = language === 'ar' 
      ? `مرحباً! أريد شراء المنتجات التالية:\n\n${orderSummary}\n\nالمجموع الكلي: ${formatPrice(totalAmount)}`
      : `Hello! I want to purchase the following products:\n\n${orderSummary}\n\nTotal: ${formatPrice(totalAmount)}`;
    
    // WhatsApp link
    const whatsappNumber = '971503492848';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    toast({
      title: language === 'ar' ? 'جاري تحويلك للواتساب...' : 'Redirecting to WhatsApp...',
    });
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1000);
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
                    <p className="text-sm text-muted-foreground">
                      {t('quantity')}: {item.quantity}
                    </p>
                    <p className="text-primary font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
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
    </Dialog>
  );
};

export default CartModal;
