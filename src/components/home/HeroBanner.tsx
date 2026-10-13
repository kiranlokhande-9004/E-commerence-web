import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

const HERO_SOCIAL_PROOF = {
  customerCountText: '25K+ Happy Customers',
  ratingText: '4.9/5',
  reviewsText: '(2.5K Reviews)',
};

export const HeroBanner: React.FC = () => {
  const { setActiveTab } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt transform state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    // Check if device is desktop and prefers motion
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanTilt(!hasTouch && !prefersReducedMotion);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 6 degrees rotation with smooth proportional easing
      const rotateX = Number((((centerY - y) / centerY) * 6).toFixed(2));
      const rotateY = Number((((x - centerX) / centerX) * 6).toFixed(2));

      setTilt({ rotateX, rotateY });
    },
    [canTilt]
  );

  const handleMouseEnter = () => {
    if (canTilt) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section className="relative overflow-hidden bg-[#F0EDE6] dark:bg-[#1C1916] border border-[#E7E1D7] dark:border-[#332E28] rounded-[28px] p-6 sm:p-10 shadow-warm mb-8 transition-colors duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Subtle soft-neumorphic pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#221F1B] border border-[#E7E1D7] dark:border-[#332E28] text-[#205BE8] dark:text-[#60A5FA] text-xs font-bold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Collection 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] tracking-tight leading-[1.12]">
            Elevate Your Everyday <span className="text-[#205BE8] dark:text-[#3B82F6]">Accessories</span>
          </h1>

          <p className="text-base text-[#777269] dark:text-[#A59D91] max-w-lg leading-relaxed">
            Premium tech accessories engineered for modern work, travel, and seamless lifestyle integration. Precision materials built to endure.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#205BE8] hover:bg-[#174AC4] text-white font-semibold rounded-xl shadow-warm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className="neu-button inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFFFFF] dark:bg-[#221F1B] text-[#201F1D] dark:text-[#F3EFE8] border border-[#E7E1D7] dark:border-[#332E28] font-semibold rounded-xl cursor-pointer"
            >
              Explore Deals
            </button>
          </div>

          {/* Social Proof Row */}
          <div className="pt-4 border-t border-[#E7E1D7] dark:border-[#332E28] flex items-center gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-[#201F1D] dark:text-[#F3EFE8] ml-1">
                  {HERO_SOCIAL_PROOF.ratingText}
                </span>
                <span className="text-xs text-[#777269] dark:text-[#A59D91]">
                  {HERO_SOCIAL_PROOF.reviewsText}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#201F1D] dark:text-[#F3EFE8] mt-0.5">
                {HERO_SOCIAL_PROOF.customerCountText}
              </p>
            </div>
          </div>
        </div>

        {/* Right 3D Depth Showcase Column */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-md relative select-none"
            style={{
              perspective: '1200px',
            }}
          >
            {/* Deep Charcoal Card Container */}
            <div
              className="relative rounded-3xl p-6 sm:p-8 bg-[#181614] border border-[#2B2724] dark:border-[#38322B] shadow-2xl transition-transform duration-200 ease-out overflow-hidden"
              style={{
                transform: canTilt && isHovered
                  ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                  : 'rotateX(0deg) rotateY(0deg)',
                transformStyle: 'preserve-3d',
                boxShadow: isHovered
                  ? '0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 28px rgba(32, 91, 232, 0.18)'
                  : '0 16px 36px -8px rgba(0, 0, 0, 0.6), 0 0 16px rgba(32, 91, 232, 0.08)',
              }}
            >
              {/* 1. Subtle brand-blue radial glow behind the product */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 48%, rgba(32, 91, 232, 0.22) 0%, rgba(32, 91, 232, 0.06) 45%, transparent 72%)',
                }}
                aria-hidden="true"
              />

              {/* 2. Faint dot grid using CSS (opacity <= 8%) */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl opacity-[0.06]"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.75) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
                aria-hidden="true"
              />

              {/* 3. Delicate decorative concentric ring (opacity <= 8%) */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-blue-300 pointer-events-none opacity-[0.07]"
                aria-hidden="true"
              />

              {/* Floating Promotional Badge with Soft Glassmorphism */}
              <div
                className="absolute top-4 right-4 z-30 animate-hero-float"
                style={{
                  transform: canTilt && isHovered
                    ? `translateZ(24px)`
                    : 'none',
                }}
              >
                <div className="glass-badge rounded-2xl px-3.5 py-2 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#205BE8] dark:text-[#60A5FA]">
                    Up to
                  </span>
                  <span className="text-xl font-extrabold text-[#201F1D] dark:text-[#F3EFE8] leading-none">
                    50% OFF
                  </span>
                  <span className="text-[9px] font-semibold text-[#777269] dark:text-[#A59D91]">
                    Limited Run
                  </span>
                </div>
              </div>

              {/* Product Showcase Image Container with 3D Depth */}
              <div
                className="relative z-10 w-full flex flex-col items-center justify-center pt-2 pb-1"
                style={{
                  transform: canTilt && isHovered ? 'translateZ(18px)' : 'none',
                  transition: 'transform 200ms ease-out',
                }}
              >
                <div className="w-full rounded-2xl overflow-hidden shadow-inner">
                  <AssetSlot
                    src="/hero/showcase-hero.webp"
                    alt="Bomato Everyday Accessories Showcase"
                    aspectRatio="aspect-4/3"
                    category="accessories"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                {/* Glowing blue pedestal ring at the base of the product */}
                <div
                  className="w-3/4 h-3 rounded-full mt-3 pointer-events-none opacity-80"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, rgba(32, 91, 232, 0.45) 0%, rgba(32, 91, 232, 0.12) 50%, transparent 80%)',
                    filter: 'blur(1.5px)',
                  }}
                  aria-hidden="true"
                />

                {/* Ellipse-shaped grounded shadow beneath the product */}
                <div
                  className="w-4/5 h-5 mx-auto rounded-full mt-0.5 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 45%, transparent 75%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
