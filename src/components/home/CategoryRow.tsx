import React from 'react';
import { ArrowRight, Backpack, Headphones, Watch, Wallet, Gamepad2, Glasses, Luggage, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { useStore } from '../../context/StoreContext';

export const CategoryRow: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'backpack':
        return <Backpack className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'headphones':
        return <Headphones className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'watch':
        return <Watch className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'wallet':
        return <Wallet className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'gamepad-2':
        return <Gamepad2 className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'glasses':
        return <Glasses className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      case 'luggage':
        return <Luggage className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
      default:
        return <LayoutGrid className="w-8 h-8 text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors" />;
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1A17] tracking-tight">Shop by Category</h2>
          <p className="text-xs text-[#6B645A] mt-0.5">Explore by gear type</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setActiveTab('shop');
          }}
          className="text-xs sm:text-sm font-semibold text-[#1A56DB] hover:text-[#1646B0] inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 8 Cards with warm surface and shadow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="group bg-[#FFFEFB] border border-[#E3DDD2] hover:border-[#1A56DB] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all shadow-warm hover:shadow-warm-hover focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A56DB] cursor-pointer"
          >
            {/* Visual Icon Box */}
            <div className="w-14 h-14 rounded-xl bg-[#ECE8E0] group-hover:bg-[#E3DDD2]/70 flex items-center justify-center mb-3 transition-colors">
              {getCategoryIcon(cat.iconName)}
            </div>

            <h3 className="text-sm font-bold text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors truncate w-full">
              {cat.name}
            </h3>
            <span className="text-xs text-[#6B645A] mt-0.5">{cat.itemCountText}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
