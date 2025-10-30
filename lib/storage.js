import { put, del, head } from '@vercel/blob';
import jwt from 'jsonwebtoken';

// رفع ملف رقمي إلى Vercel Blob Storage
export async function uploadDigitalProduct(file, productId, filename) {
  try {
    // إنشاء مسار فريد للملف
    const filePath = `products/${productId}/${Date.now()}-${filename}`;
    
    // رفع الملف
    const blob = await put(filePath, file, {
      access: 'private', // ملف خاص يحتاج رابط آمن للوصول
      addRandomSuffix: true
    });

    console.log('✅ File uploaded successfully:', blob.url);
    
    return {
      success: true,
      blobUrl: blob.url,
      filePath: filePath,
      size: blob.size
    };

  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// حذف ملف من Vercel Blob Storage
export async function deleteDigitalProduct(blobUrl) {
  try {
    await del(blobUrl);
    console.log('✅ File deleted successfully:', blobUrl);
    
    return { success: true };

  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// التحقق من وجود ملف
export async function checkFileExists(blobUrl) {
  try {
    const fileInfo = await head(blobUrl);
    
    return {
      exists: true,
      size: fileInfo.size,
      contentType: fileInfo.contentType,
      uploadedAt: fileInfo.uploadedAt
    };

  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
}

// إنشاء رابط تحميل آمن ومؤقت
export function generateSecureDownloadLink(blobUrl, orderId, customerEmail, expiresInHours = 168) { // 7 أيام افتراضياً
  try {
    const payload = {
      blobUrl,
      orderId,
      customerEmail,
      exp: Math.floor(Date.now() / 1000) + (expiresInHours * 60 * 60), // انتهاء الصلاحية
      iat: Math.floor(Date.now() / 1000) // وقت الإنشاء
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    // إنشاء رابط التحميل الآمن
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?token=${token}`;
    
    return {
      success: true,
      downloadUrl,
      expiresAt: new Date(payload.exp * 1000).toISOString()
    };

  } catch (error) {
    console.error('Error generating download link:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// التحقق من صحة رابط التحميل
export function verifyDownloadToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // التحقق من انتهاء الصلاحية
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return {
        valid: false,
        error: 'Download link has expired'
      };
    }

    return {
      valid: true,
      blobUrl: decoded.blobUrl,
      orderId: decoded.orderId,
      customerEmail: decoded.customerEmail,
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    };

  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

// إحصائيات الملفات
export async function getFileStats(blobUrls) {
  try {
    const stats = await Promise.all(
      blobUrls.map(async (url) => {
        const info = await checkFileExists(url);
        return {
          url,
          ...info
        };
      })
    );

    const totalSize = stats
      .filter(stat => stat.exists)
      .reduce((sum, stat) => sum + (stat.size || 0), 0);

    return {
      success: true,
      totalFiles: stats.length,
      existingFiles: stats.filter(stat => stat.exists).length,
      totalSize,
      files: stats
    };

  } catch (error) {
    console.error('Error getting file stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// تنظيف الملفات المنتهية الصلاحية (يمكن تشغيلها كـ cron job)
export async function cleanupExpiredFiles(fileRecords) {
  try {
    const now = new Date();
    const expiredFiles = fileRecords.filter(record => {
      const expiryDate = new Date(record.expiresAt);
      return expiryDate < now;
    });

    const deletionResults = await Promise.all(
      expiredFiles.map(async (file) => {
        const result = await deleteDigitalProduct(file.blobUrl);
        return {
          file: file.blobUrl,
          deleted: result.success,
          error: result.error
        };
      })
    );

    const successfulDeletions = deletionResults.filter(result => result.deleted);
    
    console.log(`🧹 Cleanup completed: ${successfulDeletions.length}/${expiredFiles.length} files deleted`);

    return {
      success: true,
      totalExpired: expiredFiles.length,
      deleted: successfulDeletions.length,
      results: deletionResults
    };

  } catch (error) {
    console.error('Error during cleanup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// مساعد لتحويل حجم الملف إلى نص قابل للقراءة
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// مساعد لاستخراج اسم الملف من المسار
export function extractFilename(filePath) {
  return filePath.split('/').pop().split('-').slice(1).join('-');
}
