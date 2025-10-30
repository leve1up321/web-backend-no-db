# 🚀 دليل إعداد نظام الدفع - متجر لفل اب

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إعداد نظام الدفع الكامل للمتجر باستخدام **Ziina Payment Gateway** مع **Vercel** للاستضافة.

## 🎯 المميزات المطبقة

### ✅ **المرحلة الأولى - البنية الأساسية**
- [x] API Route لإنشاء Payment Intents (`/api/payment/create`)
- [x] Webhook Handler للتحقق من المدفوعات (`/api/payment/webhook`)
- [x] صفحة النجاح (`/payment/success`) مع Grid Background
- [x] صفحة الإلغاء (`/payment/cancel`) مع Grid Background
- [x] ملف Environment Variables محدث

### ✅ **المرحلة الثانية - الإصلاحات الحديثة**
- [x] **إصلاح خطأ CSS**: حذف القوس الزائد في `src/index.css` (السطر 142)
- [x] **تنظيف مجلد API**: حذف مجلد `api/` القديم (Next.js يتطلب `pages/api`)
- [x] **إصلاح البناء**: البناء ينجح بدون أخطاء PostCSS
- [x] **إصلاح مشكلة الدفع 405**: تصحيح URL والبيانات المرسلة
- [x] **تحسين واجهة الموبايل**: إصلاح النصوص والتمرير الأفقي
- [x] **Favicon كامل**: إضافة جميع الأحجام (16x16, 32x32, 192x192, 512x512)

## 🔧 خطوات الإعداد

### 1️⃣ **إعداد Ziina Payment Gateway**

#### الحصول على المفاتيح:
1. سجل في [Ziina Business](https://business.ziina.com/)
2. اذهب إلى **API Keys** في لوحة التحكم
3. انسخ **Secret Key** و **Webhook Secret**

#### إعداد Webhook:
1. في لوحة تحكم Ziina، اذهب إلى **Webhooks**
2. أضف Webhook جديد:
   - **URL**: `https://your-domain.vercel.app/api/webhook`
   - **Events**: `payment.completed`, `payment.failed`, `payment.canceled`

### 2️⃣ **إعداد Vercel Environment Variables**

في لوحة تحكم Vercel → Settings → Environment Variables:

```bash
# مطلوب - Ziina
ZIINA_SECRET_KEY=sk_live_xxxxx
ZIINA_WEBHOOK_SECRET=whsec_xxxxx

# مطلوب - URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# مطلوب للبريد الإلكتروني
RESEND_API_KEY=re_xxxxx

# مطلوب لرفع الملفات
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx

# إعدادات إضافية
ADMIN_EMAIL=admin@your-domain.com
SUPPORT_EMAIL=support@your-domain.com
JWT_SECRET=your-super-secret-jwt-key
```

### 3️⃣ **إعداد Resend للبريد الإلكتروني**

1. سجل في [Resend](https://resend.com/)
2. احصل على API Key
3. أضف Domain الخاص بك (اختياري)

### 4️⃣ **إعداد Vercel Blob Storage**

1. في مشروع Vercel، اذهب إلى **Storage**
2. أنشئ **Blob Store** جديد
3. انسخ **Read/Write Token**

## 🧪 الاختبار

### اختبار Payment Intent:
```bash
curl -X POST https://your-domain.vercel.app/api/payment_intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "AED",
    "productId": "test-product",
    "customerEmail": "test@example.com",
    "customerName": "عميل تجريبي"
  }'
```

### اختبار Webhook:
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment.completed",
    "data": {
      "id": "pi_test_123",
      "amount": 10000,
      "currency": "AED",
      "customer": {
        "email": "test@example.com"
      },
      "metadata": {
        "productId": "test-product"
      }
    }
  }'
```

## 📁 هيكل الملفات

```
├── pages/
│   ├── api/
│   │   ├── payment_intent.js    # إنشاء Payment Intent
│   │   └── webhook.js           # معالجة Webhooks
│   └── payment/
│       ├── success.tsx          # صفحة النجاح
│       └── cancel.tsx           # صفحة الإلغاء
├── .env.example                 # مثال على متغيرات البيئة
└── PAYMENT_SETUP.md            # هذا الملف
```

## 🔒 الأمان

### حماية المفاتيح:
- ✅ جميع المفاتيح محفوظة في Vercel Environment Variables
- ✅ لا توجد مفاتيح في الكود المصدري
- ✅ التحقق من Webhook Signatures

### التحقق من الدفع:
- ✅ التحقق الرسمي عبر Webhooks (وليس إعادة التوجيه فقط)
- ✅ حفظ تفاصيل الطلب قبل إنشاء Payment Intent
- ✅ تسجيل جميع العمليات في Console

## 🚀 المراحل التالية

### 📧 **المرحلة الثانية - البريد الإلكتروني**
- [ ] تنفيذ إرسال بريد التأكيد مع Resend
- [ ] قوالب بريد إلكتروني احترافية
- [ ] إشعارات الإدارة

### 💾 **المرحلة الثالثة - الملفات الرقمية**
- [ ] نظام رفع الملفات مع Vercel Blob
- [ ] روابط تحميل آمنة ومؤقتة
- [ ] حماية الملفات بـ JWT Tokens

### 🗄️ **المرحلة الرابعة - قاعدة البيانات**
- [ ] إعداد قاعدة بيانات (Vercel KV أو MongoDB)
- [ ] حفظ الطلبات والعملاء
- [ ] تتبع التحميلات والاستخدام

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. Payment Intent فشل:
```
Error: Failed to create payment intent
```
**الحل**: تحقق من `ZIINA_SECRET_KEY` في Environment Variables

#### 2. Webhook لا يعمل:
```
Error: Invalid webhook signature
```
**الحل**: تحقق من `ZIINA_WEBHOOK_SECRET` وURL الـ Webhook

#### 3. صفحات الدفع لا تظهر:
**الحل**: تحقق من `NEXT_PUBLIC_BASE_URL` في Environment Variables

## 📞 الدعم

- **البريد الإلكتروني**: support@levelup-store.com
- **التوثيق**: [Ziina API Docs](https://docs.ziina.com/)
- **Vercel Docs**: [Vercel Documentation](https://vercel.com/docs)

---

**تم إنشاؤه بواسطة**: فريق تطوير متجر لفل اب 🚀
**آخر تحديث**: أكتوبر 2024
