import express from 'express';
import { getAllUsers, addUser, getLeaderboard } from '../controllers/userController.js';
import  { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', isLoggedIn, addUser);
router.get('/leaderboard', getLeaderboard);

export default router;