import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, displayName, password, bio, avatar } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      displayName,
      password: hashedPassword,
      bio,
      avatar
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'veyra_secret_key', { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'veyra_secret_key', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

export default router;
