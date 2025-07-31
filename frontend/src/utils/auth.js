import api from './api';

export const register = async (name, email, password) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  try {
    const res = await api.get('/auth/profile');
    return res.data;
  } catch (err) {
    throw err;
  }
};