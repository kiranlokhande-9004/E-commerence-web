import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Backpack, Headphones, Watch, Wallet, Gamepad2, Glasses, Luggage, LayoutGrid } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';
import { AssetSlot } from '../common/AssetSlot';

export const CategoriesView: React.FC = () => {
  const { setActiveTab, setSelectedCategory, products } = useStore();

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      map[cat.id] = 0;
    });
    products.forEach((prod) => {
      const catKey = (prod.category || '').toLowerCase();
      if (map[catKey] !== undefined) {
        map[catKey] += 1;
      }
    });
    return map;
  }, [products]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'backpack':
        return <Backpack className="w-5 h-5 text-[#205BE8]" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-[#205BE8]" />;
      case 'watch':
        return <Watch className="w-5 h-5 text-[#205BE8]" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-[#205BE8]" />;
      case 'gamepad-2':
        return <Gamepad2 className="w-5 h-5 text-[#205BE8]" />;
      case 'glasses':
        return <Glasses className="w-5 h-5 text-[#205BE8]" />;
      case 'luggage':
        return <Luggage className="w-5 h-5 text-[#205BE8]" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-[#205BE8]" />;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Return to home button */}
      <button
        onClick={() => setActiveTab('home')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] hover:text-[#205BE8] mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Title & subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#201F1D] tracking-tight">
          Explore Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#777269] mt-1.5 max-w-xl leading-relaxed">
          Select any department below to view our curated selection of high-fidelity gear, everyday carry packs, and workspace tech.
        </p>
      </div>

      {/* Grid of the 8 categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const count = countsByCategory[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group bg-white border border-[#E7E1D7] hover:border-[#205BE8]/50 rounded-2xl p-5 flex flex-col justify-between text-left transition-all shadow-warm hover:shadow-warm-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] cursor-pointer"
            >
              {/* Image Frame with Category Icon Badge */}
              <div className="w-full aspect-square bg-[#F0EDE6]/60 rounded-xl overflow-hidden mb-4 p-3 flex items-center justify-center relative border border-[#E7E1D7]/50">
                <AssetSlot
                  src={cat.image || '/products/classic-backpack.webp'}
                  alt={`${cat.name} category preview`}
                  category={cat.id}
                  aspectRatio="aspect-square"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Icon Badge (soft glassmorphism) */}
                <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl glass-badge flex items-center justify-center shadow-xs">
                  {getCategoryIcon(cat.iconName)}
                </div>
              </div>

              {/* Title & Count */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors">
                    {cat.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-[#777269] group-hover:text-[#205BE8] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-[#777269] mt-1 font-medium">
                  {count} {count === 1 ? 'item available' : 'items available'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
