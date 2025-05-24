const express = require('express');
const Event = require('../models/event');
const { verifyToken, restrictTo } = require('../middleware/auth');
const router = express.Router();

// Create a new event (admin or company)
router.post('/', verifyToken, restrictTo('admin', 'company'), async (req, res) => {
  try {
    const { name, date, description } = req.body;
    const event = new Event({ name, date, description });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all events (public)
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

module.exports = router;