import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        if (!items.find((i) => i._id === product._id)) {
          set({ items: [...items, product] });
          toast.success(`Đã thêm "${product.name}" vào danh sách yêu thích!`);
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i._id !== productId) });
        toast.success('Đã gỡ sản phẩm khỏi danh sách yêu thích');
      },
      toggleWishlist: (product) => {
        const { items, addItem, removeItem } = get();
        if (items.some((i) => i._id === product._id)) {
          removeItem(product._id);
        } else {
          addItem(product);
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((i) => i._id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'ashashop_wishlist_storage',
    },
  ),
);
