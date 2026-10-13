import React, { useMemo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const NewArrivalsView: React.FC = () => {
  const { setActiveTab, products } = useStore();

  const newArrivals = useMemo(() => {
    return products.filter((p) => {
      const badge = p.badge?.toLowerCase();
      return badge === 'new' || !p.discountPercent;
    });
  }, [products]);

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
      <div className="bg-[#F0EDE6] rounded-3xl p-6 sm:p-8 mb-8 border border-[#E7E1D7] shadow-warm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E1D7] text-[#205BE8] text-xs font-bold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fresh Releases</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#201F1D] tracking-tight">
          New Arrivals Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#777269] mt-2 max-w-xl leading-relaxed">
          The latest engineering breakthroughs in smart connectivity, tactile mechanical switches, and durable weather-resistant everyday carry.
        </p>
      </div>

      {/* Products Grid */}
      {newArrivals.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#777269]">
              Showing <span className="text-[#201F1D] font-bold">{newArrivals.length}</span> newly released items
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E1D7] rounded-3xl p-12 text-center shadow-warm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] text-[#205BE8] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#201F1D]">No New Releases Today</h2>
          <p className="text-xs sm:text-sm text-[#777269] mt-2 mb-6">
            We are curating our next batch of gear. Discover the full inventory in the main shop.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all cursor-pointer"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};
