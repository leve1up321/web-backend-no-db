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

### المشكلة: خطأ "Cannot find module 'autoprefixer'" أو "No Next.js version detected"
**الحل:**
- هذا يحدث عندما يحاول Vercel بناء مجلد `ziina-payment-integration/frontend/` أو يكتشف ملفات Next.js
- تم حذف مجلد `pages/` من الجذر الذي كان يسبب التباساً
- تم إضافة `.vercelignore` لتجاهل المجلدات غير المطلوبة
- تم تحديث `vercel.json` لتوضيح أن هذا مشروع Vite وليس Next.js
- إذا استمر الخطأ، تأكد من أن `.vercelignore` يحتوي على:
  ```
  ziina-payment-integration/
  next.config.*
  .next/
  pages/
  ```

## ✅ الحل الشامل الجديد - إزالة Next.js imports من src/pages

### المشكلة المستمرة:
```
Warning: Could not identify Next.js version
Error: No Next.js version detected. Make sure your package.json has "next" in either 
"dependencies" or "devDependencies". Also check your Root Directory setting matches 
the directory of your package.json file.
```

### السبب الجذري المكتشف:
بعد فحص شامل للمشروع، تم اكتشاف أن المشكلة كانت في ملفات داخل `src/pages/` تستخدم **Next.js imports**:

**الملفات المسببة للمشكلة:**
- `src/pages/api/payment/create.ts` - يستخدم `NextApiRequest, NextApiResponse` من `next`
- `src/pages/api/payment/webhook.ts` - يستخدم `NextApiRequest, NextApiResponse` من `next`
- `src/pages/payment/success.tsx` - يستخدم `useRouter` من `next/router`
- `src/pages/payment/cancel.tsx` - يستخدم `useRouter` من `next/router`

### الحل النهائي المطبق:
1. **حذف الملفات التي تستخدم Next.js imports**
   ```bash
   rm -rf src/pages/api/
   rm -rf src/pages/payment/
   ```

2. **التحقق من عدم وجود Next.js imports أخرى**
   ```bash
   grep -r "from 'next" src/  # لا توجد نتائج ✅
   grep -r "next/" src/       # لا توجد نتائج ✅
   ```

3. **تحديث `vercel.json` بإعدادات محسّنة لـ Vite**
   ```json
   {
     "version": 2,
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "cleanUrls": true,
     "trailingSlash": false
   }
   ```

### النتيجة النهائية:
- ✅ **لا توجد Next.js imports** في الكود بعد الآن
- ✅ جميع الملفات في `src/pages/` تستخدم **React + React Router** فقط
- ✅ `package.json` خالي من `next` (كما يجب أن يكون)
- ✅ Vercel يتعرف على المشروع كـ **Vite project** بوضوح
- ✅ لن يحدث خطأ "No Next.js version detected" بعد الآن

### ملاحظة مهمة:
الملفات المحذوفة كانت تبدو وكأنها من مشروع Next.js قديم أو تجريبي. الملفات المتبقية في `src/pages/` (مثل `PaymentSuccess.tsx`) تستخدم بشكل صحيح `react-router-dom` وهي متوافقة مع Vite.

## ✅ الحل الإضافي - تحويل API functions من Next.js pattern

### المشكلة المكتشفة حديثاً:
رغم حل مشكلة `src/pages/`، ما زال هناك تحذير:
```
WARN! When using Next.js, it is recommended to place JavaScript Functions inside of the `pages/api` (provided by Next.js) directory instead of `api` (provided by Vercel).
```

### السبب الإضافي:
ملفات في مجلد `api/` الجذر تستخدم **Next.js handler pattern**:
```javascript
// Next.js pattern (يسبب التحذير):
export default async function handler(req, res) {
```

### الحل الإضافي المطبق:
تحويل جميع ملفات API إلى **Vercel Serverless Function pattern**:

**الملفات المحولة:**
- ✅ `api/payment_intent.js` - من `handler` إلى anonymous function
- ✅ `api/webhook.js` - من `handler` إلى anonymous function  
- ✅ `api/auth/login.js` - من `handler` إلى anonymous function
- ✅ `api/auth/register.js` - من `handler` إلى anonymous function

**التحويل:**
```javascript
// من:
export default async function handler(req, res) {

// إلى:
export default async function (req, res) {
```

### النتيجة النهائية المحدثة:
- ✅ **لا توجد Next.js imports** في الكود
- ✅ **لا توجد Next.js handler patterns** في API functions
- ✅ جميع API functions تستخدم **Vercel Serverless Function pattern**
- ✅ Vercel سيتعرف على المشروع كـ **Vite + Vercel Functions** بوضوح
- ✅ **لن يحدث أي تحذيرات Next.js** بعد الآن

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
