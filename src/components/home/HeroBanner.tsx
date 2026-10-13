import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Volume2,
  Headphones,
  BatteryCharging,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { AssetSlot } from '../common/AssetSlot';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setSelectedProduct, setSelectedCategory } = useStore();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Sony WH-1000XM5 flagship headphones from catalog
  const flagshipProduct =
    PRODUCTS.find((p) => p.id === 'wh-1000xm5-headphones') || PRODUCTS[0];
  const airpodsProduct =
    PRODUCTS.find((p) => p.id === 'airpods-pro-2') || PRODUCTS[0];
  const speakerProduct =
    PRODUCTS.find((p) => p.id === 'go-3-speaker') || PRODUCTS[4];
  const accessoriesProduct =
    PRODUCTS.find((p) => p.id === '737-power-bank') || PRODUCTS[6];

  const handleOpenFlagship = () => {
    if (flagshipProduct) {
      setSelectedProduct(flagshipProduct);
    } else {
      setActiveTab('shop');
    }
  };

  const handleCategoryNav = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
  };

  return (
    <section className="relative overflow-hidden bg-[#F2EFE9] border border-[#E7E1D7] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-warm mb-10 transition-all">
      {/* Top Main Hero Row: Two Column Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Left Typography & Value Proposition Column */}
        <div className="lg:col-span-5 space-y-6 z-20">
          {/* Brand Label */}
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-white/90 border border-[#E7E1D7] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xs inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#205BE8] animate-pulse" />
              <span className="text-[#205BE8]">BOLT 2.0</span>
              <span className="text-[#E7E1D7]">|</span>
              <span className="text-[#201F1D]">SOUND & TECH</span>
            </span>
            <span className="w-8 h-[1.5px] bg-[#777269]/40 inline-block hidden sm:inline-block" />
          </div>

          {/* Main Heading & Supporting Headline */}
          <div className="space-y-2.5">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-black text-[#201F1D] tracking-tight leading-[1.05]">
              Sound That <br />
              <span className="text-[#205BE8] relative inline-block">
                Moves You.
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#205BE8]/20 rounded-full hidden sm:block" />
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-[#201F1D] tracking-tight">
              Premium Tech. Built for Everyday Life.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#777269] max-w-md leading-relaxed">
            Discover immersive audio, smart wearables, and everyday tech essentials designed to keep you connected, comfortable, and ready for anything.
          </p>

          {/* CTA Action Buttons & Trust Indicators */}
          <div className="space-y-3.5 pt-1">
            <div className="flex flex-wrap items-center gap-3.5">
              {/* Primary CTA */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveTab('shop');
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#201F1D] hover:bg-[#205BE8] text-white font-bold text-sm rounded-full shadow-warm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-[#201F1D] bg-white/80 hover:bg-white border border-[#E7E1D7] hover:border-[#205BE8]/40 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                title="Discover BOLT 2.0"
              >
                <span>Discover BOLT</span>
                <ArrowRight className="w-4 h-4 text-[#777269]" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-medium text-[#777269] pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#205BE8]" /> 2-Year Official Warranty
              </span>
              <span className="w-1 h-1 rounded-full bg-[#777269]/40 hidden sm:inline-block" />
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#205BE8]" /> Free Express Delivery on Orders Over $99
              </span>
            </div>
          </div>

          {/* Product Highlights Strip */}
          <div className="pt-6 border-t border-[#E7E1D7]/80 flex flex-wrap items-center gap-5 sm:gap-7 text-xs text-[#201F1D]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-[#E7E1D7] flex items-center justify-center text-[#205BE8] shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-[#201F1D]">Hi-Res Audio</span>
                <span className="text-[11px] text-[#777269]">Experience every detail</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-[#E7E1D7] flex items-center justify-center text-[#205BE8] shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-[#201F1D]">Adaptive Noise Cancelling</span>
                <span className="text-[11px] text-[#777269]">Focus on what matters</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-[#E7E1D7] flex items-center justify-center text-[#205BE8] shrink-0">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-[#201F1D]">Up to 50 Hours</span>
                <span className="text-[11px] text-[#777269]">Power through your day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Product Stage: Flagship Headphones & Architectural Backdrop */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
          {/* Architectural Curved Backdrop: Sage/Stone Arch Disk */}
          <div
            className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-[#DCE4D8] via-[#E2DDD3] to-[#ECE7DD] shadow-inner pointer-events-none"
            aria-hidden="true"
          />

          {/* Delicate Handwritten Annotation */}
          <div className="absolute top-6 left-2 sm:left-8 z-20 max-w-[140px] text-left pointer-events-none hidden sm:block">
            <p className="text-xs font-semibold text-[#777269] leading-snug">
              Crafted for a quieter, better you.
            </p>
            {/* Sketched pointer curve */}
            <svg
              className="w-12 h-8 text-[#777269]/60 mt-1"
              viewBox="0 0 50 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5C15 25 35 22 45 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
              <path
                d="M40 12L45 15L43 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Central Flagship Headphone Image */}
          <div
            onClick={handleOpenFlagship}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] cursor-pointer group select-none transition-transform duration-500 hover:scale-[1.02]"
            title="Click to view WH-1000XM5 details"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/products/wh-1000xm5.webp"
                alt="BOLT 2.0 Flagship Noise-Cancelling Headphones"
                className="w-full h-auto max-h-[340px] sm:max-h-[400px] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:-translate-y-2"
              />
            </div>

            {/* Grounded Dark Textured Slate Stone Pedestal */}
            <div
              className="w-4/5 h-10 mx-auto rounded-[100%] mt-[-18px] pointer-events-none shadow-2xl"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(32, 31, 29, 0.45) 0%, rgba(32, 31, 29, 0.15) 55%, transparent 75%)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Right Floating Atmospheric Card: "Escape the Noise" */}
          <div
            onClick={handleOpenFlagship}
            className="hidden sm:block absolute right-0 sm:right-2 top-8 sm:top-14 z-20 w-[140px] sm:w-[170px] bg-[#201F1D] text-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-white/10 cursor-pointer group transition-all hover:scale-105 select-none"
          >
            {/* Mountain / Acoustic Atmosphere Graphic */}
            <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden mb-2.5 sm:mb-3 relative bg-gradient-to-b from-[#38332E] to-[#1F1B17]">
              {/* Atmospheric soundscape art */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-12 text-[#205BE8] opacity-60 group-hover:scale-110 transition-transform"
                  viewBox="0 0 64 32"
                  fill="none"
                >
                  <path
                    d="M2 28L18 8L30 20L44 4L62 28H2Z"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                  <path
                    d="M12 28L26 12L38 24L52 10L62 28H12Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#205BE8] transition-colors leading-tight">
                Escape the Noise
              </h3>
              <p className="text-[10px] text-white/70 leading-tight line-clamp-2">
                Discover a calmer, clearer you.
              </p>
            </div>

            <div className="mt-2.5 sm:mt-3 flex justify-end">
              <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#205BE8] text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dock Shelf: 4 Rounded Category & Gear Tiles (Exact Reference Match) */}
      <div className="mt-8 pt-6 border-t border-[#E7E1D7]/70">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Over-Ear Headphones (Dark Card) */}
          <div
            onClick={handleOpenFlagship}
            className="group bg-[#201F1D] text-white rounded-2xl p-2.5 sm:p-4 flex items-center justify-between shadow-md cursor-pointer transition-all hover:scale-[1.02] border border-[#2E2C29]"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/wh-1000xm5.webp"
                  alt="Over-Ear Headphones"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-[#205BE8] transition-colors truncate">
                  Over-Ear
                </span>
                <span className="block text-[10px] sm:text-[11px] text-white/60 truncate">
                  Headphones
                </span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-[#205BE8] text-white flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 transition-colors">
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>

          {/* Card 2: True Wireless Earbuds (Light Card) */}
          <div
            onClick={() => {
              if (airpodsProduct) setSelectedProduct(airpodsProduct);
              else handleCategoryNav('headphones');
            }}
            className="group bg-white text-[#201F1D] rounded-2xl p-2.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer transition-all hover:scale-[1.02] border border-[#E7E1D7]"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-[#F0EDE6]/60 border border-[#E7E1D7] p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/airpods-pro-2.webp"
                  alt="True Wireless Earbuds"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors truncate">
                  True Wireless
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#777269] truncate">
                  Earbuds
                </span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F0EDE6] group-hover:bg-[#205BE8] group-hover:text-white text-[#201F1D] flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 transition-colors">
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>

          {/* Card 3: Bluetooth Speakers (Dark Card) */}
          <div
            onClick={() => {
              if (speakerProduct) setSelectedProduct(speakerProduct);
              else handleCategoryNav('accessories');
            }}
            className="group bg-[#201F1D] text-white rounded-2xl p-2.5 sm:p-4 flex items-center justify-between shadow-md cursor-pointer transition-all hover:scale-[1.02] border border-[#2E2C29]"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/go-3-speaker.webp"
                  alt="Bluetooth Speakers"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-[#205BE8] transition-colors truncate">
                  Bluetooth
                </span>
                <span className="block text-[10px] sm:text-[11px] text-white/60 truncate">
                  Speakers
                </span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-[#205BE8] text-white flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 transition-colors">
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>

          {/* Card 4: Audio Accessories (Light Card) */}
          <div
            onClick={() => {
              if (accessoriesProduct) setSelectedProduct(accessoriesProduct);
              else handleCategoryNav('accessories');
            }}
            className="group bg-white text-[#201F1D] rounded-2xl p-2.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer transition-all hover:scale-[1.02] border border-[#E7E1D7]"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-[#F0EDE6]/60 border border-[#E7E1D7] p-1 flex items-center justify-center shrink-0">
                <img
                  src="/products/737-powerbank.webp"
                  alt="Audio Accessories"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-[#201F1D] group-hover:text-[#205BE8] transition-colors truncate">
                  Audio & Tech
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#777269] truncate">
                  Accessories
                </span>
              </div>
            </div>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F0EDE6] group-hover:bg-[#205BE8] group-hover:text-white text-[#201F1D] flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 transition-colors">
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
