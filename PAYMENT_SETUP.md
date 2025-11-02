# 🚀 دليل إعداد نظام الدفع - Ziina Payment Integration

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد نظام الدفع المتكامل مع Ziina Payment Gateway في مشروع Level Up Store المبني على Next.js App Router.

## 🏗️ البنية المعمارية

### Next.js App Router Structure
```
app/
├── api/
│   ├── payment_intent/
│   │   └── route.ts          # إنشاء payment intent
│   ├── webhook/
│   │   └── route.ts          # معالجة webhook notifications
│   ├── download/
│   │   └── route.ts          # تحميل الملفات مع JWT validation
│   └── auth/
│       └── route.ts          # المصادقة والتسجيل
├── layout.tsx                # Root layout
├── page.tsx                  # الصفحة الرئيسية
└── globals.css               # الأنماط العامة
```

### Database Support
- **MongoDB**: الخيار المفضل للإنتاج
- **No-DB Mode**: JSON files fallback في مجلد `data/`
- **In-Memory**: للاختبار السريع

## 🔧 متطلبات النظام

### 1. متغيرات البيئة المطلوبة

```bash
# Ziina Payment Gateway (REQUIRED)
ZIINA_SECRET_KEY=sk_test_your_secret_key
ZIINA_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application URLs (REQUIRED)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Email Service (REQUIRED)
RESEND_API_KEY=re_your_resend_api_key

# File Storage (REQUIRED)
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# Security (REQUIRED)
JWT_SECRET=your_jwt_secret_min_32_chars

# Database (OPTIONAL - supports No-DB mode)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db

# Environment
NODE_ENV=production
```

### 2. Dependencies المطلوبة

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@vercel/blob": "^0.23.4",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.20.0",
    "resend": "^4.0.0",
    "bcryptjs": "^3.0.2"
  }
}
```

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد Ziina Business Account

1. **إنشاء حساب Ziina Business**
   - اذهب إلى [Ziina Business](https://business.ziina.com/)
   - أنشئ حساب جديد أو سجل دخول
   - أكمل عملية التحقق من الهوية

2. **الحصول على API Keys**
   ```bash
   # Test Environment
   ZIINA_SECRET_KEY=sk_test_xxxxxxxxxx
   
   # Production Environment  
   ZIINA_SECRET_KEY=sk_live_xxxxxxxxxx
   ```

3. **إعداد Webhook**
   - في لوحة تحكم Ziina، اذهب إلى Webhooks
   - أضف webhook endpoint: `https://your-domain.vercel.app/api/webhook`
   - اختر الأحداث: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - احفظ الـ webhook secret

### الخطوة 2: إعداد Vercel Deployment

1. **رفع الكود إلى GitHub**
   ```bash
   git add .
   git commit -m "Setup Next.js App Router with Ziina integration"
   git push origin main
   ```

2. **ربط المشروع بـ Vercel**
   - اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
   - اختر "New Project"
   - اربط GitHub repository
   - اختر Framework: "Next.js"

3. **إضافة Environment Variables في Vercel**
   ```bash
   # في Vercel Dashboard > Settings > Environment Variables
   ZIINA_SECRET_KEY=sk_live_your_production_key
   ZIINA_WEBHOOK_SECRET=whsec_your_webhook_secret
   RESEND_API_KEY=re_your_resend_key
   BLOB_READ_WRITE_TOKEN=vercel_blob_token
   JWT_SECRET=your_secure_jwt_secret_32_chars_min
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

### الخطوة 3: إعداد قاعدة البيانات (اختياري)

#### خيار 1: MongoDB Atlas (مُوصى به)
```bash
# 1. إنشاء حساب MongoDB Atlas مجاني
# https://mongodb.com/atlas

# 2. إنشاء cluster جديد
# 3. إنشاء database user
# 4. إضافة IP addresses (0.0.0.0/0 للإنتاج)
# 5. الحصول على connection string

DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/levelup_store?retryWrites=true&w=majority
```

#### خيار 2: No-DB Mode (تلقائي)
```bash
# إذا لم تحدد DATABASE_URL، سيستخدم النظام:
# - data/orders.json للطلبات
# - data/users.json للمستخدمين
# - ملفات JSON محلية
```

### الخطوة 4: إعداد Email Service

1. **إنشاء حساب Resend**
   - اذهب إلى [Resend](https://resend.com/)
   - أنشئ حساب جديد
   - تحقق من domain أو استخدم resend domain

2. **الحصول على API Key**
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxx
   ```

