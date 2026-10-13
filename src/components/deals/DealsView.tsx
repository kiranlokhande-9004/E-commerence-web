import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Zap, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, SALE_ENDS_AT } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const DealsView: React.FC = () => {
  const { setActiveTab } = useStore();

  const dealProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        (p.discountPercent && p.discountPercent > 0) ||
        (p.originalPrice && p.originalPrice > p.price)
    ).sort((a, b) => {
      const discA = a.discountPercent || (a.originalPrice ? Math.round(((a.originalPrice - a.price) / a.originalPrice) * 100) : 0);
      const discB = b.discountPercent || (b.originalPrice ? Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100) : 0);
      return discB - discA;
    });
  }, []);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(() => {
    if (!SALE_ENDS_AT) return null;
    const target = new Date(SALE_ENDS_AT).getTime();
    if (isNaN(target)) return null;
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  });

  useEffect(() => {
    if (!SALE_ENDS_AT) return;
    const target = new Date(SALE_ENDS_AT).getTime();
    if (isNaN(target)) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isExpired: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Return to shop */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#201F1D] hover:text-[#205BE8] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shop</span>
      </button>

      {/* Header and Countdown with Charcoal Band and Accent Contrast */}
      <div className="bg-[#181614] text-[#ECE8E0] rounded-3xl p-6 sm:p-8 mb-8 border border-[#2B2724] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Limited-Time Markdowns</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFFEFB] tracking-tight">
              Featured Deals & Discounts
            </h1>
            <p className="text-xs sm:text-sm text-[#ECE8E0]/70 max-w-xl leading-relaxed">
              Verified markdowns on our flagship audio, smart wearable gear, and daily carry collections. Filtered by highest savings first.
            </p>
          </div>

          {/* Countdown timer */}
          {timeLeft && !timeLeft.isExpired && (
            <div className="bg-[#24201C] border border-[#38312A] rounded-2xl p-4 shrink-0 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Sale Ends In</span>
              </div>
              <div className="flex items-center gap-2 text-center">
                <div className="bg-[#181614] rounded-lg px-2.5 py-1.5 min-w-[48px] border border-[#38312A]">
                  <span className="font-mono text-lg font-bold text-[#FFFEFB] tabular-nums">
                    {formatNumber(timeLeft.days)}
                  </span>
                  <span className="block text-[9px] text-[#ECE8E0]/60 uppercase">Days</span>
                </div>
                <span className="text-[#ECE8E0]/40 font-bold">:</span>
                <div className="bg-[#181614] rounded-lg px-2.5 py-1.5 min-w-[48px] border border-[#38312A]">
                  <span className="font-mono text-lg font-bold text-[#FFFEFB] tabular-nums">
                    {formatNumber(timeLeft.hours)}
                  </span>
                  <span className="block text-[9px] text-[#ECE8E0]/60 uppercase">Hours</span>
                </div>
                <span className="text-[#ECE8E0]/40 font-bold">:</span>
                <div className="bg-[#181614] rounded-lg px-2.5 py-1.5 min-w-[48px] border border-[#38312A]">
                  <span className="font-mono text-lg font-bold text-[#FFFEFB] tabular-nums">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                  <span className="block text-[9px] text-[#ECE8E0]/60 uppercase">Mins</span>
                </div>
                <span className="text-[#ECE8E0]/40 font-bold">:</span>
                <div className="bg-[#181614] rounded-lg px-2.5 py-1.5 min-w-[48px] border border-[#38312A]">
                  <span className="font-mono text-lg font-bold text-[#FFFEFB] tabular-nums">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                  <span className="block text-[9px] text-[#ECE8E0]/60 uppercase">Secs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product List */}
      {dealProducts.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-semibold text-[#777269]">
              Showing <span className="text-[#201F1D] font-bold">{dealProducts.length}</span> items with active promotional pricing
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E7E1D7] rounded-3xl p-12 text-center shadow-warm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] text-[#205BE8] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#201F1D]">No Active Deals Right Now</h2>
          <p className="text-xs sm:text-sm text-[#777269] mt-2 mb-6">
            All promotional inventory has currently concluded. Check back soon or explore our complete catalog.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl text-sm shadow-warm transition-all cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      )}
    </div>
  );
};
