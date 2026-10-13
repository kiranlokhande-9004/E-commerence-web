import React from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, setActiveTab, toggleWishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Return to shop */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] hover:text-[#205BE8] mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shop</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold tracking-wider uppercase mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201F1D] tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#777269] mt-1">
            {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved for later consideration
          </p>
        </div>

        {savedProducts.length > 0 && (
          <button
            onClick={() => {
              wishlist.forEach((id) => toggleWishlist(id));
            }}
            className="text-xs font-bold text-[#777269] hover:text-rose-600 inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-[#E7E1D7] shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Saved</span>
          </button>
        )}
      </div>

      {/* Grid of Wishlist Items */}
      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E7E1D7] rounded-3xl p-12 text-center shadow-warm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#201F1D]">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-[#777269] mt-2 mb-6 leading-relaxed">
            Tap the heart icon on any product in our store to save it here for quick access and price tracking.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Discover Products</span>
          </button>
        </div>
      )}
    </div>
  );
};
