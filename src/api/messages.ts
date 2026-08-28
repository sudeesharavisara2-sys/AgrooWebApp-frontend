import apiClient from './client';
import type { ChatMessageResponse, Page } from '../types';

export const messagesApi = {
  getGroupMessages: (groupId: number, page = 0, size = 50) =>
    apiClient
      .get<Page<ChatMessageResponse>>(`/api/messages/group/${groupId}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  markAsRead: (groupId: number) =>
    apiClient.post<void>(`/api/messages/group/${groupId}/read`).then((r) => r.data),

  getUnreadCount: (groupId: number) =>
    apiClient.get<number>(`/api/messages/group/${groupId}/unread`).then((r) => r.data),
};
