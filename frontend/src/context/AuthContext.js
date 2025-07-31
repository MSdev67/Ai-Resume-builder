import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Updated import
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const decoded = jwtDecode(token); // Now using named import
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            logout();
            return;
          }
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/api/auth/profile');
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Updated login function in AuthContext.js
const login = async (email, password) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const profileRes = await api.get('/api/auth/profile');
      setUser(profileRes.data);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'No token received' };
  } catch (err) {
    console.error('Login error:', err);
    return { 
      success: false, 
      message: err.response?.data?.msg || err.message || 'Login failed' 
    };
  }
};

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const profileRes = await api.get('/api/auth/profile');
      setUser(profileRes.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const importLinkedIn = async (linkedInUrl) => {
    try {
      const res = await api.post('/api/auth/linkedin', { linkedInUrl });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.msg || 'Import failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        importLinkedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};