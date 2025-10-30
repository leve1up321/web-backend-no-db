import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Download, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

const PaymentSuccess = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { order_id, payment_id } = router.query;
    
    if (order_id) {
      // محاولة الحصول على تفاصيل الطلب من localStorage
      const savedOrder = localStorage.getItem(`order_${order_id}`);
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      }
      setLoading(false);
    }
  }, [router.query]);

  const handleDownload = () => {
    // منطق تحميل المنتج الرقمي
    console.log('Downloading digital product...');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <Card className="border-green-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-800 mb-2">
                {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
              </CardTitle>
              <p className="text-lg text-green-600">
                {language === 'ar' 
                  ? 'شكراً لك على الشراء من Level Up Store' 
                  : 'Thank you for your purchase from Level Up Store'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {orderDetails && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'ar' ? 'تفاصيل الطلب:' : 'Order Details:'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}
                      </span>
                      <span className="ml-2">{router.query.order_id}</span>
                    </div>
                    
                    {router.query.payment_id && (
                      <div>
                        <span className="font-medium">
                          {language === 'ar' ? 'رقم الدفعة:' : 'Payment ID:'}
                        </span>
                        <span className="ml-2">{router.query.payment_id}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium">
                        {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                      </span>
                      <span className="ml-2">{orderDetails.total} AED</span>
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">
                      {language === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check Your Email'}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {language === 'ar' 
                        ? 'سيتم إرسال رابط تحميل المنتج إلى بريدك الإلكتروني خلال دقائق قليلة.'
                        : 'A download link for your digital product will be sent to your email within a few minutes.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'تحميل المنتج' : 'Download Product'}
                </Button>
                
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
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

export default PaymentSuccess;
