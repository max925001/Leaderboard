import express from 'express';
import { signup, login, logout, getUserData } from '../controllers/authController.js';
import {isLoggedIn} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', isLoggedIn, logout);
router.get('/me', isLoggedIn, getUserData);

export default router;