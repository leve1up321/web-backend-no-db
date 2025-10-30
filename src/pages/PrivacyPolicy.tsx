import React from 'react';
import { ArrowRight, Shield, Lock, Eye, UserCheck, FileText, AlertTriangle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">🧾 اتفاقية الاستخدام – متجر Level Up</h1>
            <p className="text-xl opacity-90">
              شروط وأحكام الاستخدام وسياسة الخصوصية
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
            <span>سياسة الاستخدام والخصوصية</span>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <div className="text-center pb-8 border-b border-border">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  اتفاقية الاستخدام
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                مرحبًا بكم في متجر Level Up، المتخصص ببيع الألعاب الرقمية، الأكواد، الحسابات والمنتجات الإلكترونية.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
                <p className="text-foreground font-medium">
                  باستخدامك لهذا المتجر، فأنت توافق على الشروط والأحكام التالية وتُقرّ أنك تملك الأهلية القانونية الكاملة للتعامل الإلكتروني وفق القوانين المعمول بها في دولة الإمارات العربية المتحدة
                </p>
              </div>
            </div>

            {/* Definitions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة الأولى – التعريفات</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">المتجر:</h4>
                  <p className="text-muted-foreground">متجر Level Up الإلكتروني بكافة قنواته (الموقع الإلكتروني – التطبيق – الدعم الفني).</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">المستهلك:</h4>
                  <p className="text-muted-foreground">كل شخص يقوم بشراء منتج أو خدمة رقمية من المتجر.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">الاتفاقية:</h4>
                  <p className="text-muted-foreground">جميع الشروط والأحكام الموضحة في هذه الوثيقة.</p>
                </div>
              </div>
            </div>

            {/* User Eligibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة الثانية – أهلية المستخدم</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">يشترط أن يكون عمر المستخدم 18 سنة أو أكثر.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">في حال الشراء من قبل قاصر، يتحمل ولي أمره كامل المسؤولية القانونية عن العملية.</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة الثالثة – طبيعة الخدمات</h3>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-3">يقدم المتجر منتجات رقمية تشمل:</h4>
                <p className="text-muted-foreground mb-4">
                  🔹 ألعاب فيديو، اشتراكات، بطاقات رقمية، أكواد تفعيل، حسابات رسمية.
                </p>
                <p className="text-foreground font-medium">
                  جميع المنتجات رقمية وغير مادية، ويتم تسليمها إلكترونيًا.
                </p>
              </div>
            </div>

            {/* Platform Usage */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-semibold text-foreground">المادة الرابعة – استخدام المنصة</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">⚠️</span>
                  <p className="text-muted-foreground">يُمنع استخدام الموقع في أي نشاط غير قانوني أو يتعارض مع القوانين المحلية أو الشريعة الإسلامية.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">⚠️</span>
                  <p className="text-muted-foreground">يُمنع إساءة استخدام المنتجات الرقمية أو إعادة بيعها بطرق مخالفة.</p>
                </div>
              </div>
            </div>

            {/* Account Responsibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة الخامسة – الحسابات والمسؤولية</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>مسؤولية المستخدم:</strong> يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات حسابه وكلمة المرور.
                  </p>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>إخلاء المسؤولية:</strong> لا يتحمل المتجر أي أضرار ناتجة عن سوء استخدام الحساب أو مشاركته مع الآخرين.
                  </p>
                </div>
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>البيانات الخاطئة:</strong> في حال ثبوت تقديم بيانات غير صحيحة، يحق للمتجر تعليق أو إلغاء الحساب دون إشعار مسبق.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment and Delivery */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة السادسة – الدفع والتسليم</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>طرق الدفع:</strong> تتم عمليات الدفع إلكترونيًا عبر الوسائل المتاحة في المتجر.
                  </p>
                </div>
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>مدة التسليم:</strong> بعد إتمام الدفع يتم تسليم المنتج خلال مدة تتراوح بين 5 دقائق إلى 6 ساعات كحد أقصى.
                  </p>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>الأسعار:</strong> جميع الأسعار معروضة بالعملة المحلية، وقد تتغير حسب العرض أو الضريبة.
                  </p>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">المادة السابعة – سياسة الضمان والاستبدال</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h4 className="font-semibold text-primary mb-3">🏆 الضمان الذهبي</h4>
                  <p className="text-foreground">
                    جميع الحسابات والأكواد تشمل ضمان ذهبي لمدة <strong>6 أشهر</strong> ضد أي مشكلة في التفعيل أو الوصول.
                  </p>
                </div>
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>طبيعة المنتجات:</strong> لا يمكن استرجاع أو استبدال المنتج بعد التسليم نظرًا لطبيعته الرقمية.
                  </p>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>الدعم الفني:</strong> في حال وجود مشكلة حقيقية بالمنتج، يتم مراجعة الحالة من قبل الدعم الفني خلال 24 ساعة.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  🤝 التواصل والدعم
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                التواصل الرسمي يكون عبر البريد الإلكتروني المسجّل في المنصة أو من خلال صفحة اتصل بنا
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  تواصل معنا
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/refund-policy" 
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  سياسة الاستبدال
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Final Agreement */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🛡️ إقرار الموافقة
              </h3>
              <p className="text-foreground font-medium">
                بإتمامك عملية الشراء فإنك تؤكد موافقتك الكاملة على جميع الشروط والأحكام المذكورة أعلاه.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                تخضع هذه الاتفاقية لأنظمة دولة الإمارات العربية المتحدة، وأي نزاع يُحال للجهات المختصة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
