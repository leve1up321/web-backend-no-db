# 🚀 نظام المستخدمين الحقيقي - Level Up Store

## 📋 نظرة عامة

تم تطوير نظام مستخدمين متكامل وحقيقي لمتجر Level Up Store، يحل محل النظام التجريبي السابق ويوفر تجربة مستخدم كاملة مع قاعدة بيانات MongoDB وأمان متقدم.

## 🏗️ المعمارية الجديدة

```
Frontend (React + TypeScript)
        ↓
    Vercel APIs
        ↓
Vercel Functions (Node.js)
        ↓
MongoDB Database
        ↓
Ziina Payment Gateway
```

## 📁 هيكل الملفات الجديدة

### 🗄️ قاعدة البيانات والنماذج
```
lib/
├── mongodb.js          # اتصال MongoDB محسن للـ serverless
└── auth.js            # نظام المصادقة والأمان

models/
├── User.js            # نموذج المستخدم (20+ دالة)
└── Order.js           # نموذج الطلبات (25+ دالة)
```

### 🔌 APIs الجديدة
```
api/
├── auth/
│   ├── register.js    # تسجيل مستخدم جديد
│   ├── login.js       # تسجيل الدخول
│   └── verify.js      # التحقق من التوكن
├── user/
│   ├── profile.js     # استرجاع الملف الشخصي
│   └── update.js      # تحديث بيانات المستخدم
└── orders/
    ├── list.js        # قائمة الطلبات مع pagination
    └── details.js     # تفاصيل طلب محدد
```

### 🎨 الواجهة الأمامية
```
src/
├── contexts/
│   └── AuthContext.tsx    # إدارة حالة المصادقة
└── pages/
    ├── Login.tsx          # صفحة تسجيل الدخول
    └── Register.tsx       # صفحة التسجيل
```

## 🔧 الإعداد والتشغيل

### 1. متطلبات النظام
```bash
# تثبيت المكتبات الجديدة
npm install bcryptjs mongodb @types/bcryptjs @types/jsonwebtoken
```

### 2. متغيرات البيئة المطلوبة
```env
# MongoDB Database (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/levelup_store

# JWT Secret (REQUIRED)
JWT_SECRET=your-super-secure-jwt-key-min-32-characters

# Ziina Payment (existing)
ZIINA_SECRET_KEY=sk_test_your_key
ZIINA_WEBHOOK_SECRET=whsec_your_secret
```

