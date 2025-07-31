import { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Box, Typography, Button, ButtonGroup, Card, CardContent } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';

export default function TemplateSelector() {
  const { resume, updateResume } = useResume();
  const [template, setTemplate] = useState(resume?.template || 'professional');

  useEffect(() => {
    if (resume?.template) {
      setTemplate(resume.template);
    }
  }, [resume]);

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    if (resume) {
      updateResume({ ...resume, template: newTemplate });
    }
  };

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      icon: <DescriptionIcon fontSize="large" />,
      description: 'Clean, traditional layout preferred by most employers and ATS systems',
    },
    {
      id: 'creative',
      name: 'Creative',
      icon: <PaletteIcon fontSize="large" />,
      description: 'Modern design with visual elements for creative fields',
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: <CodeIcon fontSize="large" />,
      description: 'Structured format that highlights technical skills and experience',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Select Template
      </Typography>
      
      <ButtonGroup fullWidth sx={{ mb: 2 }}>
        {templates.map((tpl) => (
          <Button
            key={tpl.id}
            variant={template === tpl.id ? 'contained' : 'outlined'}
            onClick={() => handleTemplateChange(tpl.id)}
            sx={{ textTransform: 'none' }}
          >
            {tpl.name}
          </Button>
        ))}
      </ButtonGroup>
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            {templates.find(t => t.id === template)?.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {templates.find(t => t.id === template)?.name} Template
            </Typography>
          </Box>
          <Typography variant="body2">
            {templates.find(t => t.id === template)?.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}