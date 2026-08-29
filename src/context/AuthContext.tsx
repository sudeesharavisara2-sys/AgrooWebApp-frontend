import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi } from '../api/auth';
import { userApi } from '../api/user';
import {
  registerUnauthorizedHandler,
  tokenStorage,
} from '../api/client';

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

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Refresh the currently authenticated user's profile.
   * If there is no valid token, the user is treated as logged out.
   */
  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getToken();

    if (!token) {
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

  /**
   * Restore authentication state when the application starts.
   * Also handle unauthorized API responses globally.
   */
  useEffect(() => {
    refreshUser().finally(() => {
      setLoading(false);
    });

    registerUnauthorizedHandler(() => {
      setUser(null);
    });
  }, [refreshUser]);

  /**
   * Login the user and immediately load their profile.
   */
  const login = async (data: LoginRequest) => {
    await authApi.login(data);
    await refreshUser();
  };

  /**
   * Register a new account.
   */
  const register = async (data: AuthRequest) => {
    const res = await authApi.register(data);

    return {
      message: res.message,
    };
  };

  /**
   * Verify OTP and refresh the authenticated user.
   */
  const verifyOtp = async (data: OtpVerificationRequest) => {
    await authApi.verifyOtp(data);
    await refreshUser();
  };

  /**
   * Logout the current user.
   * The local authentication state is cleared even if
   * the API logout request fails.
   */
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Access authentication state and actions throughout the application.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}

