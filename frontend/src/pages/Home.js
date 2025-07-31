import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" gutterBottom>
        AI-Powered Resume Builder
      </Typography>
      <Typography variant="h5" gutterBottom>
        Create professional resumes with AI assistance
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/login"
        style={{ margin: '20px' }}
      >
        Login
      </Button>
      <Button
        variant="outlined"
        component={Link}
        to="/register"
        style={{ margin: '20px' }}
      >
        Register
      </Button>
    </Container>
  );
};

export default Home;