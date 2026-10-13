import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Order, Product, ShippingAddress, User } from '../types';
import { PRODUCTS } from '../data/products';
import { analytics } from '../services/analytics';

interface StoreContextType {
  // Navigation & Product
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  total: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & Orders
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  orders: Order[];
  lastOrder: Order | null;
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Order;

  // Cat 3D feature
  isCatHidden: boolean;
  setIsCatHidden: (hidden: boolean) => void;

  // Cookie Consent
  cookieConsent: 'granted' | 'denied' | null;
  setConsent: (granted: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tabs & Views
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Enforce Light Theme Only per design requirement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      localStorage.removeItem('bomato_theme');
    } catch {}
  }, []);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bomato_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [
        {
          product: PRODUCTS[0],
          quantity: 1,
        },
      ];
    } catch {
      return [
        {
          product: PRODUCTS[0],
          quantity: 1,
        },
      ];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bomato_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bomato_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bomato_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('bomato_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cat 3D toggle
  const [isCatHidden, setIsCatHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bomato_hide_cat') === 'true';
    } catch {
      return false;
    }
  });

  // Cookie Consent
  const [cookieConsent, setCookieConsentState] = useState<'granted' | 'denied' | null>(() => {
    try {
      const saved = localStorage.getItem('bomato_cookie_consent');
      return (saved as 'granted' | 'denied') || null;
    } catch {
      return null;
    }
  });

  // Sync cookie consent to analytics
  useEffect(() => {
    if (cookieConsent === 'granted') {
      analytics.setConsent(true);
    } else if (cookieConsent === 'denied') {
      analytics.setConsent(false);
    }
  }, [cookieConsent]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('bomato_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('bomato_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('bomato_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('bomato_user');
      }
    } catch {}
  }, [user]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('bomato_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Persist lastOrder
  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem('bomato_last_order', JSON.stringify(lastOrder));
      }
    } catch {}
  }, [lastOrder]);

  // Persist cat toggle
  useEffect(() => {
    try {
      localStorage.setItem('bomato_hide_cat', String(isCatHidden));
    } catch {}
  }, [isCatHidden]);

  // Handle URL hash navigation for clean browser history & direct links
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (!rawHash) {
        setActiveTabState('home');
        return;
      }
      if (rawHash.startsWith('product=')) {
        const prodId = rawHash.replace('product=', '');
        const found = PRODUCTS.find((p) => p.id === prodId);
        if (found) {
          setSelectedProductState(found);
          setActiveTabState('product-detail');
        } else {
          setActiveTabState('not-found');
        }
      } else if ([
        'home',
        'shop',
        'categories',
        'deals',
        'new-arrivals',
        'about',
        'wishlist',
        'checkout',
        'order-confirmation',
        'orders',
        'privacy',
        'terms',
      ].includes(rawHash)) {
        setActiveTabState(rawHash);
      } else {
        // Unknown route hash: route to not-found
        setActiveTabState('not-found');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.trackPageView(`/${tab}`, `Bomato - ${tab.toUpperCase()}`);
  };

  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      window.location.hash = `product=${product.id}`;
      setActiveTabState('product-detail');
      analytics.trackPageView(`/products/${product.id}`, product.name);
    } else {
      window.location.hash = '';
      setActiveTabState('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize, selectedColor }];
    });

    analytics.trackEvent('Ecommerce', 'add_to_cart', product.name, product.price * quantity);
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  const freeShippingThreshold = 99.0;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 9.99;
  const discount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discount + (subtotal > 0 ? shippingFee : 0));

  const applyPromoCode = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'SAVE10' || cleaned === 'BOMATO10') {
      setPromoCode(cleaned);
      setDiscountPercent(10);
      return true;
    }
    if (cleaned === 'WELCOME20') {
      setPromoCode(cleaned);
      setDiscountPercent(20);
      return true;
    }
    return false;
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // User auth
  const login = (name: string, email: string) => {
    setUser({ id: `usr_${Date.now()}`, name, email, role: 'customer' });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  // Order creation
  const createOrder = (shippingAddress: ShippingAddress, paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `BOM-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      shipping: shippingFee,
      tax: subtotal * 0.08,
      discount,
      total: Number((total + subtotal * 0.08).toFixed(2)),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      shippingAddress,
      trackingNumber: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const setConsent = (granted: boolean) => {
    const val = granted ? 'granted' : 'denied';
    setCookieConsentState(val);
    try {
      localStorage.setItem('bomato_cookie_consent', val);
    } catch {}
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        freeShippingThreshold,
        discount,
        promoCode,
        applyPromoCode,
        total,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        orders,
        lastOrder,
        createOrder,
        isCatHidden,
        setIsCatHidden,
        cookieConsent,
        setConsent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
