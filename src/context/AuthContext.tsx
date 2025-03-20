import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'patient' | 'doctor';
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  registerPatient: (userData: any) => Promise<any>;
  registerDoctor: (userData: any) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user from localStorage on initial load
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const userData = await authService.login(username, password);
    setCurrentUser(authService.getCurrentUser());
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const registerPatient = async (userData: any) => {
    const result = await authService.registerPatient(userData);
    setCurrentUser(authService.getCurrentUser());
    return result;
  };

  const registerDoctor = async (userData: any) => {
    const result = await authService.registerDoctor(userData);
    setCurrentUser(authService.getCurrentUser());
    return result;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    logout,
    registerPatient,
    registerDoctor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};