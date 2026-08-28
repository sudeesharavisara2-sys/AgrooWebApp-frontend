import apiClient from './client';
import type { UpdateProfileRequest, UserProfile } from '../types';

export const userApi = {
  getProfile: () => apiClient.get<UserProfile>('/api/user/profile').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient
      .put<{ success: boolean; message: string; user: UserProfile }>('/api/user/profile', data)
      .then((r) => r.data),
};
