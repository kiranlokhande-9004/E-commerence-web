import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AssetSlot } from '../common/AssetSlot';

export const FlashSaleBanner: React.FC = () => {
  const { setActiveTab } = useStore();

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    mins: 36,
    secs: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        }
        if (prev.mins > 0) {
          return { ...prev, mins: 59, secs: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="bg-[#201F1D] text-[#F7F5F0] rounded-[28px] p-6 sm:p-10 mb-10 relative overflow-hidden shadow-warm border border-[#2E2C29]">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Offer & Countdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Limited Flash Sale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Up to 70% OFF
          </h2>

          <p className="text-sm sm:text-base text-[#F7F5F0]/80 max-w-md leading-relaxed">
            Limited time offers on selected high-fidelity acoustic gear, tactical accessories, and smart wearables.
          </p>

          {/* Countdown timer blocks */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.mins, label: 'Mins' },
              { val: timeLeft.secs, label: 'Secs' },
            ].map((unit, i) => (
              <div
                key={i}
                className="bg-[#2E2C29] border border-[#3E3A35] rounded-xl px-3.5 py-2.5 text-center min-w-[64px]"
              >
                <span className="block font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {formatNumber(unit.val)}
                </span>
                <span className="block text-[10px] text-[#F7F5F0]/60 uppercase font-semibold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('deals')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#205BE8] hover:bg-[#174AC4] text-white font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer shadow-warm"
            >
              <span>Shop Flash Sale</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Graphic with Discount Badge */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Circular badge */}
          <div className="absolute top-2 right-4 z-20 w-16 h-16 rounded-full bg-[#205BE8] text-white flex flex-col items-center justify-center shadow-warm">
            <span className="text-[9px] font-bold uppercase tracking-tight">Up to</span>
            <span className="text-base font-extrabold leading-none">70%</span>
            <span className="text-[9px] font-semibold">OFF</span>
          </div>

          <div className="w-full max-w-xs bg-white/10 rounded-2xl p-4 border border-white/15">
            <AssetSlot
              src="/flash-sale/flash-headphones.webp"
              alt="Flash Sale Featured Headphone"
              category="headphones"
              aspectRatio="aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
