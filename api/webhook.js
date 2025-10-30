// Webhook endpoint محسن لاستقبال إشعارات الدفع من Ziina
// Enhanced Webhook endpoint for receiving payment notifications from Ziina

import ziinaGateway from '../lib/ziina.js';
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Ziina-Signature');

  // معالجة OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // السماح فقط بـ POST requests
  if (req.method !== 'POST') {
    console.warn('⚠️ محاولة وصول غير مسموحة للـ webhook:', {
      method: req.method,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'يُسمح فقط بـ POST requests',
      allowedMethods: ['POST']
    });
  }

  try {
    // التحقق من إعدادات البيئة
    if (!envConfig) {
      console.error('❌ إعدادات البيئة غير متوفرة للـ webhook');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'خطأ في إعدادات الخادم'
      });
    }

    // الحصول على البيانات من Ziina
    const webhookData = req.body;
    const signature = req.headers['x-ziina-signature'] || req.headers['ziina-signature'];
    
    // تسجيل الـ webhook للمراقبة (بدون البيانات الحساسة)
    console.log('🔔 Webhook مستلم:', {
      timestamp: new Date().toISOString(),
      paymentId: webhookData?.id,
      eventType: webhookData?.status || webhookData?.event_type,
      amount: webhookData?.amount,
      hasSignature: !!signature,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // التحقق من وجود البيانات الأساسية
    if (!webhookData || !webhookData.id) {
      console.error('❌ بيانات webhook غير صحيحة:', webhookData);
      return res.status(400).json({ 
        error: 'Invalid webhook data',
        message: 'بيانات الـ webhook غير صحيحة أو مفقودة'
      });
    }

    // التحقق من صحة التوقيع (إذا كان متوفراً)
    if (signature) {
      const isValidSignature = ziinaGateway.verifyWebhookSignature(
        JSON.stringify(webhookData),
        signature
      );
      
      if (!isValidSignature) {
        console.error('❌ توقيع webhook غير صحيح:', {
          paymentId: webhookData.id,
          signature: signature.substring(0, 20) + '...'
        });
        
        return res.status(401).json({
          error: 'Invalid signature',
          message: 'توقيع الـ webhook غير صحيح'
        });
      }
      
      console.log('✅ تم التحقق من توقيع الـ webhook بنجاح');
    } else {
      console.warn('⚠️ لا يوجد توقيع في الـ webhook - قد يكون غير آمن');
    }

    // معالجة الـ webhook باستخدام مكتبة Ziina
    const result = await ziinaGateway.processWebhook(webhookData);

    // تسجيل نتيجة المعالجة
    console.log('✅ تم معالجة الـ webhook بنجاح:', {
      paymentId: webhookData.id,
      type: result.type,
      success: result.success
    });

    // إرجاع استجابة نجاح لـ Ziina
    res.status(200).json({ 
      received: true,
      processed: true,
      paymentId: webhookData.id,
      type: result.type,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ خطأ في معالجة الـ webhook:', {
      error: error.message,
      stack: error.stack,
      paymentId: req.body?.id,
      timestamp: new Date().toISOString()
    });
    
    // إرجاع خطأ لـ Ziina لإعادة المحاولة
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: 'فشل في معالجة الـ webhook',
      paymentId: req.body?.id,
      timestamp: new Date().toISOString()
    });
  }
}