### الخطوة 5: إعداد File Storage

1. **Vercel Blob Storage**
   ```bash
   # في Vercel Dashboard > Storage > Create Database
   # اختر Blob Storage
   # احصل على token
   
   BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxx
   ```

## 🧪 اختبار النظام

### 1. اختبار محلي

```bash
# تشغيل الخادم المحلي
npm run dev

# اختبار webhook
npm run test
# أو
./scripts/test-webhook.sh
# أو (Windows)
.\scripts\test-webhook-windows.ps1
```

### 2. اختبار الإنتاج

```bash
# اختبار webhook في الإنتاج
WEBHOOK_URL=https://your-domain.vercel.app/api/webhook npm run test

# اختبار payment intent
curl -X POST https://your-domain.vercel.app/api/payment_intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "productName": "Test Product"
  }'
```

### 3. اختبار التحميل

```bash
# اختبار download route
curl "https://your-domain.vercel.app/api/download?orderId=test_order_id"
```

## 🔒 الأمان والحماية

### 1. Webhook Security
- ✅ HMAC SHA256 signature verification
- ✅ IP whitelist للـ Ziina IPs
- ✅ Idempotency protection
- ✅ Request timeout handling

### 2. Download Security  
- ✅ JWT token validation
- ✅ Customer email verification
- ✅ Order status checking
- ✅ Download expiry limits

### 3. Environment Security
- ✅ All secrets in environment variables
- ✅ No hardcoded credentials
- ✅ Production/development separation

## 📊 مراقبة النظام

### 1. Vercel Analytics
```bash
# في Vercel Dashboard > Analytics
# مراقبة:
# - Response times
# - Error rates  
# - Traffic patterns
```

### 2. Webhook Logs
```bash
# في Vercel Dashboard > Functions > Logs
# مراقبة webhook processing
# تتبع الأخطاء والنجاحات
```

### 3. Database Monitoring
```bash
# MongoDB Atlas Dashboard
# مراقبة:
# - Connection count
# - Query performance
# - Storage usage
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. Webhook Signature Invalid
```bash
# التحقق من:
# - ZIINA_WEBHOOK_SECRET صحيح
# - Raw request body يُستخدم للتحقق
# - Content-Type: application/json
```

#### 2. Database Connection Failed
```bash
# التحقق من:
# - DATABASE_URL صحيح
# - IP whitelist في MongoDB Atlas
# - Network connectivity
# - سيتم التبديل تلقائياً إلى JSON files
```

#### 3. Email Sending Failed
```bash
# التحقق من:
# - RESEND_API_KEY صحيح
# - Domain verified في Resend
# - Rate limits
# - لن يؤثر على webhook success
```

#### 4. File Download Issues
```bash
# التحقق من:
# - BLOB_READ_WRITE_TOKEN صحيح
# - JWT_SECRET configured
# - File exists في Vercel Blob
# - Order status = completed
```

## 📈 تحسينات الأداء

### 1. Caching Strategy
```javascript
// في next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['mongodb']
  }
}
```

### 2. Database Optimization
```javascript
// Index creation للـ MongoDB
db.orders.createIndex({ "customerEmail": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "createdAt": -1 })
```

### 3. Error Handling
```javascript
// Non-blocking email sending
try {
  await sendEmail()
} catch (error) {
  console.error('Email failed (non-blocking):', error)
  // Continue webhook processing
}
```

## 🔄 تدفق العمليات

### 1. Payment Flow
```
User → Frontend → /api/payment_intent → Ziina → Payment Page → User Payment → Webhook → /api/webhook → Database Update → Email Confirmation
```

### 2. Download Flow  
```
User → Email Link → /api/download → JWT Validation → Order Verification → File Stream/URL
```

### 3. Webhook Flow
```
Ziina → /api/webhook → IP Check → HMAC Verify → Process Event → Update Database → Send Email → Return Success
```

## 📞 الدعم والمساعدة

### موارد مفيدة
- [Ziina API Documentation](https://docs.ziina.com/)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)

### اتصل بنا
- **Email**: support@levelup-store.com
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)

---

✅ **تم إعداد النظام بنجاح!** 

النظام الآن جاهز للاستخدام في الإنتاج مع دعم كامل لـ:
- ✅ Next.js App Router
- ✅ Ziina Payment Gateway  
- ✅ Secure Webhook Processing
- ✅ JWT-based Download System
- ✅ No-DB Mode Support
- ✅ Production-ready Security

