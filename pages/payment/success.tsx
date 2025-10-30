import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      // جلب تفاصيل الطلب من API
      fetchOrderDetails(session_id);
    }
  }, [session_id]);

  const fetchOrderDetails = async (sessionId) => {
    try {
      const response = await fetch(`/api/order/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.order);
      } else {
        // في حالة عدم وجود الطلب، استخدام بيانات افتراضية
        setOrderDetails({
          id: sessionId,
          productName: 'منتج رقمي',
          amount: 0,
          currency: 'AED',
          customerEmail: 'customer@example.com',
          downloadLink: '#',
          orderNumber: `LU-${sessionId.slice(-6)}`
        });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      // استخدام بيانات افتراضية في حالة الخطأ
      setOrderDetails({
        id: sessionId,
        productName: 'منتج رقمي',
        amount: 0,
        currency: 'AED',
        customerEmail: 'customer@example.com',
        downloadLink: '#',
        orderNumber: `LU-${sessionId.slice(-6)}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (orderDetails?.downloadLink && orderDetails.downloadLink !== '#') {
      // فتح رابط التحميل
      window.open(orderDetails.downloadLink, '_blank');
    } else {
      alert('رابط التحميل غير متوفر حالياً. يرجى التحقق من بريدك الإلكتروني.');
    }
  };

  const handleBackToStore = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        {/* Grid Background - نفس خلفية الموقع */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(140, 0, 255, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 255, 209, 0.06) 1px, transparent 1px)
                 `,
                 backgroundSize: '50px 50px',
                 backgroundPosition: 'center center'
               }}>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-center mt-4 text-muted-foreground">جاري التحقق من الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Grid Background - نفس خلفية الموقع */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(140, 0, 255, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 255, 209, 0.06) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px',
               backgroundPosition: 'center center'
             }}>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎉 تم الدفع بنجاح!
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              شكراً لك! تم تأكيد طلبك وسيتم إرسال تفاصيل المنتج إلى بريدك الإلكتروني.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* تفاصيل الطلب */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">📋 تفاصيل الطلب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">رقم الطلب:</span>
                  <span className="font-mono ml-2 font-semibold">{orderDetails?.orderNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">المبلغ:</span>
                  <span className="ml-2 font-semibold">{orderDetails?.amount} {orderDetails?.currency}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">المنتج:</span>
                  <span className="ml-2 font-semibold">{orderDetails?.productName}</span>
                </div>
              </div>
            </div>

            {/* الخطوات التالية */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">✨ الخطوات التالية</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      📧 تحقق من بريدك الإلكتروني
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      ستصلك رسالة تأكيد مع رابط التحميل خلال دقائق قليلة على: {orderDetails?.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Download className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      💾 تحميل المنتج
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      يمكنك تحميل المنتج مباشرة من الرابط في البريد الإلكتروني
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار العمل */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                تحميل المنتج الآن
              </Button>
              
              <Button 
                onClick={handleBackToStore}
                variant="outline"
                className="flex-1 border-primary/20 hover:bg-primary/5"
                size="lg"
              >
                العودة للمتجر
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* معلومات الدعم */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                هل تحتاج مساعدة؟ 
                <a href="mailto:support@levelup-store.com" className="text-primary hover:underline ml-1">
                  تواصل معنا
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
