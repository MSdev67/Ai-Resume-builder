import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Box } from '@mui/material';

export default function GoogleLoginButton() {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/api/auth/google', {
        token: credentialResponse.credential
      });
      if (res.data.token) {
        login(res.data.token);
      }
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login failed')}
        useOneTap
        shape="pill"
        size="large"
        text="signup_with"
        width="300"
      />
    </Box>
  );
}