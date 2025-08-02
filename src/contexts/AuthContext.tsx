import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services';
import type { User, LoginCredentials, RegisterData } from '../services';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحديث بيانات المستخدم
  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user:', error);
        authService.logout();
        setUser(null);
      }
    }
  };

  // تسجيل الدخول
  const login = async (credentials: LoginCredentials) => {
    try {
      await authService.login(credentials);
      await refreshUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // إنشاء حساب جديد
  const register = async (userData: RegisterData) => {
    try {
      await authService.register(userData);
      await refreshUser();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // تسجيل الخروج
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // التحقق من الحالة عند بدء التطبيق
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (authService.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
