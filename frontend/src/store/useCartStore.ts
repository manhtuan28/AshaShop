import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product } from '../types';
import { cartApi } from '../services/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, selectedAttributes?: any) => Promise<void>;
  addToCart: (productId: string, quantity?: number, selectedAttributes?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,

      fetchCart: async () => {
        try {
          const res = await cartApi.get();
          const cart = res.data.data;
          const items = cart.items || [];
          const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          const totalPrice = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
          set({ cart, items, totalItems, totalPrice });
        } catch (error) {
          // If offline or guest, keep current local state
        }
      },

      addItem: async (product, quantity = 1, selectedAttributes = {}) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product._id === product._id
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = currentItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...currentItems, { product, quantity, price: product.price, selectedAttributes }];
        }

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
        toast.success(`Added ${product.name} to cart!`);

        // Sync with backend if logged in
        try {
          await cartApi.add({ productId: product._id, quantity, selectedAttributes });
        } catch (e) {
          // Local fallback is already active
        }
      },

      addToCart: async (productId, quantity = 1, selectedAttributes = {}) => {
        try {
          await cartApi.add({ productId, quantity, selectedAttributes });
          get().fetchCart();
        } catch (error: any) {
          toast.error('Failed to add to cart');
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newItems = get().items.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });

        try {
          await cartApi.update({ productId, quantity });
        } catch (e) {
          // Local update already succeeded
        }
      },

      removeItem: async (productId) => {
        const newItems = get().items.filter((item) => item.product._id !== productId);
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
        toast.success('Item removed from cart');

        try {
          await cartApi.remove(productId);
        } catch (e) {
          // Local remove already succeeded
        }
      },

      clearCart: () => {
        set({ cart: null, items: [], totalItems: 0, totalPrice: 0 });
        cartApi.clear().catch(() => {});
      },
    }),
    {
      name: 'ashashop_cart_storage',
    }
  )
);
