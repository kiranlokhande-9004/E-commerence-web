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
      return 0; // 'featured' retains natural catalog order
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1A17] tracking-tight">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645A] mt-1">
            Showing {filteredProducts.length} of {PRODUCTS.length} curated essentials
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FFFEFB] border border-[#E3DDD2] rounded-xl px-3 py-2 shadow-warm text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B645A]" />
            <span className="font-bold text-[#1C1A17]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-[#1C1A17] focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Active Search Tag */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#1A56DB] text-white shadow-warm'
              : 'bg-[#FFFEFB] border border-[#E3DDD2] text-[#1C1A17] hover:border-[#1A56DB]'
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
                  ? 'bg-[#1A56DB] text-white shadow-warm'
                  : 'bg-[#FFFEFB] border border-[#E3DDD2] text-[#1C1A17] hover:border-[#1A56DB]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {searchQuery && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A56DB]/10 border border-[#1A56DB]/30 rounded-xl text-xs text-[#1A56DB]">
            <span>Query: "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-[#1646B0] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-12 text-center max-w-md mx-auto shadow-warm">
          <div className="w-14 h-14 rounded-2xl bg-[#ECE8E0] text-[#6B645A] mx-auto flex items-center justify-center mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#1C1A17]">No matching items found</h3>
          <p className="text-xs text-[#6B645A] mt-1 mb-4">
            Try adjusting your search criteria or resetting filters to browse all accessories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold shadow-warm hover:bg-[#1646B0] cursor-pointer"
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
