import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryRow } from './components/home/CategoryRow';
import { FlashSaleBanner } from './components/home/FlashSaleBanner';
import { CollectionsBento } from './components/home/CollectionsBento';
import { ProductCard } from './components/product/ProductCard';
import { ProductSpinViewer } from './components/product/ProductSpinViewer';
import { ShopView } from './components/shop/ShopView';
import { CategoriesView } from './components/home/CategoriesView';
import { AboutView } from './components/home/AboutView';
import { DealsView } from './components/deals/DealsView';
import { NewArrivalsView } from './components/new-arrivals/NewArrivalsView';
import { WishlistView } from './components/wishlist/WishlistView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderConfirmationView } from './components/orders/OrderConfirmationView';
import { OrderHistoryView } from './components/orders/OrderHistoryView';
import { AuthModal } from './components/auth/AuthModal';
import { PrivacyPolicyView, TermsConditionsView } from './components/legal/LegalViews';
import { CookieBanner } from './components/common/CookieBanner';
import { NotFoundView } from './components/common/NotFoundView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PRODUCTS } from './data/products';

// Lazy load WalkingCat so first paint is never delayed
const WalkingCat = React.lazy(() => import('./components/cat/WalkingCat'));

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedProduct, setSelectedProduct } = useStore();

  // Dynamic meta title and description per page
  useEffect(() => {
    let title = 'BOLT 2.0 — Premium Electronics & High-Fidelity Audio';
    let desc =
      'Discover thoughtfully selected tech, flagship acoustics, and everyday essentials with interactive 3D inspection at BOLT 2.0.';

    if (activeTab === 'product-detail' && selectedProduct) {
      title = `${selectedProduct.name} by ${selectedProduct.brand} | BOLT 2.0`;
      desc = selectedProduct.description;
    } else if (activeTab === 'shop') {
      title = 'Shop All Products & Tech Essentials | BOLT 2.0';
      desc = 'Browse our complete catalog of audio gear, smartwatches, carry bags, and mechanical keyboards.';
    } else if (activeTab === 'categories') {
      title = 'Browse Categories | BOLT 2.0';
      desc = 'Find backpacks, headphones, watches, wallets, gaming gear, sunglasses, and travel accessories.';
    } else if (activeTab === 'deals') {
      title = 'Deals & Discounts | BOLT 2.0';
      desc = 'Exclusive limited-time price cuts and flash promotions on premium tech accessories.';
    } else if (activeTab === 'new-arrivals') {
      title = 'New Arrivals | BOLT 2.0';
      desc = 'Fresh releases in high-fidelity audio, mechanical keyboards, and travel backpacks.';
    } else if (activeTab === 'wishlist') {
      title = 'My Wishlist | BOLT 2.0';
      desc = 'Your saved tech gear and everyday accessories.';
    } else if (activeTab === 'checkout') {
      title = 'Secure Checkout | BOLT 2.0';
      desc = 'Complete your purchase with encrypted checkout and fast shipping.';
    } else if (activeTab === 'order-confirmation') {
      title = 'Order Confirmed | BOLT 2.0';
      desc = 'Your order details and real-time shipping tracking progress.';
    } else if (activeTab === 'orders') {
      title = 'My Orders & Tracking | BOLT 2.0';
      desc = 'Review past orders, invoices, and shipment tracking numbers.';
    } else if (activeTab === 'privacy') {
      title = 'Privacy Policy | BOLT 2.0';
      desc = 'How BOLT 2.0 collects and protects your customer data.';
    } else if (activeTab === 'terms') {
      title = 'Terms & Conditions | BOLT 2.0';
      desc = 'Customer terms of service and 30-day return policies.';
    } else if (activeTab === 'about') {
      title = 'About BOLT 2.0 | Everyday Tech Gear';
      desc = 'Our mission to build durable, elegant accessories designed for work, travel, and play.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [activeTab, selectedProduct]);

  // If a product is selected and activeTab is product-detail, render the Spin Viewer
  if (activeTab === 'product-detail' && selectedProduct) {
    return (
      <ProductSpinViewer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    );
  }

  // Routing switch
  switch (activeTab) {
    case 'shop':
      return <ShopView />;
    case 'categories':
      return <CategoriesView />;
    case 'deals':
      return <DealsView />;
    case 'new-arrivals':
      return <NewArrivalsView />;
    case 'wishlist':
      return <WishlistView />;
    case 'checkout':
      return <CheckoutView />;
    case 'order-confirmation':
      return <OrderConfirmationView />;
    case 'orders':
      return <OrderHistoryView />;
    case 'about':
      return <AboutView />;
    case 'privacy':
      return <PrivacyPolicyView />;
    case 'terms':
      return <TermsConditionsView />;
    case 'home':
      return (
        <div className="space-y-10 animate-in fade-in pb-12">
          {/* Hero Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <HeroBanner />
          </div>

          {/* Shop by Category */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryRow />
          </div>

          {/* Featured Products Section with rhythmic panel backdrop */}
          <div className="bg-[#F0EDE6]/80 py-12 border-y border-[#E7E1D7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#201F1D] tracking-tight">
                    Featured Products
                  </h2>
                  <p className="text-xs text-[#777269] mt-0.5">Top-rated accessories crafted for endurance</p>
                </div>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="text-xs sm:text-sm font-semibold text-[#205BE8] hover:text-[#174AC4] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {PRODUCTS.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Flash Sale Banner with Countdown */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FlashSaleBanner />
          </div>

          {/* Featured Collections Bento */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CollectionsBento />
          </div>

          {/* New Arrivals Section with rhythmic panel backdrop */}
          <div className="bg-[#F0EDE6]/80 py-12 border-y border-[#E7E1D7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#201F1D] tracking-tight">
                    New Arrivals
                  </h2>
                  <p className="text-xs text-[#777269] mt-0.5">Freshly released tech and lifestyle essentials</p>
                </div>
                <button
                  onClick={() => setActiveTab('new-arrivals')}
                  className="text-xs sm:text-sm font-semibold text-[#205BE8] hover:text-[#174AC4] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All New Arrivals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {PRODUCTS.slice(4, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return <NotFoundView />;
  }
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#201F1D] font-['Plus_Jakarta_Sans'] antialiased relative">
          {/* Static grain overlay */}
          <div className="grain-overlay" aria-hidden="true" />

          {/* Header */}
          <Header />

          {/* Main View Area */}
          <main className="flex-1 relative z-10">
            <MainContent />
          </main>

          {/* Footer */}
          <Footer />

          {/* Drawers & Modals */}
          <CartDrawer />
          <AuthModal />
          <CookieBanner />

          {/* 3D Mascot Cat along bottom edge */}
          <React.Suspense fallback={null}>
            <WalkingCat />
          </React.Suspense>
        </div>
      </StoreProvider>
    </ErrorBoundary>
  );
}
