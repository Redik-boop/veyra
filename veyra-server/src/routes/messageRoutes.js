import express from 'express';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });
  jwt.verify(token, process.env.JWT_SECRET || 'veyra_secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const message = new Message({
      conversationId,
      senderId: req.user.userId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

router.get('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.user.userId }).limit(10);
    // Simple mock for conversation list
    const conversations = messages.map(m => ({
      id: m.conversationId,
      name: 'Contact',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      lastMessage: m.content
    }));
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching conversations', error: err.message });
  }
});

export default router;
