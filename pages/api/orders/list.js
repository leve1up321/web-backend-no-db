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
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get orders for the user
    let orders;
    if (status && status !== 'all') {
      // Filter by status if provided
      const collection = await Order.getCollection();
      orders = await collection.find({ 
        userId: new ObjectId(userId),
        status: status
      })
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
    } else {
      orders = await Order.findByUserId(userId, limitNum, skip);
    }

    // Get total count for pagination
    const totalOrders = await Order.count(userId, status !== 'all' ? status : null);
    const totalPages = Math.ceil(totalOrders / limitNum);

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber,
      products: order.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      }))
    }));

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Orders retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving orders'
    });
  }
}

export default requireAuth(handler);
