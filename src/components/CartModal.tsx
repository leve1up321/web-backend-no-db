import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
      <DialogContent className="max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t('cart')}</DialogTitle>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
            {t('emptyCart')}
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border border-border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate text-sm sm:text-base leading-tight">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('quantity')}: {item.quantity}
                    </p>
                    <p className="text-primary font-semibold text-sm sm:text-base">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-semibold">{t('total')}:</span>
                <span className="text-lg sm:text-2xl font-bold text-primary">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <Button 
                className="w-full text-sm sm:text-base" 
                size="lg"
                onClick={handleCheckout}
              >
                {t('checkout')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
