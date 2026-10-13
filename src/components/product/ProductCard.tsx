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
      className="group bg-white border border-[#E7E1D7] hover:border-[#205BE8]/50 rounded-2xl p-4 flex flex-col justify-between shadow-warm hover:shadow-warm-hover cursor-pointer relative transition-all"
      role="article"
      aria-label={`${product.brand} ${product.name}`}
    >
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.badge && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                product.badge.startsWith('-') || product.badge.toLowerCase().includes('off')
                  ? 'bg-rose-500 text-white'
                  : 'bg-[#205BE8] text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.modelUrl && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#F0EDE6] text-[#201F1D] border border-[#E7E1D7] inline-flex items-center gap-0.5">
              <Box className="w-2.5 h-2.5 inline text-[#205BE8]" /> 3D
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isFavorite
              ? 'text-rose-500 bg-rose-50 shadow-xs'
              : 'text-[#777269] hover:text-rose-500 hover:bg-[#F0EDE6]'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Slot: consistent square frame with soft surface */}
      <div className="my-2 w-full aspect-square bg-[#F0EDE6]/50 rounded-xl p-3 flex items-center justify-center overflow-hidden border border-[#E7E1D7]/50 relative">
        <AssetSlot
          src={product.images?.[0] || product.image || ''}
          alt={product.name}
          category={product.category}
          aspectRatio="aspect-square"
          className="rounded-lg object-contain w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Meta Info */}
      <div className="mt-2 space-y-1">
        <p className="text-[11px] font-bold text-[#777269] uppercase tracking-wider">
          {product.brand}
        </p>

        <h3 className="text-sm font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[#E7E1D7] fill-[#E7E1D7]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[#777269] tabular-nums">
            ({product.reviewsCount.toLocaleString()})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-1.5">
          <span className="text-base font-extrabold text-[#201F1D] font-mono tabular-nums">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#777269] line-through font-mono tabular-nums">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Add To Cart Primary Button */}
      <div className="mt-4 pt-1">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-warm ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-[#205BE8] hover:bg-[#174AC4] text-white active:scale-[0.98]'
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
