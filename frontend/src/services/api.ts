import axios from 'axios';
import { ApiResponse, Category, Order, PaginatedResult, Product, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('ashashop_tokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        if (parsed.accessToken) {
          config.headers.Authorization = `Bearer ${parsed.accessToken}`;
        }
      } catch (e) {
        console.error('Lỗi phân tích token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle unwrap data or refresh token
api.interceptors.response.use(
  (response) => {
    // If wrapped in ApiResponse structure, return response.data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokensStr = localStorage.getItem('ashashop_tokens');
      if (tokensStr) {
        try {
          const { refreshToken } = JSON.parse(tokensStr);
          if (refreshToken) {
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
            const newTokens = refreshRes.data.data.tokens;
            localStorage.setItem('ashashop_tokens', JSON.stringify(newTokens));
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('ashashop_tokens');
          localStorage.removeItem('ashashop_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// ================= API SERVICES =================

export const authApi = {
  login: (data: any) => api.post<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>('/auth/login', data),
  register: (data: any) => api.post<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>('/auth/register', data),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const productsApi = {
  getAll: (params?: any) => api.get<ApiResponse<PaginatedResult<Product>>>('/products', { params }),
  getFeatured: () => api.get<ApiResponse<Product[]>>('/products/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getCategories: () => api.get<ApiResponse<Category[]>>('/products/categories'),
  
  // Admin APIs
  create: (data: any) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: string, data: any) => api.patch<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/products/${id}`),
  createCategory: (data: any) => api.post<ApiResponse<Category>>('/products/categories', data),
  deleteCategory: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/products/categories/${id}`),
};

export const cartApi = {
  get: () => api.get<ApiResponse<any>>('/cart'),
  add: (data: { productId: string; quantity: number; selectedAttributes?: any }) => api.post<ApiResponse<any>>('/cart/add', data),
  update: (data: { productId: string; quantity: number }) => api.patch<ApiResponse<any>>('/cart/update', data),
  remove: (productId: string) => api.delete<ApiResponse<any>>(`/cart/item/${productId}`),
  clear: () => api.delete<ApiResponse<any>>('/cart/clear'),
};

export const ordersApi = {
  create: (data: any) => api.post<ApiResponse<Order>>('/orders', data),
  getMyOrders: () => api.get<ApiResponse<Order[]>>('/orders/my-orders'),
  getById: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  cancel: (id: string) => api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`),
  
  // Admin APIs
  getAdminStats: () => api.get<ApiResponse<{ totalOrders: number; pendingOrders: number; deliveredOrders: number; totalRevenue: number; totalProducts: number }>>('/orders/admin/stats'),
  getAllAdmin: (params?: any) => api.get<ApiResponse<PaginatedResult<Order>>>('/orders/admin/all', { params }),
  updateStatus: (id: string, data: any) => api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data),
};

export const usersApi = {
  getProfile: () => api.get<ApiResponse<User>>('/users/profile'),
  updateProfile: (data: any) => api.patch<ApiResponse<User>>('/users/profile', data),
};
