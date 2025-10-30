import { getCollection } from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export class Order {
  constructor(orderData) {
    this.userId = orderData.userId;
    this.orderNumber = orderData.orderNumber || this.generateOrderNumber();
    this.products = orderData.products || [];
    this.customerInfo = orderData.customerInfo || {};
    this.shippingAddress = orderData.shippingAddress || {};
    this.billingAddress = orderData.billingAddress || {};
    this.subtotal = orderData.subtotal || 0;
    this.shippingCost = orderData.shippingCost || 0;
    this.tax = orderData.tax || 0;
    this.discount = orderData.discount || 0;
    this.total = orderData.total || 0;
    this.currency = orderData.currency || 'AED';
    this.status = orderData.status || 'pending'; // pending, processing, shipped, delivered, cancelled
    this.paymentStatus = orderData.paymentStatus || 'pending'; // pending, paid, failed, refunded
    this.paymentMethod = orderData.paymentMethod || '';
    this.paymentId = orderData.paymentId || null;
    this.ziinaTransactionId = orderData.ziinaTransactionId || null;
    this.trackingNumber = orderData.trackingNumber || null;
    this.notes = orderData.notes || '';
    this.createdAt = orderData.createdAt || new Date();
    this.updatedAt = orderData.updatedAt || new Date();
    this.shippedAt = orderData.shippedAt || null;
    this.deliveredAt = orderData.deliveredAt || null;
    this.cancelledAt = orderData.cancelledAt || null;
    this.refundedAt = orderData.refundedAt || null;
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LU${timestamp.slice(-6)}${random}`;
  }

  // Get orders collection
  static async getCollection() {
    return await getCollection('orders');
  }

  // Create new order
  static async create(orderData) {
    const collection = await Order.getCollection();
    const order = new Order(orderData);
    const result = await collection.insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  // Find order by ID
  static async findById(id) {
    const collection = await Order.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Find order by order number
  static async findByOrderNumber(orderNumber) {
    const collection = await Order.getCollection();
    return await collection.findOne({ orderNumber });
  }

  // Find orders by user ID
  static async findByUserId(userId, limit = 20, skip = 0) {
    const collection = await Order.getCollection();
    return await collection.find({ userId: new ObjectId(userId) })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Update order
  static async updateById(id, updateData) {
    const collection = await Order.getCollection();
    updateData.updatedAt = new Date();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  // Update order status
  static async updateStatus(id, status) {
    const collection = await Order.getCollection();
    const updateData = { 
      status,
      updatedAt: new Date()
    };

    // Add timestamp for specific statuses
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus, paymentId = null, ziinaTransactionId = null) {
    const collection = await Order.getCollection();
    const updateData = { 
      paymentStatus,
      updatedAt: new Date()
    };

    if (paymentId) updateData.paymentId = paymentId;
    if (ziinaTransactionId) updateData.ziinaTransactionId = ziinaTransactionId;
    if (paymentStatus === 'refunded') updateData.refundedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  // Add tracking number
  static async addTrackingNumber(id, trackingNumber) {
    const collection = await Order.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          trackingNumber,
          status: 'shipped',
          shippedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Get order statistics for user
  static async getUserStats(userId) {
    const collection = await Order.getCollection();
    
    const stats = await collection.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0]
            }
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $in: ['$status', ['pending', 'processing', 'shipped']] }, 1, 0]
            }
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    };
  }

  // Get recent orders for user
  static async getRecentOrders(userId, limit = 5) {
    const collection = await Order.getCollection();
    return await collection.find({ userId: new ObjectId(userId) })
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Search orders
  static async search(query, limit = 20, skip = 0) {
    const collection = await Order.getCollection();
    const searchRegex = new RegExp(query, 'i');
    
    return await collection.find({
      $or: [
        { orderNumber: searchRegex },
        { 'customerInfo.name': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex }
      ]
    })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .toArray();
  }

  // Get all orders (admin)
  static async findAll(limit = 50, skip = 0, status = null) {
    const collection = await Order.getCollection();
    const query = status ? { status } : {};
    
    return await collection.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Count orders
  static async count(userId = null, status = null) {
    const collection = await Order.getCollection();
    const query = {};
    
    if (userId) query.userId = new ObjectId(userId);
    if (status) query.status = status;
    
    return await collection.countDocuments(query);
  }

  // Delete order
  static async deleteById(id) {
    const collection = await Order.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Get sales statistics (admin)
  static async getSalesStats(startDate = null, endDate = null) {
    const collection = await Order.getCollection();
    const matchQuery = { paymentStatus: 'paid' };
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await collection.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0
    };
  }
}
