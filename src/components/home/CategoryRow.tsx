import React from 'react';
import { ArrowRight, Backpack, Headphones, Watch, Wallet, Gamepad2, Glasses, Luggage, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { useStore } from '../../context/StoreContext';

export const CategoryRow: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'backpack':
        return <Backpack className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'headphones':
        return <Headphones className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'watch':
        return <Watch className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'wallet':
        return <Wallet className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'gamepad-2':
        return <Gamepad2 className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'glasses':
        return <Glasses className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      case 'luggage':
        return <Luggage className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
      default:
        return <LayoutGrid className="w-7 h-7 text-[#201F1D] group-hover:text-[#205BE8] transition-colors" />;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
  };

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#201F1D] tracking-tight">Shop by Category</h2>
          <p className="text-xs text-[#777269] mt-0.5">Explore curated essentials by gear type</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setActiveTab('shop');
          }}
          className="text-xs sm:text-sm font-semibold text-[#205BE8] hover:text-[#174AC4] inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 8 Cards with soft neumorphic icon containers and warm surfaces */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="group bg-white border border-[#E7E1D7] hover:border-[#205BE8]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all shadow-warm hover:shadow-warm-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] cursor-pointer"
          >
            {/* Neumorphic Icon Container */}
            <div className="w-14 h-14 rounded-xl neu-flat-secondary group-hover:border-[#205BE8]/30 flex items-center justify-center mb-3 transition-all group-hover:scale-105">
              {getCategoryIcon(cat.iconName)}
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors truncate w-full">
              {cat.name}
            </h3>
            <span className="text-[11px] text-[#777269] mt-0.5 font-medium">{cat.itemCountText}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
