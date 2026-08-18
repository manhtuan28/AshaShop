import { create } from 'zustand';
import { Cart } from '../types';
import { cartApi } from '../services/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  itemsCount: number;
  totalPrice: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, selectedAttributes?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  itemsCount: 0,
  totalPrice: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await cartApi.get();
      const cart = res.data.data;
      const itemsCount = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      set({ cart, itemsCount, totalPrice: cart.totalPrice || 0 });
    } catch (error) {
      // User might be unauthenticated, silence or reset cart
      set({ cart: null, itemsCount: 0, totalPrice: 0 });
    }
  },

  addToCart: async (productId, quantity = 1, selectedAttributes = {}) => {
    try {
      const res = await cartApi.add({ productId, quantity, selectedAttributes });
      const cart = res.data.data;
      const itemsCount = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      set({ cart, itemsCount, totalPrice: cart.totalPrice || 0 });
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      toast.error(typeof msg === 'string' ? msg : 'Lỗi thêm vào giỏ hàng');
      throw error;
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await cartApi.update({ productId, quantity });
      const cart = res.data.data;
      const itemsCount = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      set({ cart, itemsCount, totalPrice: cart.totalPrice || 0 });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể cập nhật số lượng';
      toast.error(typeof msg === 'string' ? msg : 'Lỗi cập nhật giỏ hàng');
    }
  },

  removeItem: async (productId) => {
    try {
      const res = await cartApi.remove(productId);
      const cart = res.data.data;
      const itemsCount = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      set({ cart, itemsCount, totalPrice: cart.totalPrice || 0 });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error: any) {
      toast.error('Lỗi khi xóa sản phẩm');
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ cart: null, itemsCount: 0, totalPrice: 0 });
    } catch (error) {
      console.error(error);
    }
  },
}));
