import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // الحصول على معلومات الدفع من URL parameters إذا كانت متاحة
    const paymentId = searchParams.get('payment_id');
    const error = searchParams.get('error');
    const errorMessage = searchParams.get('error_message');
    
    setPaymentDetails({
      paymentId,
      error,
      errorMessage
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* رسالة الإلغاء الرئيسية */}
          <Card className="text-center border-red-200 dark:border-red-800">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-800 dark:text-red-200">
                تم إلغاء عملية الدفع
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                لم يتم إتمام عملية الشراء
              </div>

              {/* تفاصيل الإلغاء */}
              {paymentDetails && (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                    تفاصيل العملية:
                  </h3>
                  <div className="space-y-2 text-sm">
                    {paymentDetails.paymentId && (
                      <div className="flex justify-between">
                        <span>رقم العملية:</span>
                        <Badge variant="destructive" className="font-mono">
                          {paymentDetails.paymentId}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>الحالة:</span>
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        ملغاة
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>التاريخ:</span>
                      <span>{new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                    {paymentDetails.errorMessage && (
                      <div className="mt-3 p-2 bg-red-100 dark:bg-red-900 rounded text-xs">
                        <strong>سبب الإلغاء:</strong> {paymentDetails.errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* أسباب محتملة للإلغاء */}
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    أسباب محتملة للإلغاء
                  </h3>
                </div>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• تم إغلاق نافذة الدفع قبل الإتمام</li>
                  <li>• مشكلة في بيانات البطاقة المصرفية</li>
                  <li>• انتهت مهلة الدفع المحددة</li>
                  <li>• إلغاء العملية من قبل المستخدم</li>
                  <li>• مشكلة تقنية مؤقتة</li>
                </ul>
              </div>

              {/* ماذا يمكنك فعله */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  ماذا يمكنك فعله؟
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• جرب عملية الدفع مرة أخرى</li>
                  <li>• تأكد من صحة بيانات البطاقة</li>
                  <li>• تحقق من رصيد البطاقة</li>
                  <li>• جرب بطاقة أخرى إذا كانت متاحة</li>
                  <li>• تواصل معنا إذا استمرت المشكلة</li>
                </ul>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    المحاولة مرة أخرى
                  </Button>
                </Link>
                
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    العودة للمتجر
                  </Button>
                </Link>
              </div>

              {/* رسالة تشجيعية */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  لا تقلق! يمكنك المحاولة مرة أخرى في أي وقت. منتجاتك ما زالت متاحة في انتظارك.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الدعم */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-center">هل تحتاج مساعدة؟</h3>
              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>فريق الدعم متاح لمساعدتك:</p>
                <div className="flex justify-center gap-4">
                  <span>📧 support@levelupstore.com</span>
                  <span>📱 واتساب: +971-XX-XXX-XXXX</span>
                </div>
                <p className="text-xs mt-2">
                  أوقات العمل: من الأحد إلى الخميس، 9 صباحاً - 6 مساءً
                </p>
              </div>
            </CardContent>
          </Card>

          {/* اقتراحات منتجات أخرى */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-center">منتجات قد تهمك</h3>
              <div className="text-center">
                <Link to="/">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    تصفح جميع المنتجات →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentCancel;
