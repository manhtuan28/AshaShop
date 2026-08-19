export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  subcategories?: Category[];
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category | string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  attributes?: Record<string, any>;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  selectedAttributes?: Record<string, any>;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedAttributes?: Record<string, any>;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalPrice: number;
  shippingFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
