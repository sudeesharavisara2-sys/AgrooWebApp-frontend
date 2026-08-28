import apiClient from './client';
import type {
  Page,
  ProductCategory,
  ProductRequest,
  ProductResponse,
  ProductType,
  SaleType,
} from '../types';

export interface ProductListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface AdvancedSearchParams {
  category?: string;
  productType?: string;
  saleType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export const productsApi = {
  create: (data: ProductRequest, images?: File[]) => {
    if (images && images.length > 0) {
      const formData = new FormData();
      formData.append(
        'product',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );
      images.forEach((img) => formData.append('images', img));
      return apiClient
        .post<ProductResponse>('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
    }
    return apiClient.post<ProductResponse>('/api/products/json', data).then((r) => r.data);
  },

  getAll: (params: ProductListParams = {}) =>
    apiClient
      .get<Page<ProductResponse>>('/api/products', {
        params: { page: 0, size: 10, sortBy: 'createdAt', direction: 'desc', ...params },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<ProductResponse>(`/api/products/${id}`).then((r) => r.data),

  getByFarmer: (farmerId: number, page = 0, size = 10) =>
    apiClient
      .get<Page<ProductResponse>>(`/api/products/farmer/${farmerId}`, { params: { page, size } })
      .then((r) => r.data),

  getByCategory: (category: ProductCategory, page = 0, size = 10) =>
    apiClient
      .get<Page<ProductResponse>>(`/api/products/category/${category}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  getByType: (productType: ProductType, page = 0, size = 10) =>
    apiClient
      .get<Page<ProductResponse>>(`/api/products/type/${productType}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  getBySaleType: (saleType: SaleType, page = 0, size = 10) =>
    apiClient
      .get<Page<ProductResponse>>(`/api/products/sale-type/${saleType}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  search: (keyword?: string, location?: string) =>
    apiClient
      .get<ProductResponse[]>('/api/products/search', { params: { keyword, location } })
      .then((r) => r.data),

  advancedSearch: (params: AdvancedSearchParams) =>
    apiClient
      .get<ProductResponse[]>('/api/products/advanced-search', { params })
      .then((r) => r.data),

  update: (id: number, data: ProductRequest) =>
    apiClient.put<ProductResponse>(`/api/products/${id}`, data).then((r) => r.data),

  toggleAvailability: (id: number) =>
    apiClient
      .patch<ProductResponse>(`/api/products/${id}/toggle-availability`)
      .then((r) => r.data),

  setPrimaryImage: (imageId: number) =>
    apiClient
      .patch<ProductResponse>(`/api/products/images/${imageId}/set-primary`)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete<void>(`/api/products/${id}`).then((r) => r.data),

  deleteImage: (imageId: number) =>
    apiClient.delete<void>(`/api/products/images/${imageId}`).then((r) => r.data),
};
