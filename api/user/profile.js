import { User } from '../../models/User.js';
import { Order } from '../../models/Order.js';
import { requireAuth, sanitizeUser } from '../../lib/auth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const userId = req.user.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user order statistics
    const orderStats = await Order.getUserStats(userId);

    // Get recent orders
    const recentOrders = await Order.getRecentOrders(userId, 5);

    // Update user stats
    await User.updateStats(userId, {
      totalOrders: orderStats.totalOrders,
      totalSpent: orderStats.totalSpent,
      totalReviews: user.stats?.totalReviews || 0,
      averageRating: user.stats?.averageRating || 0
    });

    // Prepare response data
    const userData = sanitizeUser(user);
    userData.stats = {
      totalOrders: orderStats.totalOrders,
      totalSpent: orderStats.totalSpent,
      completedOrders: orderStats.completedOrders,
      pendingOrders: orderStats.pendingOrders,
      cancelledOrders: orderStats.cancelledOrders,
      totalReviews: user.stats?.totalReviews || 0,
      averageRating: user.stats?.averageRating || 0
    };

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: userData,
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          currency: order.currency,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          products: order.products
        }))
      }
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving profile'
    });
  }
}

export default requireAuth(handler);
