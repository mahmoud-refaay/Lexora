import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { clearAuthData } from '../services/api';

interface User {
  id: number;
  username: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاولة استرجاع بيانات المستخدم والتوكن من التخزين المحلي عند تحميل التطبيق
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuthData();
      }
    }
    setLoading(false);

    // الاستماع لحدث انتهاء صلاحية الجلسة من الـ Axios Interceptor
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, refreshToken, userId, fullName, username: resUsername } = response.data;

      const userData: User = {
        id: userId,
        username: resUsername,
        fullName: fullName,
      };

      // حفظ التوكنز وبيانات المستخدم في التخزين المحلي
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // إبلاغ السيرفر بتسجيل الخروج لإلغاء الرموز
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Failed to call logout API, clearing state locally:', err);
    } finally {
      clearAuthData();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
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
