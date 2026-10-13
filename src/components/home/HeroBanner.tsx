import React from 'react';
import { ArrowRight, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

// SAMPLE - replace with real data
const HERO_SOCIAL_PROOF = {
  customerCountText: '25K+ Happy Customers',
  ratingText: '4.9/5',
  reviewsText: '(2.5K Reviews)',
};

export const HeroBanner: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#ECE8E0] border border-[#E3DDD2] rounded-[24px] p-6 sm:p-10 shadow-warm mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFEFB] border border-[#E3DDD2] text-[#1A56DB] text-xs font-bold tracking-wider uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Collection 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1C1A17] tracking-tight leading-[1.12]">
            Elevate Your Everyday <span className="text-[#1A56DB]">Accessories</span>
          </h1>

          <p className="text-base text-[#6B645A] max-w-lg leading-relaxed">
            Premium tech accessories engineered for modern work, travel, and seamless lifestyle integration. Precision materials built to endure.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A56DB] hover:bg-[#1646B0] text-white font-semibold rounded-xl shadow-warm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFFEFB] hover:bg-[#F5F2EC] text-[#1C1A17] border border-[#E3DDD2] font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Explore Deals
            </button>
          </div>

          {/* Social Proof Row (Config driven) */}
          <div className="pt-4 border-t border-[#E3DDD2] flex items-center gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-[#1C1A17] ml-1">
                  {HERO_SOCIAL_PROOF.ratingText}
                </span>
                <span className="text-xs text-[#6B645A]">
                  {HERO_SOCIAL_PROOF.reviewsText}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1C1A17] mt-0.5">
                {HERO_SOCIAL_PROOF.customerCountText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Showcase Column with soft white light spot & ground shadow */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Soft neutral white light spot behind hero photo (never colored) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-md bg-[#FFFEFB] border border-[#E3DDD2] rounded-2xl p-4 sm:p-6 shadow-warm flex items-center justify-center min-h-[320px]">
            {/* Round Badge: Up to 50% OFF */}
            <div className="absolute top-4 right-4 z-20 w-16 h-16 rounded-full bg-[#1A56DB] text-white flex flex-col items-center justify-center shadow-warm">
              <span className="text-[10px] font-bold uppercase tracking-tight">Up to</span>
              <span className="text-base font-extrabold leading-none">50%</span>
              <span className="text-[9px] font-semibold">OFF</span>
            </div>

            {/* Showcase asset slot */}
            <div className="w-full relative">
              <div className="rounded-xl overflow-hidden">
                <AssetSlot
                  src="/hero/showcase-hero.webp"
                  alt="Bomato Everyday Accessories Showcase"
                  aspectRatio="aspect-4/3"
                  category="accessories"
                  className="rounded-xl object-cover"
                />
              </div>

              {/* Soft ellipse ground shadow under the photo */}
              <div
                className="w-4/5 h-6 mx-auto rounded-full mt-2 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(60, 40, 20, 0.18) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
