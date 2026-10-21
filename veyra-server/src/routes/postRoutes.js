import express from 'express';
import { Post } from '../models/Post.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT
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

// Create a post
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    const post = new Post({
      userId: req.user.userId,
      content,
      mediaUrl,
      mediaType
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
});

// Get all posts (Global Feed)
router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username displayName avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feed', error: err.message });
  }
});

// Like/Unlike a post
router.post('/like/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.userId;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error processing like', error: err.message });
  }
});

export default router;
