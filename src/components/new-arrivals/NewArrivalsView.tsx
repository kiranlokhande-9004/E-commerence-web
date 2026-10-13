import React, { useMemo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const NewArrivalsView: React.FC = () => {
  const { setActiveTab } = useStore();

  // Filter products marked 'New' or recent additions, displayed newest first
  const newArrivals = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const badge = p.badge?.toLowerCase();
      return badge === 'new' || !p.discountPercent;
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Return to shop */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1A17] hover:text-[#1A56DB] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shop</span>
      </button>

      {/* Header */}
      <div className="bg-[#ECE8E0] rounded-3xl p-6 sm:p-8 mb-8 border border-[#E3DDD2] shadow-warm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFEFB] border border-[#E3DDD2] text-[#1A56DB] text-xs font-bold tracking-wider uppercase mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fresh Releases</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1C1A17] tracking-tight">
          New Arrivals Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645A] mt-2 max-w-xl leading-relaxed">
          The latest engineering breakthroughs in smart connectivity, tactile mechanical switches, and durable weather-resistant everyday carry.
        </p>
      </div>

      {/* Products Grid */}
      {newArrivals.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#6B645A]">
              Showing <span className="text-[#1C1A17] font-bold">{newArrivals.length}</span> newly released items
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-12 text-center shadow-warm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#ECE8E0] text-[#1A56DB] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1C1A17]">No New Releases Today</h2>
          <p className="text-xs sm:text-sm text-[#6B645A] mt-2 mb-6">
            We are curating our next batch of gear. Discover the full inventory in the main shop.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#1A56DB] hover:bg-[#1646B0] text-white font-bold rounded-xl text-sm shadow-warm transition-all cursor-pointer"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};
