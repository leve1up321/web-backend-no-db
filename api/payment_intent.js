// API endpoint محسن لإنشاء Payment Intent مع Ziina
// Enhanced API endpoint for creating Payment Intent with Ziina

import ziinaGateway, { ZiinaError } from '../lib/ziina.js';
import { validateEnvironment } from '../lib/env.js';

// التحقق من متغيرات البيئة عند بدء التشغيل
let envConfig;
try {
  envConfig = validateEnvironment();
} catch (error) {
  console.error('❌ خطأ في إعدادات البيئة:', error.message);
}

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
    // التحقق من إعدادات البيئة
    if (!envConfig) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'خطأ في إعدادات الخادم - تحقق من متغيرات البيئة'
      });
    }

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

    // التحقق من صحة البريد الإلكتروني (إذا تم توفيره)
    if (customerEmail && !isValidEmail(customerEmail)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'البريد الإلكتروني غير صحيح'
      });
    }

    // إعداد بيانات الدفع
    const paymentData = {
      amount: parseFloat(amount),
      productName: productName.trim(),
      productId: productId || generateProductId(productName),
      customerEmail: customerEmail?.trim(),
      customerName: customerName?.trim(),
      customerPhone: customerPhone?.trim(),
      description: description?.trim(),
      metadata: {
        source: 'web',
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    console.log('🔄 طلب إنشاء Payment Intent:', {
      productName: paymentData.productName,
      amount: paymentData.amount,
      customerEmail: paymentData.customerEmail || 'غير محدد',
      ip: paymentData.metadata.ip
    });

    // إنشاء Payment Intent باستخدام مكتبة Ziina
    const result = await ziinaGateway.createPaymentIntent(paymentData);

    // إرجاع النتيجة للعميل
    res.status(200).json({
      success: true,
      data: {
        redirectUrl: result.redirectUrl,
        paymentId: result.paymentIntent.id,
        amount: result.paymentIntent.amount / 100, // تحويل من فلس إلى درهم
        currency: result.paymentIntent.currency_code || 'AED',
        productName: paymentData.productName,
        testMode: result.paymentIntent.test || false
      },
      message: 'تم إنشاء رابط الدفع بنجاح',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء Payment Intent:', error);

    // معالجة أخطاء Ziina المخصصة
    if (error instanceof ZiinaError) {
      return res.status(error.statusCode || 400).json({
        error: 'Payment service error',
        message: getArabicErrorMessage(error.message),
        details: error.details,
        code: error.statusCode
      });
    }

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
 * @param {string} errorMessage - رسالة الخطأ بالإنجليزية
 * @returns {string} - رسالة الخطأ بالعربية
 */
function getArabicErrorMessage(errorMessage) {
  const translations = {
    'Invalid amount: must be a positive number': 'المبلغ غير صحيح: يجب أن يكون رقماً موجباً',
    'Invalid product name: must be a non-empty string': 'اسم المنتج غير صحيح: يجب أن يكون نصاً غير فارغ',
    'Amount must be at least 1 AED': 'المبلغ يجب أن يكون درهم واحد على الأقل',
    'Amount cannot exceed 50,000 AED': 'المبلغ لا يمكن أن يتجاوز 50,000 درهم',
    'Failed to create payment intent': 'فشل في إنشاء رابط الدفع',
    'Invalid payment response: missing redirect_url': 'استجابة دفع غير صحيحة: رابط إعادة التوجيه مفقود'
  };

  return translations[errorMessage] || 'خطأ في خدمة الدفع، يرجى المحاولة مرة أخرى';
}
