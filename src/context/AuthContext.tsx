import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { userApi } from '../api/user';
import { registerUnauthorizedHandler, tokenStorage } from '../api/client';
import type {
  AuthRequest,
  LoginRequest,
  OtpVerificationRequest,
  UserProfile,
} from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: AuthRequest) => Promise<{ message: string }>;
  verifyOtp: (data: OtpVerificationRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.getToken()) {
      setUser(null);
      return;
    }
    try {
      const profile = await userApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
      tokenStorage.clear();
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    registerUnauthorizedHandler(() => setUser(null));
  }, [refreshUser]);

  const login = async (data: LoginRequest) => {
    await authApi.login(data);
    await refreshUser();
  };

  const register = async (data: AuthRequest) => {
    const res = await authApi.register(data);
    return { message: res.message };
  };

  const verifyOtp = async (data: OtpVerificationRequest) => {
    await authApi.verifyOtp(data);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    verifyOtp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
