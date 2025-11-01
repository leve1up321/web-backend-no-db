import fs from 'fs/promises';
import path from 'path';
import { connectDB } from './mongodb.js';

// مسار ملف قاعدة البيانات المحلية
const DB_PATH = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DB_PATH, 'orders.json');
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json');
const CUSTOMERS_FILE = path.join(DB_PATH, 'customers.json');

// إنشاء مجلد البيانات إذا لم يكن موجوداً
async function ensureDataDirectory() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }
}

// قراءة ملف JSON
async function readJSONFile(filePath, defaultValue = []) {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // إذا لم يكن الملف موجوداً، إنشاؤه بالقيمة الافتراضية
    if (error.code === 'ENOENT') {
      await writeJSONFile(filePath, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

// كتابة ملف JSON
async function writeJSONFile(filePath, data) {
  await ensureDataDirectory();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// === إدارة الطلبات ===

// إنشاء طلب جديد
export async function createOrder(orderData) {
  try {
    // Try MongoDB first if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await connectDB();
        
        const newOrder = {
          id: orderData.id,
          orderNumber: orderData.orderNumber || `LU-${Date.now().toString().slice(-6)}`,
          productId: orderData.productId,
          productName: orderData.productName,
          amount: orderData.amount,
          currency: orderData.currency || 'AED',
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          status: orderData.status || 'pending',
          paymentIntentId: orderData.paymentIntentId,
          items: orderData.items || null,
          customerPhone: orderData.customerPhone || null,
          customerAddress: orderData.customerAddress || null,
          downloadLink: orderData.downloadLink || null,
          downloadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paidAt: orderData.paidAt || null,
          expiresAt: orderData.expiresAt || null
        };

        await db.collection('orders').insertOne(newOrder);
        console.log('✅ Order created in MongoDB:', newOrder.orderNumber);
        return { success: true, order: newOrder };
        
      } catch (mongoError) {
        console.warn('MongoDB failed, falling back to JSON:', mongoError.message);
      }
    }

    // Fallback to JSON file storage
    const orders = await readJSONFile(ORDERS_FILE);
    
    const newOrder = {
      id: orderData.id,
      orderNumber: orderData.orderNumber || `LU-${Date.now().toString().slice(-6)}`,
      productId: orderData.productId,
      productName: orderData.productName,
      amount: orderData.amount,
      currency: orderData.currency || 'AED',
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      status: orderData.status || 'pending',
      paymentIntentId: orderData.paymentIntentId,
      items: orderData.items || null,
      customerPhone: orderData.customerPhone || null,
      customerAddress: orderData.customerAddress || null,
      downloadLink: orderData.downloadLink || null,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: orderData.paidAt || null,
      expiresAt: orderData.expiresAt || null
    };

    orders.push(newOrder);
    await writeJSONFile(ORDERS_FILE, orders);
    
    console.log('✅ Order created in JSON:', newOrder.orderNumber);
    return { success: true, order: newOrder };

  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

// تحديث طلب موجود
export async function updateOrder(orderId, updates) {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return { success: false, error: 'Order not found' };
    }

    // تحديث البيانات
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await writeJSONFile(ORDERS_FILE, orders);
    
    console.log('✅ Order updated:', orders[orderIndex].orderNumber);
    return { success: true, order: orders[orderIndex] };

  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }
}

// البحث عن طلب
export async function findOrder(criteria) {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    
    const order = orders.find(order => {
      return Object.keys(criteria).every(key => order[key] === criteria[key]);
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, order };

  } catch (error) {
    console.error('Error finding order:', error);
    return { success: false, error: error.message };
  }
}

// الحصول على جميع الطلبات
export async function getAllOrders(filters = {}) {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    
    let filteredOrders = orders;
    
    // تطبيق الفلاتر
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    if (filters.customerEmail) {
      filteredOrders = filteredOrders.filter(order => order.customerEmail === filters.customerEmail);
    }
    
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= new Date(filters.dateTo));
    }

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, orders: filteredOrders };

  } catch (error) {
    console.error('Error getting orders:', error);
    return { success: false, error: error.message };
  }
}

// تسجيل تحميل
export async function recordDownload(orderId) {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return { success: false, error: 'Order not found' };
    }

    orders[orderIndex].downloadCount = (orders[orderIndex].downloadCount || 0) + 1;
    orders[orderIndex].lastDownloadAt = new Date().toISOString();
    orders[orderIndex].updatedAt = new Date().toISOString();

    await writeJSONFile(ORDERS_FILE, orders);
    
    console.log('📥 Download recorded for order:', orders[orderIndex].orderNumber);
    return { success: true, downloadCount: orders[orderIndex].downloadCount };

  } catch (error) {
    console.error('Error recording download:', error);
    return { success: false, error: error.message };
  }
}

// === إدارة العملاء ===

// إنشاء أو تحديث عميل
export async function upsertCustomer(customerData) {
  try {
    const customers = await readJSONFile(CUSTOMERS_FILE);
    
    const existingIndex = customers.findIndex(customer => customer.email === customerData.email);
    
    if (existingIndex !== -1) {
      // تحديث عميل موجود
      customers[existingIndex] = {
        ...customers[existingIndex],
        name: customerData.name || customers[existingIndex].name,
        totalOrders: (customers[existingIndex].totalOrders || 0) + 1,
        totalSpent: (customers[existingIndex].totalSpent || 0) + (customerData.amount || 0),
        lastOrderAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await writeJSONFile(CUSTOMERS_FILE, customers);
      return { success: true, customer: customers[existingIndex], isNew: false };
    } else {
      // إنشاء عميل جديد
      const newCustomer = {
        id: `customer_${Date.now()}`,
        email: customerData.email,
        name: customerData.name || null,
        totalOrders: 1,
        totalSpent: customerData.amount || 0,
        firstOrderAt: new Date().toISOString(),
        lastOrderAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      customers.push(newCustomer);
      await writeJSONFile(CUSTOMERS_FILE, customers);
      
      console.log('✅ New customer created:', newCustomer.email);
      return { success: true, customer: newCustomer, isNew: true };
    }

  } catch (error) {
    console.error('Error upserting customer:', error);
    return { success: false, error: error.message };
  }
}

// === إحصائيات ===

// الحصول على إحصائيات المبيعات
export async function getSalesStats() {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    const customers = await readJSONFile(CUSTOMERS_FILE);
    
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    const stats = {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      failedOrders: orders.filter(order => order.status === 'failed').length,
      totalRevenue: completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0),
      totalCustomers: customers.length,
      averageOrderValue: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0) / completedOrders.length 
        : 0,
      totalDownloads: completedOrders.reduce((sum, order) => sum + (order.downloadCount || 0), 0)
    };

    return { success: true, stats };

  } catch (error) {
    console.error('Error getting sales stats:', error);
    return { success: false, error: error.message };
  }
}

// تنظيف البيانات القديمة
export async function cleanupOldData(daysOld = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const orders = await readJSONFile(ORDERS_FILE);
    const recentOrders = orders.filter(order => new Date(order.createdAt) > cutoffDate);
    
    if (recentOrders.length < orders.length) {
      await writeJSONFile(ORDERS_FILE, recentOrders);
      console.log(`🧹 Cleaned up ${orders.length - recentOrders.length} old orders`);
    }

    return { 
      success: true, 
      cleaned: orders.length - recentOrders.length,
      remaining: recentOrders.length 
    };

  } catch (error) {
    console.error('Error cleaning up data:', error);
    return { success: false, error: error.message };
  }
}
