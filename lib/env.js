// مكتبة إدارة متغيرات البيئة والتحقق من صحتها
// Environment Variables Management and Validation Library

/**
 * التحقق من وجود متغير بيئة مطلوب
 * @param {string} key - اسم المتغير
 * @param {string} description - وصف المتغير (للأخطاء)
 * @returns {string} - قيمة المتغير
 * @throws {Error} - إذا كان المتغير غير موجود
 */
function requireEnv(key, description = '') {
  const value = process.env[key];
  
  if (!value) {
    const errorMsg = `❌ متغير البيئة المطلوب غير موجود: ${key}`;
    const helpMsg = description ? `\n💡 ${description}` : '';
    
    console.error(errorMsg + helpMsg);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

/**
 * الحصول على متغير بيئة مع قيمة افتراضية
 * @param {string} key - اسم المتغير
 * @param {string} defaultValue - القيمة الافتراضية
 * @returns {string} - قيمة المتغير أو القيمة الافتراضية
 */
function getEnv(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

/**
 * التحقق من صحة جميع متغيرات البيئة المطلوبة
 * @returns {Object} - كائن يحتوي على جميع المتغيرات المطلوبة
 */
function validateEnvironment() {
  try {
    const config = {
      // 🔑 Ziina Payment Gateway (مطلوب)
      ziina: {
        secretKey: requireEnv('ZIINA_SECRET_KEY', 'مفتاح Ziina API السري - احصل عليه من https://business.ziina.com/'),
        webhookSecret: requireEnv('ZIINA_WEBHOOK_SECRET', 'مفتاح Webhook السري من Ziina'),
      },
      
      // 🌐 URLs (مطلوب)
      urls: {
        baseUrl: requireEnv('NEXT_PUBLIC_BASE_URL', 'الرابط الأساسي للموقع (مثل: https://your-domain.com)'),
        appUrl: getEnv('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_BASE_URL),
        vercelUrl: getEnv('VERCEL_URL', ''),
      },
      
      // 📧 Email Service (مطلوب)
      email: {
        resendApiKey: requireEnv('RESEND_API_KEY', 'مفتاح Resend API - احصل عليه من https://resend.com/'),
        adminEmail: requireEnv('ADMIN_EMAIL', 'بريد الإدارة الإلكتروني'),
        supportEmail: requireEnv('SUPPORT_EMAIL', 'بريد الدعم الفني'),
        storeName: getEnv('STORE_NAME', 'متجر لفل اب'),
        storeLogoUrl: getEnv('STORE_LOGO_URL', ''),
      },
      
      // 📁 File Storage (مطلوب للمنتجات الرقمية)
      storage: {
        blobToken: requireEnv('BLOB_READ_WRITE_TOKEN', 'رمز Vercel Blob Storage - احصل عليه من لوحة تحكم Vercel'),
      },
      
      // 🔒 Security (مطلوب)
      security: {
        jwtSecret: requireEnv('JWT_SECRET', 'مفتاح JWT السري (يجب أن يكون 32 حرف على الأقل)'),
      },
      
      // 🛠️ Environment
      environment: {
        nodeEnv: getEnv('NODE_ENV', 'development'),
        isProduction: getEnv('NODE_ENV') === 'production',
        isDevelopment: getEnv('NODE_ENV') === 'development',
      },
      
      // 📊 Analytics (اختياري)
      analytics: {
        googleAnalyticsId: getEnv('GOOGLE_ANALYTICS_ID', ''),
        facebookPixelId: getEnv('FACEBOOK_PIXEL_ID', ''),
      },
      
      // 💬 Notifications (اختياري)
      notifications: {
        slackWebhookUrl: getEnv('SLACK_WEBHOOK_URL', ''),
        telegramBotToken: getEnv('TELEGRAM_BOT_TOKEN', ''),
        telegramChatId: getEnv('TELEGRAM_CHAT_ID', ''),
      },
      
      // 🎨 Theme (اختياري)
      theme: {
        themeColor: getEnv('NEXT_PUBLIC_THEME_COLOR', '#1a365d'),
        brandColor: getEnv('NEXT_PUBLIC_BRAND_COLOR', '#3182ce'),
      },
      
      // 🔧 Advanced Settings (اختياري)
      advanced: {
        rateLimitMaxRequests: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100')),
        rateLimitWindowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000')),
        maxFileSizeMB: parseInt(getEnv('MAX_FILE_SIZE_MB', '50')),
      }
    };
    
    // التحقق من صحة JWT Secret
    if (config.security.jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    
    // التحقق من صحة URLs
    if (!config.urls.baseUrl.startsWith('http')) {
      throw new Error('NEXT_PUBLIC_BASE_URL must start with http:// or https://');
    }
    
    console.log('✅ جميع متغيرات البيئة المطلوبة موجودة وصحيحة');
    return config;
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من متغيرات البيئة:', error.message);
    console.error('\n📋 تأكد من وجود ملف .env.local مع جميع المتغيرات المطلوبة');
    console.error('📖 راجع ملف .env.example للحصول على قائمة كاملة بالمتغيرات');
    
    // في بيئة التطوير، نعرض رسالة مساعدة
    if (process.env.NODE_ENV !== 'production') {
      console.error('\n🔧 خطوات الإصلاح:');
      console.error('1. انسخ ملف .env.example إلى .env.local');
      console.error('2. املأ جميع المتغيرات المطلوبة');
      console.error('3. أعد تشغيل الخادم');
    }
    
    throw error;
  }
}

/**
 * الحصول على إعدادات Ziina بناءً على البيئة
 * @param {boolean} isProduction - هل البيئة إنتاج؟
 * @returns {Object} - إعدادات Ziina
 */
function getZiinaConfig(isProduction = false) {
  return {
    apiUrl: 'https://api-v2.ziina.com/api',
    secretKey: requireEnv('ZIINA_SECRET_KEY'),
    webhookSecret: requireEnv('ZIINA_WEBHOOK_SECRET'),
    testMode: !isProduction,
    currency: 'AED',
    allowTips: false,
  };
}

/**
 * الحصول على URLs للنجاح والإلغاء
 * @returns {Object} - URLs للنجاح والإلغاء
 */
function getPaymentUrls() {
  const baseUrl = getEnv('NEXT_PUBLIC_BASE_URL') || 
                  (getEnv('VERCEL_URL') ? `https://${getEnv('VERCEL_URL')}` : 'http://localhost:3000');
  
  return {
    successUrl: `${baseUrl}/payment/success`,
    cancelUrl: `${baseUrl}/payment/cancel`,
    failureUrl: `${baseUrl}/payment/cancel`,
  };
}

// تصدير الدوال
module.exports = {
  requireEnv,
  getEnv,
  validateEnvironment,
  getZiinaConfig,
  getPaymentUrls,
};

// تصدير ES6 (للتوافق مع Next.js)
export {
  requireEnv,
  getEnv,
  validateEnvironment,
  getZiinaConfig,
  getPaymentUrls,
};
