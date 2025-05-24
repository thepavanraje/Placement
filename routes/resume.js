const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken, restrictTo } = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/resumes'));
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Student uploads resume
router.post('/', verifyToken, restrictTo('student'), upload.single('resume'), async (req, res) => {
  try {
    const resumePath = '/resumes/' + req.file.filename;
    await User.findByIdAndUpdate(req.user.id, { resume: resumePath });
    res.json({ message: 'Resume uploaded successfully.', resume: resumePath });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;