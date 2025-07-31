const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  template: {
    type: String,
    required: true,
    default: 'professional',
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    linkedIn: String,
    portfolio: String,
    summary: String,
  },
  experience: [
    {
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  skills: [
    {
      name: String,
      level: String,
    },
  ],
  projects: [
    {
      name: String,
      description: String,
      technologies: [String],
    },
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      date: String,
    },
  ],
  languages: [
    {
      name: String,
      proficiency: String,
    },
  ],
  analysis: {
    personalityTone: {
      professional: Number,
      creative: Number,
      technical: Number,
    },
    atsScore: Number,
    suggestions: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
ResumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', ResumeSchema);