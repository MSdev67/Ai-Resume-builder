import { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Box, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ResumeForm = ({ resume }) => {
  const { updateResume } = useResume();
  const [formData, setFormData] = useState(resume || {});

  useEffect(() => {
    setFormData(resume || {});
  }, [resume]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: value,
      },
    });
  };

  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target;
    const newArray = [...formData[field]];
    newArray[index] = {
      ...newArray[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addItem = (field, initialData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), initialData],
    });
  };

  const removeItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateResume(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Full Name"
            name="name"
            value={formData.personalInfo?.name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.personalInfo?.email || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.personalInfo?.phone || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.personalInfo?.address || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="LinkedIn"
            name="linkedIn"
            value={formData.personalInfo?.linkedIn || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Portfolio"
            name="portfolio"
            value={formData.personalInfo?.portfolio || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Summary"
            name="summary"
            value={formData.personalInfo?.summary || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.experience || []).map((exp, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Experience #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('experience', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Job Title"
                name="title"
                value={exp.title || ''}
                onChange={(e) => handleArrayChange('experience', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Company"
                name="company"
                value={exp.company || ''}
                onChange={(e) => handleArrayChange('experience', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                name="location"
                value={exp.location || ''}
                onChange={(e) => handleArrayChange('experience', index, e)}
                fullWidth
                margin="normal"
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  value={exp.startDate || ''}
                  onChange={(e) => handleArrayChange('experience', index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  value={exp.endDate || ''}
                  onChange={(e) => handleArrayChange('experience', index, e)}
                  fullWidth
                  margin="normal"
                  disabled={exp.current}
                />
              </Box>
              <Box display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  name="current"
                  checked={exp.current || false}
                  onChange={(e) => {
                    const newArray = [...formData.experience];
                    newArray[index] = {
                      ...newArray[index],
                      current: e.target.checked,
                    };
                    setFormData({
                      ...formData,
                      experience: newArray,
                    });
                  }}
                />
                <label htmlFor={`current-${index}`} style={{ marginLeft: '8px' }}>
                  I currently work here
                </label>
              </Box>
              <TextField
                label="Description"
                name="description"
                value={exp.description || ''}
                onChange={(e) => handleArrayChange('experience', index, e)}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('experience', {
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              })
            }
          >
            Add Experience
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Similar sections for Education, Skills, Projects, Certifications, Languages */}
      {/* Education */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Education</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.education || []).map((edu, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Education #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('education', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Institution"
                name="institution"
                value={edu.institution || ''}
                onChange={(e) => handleArrayChange('education', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Degree"
                name="degree"
                value={edu.degree || ''}
                onChange={(e) => handleArrayChange('education', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Field of Study"
                name="fieldOfStudy"
                value={edu.fieldOfStudy || ''}
                onChange={(e) => handleArrayChange('education', index, e)}
                fullWidth
                margin="normal"
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  value={edu.startDate || ''}
                  onChange={(e) => handleArrayChange('education', index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  value={edu.endDate || ''}
                  onChange={(e) => handleArrayChange('education', index, e)}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <TextField
                label="Description"
                name="description"
                value={edu.description || ''}
                onChange={(e) => handleArrayChange('education', index, e)}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('education', {
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                description: '',
              })
            }
          >
            Add Education
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Skills */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.skills || []).map((skill, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Skill #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('skills', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Skill Name"
                name="name"
                value={skill.name || ''}
                onChange={(e) => handleArrayChange('skills', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Level (Beginner, Intermediate, Advanced, Expert)"
                name="level"
                value={skill.level || ''}
                onChange={(e) => handleArrayChange('skills', index, e)}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('skills', {
                name: '',
                level: '',
              })
            }
          >
            Add Skill
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Projects */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Projects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.projects || []).map((project, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Project #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('projects', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Project Name"
                name="name"
                value={project.name || ''}
                onChange={(e) => handleArrayChange('projects', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={project.description || ''}
                onChange={(e) => handleArrayChange('projects', index, e)}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                label="Technologies (comma separated)"
                name="technologies"
                value={project.technologies?.join(', ') || ''}
                onChange={(e) => {
                  const newArray = [...formData.projects];
                  newArray[index] = {
                    ...newArray[index],
                    technologies: e.target.value.split(',').map(t => t.trim()),
                  };
                  setFormData({
                    ...formData,
                    projects: newArray,
                  });
                }}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('projects', {
                name: '',
                description: '',
                technologies: [],
              })
            }
          >
            Add Project
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Certifications */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Certifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.certifications || []).map((cert, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Certification #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('certifications', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Certification Name"
                name="name"
                value={cert.name || ''}
                onChange={(e) => handleArrayChange('certifications', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Issuer"
                name="issuer"
                value={cert.issuer || ''}
                onChange={(e) => handleArrayChange('certifications', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date"
                name="date"
                value={cert.date || ''}
                onChange={(e) => handleArrayChange('certifications', index, e)}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('certifications', {
                name: '',
                issuer: '',
                date: '',
              })
            }
          >
            Add Certification
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Languages */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Languages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(formData.languages || []).map((lang, index) => (
            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Language #{index + 1}</Typography>
                <IconButton onClick={() => removeItem('languages', index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Language"
                name="name"
                value={lang.name || ''}
                onChange={(e) => handleArrayChange('languages', index, e)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Proficiency (Basic, Intermediate, Fluent, Native)"
                name="proficiency"
                value={lang.proficiency || ''}
                onChange={(e) => handleArrayChange('languages', index, e)}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              addItem('languages', {
                name: '',
                proficiency: '',
              })
            }
          >
            Add Language
          </Button>
        </AccordionDetails>
      </Accordion>

      <Box mt={4}>
        <Button type="submit" variant="contained" size="large" fullWidth>
          Save Resume
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeForm;