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
import { PRODUCTS } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

interface ProductSpinViewerProps {
  product: Product;
  onClose: () => void;
}

export const ProductSpinViewer: React.FC<ProductSpinViewerProps> = ({ product, onClose }) => {
  const { addToCart, setSelectedProduct } = useStore();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return ['/products/' + product.id + '.webp'];
  }, [product]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isOffScreenRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setSelectedSize(product.sizes?.[0]);
    setSelectedColor(product.colors?.[0]?.name);
    setQuantity(1);
    setCurrentIdx(0);
    setIsTransitioning(false);
  }, [product.id]);

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIdx + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex];
    }
  }, [currentIdx, images]);

  const catalogIdx = useMemo(() => PRODUCTS.findIndex((p) => p.id === product.id), [product.id]);
  const prevProduct = PRODUCTS[(catalogIdx - 1 + PRODUCTS.length) % PRODUCTS.length];
  const nextProduct = PRODUCTS[(catalogIdx + 1) % PRODUCTS.length];

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
      className="min-h-screen bg-[#F7F5F0] dark:bg-[#141210] py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200 transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="neu-button inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] dark:text-[#F3EFE8] hover:text-[#205BE8] dark:hover:text-[#3B82F6] bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] px-4 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          {/* Catalog switch arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProduct(prevProduct)}
              className="neu-button p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] hover:text-[#205BE8] transition-colors cursor-pointer"
              aria-label="Previous Product"
              title={`Previous: ${prevProduct.name}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-[#777269] dark:text-[#A59D91] tabular-nums">
              {catalogIdx + 1} / {PRODUCTS.length}
            </span>
            <button
              onClick={() => setSelectedProduct(nextProduct)}
              className="neu-button p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] hover:text-[#205BE8] transition-colors cursor-pointer"
              aria-label="Next Product"
              title={`Next: ${nextProduct.name}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage Panel with Soft Depth */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-3xl p-6 sm:p-10 shadow-warm relative overflow-hidden transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Product Story & Title */}
            <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#205BE8] dark:text-[#60A5FA] font-mono">
                  {product.brand} · {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] tracking-tight mt-1">
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
                          : 'text-[#E7E1D7] dark:text-[#332E28] fill-[#E7E1D7] dark:fill-[#332E28]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8]">{product.rating}</span>
                <span className="text-xs text-[#777269] dark:text-[#A59D91] font-mono tabular-nums">
                  ({product.reviewsCount} reviews)
                </span>
              </div>

              <p className="text-sm text-[#777269] dark:text-[#A59D91] leading-relaxed">
                {product.description}
              </p>

              {/* Key Highlights Bullet List */}
              {product.features && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#201F1D] dark:text-[#F3EFE8] mb-2">
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#777269] dark:text-[#A59D91]">
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-[#201F1D] dark:text-[#F3EFE8]">
                  In Stock ({product.stockCount} units available)
                </span>
              </div>
            </div>

            {/* Center Column: Product 3D Inspection Gallery */}
            <div
              className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 py-4"
              onMouseEnter={pauseAutoplay}
              onFocus={pauseAutoplay}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full max-w-[340px] relative flex flex-col items-center">
                {product.modelUrl && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0EDE6] dark:bg-[#221F1B] border border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] text-xs font-bold rounded-full shadow-2xs">
                      <Box className="w-3.5 h-3.5 text-[#205BE8]" /> 3D View
                    </span>
                  </div>
                )}

                <div
                  className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none"
                  style={{ perspective: 1000 }}
                >
                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseAutoplay();
                        handlePrev();
                      }}
                      className="absolute left-1 z-20 p-2.5 rounded-full bg-[#FFFFFF]/90 dark:bg-[#221F1B]/90 text-[#201F1D] dark:text-[#F3EFE8] shadow-warm border border-[#E7E1D7] dark:border-[#332E28] transition-all hover:scale-105 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
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
                      className="max-h-72 max-w-72 object-contain"
                    />
                  </div>

                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseAutoplay();
                        handleNext();
                      }}
                      className="absolute right-1 z-20 p-2.5 rounded-full bg-[#FFFFFF]/90 dark:bg-[#221F1B]/90 text-[#201F1D] dark:text-[#F3EFE8] shadow-warm border border-[#E7E1D7] dark:border-[#332E28] transition-all hover:scale-105 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#205BE8]"
                      aria-label="Next gallery image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Ground shadow beneath product */}
                <div
                  className="w-48 h-4 rounded-full mt-1 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(60, 40, 20, 0.22) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

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
                            : 'w-2 h-2 bg-[#E7E1D7] dark:bg-[#332E28] hover:bg-[#777269]'
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
              <div className="border-b border-[#E7E1D7] dark:border-[#332E28] pb-5">
                <span className="text-xs text-[#777269] dark:text-[#A59D91] font-semibold uppercase">Price</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] font-mono tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-[#777269] dark:text-[#A59D91] line-through font-mono tabular-nums">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#201F1D] dark:text-[#F3EFE8] mb-2">
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
                              : 'neu-button bg-[#FFFFFF] dark:bg-[#221F1B] border-[#E7E1D7] dark:border-[#332E28] text-[#201F1D] dark:text-[#F3EFE8] hover:border-[#205BE8]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#201F1D] dark:text-[#F3EFE8] mb-2">
                    Color: <span className="font-semibold text-[#777269] dark:text-[#A59D91]">{selectedColor}</span>
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
                              ? 'scale-110 ring-2 ring-[#205BE8] ring-offset-2 dark:ring-offset-[#1C1916]'
                              : 'hover:scale-105 border-[#E7E1D7] dark:border-[#332E28]'
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

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E7E1D7] dark:border-[#332E28] rounded-xl bg-[#F0EDE6]/50 dark:bg-[#221F1B]/60 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8] font-bold text-sm shadow-xs hover:bg-[#F0EDE6] flex items-center justify-center cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm font-mono tabular-nums text-[#201F1D] dark:text-[#F3EFE8]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1916] text-[#201F1D] dark:text-[#F3EFE8] font-bold text-sm shadow-xs hover:bg-[#F0EDE6] flex items-center justify-center cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-warm transition-all cursor-pointer ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-[#205BE8] hover:bg-[#174AC4] text-white active:scale-[0.98]'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5 animate-bounce" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart · ${(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#777269] dark:text-[#A59D91] text-center">
                  🚚 Free standard shipping & 30-day effortless returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
