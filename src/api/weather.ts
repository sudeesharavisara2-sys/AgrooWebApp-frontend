import apiClient from './client';

export interface WeatherData {
  id: number;
  location: string;
  alertType: string | null;
  severity: string | null;
  message: string | null;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  isActive: boolean;
  isSent: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface WeatherAlert {
  id: number;
  location: string;
  alertType: string;
  severity: string;
  message: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  isActive: boolean;
  isSent: boolean;
  createdAt: string;
}

export const weatherAPI = {
  // Check weather for a location
  checkWeather: (location: string) => 
    apiClient.post<WeatherData>(`/api/weather/check/${location}`),

  // Get all active alerts
  getAlerts: () => 
    apiClient.get<WeatherAlert[]>('/api/weather/alerts'),

  // Get alerts by location
  getAlertsByLocation: (location: string) => 
    apiClient.get<WeatherAlert[]>(`/api/weather/alerts/location/${location}`),

  // Get specific alert
  getAlert: (id: number) => 
    apiClient.get<WeatherAlert>(`/api/weather/alerts/${id}`),

  // Deactivate alert
  deactivateAlert: (id: number) => 
    apiClient.patch(`/api/weather/alerts/${id}/deactivate`),
};