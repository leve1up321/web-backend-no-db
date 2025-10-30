import { Order } from '../../../models/Order.js';
import { requireAuth } from '../../../lib/auth.js';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const userId = req.user.userId;
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to the user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This order does not belong to you.'
      });
    }

    // Format order for response
    const formattedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      
      // Products
      products: order.products,
      
      // Pricing
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      currency: order.currency,
      
      // Addresses
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      
      // Customer info
      customerInfo: order.customerInfo,
      
      // Tracking
      trackingNumber: order.trackingNumber,
      
      // Timestamps
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      
      // Notes
      notes: order.notes
    };

    res.status(200).json({
      success: true,
      message: 'Order details retrieved successfully',
      data: {
        order: formattedOrder
      }
    });

  } catch (error) {
    console.error('Order details retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving order details'
    });
  }
}

export default requireAuth(handler);
