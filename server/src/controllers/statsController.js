import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [total, inTransit, delivered, delayed, recentOrders, byStatus] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'in_transit' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'delayed' }),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  res.json({
    total,
    inTransit,
    delivered,
    delayed,
    recentOrders,
    byStatus,
  });
});

