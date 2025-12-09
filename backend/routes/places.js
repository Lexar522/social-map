import express from 'express';
import {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace
} from '../controllers/placeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlaces);
router.get('/:id', getPlace);
router.post('/', authenticateToken, createPlace);
router.put('/:id', authenticateToken, updatePlace);
router.delete('/:id', authenticateToken, deletePlace);

export default router;

