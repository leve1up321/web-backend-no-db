import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

const PaymentCancel = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const { order_id } = router.query;
    
    if (order_id) {
      // محاولة الحصول على تفاصيل الطلب من localStorage
      const savedOrder = localStorage.getItem(`order_${order_id}`);
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      }
    }
  }, [router.query]);

  const handleRetryPayment = () => {
    // إعادة المحاولة - العودة إلى صفحة الدفع
    if (orderDetails) {
      router.push('/checkout');
    } else {
      router.push('/');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    // فتح واتساب للدعم
    const message = language === 'ar' 
      ? `مرحباً، واجهت مشكلة في عملية الدفع. رقم الطلب: ${router.query.order_id || 'غير متوفر'}`
      : `Hello, I encountered an issue with payment. Order ID: ${router.query.order_id || 'Not available'}`;
    
    const whatsappUrl = `https://wa.me/971503492848?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-orange-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <Card className="border-red-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-800 mb-2">
                {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
              </CardTitle>
              <p className="text-lg text-red-600">
                {language === 'ar' 
                  ? 'لم تكتمل عملية الدفع' 
                  : 'Your payment was not completed'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {orderDetails && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'ar' ? 'تفاصيل الطلب المُلغى:' : 'Cancelled Order Details:'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}
                      </span>
                      <span className="ml-2">{router.query.order_id}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                      </span>
                      <span className="ml-2">{orderDetails.total} AED</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'الحالة:' : 'Status:'}
                      </span>
                      <span className="ml-2 text-red-600 font-medium">
                        {language === 'ar' ? 'مُلغى' : 'Cancelled'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'التاريخ:' : 'Date:'}
                      </span>
                      <span className="ml-2">
                        {new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  {language === 'ar' ? 'ماذا حدث؟' : 'What happened?'}
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  {language === 'ar' 
                    ? 'تم إلغاء عملية الدفع. قد يكون السبب:'
                    : 'The payment process was cancelled. This could be due to:'}
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>
                    {language === 'ar' 
                      ? 'إلغاء العملية من قبلك'
                      : 'You cancelled the payment process'}
                  </li>
                  <li>
                    {language === 'ar' 
                      ? 'مشكلة تقنية مؤقتة'
                      : 'A temporary technical issue'}
                  </li>
                  <li>
                    {language === 'ar' 
                      ? 'انتهاء وقت جلسة الدفع'
                      : 'Payment session timeout'}
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  {language === 'ar' ? 'لا تقلق!' : "Don't worry!"}
                </h4>
                <p className="text-sm text-blue-600">
                  {language === 'ar' 
                    ? 'لم يتم خصم أي مبلغ من حسابك. يمكنك المحاولة مرة أخرى أو التواصل معنا للمساعدة.'
                    : 'No amount has been charged to your account. You can try again or contact us for assistance.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleRetryPayment}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                </Button>
                
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Support'}
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleBackToHome}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'ar' ? 'هل تحتاج مساعدة؟' : 'Need help?'}
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <a 
                    href="mailto:leve1up999q@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    {language === 'ar' ? 'راسلنا' : 'Email Us'}
                  </a>
                  <a 
                    href="https://wa.me/971503492848" 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PaymentCancel;
