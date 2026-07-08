import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const trackOrder = asyncHandler(async (req, res) => {
  const trackingCode = req.params.trackingCode?.toUpperCase();
  const order = await Order.findOne({ trackingCode });

  if (!order) {
    res.status(404);
    throw new Error('Code de suivi introuvable.');
  }

  res.json({ order });
});

