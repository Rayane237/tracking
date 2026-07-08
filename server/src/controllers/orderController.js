import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateTrackingCode } from '../utils/trackingCode.js';

async function getUniqueTrackingCode() {
  let trackingCode = generateTrackingCode();
  let exists = await Order.exists({ trackingCode });

  while (exists) {
    trackingCode = generateTrackingCode();
    exists = await Order.exists({ trackingCode });
  }

  return trackingCode;
}

export const listOrders = asyncHandler(async (req, res) => {
  const { q = '', status = '' } = req.query;
  const filters = {};

  if (status) filters.status = status;
  if (q) {
    filters.$or = [
      { trackingCode: new RegExp(q, 'i') },
      { customerName: new RegExp(q, 'i') },
      { 'vehicle.brand': new RegExp(q, 'i') },
      { 'vehicle.model': new RegExp(q, 'i') },
    ];
  }

  const orders = await Order.find(filters).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  res.json({ order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const trackingCode = req.body.trackingCode || (await getUniqueTrackingCode());
  const order = await Order.create({
    ...req.body,
    trackingCode: trackingCode.toUpperCase(),
  });

  res.status(201).json({ order });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  res.json({ order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  res.json({ message: 'Commande supprimée.' });
});

export const addEvent = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  order.events.unshift(req.body);
  order.status = req.body.status || order.status;
  await order.save();

  res.status(201).json({ order });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { label, lat, lng, status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  order.currentLocation = {
    label,
    coordinates: { lat: Number(lat), lng: Number(lng) },
    updatedAt: new Date(),
  };
  if (status) order.status = status;
  await order.save();

  res.json({ order });
});

export const uploadVehiclePhotos = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande introuvable.');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const photos = req.files.map((file) => ({
    url: `${baseUrl}/uploads/${file.filename}`,
    caption: req.body.caption || 'Photo véhicule',
  }));

  order.photos.push(...photos);
  await order.save();

  res.status(201).json({ order });
});

export const generateCode = asyncHandler(async (_req, res) => {
  res.json({ trackingCode: await getUniqueTrackingCode() });
});