### 3. إعداد قاعدة البيانات
1. إنشاء حساب مجاني على [MongoDB Atlas](https://mongodb.com/atlas)
2. إنشاء cluster جديد
3. الحصول على connection string
4. إضافة الرابط إلى `.env.local`

## 🔐 نظام الأمان

### تشفير كلمات المرور
- **bcrypt** مع 12 جولة تشفير
- حماية من brute-force attacks
- تحقق قوي من جودة كلمة المرور

### JWT Tokens
- صلاحية 7 أيام
- تحقق تلقائي عند كل طلب
- تخزين آمن في localStorage

### التحقق من البيانات
- تنظيف البيانات الحساسة
- التحقق من صيغة البريد الإلكتروني
- حماية من SQL injection

## 📊 نماذج البيانات

### 👤 نموذج المستخدم
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  country: String (default: UAE),
  
  // حالات التحقق
  isEmailVerified: Boolean,
  isActive: Boolean,
  
  // الإحصائيات
  stats: {
    totalOrders: Number,
    totalSpent: Number,
    totalReviews: Number,
    averageRating: Number
  },
  
  // الإعدادات
  preferences: {
    language: String (default: ar),
    currency: String (default: AED),
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### 🛒 نموذج الطلب
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  orderNumber: String (unique, format: LU000000000),
  
  products: Array,
  customerInfo: Object,
  shippingAddress: Object,
  billingAddress: Object,
  
  // الأسعار
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  discount: Number,
  total: Number,
  currency: String (default: AED),
  
  // الحالات
  status: Enum (pending, processing, shipped, delivered, cancelled),
  paymentStatus: Enum (pending, paid, failed, refunded),
  paymentMethod: String,
  
  // معلومات الدفع
  paymentId: String,
  ziinaTransactionId: String,
  
  // التتبع
  trackingNumber: String,
  notes: String,
  
  // الطوابع الزمنية
  createdAt: Date,
  updatedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}
```

## 🔌 استخدام APIs

### تسجيل مستخدم جديد
```javascript
POST /api/auth/register
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "SecurePass123",
  "phone": "+971501234567",
  "address": "شارع الشيخ زايد",
  "city": "دبي"
}
```

### تسجيل الدخول
```javascript
POST /api/auth/login
{
  "email": "ahmed@example.com",
  "password": "SecurePass123"
}
```

### استرجاع الملف الشخصي
```javascript
GET /api/user/profile
Headers: {
  "Authorization": "Bearer your-jwt-token"
}
```

### قائمة الطلبات
```javascript
GET /api/orders/list?page=1&limit=10&status=delivered
Headers: {
  "Authorization": "Bearer your-jwt-token"
}
```

## 🎯 الميزات الرئيسية

### ✅ للمستخدمين
- تسجيل دخول وإنشاء حساب آمن
- ملف شخصي شامل مع الإحصائيات
- تتبع الطلبات والتاريخ
- تحديث البيانات الشخصية
- إعدادات اللغة والعملة

### ✅ للمطورين
- APIs موثقة ومنظمة
- معالجة شاملة للأخطاء
- pagination للبيانات الكبيرة
- تحسين الأداء للـ serverless
- أمان متقدم ومتعدد الطبقات

### ✅ للإدارة
- إحصائيات المستخدمين والطلبات
- تتبع شامل للعمليات
- نظام إشعارات متكامل
- تقارير مفصلة

## 🔄 التكامل مع النظام الموجود

### صفحة "حسابي" الجديدة
- عرض البيانات الحقيقية من قاعدة البيانات
- إحصائيات دقيقة للطلبات والمصاريف
- تاريخ كامل للطلبات مع التفاصيل
- إمكانية تحديث البيانات الشخصية

### تكامل مع Ziina Payment
- ربط الطلبات بالمستخدمين
- تتبع حالة الدفع
- تحديث تلقائي للإحصائيات
- إشعارات الطلبات الجديدة

## 🚀 خطوات التفعيل

### 1. إعداد قاعدة البيانات
```bash
# إنشاء حساب MongoDB Atlas
# الحصول على connection string
# إضافة MONGODB_URI إلى .env.local
```

### 2. إعداد JWT Secret
```bash
# توليد مفتاح آمن
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# إضافة JWT_SECRET إلى .env.local
```

### 3. تحديث AuthProvider
```jsx
// في src/App.tsx أو المكون الرئيسي
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* باقي التطبيق */}
    </AuthProvider>
  );
}
```

### 4. تحديث صفحة "حسابي"
```jsx
// استخدام البيانات الحقيقية
import { useAuth } from '@/contexts/AuthContext';

function CustomerAccount() {
  const { user, refreshProfile } = useAuth();
  
  // عرض البيانات الحقيقية بدلاً من التجريبية
}
```

## 📈 الأداء والتحسين

### قاعدة البيانات
- **Connection Pooling**: إعادة استخدام الاتصالات
- **Indexes**: فهرسة محسنة للبحث السريع
- **Aggregation**: استعلامات محسنة للإحصائيات

### APIs
- **Caching**: تخزين مؤقت للبيانات المتكررة
- **Pagination**: تقسيم البيانات الكبيرة
- **Rate Limiting**: حماية من الاستخدام المفرط

### الواجهة الأمامية
- **State Management**: إدارة محسنة للحالة
- **Error Handling**: معالجة شاملة للأخطاء
- **Loading States**: حالات تحميل واضحة

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### خطأ اتصال قاعدة البيانات
```bash
# التحقق من صحة MONGODB_URI
# التأكد من إضافة IP address إلى whitelist
# فحص صحة username/password
```

#### خطأ JWT Token
```bash
# التحقق من وجود JWT_SECRET
# التأكد من طول المفتاح (32 حرف على الأقل)
# فحص انتهاء صلاحية التوكن
```

#### مشاكل CORS
```bash
# إضافة domains المسموحة
# تحديث headers في APIs
# فحص إعدادات Vercel
```

## 📞 الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- إنشاء issue في GitHub
- مراجعة الوثائق التقنية
- فحص console logs للأخطاء

## 🎉 الخلاصة

تم تطوير نظام مستخدمين متكامل وحقيقي يحول متجر Level Up Store من نظام تجريبي إلى منصة تجارة إلكترونية كاملة ومتقدمة. النظام يوفر أماناً عالياً، أداءً محسناً، وتجربة مستخدم ممتازة.

---

**تم التطوير بواسطة:** Codegen AI  
**التاريخ:** أكتوبر 2024  
**الإصدار:** 1.0.0
