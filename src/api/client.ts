import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8081';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------------------------
// Token storage helpers
// ------------------------------------------------------------
const TOKEN_KEY = 'agroo_token';
const REFRESH_TOKEN_KEY = 'agroo_refresh_token';

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (token: string, refreshToken?: string | null) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ------------------------------------------------------------
// Request interceptor — attach JWT
// ------------------------------------------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------------------
// Unified error shape
// ------------------------------------------------------------
export interface ApiError {
  status: number;
  message: string;
  timestamp?: string;
  raw?: unknown;
}

function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown> | undefined;
    return {
      status: error.response.status,
      message:
        (data?.message as string) ||
        (data?.error as string) ||
        error.message ||
        'Something went wrong. Please try again.',
      timestamp: data?.timestamp as string | undefined,
      raw: data,
    };
  }
  if (error.request) {
    return {
      status: 0,
      message: 'Cannot reach the server. Check your connection or that the API is running.',
    };
  }
  return { status: -1, message: error.message || 'Unexpected error' };
}

// ------------------------------------------------------------
// Response interceptor — normalize errors, handle 401
// ------------------------------------------------------------
let onUnauthorized: (() => void) | null = null;
export const registerUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401) {
      tokenStorage.clear();
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(normalized);
  }
);

export default apiClient;
