import express from 'express';
import { claimPoints, getPointHistory } from '../controllers/pointController.js';
import  { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/claim',isLoggedIn, claimPoints);
router.get('/history', isLoggedIn, getPointHistory);

export default router;