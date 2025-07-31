const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  generateCoverLetter,
  optimizeResume
} = require('../controllers/aiController');
const auth = require('../middleware/auth');

// POST analyze resume
router.post('/:id/analyze', auth, analyzeResume);

// POST generate cover letter
router.post('/:id/cover-letter', auth, generateCoverLetter);

// POST optimize resume
router.post('/:id/optimize', auth, optimizeResume);

module.exports = router;