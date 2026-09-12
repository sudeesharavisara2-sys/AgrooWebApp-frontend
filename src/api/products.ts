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
  // ------------------------------------------------------------
  // Create product
  // ------------------------------------------------------------
  create: (
    data: ProductRequest,
    images?: File[]
  ) => {
    if (
      images &&
      images.length > 0
    ) {
      const formData =
        new FormData();

      formData.append(
        'product',
        new Blob(
          [JSON.stringify(data)],
          {
            type: 'application/json',
          }
        )
      );

      images.forEach((image) => {
        formData.append(
          'images',
          image
        );
      });

      return apiClient
        .post<ProductResponse>(
          '/api/products',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        )
        .then(
          (response) =>
            response.data
        );
    }

    return apiClient
      .post<ProductResponse>(
        '/api/products/json',
        data
      )
      .then(
        (response) =>
          response.data
      );
  },

  // ------------------------------------------------------------
  // Get all products
  // ------------------------------------------------------------
  getAll: (
    params: ProductListParams = {}
  ) =>
    apiClient
      .get<Page<ProductResponse>>(
        '/api/products',
        {
          params: {
            page: 0,
            size: 10,
            sortBy: 'createdAt',
            direction: 'desc',
            ...params,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Get product by ID
  // ------------------------------------------------------------
  getById: (id: number) =>
    apiClient
      .get<ProductResponse>(
        `/api/products/${id}`
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Get products by farmer
  // ------------------------------------------------------------
  getByFarmer: (
    farmerId: number,
    page = 0,
    size = 10
  ) =>
    apiClient
      .get<Page<ProductResponse>>(
        `/api/products/farmer/${farmerId}`,
        {
          params: {
            page,
            size,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Get products by category
  // ------------------------------------------------------------
  getByCategory: (
    category: ProductCategory,
    page = 0,
    size = 10
  ) =>
    apiClient
      .get<Page<ProductResponse>>(
        `/api/products/category/${category}`,
        {
          params: {
            page,
            size,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Get products by product type
  // ------------------------------------------------------------
  getByType: (
    productType: ProductType,
    page = 0,
    size = 10
  ) =>
    apiClient
      .get<Page<ProductResponse>>(
        `/api/products/type/${productType}`,
        {
          params: {
            page,
            size,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Get products by sale type
  // ------------------------------------------------------------
  getBySaleType: (
    saleType: SaleType,
    page = 0,
    size = 10
  ) =>
    apiClient
      .get<Page<ProductResponse>>(
        `/api/products/sale-type/${saleType}`,
        {
          params: {
            page,
            size,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Search products
  // ------------------------------------------------------------
  search: (
    keyword?: string,
    location?: string
  ) =>
    apiClient
      .get<ProductResponse[]>(
        '/api/products/search',
        {
          params: {
            keyword,
            location,
          },
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Advanced search
  // ------------------------------------------------------------
  advancedSearch: (
    params: AdvancedSearchParams
  ) =>
    apiClient
      .get<ProductResponse[]>(
        '/api/products/advanced-search',
        {
          params,
        }
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Update product details
  // ------------------------------------------------------------
  update: (
    id: number,
    data: ProductRequest
  ) =>
    apiClient
      .put<ProductResponse>(
        `/api/products/${id}`,
        data
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Toggle availability
  // ------------------------------------------------------------
  toggleAvailability: (
    id: number
  ) =>
    apiClient
      .patch<ProductResponse>(
        `/api/products/${id}/toggle-availability`
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Set primary image
  // ------------------------------------------------------------
  setPrimaryImage: (
    imageId: number
  ) =>
    apiClient
      .patch<ProductResponse>(
        `/api/products/images/${imageId}/set-primary`
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Delete product
  // ------------------------------------------------------------
  delete: (id: number) =>
    apiClient
      .delete<void>(
        `/api/products/${id}`
      )
      .then(
        (response) =>
          response.data
      ),

  // ------------------------------------------------------------
  // Delete product image
  // ------------------------------------------------------------
  deleteImage: (
    imageId: number
  ) =>
    apiClient
      .delete<void>(
        `/api/products/images/${imageId}`
      )
      .then(
        (response) =>
          response.data
      ),
};