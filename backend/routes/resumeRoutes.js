const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResume,
  saveResume,
  deleteResume,
  generatePDF
} = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// GET all resumes
router.get('/', auth, getResumes);

// GET single resume
router.get('/:id', auth, getResume);

// POST create/update resume
router.post('/', auth, saveResume);
router.post('/:id', auth, saveResume);

// DELETE resume
router.delete('/:id', auth, deleteResume);

// Generate PDF
router.post('/:id/pdf', auth, generatePDF);

module.exports = router;