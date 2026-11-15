import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mybus_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('mybus_token');
      const storedUser = localStorage.getItem('mybus_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with /me
          const meRes = await api.get('/auth/me');
          if (meRes.success && meRes.data) {
            setUser(meRes.data);
            localStorage.setItem('mybus_user', JSON.stringify(meRes.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('mybus_token', jwtToken);
      localStorage.setItem('mybus_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('mybus_token', jwtToken);
      localStorage.setItem('mybus_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('mybus_token');
    localStorage.removeItem('mybus_user');
    setToken(null);
    setUser(null);
  };

  const isOwner = user?.role === 'ROLE_OWNER';
  const isStaff = user?.role === 'ROLE_STAFF';
  const isPassenger = user?.role === 'ROLE_PASSENGER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        isOwner,
        isStaff,
        isPassenger,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
