const Resume = require('../models/Resume');

// In backend/controllers/aiController.js
exports.analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Combine all text content for analysis
    let content = '';
    if (resume.personalInfo?.summary) content += resume.personalInfo.summary + ' ';
    if (resume.experience) {
      content += resume.experience
        .map(exp => `${exp.title} ${exp.description}`)
        .join(' ') + ' ';
    }
    // Add other sections similarly...

    // Enhanced analysis logic
    const personalityTone = {
      professional: Math.min(10, Math.max(1, content.split(/manager|lead|director/i).length * 2)),
      creative: Math.min(10, Math.max(1, content.split(/design|create|innovate/i).length * 2)),
      technical: Math.min(10, Math.max(1, content.split(/code|develop|algorithm/i).length * 2)),
    };

    // More accurate ATS scoring
    const atsScore = Math.min(100, Math.max(30, 
      (content.split(/\b(action|result|achieved)\b/i).length * 5) +
      (content.split(/\b(JavaScript|React|Node\.js|Python)\b/i).length * 3)
    ));

    const suggestions = [];
    if (content.length < 300) suggestions.push('Consider adding more details to your resume');
    if (!resume.experience?.length) suggestions.push('Add at least one work experience');
    // Add more suggestion logic...

    // Update resume with analysis
    resume.analysis = { personalityTone, atsScore, suggestions };
    await resume.save();

    res.json({ personalityTone, atsScore, suggestions });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).send('Server Error');
  }
};

// Generate cover letter
exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, companyName, position } = req.body;
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Simulate AI-generated cover letter
    const coverLetter = `
      Dear Hiring Manager,

      I am excited to apply for the ${position} position at ${companyName}. 
      With my background in ${resume.personalInfo.summary?.split(' ').slice(0, 5).join(' ') || 'this field'}, 
      I believe I would be a great fit for your team.

      In my previous role as ${resume.experience[0]?.title || 'a professional'}, 
      I ${resume.experience[0]?.description?.split('.').shift() || 'developed key skills'}. 
      This experience aligns well with your requirement for ${jobDescription.split(' ').slice(0, 10).join(' ')}.

      I would welcome the opportunity to discuss how my skills and experiences 
      can contribute to ${companyName}. Thank you for your consideration.

      Sincerely,
      ${resume.personalInfo.name}
    `;

    res.json({ coverLetter });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Optimize resume for job description
exports.optimizeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }

    // Simulate optimization suggestions
    const suggestions = [
      `Add more keywords like "${jobDescription.split(' ').slice(0, 3).join(' ')}"`,
      'Highlight achievements with quantifiable results',
      'Reorder experience to match job priorities'
    ];

    res.json({ suggestions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};