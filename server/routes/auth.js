import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register new agency / freelancer account
router.post('/register', async (req, res) => {
  try {
    const { name, agencyName, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      agencyName: agencyName || 'Independent Consultant',
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        agencyName: user.agencyName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        agencyName: user.agencyName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// Get logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile.' });
  }
});
// ==========================================
// FORGOT PASSWORD / ACCOUNT RECOVERY
// ==========================================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, agencyName, newPassword } = req.body;

    if (!email || !agencyName || !newPassword) {
      return res.status(400).json({
        message: 'Email, Agency Name, and New Password are all required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    // Verify Agency Name matches (case-insensitive)
    if (
      (user.agencyName || '').trim().toLowerCase() !== agencyName.trim().toLowerCase()
    ) {
      return res.status(403).json({
        message: 'Agency Name does not match our records for this email.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully! You can now sign in.' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to reset password. Please try again.' });
  }
});
export default router;