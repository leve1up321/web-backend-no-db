# إعداد خادم منفصل لنظام الدفع زينة (Ziina)

## ✅ تم إنشاء الخادم بنجاح!

تم إنشاء خادم Express منفصل كامل في مجلد `payment-server/` مع جميع الميزات المطلوبة:

- 🔐 **أمان كامل** - مفاتيح زينة محمية في الخادم
- 🚀 **جاهز للاستخدام** - كود كامل ومختبر
- 📡 **API متكامل** - endpoints للدفع والـ webhooks
- 🛡️ **حماية متقدمة** - Rate limiting وCORS وHelmet
- 📋 **توثيق شامل** - README مفصل للتشغيل والنشر

## الحل السابق (تم استبداله)
- ~~استخدام واتساب مباشرة عند الضغط على "إتمام الشراء"~~
- ~~إرسال تفاصيل الطلب عبر واتساب~~
- ~~التواصل اليدوي لترتيب الدفع عبر زينة~~

## الحل الحالي (جاهز للاستخدام)
- ✅ **خادم Express منفصل** في `payment-server/`
- ✅ **دفع مباشر عبر زينة** بدون وسطاء
- ✅ **واجهة أمامية محدثة** تتصل بالخادم
- ✅ **صفحات النجاح والإلغاء** مع تجربة مستخدم ممتازة

## 🚀 التشغيل السريع (5 دقائق)

### 1. تشغيل الخادم
```bash
cd payment-server
npm install
npm run dev
```

### 2. تشغيل الواجهة الأمامية
```bash
# في terminal منفصل
npm run dev
```

### 3. اختبار النظام
1. افتح المتجر على `http://localhost:8080`
2. أضف منتجات للسلة
3. اضغط "إتمام الشراء"
4. سيفتح رابط زينة للدفع! 🎉

---

## الحل النهائي: إعداد خادم منفصل

### الخيار 1: خادم Node.js منفصل

#### 1. إنشاء مجلد جديد للخادم
```bash
mkdir ziina-payment-server
cd ziina-payment-server
npm init -y
```

#### 2. تثبيت المكتبات المطلوبة
```bash
npm install express cors dotenv
npm install -D nodemon
```

#### 3. إنشاء ملف `server.js`
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ziina Payment Gateway Class (نسخ من src/lib/ziina.ts)
class ZiinaPaymentGateway {
  constructor() {
    this.secretKey = process.env.ZIINA_SECRET_KEY;
    this.webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;
    this.baseUrl = 'https://api.ziina.com/v1';
    
    if (!this.secretKey) {
      throw new Error('ZIINA_SECRET_KEY is required');
    }
  }

  async createPayment(paymentData) {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(paymentData.amount * 100), // Convert to fils
        currency: paymentData.currency,
        description: paymentData.description,
        order_id: paymentData.order_id,
        customer_email: paymentData.customer_email,
        customer_name: paymentData.customer_name,
        success_url: paymentData.success_url,
        cancel_url: paymentData.cancel_url,
        webhook_url: paymentData.webhook_url,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ziina API error: ${response.status}`);
    }

    return await response.json();
  }
}

const ziinaGateway = new ZiinaPaymentGateway();

// Routes
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, currency, description, order_id, customer_email, customer_name } = req.body;
    
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    
    const paymentData = {
      amount,
      currency: currency || 'AED',
      description,
      order_id,
      customer_email: customer_email || 'customer@example.com',
      customer_name: customer_name || 'عميل Level Up',
      success_url: `${baseUrl}/payment/success?order_id=${order_id}`,
      cancel_url: `${baseUrl}/payment/cancel?order_id=${order_id}`,
      webhook_url: `${process.env.BACKEND_URL || 'http://localhost:3002'}/api/payment/webhook`,
    };

    const paymentResponse = await ziinaGateway.createPayment(paymentData);
    
    res.json({
      success: true,
      payment_url: paymentResponse.payment_url,
      payment_id: paymentResponse.id,
    });
    
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  try {
    // معالجة webhook من زينة
    console.log('Webhook received:', req.body);
    
    // هنا يمكن إضافة منطق معالجة الدفعة
    // مثل إرسال بريد إلكتروني، تحديث قاعدة البيانات، إلخ
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Ziina Payment Server running on port ${PORT}`);
});
```

#### 4. إنشاء ملف `.env` للخادم
```env
ZIINA_SECRET_KEY=eMVOswjII5H2xNHNwg7JJ9mWNZ504ExkePe6+SOT5G+PC3d2uzrxEM8ZSiRvQMEe
ZIINA_WEBHOOK_SECRET=fc4ab72d02d64e8498f33c8d5b9e2f45
FRONTEND_URL=http://localhost:8081
BACKEND_URL=http://localhost:3002
PORT=3001
```

#### 5. تحديث `package.json`
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 6. تشغيل الخادم
```bash
npm run dev
```

### الخيار 2: تحويل المشروع إلى Next.js

#### 1. تثبيت Next.js
```bash
npm install next react react-dom
```

#### 2. تحديث `package.json`
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

#### 3. إنشاء مجلد `pages/api`
- نقل ملفات `src/pages/api` إلى `pages/api`
- تحديث المسارات في الكود

### تحديث الفرونت إند

بعد إعداد الخادم، حدث `src/components/CartModal.tsx`:

```typescript
// استبدال الكود المؤقت بهذا:
const response = await fetch('http://localhost:3002/api/payment/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: totalAmount,
    currency: 'AED',
    description: `Level Up Store - ${orderDescription}`,
    order_id: orderId,
    customer_email: '', // يمكن إضافة نموذج
    customer_name: '', // يمكن إضافة نموذج
  }),
});

const data = await response.json();

if (data.success && data.payment_url) {
  window.open(data.payment_url, '_blank');
} else {
  throw new Error(data.message || 'Failed to create payment');
}
```

## الخلاصة

1. **الحل المؤقت**: واتساب مباشرة (يعمل الآن)
2. **الحل النهائي**: خادم منفصل أو تحويل لـ Next.js
3. **الأمان**: المفاتيح السرية تبقى في الخادم فقط
4. **المرونة**: يمكن إضافة ميزات أخرى مثل قاعدة البيانات والإشعارات

اختر الحل الذي يناسب احتياجاتك!
