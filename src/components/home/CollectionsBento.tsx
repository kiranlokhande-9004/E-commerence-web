import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

export const CollectionsBento: React.FC = () => {
  const { setActiveTab, setSelectedCategory } = useStore();

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#201F1D] tracking-tight">
            Featured Collections
          </h2>
          <p className="text-xs text-[#777269] mt-0.5">Curated gear pairings for every pursuit</p>
        </div>
        <button
          onClick={() => setActiveTab('categories')}
          className="text-xs sm:text-sm font-semibold text-[#205BE8] hover:text-[#174AC4] inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 2 Warm Cards with Soft Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collection 1: Tech Essentials */}
        <div className="bg-[#FFFFFF] border border-[#E7E1D7] hover:border-[#205BE8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group shadow-warm hover:shadow-warm-hover transition-all duration-200">
          <div className="space-y-2 mb-4 z-10">
            <span className="text-[11px] font-bold text-[#205BE8] uppercase tracking-wider">
              Workspace & Studio
            </span>
            <h3 className="text-2xl font-extrabold text-[#201F1D]">Tech Essentials</h3>
            <p className="text-sm text-[#777269]">Smart tech for modern life and daily productivity</p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('gaming');
                  setActiveTab('shop');
                }}
                className="neu-button inline-flex items-center gap-2 text-xs font-bold text-[#205BE8] uppercase tracking-wider py-2.5 px-4 bg-[#F0EDE6] rounded-xl cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-[260px] bg-[#F0EDE6]/60 rounded-xl p-3 border border-[#E7E1D7]">
              <AssetSlot
                src="/collections/tech-essentials.webp"
                alt="Tech Essentials Collection"
                category="gaming"
                aspectRatio="aspect-4/3"
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        </div>

        {/* Collection 2: Travel Collection */}
        <div className="bg-[#FFFFFF] border border-[#E7E1D7] hover:border-[#205BE8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group shadow-warm hover:shadow-warm-hover transition-all duration-200">
          <div className="space-y-2 mb-4 z-10">
            <span className="text-[11px] font-bold text-[#205BE8] uppercase tracking-wider">
              Transit & Commute
            </span>
            <h3 className="text-2xl font-extrabold text-[#201F1D]">Travel Collection</h3>
            <p className="text-sm text-[#777269]">Built for the journey with weather-resistant durability</p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('backpacks');
                  setActiveTab('shop');
                }}
                className="neu-button inline-flex items-center gap-2 text-xs font-bold text-[#205BE8] uppercase tracking-wider py-2.5 px-4 bg-[#F0EDE6] rounded-xl cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-[260px] bg-[#F0EDE6]/60 rounded-xl p-3 border border-[#E7E1D7]">
              <AssetSlot
                src="/collections/travel-collection.webp"
                alt="Travel Collection"
                category="travel"
                aspectRatio="aspect-4/3"
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
