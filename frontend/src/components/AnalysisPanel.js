import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  LinearProgress,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { styled } from '@mui/material/styles';
import { useResume } from '../context/ResumeContext';

const StyledLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: value > 70 ? theme.palette.success.main : 
                     value > 40 ? theme.palette.warning.main : 
                     theme.palette.error.main,
  },
}));

export default function AnalysisPanel({ resume }) {
  const { analyzeResume, optimizeResume, generateCoverLetter } = useResume();
  const [analysis, setAnalysis] = useState(resume?.analysis || null);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume?._id) return;
    setLoading(true);
    try {
      const result = await analyzeResume(resume._id);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!resume?._id || !jobDescription.trim()) return;
    setLoading(true);
    try {
      const result = await optimizeResume(resume._id, { jobDescription });
      setOptimizationSuggestions(result.suggestions);
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resume?._id || !jobDescription.trim()) return;
    setLoading(true);
    try {
      const result = await generateCoverLetter(resume._id, {
        jobDescription,
        companyName: 'Target Company',
        position: 'Desired Position',
      });
      setCoverLetter(result.coverLetter);
    } catch (err) {
      console.error('Cover letter generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        <PsychologyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        AI Analysis
      </Typography>
      
      {!analysis && (
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={loading || !resume}
          fullWidth
          sx={{ mb: 2 }}
        >
          Analyze Resume
        </Button>
      )}
      
      {analysis && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Personality Tone</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <Typography>Professional</Typography>
                <StyledLinearProgress variant="determinate" value={analysis.personalityTone.professional * 10} />
                <Typography variant="caption">{analysis.personalityTone.professional.toFixed(1)}/10</Typography>
              </Box>
              <Box mb={2}>
                <Typography>Creative</Typography>
                <StyledLinearProgress variant="determinate" value={analysis.personalityTone.creative * 10} />
                <Typography variant="caption">{analysis.personalityTone.creative.toFixed(1)}/10</Typography>
              </Box>
              <Box mb={2}>
                <Typography>Technical</Typography>
                <StyledLinearProgress variant="determinate" value={analysis.personalityTone.technical * 10} />
                <Typography variant="caption">{analysis.personalityTone.technical.toFixed(1)}/10</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>ATS Compatibility</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <StyledLinearProgress variant="determinate" value={analysis.atsScore} />
                <Typography variant="caption">{analysis.atsScore}/100</Typography>
              </Box>
              <Typography variant="body2">
                {analysis.atsScore > 80 ? (
                  <>
                    <CheckCircleIcon color="success" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Excellent! Your resume is well optimized for ATS systems.
                  </>
                ) : analysis.atsScore > 60 ? (
                  <>
                    <WarningIcon color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Good, but there is room for improvement.
                  </>
                ) : (
                  <>
                    <WarningIcon color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Your resume may have trouble passing through ATS systems. Consider optimizing it.
                  </>
                )}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </>
      )}
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Job-Specific Optimization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Paste Job Description"
            multiline
            rows={4}
            fullWidth
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            onClick={handleOptimize}
            disabled={loading || !jobDescription.trim()}
            fullWidth
            sx={{ mb: 2 }}
          >
            Optimize for This Job
          </Button>
          
          {optimizationSuggestions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Optimization Suggestions:
              </Typography>
              <List dense>
                {optimizationSuggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Cover Letter Generator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!coverLetter ? (
            <>
              <Typography variant="body2" gutterBottom>
                Paste the job description above, then generate a tailored cover letter.
              </Typography>
              <Button
                variant="contained"
                onClick={handleGenerateCoverLetter}
                disabled={loading || !jobDescription.trim()}
                fullWidth
              >
                Generate Cover Letter
              </Button>
            </>
          ) : (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Generated Cover Letter:
              </Typography>
              <Box
                component="div"
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {coverLetter}
              </Box>
              <Button
                variant="outlined"
                onClick={() => navigator.clipboard.writeText(coverLetter)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}