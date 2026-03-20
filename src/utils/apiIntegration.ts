import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_SUPABASE_URL + '/functions/v1' || 'https://lppgtqtqockemugndxio.supabase.co/functions/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth-login',
    REGISTER: '/auth-register',
    REFRESH: '/auth-refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    NOTIFICATIONS: '/users/notifications',
  },
  
  // Events
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    DUPLICATE: (id: string) => `/events/${id}/duplicate`,
    ANALYTICS: (id: string) => `/events/${id}/analytics`,
  },
  
  // Vendors
  VENDORS: {
    LIST: '/vendors',
    GET: (id: string) => `/vendors/${id}`,
    SEARCH: '/vendors/search',
    CATEGORIES: '/vendors/categories',
    VERIFICATION: '/vendors/verification',
    REVIEWS: (id: string) => `/vendors/${id}/reviews`,
  },
  
  // Bookings
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    GET: (id: string) => `/bookings/${id}`,
    UPDATE: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
  
  // Payments
  PAYMENTS: {
    PROCESS: '/payments/process',
    WEBHOOK: '/payments/webhook',
    HISTORY: '/payments/history',
    REFUND: (id: string) => `/payments/${id}/refund`,
  },
  
  // Messaging
  MESSAGING: {
    CONVERSATIONS: '/messaging/conversations',
    MESSAGES: (conversationId: string) => `/messaging/conversations/${conversationId}/messages`,
    SEND: '/messaging/send',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    PREFERENCES: '/notifications/preferences',
    TEMPLATES: '/notifications/templates',
  },
};

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  showErrorToast?: boolean;
  showLoadingToast?: boolean;
}

// Storage utilities
export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// Token management
export const tokenManager = {
  getToken: (): string | null => storage.get('auth_token'),
  
  setToken: (token: string): void => storage.set('auth_token', token),
  
  getRefreshToken: (): string | null => storage.get('refresh_token'),
  
  setRefreshToken: (token: string): void => storage.set('refresh_token', token),
  
  clearTokens: (): void => {
    storage.remove('auth_token');
    storage.remove('refresh_token');
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },
};

// HTTP Client class
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config = API_CONFIG) {
    this.baseURL = config.BASE_URL;
    this.timeout = config.TIMEOUT;
    this.retryAttempts = config.RETRY_ATTEMPTS;
    this.retryDelay = config.RETRY_DELAY;
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = this.retryAttempts,
      showErrorToast = true,
      showLoadingToast = false,
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const token = tokenManager.getToken();

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token && !tokenManager.isTokenExpired(token)) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    let loadingToastId: string | undefined;

    if (showLoadingToast) {
      toast({
        title: "Loading...",
        description: "Processing your request",
      });
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            await this.handleTokenRefresh();
            if (attempt === retries) {
              throw new Error('Authentication failed');
            }
            continue;
          }

          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data: ApiResponse<T> = await response.json();

        if (loadingToastId) {
          // Dismiss loading toast
        }

        return data;
      } catch (error) {
        if (attempt === retries) {
          if (loadingToastId) {
            // Dismiss loading toast
          }

          const apiError: ApiError = {
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
          };

          if (showErrorToast) {
            toast({
              title: "Error",
              description: apiError.message,
              variant: "destructive",
            });
          }

          throw apiError;
        }

        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
      }
    }

    throw new Error('Max retries exceeded');
  }

  private async handleTokenRefresh(): Promise<void> {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken || tokenManager.isTokenExpired(refreshToken)) {
      tokenManager.clearTokens();
      window.location.href = '/auth';
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        tokenManager.setToken(data.data.accessToken);
        tokenManager.setRefreshToken(data.data.refreshToken);
      } else {
        tokenManager.clearTokens();
        window.location.href = '/auth';
      }
    } catch {
      tokenManager.clearTokens();
      window.location.href = '/auth';
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Utility functions for common operations
export const apiUtils = {
  // Format error messages
  formatError: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'An unexpected error occurred';
  },

  // Handle pagination
  buildPaginationQuery: (page: number, limit: number, filters?: Record<string, any>): string => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return `?${params.toString()}`;
  },

  // Format currency (NGN)
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Format date
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  // Format time
  formatTime: (date: string | Date): string => {
    return new Intl.DateTimeFormat('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  // Debounce function for search
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Upload file utility
  uploadFile: async (file: File, endpoint: string): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = tokenManager.getToken();
    const headers: Record<string, string> = {};
    
    if (token && !tokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  // Generate unique ID
  generateId: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Nigerian format)
  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('234')) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return `+234${cleaned.slice(1)}`;
    }
    return phone;
  },
};

// React hooks for API calls
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    options: { showErrorToast?: boolean; onSuccess?: (data: T) => void; onError?: (error: ApiError) => void } = {}
  ): Promise<T | null> => {
    const { showErrorToast = true, onSuccess, onError } = options;
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        onSuccess?.(response.data);
        return response.data;
      } else {
        const apiError: ApiError = {
          message: response.error || 'API call failed',
        };
        setError(apiError);
        onError?.(apiError);
        
        if (showErrorToast) {
          toast({
            title: "Error",
            description: apiError.message,
            variant: "destructive",
          });
        }
        
        return null;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default apiClient;
