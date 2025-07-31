const Resume = require('../models/Resume');
const { PDFDocument, rgb } = require('pdf-lib');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Get all resumes for a user
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get single resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    res.json(resume);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create or update resume
exports.saveResume = async (req, res) => {
  const {
    template,
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  } = req.body;

  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      resume = new Resume({
        user: req.user.id,
        template,
        personalInfo,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages,
      });
    } else {
      resume.template = template || resume.template;
      resume.personalInfo = personalInfo || resume.personalInfo;
      resume.experience = experience || resume.experience;
      resume.education = education || resume.education;
      resume.skills = skills || resume.skills;
      resume.projects = projects || resume.projects;
      resume.certifications = certifications || resume.certifications;
      resume.languages = languages || resume.languages;
      resume.updatedAt = Date.now();
    }

    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    await resume.remove();
    res.json({ msg: 'Resume removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.status(500).send('Server Error');
  }
};

// In backend/controllers/resumeController.js
exports.generatePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const htmlContent = generateHTML(resume);
    
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${resume.personalInfo.name.replace(' ', '_')}_Resume.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Server Error');
  }
};

// Helper function to generate HTML
function generateHTML(resume) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${resume.personalInfo?.name || 'Resume'}'s Resume</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; }
      h2 { color: #34495e; border-bottom: 1px solid #eee; padding-bottom: 5px; }
      .section { margin-bottom: 20px; }
      .experience-item, .education-item { margin-bottom: 15px; }
      .date { color: #7f8c8d; font-style: italic; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill { background: #ecf0f1; padding: 5px 10px; border-radius: 3px; }
    </style>
  </head>
  <body>
    <h1>${resume.personalInfo?.name || 'Your Name'}</h1>
    <div class="contact-info">
      <p>${resume.personalInfo?.email || ''} | ${resume.personalInfo?.phone || ''} | ${resume.personalInfo?.linkedIn || ''}</p>
    </div>
    
    ${resume.personalInfo?.summary ? `
    <div class="section">
      <h2>Summary</h2>
      <p>${resume.personalInfo.summary}</p>
    </div>
    ` : ''}
    
    ${resume.experience && resume.experience.length > 0 ? `
    <div class="section">
      <h2>Experience</h2>
      ${resume.experience.map(exp => `
        <div class="experience-item">
          <h3>${exp.title || ''} ${exp.company ? 'at ' + exp.company : ''}</h3>
          <p class="date">${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}</p>
          ${exp.location ? `<p>${exp.location}</p>` : ''}
          ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${resume.education && resume.education.length > 0 ? `
    <div class="section">
      <h2>Education</h2>
      ${resume.education.map(edu => `
        <div class="education-item">
          <h3>${edu.institution || ''}</h3>
          <p class="date">${edu.degree || ''} ${edu.fieldOfStudy ? 'in ' + edu.fieldOfStudy : ''}, ${edu.startDate || ''} - ${edu.endDate || ''}</p>
          ${edu.description ? `<p>${edu.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${resume.skills && resume.skills.length > 0 ? `
    <div class="section">
      <h2>Skills</h2>
      <div class="skills-list">
        ${resume.skills.map(skill => `
          <div class="skill">${skill.name || ''} ${skill.level ? `(${skill.level})` : ''}</div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  </body>
  </html>`;
}