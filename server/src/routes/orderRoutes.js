import express from 'express';
import {
  addEvent,
  createOrder,
  deleteOrder,
  generateCode,
  getOrder,
  listOrders,
  updateLocation,
  updateOrder,
  uploadVehiclePhotos,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/upload.js';

const router = express.Router();

router.use(protect);
router.get('/', listOrders);
router.post('/', createOrder);
router.get('/generate-code', generateCode);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.post('/:id/events', addEvent);
router.patch('/:id/location', updateLocation);
router.post('/:id/photos', upload.array('photos', 8), uploadVehiclePhotos);

export default router;

