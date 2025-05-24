const express = require('express');
const Message = require('../models/message');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Send a message (authenticated users)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    const msg = new Message({
      fromUserId: req.user.id,
      toUserId,
      message
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get messages for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  const messages = await Message.find({ toUserId: req.user.id });
  res.json(messages);
});

module.exports = router;