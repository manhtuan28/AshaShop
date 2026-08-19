import { create } from 'zustand';
import { User } from '../types';
import { authApi, usersApi } from '../services/api';

interface AuthState {
  user: User | null;
  tokens: { accessToken: string; refreshToken: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedUser = localStorage.getItem('ashashop_user');
  const savedTokens = localStorage.getItem('ashashop_tokens');

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    tokens: savedTokens ? JSON.parse(savedTokens) : null,
    isAuthenticated: !!savedTokens,
    isLoading: false,

    login: async (credentials) => {
      set({ isLoading: true });
      try {
        const res = await authApi.login(credentials);
        const { user, tokens } = res.data.data;
        localStorage.setItem('ashashop_user', JSON.stringify(user));
        localStorage.setItem('ashashop_tokens', JSON.stringify(tokens));
        set({ user, tokens, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => {
      localStorage.setItem('ashashop_user', JSON.stringify(user));
      localStorage.setItem('ashashop_tokens', JSON.stringify(tokens));
      set({ user, tokens, isAuthenticated: true, isLoading: false });
    },

    register: async (userData) => {
      set({ isLoading: true });
      try {
        const res = await authApi.register(userData);
        const { user, tokens } = res.data.data;
        localStorage.setItem('ashashop_user', JSON.stringify(user));
        localStorage.setItem('ashashop_tokens', JSON.stringify(tokens));
        set({ user, tokens, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch (e) {
        // Ignore logout error
      } finally {
        localStorage.removeItem('ashashop_user');
        localStorage.removeItem('ashashop_tokens');
        set({ user: null, tokens: null, isAuthenticated: false });
      }
    },

    checkAuth: async () => {
      const tokensStr = localStorage.getItem('ashashop_tokens');
      if (!tokensStr) return;

      try {
        const res = await usersApi.getProfile();
        if (res.data?.success && res.data.data) {
          const user = res.data.data;
          localStorage.setItem('ashashop_user', JSON.stringify(user));
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Dữ liệu tài khoản không hợp lệ');
        }
      } catch (e) {
        // Token invalid or user reset in DB
        localStorage.removeItem('ashashop_user');
        localStorage.removeItem('ashashop_tokens');
        set({ user: null, tokens: null, isAuthenticated: false });
      }
    },

    setUser: (user: User) => {
      localStorage.setItem('ashashop_user', JSON.stringify(user));
      set({ user });
    },
  };
});
