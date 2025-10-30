import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const PaymentCancel = () => {
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
          
          // تحديث حالة الطلب إلى ملغي
          const updatedOrder = {
            ...order,
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          };
          localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
        } catch (error) {
          console.error('Error parsing order details:', error);
        }
      }
    }
  }, [orderId]);

  const handleRetryPayment = () => {
    // إعادة المحاولة - يمكن إعادة توجيه المستخدم لصفحة الدفع
    if (orderDetails) {
      // إعادة تعيين حالة الطلب إلى pending
      const updatedOrder = {
        ...orderDetails,
        status: 'pending',
        retry_at: new Date().toISOString()
      };
      localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    }
  };

  const handleContactSupport = () => {
    const message = language === 'ar' 
      ? `مرحباً، واجهت مشكلة في الدفع للطلب رقم: ${orderId}. أحتاج مساعدة.`
      : `Hello, I encountered a payment issue with order ID: ${orderId}. I need assistance.`;
    
    const whatsappUrl = `https://wa.me/971503492848?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-800 mb-2">
            {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            {language === 'ar' 
              ? 'لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى.'
              : 'Payment was not completed. You can try again.'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* معلومات الطلب */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">
                {language === 'ar' ? 'تفاصيل الطلب المُلغى' : 'Cancelled Order Details'}
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
                    {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                  </span>
                  <span className="font-bold text-lg">
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
              </div>
            </div>
          )}

          {/* أسباب محتملة للإلغاء */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">
              {language === 'ar' ? 'أسباب محتملة للإلغاء:' : 'Possible reasons for cancellation:'}
            </h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• {language === 'ar' ? 'تم إغلاق نافذة الدفع' : 'Payment window was closed'}</li>
              <li>• {language === 'ar' ? 'انتهت مهلة الدفع' : 'Payment timeout'}</li>
              <li>• {language === 'ar' ? 'مشكلة في الاتصال' : 'Connection issue'}</li>
              <li>• {language === 'ar' ? 'إلغاء من المستخدم' : 'User cancellation'}</li>
            </ul>
          </div>

          {/* خيارات العمل */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link to="/">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                </Link>
              </Button>
              
              <Button 
                onClick={handleContactSupport}
                variant="outline" 
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تواصل معنا' : 'Contact Support'}
              </Button>
            </div>

            <Button 
              asChild 
              variant="ghost" 
              className="w-full"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
              </Link>
            </Button>
          </div>

          {/* رسالة تشجيعية */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800">
              {language === 'ar' 
                ? 'لا تقلق! منتجاتك محفوظة في السلة. يمكنك إتمام الشراء في أي وقت.'
                : "Don't worry! Your items are saved in the cart. You can complete your purchase anytime."
              }
            </p>
          </div>

          {/* معلومات الدعم */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">
              {language === 'ar' ? 'تحتاج مساعدة فورية؟' : 'Need immediate help?'}
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

export default PaymentCancel;

