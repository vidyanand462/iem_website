import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { ROLES } from '../constants/config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('iem_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('iem_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { user: userData, token } = response.data;
    localStorage.setItem('iem_token', token);
    setUser(userData);
    return userData;
  };

  const adminLogin = async (credentials) => {
    const response = await authService.adminLogin(credentials);
    const { user: userData, token } = response.data;
    localStorage.setItem('iem_token', token);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const { user: userData, token } = response.data;
    localStorage.setItem('iem_token', token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('iem_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    isApplicant: user?.role === ROLES.APPLICANT,
    login,
    adminLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
