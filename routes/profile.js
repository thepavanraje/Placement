const express = require('express');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;