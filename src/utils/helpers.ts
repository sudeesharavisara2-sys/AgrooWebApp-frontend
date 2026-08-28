import { API_BASE_URL } from '../api/client';
import type { ApiError } from '../api/client';

/** Resolves a relative image path returned by the backend to an absolute URL. */
export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined) return '—';
  return `Rs. ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function humanizeEnum(value?: string | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getErrorMessage(err: unknown): string {
  const apiErr = err as ApiError;
  if (apiErr && typeof apiErr === 'object' && 'message' in apiErr) {
    return apiErr.message;
  }
  return 'Something went wrong. Please try again.';
}
