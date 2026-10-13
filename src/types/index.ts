export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  images: string[];
  image?: string;
  thumbnails?: string[];
  modelUrl?: string; // Optional 3D GLB model
  spinFrames?: string[]; // Optional 24-36 360-degree photo frames
  sizes?: string[]; // Shown ONLY if provided
  colors?: { name: string; hex: string }[]; // Shown ONLY if provided
  features?: string[];
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  itemCountText: string;
  iconName: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  shippingAddress: ShippingAddress;
  trackingNumber: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer';
}
