import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check, Box } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]?.name);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-[#FFFEFB] border border-[#E3DDD2] hover:border-[#1A56DB] rounded-2xl p-4 flex flex-col justify-between shadow-warm hover:shadow-warm-hover cursor-pointer relative"
      role="article"
      aria-label={`${product.brand} ${product.name}`}
    >
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          {product.badge && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                product.badge.startsWith('-')
                  ? 'bg-red-500 text-white'
                  : 'bg-[#1A56DB] text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.modelUrl && (
            <span className="ml-1.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#ECE8E0] text-[#1C1A17] border border-[#E3DDD2] inline-flex items-center gap-0.5">
              <Box className="w-2.5 h-2.5 inline" /> 3D
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isFavorite
              ? 'text-red-500 bg-red-50'
              : 'text-[#6B645A] hover:text-red-500 hover:bg-[#ECE8E0]'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Slot in rounded frame with consistent aspect ratio */}
      <div className="my-2 flex items-center justify-center min-h-[170px] bg-[#ECE8E0]/40 rounded-xl p-2 overflow-hidden">
        <AssetSlot
          src={product.images?.[0] || product.image || ''}
          alt={product.name}
          category={product.category}
          aspectRatio="aspect-square"
          className="rounded-lg object-cover"
        />
      </div>

      {/* Meta info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs font-medium text-[#6B645A] uppercase tracking-wider">
          {product.brand}
        </p>

        <h3 className="text-sm font-bold text-[#1C1A17] group-hover:text-[#1A56DB] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[#E3DDD2] fill-[#E3DDD2]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[#6B645A] tabular-nums">
            ({product.reviewsCount.toLocaleString()})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-extrabold text-[#1C1A17] font-mono tabular-nums">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#6B645A] line-through font-mono tabular-nums">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Add To Cart Primary Button */}
      <div className="mt-4 pt-1">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-warm'
              : 'bg-[#1A56DB] hover:bg-[#1646B0] text-white shadow-warm active:scale-[0.98]'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
