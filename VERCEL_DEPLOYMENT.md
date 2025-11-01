# 🚀 دليل نشر Vercel - Level Up Store

## ✅ التحديثات الأخيرة

تم إصلاح جميع مشاكل Vercel Deployment:

### المشاكل التي تم حلها:
- ✅ **إزالة Express من Serverless Functions** - كان يسبب مشاكل في Vercel
- ✅ **تحديث API Routes** - استخدام MongoDB بدلاً من in-memory storage
- ✅ **إصلاح vercel.json** - تكوين صحيح للـ functions والـ routes
- ✅ **تحسين lib/mongodb.js** - إضافة دالة `connectDB()` المفقودة

## 📋 المتطلبات

### 1. قاعدة بيانات MongoDB
احصل على حساب مجاني من [MongoDB Atlas](https://mongodb.com/atlas):
- إنشاء cluster جديد (مجاني)
- إنشاء database user
- إضافة IP address `0.0.0.0/0` (للسماح بالوصول من Vercel)
- الحصول على Connection String

### 2. متغيرات البيئة المطلوبة

يجب إضافة هذه المتغيرات في Vercel Dashboard → Settings → Environment Variables:

```env
# قاعدة البيانات (مطلوب)
# احصل على Connection String من MongoDB Atlas واستبدل <username> و <password> و <cluster>
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/levelup_store?retryWrites=true&w=majority

# JWT Secret (مطلوب)
# قم بتوليد سر عشوائي قوي (استخدم: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-super-secure-jwt-key-min-32-characters-long

# بوابة الدفع Ziina (مطلوب)
ZIINA_SECRET_KEY=sk_test_your_key_here
ZIINA_WEBHOOK_SECRET=whsec_your_secret_here

# البريد الإلكتروني (اختياري)
RESEND_API_KEY=re_your_key_here

# معلومات المتجر
STORE_NAME="Level Up Store"
STORE_URL=https://your-domain.vercel.app
SUPPORT_EMAIL=support@levelup.com

# البيئة
NODE_ENV=production
```

## 🔧 خطوات النشر

### الطريقة 1: عبر Vercel Dashboard (موصى بها)

1. **ربط المشروع بـ Vercel:**
   ```bash
   # تسجيل الدخول
   npx vercel login
   
   # ربط المشروع
   npx vercel link
   ```

2. **إضافة متغيرات البيئة:**
   - اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
   - اختر مشروعك → Settings → Environment Variables
   - أضف جميع المتغيرات أعلاه

3. **نشر المشروع:**
   ```bash
   # نشر للبيئة التجريبية
   npx vercel
   
   # نشر للإنتاج
   npx vercel --prod
   ```

### الطريقة 2: Push to GitHub (تلقائي)

إذا ربطت Vercel بـ GitHub، سيتم النشر تلقائياً عند:
- Push إلى branch main → نشر production
- Push إلى أي branch آخر → نشر preview

## 📁 هيكل API Routes

```
api/
├── auth/
│   ├── login.js       # تسجيل الدخول
│   └── register.js    # إنشاء حساب
├── payment_intent.js  # إنشاء طلب دفع
└── webhook.js         # استقبال إشعارات Ziina
```

كل ملف يصدّر دالة بهذا الشكل:
```javascript
export default async function handler(req, res) {
  // معالجة الطلب
}
```

## 🔍 التحقق من النشر

بعد النشر، تحقق من:

### 1. API Endpoints
```bash
# اختبار health check
curl https://your-domain.vercel.app/api/health

# اختبار التسجيل
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123"}'
```

### 2. Frontend
- افتح الموقع: `https://your-domain.vercel.app`
- جرّب التسجيل وتسجيل الدخول
- تحقق من صفحة المنتجات وعربة التسوق

### 3. Logs
راجع logs في Vercel Dashboard:
- Functions → اختر function → View Logs
- ابحث عن أي أخطاء أو تحذيرات

## ⚠️ مشاكل شائعة وحلولها

### المشكلة: خطأ 500 في API
**الحل:**
1. تحقق من logs في Vercel Dashboard
2. تأكد من إضافة جميع متغيرات البيئة
3. تحقق من صحة MONGODB_URI

### المشكلة: خطأ في الاتصال بقاعدة البيانات
**الحل:**
1. تحقق من إضافة `0.0.0.0/0` في MongoDB Atlas Network Access
2. تأكد من صحة username/password في Connection String
3. جرّب الاتصال محلياً أولاً

### المشكلة: CORS errors
**الحل:**
- API routes تضيف CORS headers تلقائياً
- تحقق من أن Domain مسموح في إعدادات Vercel

### المشكلة: Build fails
**الحل:**
```bash
# اختبار البناء محلياً
npm run build

# إذا نجح، المشكلة في متغيرات البيئة
# تحقق من إضافتها جميعاً في Vercel
```

### المشكلة: خطأ "Cannot find module 'autoprefixer'"
**الحل:**
- هذا يحدث عندما يحاول Vercel بناء مجلد `ziina-payment-integration/frontend/`
- تم إضافة `.vercelignore` لتجاهل هذا المجلد
- إذا استمر الخطأ، تأكد من أن `.vercelignore` يحتوي على:
  ```
  ziina-payment-integration/
  ```

## 📊 مراقبة الأداء

### Vercel Analytics
- مراقبة عدد الزيارات وسرعة التحميل
- تفعيل من: Settings → Analytics

### Function Logs
- مراقبة استخدام Serverless Functions
- التحقق من وقت التنفيذ (يجب أن يكون < 10s)

### MongoDB Atlas Monitoring
- مراقبة عدد الاتصالات
- متابعة استخدام التخزين

## 🎯 نصائح للأداء الأفضل

1. **استخدام Connection Pooling:**
   - ملف `lib/mongodb.js` يستخدم connection pooling تلقائياً
   - يقلل من وقت الاستجابة

2. **تفعيل Caching:**
   - استخدم `vercel.json` لتفعيل caching للملفات الثابتة
   
3. **تصغير حجم Functions:**
   - تجنب استيراد مكتبات كبيرة غير ضرورية
   - استخدم dynamic imports عند الحاجة

4. **Indexes في MongoDB:**
   ```javascript
   // أضف indexes للبحث السريع
   db.collection('users').createIndex({ email: 1 }, { unique: true });
   db.collection('orders').createIndex({ userId: 1 });
   ```

## 🔐 الأمان

### إعدادات مهمة:
- ✅ استخدم JWT_SECRET قوي (32+ حرف عشوائي)
- ✅ تفعيل HTTPS فقط (Vercel يفعله تلقائياً)
- ✅ تحديث dependencies بانتظام
- ✅ مراجعة logs للأنشطة المشبوهة

### Environment Variables:
- لا تشارك متغيرات البيئة أبداً
- استخدم Vercel secrets للبيانات الحساسة
- غيّر المفاتيح بانتظام

## 📞 الدعم

### موارد مفيدة:
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Ziina API Docs](https://ziina.com/docs)

### استكشاف الأخطاء:
1. راجع Vercel Function Logs
2. اختبر APIs محلياً أولاً
3. تحقق من MongoDB Atlas logs
4. راجع متغيرات البيئة

---

**آخر تحديث:** نوفمبر 2024  
**الإصدار:** 2.0.0
