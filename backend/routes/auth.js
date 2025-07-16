const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticate, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (admin only, cannot delete admin users)
router.delete('/users/:id', authenticate, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ error: 'User not found' });
    if (userToDelete.isAdmin) return res.status(400).json({ error: 'Cannot delete admin user' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (admin only, cannot change role of admin users)
router.put('/users/:id', authenticate, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ error: 'User not found' });
    if (userToUpdate.isAdmin && req.body.role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change role of admin user' });
    }
    userToUpdate.username = req.body.name || userToUpdate.username;
    userToUpdate.email = req.body.email || userToUpdate.email;
    if (!userToUpdate.isAdmin && req.body.role) {
      userToUpdate.isAdmin = req.body.role === 'admin';
    }
    await userToUpdate.save();
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update own profile (authenticated user)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.user.id);
    if (!userToUpdate) return res.status(404).json({ error: 'User not found' });
    userToUpdate.username = req.body.name || userToUpdate.username;
    userToUpdate.phone = req.body.phone || userToUpdate.phone;
    userToUpdate.address = req.body.address || userToUpdate.address;
    if (req.body.password && req.body.password.length > 0) {
      const bcrypt = require('bcryptjs');
      userToUpdate.password = await bcrypt.hash(req.body.password, 10);
    }
    await userToUpdate.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 