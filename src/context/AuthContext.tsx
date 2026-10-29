import React, { createContext, useContext, useState } from 'react';
import { type CustomerUser, type AuthSuccessResponse, registerCustomer, loginCustomer } from '../services/api';

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; company: string; phone: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mandtech_customer_user';
const TOKEN_STORAGE_KEY = 'mandtech_customer_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const handleAuthSuccess = (res: AuthSuccessResponse) => {
    setUser(res.user);
    setToken(res.token);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    } catch (e) {
      console.warn('Failed to save auth to localStorage', e);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await loginCustomer({ email, password });
    handleAuthSuccess(res);
  };

  const register = async (data: { email: string; password: string; name: string; company: string; phone: string }) => {
    const res = await registerCustomer(data);
    handleAuthSuccess(res);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove auth from localStorage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
