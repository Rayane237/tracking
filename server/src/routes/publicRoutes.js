import express from 'express';
import { trackOrder } from '../controllers/publicController.js';

const router = express.Router();

router.get('/:trackingCode', trackOrder);

export default router;

