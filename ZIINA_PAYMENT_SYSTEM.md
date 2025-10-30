# 🚀 نظام الدفع المتكامل مع Ziina - متجر لفل اب

## 📋 نظرة عامة

تم تطوير نظام دفع متكامل وآمن باستخدام **Ziina Payment Gateway** مع دعم كامل للغة العربية وتجربة مستخدم محسنة.

## ✨ المميزات المطبقة

### 🔑 **المميزات الأساسية**
- ✅ **دمج Ziina Payment Intents** - إنشاء روابط دفع آمنة
- ✅ **نظام Webhook متقدم** - التحقق التلقائي من حالة الدفع
- ✅ **إرسال إيميلات تلقائية** - تأكيد الطلبات وإشعارات الإدارة
- ✅ **واجهة مستخدم محسنة** - مكونات React قابلة لإعادة الاستخدام
- ✅ **حماية متقدمة** - تشفير المفاتيح وإدارة آمنة للبيئة
- ✅ **دعم كامل للعربية** - RTL وترجمة شاملة
- ✅ **معالجة أخطاء ذكية** - رسائل واضحة ومفيدة

### 🛠️ **المميزات التقنية**
- ✅ **TypeScript** - أمان الأنواع والتطوير المحسن
- ✅ **React Hooks مخصصة** - `usePayment`, `useQuickPayment`
- ✅ **مكونات UI قابلة للتخصيص** - أزرار دفع متنوعة
- ✅ **إدارة حالة متقدمة** - تتبع حالة الدفع والأخطاء
- ✅ **تحقق من البيانات** - التحقق من صحة الإدخالات
- ✅ **تسجيل شامل** - مراقبة العمليات والأخطاء

## 🏗️ هيكل النظام

```
├── api/
│   ├── payment_intent.js     # إنشاء Payment Intent
│   └── webhook.js           # معالجة Webhooks من Ziina
├── src/
│   ├── hooks/
│   │   └── usePayment.ts    # Hooks للدفع
│   ├── components/
│   │   └── PaymentButton.tsx # مكونات أزرار الدفع
│   └── pages/
│       ├── PaymentSuccess.tsx # صفحة النجاح
│       └── PaymentCancel.tsx  # صفحة الإلغاء
└── .env.example            # قالب متغيرات البيئة
```

## 🔧 إعداد النظام

### 1️⃣ **متغيرات البيئة المطلوبة**

```bash
# 🔑 Ziina Configuration (REQUIRED)
ZIINA_SECRET_KEY=sk_test_your_key
ZIINA_WEBHOOK_SECRET=whsec_your_secret

# 🌐 URLs (REQUIRED)
NEXT_PUBLIC_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api

# 📧 Email Service (REQUIRED)
RESEND_API_KEY=re_your_key
ADMIN_EMAIL=admin@your-domain.com

# 🔒 Security (REQUIRED)
JWT_SECRET=your_super_secure_secret_min_32_chars
```

### 2️⃣ **تثبيت التبعيات**

```bash
# تثبيت التبعيات الموجودة
npm install

# أو باستخدام yarn
yarn install
```

### 3️⃣ **إعداد Ziina Webhook**

