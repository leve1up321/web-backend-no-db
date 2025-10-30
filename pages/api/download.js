import { verifyDownloadToken } from '@/lib/storage';

export default async function handler(req, res) {
  // قبول GET requests فقط
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    // التحقق من وجود التوكن
    if (!token) {
      return res.status(400).json({ error: 'Download token is required' });
    }

    // التحقق من صحة التوكن
    const verification = verifyDownloadToken(token);
    
    if (!verification.valid) {
      return res.status(401).json({ 
        error: 'Invalid or expired download link',
        details: verification.error 
      });
    }

    // تسجيل محاولة التحميل
    console.log(`📥 Download attempt:`, {
      orderId: verification.orderId,
      customerEmail: verification.customerEmail,
      blobUrl: verification.blobUrl,
      timestamp: new Date().toISOString()
    });

    // إعادة توجيه إلى الملف الفعلي
    // في Vercel Blob، يمكن الوصول المباشر للملفات الخاصة عبر signed URLs
    try {
      // جلب الملف من Vercel Blob
      const fileResponse = await fetch(verification.blobUrl);
      
      if (!fileResponse.ok) {
        throw new Error(`File not found: ${fileResponse.status}`);
      }

      // الحصول على معلومات الملف
      const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
      const contentLength = fileResponse.headers.get('content-length');
      
      // استخراج اسم الملف من URL
      const filename = verification.blobUrl.split('/').pop().split('?')[0];
      
      // تعيين headers للتحميل
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // تمرير محتوى الملف
      const fileBuffer = await fileResponse.arrayBuffer();
      res.send(Buffer.from(fileBuffer));

      // تسجيل التحميل الناجح
      console.log(`✅ File downloaded successfully:`, {
        orderId: verification.orderId,
        filename,
        size: contentLength || 'unknown'
      });

    } catch (fileError) {
      console.error('Error fetching file:', fileError);
      return res.status(404).json({ 
        error: 'File not found or no longer available',
        details: fileError.message 
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
