import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, EyeOff, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveTab, isCatHidden, setIsCatHidden } = useStore();

  const trustFeatures = [
    {
      icon: <Truck className="w-6 h-6 text-[#1A56DB]" />,
      title: 'Free Shipping',
      subtitle: 'On orders over $99',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-emerald-600" />,
      title: 'Easy Returns',
      subtitle: '30-day return policy',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: 'Secure Checkout',
      subtitle: '100% secure payment',
    },
    {
      icon: <Headphones className="w-6 h-6 text-amber-600" />,
      title: '24/7 Support',
      subtitle: "We're here to help",
    },
  ];

  return (
    <footer className="bg-[#FFFEFB] border-t border-[#E3DDD2] mt-8">
      {/* Trust Strip */}
      <div className="border-b border-[#E3DDD2] bg-[#ECE8E0]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFFEFB] shadow-warm border border-[#E3DDD2] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1A17]">{item.title}</h4>
                  <p className="text-xs text-[#6B645A]">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center text-white font-bold text-base shadow-sm">
                B
              </div>
              <span className="text-xl font-extrabold text-[#1C1A17] font-['Plus_Jakarta_Sans']">
                Bomato
              </span>
            </div>
            <p className="text-sm text-[#6B645A] max-w-sm leading-relaxed">
              Curated everyday technology, high-fidelity audio, precision smartwatches, and durable lifestyle accessories crafted for work, travel, and play.
            </p>
            {/* Interactive feature: Hide/Show Walking Cat toggle */}
            <div className="pt-2">
              <button
                onClick={() => setIsCatHidden(!isCatHidden)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1C1A17] bg-[#ECE8E0] hover:bg-[#E3DDD2] border border-[#E3DDD2] rounded-lg transition-colors cursor-pointer"
                title="Toggle 3D mascot on page"
              >
                {isCatHidden ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#1A56DB]" /> Show 3D Mascot Cat
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-[#6B645A]" /> Hide 3D Mascot Cat
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1C1A17] mb-3">Shop</h5>
            <ul className="space-y-2 text-sm text-[#6B645A]">
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#1A56DB] cursor-pointer">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-[#1A56DB] cursor-pointer">
                  Browse Categories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('deals')} className="hover:text-[#1A56DB] cursor-pointer">
                  Deals & Discounts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('new-arrivals')} className="hover:text-[#1A56DB] cursor-pointer">
                  New Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1C1A17] mb-3">Customer Service</h5>
            <ul className="space-y-2 text-sm text-[#6B645A]">
              <li>
                <button onClick={() => setActiveTab('orders')} className="hover:text-[#1A56DB] cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1A56DB] cursor-pointer">
                  Shipping Rates & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1A56DB] cursor-pointer">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1A56DB] cursor-pointer">
                  Warranty & Repairs
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1C1A17] mb-3">Company</h5>
            <ul className="space-y-2 text-sm text-[#6B645A]">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1A56DB] cursor-pointer">
                  About Bomato
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('privacy')} className="hover:text-[#1A56DB] cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-[#1A56DB] cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-[#E3DDD2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B645A] gap-4">
          <p>© {new Date().getFullYear()} Bomato Essentials Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Encrypted 256-Bit SSL Checkout</span>
            <span>·</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
