import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Backpack, Headphones, Watch, Wallet, Gamepad2, Glasses, Luggage, LayoutGrid } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { AssetSlot } from '../common/AssetSlot';

export const CategoriesView: React.FC = () => {
  const { setActiveTab, setSelectedCategory } = useStore();

  // Compute exact product counts dynamically from actual PRODUCTS catalog
  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      map[cat.id] = 0;
    });
    PRODUCTS.forEach((prod) => {
      if (map[prod.category] !== undefined) {
        map[prod.category] += 1;
      }
    });
    return map;
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'backpack':
        return <Backpack className="w-5 h-5 text-[#1A56DB]" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-[#1A56DB]" />;
      case 'watch':
        return <Watch className="w-5 h-5 text-[#1A56DB]" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-[#1A56DB]" />;
      case 'gamepad-2':
        return <Gamepad2 className="w-5 h-5 text-[#1A56DB]" />;
      case 'glasses':
        return <Glasses className="w-5 h-5 text-[#1A56DB]" />;
      case 'luggage':
        return <Luggage className="w-5 h-5 text-[#1A56DB]" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-[#1A56DB]" />;
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
        className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1A17] hover:text-[#1A56DB] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Title & subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1C1A17] tracking-tight">
          Explore Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645A] mt-1.5 max-w-xl leading-relaxed">
          Select any department below to view our curated selection of high-fidelity gear, everyday carry packs, and workspace tech.
        </p>
      </div>

      {/* Grid of the 8 categories with real photo, count, and click action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const count = countsByCategory[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group bg-[#FFFEFB] border border-[#E3DDD2] hover:border-[#1A56DB] rounded-2xl p-5 flex flex-col justify-between text-left transition-all shadow-warm hover:shadow-warm-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A56DB] cursor-pointer"
            >
              {/* Image Frame */}
              <div className="w-full aspect-square bg-[#ECE8E0] rounded-xl overflow-hidden mb-4 p-3 flex items-center justify-center relative">
                <AssetSlot
                  src={cat.image || '/products/classic-backpack.webp'}
                  alt={`${cat.name} category preview`}
                  category={cat.id}
                  aspectRatio="aspect-square"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Icon Badge */}
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-[#FFFEFB]/90 backdrop-blur-xs border border-[#E3DDD2] flex items-center justify-center shadow-2xs">
                  {getCategoryIcon(cat.iconName)}
                </div>
              </div>

              {/* Title & Count */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors">
                    {cat.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-[#6B645A] group-hover:text-[#1A56DB] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-[#6B645A] mt-1 font-medium">
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
