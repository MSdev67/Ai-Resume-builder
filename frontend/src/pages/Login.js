import { Container, TextField, Button, Typography } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" fullWidth style={{ marginTop: '20px' }}>
        Login
      </Button>
    </Container>
  );
};

export default Login;