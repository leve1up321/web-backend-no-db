import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      // جلب تفاصيل الطلب من localStorage
      const savedOrder = localStorage.getItem(`order_${orderId}`);
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);
          setOrderDetails(order);
          
          // تحديث حالة الطلب إلى مكتمل
          const updatedOrder = {
            ...order,
            status: 'completed',
            completed_at: new Date().toISOString()
          };
          localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
        } catch (error) {
          console.error('Error parsing order details:', error);
        }
      }
    }
  }, [orderId]);

  const handleContinueShopping = () => {
    // مسح السلة بعد الدفع الناجح
    localStorage.removeItem('cart');
    // يمكن إضافة منطق إضافي هنا مثل إرسال إشعار للإدارة
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800 mb-2">
            {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            {language === 'ar' 
              ? 'شكراً لك! تم إتمام عملية الشراء بنجاح'
              : 'Thank you! Your purchase has been completed successfully'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* معلومات الطلب */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}
                  </span>
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                    {orderId}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'المجموع الكلي:' : 'Total Amount:'}
                  </span>
                  <span className="font-bold text-lg text-green-600">
                    {formatPrice(orderDetails.total)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'عدد المنتجات:' : 'Items Count:'}
                  </span>
                  <span className="font-semibold">
                    {orderDetails.items?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'تاريخ الطلب:' : 'Order Date:'}
                  </span>
                  <span className="text-sm">
                    {new Date(orderDetails.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-AE' : 'en-US'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* رسالة إضافية */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-center">
              {language === 'ar' 
                ? 'سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني قريباً. شكراً لاختيارك Level Up Store!'
                : 'Order confirmation will be sent to your email shortly. Thank you for choosing Level Up Store!'
              }
            </p>
          </div>

          {/* أزرار العمل */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              asChild 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleContinueShopping}
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="flex-1"
            >
              <Link to="/orders">
                <Package className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'طلباتي' : 'My Orders'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* معلومات الدعم */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">
              {language === 'ar' ? 'هل تحتاج مساعدة؟' : 'Need help?'}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a 
                href="mailto:leve1up999q@gmail.com" 
                className="text-blue-600 hover:underline"
              >
                {language === 'ar' ? 'راسلنا' : 'Email Us'}
              </a>
              <span className="text-gray-300">|</span>
              <a 
                href="https://wa.me/971503492848" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

