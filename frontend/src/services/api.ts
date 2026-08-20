import axios from 'axios';
import { ApiResponse, Category, Order, PaginatedResult, Product, User, Review, PurchasedProductsResponse } from '../types';

// Dynamic API detection:
// 1. If running on local machine (localhost / 127.0.0.1), connect to local backend container on port 5000
// 2. If running in production (Vercel / Cloudflare), connect to VPS live API
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:5000/api/v1'
  : (import.meta.env.VITE_API_URL || 'https://aov.maitiendung.com/api/v1');

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
  forgotPassword: (data: { email: string }) => api.post<ApiResponse<{ message: string; resetCode?: string }>>('/auth/forgot-password', data),
  resetPassword: (data: { email: string; token: string; newPassword: string }) => api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),
  googleLogin: (data: { token: string; email?: string; name?: string; avatar?: string; googleId?: string }) => 
    api.post<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>('/auth/oauth/google', data),
  facebookLogin: (data: { accessToken: string; email?: string; name?: string; avatar?: string; facebookId?: string }) => 
    api.post<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string } }>>('/auth/oauth/facebook', data),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const productsApi = {
  getAll: (params?: any) => api.get<ApiResponse<PaginatedResult<Product>>>('/products', { params }),
  getFeatured: () => api.get<ApiResponse<Product[]>>('/products/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getCategories: () => api.get<ApiResponse<Category[]>>('/products/categories'),
  
  // Admin Product APIs
  create: (data: any) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: string, data: any) => api.patch<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/products/${id}`),

  // Admin Category APIs
  createCategory: (data: any) => api.post<ApiResponse<Category>>('/products/categories', data),
  updateCategory: (id: string, data: any) => api.patch<ApiResponse<Category>>(`/products/categories/${id}`, data),
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
  
  // Admin Order APIs
  getAdminStats: () => api.get<ApiResponse<{ totalOrders: number; pendingOrders: number; deliveredOrders: number; totalRevenue: number; totalProducts: number }>>('/orders/admin/stats'),
  getAllAdmin: (params?: any) => api.get<ApiResponse<PaginatedResult<Order>>>('/orders/admin/all', { params }),
  updateStatus: (id: string, data: any) => api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data),
};

export const usersApi = {
  getProfile: () => api.get<ApiResponse<User>>('/users/profile'),
  updateProfile: (data: any) => api.patch<ApiResponse<User>>('/users/profile', data),
  
  // Admin User APIs
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: any) => api.post<ApiResponse<User>>('/users', data),
  update: (id: string, data: any) => api.patch<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/users/${id}`),
};

export const settingsApi = {
  getSettings: () => api.get<ApiResponse<any>>('/settings'),
  updateSettings: (data: any) => api.put<ApiResponse<any>>('/settings', data),
};

export const reviewsApi = {
  create: (data: { productId: string; orderId?: string; rating: number; comment: string; images?: string[]; selectedAttributes?: any }) =>
    api.post<ApiResponse<Review>>('/reviews', data),
  getMyReviews: () => api.get<ApiResponse<Review[]>>('/reviews/my-reviews'),
  getPurchasedProducts: () => api.get<ApiResponse<PurchasedProductsResponse>>('/reviews/purchased-products'),
  getByProduct: (productId: string) => api.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`),
};

export const paymentsApi = {
  createPaymentUrl: (data: { orderId: string; returnUrl?: string }) =>
    api.post<ApiResponse<{ paymentUrl: string; orderId: string; method: string }>>('/payments/create-url', data),
  verifyPayment: (data: { method: string; params: Record<string, any> }) =>
    api.post<ApiResponse<{ success: boolean; orderId: string; message: string; order?: any }>>('/payments/verify', data),
  verifyVnpay: (params: Record<string, any>) =>
    api.get<ApiResponse<{ success: boolean; orderId: string; message: string; order?: any }>>('/payments/vnpay-verify', { params }),
  verifyMomo: (params: Record<string, any>) =>
    api.get<ApiResponse<{ success: boolean; orderId: string; message: string; order?: any }>>('/payments/momo-verify', { params }),
  verifyPaypal: (params: Record<string, any>) =>
    api.get<ApiResponse<{ success: boolean; orderId: string; message: string; order?: any }>>('/payments/paypal-verify', { params }),
};