1. اذهب إلى [لوحة تحكم Ziina Business](https://business.ziina.com/)
2. انتقل إلى إعدادات الـ Webhooks
3. أضف URL الـ webhook: `https://your-domain.com/api/webhook`
4. اختر الأحداث: `payment_intent.succeeded`, `payment_intent.failed`, `payment_intent.cancelled`

## 💻 كيفية الاستخدام

### 🎯 **استخدام Hook الدفع**

```typescript
import { useQuickPayment } from '@/hooks/usePayment';

function ProductPage() {
  const { isLoading, quickPay } = useQuickPayment();

  const handlePurchase = async () => {
    await quickPay({
      productName: 'منتج رقمي',
      amount: 99.99,
      customerEmail: 'customer@example.com',
      description: 'وصف المنتج'
    });
  };

  return (
    <button onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? 'جاري المعالجة...' : 'اشترِ الآن'}
    </button>
  );
}
```

### 🎨 **استخدام مكون زر الدفع**

```typescript
import { PaymentButton } from '@/components/PaymentButton';

function ProductCard() {
  return (
    <div>
      <h3>منتج رقمي رائع</h3>
      <p>وصف المنتج...</p>
      
      {/* زر دفع بسيط */}
      <PaymentButton
        productName="منتج رقمي رائع"
        amount={99.99}
        description="منتج رقمي عالي الجودة"
      />
    </div>
  );
}
```

### 🔧 **أنواع مختلفة من أزرار الدفع**

```typescript
// زر دفع بسيط (بدون نموذج)
<SimplePaymentButton
  productName="منتج بسيط"
  amount={49.99}
/>

// زر دفع مع معلومات العميل المطلوبة
<PaymentButtonWithCustomerInfo
  productName="منتج متقدم"
  amount={199.99}
  description="يتطلب معلومات العميل"
/>

// زر دفع قابل للتخصيص
<PaymentButton
  productName="منتج مخصص"
  amount={149.99}
  showCustomerForm={true}
  requiredCustomerInfo={false}
  variant="outline"
  size="lg"
  className="w-full"
/>
```

## 🔄 تدفق العمليات

### 📱 **تدفق الدفع الناجح**
```
1. العميل ينقر زر PaymentButton
2. عرض نموذج معلومات العميل (اختياري)
3. استدعاء useQuickPayment.quickPay()
4. إرسال POST إلى /api/payment_intent
5. إنشاء Payment Intent مع Ziina
6. إعادة توجيه لـ Ziina payment page
7. العميل يدفع
8. Ziina يرسل Webhook إلى /api/webhook
9. معالجة الـ webhook وإرسال إيميلات
10. إعادة توجيه لـ /payment/success
```

### ⚠️ **معالجة الأخطاء**
```
عند أي خطأ في المراحل 2-5:
- عرض رسالة خطأ بالعربية
- تسجيل الخطأ في Console
- عدم الكشف عن تفاصيل حساسة
```

## 🔐 الأمان والحماية

### 🛡️ **حماية المفاتيح**
- ✅ جميع المفاتيح محفوظة في متغيرات البيئة
- ✅ لا توجد مفاتيح في الكود المصدري
- ✅ التحقق من Webhook Signatures
- ✅ تشفير JWT للروابط الآمنة

### 🔍 **التحقق من الدفع**
- ✅ التحقق الرسمي عبر Webhooks (وليس إعادة التوجيه فقط)
- ✅ تسجيل جميع العمليات للمراقبة
- ✅ معالجة الأخطاء بشكل آمن
- ✅ حماية من CSRF و XSS

## 📡 API Documentation

### 🔗 **POST /api/payment_intent**

إنشاء Payment Intent جديد مع Ziina.

**Request Body:**
```json
{
  "productName": "منتج رقمي",
  "productId": "prod_123",
  "amount": 99.99,
  "customerEmail": "customer@example.com",
  "customerName": "أحمد محمد",
  "customerPhone": "+971501234567",
  "description": "وصف المنتج",
  "metadata": {
    "source": "website",
    "campaign": "summer_sale"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://checkout.ziina.com/...",
    "paymentId": "pi_1234567890",
    "amount": 99.99,
    "currency": "AED",
    "productName": "منتج رقمي",
    "testMode": true
  },
  "message": "تم إنشاء رابط الدفع بنجاح",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "error": "Invalid amount",
  "message": "المبلغ يجب أن يكون رقماً موجباً",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 🔗 **POST /api/webhook**

معالجة Webhooks من Ziina لتأكيد حالة الدفع.

**Headers:**
```
Content-Type: application/json
X-Ziina-Signature: sha256=...
```

**Request Body:**
```json
{
  "id": "pi_1234567890",
  "status": "succeeded",
  "amount": 9999,
  "currency_code": "AED",
  "customer_email": "customer@example.com",
  "metadata": {
    "product_name": "منتج رقمي",
    "customer_email": "customer@example.com"
  }
}
```

## 🎨 Components Documentation

### 🔘 **PaymentButton**

المكون الأساسي لأزرار الدفع.

**Props:**
```typescript
interface PaymentButtonProps {
  productName: string;           // اسم المنتج (مطلوب)
  productId?: string;           // معرف المنتج (اختياري)
  amount: number;               // المبلغ بالدرهم (مطلوب)
  currency?: string;            // العملة (افتراضي: AED)
  description?: string;         // وصف المنتج (اختياري)
  className?: string;           // CSS classes إضافية
  variant?: ButtonVariant;      // نوع الزر
  size?: ButtonSize;           // حجم الزر
  showCustomerForm?: boolean;   // عرض نموذج العميل
  requiredCustomerInfo?: boolean; // معلومات العميل مطلوبة
  metadata?: Record<string, any>; // بيانات إضافية
}
```

**أمثلة:**
```typescript
// استخدام أساسي
<PaymentButton
  productName="كتاب إلكتروني"
  amount={29.99}
/>

// مع خيارات متقدمة
<PaymentButton
  productName="دورة تدريبية"
  amount={199.99}
  description="دورة شاملة في البرمجة"
  showCustomerForm={true}
  requiredCustomerInfo={true}
  variant="outline"
  size="lg"
  metadata={{ course_id: "course_123" }}
/>
```

### 🔘 **SimplePaymentButton**

نسخة مبسطة بدون نموذج معلومات العميل.

```typescript
<SimplePaymentButton
  productName="منتج سريع"
  amount={49.99}
  variant="default"
/>
```

### 🔘 **PaymentButtonWithCustomerInfo**

نسخة تتطلب معلومات العميل إجبارياً.

```typescript
<PaymentButtonWithCustomerInfo
  productName="خدمة مخصصة"
  amount={299.99}
  description="تتطلب معلومات العميل للتواصل"
/>
```

## 🎣 Hooks Documentation

### 🪝 **usePayment()**

Hook أساسي لإدارة عمليات الدفع.

**Returns:**
```typescript
{
  isLoading: boolean;           // حالة التحميل
  error: string | null;        // رسالة الخطأ
  createPaymentIntent: (data: PaymentData) => Promise<PaymentResult | null>;
  redirectToPayment: (url: string) => void;
}
```

**مثال:**
```typescript
const { isLoading, error, createPaymentIntent, redirectToPayment } = usePayment();

const handlePayment = async () => {
  const result = await createPaymentIntent({
    productName: 'منتج',
    amount: 99.99
  });
  
  if (result?.redirectUrl) {
    redirectToPayment(result.redirectUrl);
  }
};
```

### 🪝 **useQuickPayment()**

Hook مبسط للدفع السريع مع إعادة توجيه تلقائية.

**Returns:**
```typescript
{
  isLoading: boolean;
  error: string | null;
  quickPay: (data: PaymentData) => Promise<boolean>;
}
```

**مثال:**
```typescript
const { isLoading, quickPay } = useQuickPayment();

const handleQuickPay = async () => {
  const success = await quickPay({
    productName: 'منتج سريع',
    amount: 49.99,
    customerEmail: 'customer@example.com'
  });
  
  if (success) {
    console.log('تم توجيه العميل لصفحة الدفع');
  }
};
```

### 🪝 **usePaymentStatus()**

Hook لإدارة حالة الدفع من URL parameters.

**Returns:**
```typescript
{
  paymentStatus: 'idle' | 'success' | 'cancelled' | 'failed';
  checkPaymentStatus: () => void;
}
```

## 🧪 الاختبار

### 🔬 **اختبار API محلياً**

```bash
# اختبار إنشاء Payment Intent
curl -X POST http://localhost:5173/api/payment_intent \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "منتج تجريبي",
    "amount": 10,
    "customerEmail": "test@example.com"
  }'
