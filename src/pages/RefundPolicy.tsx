import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">سياسة الاستبدال والاسترجاع</h1>
            <p className="text-xl opacity-90">
              تعرف على شروط وأحكام الاستبدال والاسترجاع في متجر Level Up
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ArrowRight className="h-4 w-4" />
            <span>سياسة الاستبدال والاسترجاع</span>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <div className="text-center pb-8 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                سياسة الاستبدال والاسترجاع
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                نود أن نلفت انتباهكم إلى أن منتجاتنا جميعها رقمية،
                وبناءً على ذلك، نود توضيح سياسة استرداد الأموال والاستبدال لدينا.
              </p>
            </div>

            {/* Main Policy */}
            <div className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-destructive mb-3">
                  ⚠️ تنبيه مهم
                </h3>
                <p className="text-foreground leading-relaxed">
                  يرجى العلم أنه بمجرد إتمام عملية الدفع، <strong>لا يمكن استرداد الأموال
                  واستبدال المنتج</strong> إلا في الحالات التالية فقط:
                </p>
              </div>

              {/* Exceptions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  الحالات المستثناة للاستبدال:
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          وجود خلل في المنتج
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          في حالة وجود خلل في المنتج الذي قمت بشرائه،
                          حيث يمكنك الاتصال بنا خلال <strong className="text-primary">(1 يوم)</strong> من تاريخ الشراء لطلب استبدال المنتج.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          المدة الزمنية المحددة
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          يُرجى التأكد من عدم تجاوز تاريخ الشراء <strong className="text-secondary">(1 يوم)</strong>، 
                          حيث لن يتم قبول أي طلبات استرداد أو استبدال بعد هذه المدة.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  📝 ملاحظات مهمة:
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    <span>نحن نقدر تفهمك ونتطلع إلى تقديم خدمة عالية الجودة ومنتجات ذات قيمة لك.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    <span>
                      المتجر غير مسؤول في حال طرأ تغيير في قوانين الموقع الرسمي للمنتج أو الخدمة المقدمة،
                      لأن جميع اشتراكاتنا رسمية ومن موقع الشركة نفسها.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  🤝 تحتاج مساعدة؟
                </h3>
                <p className="text-muted-foreground mb-4">
                  إذا كان لديك أي استفسار حول سياسة الاستبدال والاسترجاع، لا تتردد في التواصل معنا
                </p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  تواصل معنا
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
