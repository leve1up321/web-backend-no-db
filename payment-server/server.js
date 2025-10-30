const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const ZiinaPaymentGateway = require('./lib/ziina');

const app = express();
const PORT = process.env.PORT || 3001;

// إعداد الأمان
app.use(helmet());

// إعداد CORS
const corsOptions = {
  origin: [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://levelup-iota.vercel.app',
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PROD_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// إعداد Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى 100 طلب لكل IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    message: 'طلبات كثيرة جداً من هذا العنوان، يرجى المحاولة لاحقاً.'
  }
});

app.use('/api/', limiter);

// إعداد parsing للـ JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// إنشاء instance من زينة
let ziinaGateway;
try {
  ziinaGateway = new ZiinaPaymentGateway();
  console.log('✅ Ziina Payment Gateway initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Ziina Payment Gateway:', error.message);
  process.exit(1);
}

// Middleware للتحقق من وجود زينة
const requireZiina = (req, res, next) => {
  if (!ziinaGateway) {
    return res.status(500).json({
      success: false,
      error: 'Payment gateway not available',
      message: 'بوابة الدفع غير متاحة حالياً'
    });
  }
  next();
};

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: 'Level Up Store - Ziina Payment Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      'POST /api/payment/create': 'إنشاء دفعة جديدة',
      'GET /api/payment/status/:id': 'التحقق من حالة الدفعة',
      'POST /api/payment/webhook': 'استقبال إشعارات زينة'
    }
  });
});

// إنشاء دفعة جديدة
app.post('/api/payment/create', requireZiina, async (req, res) => {
  try {
    const {
      amount,
      currency = 'AED',
      description,
      order_id,
      customer_email,
      customer_name,
      items = []
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!amount || !description || !order_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'البيانات المطلوبة ناقصة: المبلغ، الوصف، رقم الطلب',
        required_fields: ['amount', 'description', 'order_id']
      });
    }

    // إنشاء URLs للنجاح والإلغاء
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_PROD_URL 
      : process.env.FRONTEND_URL;

    const success_url = `${frontendUrl}/payment/success?order_id=${order_id}`;
    const cancel_url = `${frontendUrl}/payment/cancel?order_id=${order_id}`;
    const webhook_url = `${req.protocol}://${req.get('host')}/api/payment/webhook`;

    console.log('Creating payment with URLs:', {
      success_url,
      cancel_url,
      webhook_url
    });

    // إنشاء الدفعة
    const paymentData = {
      amount,
      currency,
      description,
      order_id,
      customer_email,
      customer_name,
      success_url,
      cancel_url,
      webhook_url
    };

    const result = await ziinaGateway.createPayment(paymentData);

    // حفظ معلومات الطلب (يمكن حفظها في قاعدة البيانات لاحقاً)
    console.log('Payment created for order:', {
      order_id,
      payment_id: result.payment_id,
      amount: `${amount} ${currency}`,
      items_count: items.length
    });

    res.json({
      success: true,
      payment_url: result.payment_url,
      payment_id: result.payment_id,
      order_id: result.order_id,
      amount: result.amount,
      currency: result.currency,
      status: result.status,
      message: 'تم إنشاء رابط الدفع بنجاح'
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'حدث خطأ أثناء إنشاء رابط الدفع',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// التحقق من حالة الدفعة
app.get('/api/payment/status/:paymentId', requireZiina, async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required',
        message: 'رقم الدفعة مطلوب'
      });
    }

    const status = await ziinaGateway.getPaymentStatus(paymentId);

    res.json({
      success: true,
      payment: status,
      message: 'تم جلب حالة الدفعة بنجاح'
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'حدث خطأ أثناء جلب حالة الدفعة'
    });
  }
});

// استقبال webhooks من زينة
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-ziina-signature'] || req.headers['ziina-signature'];
    const payload = req.body.toString();

    console.log('Received webhook from Ziina:', {
      signature: signature ? 'Present' : 'Missing',
      payload_length: payload.length
    });

    if (!ziinaGateway) {
      console.error('Ziina gateway not initialized for webhook');
      return res.status(500).json({ error: 'Payment gateway not available' });
    }

    const result = await ziinaGateway.processWebhook(payload, signature);

    console.log('Webhook processed successfully:', result);

    // هنا يمكن إضافة منطق إضافي مثل:
    // - تحديث قاعدة البيانات
    // - إرسال إيميلات للعملاء
    // - إشعارات للإدارة
    // - تحديث حالة الطلب

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// معالجة الأخطاء العامة
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'حدث خطأ داخلي في الخادم',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// معالجة الطرق غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'الرابط المطلوب غير موجود',
    available_endpoints: [
      'POST /api/payment/create',
      'GET /api/payment/status/:id',
      'POST /api/payment/webhook'
    ]
  });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`
🚀 Level Up Store - Ziina Payment Server
📍 Server running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
💳 Ziina Gateway: ${ziinaGateway ? '✅ Ready' : '❌ Not Available'}
🔒 CORS Origins: ${corsOptions.origin.join(', ')}

📋 Available Endpoints:
   GET  /                           - Server info
   POST /api/payment/create         - Create payment
   GET  /api/payment/status/:id     - Check payment status  
   POST /api/payment/webhook        - Ziina webhooks

🎯 Ready to process payments!
  `);
});

// معالجة إغلاق الخادم بشكل صحيح
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;

