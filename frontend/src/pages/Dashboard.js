import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import AnalysisPanel from '../components/AnalysisPanel';
import TemplateSelector from '../components/TemplateSelector';

export default function Dashboard() {
  const { user } = useAuth();
  const { resumes, loading, error, getResumes, createResume } = useResume();
  const [activeResume, setActiveResume] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchResumes = useCallback(async () => {
    await getResumes();
  }, [getResumes]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleNewResume = async () => {
    const newResume = {
      template: 'professional',
      personalInfo: {
        name: user.name,
        email: user.email,
      },
    };
    const createdResume = await createResume(newResume);
    setActiveResume(createdResume);
    setShowNewForm(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}
        </Typography>
        
        {!showNewForm && !activeResume && (
          <>
            <Box mb={4}>
              <Button variant="contained" onClick={handleNewResume}>
                Create New Resume
              </Button>
            </Box>
            
            <Typography variant="h5" gutterBottom>
              Your Resumes
            </Typography>
            
            {resumes.length === 0 ? (
              <Typography>You don't have any resumes yet.</Typography>
            ) : (
              <Grid container spacing={3}>
                {resumes.map((resume) => (
                  <Grid item xs={12} sm={6} md={4} key={resume._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          {resume.personalInfo.name || 'Untitled Resume'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => {
                            setActiveResume(resume);
                            setShowNewForm(true);
                          }}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        
        {(showNewForm || activeResume) && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setActiveResume(null);
                setShowNewForm(false);
              }}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TemplateSelector />
                <ResumeForm resume={activeResume} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ResumePreview resume={activeResume} />
                <AnalysisPanel resume={activeResume} />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
}