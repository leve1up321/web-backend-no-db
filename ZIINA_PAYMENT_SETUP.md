# دليل إعداد بوابة الدفع زينة (Ziina Payment Gateway)

## نظرة عامة
تم تكامل بوابة الدفع زينة مع Level Up Store لتوفير تجربة دفع آمنة وسهلة للعملاء في دولة الإمارات العربية المتحدة.

## المتطلبات
- حساب Ziina Business
- مفاتيح API من لوحة تحكم Ziina
- Next.js 13+
- Node.js 18+

## الإعداد

### 1. متغيرات البيئة
أضف المتغيرات التالية إلى ملف `.env`:

```env
# Ziina Payment Gateway Configuration
ZIINA_SECRET_KEY=your_ziina_secret_key_here
ZIINA_WEBHOOK_SECRET=your_ziina_webhook_secret_here

# Base URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Email Service
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_admin_email@example.com
SUPPORT_EMAIL=your_support_email@example.com

# Security
JWT_SECRET=your_jwt_secret_here

# Environment
NODE_ENV=production
```

### 2. الحصول على مفاتيح Ziina
1. سجل الدخول إلى [لوحة تحكم Ziina Business](https://business.ziina.com)
2. انتقل إلى قسم "API Keys"
3. انسخ `Secret Key` و `Webhook Secret`
4. أضفهما إلى ملف `.env`

### 3. إعداد Webhook
1. في لوحة تحكم Ziina، انتقل إلى إعدادات Webhook
2. أضف URL: `https://your-domain.com/api/payment/webhook`
3. فعّل الأحداث التالية:
   - `payment.completed`
   - `payment.failed`
   - `payment.cancelled`

## الملفات المضافة

### 1. مكتبة Ziina (`src/lib/ziina.ts`)
- فئة `ZiinaPaymentGateway` لإدارة العمليات
- دوال إنشاء الدفعات والتحقق من الحالة
- التحقق من صحة Webhook

### 2. API Endpoints
- `src/pages/api/payment/create.ts` - إنشاء دفعة جديدة
- `src/pages/api/payment/webhook.ts` - معالجة إشعارات Ziina

### 3. صفحات الدفع
- `src/pages/payment/success.tsx` - صفحة نجاح الدفع
- `src/pages/payment/cancel.tsx` - صفحة إلغاء الدفع

### 4. ملفات الإعداد
- `.env` - متغيرات البيئة الفعلية
- `.env.example` - مثال على متغيرات البيئة

## كيفية العمل

### 1. عملية الدفع
1. العميل يضيف منتجات إلى السلة
2. يضغط على "الدفع"
3. يتم إنشاء طلب فريد وحفظه في localStorage
4. يتم استدعاء API لإنشاء رابط دفع Ziina
5. يتم توجيه العميل إلى صفحة الدفع
6. بعد الدفع، يتم توجيهه إلى صفحة النجاح أو الإلغاء

### 2. معالجة Webhook
1. Ziina يرسل إشعار إلى `/api/payment/webhook`
2. يتم التحقق من صحة التوقيع
3. يتم معالجة حالة الدفع (نجح/فشل/ألغي)
4. يتم إرسال إشعارات للعميل والإدارة

## الأمان
- جميع المفاتيح محفوظة في متغيرات البيئة
- التحقق من صحة Webhook باستخدام HMAC
- عدم تخزين معلومات الدفع الحساسة
- استخدام HTTPS فقط

## الاختبار
1. استخدم مفاتيح الاختبار من Ziina
2. اختبر عمليات الدفع المختلفة
3. تأكد من عمل Webhook بشكل صحيح
4. اختبر صفحات النجاح والإلغاء

## استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في مفاتيح API**: تأكد من صحة المفاتيح في `.env`
2. **فشل Webhook**: تحقق من URL وإعدادات الأحداث
3. **مشاكل CORS**: تأكد من إعدادات النطاق في Ziina
4. **أخطاء SSL**: استخدم HTTPS في الإنتاج

### سجلات الأخطاء:
- تحقق من console.log في المتصفح
- راجع سجلات الخادم
- استخدم أدوات مطور المتصفح

## الدعم
- البريد الإلكتروني: leve1up999q@gmail.com
- واتساب: +971503492848
- وثائق Ziina: [https://docs.ziina.com](https://docs.ziina.com)

## الترقيات المستقبلية
- [ ] إضافة نموذج جمع بيانات العميل
- [ ] تكامل مع قاعدة البيانات
- [ ] إرسال بريد إلكتروني تلقائي
- [ ] لوحة تحكم الطلبات
- [ ] تقارير المبيعات
- [ ] دعم عملات إضافية

---

**ملاحظة**: هذا النظام جاهز للاستخدام في الإنتاج مع Ziina Payment Gateway.

