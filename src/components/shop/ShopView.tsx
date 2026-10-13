import React, { useMemo } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const ShopView: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useStore();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] tracking-tight">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-[#777269] dark:text-[#A59D91] mt-1">
            Showing {filteredProducts.length} of {PRODUCTS.length} curated essentials
          </p>
        </div>

        {/* Sort Controls with Soft Raised Container */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-xl px-3.5 py-2 shadow-xs text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#777269] dark:text-[#A59D91]" />
            <span className="font-bold text-[#201F1D] dark:text-[#F3EFE8]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-[#201F1D] dark:text-[#F3EFE8] focus:outline-hidden cursor-pointer"
            >
              <option value="featured" className="bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8]">Featured</option>
              <option value="price-asc" className="bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8]">Price: High to Low</option>
              <option value="rating" className="bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8]">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Buttons & Active Search Tag with Soft Neumorphism */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#205BE8] text-white shadow-warm'
              : 'neu-button bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#205BE8] text-white shadow-warm'
                  : 'neu-button bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {searchQuery && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#205BE8]/10 dark:bg-[#205BE8]/20 border border-[#205BE8]/30 rounded-xl text-xs text-[#205BE8] dark:text-[#60A5FA]">
            <span>Query: "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-[#174AC4] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-3xl p-12 text-center max-w-md mx-auto shadow-warm">
          <div className="w-14 h-14 rounded-2xl bg-[#F0EDE6] dark:bg-[#221F1B] text-[#777269] dark:text-[#A59D91] mx-auto flex items-center justify-center mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#201F1D] dark:text-[#F3EFE8]">No matching items found</h3>
          <p className="text-xs text-[#777269] dark:text-[#A59D91] mt-1 mb-4">
            Try adjusting your search criteria or resetting filters to browse all accessories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#205BE8] text-white rounded-xl text-xs font-bold shadow-warm hover:bg-[#174AC4] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
