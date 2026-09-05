
import apiClient from './client';

export interface ChatRequest {
  message: string;
  context?: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  timestamp: string;
  source: string;
  success: boolean;
  message: string;
}

export const aiChatApi = {
  // General Chat
  sendMessage: async (
    request: ChatRequest
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      '/api/chat',
      request
    );

    return response.data;
  },

  // Farming Advice
  getFarmingAdvice: async (
    message: string
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      '/api/chat/farming-advice',
      { message }
    );

    return response.data;
  },

  // Market Prices
  getMarketPrices: async (
    message: string
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      '/api/chat/market-prices',
      { message }
    );

    return response.data;
  },

  // Disease Advice
  getDiseaseAdvice: async (
    message: string
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      '/api/chat/disease-advice',
      { message }
    );

    return response.data;
  },
};

