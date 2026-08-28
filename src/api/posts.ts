import apiClient from './client';
import type { Page, PostRequest, PostResponse } from '../types';

function buildPostFormData(data: PostRequest, media?: File | null) {
  const formData = new FormData();
  formData.append('post', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (media) formData.append('media', media);
  return formData;
}

export const postsApi = {
  create: (data: PostRequest, media?: File | null) =>
    apiClient
      .post<PostResponse>('/api/posts', buildPostFormData(data, media), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  getAll: (page = 0, size = 10) =>
    apiClient.get<Page<PostResponse>>('/api/posts', { params: { page, size } }).then((r) => r.data),

  getFeed: (page = 0, size = 10) =>
    apiClient
      .get<Page<PostResponse>>('/api/posts/feed', { params: { page, size } })
      .then((r) => r.data),

  getById: (id: number) => apiClient.get<PostResponse>(`/api/posts/${id}`).then((r) => r.data),

  getByUser: (userId: number, page = 0, size = 10) =>
    apiClient
      .get<Page<PostResponse>>(`/api/posts/user/${userId}`, { params: { page, size } })
      .then((r) => r.data),

  search: (keyword: string, page = 0, size = 10) =>
    apiClient
      .get<Page<PostResponse>>('/api/posts/search', { params: { keyword, page, size } })
      .then((r) => r.data),

  update: (id: number, data: PostRequest, media?: File | null) =>
    apiClient
      .put<PostResponse>(`/api/posts/${id}`, buildPostFormData(data, media), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  toggleVisibility: (id: number) =>
    apiClient.patch<PostResponse>(`/api/posts/${id}/toggle-visibility`).then((r) => r.data),

  deleteMedia: (id: number) => apiClient.delete<void>(`/api/posts/${id}/media`).then((r) => r.data),

  delete: (id: number) => apiClient.delete<void>(`/api/posts/${id}`).then((r) => r.data),
};
