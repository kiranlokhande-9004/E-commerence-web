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
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#201F1D] tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-[#777269] mt-0.5">Explore curated tech & lifestyle essentials</p>
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

      {/* Grid: 8 Cards with soft raised surface */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="group bg-[#FFFFFF] border border-[#E7E1D7] hover:border-[#205BE8] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all shadow-warm hover:shadow-warm-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] cursor-pointer"
          >
            {/* Visual Icon Box with subtle neumorphic depth */}
            <div className="w-13 h-13 rounded-xl bg-[#F0EDE6] border border-[#E7E1D7]/70 group-hover:border-[#205BE8]/40 flex items-center justify-center mb-3 transition-colors shadow-2xs">
              {getCategoryIcon(cat.iconName)}
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors truncate w-full">
              {cat.name}
            </h3>
            <span className="text-[11px] text-[#777269] mt-0.5">{cat.itemCountText}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
