const express = require('express');
const Job = require('../models/Job');
const { verifyToken, restrictTo } = require('../middleware/auth');
const router = express.Router();

// Post a new job (company only)
router.post('/', verifyToken, restrictTo('company'), async (req, res) => {
  try {
    const { title, location, description } = req.body;

    // Validate request body
    if (!title || !location || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const job = new Job({
      title,
      location,
      description,
      companyId: req.user.id,
      companyName: req.user.name || 'Company'
    });

    await job.save();
    res.status(201).json({ success: true, message: 'Job posted successfully.', job });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;