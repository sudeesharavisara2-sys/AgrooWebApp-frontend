import apiClient from './client';
import type { CommentRequest, CommentResponse, Page } from '../types';

export const commentsApi = {
  add: (postId: number, data: CommentRequest) =>
    apiClient
      .post<CommentResponse>(`/api/comments/post/${postId}`, data)
      .then((r) => r.data),

  update: (commentId: number, data: CommentRequest) =>
    apiClient.put<CommentResponse>(`/api/comments/${commentId}`, data).then((r) => r.data),

  getByPost: (postId: number, page = 0, size = 10) =>
    apiClient
      .get<Page<CommentResponse>>(`/api/comments/post/${postId}`, { params: { page, size } })
      .then((r) => r.data),

  getReplies: (commentId: number, page = 0, size = 10) =>
    apiClient
      .get<Page<CommentResponse>>(`/api/comments/${commentId}/replies`, {
        params: { page, size },
      })
      .then((r) => r.data),

  delete: (commentId: number) =>
    apiClient.delete<void>(`/api/comments/${commentId}`).then((r) => r.data),

  getCount: (postId: number) =>
    apiClient.get<number>(`/api/comments/post/${postId}/count`).then((r) => r.data),
};
