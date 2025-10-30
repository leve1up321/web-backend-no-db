import { Resend } from 'resend';

// إنشاء instance من Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// إرسال بريد تأكيد الطلب للعميل
export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderId,
  orderNumber,
  productName,
  items, // للسلة
  amount,
  currency,
  downloadLink
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.SUPPORT_EMAIL || 'support@levelup-store.com',
      to: [customerEmail],
      subject: `🎉 تأكيد طلبك ${orderNumber} - متجر لفل اب`,
      html: generateOrderConfirmationHTML({
        customerName,
        orderId,
        orderNumber,
        productName,
        items,
        amount,
        currency,
        downloadLink
      })
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error };
    }

    console.log('✅ Confirmation email sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    return { success: false, error: error.message };
  }
}

// إرسال إشعار للإدارة
export async function sendAdminNotificationEmail({
  type,
  orderId,
  orderNumber,
  customerEmail,
  customerName,
  amount,
  currency,
  productName,
  reason = null
}) {
  try {
    const subject = getAdminNotificationSubject(type, orderNumber);
    const html = generateAdminNotificationHTML({
      type,
      orderId,
      orderNumber,
      customerEmail,
      customerName,
      amount,
      currency,
      productName,
      reason
    });

    const { data, error } = await resend.emails.send({
      from: process.env.SUPPORT_EMAIL || 'support@levelup-store.com',
      to: [process.env.ADMIN_EMAIL || 'admin@levelup-store.com'],
      subject,
      html
    });

    if (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error };
    }

    console.log('✅ Admin notification sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error);
    return { success: false, error: error.message };
  }
}

// توليد HTML لبريد تأكيد الطلب
function generateOrderConfirmationHTML({
  customerName,
  orderId,
  orderNumber,
  productName,
  items,
  amount,
  currency,
  downloadLink
}) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد طلبك - متجر لفل اب</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%);
          margin: 0;
          padding: 20px;
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(140, 0, 255, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #8c00ff 0%, #00ffd1 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .order-details {
          background: rgba(140, 0, 255, 0.1);
          border: 1px solid rgba(140, 0, 255, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
        }
        .download-button {
          display: inline-block;
          background: linear-gradient(135deg, #8c00ff 0%, #00ffd1 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background: #1a1a1a;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">🎉</div>
          <h1>تم تأكيد طلبك بنجاح!</h1>
          <p>شكراً لك ${customerName || 'عزيزي العميل'}</p>
        </div>
        
        <div class="content">
          <h2>📋 تفاصيل الطلب</h2>
          <div class="order-details">
            <p><strong>رقم الطلب:</strong> ${orderNumber}</p>
            ${items && items.length > 0 ? `
              <p><strong>المنتجات:</strong></p>
              <ul style="margin: 10px 0; padding-right: 20px;">
                ${items.map(item => `
                  <li style="margin: 5px 0;">
                    ${item.title} × ${item.quantity} - ${item.price * item.quantity} ${currency}
                  </li>
                `).join('')}
              </ul>
            ` : `
              <p><strong>المنتج:</strong> ${productName}</p>
            `}
            <p><strong>المبلغ الإجمالي:</strong> ${amount} ${currency}</p>
            <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
          
          <h2>💾 تحميل المنتج</h2>
          <p>يمكنك الآن تحميل منتجك من الرابط أدناه:</p>
          
          <a href="${downloadLink}" class="download-button">
            📥 تحميل المنتج الآن
          </a>
          
          <p><strong>ملاحظة مهمة:</strong> رابط التحميل صالح لمدة 7 أيام من تاريخ الشراء.</p>
          
          <h2>📞 الدعم</h2>
          <p>إذا واجهت أي مشكلة، لا تتردد في التواصل معنا:</p>
          <p>📧 البريد الإلكتروني: support@levelup-store.com</p>
          <p>🕐 ساعات العمل: 24/7</p>
        </div>
        
        <div class="footer">
          <p>© 2024 متجر لفل اب - جميع الحقوق محفوظة</p>
          <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه مباشرة</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// توليد عنوان إشعار الإدارة
function getAdminNotificationSubject(type, orderNumber) {
  switch (type) {
    case 'payment_success':
      return `✅ طلب جديد مكتمل: ${orderNumber}`;
    case 'payment_failed':
      return `❌ فشل في الدفع: ${orderNumber}`;
    case 'payment_canceled':
      return `🚫 إلغاء طلب: ${orderNumber}`;
    default:
      return `📋 إشعار طلب: ${orderNumber}`;
  }
}

// توليد HTML لإشعار الإدارة
function generateAdminNotificationHTML({
  type,
  orderId,
  orderNumber,
  customerEmail,
  customerName,
  amount,
  currency,
  productName,
  reason
}) {
  const statusEmoji = {
    payment_success: '✅',
    payment_failed: '❌',
    payment_canceled: '🚫'
  };

  const statusText = {
    payment_success: 'مكتمل بنجاح',
    payment_failed: 'فشل في الدفع',
    payment_canceled: 'تم الإلغاء'
  };

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إشعار إدارة - متجر لفل اب</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #8c00ff 0%, #00ffd1 100%);
          padding: 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 30px;
        }
        .status {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .label {
          font-weight: bold;
          color: #666;
        }
        .value {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 إشعار إدارة</h1>
          <p>متجر لفل اب</p>
        </div>
        
        <div class="content">
          <div class="status">
            ${statusEmoji[type] || '📋'} حالة الطلب: ${statusText[type] || 'غير محدد'}
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="label">رقم الطلب:</span>
              <span class="value">${orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="label">معرف الدفع:</span>
              <span class="value">${orderId}</span>
            </div>
            <div class="detail-row">
              <span class="label">اسم العميل:</span>
              <span class="value">${customerName || 'غير محدد'}</span>
            </div>
            <div class="detail-row">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="label">المنتج:</span>
              <span class="value">${productName || 'غير محدد'}</span>
            </div>
            <div class="detail-row">
              <span class="label">المبلغ:</span>
              <span class="value">${amount} ${currency}</span>
            </div>
            <div class="detail-row">
              <span class="label">التاريخ:</span>
              <span class="value">${new Date().toLocaleString('ar-SA')}</span>
            </div>
            ${reason ? `
            <div class="detail-row">
              <span class="label">سبب الفشل:</span>
              <span class="value">${reason}</span>
            </div>
            ` : ''}
          </div>
          
          <p><strong>الإجراءات المطلوبة:</strong></p>
          <ul>
            ${type === 'payment_success' ? `
              <li>✅ تم إرسال رابط التحميل للعميل</li>
              <li>📊 تحديث إحصائيات المبيعات</li>
            ` : ''}
            ${type === 'payment_failed' ? `
              <li>📞 التواصل مع العميل لحل المشكلة</li>
              <li>🔍 مراجعة سبب فشل الدفع</li>
            ` : ''}
            ${type === 'payment_canceled' ? `
              <li>📧 إرسال بريد متابعة للعميل</li>
              <li>📈 تحليل أسباب الإلغاء</li>
            ` : ''}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
}
