import apiClient from './client';
import type {
  MachineRentalRequest,
  MachineRentalResponse,
  MachineStatus,
  MachineType,
  Page,
} from '../types';

export interface AdvancedMachineSearchParams {
  machineType?: MachineType;
  status?: MachineStatus;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  size?: number;
}

function buildMachineFormData(data: MachineRentalRequest, images?: File[]) {
  const formData = new FormData();
  formData.append('machine', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  (images || []).forEach((img) => formData.append('images', img));
  return formData;
}

export const machinesApi = {
  create: (data: MachineRentalRequest, images?: File[]) =>
    apiClient
      .post<MachineRentalResponse>('/api/machines', buildMachineFormData(data, images), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  getAll: (page = 0, size = 10) =>
    apiClient
      .get<Page<MachineRentalResponse>>('/api/machines', { params: { page, size } })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<MachineRentalResponse>(`/api/machines/${id}`).then((r) => r.data),

  getByOwner: (ownerId: number, page = 0, size = 10) =>
    apiClient
      .get<Page<MachineRentalResponse>>(`/api/machines/owner/${ownerId}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  getByType: (machineType: MachineType, page = 0, size = 10) =>
    apiClient
      .get<Page<MachineRentalResponse>>(`/api/machines/type/${machineType}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  getAvailable: (page = 0, size = 10) =>
    apiClient
      .get<Page<MachineRentalResponse>>('/api/machines/available', { params: { page, size } })
      .then((r) => r.data),

  search: (keyword?: string, location?: string, page = 0, size = 10) =>
    apiClient
      .get<Page<MachineRentalResponse>>('/api/machines/search', {
        params: { keyword, location, page, size },
      })
      .then((r) => r.data),

  advancedSearch: (params: AdvancedMachineSearchParams) =>
    apiClient
      .get<Page<MachineRentalResponse>>('/api/machines/advanced-search', {
        params: { page: 0, size: 10, ...params },
      })
      .then((r) => r.data),

  update: (id: number, data: MachineRentalRequest, images?: File[]) =>
    apiClient
      .put<MachineRentalResponse>(`/api/machines/${id}`, buildMachineFormData(data, images), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  toggleAvailability: (id: number) =>
    apiClient
      .patch<MachineRentalResponse>(`/api/machines/${id}/toggle-availability`)
      .then((r) => r.data),

  setPrimaryImage: (imageId: number) =>
    apiClient
      .patch<MachineRentalResponse>(`/api/machines/images/${imageId}/set-primary`)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete<void>(`/api/machines/${id}`).then((r) => r.data),

  deleteImage: (imageId: number) =>
    apiClient.delete<void>(`/api/machines/images/${imageId}`).then((r) => r.data),
};