```

### 🔬 **اختبار Webhook محلياً**

```bash
# محاكاة webhook من Ziina
curl -X POST http://localhost:5173/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "pi_test_123",
    "status": "succeeded",
    "amount": 1000,
    "currency_code": "AED"
  }'
```

## 🚀 النشر

### 📦 **النشر على Vercel**

1. **رفع الكود إلى GitHub**
2. **ربط المستودع بـ Vercel**
3. **إعداد متغيرات البيئة في Vercel:**
   ```
   ZIINA_SECRET_KEY=sk_live_your_key
   ZIINA_WEBHOOK_SECRET=whsec_your_secret
   RESEND_API_KEY=re_your_key
   ADMIN_EMAIL=admin@your-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```
4. **النشر التلقائي**

### 🔗 **إعداد Webhook في الإنتاج**

1. انسخ URL الـ webhook: `https://your-domain.vercel.app/api/webhook`
2. أضفه في لوحة تحكم Ziina
3. اختبر الـ webhook بعملية دفع تجريبية

## 🐛 استكشاف الأخطاء

### ❌ **أخطاء شائعة وحلولها**

**1. خطأ: "ZIINA_SECRET_KEY not found"**
```bash
# الحل: تأكد من وجود المفتاح في .env
echo "ZIINA_SECRET_KEY=sk_test_your_key" >> .env
```

**2. خطأ: "Invalid webhook signature"**
```bash
# الحل: تحقق من ZIINA_WEBHOOK_SECRET
echo "ZIINA_WEBHOOK_SECRET=whsec_your_secret" >> .env
```

**3. خطأ: "Payment Intent creation failed"**
- تحقق من صحة مفتاح API
- تأكد من صحة البيانات المرسلة
- راجع logs في Vercel

**4. خطأ: "Webhook not receiving events"**
- تأكد من صحة URL الـ webhook
- تحقق من إعدادات Ziina
- راجع Network logs

### 📊 **مراقبة النظام**

```javascript
// إضافة logging مخصص
console.log('🔄 Payment Intent Created:', {
  paymentId: result.id,
  amount: result.amount,
  timestamp: new Date().toISOString()
});
```

## 🔮 التطوير المستقبلي

### 📈 **مميزات مخططة**
- [ ] دعم عملات إضافية (USD, EUR)
- [ ] نظام كوبونات الخصم
- [ ] تقارير مبيعات متقدمة
- [ ] دعم الدفع بالتقسيط
- [ ] تطبيق جوال مع React Native

### 🔧 **تحسينات تقنية**
- [ ] إضافة Unit Tests
- [ ] تحسين الأداء مع React Query
- [ ] إضافة PWA support
- [ ] تحسين SEO للصفحات

## 📞 الدعم والمساعدة

### 🆘 **الحصول على المساعدة**
- 📧 **البريد الإلكتروني:** support@levelupstore.com
- 💬 **واتساب:** +971-XX-XXX-XXXX
- 📚 **التوثيق:** راجع هذا الملف
- 🐛 **الأخطاء:** أنشئ Issue في GitHub

### 🤝 **المساهمة**
نرحب بالمساهمات! يرجى:
1. Fork المستودع
2. إنشاء branch جديد للميزة
3. إضافة tests للكود الجديد
4. إرسال Pull Request

---

**🎯 هذا النظام جاهز للاستخدام الفعلي ويدعم جميع السيناريوهات المختلفة لعمليات الدفع!**

---

*آخر تحديث: أكتوبر 2024*
