import { useState, useCallback, useEffect } from 'react';
import api from '../../lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const res = await api.post('/auth/signup', { email, password, full_name: fullName });
      if (res.status === 200 || res.status === 201) {
        return login(email, password);
      }
      return false;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    }
  };

  return { user, login, logout, signup, loading, isAuthenticated: !!user };
};

