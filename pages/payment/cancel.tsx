import { useRouter } from 'next/router';
import { XCircle, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentCancel = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    // العودة لصفحة المنتجات لإعادة المحاولة
    router.push('/#products');
  };

  const handleBackToStore = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    // فتح البريد الإلكتروني أو الدردشة
    window.location.href = 'mailto:support@levelup-store.com?subject=مساعدة في عملية الدفع';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(126, 0, 255, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 150, 255, 0.06) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px',
               backgroundPosition: 'center center'
             }}>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-orange-200 dark:border-orange-800 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-orange-500 mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              😔 تم إلغاء عملية الدفع
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              لا تقلق! لم يتم خصم أي مبلغ من حسابك. يمكنك إعادة المحاولة في أي وقت.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* أسباب محتملة للإلغاء */}
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-lg text-orange-900 dark:text-orange-100 mb-3">
                🤔 أسباب محتملة للإلغاء
              </h3>
              <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>تم إغلاق نافذة الدفع قبل إكمال العملية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>انتهت مهلة جلسة الدفع (عادة 30 دقيقة)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>مشكلة تقنية مؤقتة في بوابة الدفع</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>اختيار إلغاء العملية من صفحة الدفع</span>
                </li>
              </ul>
            </div>

            {/* الخطوات التالية */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">✨ ماذا يمكنك فعله الآن؟</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      🔄 إعادة المحاولة
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      يمكنك العودة لصفحة المنتجات وإعادة المحاولة. العملية آمنة 100%
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      💬 تواصل معنا
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      إذا واجهت مشكلة تقنية، فريق الدعم جاهز لمساعدتك
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* نصائح للدفع الناجح */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">💡 نصائح للدفع الناجح</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>تأكد من استقرار اتصال الإنترنت</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>لا تغلق نافذة الدفع حتى تكتمل العملية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>تأكد من صحة بيانات البطاقة المصرفية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>تأكد من وجود رصيد كافي في الحساب</span>
                </li>
              </ul>
            </div>

            {/* أزرار العمل */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleRetryPayment}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                إعادة المحاولة
              </Button>
              
              <Button 
                onClick={handleContactSupport}
                variant="outline"
                className="flex-1 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/20 text-green-700 dark:text-green-300"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                تواصل معنا
              </Button>
            </div>

            {/* زر العودة للمتجر */}
            <div className="text-center pt-2">
              <Button 
                onClick={handleBackToStore}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                العودة للمتجر
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* معلومات الدعم */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                نحن هنا لمساعدتك! 
                <a href="mailto:support@levelup-store.com" className="text-primary hover:underline ml-1">
                  support@levelup-store.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;
