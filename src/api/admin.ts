import apiClient from './client';
import type {
  ActivityLog,
  AlertRequest,
  AlertResponse,
  AlertType,
  DashboardStats,
  Page,
  PriceRequest,
  PriceResponse,
  User,
} from '../types';

export const adminApi = {
  // Dashboard
  getDashboardStats: () =>
    apiClient.get<DashboardStats>('/api/admin/dashboard').then((r) => r.data),

  // Users
  getAllUsers: (page = 0, size = 10) =>
    apiClient.get<Page<User>>('/api/admin/users', { params: { page, size } }).then((r) => r.data),

  getAllUsersList: () => apiClient.get<User[]>('/api/admin/users/all').then((r) => r.data),

  searchUsers: (keyword: string, page = 0, size = 10) =>
    apiClient
      .get<Page<User>>('/api/admin/users/search', { params: { keyword, page, size } })
      .then((r) => r.data),

  getUser: (userId: number) => apiClient.get<User>(`/api/admin/users/${userId}`).then((r) => r.data),

  activateUser: (userId: number) =>
    apiClient
      .patch<{ success: boolean; message: string; user: User }>(
        `/api/admin/users/${userId}/activate`
      )
      .then((r) => r.data),

  deactivateUser: (userId: number) =>
    apiClient
      .patch<{ success: boolean; message: string; user: User }>(
        `/api/admin/users/${userId}/deactivate`
      )
      .then((r) => r.data),

  makeAdmin: (userId: number) =>
    apiClient
      .patch<{ success: boolean; message: string; user: User }>(
        `/api/admin/users/${userId}/make-admin`
      )
      .then((r) => r.data),

  removeAdmin: (userId: number) =>
    apiClient
      .patch<{ success: boolean; message: string; user: User }>(
        `/api/admin/users/${userId}/remove-admin`
      )
      .then((r) => r.data),

  deleteUser: (userId: number) =>
    apiClient.delete<{ success: string; message: string }>(`/api/admin/users/${userId}`).then((r) => r.data),

  // Prices
  addPrice: (data: PriceRequest) =>
    apiClient.post<PriceResponse>('/api/admin/prices', data).then((r) => r.data),

  updatePrice: (priceId: number, data: PriceRequest) =>
    apiClient.put<PriceResponse>(`/api/admin/prices/${priceId}`, data).then((r) => r.data),

  getAllPrices: () => apiClient.get<PriceResponse[]>('/api/admin/prices').then((r) => r.data),

  getLatestPrices: () =>
    apiClient.get<PriceResponse[]>('/api/admin/prices/latest').then((r) => r.data),

  getPricesByProduct: (productName: string) =>
    apiClient
      .get<PriceResponse[]>(`/api/admin/prices/product/${encodeURIComponent(productName)}`)
      .then((r) => r.data),

  comparePrices: (productName: string, locations: string[]) =>
    apiClient
      .get<Record<string, Record<string, number>>>('/api/admin/prices/compare', {
        params: { productName, locations },
        paramsSerializer: { indexes: null },
      })
      .then((r) => r.data),

  deletePrice: (priceId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/prices/${priceId}`)
      .then((r) => r.data),

  // Alerts
  createAlert: (data: AlertRequest) =>
    apiClient.post<AlertResponse>('/api/admin/alerts', data).then((r) => r.data),

  updateAlert: (alertId: number, data: AlertRequest) =>
    apiClient.put<AlertResponse>(`/api/admin/alerts/${alertId}`, data).then((r) => r.data),

  getAllAlerts: (page = 0, size = 10) =>
    apiClient
      .get<Page<AlertResponse>>('/api/admin/alerts', { params: { page, size } })
      .then((r) => r.data),

  getActiveAlerts: () => apiClient.get<AlertResponse[]>('/api/admin/alerts/active').then((r) => r.data),

  getUrgentAlerts: () => apiClient.get<AlertResponse[]>('/api/admin/alerts/urgent').then((r) => r.data),

  getAlertsByType: (type: AlertType) =>
    apiClient.get<AlertResponse[]>(`/api/admin/alerts/type/${type}`).then((r) => r.data),

  deactivateAlert: (alertId: number) =>
    apiClient.patch<AlertResponse>(`/api/admin/alerts/${alertId}/deactivate`).then((r) => r.data),

  deleteAlert: (alertId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/alerts/${alertId}`)
      .then((r) => r.data),

  // Content moderation
  deleteProduct: (productId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/products/${productId}`)
      .then((r) => r.data),

  deleteMachine: (machineId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/machines/${machineId}`)
      .then((r) => r.data),

  deletePost: (postId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/posts/${postId}`)
      .then((r) => r.data),

  deleteComment: (commentId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/comments/${commentId}`)
      .then((r) => r.data),

  deleteGroup: (groupId: number) =>
    apiClient
      .delete<{ success: string; message: string }>(`/api/admin/groups/${groupId}`)
      .then((r) => r.data),

  // Logs
  getActivityLogs: (page = 0, size = 10) =>
    apiClient
      .get<Page<ActivityLog>>('/api/admin/logs', { params: { page, size } })
      .then((r) => r.data),

  // Stats
  getUserStats: () => apiClient.get<Record<string, number>>('/api/admin/stats/users').then((r) => r.data),
  getProductStats: () =>
    apiClient.get<Record<string, number>>('/api/admin/stats/products').then((r) => r.data),
  getPostStats: () => apiClient.get<Record<string, number>>('/api/admin/stats/posts').then((r) => r.data),
  getGroupStats: () =>
    apiClient.get<Record<string, number>>('/api/admin/stats/groups').then((r) => r.data),
};