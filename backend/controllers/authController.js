import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Google OAuth callback
export const googleCallback = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const picture = photos[0].value;

    // Find or create user
    let user = await User.findOne({ googleId: id });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google account to existing user
        user.googleId = id;
        user.name = displayName;
        user.picture = picture;
        await user.save();
      } else {
        // Create new user
        user = new User({
          googleId: id,
          email,
          name: displayName,
          username: displayName,
          picture
        });
        await user.save();
      }
    } else {
      // Update user info
      user.name = displayName;
      user.picture = picture;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/error`);
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (client-side token removal)
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

