// Vercel Serverless Function لإنشاء Payment Intent مع Ziina
// Enhanced Payment Intent API for Ziina Payment Gateway

export default async function handler(req, res) {
  // إضافة CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // معالجة OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'يُسمح فقط بـ POST requests',
      allowedMethods: ['POST']
    });
  }

  try {
    // استخراج البيانات من الطلب
    const {
      productName,
      productId,
      amount,
      customerEmail,
      customerName,
      customerPhone,
      description,
      metadata = {}
    } = req.body;

    // التحقق من البيانات الأساسية
    if (!productName || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'اسم المنتج والمبلغ مطلوبان',
        requiredFields: ['productName', 'amount']
      });
    }

    // التحقق من صحة المبلغ
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'المبلغ يجب أن يكون رقماً موجباً'
      });
    }

    if (numericAmount < 1) {
      return res.status(400).json({
        error: 'Amount too small',
        message: 'المبلغ يجب أن يكون درهم واحد على الأقل'
      });
    }

    if (numericAmount > 50000) {
      return res.status(400).json({
        error: 'Amount too large',
        message: 'المبلغ لا يمكن أن يتجاوز 50,000 درهم'
      });
    }

    // التحقق من صحة البريد الإلكتروني (إذا تم توفيره)
    if (customerEmail && !isValidEmail(customerEmail)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'البريد الإلكتروني غير صحيح'
      });
    }

    // الحصول على مفتاح API من متغيرات البيئة
    const ziinaApiKey = process.env.ZIINA_SECRET_KEY;
    if (!ziinaApiKey) {
      console.error('ZIINA_SECRET_KEY not found in environment variables');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'خطأ في إعدادات الخادم - تحقق من متغيرات البيئة'
      });
    }

    // إعداد URLs للنجاح والإلغاء
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
    
    const successUrl = `${baseUrl}/payment/success`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    // إعداد بيانات الطلب
    const requestBody = {
      amount: Math.round(numericAmount * 100), // تحويل إلى فلس (أصغر وحدة)
      currency_code: 'AED',
      message: description || `شراء: ${productName}`,
      success_url: successUrl,
      cancel_url: cancelUrl,
      failure_url: cancelUrl,
      test: process.env.NODE_ENV !== 'production',
      allow_tips: false,
      
      // بيانات العميل (إذا توفرت)
      ...(customerEmail && { customer_email: customerEmail }),
      ...(customerName && { customer_name: customerName }),
      ...(customerPhone && { customer_phone: customerPhone }),
      
      // Metadata للتتبع
      metadata: {
        product_id: productId || generateProductId(productName),
        product_name: productName,
        customer_email: customerEmail,
        source: 'vite_react_app',
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    console.log('🔄 إنشاء Payment Intent:', {
      productName,
      amount: numericAmount,
      currency: 'AED',
      testMode: process.env.NODE_ENV !== 'production',
      customerEmail: customerEmail || 'غير محدد'
    });

    // إرسال الطلب إلى Ziina
    const ziinaResponse = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ziinaApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LevelUp-Store/1.0'
      },
      body: JSON.stringify(requestBody)
    });

    // التحقق من نجاح الطلب
    if (!ziinaResponse.ok) {
      const errorText = await ziinaResponse.text();
      console.error('❌ خطأ Ziina API:', {
        status: ziinaResponse.status,
        statusText: ziinaResponse.statusText,
        error: errorText
      });
      
      return res.status(ziinaResponse.status).json({
        error: 'Payment service error',
        message: getArabicErrorMessage(ziinaResponse.status),
        details: errorText
      });
    }

    const paymentIntent = await ziinaResponse.json();

    // التحقق من وجود redirect_url
    if (!paymentIntent.redirect_url) {
      console.error('❌ لا يوجد redirect_url في استجابة Ziina:', paymentIntent);
      return res.status(500).json({
        error: 'Invalid payment response',
        message: 'استجابة دفع غير صحيحة: رابط إعادة التوجيه مفقود'
      });
    }

    console.log('✅ تم إنشاء Payment Intent بنجاح:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency_code
    });

    // إرجاع النتيجة للعميل
    res.status(200).json({
      success: true,
      data: {
        redirectUrl: paymentIntent.redirect_url,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // تحويل من فلس إلى درهم
        currency: paymentIntent.currency_code || 'AED',
        productName: productName,
        testMode: paymentIntent.test || false
      },
      message: 'تم إنشاء رابط الدفع بنجاح',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء Payment Intent:', error);

    // معالجة الأخطاء العامة
    res.status(500).json({
      error: 'Internal server error',
      message: 'خطأ داخلي في الخادم، يرجى المحاولة مرة أخرى',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean} - هل البريد صحيح؟
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * إنشاء معرف منتج من اسم المنتج
 * @param {string} productName - اسم المنتج
 * @returns {string} - معرف المنتج
 */
function generateProductId(productName) {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '-') // السماح بالأحرف العربية
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * ترجمة رسائل الخطأ إلى العربية
 * @param {number} statusCode - رمز الحالة
 * @returns {string} - رسالة الخطأ بالعربية
 */
function getArabicErrorMessage(statusCode) {
  const messages = {
    400: 'بيانات الطلب غير صحيحة',
    401: 'مفتاح API غير صحيح',
    403: 'غير مسموح بالوصول',
    404: 'الخدمة غير متوفرة',
    429: 'تم تجاوز حد الطلبات المسموح',
    500: 'خطأ في خادم Ziina',
    502: 'خطأ في الاتصال مع Ziina',
    503: 'خدمة Ziina غير متوفرة مؤقتاً'
  };

  return messages[statusCode] || 'خطأ في خدمة الدفع، يرجى المحاولة مرة أخرى';
}
