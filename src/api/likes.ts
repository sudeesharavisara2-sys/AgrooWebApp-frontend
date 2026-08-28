import apiClient from './client';
import type { LikeRequest, LikeResponse } from '../types';

export const likesApi = {
  like: (postId: number, data?: LikeRequest) =>
    apiClient.post<LikeResponse>(`/api/likes/post/${postId}`, data || {}).then((r) => r.data),

  unlike: (postId: number) => apiClient.delete<void>(`/api/likes/post/${postId}`).then((r) => r.data),

  getCount: (postId: number) =>
    apiClient
      .get<{ likeCount: number }>(`/api/likes/post/${postId}/count`)
      .then((r) => r.data.likeCount),

  hasLiked: (postId: number) =>
    apiClient
      .get<{ liked: boolean }>(`/api/likes/post/${postId}/check`)
      .then((r) => r.data.liked),
};
