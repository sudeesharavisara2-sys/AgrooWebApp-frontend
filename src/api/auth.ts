import apiClient, { tokenStorage } from './client';
import type {
  ApiResponse,
  AuthRequest,
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
} from '../types';

export const authApi = {
  register: (data: AuthRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),

  verifyOtp: (data: OtpVerificationRequest) =>
    apiClient.post<AuthResponse>('/api/auth/verify-otp', data).then((r) => {
      if (r.data.token) tokenStorage.setTokens(r.data.token, r.data.refreshToken);
      return r.data;
    }),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post<ApiResponse>('/api/auth/resend-otp', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data).then((r) => {
      if (r.data.token) tokenStorage.setTokens(r.data.token, r.data.refreshToken);
      return r.data;
    }),

  changePassword: (data: ChangePasswordRequest) => {
    const token = tokenStorage.getToken();
    return apiClient
      .post<ApiResponse>('/api/auth/change-password', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data);
  },

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse>('/api/auth/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse>('/api/auth/reset-password', data).then((r) => r.data),

  logout: () => {
    const token = tokenStorage.getToken();
    return apiClient
      .post<ApiResponse>(
        '/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((r) => r.data)
      .finally(() => tokenStorage.clear());
  },
};
