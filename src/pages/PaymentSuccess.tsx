// صفحة نجاح الدفع
// Payment Success Page

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // الحصول على معلومات الدفع من URL parameters إذا كانت متاحة
    const paymentId = searchParams.get('payment_id');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    
    if (paymentId) {
      setPaymentDetails({
        paymentId,
        amount: amount ? parseFloat(amount) : null,
        currency: currency || 'AED'
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* رسالة النجاح الرئيسية */}
          <Card className="text-center border-green-200 dark:border-green-800">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                تم الدفع بنجاح! 🎉
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                شكراً لك على شرائك من متجر لفل اب
              </div>

              {/* تفاصيل الدفع */}
              {paymentDetails && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                    تفاصيل العملية:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>رقم العملية:</span>
                      <Badge variant="secondary" className="font-mono">
                        {paymentDetails.paymentId}
                      </Badge>
                    </div>
                    {paymentDetails.amount && (
                      <div className="flex justify-between">
                        <span>المبلغ:</span>
                        <span className="font-semibold">
                          {paymentDetails.amount} {paymentDetails.currency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>التاريخ:</span>
                      <span>{new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* رسالة التسليم */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                    تسليم المنتج
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  سيتم إرسال رابط التحميل إلى بريدك الإلكتروني خلال دقائق قليلة.
                  إذا لم تستلم الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها.
                </p>
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ماذا بعد؟</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• ستحصل على رابط التحميل عبر البريد الإلكتروني</li>
                  <li>• يمكنك تحميل المنتج في أي وقت</li>
                  <li>• احتفظ برقم العملية للمراجعة</li>
                  <li>• في حالة وجود مشاكل، تواصل معنا</li>
                </ul>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Home className="w-4 h-4 mr-2" />
                    العودة للمتجر
                  </Button>
                </Link>
                
                <Link to="/profile" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    مشترياتي
                  </Button>
                </Link>
              </div>

              {/* رسالة شكر */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  نقدر ثقتك في متجر لفل اب ونتطلع لخدمتك مرة أخرى
                </p>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الدعم */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-center">هل تحتاج مساعدة؟</h3>
              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>تواصل معنا عبر:</p>
                <div className="flex justify-center gap-4">
                  <span>📧 support@levelupstore.com</span>
                  <span>📱 واتساب: +971-XX-XXX-XXXX</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
