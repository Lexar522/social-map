import express from 'express';
import passport from 'passport';
import { googleCallback, getCurrentUser, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

// Logout
router.post('/logout', logout);

export default router;
