import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Box,
  Check,
  Star,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

interface ProductSpinViewerProps {
  product: Product;
  onClose: () => void;
}

export const ProductSpinViewer: React.FC<ProductSpinViewerProps> = ({ product, onClose }) => {
  const { addToCart, setSelectedProduct, products } = useStore();

  // Selected options (if product has sizes or colors)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Images list
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return ['/products/' + product.id + '.webp'];
  }, [product]);

  // Gallery state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Interaction & Autoplay timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isOffScreenRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Reset gallery on product change
  useEffect(() => {
    setSelectedSize(product.sizes?.[0]);
    setSelectedColor(product.colors?.[0]?.name);
    setQuantity(1);
    setCurrentIdx(0);
    setIsTransitioning(false);
  }, [product.id]);

  // Preload next image
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIdx + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex];
    }
  }, [currentIdx, images]);

  // Catalog prev / next navigation
  const catalogList = products && products.length > 0 ? products : [product];
  const catalogIdx = useMemo(() => {
    const idx = catalogList.findIndex((p) => p.id === product.id);
    return idx >= 0 ? idx : 0;
  }, [catalogList, product.id]);
  const prevProduct = catalogList[(catalogIdx - 1 + catalogList.length) % catalogList.length];
  const nextProduct = catalogList[(catalogIdx + 1) % catalogList.length];

  // Image change handler with 3D turn transition
  const goToImage = useCallback(
    (newIdx: number, dir: 'next' | 'prev') => {
      if (images.length <= 1 || isTransitioning) return;
      setDirection(dir);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(newIdx);
        setIsTransitioning(false);
      }, 500);
    },
    [images.length, isTransitioning]
  );

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIdx + 1) % images.length;
    goToImage(nextIdx, 'next');
  }, [currentIdx, images.length, goToImage]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const prevIdx = (currentIdx - 1 + images.length) % images.length;
    goToImage(prevIdx, 'prev');
  }, [currentIdx, images.length, goToImage]);

  // Autoplay setup: starts after 4 seconds, loops every 4 seconds
  const startAutoplay = useCallback(() => {
    if (images.length <= 1 || prefersReducedMotion) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isOffScreenRef.current && document.visibilityState === 'visible') {
        handleNext();
      }
    }, 4000);
  }, [images.length, prefersReducedMotion, handleNext]);

  const pauseAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    if (!prefersReducedMotion && images.length > 1) {
      resumeTimerRef.current = setTimeout(() => {
        startAutoplay();
      }, 4000);
    }
  }, [prefersReducedMotion, images.length, startAutoplay]);

  // Initial autoplay trigger & visibility listener
  useEffect(() => {
    if (images.length > 1 && !prefersReducedMotion) {
      startAutoplay();
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        pauseAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        isOffScreenRef.current = !entry.isIntersecting;
        if (!entry.isIntersecting) {
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          pauseAutoplay();
        }
      });
      observer.observe(containerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [images.length, prefersReducedMotion, startAutoplay, pauseAutoplay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === 'ArrowRight') {
        pauseAutoplay();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        pauseAutoplay();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, pauseAutoplay, handleNext, handlePrev]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    pauseAutoplay();
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F7F5F0] py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] hover:text-[#205BE8] neu-button px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          {/* Catalog switch arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProduct(prevProduct)}
              className="p-2.5 rounded-xl neu-button text-[#201F1D] transition-colors cursor-pointer"
              aria-label="Previous Product"
              title={`Previous: ${prevProduct.name}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-[#777269] tabular-nums">
              {catalogIdx + 1} / {catalogList.length}
            </span>
            <button
              onClick={() => setSelectedProduct(nextProduct)}
              className="p-2.5 rounded-xl neu-button text-[#201F1D] transition-colors cursor-pointer"
              aria-label="Next Product"
              title={`Next: ${nextProduct.name}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage Panel */}
        <div className="bg-white border border-[#E7E1D7] rounded-3xl p-6 sm:p-10 shadow-warm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Product Story & Title */}
            <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#205BE8] font-mono">
                  {product.brand} · {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#201F1D] tracking-tight mt-1">
                  {product.name}
                </h1>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#E7E1D7] fill-[#E7E1D7]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#201F1D]">{product.rating}</span>
                <span className="text-xs text-[#777269] font-mono tabular-nums">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>

              <p className="text-sm text-[#777269] leading-relaxed">
                {product.description}
              </p>

              {/* Key Highlights Bullet List */}
              {product.features && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#201F1D] mb-2">
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#777269]">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#205BE8] font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="pt-2 flex items-center gap-2">
                {product.inStock && product.stockCount > 0 ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-800">
                      In Stock ({product.stockCount} units available)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-semibold text-rose-600">
                      Out of Stock (Currently Unavailable)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Center Column: Product Image Gallery */}
            <div
              className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-4"
              onMouseEnter={pauseAutoplay}
              onFocus={pauseAutoplay}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full max-w-[340px] relative flex flex-col items-center">
                {/* 3D badge */}
                {product.modelUrl && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0EDE6] border border-[#E7E1D7] text-[#201F1D] text-xs font-bold rounded-full">
                      <Box className="w-3.5 h-3.5 text-[#205BE8]" /> 3D View
                    </span>
                  </div>
                )}

                {/* Fixed Image Box */}
                <div
                  className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none"
                  style={{ perspective: 1000 }}
                >
                  {/* Left Gallery Arrow */}
                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseAutoplay();
                        handlePrev();
                      }}
                      className="absolute left-1 z-20 p-2 rounded-full glass-badge text-[#201F1D] transition-all hover:scale-105 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
                      aria-label="Previous gallery image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* 3D Turn Transition Image Panel */}
                  <div
                    className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isTransitioning
                        ? prefersReducedMotion
                          ? 'scale(0.98)'
                          : `rotateY(${direction === 'next' ? -80 : 80}deg)`
                        : 'rotateY(0deg)',
                      opacity: isTransitioning ? 0 : 1,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <AssetSlot
                      src={images[currentIdx]}
                      alt={`${product.name} view ${currentIdx + 1}`}
                      category={product.category}
                      aspectRatio="aspect-square"
                      className="max-h-72 max-w-72"
                    />
                  </div>

                  {/* Right Gallery Arrow */}
                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseAutoplay();
                        handleNext();
                      }}
                      className="absolute right-1 z-20 p-2 rounded-full glass-badge text-[#201F1D] transition-all hover:scale-105 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
                      aria-label="Next gallery image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Ground shadow under product */}
                <div
                  className="w-48 h-4 rounded-full mt-1 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(32, 31, 29, 0.16) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                {/* Gallery Dots Below */}
                {images.length > 1 && (
                  <div
                    className="flex items-center gap-2 mt-4"
                    role="tablist"
                    aria-label="Product image gallery thumbnails"
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          pauseAutoplay();
                          goToImage(i, i > currentIdx ? 'next' : 'prev');
                        }}
                        className={`transition-all rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8] ${
                          currentIdx === i
                            ? 'w-6 h-2 bg-[#205BE8]'
                            : 'w-2 h-2 bg-[#E7E1D7] hover:bg-[#777269]'
                        }`}
                        aria-label={`View image ${i + 1} of ${images.length}`}
                        aria-selected={currentIdx === i}
                        role="tab"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Pricing, Variant Selection & Purchase Module */}
            <div className="lg:col-span-4 space-y-6 order-3">
              {/* Pricing */}
              <div className="border-b border-[#E7E1D7] pb-5">
                <span className="text-xs text-[#777269] font-semibold uppercase">Price</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-[#201F1D] font-mono tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-[#777269] line-through font-mono tabular-nums">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#201F1D] mb-2">
                    Choose your size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-[48px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#205BE8] border-[#205BE8] text-white shadow-warm'
                              : 'neu-button text-[#201F1D] hover:border-[#205BE8]/50'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#201F1D] mb-2">
                    Color: <span className="font-semibold text-[#777269]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            isSelected
                              ? 'scale-110 ring-2 ring-[#205BE8] ring-offset-2'
                              : 'hover:scale-105 border-[#E7E1D7]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          aria-label={`Select color ${c.name}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add To Cart Button */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center neu-inset rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-[#201F1D] font-bold text-sm shadow-xs hover:bg-[#F0EDE6] flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm font-mono tabular-nums text-[#201F1D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-white text-[#201F1D] font-bold text-sm shadow-xs hover:bg-[#F0EDE6] flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Cart Primary Action */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stockCount <= 0}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-warm transition-all cursor-pointer ${
                      !product.inStock || product.stockCount <= 0
                        ? 'bg-[#E7E1D7] text-[#777269] cursor-not-allowed shadow-none'
                        : addedAnimation
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-[#205BE8] hover:bg-[#174AC4] text-white active:scale-[0.98]'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5 animate-bounce" />
                        <span>Added to Cart!</span>
                      </>
                    ) : !product.inStock || product.stockCount <= 0 ? (
                      <span>Out of Stock</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart · ${(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#777269] text-center">
                  🚚 Free standard shipping over $99 & 30-day effortless returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
