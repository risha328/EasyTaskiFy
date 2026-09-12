import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMeApi, loginApi, registerApi, logoutApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user session on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const data = await fetchMeApi();
          if (data.status === 'success') {
            setUser(data.user);
            setToken(storedToken);
          } else {
            handleLogoutState();
          }
        } catch (error) {
          console.error('Session restoration failed:', error.message);
          handleLogoutState();
        }
      } else {
        handleLogoutState();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogoutState = () => {
    localStorage.removeItem('taskflow_token');
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    if (data.token) {
      localStorage.setItem('taskflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password, role = 'MEMBER') => {
    const data = await registerApi({ name, email, password, role });
    if (data.token) {
      localStorage.setItem('taskflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // Ignore API failure on logout
    } finally {
      handleLogoutState();
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
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
