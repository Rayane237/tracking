import Port from '../models/Port.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// GET /api/ports
export const getPorts = asyncHandler(async (req, res) => {
  const ports = await Port.find().sort({ country: 1, name: 1 });
  res.json(ports);
});

// POST /api/ports (admin)
export const createPort = asyncHandler(async (req, res) => {
  const { name, country, code, type, coordinates } = req.body;

  if (!name || !country) {
    res.status(400);
    throw new Error('Le nom et le pays du port sont requis.');
  }

  const port = await Port.create({
    name,
    country,
    code,
    type,
    coordinates,
    createdBy: req.user?._id
  });

  res.status(201).json(port);
});
