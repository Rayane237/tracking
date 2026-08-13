import express from 'express';
import { getPorts, createPort } from '../controllers/portController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPorts);
router.post('/', protect, admin, createPort);

export default router;
