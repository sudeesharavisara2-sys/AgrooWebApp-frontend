import apiClient from './client';
import type { ChatGroupResponse, GroupMemberRequest, GroupMemberResponse, GroupRequest, Page } from '../types';

function buildGroupFormData(data: GroupRequest, image?: File | null) {
  const formData = new FormData();
  formData.append('group', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (image) formData.append('image', image);
  return formData;
}

export const groupsApi = {
  create: (data: GroupRequest, image?: File | null) =>
    apiClient
      .post<ChatGroupResponse>('/api/groups', buildGroupFormData(data, image), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (groupId: number, data: GroupRequest, image?: File | null) =>
    apiClient
      .put<ChatGroupResponse>(`/api/groups/${groupId}`, buildGroupFormData(data, image), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  deleteImage: (groupId: number) =>
    apiClient.delete<void>(`/api/groups/${groupId}/image`).then((r) => r.data),

  getById: (groupId: number) =>
    apiClient.get<ChatGroupResponse>(`/api/groups/${groupId}`).then((r) => r.data),

  getMyGroups: (page = 0, size = 10) =>
    apiClient
      .get<Page<ChatGroupResponse>>('/api/groups', { params: { page, size } })
      .then((r) => r.data),

  search: (keyword: string, page = 0, size = 10) =>
    apiClient
      .get<Page<ChatGroupResponse>>('/api/groups/search', { params: { keyword, page, size } })
      .then((r) => r.data),

  addMember: (groupId: number, data: GroupMemberRequest) =>
    apiClient
      .post<GroupMemberResponse>(`/api/groups/${groupId}/members`, data)
      .then((r) => r.data),

  addMemberByEmail: (groupId: number, email: string) =>
    apiClient
      .post<GroupMemberResponse>(`/api/groups/${groupId}/members/email`, null, {
        params: { email },
      })
      .then((r) => r.data),

  removeMember: (groupId: number, userId: number) =>
    apiClient.delete<void>(`/api/groups/${groupId}/members/${userId}`).then((r) => r.data),

  makeAdmin: (groupId: number, userId: number) =>
    apiClient
      .patch<GroupMemberResponse>(`/api/groups/${groupId}/members/${userId}/make-admin`)
      .then((r) => r.data),

  removeAdmin: (groupId: number, userId: number) =>
    apiClient
      .patch<GroupMemberResponse>(`/api/groups/${groupId}/members/${userId}/remove-admin`)
      .then((r) => r.data),

  getMembers: (groupId: number, page = 0, size = 20) =>
    apiClient
      .get<Page<GroupMemberResponse>>(`/api/groups/${groupId}/members`, {
        params: { page, size },
      })
      .then((r) => r.data),

  leave: (groupId: number) => apiClient.post<void>(`/api/groups/${groupId}/leave`).then((r) => r.data),

  delete: (groupId: number) => apiClient.delete<void>(`/api/groups/${groupId}`).then((r) => r.data),

  isAdmin: (groupId: number) =>
    apiClient.get<boolean>(`/api/groups/${groupId}/is-admin`).then((r) => r.data),
};
