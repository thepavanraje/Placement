const express = require('express');
const Application = require('../models/Application');
const { verifyToken, restrictTo } = require('../middleware/auth');
const router = express.Router();

// Student applies for a job
router.post('/', verifyToken, restrictTo('student'), async (req, res) => {
  try {
    const { jobId } = req.body;
    const application = new Application({
      studentId: req.user.id,
      jobId
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applications for a student
router.get('/my', verifyToken, restrictTo('student'), async (req, res) => {
  const apps = await Application.find({ studentId: req.user.id });
  res.json(apps);
});

module.exports = router;