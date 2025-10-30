# Level Up Store - Ziina Payment Server

خادم الدفع المنفصل لمتجر Level Up باستخدام بوابة زينة للدفع الإلكتروني.

## 🚀 المميزات

- ✅ **دفع آمن عبر زينة** - استخدام مفاتيح API بأمان
- ✅ **معالجة Webhooks** - استقبال إشعارات الدفع تلقائياً
- ✅ **حماية من الهجمات** - Rate limiting وHelmet للأمان
- ✅ **دعم CORS** - للتكامل مع الواجهة الأمامية
- ✅ **معالجة الأخطاء** - رسائل خطأ واضحة بالعربية والإنجليزية
- ✅ **سجلات مفصلة** - تتبع جميع العمليات

## 📋 المتطلبات

- Node.js 16+ 
- npm أو yarn
- حساب Ziina Business مع API keys

## ⚙️ التثبيت والإعداد

### 1. تثبيت المكتبات
```bash
cd payment-server
npm install
```

### 2. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env` وأضف مفاتيحك:

```env
# Ziina Payment Gateway
ZIINA_SECRET_KEY=your_ziina_secret_key
ZIINA_WEBHOOK_SECRET=your_webhook_secret

# Server Configuration  
PORT=3001
NODE_ENV=development

# Frontend URLs
FRONTEND_URL=http://localhost:8080
FRONTEND_PROD_URL=https://your-frontend-domain.com
```

### 3. تشغيل الخادم

#### للتطوير:
```bash
npm run dev
```

#### للإنتاج:
```bash
npm start
```

## 🔗 API Endpoints

### POST `/api/payment/create`
إنشاء دفعة جديدة

**Request Body:**
```json
{
  "amount": 100.50,
  "currency": "AED",
  "description": "Level Up Store - Order #123",
  "order_id": "order_123456",
  "customer_email": "customer@example.com",
  "customer_name": "اسم العميل",
  "items": [...]
}
```

**Response:**
```json
{
  "success": true,
  "payment_url": "https://pay.ziina.com/...",
  "payment_id": "pay_123456",
  "order_id": "order_123456",
  "amount": 10050,
  "currency": "AED",
  "status": "pending"
}
```

### GET `/api/payment/status/:paymentId`
التحقق من حالة الدفعة

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "pay_123456",
    "status": "completed",
    "amount": 10050,
    "currency": "AED"
  }
}
```

### POST `/api/payment/webhook`
استقبال إشعارات زينة (للاستخدام الداخلي)

## 🛡️ الأمان

- **Rate Limiting**: 100 طلب كل 15 دقيقة لكل IP
- **Helmet**: حماية من هجمات الويب الشائعة  
- **CORS**: مقيد على النطاقات المسموحة فقط
- **Webhook Verification**: التحقق من صحة إشعارات زينة
- **Input Validation**: التحقق من صحة البيانات المدخلة

## 🚀 النشر

### Railway
```bash
# ربط المشروع بـ Railway
railway login
railway init
railway add
railway deploy
```

### Render
1. ارفع الكود إلى GitHub
2. اربط المستودع بـ Render
3. اختر "Web Service"
4. أضف متغيرات البيئة
5. انشر

### Vercel (Serverless)
```bash
npm install -g vercel
vercel
```

## 🔧 التكامل مع الواجهة الأمامية

في ملفات React، استخدم:

```typescript
const serverUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-payment-server.com'
  : 'http://localhost:3002';

const response = await fetch(`${serverUrl}/api/payment/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(paymentData)
});
```

## 📊 المراقبة والسجلات

الخادم يسجل جميع العمليات المهمة:

- ✅ إنشاء الدفعات
- ✅ استقبال Webhooks  
- ✅ الأخطاء والاستثناءات
- ✅ طلبات API

## 🐛 استكشاف الأخطاء

### خطأ "ZIINA_SECRET_KEY is required"
- تأكد من وجود المفتاح في ملف `.env`
- تأكد من أن اسم المتغير صحيح

### خطأ CORS
- تأكد من إضافة رابط الواجهة الأمامية في `corsOptions`
- تحقق من أن البورت صحيح

### فشل Webhook
- تأكد من أن `ZIINA_WEBHOOK_SECRET` صحيح
- تحقق من أن زينة تستطيع الوصول للخادم

## 📞 الدعم

- **البريد الإلكتروني**: leve1up999q@gmail.com
- **واتساب**: +971503492848
- **GitHub Issues**: [رابط المستودع]

## 📄 الترخيص

MIT License - يمكن استخدامه بحرية للمشاريع التجارية والشخصية.

---

**Level Up Store** - متجر إلكتروني متطور مع نظام دفع آمن 🛒✨
